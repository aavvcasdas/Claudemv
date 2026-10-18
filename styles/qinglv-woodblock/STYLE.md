# 青绿金碧·木版重彩 (`qinglv-woodblock`) — Chinese MV Style Specification

Adapted from Song-dynasty **Blue-and-Green Landscape (`王希孟《千里江山图》青绿金碧`)**, **Dunhuang Mineral Fresco (`敦煌重彩壁画`)**, and **Ming/Qing Multicolor Woodblock Print (`饾版水印浪纹`)** for `Claudemv`.

## 1. Material & Surface (`材质与肌理`)
- **Ground (`绢本设色与饾版木纹`)**: Sized silk (`熟绢`) and mineral-dyed paper with horizontal woodblock baren grain (`木版刷纹`) and warm gold-leaf vignette.
- **Linework (`泥金勾勒与铁线描`)**: Crisp iron-wire ink lines (`铁线描`, `#1C1624`) paired with luminous 24K mud-gold contour highlights (`泥金勾脊`, `#F4C764`) along mountain ridges, cloud rims, and wave crests.
- **Water Reflection (`鎏金镜面水波`)**: Horizontal interleaved reflection strips (`mirrorClone`) with sinusoidal phase displacement and golden sun/moon shimmer bars.

## 2. Mineral Pigment Palette (`矿物重彩配色`)
| Token | Name | Hex | Role |
| :--- | :--- | :--- | :--- |
| `azurite` | 头青 / 石青 | `#1B4F82` | Mountain peaks, deep ocean crest |
| `azuriteLt` | 三青 | `#3C88B8` | Mid-water, shallow tide, sky transition |
| `malachite` | 头绿 / 石绿 | `#267F68` | Mountain mid-slopes, emerald waves |
| `malachiteLt` | 三绿 | `#58B894` | Shore shallows, sunlit sea |
| `ochre` | 赭石 | `#B86B43` | Mountain base, warm sunset sand |
| `mudGold` | 泥金 | `#F5C85C` | Ridge outlines, sun disk, memory mandala |
| `cinnabar` | 朱砂 / 珊瑚 | `#E05A47` | Coral-Amber protagonist, koi fish, seals |
| `celadon` | 汝窑天青 | `#74C2C8` | Celadon-Jade partner, porcelain drift bottle |
| `dunhuangViolet` | 敦煌暮紫 | `#4A3560` | Dusk/twilight sky & distant cloud banks |
| `lapisNight` | 佛头青夜海 | `#121E3A` | Seabed & moonlit night ocean |

## 3. Signature Motifs in `window.QINGLV` (`src/_lib.js`)
- `QINGLV.silkGround(ctx, w, h, mode, t)`: Sized-silk sky & beach ground with woodblock grain (`mode`: `'sunset' | 'golden' | 'seabed' | 'dusk' | 'night'`).
- `QINGLV.qinglvMountains(ctx, yBase, w, t, o)`: Three-tier *Thousand Li of Rivers and Mountains* mineral peaks (ochre base -> malachite body -> azurite crest) with 24K mud-gold ridge lines (`泥金勾脊`).
- `QINGLV.greatWave(ctx, x, yBase, w, h, progress, t, o)`: Towering woodblock/mineral Great Wave (`汹涌潮汐`) with multi-fingered white claw-foam (`鹰爪浪花`) and gold-veined water ribs.
- `QINGLV.porcelainBottle(ctx, x, y, sc, rot, o)`: Blue-and-white porcelain drift bottle (`青花瓷漂流瓶`) with cobalt cloud scrolls, red cord, and inner glowing secret scroll.
- `QINGLV.koi(ctx, x, y, sc, dir, t, col)`: Animated vermilion-and-gold swimming/leaping koi (`锦鲤`).
- `QINGLV.mandalaOrb(ctx, x, y, r, t, alpha)`: Dunhuang mud-gold flame-halo memory orb (`泥金藻井回忆球`).
