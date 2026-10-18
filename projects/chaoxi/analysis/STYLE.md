# STYLE.md — 《潮汐》(Chaoxi) Reference Breakdown & Chinese Art Remake Bible

## 1. Reference Video Analysis (`潮汐.mp4`)

- **Duration / Format**: `56.00s`, `1920×1080`, `24.0 fps`, stereo audio (`-11.0 dB` mean).
- **Tempo & Beat Grid**: `143.55 BPM` (`beat_seconds = 0.418s`, `first_beat = 0.836s`, 129 beats).
- **Original Visual Style**:
  - Western storybook pastel/crayon illustration on warm paper (`#F3EBDC`) with two square-bodied `Clawd` characters (an orange protagonist and a pink partner with a ribbon bow) living on a curved little planet.
  - Bottom-centered dark pill KTV subtitle bar (`y ≈ 970..1036`) with brush-lettered Chinese lyrics that fill from left to right in warm ochre (`#E8AA38`).
- **Original Narrative Structure (16 Lyric Lines)**:
  1. `0.00–8.58s` (`我们都是渺小真实存在 / 祈愿小世界里不只有挫败`): Iris opens on a lonely night planet; rain falls from a small dark cloud onto the solitary orange character; a shooting star arcs across the sky.
  2. `8.62–15.62s` (`直到遇见你我以为就光明起来 / 眼睛里看到的都是广袤无垠的大海`): The pink partner appears; dawn warms the sky; close-up of sparkling eyes opens out to both watching a golden sunrise over the vast ocean; diagonal brush wipe at `15.5s`.
  3. `15.67–19.08s` (`有你在的日子里不可能被取代`): Joyful daytime dance together on a green hill with floating hearts.
  4. `19.12–25.46s` (`在最灰暗的日子你陪着我发呆 / 你让我学会如何拨开阴霾`): Storm clouds and rain return; the partner shelters the protagonist under a yellow umbrella; together they push the storm clouds apart and embrace in the sun.
  5. `25.50–28.83s` (`将快乐全部收集 / 将不开心全都淘汰`): Collecting glowing hearts into a jar (`25.50–26.96s`), then batting away dark scribble gloom-balls (`27.00–28.83s`).
  6. `28.88–35.38s` (`你对我说的情话 / 像转瞬即逝的烟花`): Twilight whispers (`28.88–31.46s`) followed by a chorus climax of colorful fireworks bursting across the night sky (`31.50–35.38s`).
  7. `35.42–42.54s` (`只停在绽放一刹那 / 我却已无法自拔`): A single giant central firework blooms and fades into embers as the partner vanishes (`35.42–38.75s`); a dark blue ocean tide surges up the screen, submerging the protagonist (`38.79–42.54s`).
  8. `42.58–44.62s` (`我们的爱总有时差`): Vertical split-screen planet — warm Day/Sun on the left (partner) and cold Night/Moon on the right (protagonist), rotating in separate time zones.
  9. `44.67–56.00s` (`也为你骗自己放下 / 爱炙热的你却忘了爱自己`): Protagonist alone on the night planet under a fracturing heart (`44.67–48.58s`); the heart breaks into petals as a warm self-love light ignites in the protagonist's chest (`48.62–53.79s`), pulling back to the tiny planet in the starry cosmos before irising out (`54.0–56.0s`).

---

## 2. Remake Style Specification: **东方水墨·皮影·剪纸三幕画卷 ("Tides of Ink, Shadow & Crimson Paper")**

Instead of Western pastel/crayon, our remake transforms 《潮汐》 into a **Traditional Chinese Art MV** powered by `src/_lib.js` (`INK` 水墨, `PAPERCUT` 剪纸, `SHADOW` 皮影), where each visual style embodies a distinct emotional chapter of the song:

### Cast Redesign (东方戏曲/文人角色设定)
- **玄墨小生 · Ink-Scholar Clawd (Protagonist)**:
  - Warm赭石/宣纸-tinted body (`#C96E4B` / `#8C3F2B` shadow) with hand-inked calligraphy outlines, wearing a traditional scholar's indigo/bamboo headband (`文生巾/斗笠`) and holding a calligraphy brush (`毛笔`) or celadon jar (`青瓷罐`).
