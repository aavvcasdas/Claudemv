#!/usr/bin/env python3
"""align_lyrics.py — 歌词 × 音频自动对时工具

从 ReelMimic (edenfunf/reelmimic) 引入，免去手查 LRC 的步骤。
用法：
    python align_lyrics.py <音频> <歌词.txt> --out subs.lrc \
        [--start 100.8 --end 131.7] [--model medium] [--lang zh]

歌词文本由使用者提供（粘贴到 inputs/lyrics.txt）；此脚本只找每行**何时被唱**。
它不自己写词：语音识别只做时间尺，输出的每行都是使用者的原文。

原理：
    faster-whisper 转录音频（带逐词时间戳）
    → 双方文字做正规化（去标点/空格，简体→繁体如果有 OpenCC）
    → 用 difflib 对齐使用者的字和识别出的字
    → 每行取其第一个和最后一个匹配字的时间
    → 没匹配到的行用前后邻居插值

输出：
    subs.lrc        [mm:ss.xx] 行（时间相对于 --start，即片段时间）
    subs.json       逐行：start, end, text, matched ratio, 逐字时间（可做卡拉OK填充）
    并打印质量报告：匹配行数、平均匹配率。低匹配率表示「建议用耳朵复核」。

依赖：
    pip install faster-whisper
    （可选）pip install opencc  # 简繁转换，提高中文匹配率
"""
import argparse, difflib, json, os, re, shutil, subprocess, sys, tempfile

FFMPEG_FALLBACK = os.environ.get("FFMPEG_DIR", "")
if not shutil.which("ffmpeg") and FFMPEG_FALLBACK and os.path.isdir(FFMPEG_FALLBACK):
    os.environ["PATH"] += os.pathsep + FFMPEG_FALLBACK

try:
    from opencc import OpenCC
    _s2t = OpenCC("s2t").convert
except Exception:
    _s2t = lambda s: s

KEEP = re.compile(r"[\w\u3400-\u9fff]", re.UNICODE)


def norm_chars(s):
    """文字正规化：小写 + 只保留字/数字"""
    return [c.lower() for c in _s2t(s) if KEEP.match(c)]


def transcribe(wav, model_name, lang):
    """用 faster-whisper 转录，返回 [(char, t_start, t_end), ...]"""
    from faster_whisper import WhisperModel
    try:
        m = WhisperModel(model_name, device="cuda", compute_type="float16")
    except Exception:
        m = WhisperModel(model_name, device="cpu", compute_type="int8")
    segs, _ = m.transcribe(
        wav, language=lang, word_timestamps=True, vad_filter=True,
        vad_parameters={"min_silence_duration_ms": 300, "speech_pad_ms": 60},
        beam_size=5, condition_on_previous_text=False)
    chars = []
    for sg in segs:
        for w in (sg.words or []):
            cs = norm_chars(w.word)
            if not cs: continue
            d = (w.end - w.start) / len(cs)
            for k, c in enumerate(cs):
                chars.append((c, w.start + k * d, w.start + (k + 1) * d))
    return chars


# LRC 格式解析
LRC_TIME = re.compile(r"^(\[\d+:\d+(?:[.:]\d+)?\])+")
LRC_WORD = re.compile(r"<\d+:\d+(?:[.:]\d+)?>")


def lyric_lines(text):
    """解析歌词文本：纯文本（每行一句）或 LRC 格式"""
    out, repeated = [], False
    for l in text.splitlines():
        l = l.strip()
        m = LRC_TIME.match(l)
        t = LRC_WORD.sub("", l[m.end():] if m else l).strip()
        if not t or t.startswith("["): continue
        stamps = (re.findall(r"\[(\d+):(\d+)(?:[.:](\d+))?\]", m.group(0))
                  if m else [])
        repeated |= len(stamps) > 1
        out += [(int(mm) * 60 + int(ss) + float("0." + (ff or "0")), t)
                for mm, ss, ff in stamps] or [(None, t)]
    if repeated and all(s is not None for s, _ in out):
        out.sort(key=lambda x: x[0])
    return [t for _, t in out]


def fmt(t):
    t = max(0.0, t)
    return f"[{int(t // 60):02d}:{t % 60:05.2f}]"


