---
name: shadow-puppet
title: 皮影 · Chinese Shadow Puppetry (Huaxian Piyingxi)
category: Folk Narrative / Backlit Theater
source: Adapted from lemomo-ai/lemo-opuscar (styles/shadow-puppet/STYLE.md) for Claudemv src/_lib.js
---

# 皮影 · Shadow-Puppet (`SHADOW`)

> **"一口道尽千古事，双手对舞百万兵；隔帐陈述千古事，灯下挥舞鼓乐声。"**
> Translucent dyed donkey-hide figures pressed against a warm oil-lamp cotton screen, with intricate openwork (`镂空`) floral/cloud carvings, visible brass joint rivets, and bamboo control rods.

---

## 1. Material & Lighting (材质与灯影)

- **Backlit Cotton Screen (`亮子 / 影窗` — `SHADOW.backdrop`)**:
  - Lit from behind by a warm flickering tung-oil lamp (`#FFF6DC` center hotspot -> `#F0D9A6` mid -> `#7A4E24` -> `#261507` theatrical frame).
  - Subtle woven cotton warp/weft grain and 18 Hz oil-lamp flicker.
- **Translucent Dyed Hide (`透光驴皮` — `SHADOW.DYE` + `multiply` blend)**:
  - Pieces are never opaque flat fills: they use `globalCompositeOperation = 'multiply'` (or warm backlit translucency on night skies) so overlapping limbs darken naturally at the joints and glow amber where the oil lamp shines through.
  - **Dye Palette (`SHADOW.DYE`)**:
    - **朱红 (`red`: `#C9241B`)**
    - **石绿 (`green`: `#1E7E48`)**
    - **藤黄 / 琥珀 (`amber`: `#DF8B17`)**
    - **靛青 (`indigo`: `#203966`)**
    - **群青 (`teal`: `#1D6A6B`)**
    - **牛角黑 (`black`: `#23160C`)**
    - **生皮色 (`raw`: `#E3BD78`)**

---

## 2. Openwork Carving Grammar (`镂空刀法`)

- **阴刻 (Intaglio)**: Solid dyed hide with carved-out glowing slots (`SHADOW.cut`, `SHADOW.cutLine`).
- **阳刻 (Relief)**: Open interior leaving only thin dyed-hide structural ribs.
- **Traditional Carved Motifs**:
  - **云头纹 (`SHADOW.cloud`)**: Spiral cloud-head scrollwork on collars, pavilions, and borders.
  - **月牙鳞 (`SHADOW.scales`)**: Scalloped crescent armor/wave scales.
  - **联珠纹 (`SHADOW.beads`)**: Dotted pearl border bands along hems and frames.
  - **梅花纹 (`SHADOW.plum`)**: Five-petal plum blossom cutouts.
  - **回纹 (`SHADOW.meander`)**: Geometric fretwork border.
- **Joints & Control Rods (`骨眼与签子`)**:
  - Every articulated limb pivot displays a brass/bone rivet (`SHADOW.joint(ctx, x, y)` — dark ring + glowing pinhole center).
  - Bamboo/wire control rods (`SHADOW.rod(ctx, x, y, angle)`) extend downward from hands and neck.

---

## 3. Camera & Staging (影窗调度)

- **Flat Lateral Stage Plane**: Characters perform in profile or 3/4 view along a carved stage rail, framed by decorative side curtains (`影窗边框`).
- **Articulated Pendulum Motion**: Limbs swing around fixed joint pivots with crisp spring-settle physics (`spring`).
- **Night Lantern & Firework Spectacle**: Against a darkened indigo-amber shadow screen, carved translucent fireworks (`SHADOW.firework`) bloom like glowing stained-glass rosettes.

---

## 4. Do-Not-Cross Red Lines (红线禁忌)

1. **No 3D perspective foreshortening on puppet limbs** — puppets are flat cut leather plates rotating in 2D planes.
2. **Never omit joint rivets or openwork cutouts** — uncarved solid silhouettes look like generic Western vector art, not Chinese 皮影.
3. **Always preserve the warm oil-lamp backlight gradient** so the hide glows from within.

---

## 5. `src/_lib.js` Toolkit API (`SHADOW`)

```js
SHADOW.DYE                            // { red, green, amber, black, raw, indigo, teal }
SHADOW.backdrop(ctx, w, h, t, opts)   // Backlit oil-lamp cotton screen + woven cloth texture + carved theatrical border
SHADOW.piece(ctx, drawPath, fill, o)  // Translucent dyed-hide plate with aged hide mottling & rim outline
SHADOW.cut(ctx, drawPath)             // Openwork cutout (镂空) revealing the warm backlit screen beneath
SHADOW.cutLine(ctx, x0, y0, x1, y1,w) // Carved slot line
SHADOW.beads(ctx, x0, y0, x1, y1, n,r)// Pearl-dot border (联珠纹)
SHADOW.plum(ctx, cx, cy, r)           // 5-petal plum blossom cutout (梅花镂空)
SHADOW.cloud(ctx, cx, cy, sc, flip)   // Spiral cloud-head cutout (云头纹)
SHADOW.joint(ctx, x, y, r)            // Articulation rivet (骨眼)
SHADOW.rod(ctx, x, y, ang, len)       // Control rod (签子)
SHADOW.firework(ctx, x, y, r, p, col) // Carved translucent shadow-puppet firework burst
```