- **朱砂小旦 · Cinnabar-Maiden Clawd (Partner)**:
  - Soft胭脂/朱砂-tinted body (`#DF6B77` / `#A83844` shadow) adorned with a carved **Red Papercut Plum-Blossom Hair Ornament (`剪纸梅花头饰`)** and carrying a Jiangnan oiled-paper umbrella (`江南油纸伞`).

### Three-Act Style Progression
1. **Act I (`0.00s – 15.62s`) — 水墨山水卷 (`styles/ink-wash/STYLE.md`, `INK.*`)**:
   - **Surface & Palette**: Aged Xuan rice paper (`#F2ECDE`) blended with cold night indigo (`#1D2C3B`) in Shot 1, warming to mineral ochre (`#B87A44`), cinnabar (`#C83E2B`), and gold (`#E8AA38`) in Shot 2.
   - **Motifs**: Layered `INK.mountainLayer` with `INK.cun` (披麻皴 + 苔点), overhanging cliff pine (`INK.pine`), Ma Yuan Song-dynasty waves (`INK.wave`), and carved vermilion seal stamps (`INK.seal`).
2. **Act II (`15.62s – 35.42s`) — 剪纸窗花与华县皮影卷 (`styles/papercut-red/STYLE.md` & `styles/shadow-puppet/STYLE.md`, `PAPERCUT.*` & `SHADOW.*`)**:
   - **Shots 3–5 (`15.62s – 28.88s`, Joy, Rain Umbrella, Cloud-Parting & Collecting Joy)**: Framed by traditional **Red Papercut (`PAPERCUT`)** window-lattice corner fretwork (`窗花角花`), rotating 8-fold `PAPERCUT.tuanhua` rosettes, serrated `sawRow` hills, crescent/plum cutouts, a painted Jiangnan oiled-paper umbrella (`油纸伞`), a celadon porcelain jar (`青瓷罐`), and flying calligraphy-brush ink sweeps.
   - **Shot 6 (`28.88s – 35.42s`, Sweet Words & Ephemeral Fireworks)**: Transitions into a backlit **Shadow-Puppet (`SHADOW`)** oil-lamp theater stage (`SHADOW.backdrop`) with carved openwork pavilion arches (`SHADOW.cloud`, `SHADOW.beads`), visible brass joint rivets (`SHADOW.joint`), bamboo control rods (`SHADOW.rod`), and translucent dyed-hide fireworks (`SHADOW.firework`) bursting across the night screen.
3. **Act III (`35.42s – 56.00s`) — 水墨沧海与昼夜太极卷 (`INK.*` + `SHADOW.*` + `PAPERCUT.*` synthesis)**:
   - **Shot 7 (`35.42s – 38.79s`)**: A colossal golden-vermilion shadow-and-ink firework blooms and dissolves into drifting ink-and-cinnabar embers as Cinnabar-Maiden vanishes.
   - **Shot 8 (`38.79s – 42.58s`)**: Five surging layers of Song-dynasty ink waves (`INK.wave` in `TONE.jiao`, `TONE.nong`, and deep indigo) rise up the screen, submerging Ink-Scholar Clawd.
   - **Shot 9 (`42.58s – 44.67s`)**: **Yin-Yang Day/Night Split Scroll (`昼夜时差卷`)** — left half in warm Xuan-paper daylight (`PAPERCUT` sun & plum blossoms with Cinnabar-Maiden), right half in cold indigo ink-wash night (`INK` crescent moon & mountain mist with Ink-Scholar), divided by a glowing brass/ink meridian.
   - **Shot 10 (`44.67s – 56.00s`)**: Return to the solitary ink-wash island; a crimson `PAPERCUT.heart` fractures into drifting plum petals as a warm golden-vermilion inner lantern (`心灯`) blooms inside Ink-Scholar Clawd's chest, pulling back through a Song-dynasty moon-gate iris with a final vermilion seal (`潮汐`).

### Typography & Karaoke Bar (`src/karaoke.js`)
- Uses local Chinese brush calligraphy (`Ma Shan Zheng` + `Noto Serif SC` from `assets/fonts/fonts.css`), rendered inside a traditional Chinese scroll-plaque (`乌木描金词牌`) at the bottom of the frame (`y = H - 64`) with vermilion seal-border accents and warm mineral-gold (`#E8AA38`) character-by-character karaoke fill.
