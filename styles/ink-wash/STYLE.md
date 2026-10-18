---
name: ink-wash
title: 水墨 · Traditional Chinese Ink Wash (Shanshui)
category: Atmospheric / Traditional Painting
source: Adapted from lemomo-ai/lemo-opuscar (styles/ink-wash/STYLE.md) for Claudemv src/_lib.js
---

# 水墨 · Ink-Wash (`INK`)

> **"墨分五色，计白当黑；气韵生动，意在笔先。"**
> Five tones of ink on warm Xuan rice paper; unpainted space is mist, water, and sky; a single vermilion seal anchors the composition.

---

## 1. Material & Surface (材质与肌理)

- **Ground (宣纸 Xuan Paper)**: Warm handmade mulberry/rice paper (`#F2ECDE`, shadow `#E3D9C4`) with subtle warm fiber veins and soft edge vignette. Never use sterile `#FFFFFF`.
- **Five Ink Tones (墨分五色)**:
  - **焦墨 (`jiao`, opacity `0.96`, `#141312`)**: Dry, dense foreground pine bark, cliff axes, focal pupils, calligraphy accents.
  - **浓墨 (`nong`, opacity `0.82`, `#1E1D1B`)**: Primary structural strokes, boat hulls, near mountain ridges.
  - **重墨 (`zhong`, opacity `0.60`, `#3A3835`)**: Mid-ground trees, rocky contours, bridge arches.
  - **淡墨 (`dan`, opacity `0.34`, `#6E6A63`)**: Distant mountain washes, cloud banks, ripples, bamboo leaves.
  - **清墨 (`qing`, opacity `0.16`, `#A8A298`)**: Far horizon peaks, mist veils, water reflections.
- **Mineral Accents (国画设色)**:
  - **朱砂 (Cinnabar / Vermilion `#B02E22` / `#C83E2B`)**: Seal stamp (`印章`), rising sun (`日轮`), maiden's ribbon, plum blossoms.
  - **赭石 (Ochre `#B57C4A`)**: Autumn reeds, sampan wood, warm cliff faces, sunset glow.
  - **花青 / 靛青 (Indigo `#2C4356` / `#1D2C3B`)**: Night sky wash, deep ocean tide (`潮汐`), cold rain.
  - **石绿 / 石青 (Malachite & Azurite `#4A7A62` / `#3B6E7C`)**: Spring hills, celadon porcelain jar.

---

## 2. Brushwork & Structural Motifs (笔法与皴法)

- **Center-Tip Brush (`中锋用笔` — `INK.mk` + `INK.draw`)**:
  - Catmull-Rom spline resampling with pressure envelopes (`brush`, `tip`, `nail`, `rise`) so strokes swell organically and taper cleanly.
- **Dry-Brush Flying White (`飞白` — `dry > 0`)**:
  - Multi-filament bristle splitting along fast or dry strokes, exposing flecks of Xuan paper beneath.
- **Texture Strokes (`皴法`)**:
  - **披麻皴 (`INK.cun`)**: Hemp-fiber wavering contour lines down mountain slopes + horizontal **苔点** (`ink moss dots`) along ridge crests.
  - **斧劈皴 (`INK.cliff`)**: Angular axe-cut rock facets with dark wash undersides and jagged dry contours.
- **Living Elements**:
  - **松枝 (`INK.pine`)**: Gnarled overhanging cliff pine with radiating pine-needle fans.
  - **宋人水波 (`INK.wave`)**: Song-dynasty Ma Yuan (`马远《水图》`) rhythmic scalloped wave crests and foam eddies.
  - **朱文/白文印 (`INK.seal`)**: Carved vermilion seal stamp with organic stone-chip dropouts.

---

## 3. Camera & Pacing (镜头与节奏)

- **Scroll Composition (`散点透视 / 留白`)**: Keep 35–55% of the frame as breathing Xuan paper or misty night wash (`留白`).
- **Slow Horizontal / Vertical Scroll Pans**: Use smooth ease-in-out camera drifts (`camBegin`) as if unrolling a handscroll (`手卷`) or hanging scroll (`立轴`).
- **Brush-Sweep Transitions**: Transition between acts with sweeping calligraphy strokes (`brushWipe`) or moon-gate (`月洞门`) irises.

---

## 4. Soundscape Pairing (声景配器)

- Sparse intro/outro phrases pair with solitary rain threads, distant mountain mist, and a single boat or island.
- Chorus swells pair with surging multi-layered `INK.wave` tides, vermilion sunrises, and drifting plum petals.

---

## 5. Do-Not-Cross Red Lines (红线禁忌)

1. **No neon or saturated RGB primaries** (`#FF0000`, `#00FF00`, `#0000FF`). All colors must be muted with ink or Xuan paper warmth.
2. **No uniform mechanical stroke widths** — every structural line must use `INK.stroke` or `inkLine` with pressure taper.
3. **Never overcrowd the frame** — preserve negative space (`计白当黑`) so the mist and tide breathe.

---

## 6. `src/_lib.js` Toolkit API (`INK`)

```js
INK.TONE                              // { jiao: .96, nong: .82, zhong: .6, dan: .34, qing: .16 }
INK.PAL                               // { paper: '#F2ECDE', ink: '#171614', seal: '#B02E22', indigo: '#263B4D', ochre: '#B87A44', jade: '#4A7A62' }
INK.ricePaper(ctx, w, h, nightMix)    // Render Xuan paper ground (0 = warm day paper, 1 = deep indigo night scroll)
INK.stroke(ctx, pts, opts)            // Tapered Catmull-Rom calligraphy stroke ({ w, tone, col, mode, dry, seed })
INK.washBlob(ctx, x, y, rx, ry, opts) // Multi-ring organic ink/mineral wash puddle
INK.mountainLayer(ctx, opts)          // Layered shanshui mountain silhouette + bottom mist dissolve
INK.cun(ctx, ridgeFn, x0, x1, yB, o)  // Hemp-fiber texture strokes (披麻皴) + ridge moss dots (苔点)
INK.cliff(ctx, side, topY, botY, w,o) // Axe-cut cliff face (斧劈皴)
INK.pine(ctx, x0, y0, len, ang, s, o) // Overhanging cliff pine with needle clusters
INK.wave(ctx, yBase, w, h, t, opts)   // Song-dynasty rhythmic wave layer (马远水图纹)
INK.sampan(ctx, x, y, sc, tilt, opts) // Minimalist 3-stroke ink boat with bamboo-hat figure
INK.seal(ctx, x, y, size, chars, seed)// Carved vermilion seal stamp (印章)
```
