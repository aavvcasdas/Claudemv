---
name: papercut-red
title: 剪纸 · Chinese Folk Red Papercut (Shaanbei & Jiangnan Jianzhi)
category: Folk Craft / Festive Graphic
source: Adapted from lemomo-ai/lemo-opuscar (styles/papercut-red/STYLE.md) for Claudemv src/_lib.js
---

# 剪纸 · Red Papercut (`PAPERCUT`)

> **"千刻不落，万剪不断；阳剪见线，阴剪见面。"**
> Single-sheet China red (`#D2201F`) folk paper cutting with connected bridges (`线线相连`), scissor/knife wobble, crisp paper-thickness drop shadow, and classic folk interior cutouts (`锯齿纹`, `月牙纹`, `云纹`, `梅花`, `团花`).

---

## 1. Material & Color Palette (纸材与色彩)

- **Primary Cut Paper**:
  - **中国红 (China Red `#D2201F`, dark edge `#9E1413`)**: Primary positive paper sheet (`宣纸染红`).
  - **金箔点彩 (Gold Leaf Accent `#E8AA38` / `#F4C96B`)**: Festive highlights, lanterns, hearts, and sun cores.
- **Window / Backing Grounds (`衬底宣纸`)**:
  - **米白宣纸 (Warm Xuan Cream `#F4EFE3`)**: Daytime window-flower (`窗花`) ground.
  - **团花金底 (Warm Ochre Cream `#F7ECD4`)**: Celebratory mid-section ground.
  - **靛蓝夜纸 (Indigo Night Paper `#1A233A`)**: Nighttime lantern/starlight backing.
- **Physical Paper Thickness**:
  - Every cut red layer casts a crisp `2.5px` offset shadow (`rgba(45, 10, 8, 0.28)`) onto the backing paper so the cutout reads as physical layered paper.

---

## 2. Folk Cutting Vocabulary (`刀剪纹样`)

- **线线相连 (Structural Connectivity)**: All positive red shapes connect to a frame, ground hill, or adjacent motif, with interior details carved out via negative-space folk holes (`destination-out` or backing-paper cutouts):
  - **锯齿纹 (`PAPERCUT.sawRow` / `sawEdge`)**: Serrated triangular teeth representing fur, grass, sunbeams, or energetic motion.
  - **月牙纹 (`PAPERCUT.crescent` / `crescentRows`)**: Crescent moon slits defining folds, smiles, eyes, waves, and cloud ribs.
  - **水滴纹 / 柳叶纹 (`PAPERCUT.teardrop`)**: Teardrop/willow-leaf petals and rain/petal bursts.
  - **梅花孔 (`PAPERCUT.plum`)**: 5-petal auspicious floral punches.
  - **铜钱纹 (`PAPERCUT.coin`)**: Round coin with square center hole (`外圆内方`) along borders.
  - **团花 (`PAPERCUT.tuanhua`)**: 8-fold D4 kaleidoscopic radial rosette framing key emotional beats.

---

## 3. Camera & Animation Rhythm (镜头与定格律动)

- **On-Twos Stop-Motion Feel (`12 fps` stepped boil)**: Papercut elements shift with tactile hand-placed stop-motion charm (`onTwos(t)`).
- **Decorative Border Frames (`窗花角花`)**: Corner folk frets and top horizontal banners (`横批`) frame the stage like a traditional wooden window lattice (`窗棂`).

---

## 4. Do-Not-Cross Red Lines (红线禁忌)

1. **No soft airbrushed gradients inside the red paper sheet** — the red paper itself is flat-dyed mulberry paper; shading comes from cutout density (`锯齿纹/月牙纹`) and drop shadow.
2. **Never leave large solid red blobs uncarved** — every body, hill, cloud, or heart over 40px must carry folk interior cutouts (`plum`, `crescent`, `sawRow`, `teardrop`).

---

## 5. `src/_lib.js` Toolkit API (`PAPERCUT`)

```js
PAPERCUT.PAL                          // { red: '#D2201F', redDk: '#9E1413', gold: '#E8AA38', cream: '#F4EFE3', night: '#1A233A' }
PAPERCUT.layer(ctx, drawPositive, drawCuts, opts) // Render a physical cut-paper sheet with interior negative cutouts & paper shadow
PAPERCUT.sawRow(ctx, x0, y0, x1, y1, n, depth)    // Serrated saw-tooth cutout row (锯齿纹)
PAPERCUT.crescent(ctx, x, y, r, th, a0, a1, bend) // Crescent slit cutout (月牙纹)
PAPERCUT.teardrop(ctx, x, y, r, len, ang)         // Teardrop / willow-leaf cutout (柳叶/水滴纹)
PAPERCUT.plum(ctx, cx, cy, r, petals)             // 5-petal plum blossom punch (梅花孔)
PAPERCUT.coin(ctx, cx, cy, r)                     // Coin motif (铜钱孔)
PAPERCUT.tuanhua(ctx, cx, cy, R, rot, alpha)      // 8-fold radial folk rosette (团花)
PAPERCUT.cornerFrame(ctx, w, h, inset, col)       // Traditional window-lattice corner & border fretwork (窗花边框)
PAPERCUT.heart(ctx, cx, cy, r, rot, col)          // Folk papercut heart with interior plum & crescent cutouts
```
