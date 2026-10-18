# Stage 5 — Shot-by-Shot Review & Verification Report (`review.md`)

- **Project**: 《潮汐》(Chaoxi) — 国风非遗三绝重制版 (Traditional Chinese Art MV Remake)
- **Source Reference**: `/home/user/Claudemv/潮汐.mp4` (`56.00s`, `1920×1080`, `24fps`, `143.55 BPM`)
- **Rendered Deliverable**: `/home/user/Claudemv/out/video.mp4` (mirrored to `projects/chaoxi/out/video.mp4` and `潮汐_国风重制版.mp4`)
- **Contact Sheets & Comparisons**:
  - `out/sheet.jpg` (`24` frames across `0.00–56.00s`)
  - `projects/chaoxi/out/check/compare_all.jpg` & `compare_S01.jpg`..`compare_S10.jpg`
  - `projects/chaoxi/out/check/motion.json` & `compare.json`

---

## 1. Automated Telemetry (`motion_check.py` & `compare.py`)

| Check Metric | Target (`CONTRACT.md`) | Actual Result (`motion.json`) | Status |
| :--- | :--- | :--- | :--- |
| **Resolution & Frame Rate** | `1920×1080 @ 24.0 fps` | `1920×1080 @ 24.0 fps` (`1344` frames) | **PASS** |
| **Duration & Audio Mux** | `56.0s` + AAC `192kbps` | `55.87s` audio / `56.00s` video (`H.264 High@L4.0`) | **PASS** |
| **Frozen Stretches (`freezes`)** | `0` stretches `> 1.0s` | **`0`** (`freezes: []`) | **PASS** |
| **Black Frame Dropouts (`black`)** | `0` mid-film dropouts | **`0`** (`black: []`) | **PASS** |
| **Unintended White Flashes** | `0` unintended | **`0`** (`white_flash: []`) | **PASS** |
| **Hard Cut to Black at End** | `False` (smooth iris out) | **`False`** (`end_hard_cut_to_black: false`) | **PASS** |

---

## 2. Shot-by-Shot Review Table (5-Axis Scoring, `/5`)

| Shot | Time (`s`) | Style Toolkit | Lyric Span | Comp. | Material & Color | Pacing & Motion | Acting & Props | Lyric Sync | Score | Visual & Staging Notes |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **S01** | `0.00–8.60` | **水墨 (`INK`)** | L1–L2 (`我们都是渺小真实存在` / `祈愿小世界里不只有挫败`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Opens with golden-rimmed moon-gate iris (`月洞门`) on Ink-Scholar Clawd (`斗笠` + `文生巾`) under ink storm cloud, distant `mountainLayer`, overhanging `pine`, and rolling Song-dynasty night waves. Golden shooting star arcs across `(1690,110)->(420,310)` at `6.7–8.45s` as he looks up with hopeful eyes. |
| **S02** | `8.60–15.62` | **水墨设色 (`INK`)** | L3–L4 (`直到遇见你我以为就光明起来` / `眼睛里看到的都是广袤无垠的大海`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | 3-part narrative arc matching `peak_2.jpg`: (A) Cinnabar-Maiden arrives by ink sampan as sky warms to dawn ochre; (B) dramatic camera push-in (`1.12 -> 1.85`) onto Ink-Scholar's sparkling eyes reflecting waves; (C) sunrise flash reveals wide Song-dynasty multi-layered ocean (`INK.wave`) + vermilion sun (`朱砂日轮`) + `潮汐` seal. |
| **S03** | `15.62–19.10` | **剪纸 (`PAPERCUT`)** | L5 (`有你在的日子里不可能被取代`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | 5-band cinnabar/ochre `brushWipe` opens onto festive Shaanxi Red Papercut stage (`PAPERCUT.cornerFrame`, 3 rotating 8-fold `tuanhua` rosettes, `sawRow` grass border, `plum` blossoms, rising folk `heart` cutouts) with beat-locked bounce/sway duet dance. |
| **S04** | `19.10–25.48` | **水墨 × 剪纸** | L6–L7 (`在最灰暗的日子你陪着我发呆` / `你让我学会如何拨开阴霾`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Phase A: Cinnabar-Maiden shelters Ink-Scholar under a Jiangnan oiled-paper umbrella (`PAPERCUT.umbrella`) that physically blocks falling rain threads with warm amber under-glow. Phase B (`22.46s` Peak 3): Both jump and push the dark `INK.washBlob` storm clouds off-screen, revealing a golden `tuanhua` sun. |
| **S05** | `25.48–28.86` | **剪纸 × 水墨** | L8–L9 (`将快乐全部收集` / `将不开心全都淘汰`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Phase A: Papercut hearts and stars arc into the glowing Celadon Porcelain Jar (`PAPERCUT.jar`). Phase B (`26.98s`): Camera shake + Ink-Scholar swings a giant wolf-hair calligraphy brush (`毛笔`) with a crimson flying-white (`飞白`) slash, batting 4 tangled black ink-scribble gloom balls off-screen. |
| **S06** | `28.86–35.40` | **皮影 (`SHADOW`)** | L10–L11 (`你对我说的情话` / `像转瞬即逝的烟花`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Huaxian Shadow-Puppet stage (`SHADOW.backdrop`) with carved pavilion eave (`SHADOW.cloud`, `SHADOW.beads`), brass joint rivets (`SHADOW.joint`), and bamboo control rods (`SHADOW.rod`). Phase A whispers `情/心/诺` seal glyphs; Phase B (`31.48s` Peak 4) pulls back as 7 carved multi-dye fireworks (`SHADOW.firework`) burst across the night screen. |
| **S07** | `35.40–38.77` | **皮影 × 水墨** | L12 (`只停在绽放一刹那`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | One colossal central firework (`SHADOW.firework` + `PAPERCUT.tuanhua`) blooms at `(960, 340)` and shatters into 32 falling embers as Cinnabar-Maiden dissolves into a stream of red plum petals blowing right; Ink-Scholar turns and reaches out in sorrow. |
| **S08** | `38.77–42.56` | **水墨沧海 (`INK`)** | L13 (`我却已无法自拔`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Peak 5: Four layers of Song-dynasty Ma Yuan waves (`INK.wave` in indigo, `nong`, and `jiao` ink) surge from `y = 860` to `y = 175`, submerging Ink-Scholar Clawd with glowing heart-eyes and rising air bubbles. |
| **S09** | `42.56–44.65` | **剪纸昼 × 水墨夜** | L14 (`我们的爱总有时差`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Split-screen Chinese scroll (`昼夜时差卷`): Left half (`昼暖`) has warm Xuan paper, red `tuanhua` sun, and Cinnabar-Maiden strolling in daylight; Right half (`夜寒`) has indigo night scroll, crescent moon, and Ink-Scholar walking alone; divided by a spinning astronomical sundial medallion at `x = 960`. |
| **S10** | `44.65–56.00` | **水墨 × 剪纸心灯** | L15–L16 (`也为你骗自己放下` / `爱炙热的你却忘了爱自己`) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | **25/25** | Floating crimson papercut heart cracks (`46.2–48.6s`) and transforms into 20 ascending plum petals at `48.62s` (Peak 6) as Ink-Scholar's chest Heart-Lantern (`心灯`) and golden `tuanhua` halo ignite, warming the island to jade-ochre. Cosmic pullback (`zoom: 1.08 -> 0.70`) with `潮汐` and `自爱` seals, closing with a smooth moon-gate iris (`54.4–56.0s`). |
