// chaoxi.js — 《潮汐》(Chaoxi) Traditional Chinese Art MV Remake (56.0s, 10 Shots)
// Styles: 水墨 (INK), 剪纸 (PAPERCUT), 皮影 (SHADOW) from src/_lib.js
// Storyboard: projects/chaoxi/STORYBOARD.md | Style Bible: projects/chaoxi/analysis/STYLE.md

(() => {
  // ---------- Cast Wrappers: 玄墨小生 (Ink-Scholar) & 朱砂小旦 (Cinnabar-Maiden) ----------
  function scholarClawd(x, y, u, o = {}) {
    const prevDraw = o.draw;
    const isPuppet = !!o.puppet;
    const bambooHat = !!o.bambooHat;
    const innerLight = o.innerLight || 0;
    clawd(x, y, u, {
      col: '#CF6E4A', dk: '#8C3B22', lt: '#F4B492',
      boilKey: o.boilKey || 'scholar',
      ...o,
      draw(u0, sw0) {
        const ctx = drawingContext;
        // Scholar's indigo headband (文生巾) + trailing ink-silk ribbons
        paint(rectPts(-5.15 * u0, -8.35 * u0, 10.3 * u0, 1.05 * u0, u0 * 0.04), {
          wash: '#23364E', fill: '#162234', fillOp: 90, ink: PAL.ink, sw: sw0 * 0.7
        });
        // Jade forehead token (额前玉佩)
        paint(ellPts(0, -7.82 * u0, u0 * 0.55, u0 * 0.42, 12), {
          wash: '#7CC2B2', ink: PAL.ink, sw: sw0 * 0.5
        });
        // Fluttering scholar ribbon tails on the left
        const w1 = Math.sin(T * 5.4) * 0.65 * u0, w2 = Math.cos(T * 4.8) * 0.55 * u0;
        inkLine([[-5.0 * u0, -7.8 * u0], [-6.8 * u0, -7.1 * u0 + w1], [-8.4 * u0, -6.0 * u0 + w2]], sw0 * 1.1, '#23364E', 'ink', 0.5);
        inkLine([[-5.0 * u0, -7.5 * u0], [-6.5 * u0, -6.4 * u0 - w2], [-7.9 * u0, -5.1 * u0 + w1]], sw0 * 0.85, '#3A587A', 'ink', 0.5);

        // Optional woven bamboo rain hat (斗笠)
        if (bambooHat) {
          paint([[-7.2 * u0, -8.1 * u0], [0, -11.4 * u0], [7.2 * u0, -8.1 * u0]], {
            wash: '#C89B62', fill: '#8C6234', fillOp: 90, ink: PAL.ink, sw: sw0 * 0.85,
            hatch: { d: 14, a: 25, b: 'HB', c: '#54381B', w: 0.7 }
          });
        }

        // Optional inner self-love heart lantern (心灯自照 in Shot 10)
        if (innerLight > 0.02) {
          const pulseR = 1 + 0.12 * Math.sin(T * 6.5);
          glow(0, -3.2 * u0, u0 * 5.2 * innerLight * pulseR, '#FFCC66', 0.85 * innerLight);
          PAPERCUT.heart(ctx, 0, -1.65 * u0, u0 * 1.05 * innerLight * pulseR, 0, '#E84838', '#FFF2CC');
        }

        // Optional Shadow-Puppet brass rivets & bamboo control rods (皮影骨眼与签子)
        if (isPuppet) {
          SHADOW.joint(ctx, -4.6 * u0, -4.5 * u0, u0 * 0.24);
          SHADOW.joint(ctx, 4.6 * u0, -4.5 * u0, u0 * 0.24);
          SHADOW.joint(ctx, 0, -2.5 * u0, u0 * 0.22);
          SHADOW.rod(ctx, -5.8 * u0, -4.2 * u0, 1.62, u0 * 11);
          SHADOW.rod(ctx, 0, -2.5 * u0, 1.54, u0 * 10);
        }
        if (prevDraw) prevDraw(u0, sw0);
      }
    });
  }

  function maidenClawd(x, y, u, o = {}) {
    const prevDraw = o.draw;
    const isPuppet = !!o.puppet;
    const alpha = o.alpha ?? 1;
    if (alpha <= 0.01) return;
    const ctx = drawingContext;
    ctx.save();
    if (alpha < 0.999) ctx.globalAlpha = clamp(alpha);
    clawd(x, y, u, {
      col: '#E4788C', dk: '#A83E54', lt: '#FAD2DC',
      boilKey: o.boilKey || 'maiden',
      ...o,
      draw(u0, sw0) {
        // Crimson silk ribbon bow & Red Papercut Plum-Blossom Hairpin (剪纸梅花簪)
        const hx = 2.4 * u0, hy = -8.25 * u0;
        const flutter = Math.sin(T * 6.2) * 0.45 * u0;
        inkLine([[hx, hy], [hx + 2.2 * u0, hy - 0.8 * u0 + flutter], [hx + 3.8 * u0, hy + 0.3 * u0 - flutter]], sw0 * 1.0, '#D2201F', 'ink', 0.5);
        for (const s of [-1, 1]) {
          paint([[hx, hy], [hx + s * 1.75 * u0, hy - 1.15 * u0], [hx + s * 1.75 * u0, hy + 0.95 * u0]], {
            wash: '#D2201F', fill: '#FF8AA0', fillOp: 70, ink: PAL.ink, sw: sw0 * 0.65, curv: 0.3
          });
        }
        PAPERCUT.plum(ctx, hx, hy, u0 * 0.85, 5, '#FFF5E2');

        if (isPuppet) {
          SHADOW.plum(ctx, 0, -3.2 * u0, u0 * 0.65, '#FFF2C8');
          SHADOW.joint(ctx, -4.6 * u0, -4.5 * u0, u0 * 0.24);
          SHADOW.joint(ctx, 4.6 * u0, -4.5 * u0, u0 * 0.24);
          SHADOW.rod(ctx, 5.8 * u0, -4.2 * u0, 1.50, u0 * 11);
          SHADOW.rod(ctx, 0, -2.5 * u0, 1.58, u0 * 10);
        }
        if (prevDraw) prevDraw(u0, sw0);
      }
    });
    ctx.restore();
  }

  // ---------- Shared Set Pieces ----------
  // Curved island planet hill with ink-wash shading, hemp-fiber 披麻皴, moss dots 苔点 & swaying reeds
  function inkIsland(cx, cy, rx, ry, col, t, o = {}) {
    const ctx = drawingContext;
    const nightMix = o.night ?? 0.5;
    boilSeed('island_' + Math.round(cx));
    const topCol = mixCol(col, '#1E2E3E', nightMix * 0.45);
    const botCol = mixCol(col, '#0E1622', 0.45 + nightMix * 0.35);
    paint(ellPts(cx, cy, rx, ry, 44, 2), {
      wash: topCol, fill: botCol, fillOp: 120, bleed: 0.08, tex: 0.6, ink: PAL.ink, sw: 1.15
    });
    // Hemp-fiber texture strokes (披麻皴) + moss dots (苔点) along the upper curve
    const ridgeFn = x => cy - ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / rx, 2)));
    INK.cun(ctx, ridgeFn, cx - rx * 0.72, cx + rx * 0.72, cy - ry * 0.15, {
      seed: 17, tone: INK.TONE.zhong * 0.65, count: o.cunCount ?? 22, dots: o.dots ?? 18, col: '#18242C'
    });
    // Swaying ink grass / shore reeds
    const tufts = o.tufts ?? 14;
    for (let i = 0; i < tufts; i++) {
      const a = -Math.PI / 2 + (hash(i + 41) - 0.5) * 1.35;
      const gx = cx + Math.cos(a) * rx, gy = cy + Math.sin(a) * ry + 4;
      const sway = wob(t, 0.55, hash(i) * 3) * 6;
      for (const k of [-1, 0, 1]) {
        inkLine([[gx + k * 7, gy], [gx + k * 11 + sway, gy - 20 - 9 * hash(i + k)]], 0.75, mixCol(col, PAL.cream, 0.4), 'inkfine', 0.4);
      }
    }
  }

  const islandY = (x, cx, cy, rx, ry) => cy - ry * Math.sqrt(Math.max(0, 1 - Math.pow((x - cx) / rx, 2)));

  // Starfield on Xuan paper / night sky
  function drawStars(t, count = 42, alpha = 1) {
    if (alpha <= 0.02) return;
    for (let i = 0; i < count; i++) {
      boilSeed('st_' + i);
      const x = hash(i * 3 + 7) * (W + 800) - 400;
      const y = hash(i * 5 + 19) * (H * 0.72) - 180;
      const tw = (0.5 + 0.5 * Math.sin(t * (2.2 + 2.0 * hash(i + 91)) + i)) * alpha;
      const r = (2.8 + 4.5 * hash(i + 211)) * tw;
      paint(starPts(x, y, r, 0.34, 4), {
        wash: i % 5 === 0 ? '#FFE394' : PAL.cream, washOp: Math.min(255, Math.round(160 + 95 * tw)), ink: null
      });
    }
  }

  // Drifting red plum petals (落梅花瓣)
  function drawPetals(ctx, t, count = 16, xSpread = W, ySpread = H, windX = 38, col = '#D9383A') {
    for (let i = 0; i < count; i++) {
      const ph = frac(t * (0.14 + 0.06 * hash(i * 11)) + hash(i * 29));
      const px = ((hash(i * 43) * xSpread + ph * windX * 6 + Math.sin(t * 2.2 + i) * 28) % xSpread + xSpread) % xSpread;
      const py = ph * ySpread;
      const rot = t * (1.8 + hash(i * 7)) + i;
      PAPERCUT.teardrop(ctx, px, py, 4.5 + 3 * hash(i), 11 + 5 * hash(i), rot, i % 3 === 0 ? '#F4B860' : col);
    }
  }

  // ============================================================================
  // SHOT 1 (0.00 - 8.60s): 寒江孤屿 · Solitary Ink-Wash Island & Shooting Star
  // Lyrics 1-2: 我们都是渺小真实存在 (1.33-4.79) / 祈愿小世界里不只有挫败 (4.83-8.58)
  // ============================================================================
  function shot01(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = kf(lt, [[0, 0.94], [4.8, 1.0], [8.6, 1.05]]);
    camBegin(960, kf(lt, [[0, 545], [8.6, 525]]), zoom);

    // Indigo-ink Xuan paper ground
    INK.ricePaper(ctx, W, H, 0.84, 0);
    drawStars(t, 44, 0.9);

    // Pale Xuan-paper crescent moon with soft halo
    glow(290, 175, 130, '#FFF2C6', 0.45);
    paint(ellPts(290, 175, 58, 58, 24, 1.2), { wash: '#F6EFE0', fill: '#E8AA38', fillOp: 45, ink: PAL.ink, sw: 0.75 });

    // Distant shanshui mountain layers (远山如黛) + rolling night sea waves around the solitary island
    INK.mountainLayer(ctx, { yBase: 660, amp: 190, freq: 0.0022, seed: 3, tone: INK.TONE.dan, fadeY: 860, col: '#24384E', mistCol: '#162233' });
    INK.mountainLayer(ctx, { yBase: 725, amp: 145, freq: 0.0031, seed: 9, tone: INK.TONE.zhong, fadeY: 910, col: '#18283A', mistCol: '#162233' });
    INK.wave(ctx, 775, W, H, t * 1.4, { amp: 22, crests: 8, tone: INK.TONE.zhong, col: '#24465E', seed: 15 });
    INK.wave(ctx, 835, W, H, -t * 1.7, { amp: 26, crests: 7, tone: INK.TONE.nong, col: '#1A3448', seed: 19 });

    // Overhanging cliff pine on the left
    INK.pine(ctx, 110, 560, 210, 0.16 + Math.sin(t * 1.8) * 0.02, 12, { p: clamp(lt / 1.4), col: '#0E1722' });

    // Solitary ink-wash island planet
    const ISL = [960, 990, 780, 220];
    inkIsland(...ISL, '#385864', t, { night: 0.65, tufts: 16 });
    drawPetals(ctx, t, 12, W, H, 35, '#8EC3E6');

    // Dark ink storm cloud hovering over Ink-Scholar Clawd + falling silver rain threads
    const cloudFade = 1 - seg(lt, 6.8, 8.2);
    if (cloudFade > 0.02) {
      const cx = 960 + Math.sin(t * 1.4) * 14, cy = 435 + Math.cos(t * 1.9) * 8;
      // Rain threads
      ctx.save();
      ctx.strokeStyle = `rgba(175, 205, 230, ${(0.52 * cloudFade).toFixed(3)})`;
      ctx.lineWidth = 2.0;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 18; i++) {
        const rx = cx - 105 + (i / 17) * 210 + Math.sin(i * 3) * 6;
        const ph = frac(t * 2.8 + hash(i * 19));
        const ry0 = cy + 35 + ph * 240;
        const ry1 = Math.min(765, ry0 + 34);
        if (ry1 > ry0) { ctx.moveTo(rx, ry0); ctx.lineTo(rx - 6, ry1); }
      }
      ctx.stroke();
      ctx.restore();

      // Ink rain cloud body
      INK.washBlob(ctx, cx, cy, 145, 52, { tone: INK.TONE.nong * cloudFade, seed: 23, col: '#1A2636' });
      INK.washBlob(ctx, cx - 45, cy - 12, 85, 42, { tone: INK.TONE.zhong * cloudFade, seed: 29, col: '#2D3E54' });
    }

    // Shooting star (7.0s -> 8.5s) arcing across the night sky, inspiring hope
    if (lt > 6.7) {
      const sk = easeOut(seg(lt, 6.7, 8.45));
      const sx = lerp(1690, 420, sk), sy = lerp(110, 310, sk) - Math.sin(sk * Math.PI) * 90;
      const trail = [];
      for (let k = 7; k >= 0; k--) {
        const tk = clamp(sk - k * 0.035);
        trail.push([lerp(1690, 420, tk), lerp(110, 310, tk) - Math.sin(tk * Math.PI) * 90]);
      }
      paint(ribbon(trail, 2, 22), { wash: '#FFF4D0', fill: '#E8AA38', fillOp: 120, ink: null });
      glow(sx, sy, 95, '#FFD86B', 0.85);
      paint(starPts(sx, sy, 22, 0.38, 5, t * 6), { wash: '#FFF8E2', fill: '#E8AA38', fillOp: 110, ink: PAL.ink, sw: 0.7 });
    }

    // Ink-Scholar Clawd acting on the island
    const u = 18.5, x = 960 + Math.sin(t * 1.6) * 14, gy = islandY(x, ...ISL) + 6;
    const mood = emotions(lt, [
      [0.0, 'sad'],
      [4.83, 'thinking', { lookX: -0.3, lookY: -0.5, gloom: 0.2 }],
      [6.85, 'surprised', { lookX: 0.5, lookY: -0.8 }],
      [7.55, 'hopeful', { lookX: -0.4, lookY: -0.8 }]
    ]);
    scholarClawd(x, gy, u, { ...move('sway', t, 0), ...mood, bambooHat: lt < 7.2 });

    const eyeScreen = toScreen(x, gy - 4 * u);
    camEnd();

    // Opening moon-gate iris (0.0 -> 0.88s)
    if (lt < 0.88) {
      const r = lerp(0, 1450, easeIn(lt / 0.88));
      iris(eyeScreen[0], eyeScreen[1], r, '#121318');
      if (r > 12 && r < 1150) inkLine(ellPts(eyeScreen[0], eyeScreen[1], r, r, 40), 1.3, '#E8AA38', 'ink', 0);
    }
  }

  // ============================================================================
  // SHOT 2 (8.60 - 15.62s): 沧海初遇 · Meeting Cinnabar-Maiden & Boundless Sea Sunrise
  // Lyrics 3-4: 直到遇见你我以为就光明起来 (8.62-11.79) / 眼睛里看到的都是广袤无垠的大海 (11.83-15.62)
  // ============================================================================
  function shot02(t, lt, dur) {
    const ctx = drawingContext;
    const tCloseStart = 3.23; // t = 11.83s
    const tWideStart = 5.05;  // t = 13.65s

    if (lt < tCloseStart) {
      // Phase A (8.60 - 11.83s): Cinnabar-Maiden arrives; sky warms from indigo night to rosy-ochre dawn
      const warmK = ease(seg(lt, 0, 2.8));
      camBegin(960, lerp(535, 515, warmK), lerp(1.0, 1.06, warmK));
      INK.ricePaper(ctx, W, H, lerp(0.75, 0.15, warmK), warmK * 0.85);
      drawStars(t, 30, 1 - warmK * 0.85);

      // Rising dawn glow on horizon
      glow(960, 680, 380 + 220 * warmK, '#F6B868', 0.35 + 0.5 * warmK);
      INK.mountainLayer(ctx, { yBase: 680, amp: 165, freq: 0.0025, seed: 14, tone: INK.TONE.dan, fadeY: 900, col: mixCol('#24384E', '#8A5A44', warmK), mistCol: '#F2DEC4' });

      // Minimalist ink sampan at left water edge
      INK.sampan(ctx, lerp(220, 340, easeOut(lt / 3.2)), 790 + Math.sin(t * 2.5) * 5, 1.15, Math.sin(t * 2) * 0.03);

      const ISL = [960, 990, 790, 220];
      inkIsland(...ISL, mixCol('#385864', '#5A8F68', warmK), t, { night: 0.4 * (1 - warmK), tufts: 16 });

      const u = 18.5;
      const sx = lerp(930, 875, ease(seg(lt, 0.2, 2.2)));
      const mx = lerp(1280, 1045, easeOut(seg(lt, 0.0, 2.1)));
      const sMood = emotions(lt, [[0, 'surprised', { lookX: 0.7 }], [0.9, 'hopeful', { lookX: 0.6 }], [2.0, 'happy', { lookX: 0.5, blush: 0.6 }]]);
      const mMood = emotions(lt, [[0, 'happy', { lookX: -0.6 }], [1.8, 'love', { lookX: -0.5 }]]);

      scholarClawd(sx, islandY(sx, ...ISL) + 6, u, { ...sMood, view: lt < 1.8 ? 'q' : 'front' });
      maidenClawd(mx, islandY(mx, ...ISL) + 6, u, {
        ...mMood,
        view: lt < 2.0 ? 'q' : 'front',
        flip: true,
        walk: lt < 2.0 ? lt * 1.8 : null
      });
      drawPetals(ctx, t, 14, W, H, 32, '#E04858');
      camEnd();
    } else if (lt < tWideStart) {
      // Phase B (11.83 - 13.65s): Dramatic close-up on sparkling eyes reflecting the boundless sea (Peak 2 Part 1)
      const sub = lt - tCloseStart; // 0 .. 1.82s
      const pushK = easeIn(seg(sub, 0, 1.65));
      const zoom = lerp(1.12, 1.85, pushK);
      camBegin(960, lerp(520, 445, pushK), zoom);

      INK.ricePaper(ctx, W, H, 0.08, 0.95);
      glow(960, 520, 620, '#F8C472', 0.75);
      // Shimmering ocean waves reflected in the background behind the close-up
      INK.wave(ctx, 680, W, H, t * 1.4, { amp: 24, crests: 7, tone: INK.TONE.dan, col: '#2D687A', seed: 5 });
      INK.wave(ctx, 760, W, H, t * 1.7, { amp: 28, crests: 6, tone: INK.TONE.zhong, col: '#245264', seed: 11 });

      const ISL = [960, 1020, 820, 220];
      inkIsland(...ISL, '#5A8F68', t, { night: 0.05, tufts: 10 });

      const u = 24;
      scholarClawd(960, islandY(960, ...ISL) + 8, u, {
        ...feel('starstruck', t, { eyes: 'shine', mouth: 'o', blush: 0.7 })
      });
      camEnd();

      // Golden sunrise flash bridging the eye close-up to the wide ocean reveal (matching 13.5-13.7s in reference)
      if (sub > 1.45) {
        flash(Math.sin(seg(sub, 1.45, 1.82) * Math.PI) * 0.92, '#FFF4D2');
      }
    } else {
      // Phase C (13.65 - 15.62s): Wide shot of both watching the vermilion sunrise over the Song-dynasty ocean (Peak 2 Part 2)
      const sub = lt - tWideStart;
      camBegin(960, 530, lerp(1.04, 0.98, easeOut(sub / 1.8)));

      // Golden-cinnabar dawn sky on Xuan paper
      INK.ricePaper(ctx, W, H, 0.0, 1.0);
      const sunY = lerp(560, 470, easeOut(sub / 1.9));
      glow(960, sunY, 540, '#FFCA68', 0.9);
      // Giant Vermilion & Gold Sun (朱砂日轮)
      paint(ellPts(960, sunY, 155, 155, 36, 2), { wash: '#E0482D', fill: '#F8C858', fillOp: 130, bleed: 0.2, ink: null });
      paint(ellPts(960, sunY, 118, 118, 32, 1.5), { wash: '#FFE28A', ink: null });

      // Multi-layered Song-dynasty ocean waves (广袤无垠的大海)
      INK.wave(ctx, 590, W, H, t * 1.1, { amp: 18, crests: 9, tone: INK.TONE.dan, col: '#C87A42', seed: 21, foam: false });
      INK.wave(ctx, 650, W, H, t * 1.3, { amp: 24, crests: 8, tone: INK.TONE.zhong, col: '#3B7A82', seed: 31 });
      INK.wave(ctx, 725, W, H, t * 1.5, { amp: 28, crests: 7, tone: INK.TONE.nong, col: '#245468', seed: 41 });
      INK.wave(ctx, 800, W, H, t * 1.8, { amp: 30, crests: 6, tone: INK.TONE.nong, col: '#183B4E', seed: 51 });

      // Foreground green-and-ochre shore
      const SHORE = [960, 1085, 960, 220];
      inkIsland(...SHORE, '#5E9664', t, { night: 0, tufts: 14 });

      // Both characters from behind (view: 'back'), leaning warmly together watching the ocean sunrise
      const u = 18;
      scholarClawd(902, 878, u, { view: 'back', rot: 0.04, dy: -0.25 * Math.abs(Math.sin(t * 3)), aL: -0.3, aR: 0.2 });
      maidenClawd(1014, 878, u, { view: 'back', rot: -0.05, dy: -0.25 * Math.abs(Math.cos(t * 3)), aL: 0.2, aR: -0.3, emote: 'hearts' });

      // Vermilion seal stamp in upper right
      INK.seal(ctx, 1750, 145, 56, ['潮', '汐'], 11);
      camEnd();

      if (sub < 0.28) {
        flash((1 - sub / 0.28) * 0.85, '#FFF4D2');
      }
    }

    // 5-band diagonal brush wipe into Shot 3 (15.32 - 15.62s)
    if (lt > dur - 0.32) {
      brushWipe((lt - (dur - 0.32)) / 0.64, ['#C83E2B', '#E8AA38']);
    }
  }

  // ============================================================================
  // SHOT 3 (15.62 - 19.10s): 窗花良辰 · Red Papercut Festive Hill Dance
  // Lyric 5: 有你在的日子里不可能被取代 (15.67-19.08)
  // ============================================================================
  function shot03(t, lt, dur) {
    const ctx = drawingContext;
    const t2 = onTwos(t); // 12fps tactile papercut boil feel
    camBegin(960 + Math.sin(lt * 2.2) * 12, 535, 1.0 + 0.03 * Math.sin(lt * 3.1));

    // Warm Xuan-cream backing paper
    INK.ricePaper(ctx, W, H, 0.0, 0.35);

    // Rotating 8-fold Red Papercut Tuanhua rosettes (团花) in the sky
    PAPERCUT.tuanhua(ctx, 960, 265, 165, t2 * 0.28, PAPERCUT.PAL.red, PAPERCUT.PAL.cream, 0.92);
    PAPERCUT.tuanhua(ctx, 360, 220, 88, -t2 * 0.35, PAPERCUT.PAL.gold, PAPERCUT.PAL.cream, 0.85);
    PAPERCUT.tuanhua(ctx, 1560, 220, 88, t2 * 0.35, PAPERCUT.PAL.gold, PAPERCUT.PAL.cream, 0.85);

    // Festive spring hill with serrated papercut saw-tooth border (锯齿纹) & plum blossoms
    const HILL = [960, 1015, 860, 240];
    paint(ellPts(...HILL, 44, 2), { wash: '#5E9A62', fill: '#3B6E4C', fillOp: 100, ink: PAL.ink, sw: 1.2 });
    for (let i = -5; i <= 5; i++) {
      const hx = 960 + i * 115, hy = islandY(hx, ...HILL) + 28;
      PAPERCUT.plum(ctx, hx, hy, 14, 5, '#FFF5E2');
    }
    PAPERCUT.sawRow(ctx, 320, 865, 1600, 865, 36, -16, '#D2201F');

    // Floating folk papercut hearts (剪纸喜心) rising between the two dancers
    for (let i = 0; i < 7; i++) {
      const ph = frac(lt * 0.48 + i / 7);
      const hx = 960 + (i - 3) * 110 + Math.sin(t * 3 + i) * 26;
      const hy = lerp(740, 180, ph);
      const hr = (18 + 10 * (i % 2)) * Math.sin(ph * Math.PI);
      PAPERCUT.heart(ctx, hx, hy, hr, Math.sin(t * 2 + i) * 0.22, i % 2 ? '#D2201F' : '#E85242', '#FFF5E2');
    }

    // Both characters dancing joyfully on the hill
    const u = 19.5;
    const sx = 835, mx = 1085;
    scholarClawd(sx, islandY(sx, ...HILL) + 6, u, {
      ...feel('happy', t, { blush: 0.7 }),
      ...move('bounce', t, 0)
    });
    maidenClawd(mx, islandY(mx, ...HILL) + 6, u, {
      ...feel('love', t),
      ...move('sway', t, 1)
    });

    drawPetals(ctx, t, 14, W, H, 28, '#D2201F');
    camEnd();

    // Traditional Red Papercut Window-Flower Corner Frame (窗花四角边框)
    PAPERCUT.cornerFrame(ctx, W, H, 20, PAPERCUT.PAL.red, PAPERCUT.PAL.cream);

    if (lt < 0.32) {
      brushWipe(0.5 + lt / 0.64, ['#C83E2B', '#E8AA38']);
    }
  }

  // ============================================================================
  // SHOT 4 (19.10 - 25.48s): 油纸伞与拨云见日 · Jiangnan Umbrella & Parting the Storm
  // Lyrics 6-7: 在最灰暗的日子你陪着我发呆 (19.12-22.42) / 你让我学会如何拨开阴霾 (22.46-25.46)
  // ============================================================================
  function shot04(t, lt, dur) {
    const ctx = drawingContext;
    const tPart = 3.36; // t = 22.46s (Peak 3: pushing storm clouds apart)
    const clearK = easeIn(seg(lt, tPart, tPart + 1.45));
    const zoom = kf(lt, [[0, 1.05], [tPart, 1.08], [dur, 0.98]]);
    camBegin(960, kf(lt, [[0, 545], [tPart, 535], [dur, 515]]), zoom);

    // Background transitions from gloomy storm grey-indigo to warm sunny Xuan paper as clouds are parted!
    INK.ricePaper(ctx, W, H, 0.68 * (1 - clearK), clearK * 0.75);

    // Radiant golden Tuanhua sun revealed behind the parting storm clouds
    if (clearK > 0.05) {
      glow(960, 250, 480 * clearK, '#FFD268', 0.85 * clearK);
      PAPERCUT.tuanhua(ctx, 960, 250, 140 * backOut(clearK), t * 0.3, '#E8AA38', '#FFF6DC', clearK);
    }

    const HILL = [960, 1005, 840, 235];
    inkIsland(...HILL, mixCol('#425A64', '#5E9A62', clearK), t, { night: 0.55 * (1 - clearK), tufts: 15 });

    // Parting Ink Storm Clouds (拨开阴霾) + Rain before tPart
    const cloudSplit = clearK * 820;
    const rainAlpha = 1 - seg(lt, tPart - 0.1, tPart + 0.5);
    if (rainAlpha > 0.02) {
      ctx.save();
      ctx.strokeStyle = `rgba(170, 198, 224, ${(0.48 * rainAlpha).toFixed(3)})`;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i < 36; i++) {
        const rx = 220 + (i / 35) * 1480;
        const ph = frac(t * 3.1 + hash(i * 13));
        const ry0 = 180 + ph * 560;
        // Umbrella shields the center region [810..1130] below y = 510!
        const maxY = (rx > 805 && rx < 1135 && lt > 0.4) ? 495 : 790;
        if (ry0 < maxY) {
          ctx.moveTo(rx, ry0);
          ctx.lineTo(rx - 8, Math.min(maxY, ry0 + 38));
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // Left & Right storm cloud banks pushed outward during [22.46 - 24.2s]
    if (clearK < 0.98) {
      INK.washBlob(ctx, 640 - cloudSplit, 240, 380, 110, { tone: INK.TONE.nong * (1 - clearK * 0.7), seed: 71, col: '#1C2838' });
      INK.washBlob(ctx, 1280 + cloudSplit, 240, 380, 110, { tone: INK.TONE.nong * (1 - clearK * 0.7), seed: 73, col: '#1C2838' });
      INK.washBlob(ctx, 960 - cloudSplit * 0.8, 190 - clearK * 180, 320, 95, { tone: INK.TONE.zhong * (1 - clearK), seed: 79, col: '#28384C' });
    }

    const u = 19;
    if (lt < tPart) {
      // Phase A (19.10 - 22.46s): Sitting together under the Jiangnan oiled-paper umbrella in the rain
      const enterK = easeOut(seg(lt, 0, 0.85));
      const sx = 895, mx = lerp(1180, 1025, enterK);
      const sgy = islandY(sx, ...HILL) + 6, mgy = islandY(mx, ...HILL) + 6;

      // Warm golden shelter glow beneath the umbrella
      glow((sx + mx) * 0.5, sgy - 90, 210 * enterK, '#FFCC68', 0.48 * enterK);

      scholarClawd(sx, sgy, u, {
        ...emotions(lt, [[0, 'sad', { gloom: 0.4 }], [0.9, 'bored', { lookX: 0.4, gloom: 0.1 }], [2.1, 'relieved', { lookX: 0.5, blush: 0.4 }]])
      });
      maidenClawd(mx, mgy, u, {
        ...feel('happy', t, { lookX: -0.5, blush: 0.6, aL: 1.15, aR: -0.2 })
      });

      // Jiangnan oiled-paper umbrella held overhead
      const ux = lerp(1150, 965, enterK), uy = lerp(sgy - 165, sgy - 175, enterK) + Math.sin(t * 2.5) * 4;
      PAPERCUT.umbrella(ctx, ux, uy, 165, -0.08 + Math.sin(t * 2) * 0.03, { col: '#E8AA38', trim: '#D2201F' });
    } else {
      // Phase B (22.46 - 25.48s): Pushing clouds away, tossing umbrella, and embracing in the sun
      const sub = lt - tPart;
      const tossK = easeOut(seg(sub, 0, 1.3));
      if (tossK < 0.98) {
        const up = arcPt([965, 610], [280, 190], 180, tossK);
        PAPERCUT.umbrella(ctx, up[0], up[1], 165 * (1 - tossK * 0.45), -0.1 - tossK * 4.2, { col: '#E8AA38', trim: '#D2201F' });
      }
      const hugK = ease(seg(sub, 0.9, 1.8));
      const sx = lerp(850, 912, hugK), mx = lerp(1070, 1008, hugK);
      const jmp = jump(sub, 0.05, 0.65, 2.6);

      scholarClawd(sx, islandY(sx, ...HILL) + 6, u, {
        ...emotions(sub, [[0, 'determined'], [0.85, 'excited'], [1.5, 'love']]),
        dy: jmp.dy, sq: jmp.sq,
        aL: sub < 0.9 ? 1.45 : 0.4, aR: sub < 0.9 ? 1.35 : 0.6
      });
      maidenClawd(mx, islandY(mx, ...HILL) + 6, u, {
        ...emotions(sub, [[0, 'excited'], [1.4, 'love']]),
        dy: jmp.dy, sq: jmp.sq,
        aL: sub < 0.9 ? 1.35 : 0.6, aR: sub < 0.9 ? 1.45 : 0.4
      });
      drawPetals(ctx, t, 18, W, H, 35, '#D2201F');
    }
    camEnd();
  }

  // ============================================================================
  // SHOT 5 (25.48 - 28.86s): 收集欢喜·挥毫破霾 · Celadon Jar & Batting Away Gloom
  // Lyrics 8-9: 将快乐全部收集 (25.50-26.96) / 将不开心全都淘汰 (27.00-28.83)
  // ============================================================================
  function shot05(t, lt, dur) {
    const ctx = drawingContext;
    const tBat = 1.50; // t = 26.98s (switch from collecting joy to batting away gloom)
    const shake = lt >= tBat && lt < tBat + 0.35 ? shakeXY(t, 9 * (1 - (lt - tBat) / 0.35)) : [0, 0];
    camBegin(960 + shake[0], 540 + shake[1], 1.04);

    INK.ricePaper(ctx, W, H, 0.04, 0.55);
    const HILL = [960, 1010, 850, 235];
    inkIsland(...HILL, '#589260', t, { night: 0.05, tufts: 14 });

    const u = 19;
    if (lt < tBat) {
      // Part A (25.48 - 26.98s): 将快乐全部收集 — Collecting papercut hearts & stars into the Celadon Jar (青瓷罐)
      const p = lt / tBat;
      PAPERCUT.tuanhua(ctx, 960, 235, 115, t * 0.4, '#E8AA38', '#FFF6DC', 0.75);

      // Celadon jar in the center between the two characters
      const jarX = 960, jarY = 742;
      PAPERCUT.jar(ctx, jarX, jarY, 68, 0.5 + 0.5 * p);

      // 6 hearts & stars arcing from around the sky into the jar mouth
      const origins = [[520, 280], [1400, 260], [640, 190], [1280, 210], [460, 420], [1460, 400]];
      for (let i = 0; i < origins.length; i++) {
        const hk = clamp((p * 1.45) - i * 0.11);
        if (hk > 0 && hk < 1) {
          const pt = arcPt(origins[i], [jarX, jarY - 52], 140, easeIn(hk));
          const r = 24 * (1 - hk * 0.45);
          if (i % 2 === 0) PAPERCUT.heart(ctx, pt[0], pt[1], r, t * 3 + i, '#D2201F', '#FFF5E2');
          else paint(starPts(pt[0], pt[1], r, 0.4, 5, t * 4), { wash: '#FFE27A', fill: '#E8AA38', fillOp: 110, ink: PAL.ink, sw: 0.7 });
        }
      }

      scholarClawd(775, islandY(775, ...HILL) + 6, u, {
        ...feel('starstruck', t, { lookX: 0.6, aR: 1.25 + 0.25 * Math.sin(t * 10) })
      });
      maidenClawd(1145, islandY(1145, ...HILL) + 6, u, {
        ...feel('love', t, { lookX: -0.6, aL: 1.25 + 0.25 * Math.cos(t * 10) })
      });
    } else {
      // Part B (26.98 - 28.86s): 将不开心全都淘汰 — Batting away black ink-scribble gloom balls with a calligraphy brush!
      const sub = lt - tBat; // 0 .. 1.88s
      const swingPhase = Math.sin(sub * 9.5);

      // Sweeping calligraphy flying-white arc (挥毫飞白弧线)
      INK.stroke(ctx, [[680, 690], [880, 520], [1160, 450], [1440, 340]], {
        w: 22, tone: INK.TONE.nong, mode: 'brush', dry: 0.48, seed: 88, col: '#D2201F', p: clamp(sub * 1.4)
      });

      // 4 tangled black ink-scribble gloom balls (墨团阴霾) getting knocked off to the upper right
      for (let i = 0; i < 4; i++) {
        const hitT = 0.12 + i * 0.38;
        const gk = clamp((sub - hitT) / 0.55);
        const gx = gk <= 0 ? lerp(1120, 960, clamp((sub - (hitT - 0.25)) / 0.25)) : lerp(960, 1860, easeIn(gk));
        const gy = gk <= 0 ? 620 - i * 25 : lerp(620 - i * 25, 90 + i * 70, gk) - Math.sin(gk * Math.PI) * 160;
        if (gk < 0.98) {
          INK.washBlob(ctx, gx, gy, 44, 40, { tone: INK.TONE.jiao, seed: 100 + i, col: '#1C1824' });
          emote('scribble', gx, gy, 24, 1, t + i);
          if (gk > 0 && gk < 0.35) {
            paint(starPts(960, 590, 52 * (1 - gk * 2), 0.35, 6, gk * 5), { wash: '#FFE27A', ink: '#D2201F', sw: 1.1 });
          }
        }
      }

      // Ink-Scholar swinging a giant calligraphy brush (毛笔)
      scholarClawd(790, islandY(790, ...HILL) + 6, u, {
        ...feel('determined', t, { aR: 0.6 + 0.85 * swingPhase, aL: -0.3, rot: 0.08 * swingPhase }),
        armR(u0, sw0) {
          // Bamboo calligraphy brush handle + ink-dipped wolf-hair tip
          paint(rectPts(-0.4 * u0, -0.35 * u0, 5.2 * u0, 0.7 * u0), { wash: '#8C5A2B', ink: PAL.ink, sw: sw0 * 0.7 });
          paint([[4.8 * u0, -0.65 * u0], [7.2 * u0, 0], [4.8 * u0, 0.65 * u0]], { wash: '#171614', fill: '#D2201F', fillOp: 90, ink: PAL.ink, sw: sw0 * 0.7 });
        }
      });

      // Cinnabar-Maiden cheering on the right
      maidenClawd(1150, islandY(1150, ...HILL) + 6, u, {
        ...feel('excited', t),
        ...move('hop', t, 2)
      });
    }
    camEnd();
  }

  // ============================================================================
  // SHOT 6 (28.86 - 35.40s): 灯影情话与万朵烟花 · Shadow-Puppet Stage & Fireworks
  // Lyrics 10-11: 你对我说的情话 (28.88-31.46) / 像转瞬即逝的烟花 (31.50-35.38)
  // ============================================================================
  function shot06(t, lt, dur) {
    const ctx = drawingContext;
    const tFire = 2.62; // t = 31.48s (Peak 4: Fireworks chorus climax)
    const pullK = ease(seg(lt, tFire - 0.15, tFire + 0.95));
    const zoom = lerp(1.16, 0.94, pullK);
    const cy = lerp(595, 495, pullK);
    camBegin(960, cy, zoom);

    // Backlit Huaxian Shadow-Puppet screen: warm oil-lamp cotton during sweet words -> deep indigo night for fireworks
    SHADOW.backdrop(ctx, W, H, t, { night: lerp(0.22, 0.82, pullK), ly: lerp(0.55, 0.78, pullK) });

    if (lt < tFire + 0.4) {
      // Carved shadow-puppet pavilion eave & hanging lanterns (镂空亭阁与红灯笼) fading up as camera tilts to sky
      const pavY = lerp(180, -140, pullK);
      ctx.save();
      ctx.fillStyle = SHADOW.DYE.black.rgba(0.88);
      ctx.fillRect(260, pavY, 1400, 36);
      SHADOW.beads(ctx, 280, pavY + 18, 1640, pavY + 18, 34, 3.2, '#FCE5B4');
      SHADOW.cloud(ctx, 520, pavY + 42, 1.8, 1);
      SHADOW.cloud(ctx, 960, pavY + 42, 2.1, 1);
      SHADOW.cloud(ctx, 1400, pavY + 42, 1.8, -1);
      ctx.restore();
    }

    // Phase B (31.48 - 35.40s): 7 Translucent Shadow-Puppet Fireworks bursting across the night sky (Peak 4)
    if (lt >= tFire - 0.1) {
      drawStars(t, 36, pullK * 0.85);
      const bursts = [
        { t0: 2.75, x: 620,  y: 270, r: 175, col: '#E84A5F', seed: 1 },
        { t0: 3.15, x: 1290, y: 240, r: 185, col: '#F4B838', seed: 2 },
        { t0: 3.60, x: 940,  y: 195, r: 210, col: '#48B8E8', seed: 3 },
        { t0: 4.05, x: 480,  y: 340, r: 160, col: '#36C278', seed: 4 },
        { t0: 4.45, x: 1420, y: 320, r: 175, col: '#B868F0', seed: 5 },
        { t0: 4.85, x: 760,  y: 250, r: 195, col: '#FF9240', seed: 6 },
        { t0: 5.20, x: 1150, y: 215, r: 205, col: '#E84A5F', seed: 7 }
      ];
      for (const b of bursts) {
        const age = lt - b.t0;
        // Rising rocket trail before burst (-0.35 .. 0s)
        if (age > -0.35 && age < 0) {
          const rk = (age + 0.35) / 0.35;
          const ry = lerp(780, b.y, easeOut(rk));
          glow(b.x, ry, 45, b.col, 0.8);
          inkLine([[b.x, ry], [b.x, ry + 55]], 1.4, b.col, 'ink', 0);
        }
        if (age > 0) {
          SHADOW.firework(ctx, b.x, b.y, b.r, age / 1.85, b.col, b.seed);
        }
      }
    }

    // Carved shadow-puppet hill stage floor
    const HILL = [960, 1020, 820, 220];
    inkIsland(...HILL, mixCol('#7A4B24', '#243448', pullK), t, { night: 0.4 + 0.4 * pullK, tufts: 10 });
    SHADOW.beads(ctx, 420, 865, 1500, 865, 28, 3.0, '#F5D38E');

    const u = 18.5;
    if (lt < tFire) {
      // Phase A (28.86 - 31.48s): 你对我说的情话 — Cinnabar-Maiden whispering sweet words to blushing Ink-Scholar
      const lean = Math.sin(lt * 2.4) * 0.06;
      const sx = 890, mx = 1030;
      scholarClawd(sx, islandY(sx, ...HILL) + 6, u, {
        ...feel('shy', t, { eyes: 'happy', mouth: 'smile', blush: 1.0, lookX: 0.5 }),
        puppet: true
      });
      maidenClawd(mx, islandY(mx, ...HILL) + 6, u, {
        ...feel('love', t, { rot: -0.09 + lean, lookX: -0.6 }),
        puppet: true
      });

      // Floating whispered sweet-word glyphs & hearts (情话朱印字与红心)
      const glyphs = ['情', '心', '诺'];
      for (let i = 0; i < 3; i++) {
        const ph = frac(lt * 0.55 + i / 3);
        const gx = lerp(995, 835, ph), gy = 650 - ph * 115 + Math.sin(ph * TAU + i) * 12;
        PAPERCUT.heart(ctx, gx, gy, 15 * Math.sin(ph * Math.PI), 0, '#D2201F', '#FFF4D4');
        letter(glyphs[i], gx + 22, gy - 8, 28, '#FFE294', { alpha: Math.sin(ph * Math.PI) });
      }
    } else {
      // Watching the fireworks together side by side
      const sx = 905, mx = 1015;
      scholarClawd(sx, islandY(sx, ...HILL) + 6, u, {
        ...feel('starstruck', t, { lookY: -0.85, blush: 0.7 }),
        puppet: true
      });
      maidenClawd(mx, islandY(mx, ...HILL) + 6, u, {
        ...feel('love', t, { lookY: -0.85 }),
        puppet: true
      });
    }
    camEnd();
  }

  // ============================================================================
  // SHOT 7 (35.40 - 38.77s): 刹那芳华 · Single Giant Firework Fades & Maiden Vanishes
  // Lyric 12: 只停在绽放一刹那 (35.42-38.75)
  // ============================================================================
  function shot07(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = lerp(1.02, 1.12, ease(lt / dur));
    camBegin(960, 515, zoom);

    const fadeK = seg(lt, 1.35, 3.25); // 0 during peak bloom, -> 1 as firework dies into embers
    INK.ricePaper(ctx, W, H, lerp(0.82, 0.92, fadeK), 0);
    drawStars(t, 38, 0.4 + 0.5 * fadeK);

    // Colossal central firework at (960, 340) blooming and then dissolving into falling embers
    const bloomP = lt / 3.15;
    SHADOW.firework(ctx, 960, 340, 290, bloomP, '#F4B838', 99);
    if (fadeK < 0.75) {
      PAPERCUT.tuanhua(ctx, 960, 340 + bloomP * bloomP * 38, 125 * easeOut(clamp(lt * 1.8)), t * 0.4, '#D2201F', '#FFF4D0', (1 - fadeK / 0.75) * 0.85);
    }

    // Falling ash & golden-vermilion embers after peak bloom (1.2s -> 3.37s)
    if (lt > 1.0) {
      const ek = seg(lt, 1.0, dur);
      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * TAU + hash(i) * 0.5;
        const dist = (60 + 240 * hash(i + 17)) * Math.pow(ek, 0.65);
        const ex = 960 + Math.cos(a) * dist + Math.sin(t * 3 + i) * 10;
        const ey = 340 + Math.sin(a) * dist * 0.75 + ek * ek * 260;
        const er = (2.5 + 3.5 * hash(i + 31)) * (1 - ek * 0.75);
        if (er > 0.6) {
          paint(ellPts(ex, ey, er, er, 8), {
            wash: i % 2 ? '#F4B838' : '#E04838', washOp: Math.round(230 * (1 - ek * 0.8)), ink: null
          });
        }
      }
    }

    const HILL = [960, 1020, 820, 220];
    inkIsland(...HILL, '#2B3E4E', t, { night: 0.78, tufts: 12 });

    const u = 19;
    const sx = 895, mx = 1035;
    // Cinnabar-Maiden dissolves into drifting red plum petals between lt = 1.3s and 2.8s!
    const maidenAlpha = 1 - ease(seg(lt, 1.25, 2.75));
    maidenClawd(mx + (1 - maidenAlpha) * 55, islandY(mx, ...HILL) + 6, u, {
      ...feel('sad', t, { lookX: -0.6, emote: null }),
      alpha: maidenAlpha
    });

    // Stream of red petals carrying her silhouette away to the right
    if (lt > 1.1) {
      const pk = seg(lt, 1.1, 3.2);
      for (let i = 0; i < 16; i++) {
        const px = mx + (pk * 380) * (0.4 + 0.6 * hash(i * 7)) + Math.sin(t * 4 + i) * 18;
        const py = 740 - i * 8 - pk * 140 + Math.cos(t * 3 + i) * 16;
        PAPERCUT.teardrop(ctx, px, py, 5, 13, t * 3 + i, i % 3 === 0 ? '#F4B860' : '#D2201F');
      }
    }

    // Ink-Scholar turns right and reaches out as she vanishes
    scholarClawd(sx, islandY(sx, ...HILL) + 6, u, {
      ...emotions(lt, [[0, 'starstruck', { lookY: -0.7 }], [1.35, 'surprised', { lookX: 0.8 }], [2.1, 'sad', { lookX: 0.8, aR: 1.15 }]])
    });
    camEnd();
  }

  // ============================================================================
  // SHOT 8 (38.77 - 42.56s): 墨海潮汐 · Rising Song-Dynasty Ink Tide Submerging Scholar
  // Lyric 13: 我却已无法自拔 (38.79-42.54)
  // ============================================================================
  function shot08(t, lt, dur) {
    const ctx = drawingContext;
    const riseK = easeIn(seg(lt, 0, 2.85)); // Tide rises from bottom to top of frame!
    camBegin(960 + Math.sin(t * 2.1) * 10, 545, lerp(1.04, 1.12, riseK));

    INK.ricePaper(ctx, W, H, 0.88, 0);
    drawStars(t, 28, 1 - riseK * 0.7);

    const HILL = [960, 1020, 820, 220];
    inkIsland(...HILL, '#263848', t, { night: 0.8, tufts: 10 });

    // Back wave layers (behind Ink-Scholar)
    const waterTop = lerp(860, 175, riseK);
    INK.wave(ctx, waterTop + 95, W, H, t * 1.6, { amp: 32, crests: 7, tone: INK.TONE.zhong, col: '#22445E', seed: 101 });
    INK.wave(ctx, waterTop + 45, W, H, t * 1.9, { amp: 36, crests: 6, tone: INK.TONE.nong, col: '#1A364C', seed: 103 });

    // Ink-Scholar Clawd standing on the island as the tide rises over him, heart-eyes glowing through the water
    const u = 23, sx = 960, sgy = islandY(sx, ...HILL) + 10;
    const sinkY = sgy + riseK * 42;
    scholarClawd(sx, sinkY, u, {
      eyes: 'heart', mouth: 'wobble', gloom: 0.35, blush: 0.6,
      dy: Math.sin(t * 3.2) * 0.4,
      aL: 0.85 + 0.25 * Math.sin(t * 4),
      aR: 0.85 + 0.25 * Math.cos(t * 4)
    });

    // Foreground translucent ink-indigo wave layers washing over Ink-Scholar!
    ctx.save();
    ctx.globalAlpha = 0.68;
    INK.wave(ctx, waterTop, W, H, t * 2.2, { amp: 38, crests: 6, tone: INK.TONE.nong, col: '#142A3E', seed: 107 });
    ctx.globalAlpha = 0.52;
    INK.wave(ctx, waterTop + 140, W, H, -t * 1.8, { amp: 28, crests: 8, tone: INK.TONE.jiao, col: '#0D1C2C', seed: 109 });
    ctx.restore();

    // Glowing heart-eyes shining through the deep water + rising air bubbles & drifting red petals
    if (riseK > 0.35) {
      glow(sx - 2.5 * u, sinkY - 6 * u, 42, '#FF5E7E', 0.75);
      glow(sx + 2.5 * u, sinkY - 6 * u, 42, '#FF5E7E', 0.75);
      for (let i = 0; i < 14; i++) {
        const ph = frac(lt * 0.65 + i / 14);
        const bx = sx + (hash(i * 17) - 0.5) * 320 + Math.sin(t * 4 + i) * 16;
        const by = lerp(sinkY - 80, waterTop + 20, ph);
        const br = 4 + 6 * hash(i * 23);
        if (by > waterTop) {
          paint(ellPts(bx, by, br, br, 10), { wash: '#D8EEFF', washOp: 165, ink: '#FFFFFF', sw: 0.5 });
        }
      }
    }
    camEnd();
  }

  // ============================================================================
  // SHOT 9 (42.56 - 44.65s): 昼夜时差太极卷 · Split-Screen Day/Night Time-Zone Planet
  // Lyric 14: 我们的爱总有时差 (42.58-44.62)
  // ============================================================================
  function shot09(t, lt, dur) {
    const ctx = drawingContext;
    const p = lt / dur;
    camBegin(960, 540, 1.0);

    // ---- LEFT HALF (0 .. 960): Warm Xuan-Paper & Red Papercut Daylight with Cinnabar-Maiden ----
    ctx.save();
    ctx.beginPath();
    ctx.rect(-100, -100, 1060, H + 200);
    ctx.clip();

    INK.ricePaper(ctx, W, H, 0.0, 0.75);
    glow(360, 230, 320, '#FFD268', 0.75);
    PAPERCUT.tuanhua(ctx, 360, 230, 118, t * 0.45, '#D2201F', '#FFF6DC', 0.92);
    drawPetals(ctx, t, 10, 960, H, 24, '#D2201F');

    const LHILL = [480, 1010, 620, 230];
    inkIsland(...LHILL, '#64A266', t, { night: 0, tufts: 10 });
    PAPERCUT.sawRow(ctx, 60, 865, 920, 865, 20, -14, '#D2201F');

    const mx = lerp(340, 620, p), mgy = islandY(mx, ...LHILL) + 6;
    maidenClawd(mx, mgy, 19.5, {
      ...feel('happy', t, { lookX: 0.7 }),
      view: 'q', walk: t * 1.6
    });
    INK.seal(ctx, 110, 130, 48, ['昼', '暖'], 31);
    ctx.restore();

    // ---- RIGHT HALF (960 .. 1920): Cold Indigo Ink-Wash Night with Ink-Scholar ----
    ctx.save();
    ctx.beginPath();
    ctx.rect(960, -100, 1060, H + 200);
    ctx.clip();

    INK.ricePaper(ctx, W, H, 0.88, 0.0);
    drawStars(t, 28, 0.9);
    glow(1560, 230, 150, '#FFF2C6', 0.5);
    paint(ellPts(1560, 230, 56, 56, 24, 1.2), { wash: '#F6EFE0', fill: '#8EC3E6', fillOp: 45, ink: PAL.ink, sw: 0.75 });
    INK.mountainLayer(ctx, { yBase: 690, amp: 155, freq: 0.0028, seed: 44, tone: INK.TONE.zhong, fadeY: 910, col: '#1C2E42', mistCol: '#141E2C' });

    const RHILL = [1440, 1010, 620, 230];
    inkIsland(...RHILL, '#324E5E', t, { night: 0.75, tufts: 10 });

    const sx = lerp(1280, 1560, p), sgy = islandY(sx, ...RHILL) + 6;
    scholarClawd(sx, sgy, 19.5, {
      ...feel('sad', t, { lookX: -0.7, gloom: 0.25, emote: null }),
      view: 'q', flip: true, walk: t * 1.2
    });
    INK.seal(ctx, 1810, 130, 48, ['夜', '寒'], 37);
    ctx.restore();

    // ---- CENTER MERIDIAN (x = 960): Astronomical Time-Zone Divider (昼夜时差中轴线) ----
    inkLine([[960, -40], [960, H + 40]], 2.2, '#E8AA38', 'ink', 0);
    inkLine([[954, -40], [954, H + 40]], 0.9, '#D2201F', 'inkfine', 0);
    inkLine([[966, -40], [966, H + 40]], 0.9, '#23364E', 'inkfine', 0);

    // Rotating Sundial / Clock Medallion at (960, 480) showing the time difference (时差)
    glow(960, 480, 110, '#FFD268', 0.65);
    paint(ellPts(960, 480, 58, 58, 28, 1.5), { wash: '#1E1A24', fill: '#E8AA38', fillOp: 80, ink: '#E8AA38', sw: 1.4 });
    // Clock hands spinning at different rates
    const hAng = t * 2.5, mAng = -t * 6.0;
    inkLine([[960, 480], [960 + Math.cos(hAng) * 34, 480 + Math.sin(hAng) * 34]], 1.4, '#D2201F', 'ink', 0);
    inkLine([[960, 480], [960 + Math.cos(mAng) * 44, 480 + Math.sin(mAng) * 44]], 1.2, '#F4EFE3', 'ink', 0);
    camEnd();
  }

  // ============================================================================
  // SHOT 10 (44.65 - 56.00s): 放下与心灯自照 · Letting Go, Self-Love Lantern & Cosmic Pullback
  // Lyrics 15-16: 也为你骗自己放下 (44.67-48.58) / 爱炙热的你却忘了爱自己 (48.62-53.79)
  // ============================================================================
  function shot10(t, lt, dur) {
    const ctx = drawingContext;
    const tAwake = 3.97; // t = 48.62s (Peak 6: 爱炙热的你却忘了爱自己)
    const awakeK = ease(seg(lt, tAwake, tAwake + 2.4));
    const pullK = ease(seg(lt, tAwake + 1.0, dur - 0.5));
    const zoom = lerp(1.08, 0.70, pullK);
    camBegin(960, lerp(545, 515, pullK), zoom);

    // Indigo night scroll warming gently around the island as the inner self-love lantern ignites
    INK.ricePaper(ctx, W, H, lerp(0.86, 0.68, awakeK), awakeK * 0.45);
    drawStars(t, 48, 0.92);

    // Crescent moon & distant shanshui mountains + rolling night waves around the island
    glow(310, 180, 140, '#FFF2C6', 0.5);
    paint(ellPts(310, 180, 56, 56, 24, 1.2), { wash: '#F6EFE0', fill: '#E8AA38', fillOp: 45, ink: PAL.ink, sw: 0.75 });
    INK.mountainLayer(ctx, { yBase: 665, amp: 185, freq: 0.0023, seed: 53, tone: INK.TONE.dan, fadeY: 865, col: mixCol('#203246', '#4E5848', awakeK), mistCol: '#182434' });
    INK.wave(ctx, 775, W, H, t * 1.45, { amp: 22, crests: 8, tone: INK.TONE.zhong, col: mixCol('#224258', '#3B786C', awakeK), seed: 61 });
    INK.wave(ctx, 835, W, H, -t * 1.75, { amp: 25, crests: 7, tone: INK.TONE.nong, col: mixCol('#183044', '#2A5C54', awakeK), seed: 67 });
    INK.pine(ctx, 130, 565, 200, 0.15 + Math.sin(t * 1.8) * 0.02, 19, { p: 1, col: '#101822' });
    drawPetals(ctx, t, 14, W, H, 32, awakeK > 0.3 ? '#F4B860' : '#D9383A');

    // Solitary ink-wash island planet warming from cold slate to living jade-ochre
    const ISL = [960, 995, 760, 220];
    if (awakeK > 0.02) {
      glow(960, 690, 520 * awakeK, '#FFB858', 0.72 * awakeK);
    }
    inkIsland(...ISL, mixCol('#344E5C', '#5C9264', awakeK), t, { night: 0.65 * (1 - awakeK * 0.7), tufts: 16 });

    const u = 20.5, sx = 960, sgy = islandY(sx, ...ISL) + 6;

    if (lt < tAwake + 0.8) {
      // Phase A (44.65 - 49.4s): Floating crimson papercut heart above Ink-Scholar cracks and scatters into plum petals
      const crackK = seg(lt, 1.5, tAwake);
      const breakK = seg(lt, tAwake - 0.1, tAwake + 0.8);
      const hy = 420 + Math.sin(t * 2.6) * 8;
      if (breakK < 0.95) {
        const splitX = breakK * 48;
        ctx.save();
        ctx.globalAlpha = 1 - breakK;
        PAPERCUT.heart(ctx, 960 - splitX * 0.3, hy, 68, -breakK * 0.25, '#D2201F', '#FFF5E2');
        // Jagged golden-ink fracture line down the heart
        if (crackK > 0.05) {
          inkLine([
            [960, hy - 54],
            [952, hy - 22],
            [968, hy + 4],
            [955, hy + 32],
            [960, hy + 56 * crackK]
          ], 1.6, '#1C141B', 'ink', 0);
        }
        ctx.restore();
      }
    }

    // Phase B (48.62 - 56.00s): Scattered petals ascend into the cosmos as the Inner Heart-Lantern (心灯) ignites!
    if (lt >= tAwake - 0.1) {
      const sub = lt - tAwake;
      for (let i = 0; i < 20; i++) {
        const pk = frac(sub * 0.22 + i / 20);
        const ang = (i / 20) * TAU + sub * 0.4;
        const rad = 55 + pk * 420;
        const px = 960 + Math.cos(ang) * rad;
        const py = 580 + Math.sin(ang) * rad * 0.65 - pk * 180;
        PAPERCUT.teardrop(ctx, px, py, 5.5, 14, ang + t, i % 2 ? '#F4B860' : '#E03B2B');
      }
      // Subtle golden Tuanhua halo behind Ink-Scholar's awakened heart
      PAPERCUT.tuanhua(ctx, sx, sgy - 5.2 * u, 145 * awakeK, t * 0.25, '#E8AA38', '#FFF6DC', 0.45 * awakeK);
    }

    // Ink-Scholar Clawd: teary/sweating while trying to let go -> warm peaceful self-love glow
    const mood = emotions(lt, [
      [0.0, 'sad', { eyes: 'teary', emote: 'sweat', gloom: 0.3 }],
      [tAwake, 'surprised', { eyes: 'shine', emote: 'spark', gloom: 0 }],
      [tAwake + 1.1, 'happy', { eyes: 'happy', mouth: 'smile', blush: 0.75, emote: 'hearts' }]
    ]);
    scholarClawd(sx + Math.sin(t * 1.8) * 10, sgy, u, {
      ...move('sway', t, 0),
      ...mood,
      innerLight: awakeK
    });

    // Final Vermilion Seals (自爱 / 潮汐) in the cosmos during the outro pullback
    if (pullK > 0.25) {
      ctx.save();
      ctx.globalAlpha = clamp((pullK - 0.25) / 0.5);
      INK.seal(ctx, 1750, 145, 56, ['潮', '汐'], 11);
      INK.seal(ctx, 210, 860, 52, ['自', '爱'], 77);
      ctx.restore();
    }

    const eyeScreen = toScreen(sx, sgy - 4.2 * u);
    camEnd();

    // Closing moon-gate iris (54.4 -> 56.0s)
    if (lt > dur - 1.6) {
      const ik = seg(lt, dur - 1.6, dur - 0.08);
      const r = ik < 0.55 ? lerp(1550, 240, ease(ik / 0.55)) : lerp(240, 0, easeIn((ik - 0.55) / 0.45));
      iris(eyeScreen[0], eyeScreen[1], r, '#121318');
      if (r > 12 && r < 1150) inkLine(ellPts(eyeScreen[0], eyeScreen[1], r, r, 40), 1.3, '#E8AA38', 'ink', 0);
    }
  }

  // Register all 10 contiguous shots covering 0.00s .. 56.00s
  shots([
    [0.00,  shot01],
    [8.60,  shot02],
    [15.62, shot03],
    [19.10, shot04],
    [25.48, shot05],
    [28.86, shot06],
    [35.40, shot07],
    [38.77, shot08],
    [42.56, shot09],
    [44.65, shot10]
  ]);
})();
