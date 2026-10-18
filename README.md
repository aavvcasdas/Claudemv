# Claude Animation Base

This is a small starter kit with code, instructions and assets for animating a character in [p5.js](https://p5js.org) and [p5.brush](https://github.com/acamposuribe/p5.brush) with Claude Opus 5.5. It's based on the code from the music video [I'm Upping My P(doom)](https://github.com/JohnHeibel/PDoomVideo) and an analysis of what the model did and didn't do well. I highly recommend playing around with your prompting: make it give you the storyboard before coding, give it very broad instructions, try being very specific, ask for subagents, and try a bunch of other fun ways of testing the model's capabilities. In my testing, it can do a lot with very little, but it's also quite accurate when you give it more requirements. Also try asking the model to swap out the character or make new emotions or costumes, give it your own reference images, and try many other fun things like that. I've found that the reasoning level corresponds to how "extravagant" and detail-oriented the model makes the scene. All test videos were generated with Opus 5.5 on xhigh reasoning in Claude Code.

![Clawd's emotions, animated](docs/emotions.webp)

## Make a video

Clone it, open it in Claude Code (or any coding agent) and ask for what you want:

> Read ANIMATION_GUIDE.md, then make a 15-second video of Clawd trying to catch a butterfly.

The model storyboards first, builds shot by shot, renders contact sheets to check its own work, and writes `out/video.mp4`. [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) holds the rules it follows: handmade, alive, one piece, no text, transitions always, something happens in every scene, and a solid medium of brush strokes, flat 2D and boiling linework. It also covers timing for the viewer and the core principles of character animation.

## Run it yourself

You need Node.js, Google Chrome and ffmpeg.

Without a dedicated GPU, p5.brush's watercolour fills make render times fairly slow, measured in seconds per frame. If you're running on integrated graphics, I recommend asking the model to avoid those fills and replace them with something else appropriate. (I love the look of the watercolours, though.)

```bash
npm install
node render.mjs --clip --out=out/video.mp4
```

That renders the 11-second demo in [src/scenes/demo.js](src/scenes/demo.js). Open [studio.html](studio.html) in Chrome to scrub through it. Add `?loop=emotions` or `?loop=views` to see the model sheets. If Chrome isn't in a standard location, pass `--chrome=<path>` or set `CHROME_PATH`.

On Linux, `render.mjs` starts Chrome with `--no-sandbox` (Ubuntu 23.10+ blocks Chrome's sandbox in headless use) and also finds a Chromium installed by Playwright. With no GPU at all, add `--soft-gl` to render WebGL in software: slow on watercolour fills, but it works. On a headless Linux machine with an NVIDIA GPU (a cloud or cluster node), add `--gpu-angle=gl-egl` (or `vulkan`); `node gpu_probe.mjs <chrome path>` shows which renderer each set of flags gets.

## What's here

| path | what it is |
|---|---|
| [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | The rules, the workflow and the full API. Read it first. |
| [src/clawd.js](src/clawd.js) | Clawd: views, emotions, eyes, mouths, hats, emotes, dances |
| [src/core.js](src/core.js) | Painting, timing, motion helpers, camera, light, paper |
| [src/timeline.js](src/timeline.js) | Shots, loops and the brush-wipe transition |
| [src/config.js](src/config.js) | Length and tempo |
| [src/scenes/](src/scenes/) | Your video goes here (the demo is an example) |
| [render.mjs](render.mjs) | Headless renderer: contact sheets, frame strips, crops, stills, MP4 |
| [docs/](docs/) | Model sheets: [emotions](docs/emotions.jpg) (also [animated](docs/emotions.webp)) and [views, motion and hats](docs/views.jpg) |
| [tools/](tools/) | `analyze.py` (参考片 BPM/节奏拆解) 和 `align_lyrics.py` (歌词×音频自动对时)，从 [ReelMimic](https://github.com/edenfunf/reelmimic) 引入 |
| [styles/](styles/) | 三种中式传统风格规范（水墨、皮影、剪纸），参考 [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) 的 STYLE.md 格式 |
| [src/_lib.js](src/_lib.js) | 风格库：三种风格的渲染参数编码为 JS 对象，供 scene 文件选用 |
| [CONTRACT.md](CONTRACT.md) | 文件合约：agent 与使用者之间通过文件结构沟通的协议 |
| [TOOLS_AND_STYLES.md](TOOLS_AND_STYLES.md) | 工具与风格系统的完整文档 |

## 新增：参考片模仿流程

本项目现在支持从参考 MV 学习节奏手法，再用自己的管线执行：

1. **拆解参考片** — `python tools/analyze.py reference.mp4 --out analysis/`
2. **选择风格** — 从 `styles/` 选一种（水墨/皮影/剪纸），或自定义
3. **歌词对时** — `python tools/align_lyrics.py song.mp3 lyrics.txt --out subs.lrc`
4. **企划 → 分镜 → 构建 → 审查** — 遵循 [CONTRACT.md](CONTRACT.md) 的文件合约

详见 [TOOLS_AND_STYLES.md](TOOLS_AND_STYLES.md)。
