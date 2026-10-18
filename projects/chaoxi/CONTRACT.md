# MV 文件合约 v1（轻量单管线）

这是对 ReelMimic 文件合约的适配，不声称兼容其 App 或六 agent 调度器。上游原文在 tools/upstream/CONTRACT.md。

- `analysis/report.json`：原始机器测量；不得把节拍估计称为已确认 BPM，也不得把人工分段写成自动切镜结果。
- `analysis/STYLE.md`：人工参考片阅读；数据与观察分开。
- `STYLE.md`：可复用的材质、颜色、运镜、音景词典。
- `plan.json`：version、format、music、shots。shot 必须有 id/start_s/end_s/summary/action/camera_note/transition_out；时间连续覆盖全片。
- `STORYBOARD.md`：同一份企划的人类可读版。
- `assets/song.m4a`：用户原声流拷贝，分析 WAV 不得替代它；生成音频不进 Git。
- `production.json`：渲染命令、源音轨、状态与实际成片元数据。
- `review.json`：逐镜审查。每镜必须有 shot_id、sample_s、frame、status、notes。不能只审一张封面；静帧检查不等于完整听审。
- `out/check/storyboard.jpg`：每镜中间帧，另用 `--strip` 检查镜头交界。
- `out/潮汐-纸上海.mp4`：成片（本次按用户要求明确纳入 Git；其他生成物仍按忽略规则管理）。
- `tools/validate.py`：检查时序、逐镜覆盖和文件存在性；它不判断艺术质量。

歌词可选：输入必须是用户确认的 `assets/lyrics.txt`；align_lyrics 输出 LRC/JSON，低匹配行须人工复核。在没有歌词或本地 ASR 模型时标记 pending，不制造“已对齐”结果。此环境无法访问模型托管站，需提前准备本地模型。
