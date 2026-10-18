# 潮汐 · 纸上海

56 秒用户视频片段的风格化重制，1280×720 / 24 fps。保留原声与相遇、雨伞、分享、烟花等意象，视觉改为水墨海景与剪纸小蟹。没有重唱、生成配乐或未经确认的歌词字幕，也没有把片段当成完整歌曲。

## 文件

- `analysis/report.json`：ReelMimic 自动测量，`analysis/STYLE.md`：人工观察与分析限制。
- `STYLE.md`、`_lib.js`：材质、颜色、运镜、音景规范与可复用绘图词典。
- `CONTRACT.md`、`plan.json`、`STORYBOARD.md`、`production.json`、`review.json`：轻量文件合约与逐镜审查。
- `studio.html`、`scene.js`：浏览器预览，兼容根渲染器的 renderAt/renderSheet 接口。
- `tools/analyze.py`、`tools/align_lyrics.py`：直接可用的上游工具入口，原文保留在 upstream。
- `out/潮汐-纸上海.mp4`、`out/check/`：本次成片和审查图；按用户要求，此次交付明确纳入 Git，其他项目的生成物仍默认忽略。
- `assets/song.m4a`：从上传视频 stream copy 提取的原音轨，不是分析用归一化单声道。歌曲版权归原权利人；本次按用户要求随分支交付，不因此推定用户授予其他用途的再分发许可。

## 安装和复现

需要 Python 3.11+、Node 22+、Chrome/Chromium、ffmpeg、ffprobe；与基础项目一样，不自动捆绑浏览器和 FFmpeg。

```bash
npm ci
python -m venv .venv
.venv/bin/pip install -r projects/chaoxi/tools/requirements.txt
# ffmpeg、ffprobe 需位于 PATH；如在虚拟环境 bin，可 export PATH="$PWD/.venv/bin:$PATH"
.venv/bin/python projects/chaoxi/tools/analyze.py 潮汐.mp4 --out projects/chaoxi/analysis
mkdir -p projects/chaoxi/assets
ffmpeg -y -i 潮汐.mp4 -map 0:a:0 -vn -c:a copy projects/chaoxi/assets/song.m4a
node render.mjs --page=projects/chaoxi/studio.html --soft-gl --clip --out=projects/chaoxi/out/潮汐-纸上海.mp4
node render.mjs --page=projects/chaoxi/studio.html --soft-gl --sheet=4,11,15,21,26,31,37,42,47,52 --cols=5 --w=480 --out=projects/chaoxi/out/check/storyboard.jpg
node render.mjs --page=projects/chaoxi/studio.html --soft-gl --stills=4,11,15,21,26,31,37,42,47,52 --out=projects/chaoxi/out/check/stills
.venv/bin/python projects/chaoxi/tools/validate.py
.venv/bin/python -m unittest discover -s projects/chaoxi/tools -p 'test_*.py' -v
```

用 `--chrome=/path/to/chrome` 或 CHROME_PATH 选择浏览器。
本次沙箱临时用 npm @sparticuz/chromium 与其运行库、imageio-ffmpeg 和 @ffprobe-installer/linux-x64 提供二进制；这些是运行环境工具，不作为项目依赖或源码提交。

## 自动歌词对齐（可选，未对本片执行）

```bash
.venv/bin/pip install faster-whisper opencc-python-reimplemented
.venv/bin/python projects/chaoxi/tools/align_lyrics.py projects/chaoxi/assets/song.m4a projects/chaoxi/assets/lyrics.txt --out projects/chaoxi/assets/subs.lrc --model /path/to/local-whisper-model
```

需先有用户确认的逐行歌词，以及本地 Whisper 模型；默认 medium 会尝试下载模型，此沙箱不能访问模型站。
工具输出逐行匹配率和插值时间，低匹配行仍要人工检查；它不是“没有歌词也能保证识别正确”的功能。
当前歌词状态为 pending，未伪造 LRC。上游来源与 MIT 许可证见 tools/THIRD_PARTY.md。

## 预览

在仓库根运行 `python -m http.server 8000 --bind 0.0.0.0`，打开 `/projects/chaoxi/studio.html`。
点击“播放原声”才会开始播放，避免自动播放限制。拖动时间轴可审查任意时刻。

浏览器回归测试（检查十镜非空白、同时间渲染确定性、动作和 JS 错误）：
`CHROME_PATH=/path/to/chrome node projects/chaoxi/tools/smoke.mjs`。
音轨流拷贝的 SHA256 对比见 `analysis/audio-extraction.json`。
