# 潮汐 · 一颗心的潮汐（修订版 02）

**输入只有当前上传的 56 秒 `潮汐.mp4`。** 不使用 `aavvcasdas/re` 的 32 秒 MP3、歌词或分镜。
`re` 已完整克隆作工具参考；本项目只复用其手绘引擎骨架与本地字体，19 个镜头、美术词典及实际字幕处理均针对本次 MP4 新建。

## 本次交付

- [`out/video.mp4`](out/video.mp4)：1920×1080，24 fps，56 秒，1344 帧。动作按手绘「拍二」绘制，每秒 12 幅独立画面。
- **声音保持源 MP4 的 AAC 流完全一致**：无声画面中间片 → 最终直接复制原音轨，不二次转码音乐、不变速、不换歌曲。
- 19 镜：孤独星球、目光特写、相遇、背影看海、撑伞奔来、倾伞、天光、瓶中纸星、依偎、烟花、卧水、日夜时差、破心和独处。
- **不是团聚结尾**。原片最后是一个人；新版以胸前小暖心和小星球回应自我照顾。
- 16 行字幕从源 MP4 内嵌画面 OCR 提取，校对原文；金色行级填充依据原字幕金/白像素比例。不是旧项目 LRC，也不声称音素强制对齐。
- 每镜审查图直接从最终 MP4 解码，见 `out/check/`、`review.json`。上一版留在 `../chaoxi` 供历史对照，不作为当前交付。

## 预览

在仓库根目录：

```bash
python projects/chaoxi-v2/tools/preview.py --port=37189
```

打开服务器首页，自动转到新版。播放器支持成片播放、带音轨的拖动、下载，以及逐镜源码审查。
服务器绑定 `0.0.0.0`，使用相对资源 URL，支持 MP4/M4A 的 HTTP Range，不依赖浏览器能访问 sandbox localhost。
直接双击 HTML 也可用已安装的本地依赖，但推荐 HTTP 服务器。

## 渲染与复现

需要 Node 22+、Python 3.11+、Chrome/Chromium、ffmpeg、ffprobe。浏览器用 `CHROME_PATH` 或 `--chrome` 指定。

```bash
npm ci
python -m venv .venv
.venv/bin/pip install -r projects/chaoxi-v2/tools/requirements.txt
# 无桌面 Linux：RapidOCR 的 opencv-python 依赖会覆盖 headless 版，需替换：
.venv/bin/pip uninstall -y opencv-python
.venv/bin/pip install --force-reinstall --no-deps opencv-python-headless
# ffmpeg / ffprobe 需已在 PATH；无自动下载系统二进制。

# 可选：重新生成原片节奏分析（原始输出已随项目保存）
.venv/bin/python projects/chaoxi-v2/tools/analyze.py 潮汐.mp4 --out projects/chaoxi-v2/analysis
# 优先使用原片已存在的字幕，而非重新猜唱词：
.venv/bin/python projects/chaoxi-v2/tools/extract_captions.py 潮汐.mp4 --out projects/chaoxi-v2/analysis/subtitles-ocr.json
.venv/bin/python projects/chaoxi-v2/tools/prepare_captions.py 潮汐.mp4
.venv/bin/python projects/chaoxi-v2/tools/build_data.py

CHROME_PATH=/path/to/chrome .venv/bin/python projects/chaoxi-v2/tools/render.py
.venv/bin/python projects/chaoxi-v2/tools/review_video.py
```

`render.py` 调用原根渲染管线，新加 `--no-audio` 生成中间片；然后 ffmpeg 将拍二画面编码为 24 fps 并复制原始 AAC。中间片 `out/work-12fps.mp4` 不进 Git。
`core.js` 保留 p5.brush 后端，并新增 native-flat 平面绘制后端避免 CPU 软件 GL 上的逐图形遮罩开销；原有角色骨架、相机、情绪与固定种子仍工作。最终原生 WebGL 画布 1920×1080，不是把 720p 成片整体拉大。

### 无现成字幕的音频

`tools/align_lyrics.py` 仍可调用已引入的 ReelMimic 自动对齐工具，输入必须是用户确认的逐行歌词。
需要额外安装 `faster-whisper opencc-python-reimplemented` 和准备本地 Whisper 模型。此沙箱不能访问模型托管站，故本片不冒称运行过声学强制对齐；已有字幕用 OCR 与屏幕进度恢复更直接。

## 验证

```bash
.venv/bin/python -m unittest discover -s projects/chaoxi-v2/tools -p 'test_*.py' -v
CHROME_PATH=/path/to/chrome node projects/chaoxi-v2/tools/smoke.mjs
.venv/bin/python projects/chaoxi-v2/tools/validate.py
ffmpeg -v error -i projects/chaoxi-v2/out/video.mp4 -f null -
```

`--preflight` 可在成片产生前只查源、企划、字幕与音轨。完整检查要求实际视频元数据、源/提取/最终 AAC 哈希一致、19 镜证据与审查记录。
单元与浏览器自动测试不等于艺术质量认证；全片人工听审范围见 production.json，不隐瞒局限。

## 来源与许可

见 `IMPORT.md`、引擎 `LICENSE`、字体目录中的 OFL/Apache 许可证，以及 `../chaoxi/tools/THIRD_PARTY.md`。
歌曲、歌词和上传素材的权利归原权利人；按用户要求随工作分支交付不等于获得其他用途的再分发许可。
