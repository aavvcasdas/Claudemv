# 工具与风格系统

本项目从三个参考项目中引入工具和风格系统，适配我们的 p5.brush MV 管线。

## 参考来源

| 来源 | 引入什么 | 不引入什么 |
|---|---|---|
| [ReelMimic](https://github.com/edenfunf/reelmimic) | `analyze.py`（BPM/节奏拆解）、`align_lyrics.py`（歌词对时）、CONTRACT.md 文件合约 | 6 路 agent 长片管线（对我们的 2-3 分钟 MV 不划算） |
| [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | STYLE.md 格式（材质/色彩/运镜/音景的艺术词典）、三种中式风格 | 完整的 51 风格库（我们只取三种中式传统风格） |
| [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) | 原始管线（本项目是其 fork） | — |

## 目录结构

```
tools/
  analyze.py          — 参考片 BPM / 节奏拆解
  align_lyrics.py     — 歌词 × 音频自动对时
styles/
  ink-wash.md         — 水墨风格规范
  shadow-puppet.md    — 皮影风格规范
  papercut-red.md     — 剪纸风格规范
src/
  _lib.js             — 风格库（JavaScript：三种风格的渲染参数）
CONTRACT.md           — 文件合约（agent 与使用者的沟通协议）
projects/
  template/
    tools/            — 项目模板中的工具副本
```

## 1. 工具

### analyze.py — 参考片 BPM / 节奏拆解

从 ReelMimic 引入。拆解一支参考 MV 的节奏手法，输出 `report.json`。

```bash
# 安装依赖
pip install librosa numpy opencv-python scenedetect[opencv] yt-dlp

# 分析参考片
python tools/analyze.py reference_mv.mp4 --out projects/my_mv/analysis/

# 输出：
#   report.json       BPM、拍点、镜头列表、节奏分析、peak_candidates
#   sheet_1fps.jpg    每秒一格总览
#   sheet_scenes.jpg  每个镜头中间帧
#   audio.wav         标准化音频
```

**使用场景**：想学某支 MV 的节奏手法时，用它拆解，产出企划，再由我们的管线执行。

### align_lyrics.py — 歌词 × 音频自动对时

从 ReelMimic 引入。免去手查 LRC 的步骤。

```bash
# 安装依赖
pip install faster-whisper
pip install opencc  # 可选：简繁转换，提高中文匹配率

# 对时歌词
python tools/align_lyrics.py projects/my_mv/inputs/song.mp3 \
    projects/my_mv/inputs/lyrics.txt \
    --out projects/my_mv/analysis/subs.lrc \
    --lang zh --model medium
```

## 2. 风格系统

### STYLE.md 格式

参考 lemo-opuscar 的 STYLE.md 格式，每种风格定义：

1. **本质** — 一眼认出的特征
2. **材质与渲染** — 物理介质及代码如何模仿
3. **色彩逻辑** — 规则而非调色板
4. **运镜语法** — 词汇表而非路线
5. **运动质量** — 帧率、步进、缓动
6. **声音调色板** — 乐器、音效材质
7. **原生技法** — 此媒介独有的招式
8. **介质陷阱** — 常见错误及修复
9. **引擎映射** — 映射到 p5.brush / core.js

### 三种中式风格

| 风格 | 文件 | 特征 |
|---|---|---|
| 水墨 | `styles/ink-wash.md` | 宣纸 + 墨分五色 + 留白 + 朱砂印 |
| 皮影 | `styles/shadow-puppet.md` | 透射光 + 雕皮 + 关节偶 + 锣鼓 |
| 剪纸 | `styles/papercut-red.md` | 中国红 + 裁切 + 铰接剪影 + 团花 |

### _lib.js — 风格库

`src/_lib.js` 将三种风格的渲染参数编码为 JavaScript 对象，供 scene 文件使用：

```javascript
// 在 scene 文件顶部选择风格
const STYLE = STYLES['ink-wash'];

// 使用风格的调色板
const myPal = getStylePalette('ink-wash');

// 使用风格的运镜词汇
const cameras = getStyleCameraVocab('ink-wash');

// 检查运镜/转场是否在风格允许范围内
if (isAllowedCameraMove('papercut', 'page_turn')) { /* ... */ }
```

在 `studio.html` 中先于 scene 加载 `_lib.js`。

## 3. CONTRACT.md — 文件合约

定义 agent 与使用者之间通过文件结构沟通的协议。核心结构：

```
projects/<id>/
  inputs/           — 使用者提供的素材
  analysis/         — analyze.py 和 align_lyrics.py 的输出
  STYLE.md          — 风格选择
  STORYBOARD.md     — 分镜脚本
  plan.json         — 企划 JSON
  out/              — 审查和成品
```

详细格式见 [CONTRACT.md](CONTRACT.md)。

## 4. 用法：参考片模仿流程

1. **分析参考片**
   ```bash
   python tools/analyze.py my_reference.mp4 --out projects/my_mv/analysis/
   ```

2. **选择风格**
   - 从 `styles/` 复制一个 STYLE.md 到项目中
   - 或直接使用 `_lib.js` 中的风格参数

3. **提供歌词**（如果有）
   ```bash
   python tools/align_lyrics.py inputs/song.mp3 inputs/lyrics.txt --out analysis/subs.lrc
   ```

4. **写分镜** — agent 读 `report.json` + `STYLE.md`，写 `STORYBOARD.md` 和 `plan.json`

5. **构建** — 用 p5.brush 管线逐镜构建

6. **审查** — 逐镜审查（事件、时间、转场、文字、节拍、风格）

## 依赖

### 分析工具（可选）
```bash
pip install librosa numpy opencv-python scenedetect[opencv] yt-dlp faster-whisper
pip install opencc  # 可选：中文简繁转换
```

### 渲染管线（必需）
```bash
npm install
# 需要 Node.js、Chrome、ffmpeg
```
