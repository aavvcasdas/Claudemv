# 来源与本次范围

输入是用户明确链接的 `arena/460e6af7-claudemv` 分支根目录 `潮汐.mp4`：56秒。
SHA256 见 plan.json。本次未使用同分支后来新增的 `new潮汐.mp4`，未混入32秒旧项目音频。

本版基于本仓库 `projects/chaoxi-v2` 已完成的引擎、19镜时序与同源字幕恢复结果迭代。
新增美术变体在 `src/scenes/variation.js`；改动细节见 README.md 和 plan.json.adaptation。
没有把上一版视频做简单滤镜处理：全部672幅独立画面重新渲染，随后以24fps编码。

引擎历史：aavvcasdas/re（8631b531454530dd5719bbe8ba9a2de405a9136b）的 painted-animation 骨架，
最早来自 JohnHeibel/ClaudeAnimationBase（MIT）。沿用的字体许可随 assets/fonts 保留。
原音轨为用户 MP4 的 AAC 流拷贝，歌词为同一 MP4 内嵌字幕恢复结果；不主张新的歌曲或歌词权利。