def main():
    ap = argparse.ArgumentParser(
        description="歌词 × 音频自动对时（免去手查 LRC）")
    ap.add_argument("audio", help="音频文件")
    ap.add_argument("lyrics", help="歌词文本文件")
    ap.add_argument("--out", required=True, help="输出 LRC 文件路径")
    ap.add_argument("--start", type=float, default=0.0,
                    help="音频起点（秒），对应歌词第一行")
    ap.add_argument("--end", type=float, default=None,
                    help="音频终点（秒）")
    ap.add_argument("--model", default="medium",
                    help="whisper 模型（tiny/base/small/medium/large）")
    ap.add_argument("--lang", default="zh",
                    help="语言代码（zh/en/ja/ko...）")
    a = ap.parse_args()

    lines = lyric_lines(open(a.lyrics, encoding="utf-8").read())
    if not lines:
        sys.exit("歌词文件无有效行: " + a.lyrics)

    # 截取片段并转录
    tmp = os.path.join(tempfile.mkdtemp(), "clip.wav")
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(a.start)]
    if a.end: cmd += ["-t", str(a.end - a.start)]
    subprocess.run(cmd + ["-i", a.audio, "-vn", "-ac", "1", "-ar", "16000", tmp],
                   check=True)

    rec = transcribe(tmp, a.model, a.lang)
    rec_s = [c for c, _, _ in rec]

    # 使用者的字，记住每字属于哪一行
    user, owner = [], []
    for i, l in enumerate(lines):
        cs = norm_chars(l)
        user += cs
        owner += [i] * len(cs)

    # 对齐
    times = [None] * len(user)
    sm = difflib.SequenceMatcher(a=user, b=rec_s, autojunk=False)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (rec[blk.b + k][1], rec[blk.b + k][2])

    # 汇总每行
    out = []
    for i, l in enumerate(lines):
        idx = [k for k, o in enumerate(owner) if o == i]
        got = [times[k] for k in idx if times[k]]
        ratio = len(got) / max(1, len(idx))
        out.append({
            "text": l,
            "start": got[0][0] if got else None,
            "end": got[-1][1] if got else None,
            "match": round(ratio, 2),
            "chars": [times[k] for k in idx],
        })

    # 没匹配到的行用前后邻居插值
    known = [k for k, o in enumerate(out) if o["start"] is not None]
    for k, o in enumerate(out):
        if o["start"] is None:
            prev = max([j for j in known if j < k], default=None)
            nxt = min([j for j in known if j > k], default=None)
            s0 = out[prev]["end"] if prev is not None else 0.0
            s1 = out[nxt]["start"] if nxt is not None else (
                rec[-1][2] if rec else s0 + 3)
            span = ((s1 - s0) / (sum(
                1 for j in range(
                    prev if prev is not None else -1,
                    nxt if nxt is not None else len(out))
                if out[j]["start"] is None) + 1)) if s1 > s0 else 2.0
            o["start"], o["end"], o["interpolated"] = (
                s0 + 0.1, s0 + max(0.5, span), True)

    # 保证顺序单调
    for k in range(1, len(out)):
        if out[k]["start"] < out[k - 1]["start"]:
            out[k]["start"] = out[k - 1]["end"]

    # 写 LRC
    with open(a.out, "w", encoding="utf-8") as f:
        for o in out:
            f.write(f"{fmt(o['start'])}{o['text']}\n")

    # 写 JSON
    json.dump(
        {"clip_start": a.start, "lines": out},
        open(os.path.splitext(a.out)[0] + ".json", "w", encoding="utf-8"),
        ensure_ascii=False, indent=1)

    # 质量报告
    ok = [o for o in out if not o.get("interpolated")]
    print(f"行数 {len(out)}, 匹配 {len(ok)}, "
          f"平均匹配率 {sum(o['match'] for o in out) / len(out):.2f}")
    for o in out:
        tag = " (插值)" if o.get("interpolated") else ""
        print(f"  {fmt(o['start'])}–{fmt(o['end'])} "
              f"match {o['match']:.2f}{tag}  {o['text']}")


if __name__ == "__main__":
    main()
