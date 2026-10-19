# 《东京不太热》— 青春校园暗恋篇 MV 质检与卡点复盘 (V2 高密度动作版)

## 1. 音频分析与逐字卡点对齐 (已修复字幕不同步)
- **源文件**: `东京不太热 .mp3` (219.453s / 03:39, 126.05 BPM, beat=0.4760s)
- **问题复盘**: V1 使用 kugeci 外链 LRC 时间轴整体超前约 4.4-4.7s，导致字幕早于人声。
- **修复方案**: 使用 `faster-whisper` 本地 tiny 模型 (int8, CPU) 对 `audio.mp3` 做词级转写，提取 69 句精确人声起止时间 (15.74s 首句“收藏夹的照片看了又删”至 218.85s 尾句)，以此重建 `src/config.js` 的 `PROJECT.lyrics/subs` 与 `analysis/subs.*`。`karaoke.js` 的 kinetic 逐字弹入 (word.s/e) 现与人声完全同步。
- **验证**: `motion_check` 0 freezes；抽帧对比 faster-whisper word_timestamps 与 LRC diff 均值 4.4s 已消除。

## 2. 项目层动作密度重构 (解决“每2-3秒无动作”)
- **根因**: `src/clawd.js` 原仅支持 `bounce/roof/sway/spin` 等少量 move，且 `clawd()` 无默认 pose，角色在未显式指定 pose 时完全静止；部分 shot 的男主/女主长达 8-15s 同一 pose。
- **项目修复**:
  - `clawd()` 增加自动 pose 解析：`o.pose/move` 透传 `move()`，无 pose 时默认 `bounce` 随 beat 呼吸；新增 `typing/phone/selfhold/aloof/heartbreak` 五种校园专用 move。
  - `eyes`/`mouth` 别名 (starstruck→spark 等) 与 `glasses` 镜面高光、sweat 自动 emote。
  - `src/scenes/dongjing_butaire.js` 全面重写：引入 `microPhase(localT, 2.4-2.8s)` 与 `camPulse()` 镜头呼吸，每 shot 切 4-6 个微相位，2-3秒切换 pose/表情/视线/道具/背景。
- **细粒度编排**:
  - S01 序幕：男主 walk→wave→phone→sway→bounce，女主 bounce→wave→phone，飞鸟/无人机 6s 循环。
  - S02 教室：台灯光晕、窗帘摆动、黑板粉笔 3 句轮播高亮，男主 typing→phone→sway→aloof→selfhold。
  - S03 林荫道：公告栏 4 张海报轮播，落叶飞舞，情侣 scale 脉动，男主 walk→phone→sway→selfHold。
  - S04 宿舍：饮料罐抖动、窗外灯闪，男主 hop/roof↔typing↔shrug。
  - S05 走廊：窗外树影、储物柜门开关、地面反光，距离标语 3 句轮播，心碎段 2s 切换 cry↔heartbreak。
  - 其余 S06-S14 同步强化：天台风向旗/飞机、操场夜跑学生、图书馆翻页、雨廊水洼涟漪、音乐教室海报、文化祭逛祭学生、烟花观星情侣、毕业气球学士帽、终章小狗等，每 shot ≥4 个动态层。

## 3. 14 Shot 校园剧场 (219.453s)
- S01 0.00-15.74 樱花校门序幕
- S02 15.74-30.90 晚自习教室与手机相册
- S03 30.90-46.30 放学林荫道与左手牵右手
- S04 46.30-61.35 宿舍叮当Q弹窗
- S05 61.35-77.30 走廊高冷与心碎
- S06 77.30-92.56 天台夜风与极亮街灯
- S07 92.56-107.75 操场塑胶跑道
- S08 107.75-122.90 图书馆解题
- S09 122.90-138.60 雨廊黄伞
- S10 138.60-153.76 音乐教室黑胶转身
- S11 153.76-169.14 文化祭灯笼
- S12 169.14-184.60 钟楼烟花
- S13 184.60-199.70 毕业黑板报
- S14 199.70-219.45 樱花校门终章 FIN

## 4. 渲染校验
- 输出: `东京不太热_校园版.mp4` (1920×1080 24fps, 5266帧, 42MB H264 CRF22 + AAC)
- motion_check: cuts 0, freezes 0, black 0, white 0  (V1 为 freezes 19)
- 全程 beat-synced (126 BPM) + 逐字 kinetic 高亮，镜头呼吸 shakeXY 每拍
