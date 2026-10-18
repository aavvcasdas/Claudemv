#!/usr/bin/env python3
"""analyze.py — 参考片 BPM / 节奏拆解工具

从 ReelMimic (edenfunf/reelmimic) 引入，适配本项目的 MV 管线。
用法：
    python analyze.py <视频文件或URL> --out <项目>/analysis

输出：
    source.mp4        输入文件（URL 时用 yt-dlp 下载）
    proxy.mp4         裁切后的版本（手机录屏/letterbox 时自动裁切）
    audio.wav         单声道、响度标准化音频（仅有音轨时）
    sheet_1fps.jpg    每秒一格总览图
    sheet_scenes.jpg  每个镜头的中间帧拼图
    report.json       所有量测数据：尺寸、裁切、镜头列表、节奏、BPM、
                      拍点、音频健康度、最佳 30 秒窗口、peak_candidates

本项目的使用场景：
    - 想学某支 MV 的节奏手法时，用此工具拆解参考片
    - 产出 report.json 后交给 agent 做企划，再由我们的管线执行
    - 不对 2-3 分钟的歌跑完整 ReelMimic 管线；只做分析，只做参考

依赖：
    pip install librosa numpy opencv-python scenedetect[opencv] yt-dlp
    （可选）pip install faster-whisper opencc  # 供 align_lyrics.py 使用
"""
import argparse, hashlib, json, os, re, shutil, subprocess, sys, collections

ANALYZE_VERSION = 2
CACHE = os.path.join(os.path.expanduser("~"), ".reelmimic", "cache", "analysis")

