// qunian_xiatian.js — 《去年夏天》(78.205s, 123.05 BPM, 16 Shots, 28 Kinetic Lyric Lines)
// Remake following /home/user/Claudemv/去年夏天.mp4:
//   - Keep the signature hand-drawn 2D outlined urban illustration style & kinetic golden pop-in subtitles
//   - Enrich architectural, seasonal, weather, and study-desk details ("细节改变下")
//   - Replace the human boy & girl with customized Clawd characters ("然后人物改变下clawd"):
//       * summerBoyClawd (晴蓝卫衣报童帽 Clawd, #4884C8, holding the iconic yellow umbrella & right half-heart)
//       * summerGirlClawd (暖橘娃娃领向日葵 Clawd, #E8785A, wearing sunflower hairpin & holding left half-heart)

(() => {
  const INK_DARK = '#21141E';
  const UMB_GOLD = '#F5C445';
  const UMB_DARK = '#C89224';

  // ============================================================================
  // 1. CUSTOMIZED CLAWD CAST & PROPS (晴蓝卫衣男主 Clawd & 暖橘花领女主 Clawd)
  // ============================================================================

  // Draw a golden half-heart or whole heart (side = 'left' | 'right' | 'whole' | 'broken')
  function drawGoldenHeart(ctx, x, y, r = 18, side = 'whole', rot = 0, alpha = 1) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(x, y);
    ctx.rotate(rot);

    const drawHalf = (isRight, ox = 0, oy = 0, ang = 0) => {
      const s = isRight ? 1 : -1;
      ctx.save();
      ctx.translate(ox, oy);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.32);
      ctx.bezierCurveTo(s * r * 0.55, -r * 1.05, s * r * 1.35, -r * 0.25, 0, r * 0.95);
      // Jagged center split line
      ctx.lineTo(s * r * 0.14, r * 0.45);
      ctx.lineTo(-s * r * 0.08, r * 0.05);
      ctx.lineTo(0, -r * 0.32);
      ctx.closePath();
      ctx.fillStyle = UMB_GOLD;
      ctx.fill();
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = Math.max(2.2, r * 0.16);
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    };

    if (side === 'left') {
      drawHalf(false);
    } else if (side === 'right') {
      drawHalf(true);
    } else if (side === 'broken') {
      drawHalf(false, -r * 0.32, 0, -0.18);
      drawHalf(true, r * 0.32, 0, 0.18);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.32);
      ctx.bezierCurveTo(-r * 0.55, -r * 1.05, -r * 1.35, -r * 0.25, 0, r * 0.95);
      ctx.bezierCurveTo(r * 1.35, -r * 0.25, r * 0.55, -r * 1.05, 0, -r * 0.32);
      ctx.closePath();
      ctx.fillStyle = UMB_GOLD;
      ctx.fill();
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = Math.max(2.4, r * 0.16);
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw the iconic Yellow Umbrella (open canopy, closed pointing down/side, wind-blown, or fallen on ground)
  function drawYellowUmbrella(ctx, x, y, sc = 1, mode = 'open', tilt = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.scale(sc, sc);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (mode === 'closed_down' || mode === 'closed_side' || mode === 'closing') {
      // Handle + folded yellow cone
      const dir = mode === 'closing' ? -1 : 1;
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, dir * 24);
      ctx.stroke();

      // Folded canopy triangle
      ctx.fillStyle = UMB_GOLD;
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      if (mode === 'closing') {
        ctx.moveTo(-18, -18);
        ctx.lineTo(18, -18);
        ctx.lineTo(0, -115);
      } else {
        ctx.moveTo(-13, 18);
        ctx.lineTo(13, 18);
        ctx.lineTo(0, 98);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ferrule tip
      ctx.beginPath();
      ctx.moveTo(0, mode === 'closing' ? -115 : 98);
      ctx.lineTo(0, mode === 'closing' ? -128 : 112);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Open scalloped yellow umbrella canopy!
    const R = 155;
    // Shaft & curved J-handle
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(0, -R * 0.72);
    ctx.lineTo(0, 88);
    ctx.arc(-14, 88, 14, 0, Math.PI, false);
    ctx.stroke();

    // Top spike
    ctx.beginPath();
    ctx.moveTo(0, -R * 0.72);
    ctx.lineTo(0, -R * 0.88);
    ctx.stroke();

    // Canopy dome with 5 scalloped ribs
    ctx.fillStyle = UMB_GOLD;
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 5.5;
    const ribs = [-R, -R * 0.52, 0, R * 0.52, R];
    ctx.beginPath();
    ctx.moveTo(-R, 0);
    ctx.bezierCurveTo(-R * 0.65, -R * 0.92, R * 0.65, -R * 0.92, R, 0);
    for (let i = ribs.length - 1; i > 0; i--) {
      const x1 = ribs[i], x0 = ribs[i - 1], xm = (x0 + x1) * 0.5;
      ctx.quadraticCurveTo(xm, -18, x0, 0);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner rib lines & warm highlight panel
    ctx.lineWidth = 3.8;
    for (const rx of [-R * 0.52, 0, R * 0.52]) {
      ctx.beginPath();
      ctx.moveTo(0, -R * 0.70);
      ctx.quadraticCurveTo(rx * 0.65, -R * 0.42, rx, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Protagonist: summerBoyClawd (晴蓝卫衣报童帽 Clawd)
  function summerBoyClawd(x, y, u, o = {}) {
    const ctx = drawingContext;
    const stone = clamp(o.stone ?? 0);
    const col = stone > 0 ? lerpColor(color('#4884C8'), color('#8D909B'), stone).toString('#rrggbb') : '#4884C8';
    const dk  = stone > 0 ? lerpColor(color('#23446E'), color('#4D5059'), stone).toString('#rrggbb') : '#23446E';
    const lt  = stone > 0 ? lerpColor(color('#8FC4F8'), color('#B8BBC4'), stone).toString('#rrggbb') : '#8FC4F8';

    // Draw open umbrella behind/above character if requested
    if (o.umbrella === 'open') {
      const ux = x + (o.umbDx ?? 1.8) * u;
      const uy = y - (o.umbDy ?? 10.6) * u;
      drawYellowUmbrella(ctx, ux, uy, (u / 20) * (o.umbScale ?? 1.12), 'open', o.umbTilt ?? -0.12);
    }

    clawd(x, y, u, {
      boilKey: o.boilKey || 'boy_clawd',
      ...o,
      col, dk, lt,
      tint: null,
      gloom: o.gloom ?? 0,
      draw(u0, sw0) {
        const c = drawingContext;
        // 1. Cozy Navy Newsboy Cap / Beret tuft on top of Clawd's head (深蓝报童帽与微卷发簇)
        const capCol = stone > 0 ? '#555862' : '#222842';
        paint([
          [-4.8 * u0, -8.0 * u0],
          [-2.0 * u0, -9.35 * u0],
          [2.4 * u0, -9.25 * u0],
          [5.1 * u0, -8.0 * u0],
          [2.0 * u0, -7.65 * u0],
          [-2.2 * u0, -7.65 * u0]
        ], { wash: capCol, fill: capCol, fillOp: 180, ink: INK_DARK, sw: sw0 * 0.85, curv: 0.35 });

        // 2. Hoodie collar, white drawstrings & kangaroo pocket on lower body (连帽卫衣抽绳与暖手兜)
        inkLine([[-1.4 * u0, -2.5 * u0], [-1.4 * u0, -0.9 * u0]], sw0 * 0.75, '#FFFDF7', 'ink', 0.2);
        inkLine([[1.4 * u0, -2.5 * u0],  [1.4 * u0, -0.9 * u0]],  sw0 * 0.75, '#FFFDF7', 'ink', 0.2);
        inkLine([[-2.8 * u0, -0.3 * u0], [-2.1 * u0, -1.3 * u0], [2.1 * u0, -1.3 * u0], [2.8 * u0, -0.3 * u0]], sw0 * 0.65, INK_DARK, 'ink', 0.1);

        // 3. Optional Golden Right-Half Heart Badge on Chest (胸前右半颗金心)
        if (o.heartBadge) {
          drawGoldenHeart(c, 0.2 * u0, -1.6 * u0, u0 * 0.95, 'right', 0, o.heartAlpha ?? 1);
        }

        // 4. Petrified Stone Cracks when turning to stone in Shot 9 (石化裂纹)
        if (stone > 0.35) {
          inkLine([[2.2 * u0, -7.2 * u0], [1.5 * u0, -6.1 * u0], [2.4 * u0, -5.4 * u0]], sw0 * 0.6, INK_DARK, 'ink', 0.1);
        }

        // 5. Closed or folding umbrella held in right hand
        if (o.umbrella === 'closed_down') {
          drawYellowUmbrella(c, 5.2 * u0, -2.5 * u0, (u0 / 20) * 0.85, 'closed_down', 0.08);
        } else if (o.umbrella === 'closed_side') {
          drawYellowUmbrella(c, 5.6 * u0, -2.8 * u0, (u0 / 20) * 0.88, 'closed_side', -1.15);
        } else if (o.umbrella === 'closing') {
          drawYellowUmbrella(c, 5.4 * u0, -3.2 * u0, (u0 / 20) * 0.88, 'closing', 0.05);
        }
        if (o.extraDraw) o.extraDraw(u0, sw0);
      }
    });
  }

  // Partner: summerGirlClawd (暖橘娃娃领向日葵 Clawd)
  function summerGirlClawd(x, y, u, o = {}) {
    const ctx = drawingContext;
    const alpha = o.alpha ?? 1;
    if (alpha <= 0.01) return;
    const ghost = !!o.ghost;
    const col = ghost ? '#7C728A' : '#E8785A';
    const dk  = ghost ? '#4A4356' : '#8F3922';
    const lt  = ghost ? '#A89FB6' : '#F9B8A2';

    ctx.save();
    if (alpha < 0.999) ctx.globalAlpha = clamp(alpha);
    clawd(x, y, u, {
      boilKey: o.boilKey || 'girl_clawd',
      shadow: !ghost,
      ...o,
      col, dk, lt,
      tint: null,
      gloom: 0,
      draw(u0, sw0) {
        const c = drawingContext;
        // 1. White Scalloped Peter-Pan Collar along neckline (白色花边娃娃领)
        const collarCol = ghost ? '#B8B0C4' : '#FFFDF7';
        paint([[-3.2 * u0, -2.5 * u0], [-1.5 * u0, -1.2 * u0], [0, -2.2 * u0]], {
          wash: collarCol, ink: INK_DARK, sw: sw0 * 0.65, curv: 0.3
        });
        paint([[0, -2.2 * u0], [1.5 * u0, -1.2 * u0], [3.2 * u0, -2.5 * u0]], {
          wash: collarCol, ink: INK_DARK, sw: sw0 * 0.65, curv: 0.3
        });

        // 2. Warm Chestnut Bob-Trim & Golden Sunflower Hairpin (栗色发饰与向日葵发夹)
        const hairCol = ghost ? '#52495E' : '#63372C';
        paint([
          [-5.0 * u0, -7.9 * u0],
          [-2.2 * u0, -9.1 * u0],
          [2.2 * u0, -9.1 * u0],
          [5.0 * u0, -7.9 * u0],
          [2.0 * u0, -7.5 * u0],
          [-2.0 * u0, -7.5 * u0]
        ], { wash: hairCol, fill: hairCol, fillOp: 170, ink: INK_DARK, sw: sw0 * 0.8, curv: 0.35 });

        if (!ghost) {
          PAPERCUT.plum(c, 2.8 * u0, -7.8 * u0, u0 * 0.78, 6, UMB_GOLD);
        }

        // 3. Optional Golden Left-Half Heart held in hand
        if (o.holdHalfHeart) {
          const hx = (o.heartSide === 'right' ? 5.6 : -5.6) * u0;
          drawGoldenHeart(c, hx, -3.2 * u0, u0 * 1.0, 'left', 0, 1);
        }
      }
    });
    ctx.restore();
  }

  // ============================================================================
  // 2. ENRICHED ENVIRONMENT & WEATHER HELPERS ("保持画风不变，细节改变下")
  // ============================================================================

  // Vintage Swan-Neck Streetlamp with Warm Golden Glow (复古鹅颈暖光街灯)
  function drawStreetLamp(ctx, x, yBot, h = 440, lit = true, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const yTop = yBot - h;
    if (lit) {
      // Warm light cone on street
      const lg = ctx.createRadialGradient(x, yTop + 42, 8, x, yTop + 180, 260);
      lg.addColorStop(0, 'rgba(255, 232, 145, 0.52)');
      lg.addColorStop(0.5, 'rgba(255, 220, 120, 0.16)');
      lg.addColorStop(1, 'rgba(255, 220, 120, 0)');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(x - 30, yTop + 32);
      ctx.lineTo(x + 30, yTop + 32);
      ctx.lineTo(x + 210, yBot + 40);
      ctx.lineTo(x - 210, yBot + 40);
      ctx.closePath();
      ctx.fill();
    }

    // Iron post + decorative base + crossbar
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x, yBot);
    ctx.lineTo(x, yTop);
    ctx.moveTo(x - 24, yTop + 12);
    ctx.lineTo(x + 24, yTop + 12);
    ctx.stroke();

    // Lantern housing
    ctx.fillStyle = lit ? '#FFF4B8' : '#D8C89E';
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(x - 16, yTop + 12);
    ctx.lineTo(x + 16, yTop + 12);
    ctx.lineTo(x + 12, yTop + 42);
    ctx.lineTo(x - 12, yTop + 42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Rainy / Clear Night City Street Backdrop (Shots 1, 2, 7, 8, 9, 13, 14, 15)
  function drawCityNightStreet(ctx, t, o = {}) {
    const rainAmt = o.rainAmt ?? 1.0;
    const windAng = o.windAng ?? 0.08;
    const skyShiftY = o.skyShiftY ?? 0; // positive when camera tilts up into the night sky
    const groundY = 670 + skyShiftY;

    ctx.save();
    // 1. Deep Twilight-Indigo Sky Gradient
    const sg = ctx.createLinearGradient(0, -300, 0, groundY);
    sg.addColorStop(0.0, '#1D1836');
    sg.addColorStop(0.55, '#372E58');
    sg.addColorStop(1.0, '#584B78');
    ctx.fillStyle = sg;
    ctx.fillRect(-300, -400, W + 600, groundY + 500);

    // Optional Full Moon & Twinkling 4-Point Stars (Shots 13–15)
    if (o.showMoon) {
      const mx = o.moonX ?? 1080, my = (o.moonY ?? 110) + skyShiftY;
      glow(mx, my, 135, '#FFF5C0', 0.78);
      paint(ellPts(mx, my, 46, 46, 24), { wash: '#FFF9D6', ink: INK_DARK, sw: 3.2 });
    }
    if (o.showStars) {
      const starList = [
        [340, 120, 18], [760, 85, 22], [1240, 105, 24], [1580, 140, 19],
        [520, 195, 14], [960, 155, 16], [1420, 65, 20]
      ];
      for (let i = 0; i < starList.length; i++) {
        const [sx, sy0, sr] = starList[i];
        const sy = sy0 + skyShiftY;
        const sc = 0.78 + 0.25 * Math.sin(t * 3.8 + i * 1.7);
        glow(sx, sy, sr * 2.5, '#FFE885', 0.55);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(sc, sc);
        ctx.fillStyle = '#FFE46B';
        ctx.strokeStyle = INK_DARK;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TAU - Math.PI / 2;
          const r = k % 2 === 0 ? sr : sr * 0.42;
          k === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // Soft Rolling Night Clouds at the top
    ctx.fillStyle = 'rgba(110, 98, 148, 0.38)';
    for (let i = 0; i < 7; i++) {
      const cx = i * 330 + Math.sin(t * 0.3 + i) * 20;
      ctx.beginPath();
      ctx.arc(cx, 35 + (i % 2) * 25 + skyShiftY * 0.4, 155, 0, TAU);
      ctx.fill();
    }

    // 2. Layered City Apartment Buildings with Enriched Rooftop Details & Glowing Windows
    const bldgs = [
      { x: -60,  w: 220, h: 420, col: '#4A3F68', cols: 3, rows: 5, roof: 'flat' },
      { x: 140,  w: 230, h: 350, col: '#584C78', cols: 3, rows: 4, roof: 'gable' },
      { x: 350,  w: 250, h: 460, col: '#433860', cols: 3, rows: 6, roof: 'tower' },
      { x: 580,  w: 220, h: 310, col: '#5A4E7A', cols: 3, rows: 4, roof: 'flat' },
      { x: 780,  w: 260, h: 440, col: '#483D66', cols: 3, rows: 5, roof: 'gable' },
      { x: 1020, w: 230, h: 360, col: '#564A76', cols: 3, rows: 4, roof: 'flat' },
      { x: 1230, w: 260, h: 470, col: '#42375E', cols: 3, rows: 6, roof: 'tower' },
      { x: 1470, w: 230, h: 380, col: '#584C78', cols: 3, rows: 5, roof: 'flat' },
      { x: 1680, w: 280, h: 430, col: '#493E67', cols: 4, rows: 5, roof: 'gable' }
    ];

    for (let bIdx = 0; bIdx < bldgs.length; bIdx++) {
      const b = bldgs[bIdx];
      const by = groundY - b.h;
      ctx.fillStyle = b.col;
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 4.5;
      ctx.fillRect(b.x, by, b.w, b.h);
      ctx.strokeRect(b.x, by, b.w, b.h);

      // Rooftop architectural details (gable roofs & water towers)
      if (b.roof === 'gable') {
        ctx.fillStyle = '#382E52';
        ctx.beginPath();
        ctx.moveTo(b.x - 8, by);
        ctx.lineTo(b.x + b.w * 0.5, by - 42);
        ctx.lineTo(b.x + b.w + 8, by);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (b.roof === 'tower') {
        ctx.fillStyle = '#382E52';
        ctx.fillRect(b.x + b.w * 0.6, by - 36, 48, 36);
        ctx.strokeRect(b.x + b.w * 0.6, by - 36, 48, 36);
      }

      // Glowing golden apartment windows
      const padX = 24, padY = 26;
      const ww = (b.w - padX * 2 - (b.cols - 1) * 16) / b.cols;
      const wh = 34;
      for (let r = 0; r < b.rows; r++) {
        for (let c = 0; c < b.cols; c++) {
          const hVal = hash(bIdx * 41 + r * 7 + c * 13);
          if (hVal < 0.22) continue; // some windows dark for realism
          const wx = b.x + padX + c * (ww + 16);
          const wy = by + padY + r * (wh + 22);
          if (wy + wh > groundY - 18) continue;
          ctx.fillStyle = hVal > 0.6 ? '#F5D778' : '#DFBC64';
          ctx.fillRect(wx, wy, ww, wh);
          ctx.strokeStyle = INK_DARK;
          ctx.lineWidth = 3.0;
          ctx.strokeRect(wx, wy, ww, wh);
        }
      }
    }

    // 3. Wet Purple-Slate Street & Sidewalk Curb
    const stG = ctx.createLinearGradient(0, groundY, 0, H + 100);
    stG.addColorStop(0, '#7C709A');
    stG.addColorStop(1, '#584E74');
    ctx.fillStyle = stG;
    ctx.fillRect(-300, groundY, W + 600, H - groundY + 250);

    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-300, groundY);
    ctx.lineTo(W + 300, groundY);
    ctx.moveTo(-300, groundY + 34);
    ctx.lineTo(W + 300, groundY + 34);
    ctx.stroke();

    // 4. Rain Puddles with Animated Concentric Raindrop Ripples (雨夜水洼与同心涟漪)
    const puddles = [
      { x: 260,  y: groundY + 185, rx: 145, ry: 32 },
      { x: 560,  y: groundY + 125, rx: 95,  ry: 22 },
      { x: 1180, y: groundY + 205, rx: 195, ry: 42 },
      { x: 1580, y: groundY + 145, rx: 110, ry: 25 }
    ];
    for (let i = 0; i < puddles.length; i++) {
      const p = puddles[i];
      ctx.fillStyle = 'rgba(62, 52, 92, 0.72)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, TAU);
      ctx.fill();
      if (rainAmt > 0.05) {
        const rip = frac(t * 1.4 + i * 0.37);
        ctx.strokeStyle = `rgba(220, 215, 245, ${(1 - rip) * 0.55 * rainAmt})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx * 0.45 * rip, p.ry * 0.45 * rip, 0, 0, TAU);
        ctx.stroke();
      }
    }

    // 5. Background Streetlamps
    drawStreetLamp(ctx, 790, groundY + 28, 430, true);
    drawStreetLamp(ctx, 1340, groundY + 28, 390, false, 0.75);

    // 6. Falling Rain Streaks (when rainAmt > 0)
    if (rainAmt > 0.02) {
      ctx.strokeStyle = `rgba(218, 228, 255, ${(0.58 * rainAmt).toFixed(3)})`;
      ctx.lineWidth = 2.8;
      const nDrops = Math.round(95 * rainAmt);
      ctx.beginPath();
      for (let i = 0; i < nDrops; i++) {
        const rx = ((hash(i * 17 + 5) * (W + 400) + t * (460 * Math.sin(windAng))) % (W + 400)) - 200;
        const ry = ((hash(i * 31 + 9) * (H + 200) + t * 1060) % (H + 200)) - 100;
        const len = 32 + (i % 3) * 12;
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - Math.sin(windAng) * len, ry + Math.cos(windAng) * len);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Golden Summer Sunset Street Backdrop (Shots 3, 4, 5, and Right Half of Shot 10)
  function drawSummerGoldenStreet(ctx, t, o = {}) {
    const groundY = o.groundY ?? 670;
    ctx.save();
    // 1. Warm Golden-Apricot Sunset Sky
    const sg = ctx.createLinearGradient(0, -200, 0, groundY);
    sg.addColorStop(0.0, '#D48A6A');
    sg.addColorStop(0.55, '#E8B288');
    sg.addColorStop(1.0, '#F7D9A8');
    ctx.fillStyle = sg;
    ctx.fillRect(-300, -300, W + 600, groundY + 400);

    // 2. Warm Terracotta & Ochre Apartment Buildings
    const bldgs = [
      { x: -40,  w: 250, h: 410, col: '#B8745E', cols: 3, rows: 5 },
      { x: 190,  w: 240, h: 340, col: '#C8856E', cols: 3, rows: 4 },
      { x: 410,  w: 270, h: 450, col: '#AD6B56', cols: 3, rows: 5 },
      { x: 660,  w: 240, h: 320, col: '#C6836C', cols: 3, rows: 4 },
      { x: 880,  w: 260, h: 430, col: '#B4715B', cols: 3, rows: 5 },
      { x: 1120, w: 250, h: 360, col: '#C8866E', cols: 3, rows: 4 },
      { x: 1350, w: 270, h: 460, col: '#AD6B56', cols: 3, rows: 5 },
      { x: 1600, w: 340, h: 390, col: '#BE7A64', cols: 4, rows: 5 }
    ];
    for (let bIdx = 0; bIdx < bldgs.length; bIdx++) {
      const b = bldgs[bIdx];
      const by = groundY - b.h;
      ctx.fillStyle = b.col;
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 4.2;
      ctx.fillRect(b.x, by, b.w, b.h);
      ctx.strokeRect(b.x, by, b.w, b.h);

      const padX = 24, padY = 26;
      const ww = (b.w - padX * 2 - (b.cols - 1) * 16) / b.cols;
      const wh = 34;
      for (let r = 0; r < b.rows; r++) {
        for (let c = 0; c < b.cols; c++) {
          const wx = b.x + padX + c * (ww + 16);
          const wy = by + padY + r * (wh + 22);
          if (wy + wh > groundY - 18) continue;
          ctx.fillStyle = '#F5D692';
          ctx.fillRect(wx, wy, ww, wh);
          ctx.strokeStyle = '#7A4638';
          ctx.lineWidth = 2.6;
          ctx.strokeRect(wx, wy, ww, wh);
        }
      }
    }

    // 3. Golden Sidewalk & Sandy-Ochre Street
    const stG = ctx.createLinearGradient(0, groundY, 0, H + 100);
    stG.addColorStop(0, '#ECCB9C');
    stG.addColorStop(0.65, '#DFB684');
    stG.addColorStop(1, '#BC8266');
    ctx.fillStyle = stG;
    ctx.fillRect(-300, groundY, W + 600, H - groundY + 250);

    ctx.strokeStyle = '#8C5844';
    ctx.lineWidth = 4.0;
    ctx.beginPath();
    ctx.moveTo(-300, groundY);
    ctx.lineTo(W + 300, groundY);
    ctx.moveTo(-300, groundY + 34);
    ctx.lineTo(W + 300, groundY + 34);
    ctx.stroke();

    // 4. Lush Green Summer Boulevard Trees on Left & Right
    const drawTree = (tx, tyBot, sc = 1) => {
      ctx.save();
      ctx.translate(tx, tyBot);
      ctx.scale(sc, sc);
      ctx.fillStyle = '#784A36';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 4.5;
      ctx.fillRect(-16, -280, 32, 280);
      ctx.strokeRect(-16, -280, 32, 280);
      const puffs = [[-65, -280, 72], [65, -280, 72], [0, -345, 84], [-40, -235, 58], [45, -235, 58]];
      for (const [px, py, pr] of puffs) {
        ctx.fillStyle = '#6EA15A';
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    };
    if (!o.hideTrees) {
      drawTree(240, groundY + 24, 1.15);
      drawTree(1560, groundY + 24, 1.05);
    }

    // 5. Drifting Golden Ginkgo / Summer Leaves (飘舞金叶)
    for (let i = 0; i < 12; i++) {
      const lx = ((hash(i * 23 + 3) * W + t * 48) % (W + 100)) - 50;
      const ly = ((hash(i * 41 + 7) * 650 + t * 55) % 680);
      const ang = t * 2.5 + i;
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(ang);
      ctx.fillStyle = i % 2 === 0 ? '#F5C445' : '#E8924A';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 6, 0, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // ============================================================================
  // 3. ALL 16 SHOTS OF 《去年夏天》 (0.00s - 78.205s)
  // ============================================================================

  // ---------- SHOT 1 (0.00 - 8.80s): 雨夜街灯独白与幻想云朵 ----------
  // Lyrics: 啊疼不疼痛不痛 / 这样一直被动 / 幻想中我的梦 / 总会过分要命的囧
  function shot01(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = lerp(1.0, 1.22, ease(seg(lt, 0.2, 4.2)));
    const camY = lerp(540, 585, ease(seg(lt, 0.2, 4.2)));
    camBegin(960, camY, zoom);

    drawCityNightStreet(ctx, t, { rainAmt: 0.9 });

    // Thought Cloud (幻想云朵) on upper-left during lt = 4.85 .. 7.35s ("幻想中我的梦")
    if (lt > 4.85 && lt < 7.38) {
      const cIn = backOut(seg(lt, 4.85, 5.28));
      const cOut = 1 - easeIn(seg(lt, 6.95, 7.38));
      const cSc = cIn * cOut;
      if (cSc > 0.04) {
        const cx = 635, cy = 445;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(cSc, cSc);
        // Trailing thought bubbles toward Boy Clawd
        for (const [bx, by, br] of [[205, 75, 16], [165, 55, 24]]) {
          paint(ellPts(bx, by, br, br, 16), { wash: '#F7F2E4', ink: INK_DARK, sw: 3.5 });
        }
        // Main fluffy cloud silhouette
        const cloudPts = [];
        for (let i = 0; i < 28; i++) {
          const a = (i / 28) * TAU;
          const bump = 1 + 0.14 * Math.sin(a * 7);
          cloudPts.push([Math.cos(a) * 195 * bump, Math.sin(a) * 125 * bump]);
        }
        paint(cloudPts, { wash: '#F7F2E4', washOp: 250, ink: INK_DARK, sw: 4.5, curv: 0.35 });

        // Inside the thought cloud (5.30 .. 6.88s): miniature Girl Clawd & Boy Clawd under the yellow umbrella!
        const innerA = seg(lt, 5.28, 5.55) * (1 - seg(lt, 6.68, 6.95));
        if (innerA > 0.02) {
          ctx.globalAlpha = innerA;
          summerGirlClawd(-42, 62, 8.8, { eyes: 'happy', mouth: 'smile', blush: 0.7 });
          summerBoyClawd(42, 62, 8.8, {
            eyes: 'happy', mouth: 'smile', blush: 0.7,
            umbrella: 'open', umbDx: -2.2, umbDy: 11.5, umbScale: 0.95
          });
        }
        ctx.restore();
      }
    }

    // Boy Clawd standing under streetlamp with folded yellow umbrella
    const u = 23.5;
    const umbMode = lt < 2.95 ? 'closed_down' : 'closed_side';
    summerBoyClawd(980, 815, u, {
      umbrella: umbMode,
      ...emotions(lt, [
        [0.0, 'sad', { eyes: 'sad', mouth: 'frown', gloom: 0 }],
        [1.4, 'sad', { eyes: 'sad', mouth: 'wobble', emote: 'sweat', gloom: 0 }],
        [3.0, 'sad', { eyes: 'sad', mouth: 'frown', aR: 0.55, gloom: 0 }],
        [5.2, 'hopeful', { eyes: 'normal', mouth: 'o', lookX: -0.6, lookY: -0.4, gloom: 0 }],
        [7.2, 'sad', { eyes: 'sad', mouth: 'wobble', gloom: 0 }]
      ]),
      ...move('sway', t, 0)
    });

    camEnd();

    // Fade in from black at 0.0 .. 0.35s
    if (lt < 0.35) {
      flash(1 - lt / 0.35, '#0E0B1A');
    }
    // Horizontal Venetian-blind pan transition at end of Shot 1 (lt > 8.55s)
    if (lt > dur - 0.28) {
      brushWipe((lt - (dur - 0.28)) / 0.56, ['#483D66', '#6A5E85']);
    }
  }

  // ---------- SHOT 2 (8.80 - 15.48s): 撑伞凝视水洼金球与圆环穿越 ----------
  // Lyrics: 在过去每个时候 / 我都会想象的念头
  function shot02(t, lt, dur) {
    const ctx = drawingContext;
    // At lt = 5.0..6.68s (t = 13.8..15.48s), camera pushes into the glowing golden orb in the right puddle!
    const diveK = easeIn(seg(lt, 5.10, 6.55));
    const camX = lerp(960, 1140, diveK);
    const camY = lerp(575, 790, diveK);
    const zoom = lerp(1.18, 2.25, diveK);
    camBegin(camX, camY, zoom);

    drawCityNightStreet(ctx, t, { rainAmt: 0.85 });

    // Glowing Golden Orb & Concentric Ripples in the right puddle (t = 13.6 .. 15.48s, lt = 4.8 .. 6.68s)
    if (lt > 4.75) {
      const ok = seg(lt, 4.75, 6.50);
      const px = 1180, py = 875;
      // Concentric white-and-gold rings in puddle
      for (let r = 0; r < 4; r++) {
        const rk = frac(ok * 1.8 + r * 0.25);
        ctx.strokeStyle = `rgba(255, 240, 185, ${(1 - rk) * 0.85})`;
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.ellipse(px, py, 24 + rk * 185, 6 + rk * 42, 0, 0, TAU);
        ctx.stroke();
      }
      // Golden memory orb in the center of the puddle
      const orbR = lerp(12, 48, easeOut(seg(lt, 5.10, 6.20)));
      glow(px, py - 6, orbR * 2.8, '#FFD86B', 0.9);
      paint(ellPts(px, py - 6, orbR, orbR, 20), { wash: '#FFE47A', fill: '#FFF7D6', fillOp: 160, ink: '#E89A3C', sw: 2.5 });
    }

    // Boy Clawd holding the open yellow umbrella overhead, looking down at the puddle
    const u = 23.5;
    summerBoyClawd(910, 815, u, {
      umbrella: 'open',
      umbDx: -1.2, umbDy: 10.6, umbTilt: -0.15,
      ...emotions(lt, [
        [0.0, 'sad', { lookX: -0.2, gloom: 0 }],
        [2.2, 'thinking', { lookX: 0.5, lookY: 0.4, gloom: 0 }],
        [4.8, 'surprised', { eyes: 'wide', mouth: 'o', lookX: 0.7, lookY: 0.6, gloom: 0 }]
      ]),
      ...move('sway', t, 0)
    });

    camEnd();

    if (lt < 0.28) {
      brushWipe(0.5 + lt / 0.56, ['#483D66', '#6A5E85']);
    }
    // Expanding Golden Circle Iris Wipe at the end of Shot 2 (lt = 6.25 .. 6.68s, t = 15.05 .. 15.48s)
    if (lt > dur - 0.45) {
      const ik = easeIn((lt - (dur - 0.45)) / 0.45);
      const r = lerp(20, 1450, ik);
      ctx.save();
      ctx.fillStyle = '#F2C99B';
      ctx.strokeStyle = '#D9945A';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(1160, 740, r, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // ---------- SHOT 3 (15.48 - 20.72s): 暖金夏日初遇与俏皮轻拍 ----------
  // Lyrics: 别怕你就算我是你的 / 小小狗也总会被打痛
  function shot03(t, lt, dur) {
    const ctx = drawingContext;
    const pushEnd = easeIn(seg(lt, 4.45, 5.24));
    const zoom = lerp(1.0, 1.38, pushEnd);
    camBegin(960, lerp(540, 610, pushEnd), zoom);

    drawSummerGoldenStreet(ctx, t);

    // Boy Clawd & Girl Clawd walking happily toward each other, then Girl Clawd playfully pats him ("小小狗也总会被打痛")
    const walkK = easeOut(seg(lt, 0.0, 3.10));
    const bx = lerp(660, 845, walkK);
    const gx = lerp(1160, 1015, walkK);
    const gy = 805;
    const u = 23.5;

    const patK = seg(lt, 3.40, 4.65);
    const isPatting = patK > 0 && patK < 1;

    summerBoyClawd(bx, gy, u, {
      walk: lt < 3.10 ? lt * 3.2 : null,
      eyes: isPatting ? 'wink' : 'happy',
      mouth: isPatting ? 'wobble' : 'smile',
      blush: 0.7,
      sq: isPatting ? 0.14 * Math.sin(patK * Math.PI * 3) : 0,
      lookX: 0.4,
      ...move('sway', t, 0)
    });

    summerGirlClawd(gx, gy, u, {
      walk: lt < 3.10 ? lt * 3.2 : null,
      eyes: 'happy', mouth: 'smile', blush: 0.75,
      aL: isPatting ? 1.15 + Math.sin(patK * Math.PI * 4) * 0.35 : 0.25,
      lookX: -0.4,
      ...move('sway', t, 1)
    });

    // Playful comic impact star & floating crimson heart when she pats him (t = 19.0 .. 20.5s)
    if (lt > 3.35) {
      const ha = clamp((lt - 3.35) / 0.35);
      PAPERCUT.heart(ctx, (bx + gx) * 0.5, gy - 10.5 * u - (lt - 3.35) * 18, 20 * ha, 0.12, '#E05244', '#FFF5E4');
    }

    camEnd();
  }

  // ---------- SHOT 4 (20.72 - 24.64s): 双Clawd近景与金心裂合 ----------
  // Lyrics: 意念中想不痛 (右侧竖排) / 却总是被一次掏空
  function shot04(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = lerp(1.36, 1.24, ease(lt / dur));
    camBegin(960, 615, zoom);

    drawSummerGoldenStreet(ctx, t, { hideTrees: true });

    const u = 26.5;
    const bx = 855, gx = 1065, gy = 825;

    // Boy Clawd & Girl Clawd standing close together in medium close-up
    const splitPhase = seg(lt, 2.35, 3.45); // t = 23.07 .. 24.17s ("却总是被一次掏空")
    summerBoyClawd(bx, gy, u, {
      heartBadge: lt > 1.55 && lt < 2.65,
      ...emotions(lt, [
        [0.0, 'love', { eyes: 'happy', mouth: 'smile', blush: 0.85, aR: 0.65 }],
        [2.35, 'surprised', { eyes: 'wide', mouth: 'o', blush: 0.4 }],
        [3.35, 'love', { eyes: 'happy', mouth: 'smile', blush: 0.85 }]
      ]),
      ...move('sway', t, 0)
    });

    summerGirlClawd(gx, gy, u, {
      ...emotions(lt, [
        [0.0, 'love', { eyes: 'happy', mouth: 'smile', blush: 0.85, aL: 0.65 }],
        [2.45, 'surprised', { eyes: 'wide', mouth: 'o', emote: 'exclaim' }],
        [3.35, 'love', { eyes: 'happy', mouth: 'smile', blush: 0.85 }]
      ]),
      ...move('sway', t, 1)
    });

    // Golden Heart rising above their heads, splitting in two at "掏空" (lt = 2.4..3.3s), then held between their hands!
    if (lt > 2.10 && lt < 3.40) {
      const hy = lerp(gy - 4.5 * u, gy - 11.2 * u, easeOut(seg(lt, 2.10, 2.65)));
      const mode = lt > 2.68 ? 'broken' : 'whole';
      drawGoldenHeart(ctx, (bx + gx) * 0.5, hy, 28, mode, 0, 1);
    } else if (lt >= 3.40) {
      drawGoldenHeart(ctx, (bx + gx) * 0.5, gy - 3.6 * u, 26, 'broken', 0, 1);
    }

    camEnd();
  }

  // ---------- SHOT 5 (24.64 - 32.48s): 去年夏天共撑黄伞与金心合一 ----------
  // Lyrics: 在去年夏天跟你说 / 一个小小要求 / 答应了不放手
  function shot05(t, lt, dur) {
    const ctx = drawingContext;
    camBegin(960, 545, 1.02);

    drawSummerGoldenStreet(ctx, t);

    const u = 23.0;
    // In Shot 5, Girl Clawd is on the left (x = 845) and Boy Clawd is on the right (x = 1025)!
    // At lt = 0.0..0.75s, Boy Clawd holds out the closed yellow umbrella; at lt >= 0.75s (t = 25.39s), he opens it overhead!
    const gx = lerp(805, 850, ease(seg(lt, 1.5, 4.2)));
    const bx = lerp(1065, 1020, ease(seg(lt, 1.5, 4.2)));
    const gy = 805;

    // Draw open yellow umbrella sheltering both of them once lt >= 0.75s
    if (lt >= 0.75) {
      const popUmb = backOut(seg(lt, 0.75, 1.15));
      drawYellowUmbrella(ctx, (gx + bx) * 0.5 + 14, gy - 10.6 * u, (u / 20) * 1.25 * popUmb, 'open', -0.14);
    }

    summerGirlClawd(gx, gy, u, {
      ...emotions(lt, [
        [0.0, 'happy', { lookX: 0.4 }],
        [2.2, 'shy', { eyes: 'happy', mouth: 'smile', blush: 0.85 }],
        [4.4, 'excited', { eyes: 'happy', mouth: 'open', blush: 0.9, aL: 1.15 }]
      ]),
      ...move('sway', t, 1)
    });

    summerBoyClawd(bx, gy, u, {
      umbrella: lt < 0.75 ? 'closed_side' : null,
      ...emotions(lt, [
        [0.0, 'happy', { lookX: -0.4 }],
        [2.2, 'shy', { eyes: 'normal', mouth: 'wobble', emote: 'sweat', blush: 0.8, rot: -0.06 }],
        [4.4, 'excited', { eyes: 'happy', mouth: 'open', blush: 0.9, aR: 1.25 }]
      ]),
      ...move('sway', t, 0)
    });

    // Two golden half-hearts coming together between them (lt = 2.0..4.3s) and locking into a WHOLE glowing heart at lt >= 4.3s ("答应了不放手")!
    if (lt > 1.85) {
      const joinK = ease(seg(lt, 2.20, 4.35));
      const cx = (gx + bx) * 0.5, cy = gy - 3.2 * u;
      if (joinK < 0.95) {
        const sep = lerp(34, 4, joinK);
        drawGoldenHeart(ctx, cx - sep, cy, 24, 'left', -0.1 * (1 - joinK), 1);
        drawGoldenHeart(ctx, cx + sep, cy, 24, 'right', 0.1 * (1 - joinK), 1);
      } else {
        const pulse = 1 + 0.12 * Math.sin(t * 8);
        glow(cx, cy, 75, '#FFE47A', 0.85);
        drawGoldenHeart(ctx, cx, cy, 28 * pulse, 'whole', 0, 1);
      }
    }

    camEnd();

    // Bright White-Mist Memory Flash at the end of Shot 5 (t = 32.15 .. 32.48s)
    if (lt > dur - 0.38) {
      flash(easeIn((lt - (dur - 0.38)) / 0.38), '#F4F2F8');
    }
  }

  // ---------- SHOT 6 (32.48 - 42.80s): 雨夜长椅独坐与四季流转残影 ----------
  // Lyrics: 还有什么悲哀 (左侧竖排) / 这故事中的人不太精彩 / 夏去了又回来 / 而人却已不在
  function shot06(t, lt, dur) {
    const ctx = drawingContext;
    // Starts in medium close-up on the bench (0..3.0s), then pulls back (3.0..5.5s) to wide park view!
    const pullK = ease(seg(lt, 2.90, 5.40));
    const zoom = lerp(1.42, 1.0, pullK);
    const camX = lerp(960, 960, pullK);
    const camY = lerp(635, 540, pullK);
    camBegin(camX, camY, zoom);

    // Determine Season State during "夏去了又回来 / 而人却已不在" (lt = 6.5 .. 10.32s, t = 39.0 .. 42.8s):
    //   lt < 7.2s (t < 39.68s): 'summer' (lush green trees & rain)
    //   7.2 <= lt < 8.1s (39.68..40.58s): 'autumn' (golden-orange tree & falling leaves)
    //   8.1 <= lt < 9.2s (40.58..41.68s): 'winter' (bare branches, snowbank & falling snow + Girl Clawd's ghost!)
    //   lt >= 9.2s (41.68..42.80s): 'spring' (green tree returns, ghost fades away)
    let season = 'summer';
    if (lt >= 7.20 && lt < 8.10) season = 'autumn';
    else if (lt >= 8.10 && lt < 9.20) season = 'winter';
    else if (lt >= 9.20) season = 'spring';

    // 1. Dark Midnight-Indigo Park Backdrop
    const groundY = 685;
    const sg = ctx.createLinearGradient(0, -200, 0, groundY);
    sg.addColorStop(0, '#16182E');
    sg.addColorStop(1, '#2E3252');
    ctx.fillStyle = sg;
    ctx.fillRect(-300, -300, W + 600, groundY + 300);

    // Distant low-key park skyline silhouettes & warm distant windows
    const parkBldgs = [
      { x: 60, w: 190, h: 240 }, { x: 280, w: 210, h: 310 }, { x: 520, w: 180, h: 220 },
      { x: 1080, w: 220, h: 290 }, { x: 1330, w: 200, h: 250 }, { x: 1560, w: 240, h: 320 }
    ];
    for (let i = 0; i < parkBldgs.length; i++) {
      const b = parkBldgs[i];
      ctx.fillStyle = '#252945';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 3.5;
      ctx.fillRect(b.x, groundY - b.h, b.w, b.h);
      ctx.strokeRect(b.x, groundY - b.h, b.w, b.h);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.fillStyle = '#DFBA64';
          ctx.fillRect(b.x + 28 + c * 78, groundY - b.h + 28 + r * 58, 38, 26);
        }
      }
    }

    // Park Ground
    ctx.fillStyle = '#3E4366';
    ctx.fillRect(-300, groundY, W + 600, H - groundY + 200);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-300, groundY);
    ctx.lineTo(W + 300, groundY);
    ctx.stroke();

    // 2. Seasonal Park Tree on the Left (x = 560)
    const tx = 555, ty = groundY + 25;
    ctx.fillStyle = '#6E4736';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.5;
    ctx.fillRect(tx - 16, ty - 290, 32, 290);
    ctx.strokeRect(tx - 16, ty - 290, 32, 290);
    if (season === 'winter') {
      // Bare winter branches & white snowbank at base!
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(tx, ty - 210); ctx.lineTo(tx - 65, ty - 285);
      ctx.moveTo(tx, ty - 240); ctx.lineTo(tx + 70, ty - 305);
      ctx.moveTo(tx, ty - 270); ctx.lineTo(tx - 30, ty - 335);
      ctx.stroke();
      paint(ellPts(tx + 15, ty + 6, 175, 24, 20), { wash: '#F2F6FF', ink: INK_DARK, sw: 3.2 });
    } else {
      const leafCol = season === 'autumn' ? '#D9863D' : '#6A9E58';
      const puffs = [[-65, -285, 72], [65, -285, 72], [0, -345, 84], [-40, -238, 56], [45, -238, 56]];
      for (const [px, py, pr] of puffs) {
        ctx.fillStyle = leafCol;
        ctx.beginPath();
        ctx.arc(tx + px, ty + py, pr, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
    }

    // Park Streetlamp on the Right (x = 1365)
    drawStreetLamp(ctx, 1365, groundY + 20, 360, true);

    // 3. Wooden Slatted Park Bench in Center (x = 960, y = 735)
    const bx0 = 785, bw = 350, by0 = 675;
    ctx.fillStyle = '#80563E';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.2;
    // Backrest slats & seat
    ctx.fillRect(bx0, by0, bw, 28); ctx.strokeRect(bx0, by0, bw, 28);
    ctx.fillRect(bx0, by0 + 38, bw, 28); ctx.strokeRect(bx0, by0 + 38, bw, 28);
    ctx.fillRect(bx0 - 12, by0 + 74, bw + 24, 24); ctx.strokeRect(bx0 - 12, by0 + 74, bw + 24, 24);
    // Bench legs
    ctx.fillStyle = '#2B2438';
    ctx.fillRect(bx0 + 28, by0 + 98, 18, 52); ctx.strokeRect(bx0 + 28, by0 + 98, 18, 52);
    ctx.fillRect(bx0 + bw - 46, by0 + 98, 18, 52); ctx.strokeRect(bx0 + bw - 46, by0 + 98, 18, 52);

    // 4. Boy Clawd sitting on the left side of the bench, tilting the yellow umbrella over the empty right spot!
    const u = 16.5;
    const boyX = 885, boyY = 762;

    // Ghost / Memory Apparition of Girl Clawd sitting beside him during lt = 8.05 .. 9.85s (t = 40.53 .. 42.33s, "夏去了又回来 / 而人却已不在")!
    const ghostIn = ease(seg(lt, 8.00, 8.35));
    const ghostOut = 1 - ease(seg(lt, 9.35, 9.95));
    const ghostA = ghostIn * ghostOut;
    if (ghostA > 0.02) {
      summerGirlClawd(1025, boyY, u, {
        ghost: true,
        alpha: ghostA * 0.78,
        eyes: 'sad', mouth: 'frown'
      });
    }

    // Yellow umbrella held tilted toward the right side of the bench
    drawYellowUmbrella(ctx, boyX + 95, boyY - 195, (u / 20) * 1.15, 'open', 0.34);

    summerBoyClawd(boyX, boyY, u, {
      ...emotions(lt, [
        [0.0, 'sad', { eyes: 'sad', mouth: 'frown', gloom: 0 }],
        [8.1, 'surprised', { eyes: 'wide', mouth: 'o', lookX: 0.6, gloom: 0 }],
        [9.3, 'teary', { eyes: 'teary', mouth: 'wobble', gloom: 0 }]
      ]),
      ...move('breathe', t, 0)
    });

    // Seasonal Weather Particles (Rain / Autumn Leaves / Winter Snowflakes)
    if (season === 'autumn') {
      for (let i = 0; i < 16; i++) {
        const lx = ((hash(i * 19 + 1) * W + t * 110) % W);
        const ly = ((hash(i * 37 + 3) * H + t * 160) % H);
        paint(ellPts(lx, ly, 10, 6, 8), { wash: '#E88A38', ink: INK_DARK, sw: 1.5 });
      }
    } else if (season === 'winter') {
      for (let i = 0; i < 28; i++) {
        const sx = ((hash(i * 23 + 7) * W + Math.sin(t * 2 + i) * 30) % W);
        const sy = ((hash(i * 41 + 9) * H + t * 140) % H);
        paint(ellPts(sx, sy, 5, 5, 8), { wash: '#FFFFFF', ink: null });
      }
    } else {
      ctx.strokeStyle = 'rgba(200, 212, 240, 0.38)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let i = 0; i < 55; i++) {
        const rx = (hash(i * 17) * W + t * 60) % W;
        const ry = (hash(i * 31) * H + t * 880) % H;
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 4, ry + 26);
      }
      ctx.stroke();
    }

    camEnd();

    // Fade out from white-mist memory flash at the start of Shot 6 (0.0 .. 0.65s)
    if (lt < 0.65) {
      flash(1 - easeOut(lt / 0.65), '#F4F2F8');
    }
  }

  // ---------- SHOT 7 (42.80 - 44.80s): 重返雨夜街头撑伞 ("它重复着我") ----------
  function shot07(t, lt, dur) {
    const ctx = drawingContext;
    camBegin(960, 575, lerp(1.14, 1.22, lt / dur));

    drawCityNightStreet(ctx, t, { rainAmt: 1.0, windAng: 0.14 });

    const u = 23.5;
    summerBoyClawd(940, 815, u, {
      umbrella: 'open',
      umbDx: 3.5, umbDy: 10.4, umbTilt: 0.38,
      eyes: 'sad', mouth: 'frown', aL: 0.75,
      ...move('sway', t, 0)
    });

    camEnd();
  }

  // ---------- SHOT 8 (44.80 - 46.48s): 狂风暴雨吹折黄伞 ("汹涌的忍耐") ----------
  function shot08(t, lt, dur) {
    const ctx = drawingContext;
    const shake = shakeXY(t, 4.5);
    camBegin(960 + shake[0], 575 + shake[1], 1.18);

    // Fierce diagonal storm wind & rain!
    drawCityNightStreet(ctx, t, { rainAmt: 1.35, windAng: 0.42 });

    // Wind-streak lines whipping across the street
    ctx.strokeStyle = 'rgba(220, 230, 255, 0.35)';
    ctx.lineWidth = 2.6;
    for (let i = 0; i < 8; i++) {
      const wx = ((t * 950 + i * 260) % (W + 400)) - 200;
      const wy = 240 + i * 75;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(wx - 140, wy + 55);
      ctx.stroke();
    }

    const u = 23.5;
    const gustTilt = lerp(0.55, 1.08, easeOut(seg(lt, 0.0, 0.85))) + Math.sin(t * 18) * 0.06;
    summerBoyClawd(930, 815, u, {
      umbrella: 'open',
      umbDx: 6.2, umbDy: 8.2, umbTilt: gustTilt,
      eyes: 'sad', mouth: 'wobble', emote: 'sweat',
      aL: 0.85, aR: 0.95,
      rot: 0.06
    });

    camEnd();

    if (lt > dur - 0.25) {
      brushWipe((lt - (dur - 0.25)) / 0.50, ['#382E58', '#5E527E']);
    }
  }

  // ---------- SHOT 9 (46.48 - 54.96s): 转身逃开、黄伞跌落与石化变呆 ----------
  // Lyrics: 我拿了总会还 / 你拿了就逃开 / 在失去中我慢慢的变呆
  function shot09(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = kf(lt, [[0, 1.14], [4.5, 1.06], [dur, 1.16]]);
    camBegin(960, 575, zoom);

    drawCityNightStreet(ctx, t, { rainAmt: 0.95 });

    const u = 23.0;
    const bx = 815, by = 815;

    // 1. Girl Clawd on the right holding the golden left-half heart (0..2.8s), then running away into the background alley (2.8..4.8s, "你拿了就逃开")!
    if (lt < 5.10) {
      const fleeK = easeIn(seg(lt, 2.75, 4.85));
      const gx = lerp(1125, 1495, fleeK);
      const gy = lerp(815, 685, fleeK);
      const gu = lerp(u, u * 0.42, fleeK);
      summerGirlClawd(gx, gy, gu, {
        flip: lt >= 2.75,
        walk: lt >= 2.75 ? lt * 5.2 : null,
        holdHalfHeart: true,
        heartSide: lt >= 2.75 ? 'right' : 'left',
        eyes: lt < 2.75 ? 'sad' : 'wide',
        mouth: 'frown'
      });
    }

    // 2. Yellow Umbrella: held open by Boy Clawd until lt = 3.85s (t = 50.33s), then drops to the wet street on his right!
    const dropK = easeOut(seg(lt, 3.85, 4.45));
    if (lt < 3.85) {
      drawYellowUmbrella(ctx, bx + 65, by - 10.6 * u, (u / 20) * 1.14, 'open', 0.28);
    } else {
      const ux = lerp(bx + 75, bx + 225, dropK);
      const uy = lerp(by - 8.5 * u, by + 48, dropK);
      const uTilt = lerp(0.35, 1.48, dropK);
      drawYellowUmbrella(ctx, ux, uy, (u / 20) * 1.1, 'open', uTilt);
    }

    // 3. Boy Clawd: extends arms as umbrella drops, then slowly petrifies into grey stone during lt = 5.6..8.2s ("在失去中我慢慢的变呆")!
    const stoneK = ease(seg(lt, 5.65, 7.65));
    summerBoyClawd(bx, by, u, {
      stone: stoneK,
      aL: lt >= 3.85 ? 0.92 : 0.25,
      aR: lt >= 3.85 ? 0.92 : 0.65,
      eyes: stoneK > 0.5 ? 'wide' : (lt > 3.85 ? 'wide' : 'sad'),
      mouth: stoneK > 0.5 ? 'o' : 'frown',
      gloom: 0
    });

    // Floating kinetic characters "慢" & "呆" beside his head as he turns to stone (lt = 5.4 .. 7.8s)
    if (lt > 5.35 && lt < 7.85) {
      ctx.save();
      ctx.font = 'bold 44px "Ma Shan Zheng", cursive';
      ctx.lineWidth = 8;
      ctx.strokeStyle = INK_DARK;
      ctx.fillStyle = UMB_GOLD;
      const wCh = lt < 6.4 ? '慢' : '呆';
      ctx.strokeText(wCh, bx + 110, by - 115);
      ctx.fillText(wCh, bx + 110, by - 115);
      ctx.restore();
    }

    camEnd();

    if (lt < 0.25) {
      brushWipe(0.5 + lt / 0.50, ['#382E58', '#5E527E']);
    }
    if (lt > dur - 0.32) {
      brushWipe((lt - (dur - 0.32)) / 0.64, ['#8D909B', '#D49A74']);
    }
  }

  // ---------- SHOT 10 (54.96 - 58.24s): 左右裂痕双时空与不同步挂钟 ("是不同步的未来") ----------
  function shot10(t, lt, dur) {
    const ctx = drawingContext;
    camBegin(960, 540, 1.0);

    // Jagged vertical split seam path down the center (x ≈ 950)
    const seamPts = [
      [965, -80], [940, 120], [975, 290], [932, 460],
      [968, 640], [938, 820], [965, 1160]
    ];

    // 1. LEFT HALF: Rainy Night City + Night Clock + Boy Clawd under Yellow Umbrella
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-200, -100);
    for (const [sx, sy] of seamPts) ctx.lineTo(sx, sy);
    ctx.lineTo(-200, 1160);
    ctx.closePath();
    ctx.clip();

    drawCityNightStreet(ctx, t, { rainAmt: 0.9 });
    // Night Wall-Clock in the sky at (735, 235)
    drawSkyClock(ctx, 735, 235, 68, t * 0.8 + 1.2);
    summerBoyClawd(790, 795, 17.5, {
      umbrella: 'open', umbDx: 0.5, umbDy: 11.2, umbTilt: -0.08,
      eyes: 'sad', mouth: 'frown', lookX: 0.5,
      ...move('sway', t, 0)
    });
    ctx.restore();

    // 2. RIGHT HALF: Golden Daylight City + Day Clock + Girl Clawd walking in the sun
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(W + 200, -100);
    for (const [sx, sy] of seamPts) ctx.lineTo(sx, sy);
    ctx.lineTo(W + 200, 1160);
    ctx.closePath();
    ctx.clip();

    drawSummerGoldenStreet(ctx, t, { hideTrees: true });
    // Daylight Wall-Clock in the sky at (1235, 235) — out of sync with the left clock!
    drawSkyClock(ctx, 1235, 235, 68, -t * 1.9 + 3.7);
    const gx = lerp(1110, 1265, ease(lt / dur));
    summerGirlClawd(gx, 795, 17.5, {
      walk: lt * 2.5,
      eyes: 'sad', mouth: 'frown', lookX: -0.4
    });
    ctx.restore();

    // Bold Jagged Black Split Seam down the center
    inkLine(seamPts, 7.5, INK_DARK, 'ink', 0.1);

    camEnd();

    if (lt < 0.32) {
      brushWipe(0.5 + lt / 0.64, ['#8D909B', '#D49A74']);
    }
    if (lt > dur - 0.30) {
      brushWipe((lt - (dur - 0.30)) / 0.60, ['#8C5A3C', '#4A3828']);
    }
  }

  function drawSkyClock(ctx, cx, cy, r, handAng) {
    paint(ellPts(cx, cy, r, r, 24), { wash: '#FFFDF6', ink: INK_DARK, sw: 4.5 });
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = INK_DARK;
    ctx.lineCap = 'round';
    // Tick marks
    ctx.lineWidth = 3.2;
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * TAU;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (r - 12), Math.sin(a) * (r - 12));
      ctx.lineTo(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4));
      ctx.stroke();
    }
    // Hour & minute hands
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(handAng) * r * 0.68, Math.sin(handAng) * r * 0.68);
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(handAng * 0.35 - 1.2) * r * 0.46, Math.sin(handAng * 0.35 - 1.2) * r * 0.46);
    ctx.stroke();
    ctx.restore();
  }

  // ---------- SHOT 11 (58.24 - 66.36s): 书房夜读、翻开日记与金色尘埃 ----------
  // Lyrics: 却把包包中的日记夹夜 / 把虚伪的尘埃 / 也全部都掩盖
  function shot11(t, lt, dur) {
    const ctx = drawingContext;
    // Continuous camera motion + push-in on the open diary during "把虚伪的尘埃 / 也全部都掩盖"
    const zoomK = ease(seg(lt, 3.8, 5.4));
    const zoom = lerp(1.08, 1.42, zoomK) + Math.sin(t * 1.4) * 0.025;
    const camX = 960 + Math.sin(t * 1.1) * 22;
    const camY = lerp(550, 615, zoomK) + Math.cos(t * 1.3) * 14;
    camBegin(camX, camY, zoom);

    drawStudyRoomBackdrop(ctx, t);

    // Boy Clawd peeking clearly above the wooden study desk & diary!
    const u = 26.5;
    const boyX = lerp(885, 800, zoomK);
    const boyY = lerp(678, 660, zoomK);
    if (lt > 0.35) {
      summerBoyClawd(boyX, boyY, u, {
        ...emotions(lt, [
          [0.35, 'sad', { lookY: 0.5, gloom: 0 }],
          [4.20, 'sad', { eyes: 'sad', mouth: 'wobble', lookX: 0.4, lookY: 0.5, gloom: 0 }],
          [7.10, 'sad', { eyes: 'sad', mouth: 'frown', gloom: 0 }]
        ]),
        ...move('sway', t, 0)
      });
    }

    // Wooden Study Desk Foreground (y = 685 .. 1080)
    drawStudyDeskSurface(ctx, t, lt);

    camEnd();

    if (lt < 0.30) {
      brushWipe(0.5 + lt / 0.60, ['#8C5A3C', '#4A3828']);
    }
  }

  // ---------- SHOT 12 (66.36 - 70.20s): 合上日记与苦笑活该 ("把每次心痛 / 都当成活该") ----------
  function shot12(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = lerp(1.12, 1.24, lt / dur);
    const camX = 960 + Math.sin(t * 1.2) * 20;
    const camY = 560 + Math.cos(t * 1.4) * 14;
    camBegin(camX, camY, zoom);

    drawStudyRoomBackdrop(ctx, t);

    // Boy Clawd sitting clearly above the closed red diary on the desk; forces a bittersweet smile at lt = 1.9s!
    const u = 26.5;
    summerBoyClawd(885, 675, u, {
      ...emotions(lt, [
        [0.0, 'sad', { eyes: 'sad', mouth: 'frown', gloom: 0 }],
        [1.9, 'happy', { eyes: 'happy', mouth: 'smile', emote: 'sweat', blush: 0.5, gloom: 0 }]
      ]),
      ...move('sway', t, 0),
      extraDraw(u0, sw0) {
        // Little comic star on top of his head at "都当成活该" (lt > 2.0s)
        if (lt > 2.0) {
          PAPERCUT.plum(drawingContext, 0, -8.4 * u0, u0 * 0.72, 5, '#FFFDF7');
        }
      }
    });

    // Desk surface with the closed red heart-emblem diary
    drawStudyDeskSurface(ctx, t, 8.0);

    camEnd();

    // Yellow-and-navy brush wipe at the end of Shot 12 (lt > dur - 0.35s, t = 69.85 .. 70.20s)
    if (lt > dur - 0.35) {
      brushWipe((lt - (dur - 0.35)) / 0.70, [UMB_GOLD, '#372E58']);
    }
  }

  function drawStudyRoomBackdrop(ctx, t) {
    // Dark Indigo Bedroom Wall
    ctx.fillStyle = '#2B2B4F';
    ctx.fillRect(-300, -300, W + 600, 1100);

    // Night Window on Upper-Left (x = 220..560, y = 160..420) with Curtains & Starry View
    ctx.fillStyle = '#1B1D38';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.5;
    ctx.fillRect(220, 160, 340, 260);
    ctx.strokeRect(220, 160, 340, 260);
    // Distant city lights inside window
    ctx.fillStyle = '#383A62';
    ctx.fillRect(245, 260, 85, 155);
    ctx.fillRect(350, 220, 95, 195);
    ctx.fillStyle = '#F2D272';
    for (let r = 0; r < 3; r++) {
      ctx.fillRect(265, 285 + r * 40, 18, 22);
      ctx.fillRect(375, 245 + r * 45, 20, 24);
      ctx.fillRect(410, 245 + r * 45, 20, 24);
    }

    // Wall Shelf on Upper-Right (x = 1280..1680, y = 240) with a Tiny Potted Sprout
    ctx.fillStyle = '#7A523B';
    ctx.fillRect(1280, 245, 390, 20);
    ctx.strokeRect(1280, 245, 390, 20);
    //Tiny plant pot on shelf
    ctx.fillStyle = '#D97A58';
    ctx.fillRect(1420, 205, 36, 40);
    ctx.strokeRect(1420, 205, 36, 40);
    paint(ellPts(1438, 192, 22, 14, 12), { wash: '#6EA15A', ink: INK_DARK, sw: 2.5 });

    // Drifting Warm Lamp Dust Motes across the Study Room (台灯暖光浮尘，赋予室内镜头丰富呼吸动感)
    ctx.save();
    for (let i = 0; i < 32; i++) {
      const mx = ((hash(i * 19 + 5) * W + Math.sin(t * 1.4 + i) * 65 + t * 28) % W);
      const my = ((hash(i * 37 + 11) * 680 + Math.cos(t * 1.7 + i) * 45 - t * 24 + 680) % 680);
      const mr = 2.8 + (i % 3) * 1.4;
      ctx.fillStyle = `rgba(255, 232, 145, ${(0.35 + 0.35 * Math.sin(t * 3.5 + i)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawStudyDeskSurface(ctx, t, lt) {
    const deskY = 685;
    // Wooden Desk Top & Front Apron
    ctx.fillStyle = '#B88B68';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.5;
    ctx.fillRect(-200, deskY, W + 400, 130);
    ctx.strokeRect(-200, deskY, W + 400, 130);

    ctx.fillStyle = '#7A4E3E';
    ctx.fillRect(-200, deskY + 130, W + 400, 320);
    ctx.strokeRect(-200, deskY + 130, W + 400, 320);

    // Sticky Notes on Wall/Desk Right
    for (const [nx, ny, rot] of [[1560, 490, -0.22], [1760, 610, 0.15]]) {
      ctx.save();
      ctx.translate(nx, ny);
      ctx.rotate(rot);
      ctx.fillStyle = UMB_GOLD;
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 3.5;
      ctx.fillRect(-42, -28, 84, 56);
      ctx.strokeRect(-42, -28, 84, 56);
      ctx.restore();
    }

    // Vintage Brass Articulated Desk Lamp on Right (x = 1480, y = 685)
    glow(1320, 580, 260, '#FFE484', 0.45);
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(1485, deskY + 18);
    ctx.lineTo(1545, deskY - 95);
    ctx.lineTo(1435, deskY - 175);
    ctx.stroke();
    // Lamp base & yellow shade
    ctx.fillStyle = '#9E7B56';
    ctx.beginPath();
    ctx.ellipse(1485, deskY + 22, 58, 18, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(1415, deskY - 175);
    ctx.rotate(0.55);
    ctx.fillStyle = UMB_GOLD;
    ctx.fillRect(-48, -28, 96, 52);
    ctx.strokeRect(-48, -28, 96, 52);
    ctx.restore();

    // Teal Messenger Schoolbag on the Left of Desk (x = 460, y = 665)
    ctx.fillStyle = '#4A89A8';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.roundRect(350, deskY - 115, 225, 145, 18);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(350, deskY - 115, 225, 68, 14);
    ctx.fillStyle = '#5CA0C0';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = UMB_GOLD;
    ctx.fillRect(452, deskY - 58, 22, 24);
    ctx.strokeRect(452, deskY - 58, 22, 24);

    // Red Heart-Emblem Diary / Photo Album on the Center of the Desk!
    //   lt < 1.95s: Closed red diary slides from schoolbag to center (x: 680 -> 960)
    //   1.95 <= lt < 7.25s: Open two-page diary! Left page = sketch of both Clawds -> broken heart; Right page = yellow umbrella photo dissolving into golden dust motes ("把虚伪的尘埃")!
    //   lt >= 7.25s: Snaps shut ("也全部都掩盖") into closed red diary with broken golden heart on cover!
    if (lt < 1.95 || lt >= 7.25) {
      const slideK = easeOut(seg(lt, 0.0, 1.35));
      const dx = lt < 1.95 ? lerp(690, 960, slideK) : 995;
      const dy = deskY + 35;
      const dw = 235, dh = 155;
      // Dust puffs when snapping shut at lt = 7.25 .. 7.75s
      if (lt >= 7.25 && lt < 7.80) {
        const pk = seg(lt, 7.25, 7.80);
        for (const s of [-1, 1]) {
          paint(ellPts(dx + s * (135 + pk * 65), dy, 36 * (1 - pk), 22 * (1 - pk), 12), {
            wash: '#E8DFD5', washOp: 180, ink: null
          });
        }
      }
      ctx.fillStyle = '#D46548';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 4.5;
      ctx.fillRect(dx - dw * 0.5, dy - dh * 0.5, dw, dh);
      ctx.strokeRect(dx - dw * 0.5, dy - dh * 0.5, dw, dh);
      drawGoldenHeart(ctx, dx, dy, 22, 'broken', 0, 1);
    } else {
      // Open Two-Page Diary Spread!
      const ox = 960, oy = deskY + 25;
      const pw = 230, ph = 165;
      // Red cover border
      ctx.fillStyle = '#D46548';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 4.5;
      ctx.fillRect(ox - pw - 14, oy - ph * 0.5 - 10, pw * 2 + 28, ph + 20);
      ctx.strokeRect(ox - pw - 14, oy - ph * 0.5 - 10, pw * 2 + 28, ph + 20);
      // Cream left & right pages
      ctx.fillStyle = '#F7F2E4';
      ctx.fillRect(ox - pw, oy - ph * 0.5, pw, ph);
      ctx.strokeRect(ox - pw, oy - ph * 0.5, pw, ph);
      ctx.fillRect(ox, oy - ph * 0.5, pw, ph);
      ctx.strokeRect(ox, oy - ph * 0.5, pw, ph);

      // Left Page Content: Sketch of the two Clawds (lt < 3.6s) -> ruled diary lines (lt >= 4.2s)
      if (lt < 4.15) {
        const lx = ox - pw * 0.5, ly = oy + 28;
        summerBoyClawd(lx - 32, ly, 5.5, { eyes: 'happy', mouth: 'smile' });
        summerGirlClawd(lx + 32, ly, 5.5, { eyes: 'happy', mouth: 'smile' });
        drawGoldenHeart(ctx, lx, ly - 52, 12, lt > 3.2 ? 'broken' : 'whole', 0, 1);
      } else {
        ctx.strokeStyle = '#C8BFA8';
        ctx.lineWidth = 2.2;
        for (let r = 0; r < 5; r++) {
          const ry = oy - 50 + r * 24;
          ctx.beginPath();
          ctx.moveTo(ox - pw + 24, ry);
          ctx.lineTo(ox - 24, ry);
          ctx.stroke();
        }
      }

      // Right Page Content: Yellow Umbrella Photo that dissolves into rising Golden Dust Motes ("把虚伪的尘埃", lt = 4.2..6.8s)!
      const rx = ox + pw * 0.5, ry = oy;
      ctx.fillStyle = '#F2E5C4';
      ctx.strokeStyle = INK_DARK;
      ctx.lineWidth = 3.2;
      ctx.fillRect(rx - 75, ry - 58, 150, 116);
      ctx.strokeRect(rx - 75, ry - 58, 150, 116);

      const fadePhoto = 1 - ease(seg(lt, 4.65, 6.25));
      if (fadePhoto > 0.03) {
        ctx.save();
        ctx.globalAlpha = fadePhoto;
        drawYellowUmbrella(ctx, rx, ry + 15, 0.34, 'open', 0);
        ctx.restore();
      }

      // Rising Golden Dust Motes (金色尘埃星点)
      if (lt > 4.10) {
        const dk = seg(lt, 4.10, 6.85);
        for (let i = 0; i < 28; i++) {
          const mx = rx + (hash(i * 19 + 3) - 0.5) * 145;
          const my = ry + (hash(i * 31 + 7) - 0.5) * 105 - dk * (65 + (i % 4) * 35);
          const ma = Math.sin(clamp((dk * 1.4 - (i / 28) * 0.4)) * Math.PI);
          if (ma > 0.05) {
            ctx.fillStyle = `rgba(255, 224, 110, ${(ma * 0.9).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(mx, my, 3.2, 0, TAU);
            ctx.fill();
          }
        }
      }
    }
  }

  // ---------- SHOT 13 (70.20 - 74.24s): 雨霁收伞与摇镜仰望星月 ("把心慢慢的释怀") ----------
  function shot13(t, lt, dur) {
    const ctx = drawingContext;
    // Camera tilts up toward the starry night sky during lt = 2.4 .. 4.04s (t = 72.6 .. 74.24s)
    const tiltUp = ease(seg(lt, 2.35, 4.00));
    const skyShiftY = tiltUp * 210;
    camBegin(960, 555, 1.08);

    drawCityNightStreet(ctx, t, {
      rainAmt: 0,
      skyShiftY,
      showMoon: true,
      moonX: 1120,
      moonY: -35
    });

    // Boy Clawd under the streetlamp: holds open umbrella (0..1.5s) -> folds it (1.5..2.2s) -> holds closed umbrella & smiles!
    const u = 23.5;
    const by = 815 + skyShiftY;
    let umbState = 'open';
    if (lt >= 1.55 && lt < 2.20) umbState = 'closing';
    else if (lt >= 2.20) umbState = 'closed_down';

    summerBoyClawd(960, by, u, {
      umbrella: umbState,
      umbDx: 0.4, umbDy: 10.6, umbTilt: 0,
      ...emotions(lt, [
        [0.0, 'hopeful', { eyes: 'normal', mouth: 'smile' }],
        [1.6, 'happy', { eyes: 'happy', mouth: 'smile', blush: 0.8 }]
      ]),
      ...move('sway', t, 0)
    });

    // Glowing golden half-heart in his left hand releasing warm peace
    drawGoldenHeart(ctx, 960 - 5.5 * u, by - 3.5 * u, 16, 'right', 0, 1);

    camEnd();

    if (lt < 0.35) {
      brushWipe(0.5 + lt / 0.70, [UMB_GOLD, '#372E58']);
    }
  }

  // ---------- SHOT 14 (74.24 - 76.72s): 万家灯火中的那扇暖窗 ("我相信总有一 / 天你会明白") ----------
  function shot14(t, lt, dur) {
    const ctx = drawingContext;
    // Fast push-in toward the glowing apartment window on the right where Girl Clawd is looking out!
    const pushK = ease(seg(lt, 0.25, 2.35));
    const camX = lerp(960, 1210, pushK);
    const camY = lerp(520, 615, pushK);
    const zoom = lerp(1.0, 1.48, pushK);
    camBegin(camX, camY, zoom);

    drawCityNightStreet(ctx, t, {
      rainAmt: 0,
      skyShiftY: 165,
      showMoon: true, moonX: 540, moonY: -45,
      showStars: true
    });

    // Foreground Apartment Building on the Right (x = 980..1580, y = 390..1080) with ONE Warmly Lit Window!
    ctx.fillStyle = '#4A4374';
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 5.0;
    ctx.fillRect(980, 390, 590, 720);
    ctx.strokeRect(980, 390, 590, 720);

    // Warmly Lit Window at (1260, 610, w = 185, h = 195) with Girl Clawd inside!
    const wx = 1255, wy = 595, ww = 185, wh = 195;
    glow(wx + ww * 0.5, wy + wh * 0.5, 190, '#FFE484', 0.65);
    ctx.fillStyle = '#FFF2A6';
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeRect(wx, wy, ww, wh);

    ctx.save();
    ctx.beginPath();
    ctx.rect(wx + 4, wy + 4, ww - 8, wh - 8);
    ctx.clip();
    summerGirlClawd(wx + ww * 0.5, wy + wh + 14, 15.5, {
      eyes: 'happy', mouth: 'smile', blush: 0.85,
      lookX: -0.4, lookY: -0.3,
      ...move('breathe', t, 1)
    });
    ctx.restore();
    ctx.strokeStyle = INK_DARK;
    ctx.lineWidth = 5.0;
    ctx.strokeRect(wx, wy, ww, wh);

    camEnd();
  }

  // ---------- SHOT 15 (76.72 - 78.00s): 街灯下释怀微笑挥手 ----------
  function shot15(t, lt, dur) {
    const ctx = drawingContext;
    camBegin(960, 560, lerp(1.08, 1.15, lt / dur));

    drawCityNightStreet(ctx, t, {
      rainAmt: 0,
      skyShiftY: 95,
      showStars: true
    });

    const u = 23.5;
    summerBoyClawd(960, 900, u, {
      umbrella: 'closed_down',
      eyes: 'happy', mouth: 'smile', blush: 0.85,
      aL: 1.15 + Math.sin(t * 8) * 0.2,
      ...move('sway', t, 0)
    });

    camEnd();
  }

  // ---------- SHOT 16 (78.00 - 78.205s): 夜幕淡出收尾 ----------
  function shot16(t, lt, dur) {
    shot15(t, 1.28, 1.28);
    flash(clamp(lt / Math.max(0.05, dur)), '#080612');
  }

  // Register all 16 contiguous shots covering 0.00s .. 78.205s
  shots([
    [0.00,  shot01],
    [8.80,  shot02],
    [15.48, shot03],
    [20.72, shot04],
    [24.64, shot05],
    [32.48, shot06],
    [42.80, shot07],
    [44.80, shot08],
    [46.48, shot09],
    [54.96, shot10],
    [58.24, shot11],
    [66.36, shot12],
    [70.20, shot13],
    [74.24, shot14],
    [76.72, shot15],
    [78.00, shot16]
  ]);
})();
