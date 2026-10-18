# 專案檔案合約

本项目的文件合约，参考 ReelMimic 的 CONTRACT.md 格式，适配我们的 p5.brush 动画管线。
Agent 与使用者之间通过以下文件结构沟通。

## 目录结构

```
projects/<id>/
  brief.md                 使用者的需求原文
  inputs/                  使用者提供的素材 / 音档 / 歌词（唯读）
    song.mp3               歌曲
    lyrics.txt             歌词文本
  analysis/
    report.json            analyze.py 产出（量测数据：BPM、拍点、镜头、节奏）
    sheet_1fps.jpg         每秒一格总览
    sheet_scenes.jpg       每个镜头中间帧
    subs.lrc               歌词对时结果（align_lyrics.py 产出）
    subs.json              逐行时间 + 匹配率
  STYLE.md                 风格选择与定制（从 styles/ 复制或定制）
  STORYBOARD.md            分镜脚本（agent 产出）
  plan.json                企划 JSON（agent 产出，前端可解析）
  out/
    check/                 审查影格、contact sheet、对比图
    video.mp4              成品
```

## 与 ReelMimic 的差异

我们不做 ReelMimic 那样的 6 路 agent 长片管线（1–3.5 h/片）。
我们的用法是：

1. **参考片模仿**：用 `analyze.py` 拆解一支喜欢的 MV 的节奏手法
2. **企划**：agent 读 `report.json` + `STYLE.md`，写出 `STORYBOARD.md` 和 `plan.json`
3. **歌词对时**：用 `align_lyrics.py` 自动生成 LRC，免去手查
4. **执行**：用我们的 p5.brush 管线（`src/`）逐镜构建，渲染 `out/video.mp4`

## plan.json 格式

```json
{
  "version": 1,
  "title": "片名",
  "logline": "一句话故事",
  "style": "ink-wash",
  "format": { "width": 1920, "height": 1080, "fps": 24, "duration_s": 180 },
  "music": {
    "source": "user",
    "file": "inputs/song.mp3",
    "bpm": 136,
    "offset": 0,
    "section": { "start_s": 0, "end_s": 180 }
  },
  "look": {
    "medium": "手绘水墨 + 抖线",
    "palette": ["#2A2C52", "#F2ECDE", "#B02E22"],
    "texture": "宣纸纹",
    "color_arc": "冷暗 → 暖金 → 留白"
  },
  "characters": [
    { "id": "protag", "name": "主角",
      "design": "描述外观", "arc": "情绪变化弧线" }
  ],
  "shots": [
    {
      "id": "S1",
      "start_beat": 0, "end_beat": 16,
      "start_s": 0, "end_s": 7.06,
      "summary": "一句话描述这个镜头发生了什么",
      "action": "具体动作，依时间顺序",
      "camera_note": "中景，缓慢推近（给人看的一句话）",
      "transition_in": "从黑场墨晕开",
      "transition_out": "墨晕覆盖到下一镜",
      "reads": [
        "0–2 拍：场景建立",
        "3–5 拍：主角出现",
        "6–8 拍：事件发生"
      ],
      "ref_shot": null,
      "ref_what": "若参考了分析过的参考片，这里写参考了哪个镜头",
      "assets": [],
      "sfx": [],
      "notes": ""
    }
  ],
  "peaks": [
    {
      "id": "P1",
      "shots": ["S8", "S9"],
      "build_from_s": 21.5,
      "hold_s": [23.6, 24.0],
      "hit_s": 24.0,
      "build": "张力怎么往上堆",
      "hit": "爆发那一格（主体、构图、色彩）",
      "after": "停住多久、怎么收",
      "emotion": "观众在这一刻感受到什么"
    }
  ],
  "open_questions": [],
  "changelog": ["v1：初版"]
}
```

### 规则

- `shots` 的时间两种都写（拍与秒）；没有音乐时可省略 `start_beat/end_beat`
- 每个镜头都要有 `reads`（观众的阅读顺序）
- `peaks` 里的镜头在 `shots` 里标 `"hero": true`
- 每次依使用者意见修改企划：`version` +1、`changelog` 加一行

## STORYBOARD.md 格式

遵循 `ANIMATION_GUIDE.md` 中的格式：

```
Logline: 一句。Clawd wants ___, but ___, so ___.
World: 场景、小调色板、光线、颜色弧线。
Motif: 反复出现并回收的东西。
Clawd's arc: 整支影片的情绪键。
Shots:
  A  start–end  [transition in: ___]  what's seen · EVENT · reaction · camera
     reads:  start–end  第一个观众要理解的东西
             start–end  下一个（观众的目光在哪里？）
             ...
  B  start–end  [transition: ___]  ...
  ...
  [transition out: ___]
```

## 审查流程

逐镜审查，每镜检查：

1. **事件**：这个镜头有没有事件发生？
2. **时间**：每个 read 有没有足够的时间着陆？
3. **转场**：每个接缝都有转场吗？
4. **文字**：有没有不该出现的文字？
5. **节拍**：动作有没有落在拍点上？
6. **风格**：符不符合 STYLE.md 的规范？

审查结果写入 `out/check/review.md`，格式：

```
## S1: [镜头标题]
- 事件: 4/5 — [说明]
- 时间: 3/5 — [说明]
- 转场: 5/5 — [说明]
- 文字: 5/5 — 无文字
- 节拍: 4/5 — [说明]
- 风格: 4/5 — [说明]
- 总结: [通过 / 需修改] — [具体修改建议]
```

## 素材授权

外部素材记录在 `inputs/ASSETS.md`：

```
文件名 | 来源网站 | 原始网址 | 授权 | 作者/署名
```