FFMPEG_FALLBACK = os.environ.get("FFMPEG_DIR", "")
if not shutil.which("ffmpeg") and FFMPEG_FALLBACK and os.path.isdir(FFMPEG_FALLBACK):
    os.environ["PATH"] += os.pathsep + FFMPEG_FALLBACK


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def probe(path):
    r = run(["ffprobe", "-v", "error", "-show_entries",
             "format=duration:stream=codec_type,width,height,r_frame_rate,channels",
             "-of", "json", path])
    j = json.loads(r.stdout)
    v = next((s for s in j["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    fps = None
    if v and v.get("r_frame_rate") and v["r_frame_rate"] != "0/0":
        n, d = v["r_frame_rate"].split("/"); fps = round(float(n) / float(d), 3)
    return {"duration": float(j["format"]["duration"]),
            "width": v and v["width"], "height": v and v["height"], "fps": fps,
            "has_audio": a is not None, "channels": a and a.get("channels")}


def fetch(src, out):
    if os.path.isfile(src):
        dst = os.path.join(out, "source" + os.path.splitext(src)[1].lower())
        shutil.copyfile(src, dst); return dst
    tmpl = os.path.join(out, "source.%(ext)s")
    r = run([sys.executable, "-m", "yt_dlp", "-f",
             "bv*[height<=720]+ba/b[height<=720]/b",
             "--merge-output-format", "mp4", "-o", tmpl, "--no-playlist", src])
    if r.returncode:
        sys.exit("download failed:\n" + r.stderr[-2000:])
    for f in os.listdir(out):
        if f.startswith("source."): return os.path.join(out, f)
    sys.exit("download produced no file")


def detect_crop(path, dur, w, h):
    """检测画面是否在更大框架内（手机录屏 / letterbox）"""
    r = run(["ffmpeg", "-hide_banner", "-i", path, "-t", str(min(dur, 60)),
             "-vf", "fps=2,cropdetect=limit=24:round=2:reset=1", "-f", "null", "-"])
    boxes = collections.Counter(re.findall(r"crop=(\d+:\d+:\d+:\d+)", r.stderr))
    if not boxes: return None
    cw, ch, cx, cy = map(int, boxes.most_common(1)[0][0].split(":"))
    if cw * ch > .85 * w * h: return None
    return {"w": cw, "h": ch, "x": cx, "y": cy,
            "note": "画面在大框架内（录屏 / letterbox）"}


def ui_strip_crop(path, dur, w, h):
    """手机录屏：上下有 UI，视频在中间。找时间变化最大的行区域。"""
    try:
        import numpy as np, cv2
    except ImportError:
        return None
    cap = cv2.VideoCapture(path); frames = []
    for k in range(12):
        cap.set(cv2.CAP_PROP_POS_MSEC, (k + .5) / 12 * dur * 1000)
        ok, f = cap.read()
        if ok: frames.append(cv2.cvtColor(
            cv2.resize(f, (w // 4, h // 4)), cv2.COLOR_BGR2GRAY).astype("float32"))
    cap.release()
    if len(frames) < 4: return None
    var = np.stack(frames).std(axis=0).mean(axis=1)
    rows = np.where(var > max(6.0, var.max() * .35))[0]
    if not len(rows): return None
    runs, start = [], rows[0]
    for a, b in zip(rows, rows[1:]):
        if b != a + 1: runs.append((start, a)); start = b
    runs.append((start, rows[-1]))
    y0, y1 = max(runs, key=lambda r: r[1] - r[0])
    y0, y1 = int(y0 * 4), int((y1 + 1) * 4)
    if (y1 - y0) > .85 * h or (y1 - y0) < .15 * h: return None
    return {"w": w, "h": (y1 - y0) // 2 * 2, "x": 0, "y": y0,
            "note": "上下为静态 UI，中间为动态视频带（手机录屏）"}


def make_proxy(path, crop, out):
    """分析用副本：裁切 + 每 12 帧加关键帧，加速随机 seek"""
    dst = os.path.join(out, "proxy.mp4")
    vf = ["-vf", f"crop={crop['w']}:{crop['h']}:{crop['x']}:{crop['y']}"] if crop else []
    run(["ffmpeg", "-v", "error", "-y", "-i", path, *vf,
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-g", "12", "-an", dst])
    return dst


def shots(path):
    """镜头切割检测"""
    try:
        from scenedetect import detect, ContentDetector
    except ImportError:
        return []
    lst = detect(path, ContentDetector(threshold=22))
    sec = lambda x: x.seconds if hasattr(type(x), "seconds") else x.get_seconds()
    return [[round(sec(a), 3), round(sec(b), 3)] for a, b in lst]


def sheets(path, dur, cuts, out):
    """生成总览图"""
    n = int(min(dur, 64)); cols = 8; rows = max(1, -(-n // cols))
    run(["ffmpeg", "-v", "error", "-y", "-i", path,
         "-vf", f"fps={n / dur:.5f},scale=300:-2,tile={cols}x{rows}",
         "-frames:v", "1", os.path.join(out, "sheet_1fps.jpg")])
    if cuts:
        try:
            import cv2, numpy as np
        except ImportError:
            return
        step = max(1, len(cuts) // 48)
        mids = [(a + b) / 2 for a, b in cuts][::step][:48]
        cap = cv2.VideoCapture(path); tiles = []
        for m in mids:
            cap.set(cv2.CAP_PROP_POS_MSEC, m * 1000); ok, f = cap.read()
            if ok:
                f = cv2.resize(f, (300, round(300 * f.shape[0] / f.shape[1])))
                cv2.putText(f, f"{m:.1f}s", (6, 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 0), 3)
                cv2.putText(f, f"{m:.1f}s", (6, 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1)
                tiles.append(f)
        cap.release()
        if tiles:
            h = tiles[0].shape[0]
            tiles = [t if t.shape[0] == h else cv2.resize(t, (300, h)) for t in tiles]
            while len(tiles) % 8: tiles.append(np.zeros_like(tiles[0]))
            grid = np.vstack([np.hstack(tiles[r:r + 8])
                              for r in range(0, len(tiles), 8)])
            cv2.imwrite(os.path.join(out, "sheet_scenes.jpg"), grid,
                        [cv2.IMWRITE_JPEG_QUALITY, 85])


def shot_details(path, cuts, dur):
    """每个镜头：运镜（光流）+ 外观（亮度、对比度、暗部比、色彩度、主色）"""
    spans = cuts or [[0.0, dur]]
    n = min(8, max(1, (os.cpu_count() or 2) - 1), max(1, len(spans) // 12))
    if n <= 1: return _shot_details_part(path, spans, 0)
    from concurrent.futures import ProcessPoolExecutor
    size = -(-len(spans) // n)
    parts = [(path, spans[k:k + size], k) for k in range(0, len(spans), size)]
    with ProcessPoolExecutor(len(parts)) as ex:
        res = list(ex.map(_shot_details_star, parts))
    return [x for part in res for x in part]


def _shot_details_star(args): return _shot_details_part(*args)


def _shot_details_part(path, spans, offset):
    try:
        import numpy as np, cv2
    except ImportError:
        return []
    cap = cv2.VideoCapture(path); out = []
    for i, (a, b) in enumerate(spans, offset):
        n = max(3, min(10, int((b - a) * 5)))
        ts = [a + (b - a) * (k + .5) / n for k in range(n)]
        grays, looks = [], []
        for t in ts:
            cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, f = cap.read()
            if not ok: continue
            sm = cv2.resize(f, (320, round(320 * f.shape[0] / f.shape[1])))
            grays.append(cv2.cvtColor(sm, cv2.COLOR_BGR2GRAY))
            looks.append(sm)
        if len(grays) < 2: continue
        H_, W_ = grays[0].shape
        yy, xx = np.mgrid[0:H_, 0:W_]
        xc, yc = xx - W_ / 2, yy - H_ / 2
        tx = ty = zoom = rot = 0.0
        for g0, g1 in zip(grays, grays[1:]):
            fl = cv2.calcOpticalFlowFarneback(
                g0, g1, None, .5, 3, 21, 3, 5, 1.2, 0)
            u, v = fl[..., 0], fl[..., 1]
            gx = cv2.Sobel(g0, cv2.CV_32F, 1, 0)
            gy = cv2.Sobel(g0, cv2.CV_32F, 0, 1)
            tex = np.hypot(gx, gy) > 40
            tex[: max(1, H_ // 25)] = False
            if tex.sum() < 200: continue
            uu, vv = u[tex].mean(), v[tex].mean()
            rx, ry = xc[tex].mean(), yc[tex].mean()
            tx += uu; ty += vv
            zoom += ((u[tex] * xc[tex] + v[tex] * yc[tex]).mean()
                     / (xc[tex] ** 2 + yc[tex] ** 2).mean())
            rot += (u[tex] * -yc[tex] + v[tex] * xc[tex]).mean() / (
                    xc[tex] ** 2 + yc[tex] ** 2).mean()
        samples = max(1, len(grays) - 1)
        tx /= samples; ty /= samples; zoom /= samples; rot /= samples
        speed = np.hypot(tx, ty)
        kind = ["static"]
        if speed > 1.2:
            kind = (["pan_left"] if tx < -1.2 else []) + \
                   (["pan_right"] if tx > 1.2 else []) + \
                   (["tilt_up"] if ty < -1.2 else []) + \
                   (["tilt_down"] if ty > 1.2 else []) or kind
        if zoom > .002: kind.append("push_in")
        elif zoom < -.002: kind.append("pull_out")
        if abs(rot) > .001: kind.append("rotate")
        # 外观
        flat = np.concatenate([cv2.cvtColor(l, cv2.COLOR_BGR2RGB).reshape(-1, 3)
                               for l in looks])
        brightness = flat.mean() / 255
        contrast = flat.std() / 128
        dark = (flat.mean(axis=1) < 64).mean()
        # 色彩度（Chroma 的简化版）
        r, g, b = flat[:, 0].astype("f"), flat[:, 1].astype("f"), flat[:, 2].astype("f")
        mx = np.maximum(np.maximum(r, g), b)
        mn = np.minimum(np.minimum(r, g), b)
        colorful = float((mx - mn).mean() / (mx + 1e-6))
        # 主色（K-means 简化：取 5 个最常色）
        from collections import Counter
        quant = (flat // 32).astype("i") * 32 + 16
        dom = [tuple(c) for c, _ in Counter(map(tuple, quant)).most_common(5)]
        out.append({"index": i, "span": [a, b],
                    "camera": {"kind": kind, "speed": round(speed, 3),
                               "tx": round(tx, 3), "ty": round(ty, 3),
                               "zoom": round(zoom, 5), "rot": round(rot, 5)},
                    "look": {"brightness": round(brightness, 3),
                             "contrast": round(contrast, 3),
                             "dark_ratio": round(dark, 3),
                             "colourfulness": round(colorful, 3),
                             "dominant": dom}})
    cap.release()
    return out


def audio(path, info, out):
    """选相位安全的声道混音，标准化，然后测 BPM、拍点和最密的 30 秒窗口。"""
    if not info["has_audio"]: return {"present": False}
    import numpy as np, librosa
    raw = os.path.join(out, "_stereo.wav")
    run(["ffmpeg", "-v", "error", "-y", "-i", path,
         "-vn", "-ac", "2", "-ar", "22050", raw])
    y, sr = librosa.load(raw, sr=22050, mono=False)
    if y.ndim == 1: y = np.stack([y, y])
    db = lambda x: float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12))
    L, R, M = db(y[0]), db(y[1]), db((y[0] + y[1]) / 2)
    phase_inverted = M < max(L, R) - 10
    mix = "pan=mono|c0=c0" if phase_inverted else "pan=mono|c0=0.5*c0+0.5*c1"
    wav = os.path.join(out, "audio.wav")
    run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vn",
         "-af", f"{mix},loudnorm=I=-14:TP=-1.5", "-ar", "44100", wav])
    os.remove(raw)
    y, sr = librosa.load(wav, sr=22050, mono=True)
    level = db(y)
    if level < -45:
        return {"present": True, "silent": True,
                "levels_db": {"L": L, "R": R, "mono": M},
                "phase_inverted": phase_inverted,
                "note": "无可用声音：请确认录屏开了系统音频，或直接提供音频文件"}
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units="time")
    tempo = float(np.atleast_1d(tempo)[0])
    ibi = np.diff(beats)
    bpm = float(60 / np.median(ibi)) if len(ibi) else tempo
    on = librosa.onset.onset_strength(y=y, sr=sr)
    ot = librosa.times_like(on, sr=sr)
    win, dur = 30.0, len(y) / sr
    cands = []
    for i in range(0, len(beats), 4):
        s = beats[i]
        if s + win > dur: break
        cands.append((float(on[(ot >= s) & (ot < s + win)].mean()), float(s)))
    cands.sort(reverse=True)
    hop = sr // 2
    w = [db(y[i:i + hop]) for i in range(0, len(y) - hop, hop)]
    peaks = peak_candidates(y, sr, beats)
    return {"present": True, "silent": False,
            "levels_db": {"L": round(L, 1), "R": round(R, 1),
                          "mono": round(M, 1)},
            "phase_inverted": bool(phase_inverted),
            "noise_floor_db": round(float(np.percentile(w, 10)), 1) if w else None,
            "bpm": round(bpm, 2),
            "beat_seconds": round(60 / bpm, 4),
            "first_beat": round(float(beats[0]), 3) if len(beats) else None,
            "beats": [round(float(b), 3) for b in beats],
            "best_30s_starts": [{"start": round(s, 2),
                                 "density": round(m, 3)} for m, s in cands[:5]],
            "peak_candidates": peaks,
            "quality_warning": ("mono only (phase-inverted stereo)"
                                if phase_inverted else None)}


def peak_candidates(y, sr, beats, n=3):
    """音乐 buildup → 落点的位置：参考片最可能用来放大招的时刻。
    三条曲线（响度、onset 强度、频谱宽度），z-score 后相加；
    找从 2s 前到 1s 后最陡的上升；snap 到最近的拍点。"""
    import numpy as np, librosa
    hop = sr // 4
    rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0]
    onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    bw = librosa.feature.spectral_bandwidth(y=y, sr=sr, hop_length=hop)[0]
    m = min(len(rms), len(onset), len(bw))
    if m < 24: return []
    z = lambda v: (v - v.mean()) / (v.std() + 1e-9)
    cur = z(20 * np.log10(rms[:m] + 1e-9)) + z(onset[:m]) + z(bw[:m])
    sm = np.convolve(cur, np.ones(4) / 4, mode="same")
    out = []
    for i in range(8, m - 4):
        before, after = sm[i - 8:i].mean(), sm[i:i + 4].mean()
        rise = after - before
        if rise < 0.8: continue
        dip = float(sm[i - 8:i].min())
        out.append((rise + 0.5 * max(0.0, before - dip) + 0.3 * after,
                     i * 0.25, rise, after))
    out.sort(reverse=True)
    picked = []
    for score, t, rise, after in out:
        if len(beats):
            t = float(beats[np.argmin(np.abs(np.asarray(beats) - t))])
        if any(abs(t - p["t"]) < 6 for p in picked): continue
        picked.append({"t": round(t, 2),
                        "rise": round(float(rise), 2),
                        "level_after": round(float(after), 2),
                        "kind": "drop" if rise >= 2.5 else "lift"})
        if len(picked) >= n: break
    return sorted(picked, key=lambda p: p["t"])


def flashes(path, dur):
    """闪白帧检测：比前后帧都亮的帧，以及最密集的切割段。"""
    import numpy as np
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path,
         "-vf", "fps=6,scale=64:36,format=gray", "-f", "rawvideo", "-"],
        capture_output=True)
    a = np.frombuffer(r.stdout, np.uint8)
    if not len(a): return []
    lum = a[: len(a) // (64 * 36) * 64 * 36].reshape(-1, 64 * 36).mean(1) / 255
    out = []
    for i in range(2, len(lum) - 2):
        ctx = np.r_[lum[i - 2:i], lum[i + 1:i + 3]]
        if lum[i] > 0.75 and lum[i] - ctx.min() > 0.3:
            t = round(i / 6, 2)
            if not out or t - out[-1] > 1: out.append(t)
    return out


def cache_key(src):
    h = hashlib.sha1(f"v{ANALYZE_VERSION}|".encode())
    if os.path.isfile(src):
        size = os.path.getsize(src); h.update(str(size).encode())
        with open(src, "rb") as f:
            h.update(f.read(4 << 20))
            if size > 8 << 20: f.seek(-(4 << 20), 2); h.update(f.read())
    else:
        h.update(src.strip().encode())
    return h.hexdigest()[:16]


def summary(rep, out):
    info, crop, au = rep["video"], rep["crop"], rep["audio"]
    print(f"video   {info['width']}x{info['height']} {info['fps']}fps "
          f"{info['duration']:.1f}s"
          + (f"  crop → {crop['w']}x{crop['h']} ({crop['note']})" if crop else ""))
    print(f"shots   {rep['pacing']}")
    if rep.get("look_summary"): print(f"look    {rep['look_summary']}")
    if au.get("present") and not au.get("silent"):
        print(f"audio   {au['bpm']} bpm, first beat {au['first_beat']}s, "
              f"noise floor {au['noise_floor_db']} dB, "
              f"phase_inverted={au['phase_inverted']}")
        print(f"best 30s windows: {[c['start'] for c in au['best_30s_starts']]}")
        print(f"peak candidates: "
              f"{[(p['t'], p['kind']) for p in au.get('peak_candidates', [])]}")
    if rep.get("flashes"): print(f"flash frames: {rep['flashes']}")
    elif au.get("silent"): print("audio   SILENT —", au["note"])
    else: print("audio   none")
    print("wrote", os.path.join(out, "report.json"))


def main():
    ap = argparse.ArgumentParser(
        description="参考片 BPM / 节奏拆解（适配本项目 MV 管线）")
    ap.add_argument("src", help="视频文件路径或 URL")
    ap.add_argument("--out", required=True, help="输出目录")
    ap.add_argument("--no-cache", action="store_true", help="忽略缓存，重新分析")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    key = cache_key(a.src)
    cdir = os.path.join(CACHE, key)
    if not a.no_cache and os.path.isfile(os.path.join(cdir, "report.json")):
        shutil.copytree(cdir, a.out, dirs_exist_ok=True)
        with open(os.path.join(a.out, "report.json"), encoding="utf-8") as f:
            rep = json.load(f)
        print(f"cache   同一参考片已分析过 ({key})：复用")
        summary(rep, a.out); return
    src = fetch(a.src, a.out)
    info = probe(src)
    crop = None
    if info["width"]:
        crop = (detect_crop(src, info["duration"], info["width"], info["height"])
                or ui_strip_crop(src, info["duration"], info["width"], info["height"]))
    vid = make_proxy(src, crop, a.out) if crop or info["duration"] > 120 else src
    from concurrent.futures import ThreadPoolExecutor
    pool = ThreadPoolExecutor(1)
    aud = pool.submit(audio, src, info, a.out)
    cuts = shots(vid) if info["width"] else []
    lens = [b - a_ for a_, b in cuts]
    if info["width"]: sheets(vid, info["duration"], cuts, a.out)
    rep = {
        "source": os.path.basename(src), "input": a.src,
        "video": info, "crop": crop,
        "analysed": os.path.basename(vid),
        "shots": cuts,
        "pacing": {
            "count": len(cuts),
            "mean_shot_s": round(sum(lens) / len(lens), 2) if lens else None,
            "shortest_s": round(min(lens), 2) if lens else None,
            "longest_s": round(max(lens), 2) if lens else None,
        },
        "audio": aud.result(),
        "shot_details": (shot_details(vid, cuts, info["duration"])
                         if info["width"] else []),
    }
    if info["width"]: rep["flashes"] = flashes(vid, info["duration"])
    sd = rep["shot_details"]
    if sd:
        dark = sum(1 for x in sd if x["look"]["dark_ratio"] > 0.5) / len(sd)
        moving = sum(1 for x in sd if x["camera"]["kind"] != ["static"]) / len(sd)
        rep["look_summary"] = {
            "low_key_shots": round(dark, 2),
            "moving_camera_shots": round(moving, 2),
            "mean_brightness": round(
                sum(x["look"]["brightness"] for x in sd) / len(sd), 3),
            "camera_kinds": sorted({k for x in sd for k in x["camera"]["kind"]}),
        }
    if rep["audio"].get("bpm") and lens:
        rep["pacing"]["mean_shot_beats"] = round(
            rep["pacing"]["mean_shot_s"] / rep["audio"]["beat_seconds"], 1)
    with open(os.path.join(a.out, "report.json"), "w", encoding="utf-8") as f:
        json.dump(rep, f, ensure_ascii=False, indent=1)
    try:
        shutil.copytree(a.out, cdir, dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns(
                            "STYLE.md", "route.json",
                            "proposed_style_*", "song", "lyrics"))
    except OSError as e:
        print("cache   未写入:", e)
    summary(rep, a.out)


if __name__ == "__main__":
    main()
