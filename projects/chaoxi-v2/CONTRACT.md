# 56 秒 MV 文件合约 v2

轻量单管线，不引入多 agent 架构。合约思路来自 ReelMimic；许可证与原文保留在 `../chaoxi/tools/upstream/`。

1. **唯一素材**：根目录 `潮汐.mp4`，SHA256 见 `plan.json`。`assets/song.m4a` 必须是其 AAC 流拷贝；不得引入 32 秒 MP3、118 BPM 网格或旧项目歌词。
2. **分析**：`analysis/report.json` 保存自动测量；`analysis/REFERENCE.md` 将观察与测量分开。未检出硬切不是「没有分镜」。
3. **企划**：`plan.json` 的 19 个 shot 连续覆盖 0–56 秒，具有 id/start/end/action/camera/transition；`STORYBOARD.md` 是同一份表格，不能另写一套时序。
4. **歌词**：`analysis/subtitles-ocr.json` 保留机器 OCR 原文；`assets/captions.json` 保留校对、显示区间、填色样本及方法。字幕来源是用户 MP4 的画面；不称为逐字声学对齐。LRC/纯文本由此生成，不用旧仓库的 LRC。
5. **渲染**：`src/project-data.js` 由 `tools/build_data.py` 生成。固定种子、纯时间函数、乱序帧可复现。原 p5.brush 后端可保留，最终片选择 native flat 后端；必须清颜色/深度缓冲，避免残影。
6. **音频**：最终 MP4 的 AAC elementary stream SHA256 必须与源 MP4、提取 M4A 一致；中间片无声，最终不再重编码歌曲。
7. **产物**：`out/video.mp4` 为交付，`out/metadata.json` 为实际编码元数据。1920×1080、24 fps、1344 帧；手绘动作每秒 12 幅（拍二），不是 24 幅独立绘画。
8. **审查**：`out/check/Sxx.jpg` 从最终编码文件提取；`review.json` 每镜一条，含 sample_s/frame/status/notes，不能以封面代替逐镜审查。另查雨伞及烟花衔接连续帧。
9. **验收**：`production.json` 只有在全片解码、源音轨哈希、镜头与字幕合约、浏览器回归通过后才写 complete；艺术判断与听审范围要如实标注。

生成源素材与审查证据按用户要求随当前分支交付；中间片、工具链和模型权重仍忽略 Git。
