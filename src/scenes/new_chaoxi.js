// new_chaoxi.js — 《new潮汐》(33.03s, 117.45 BPM, 7 Shots, 13 Lyric Lines)
// Remake Art Style: 青绿金碧 × 敦煌重彩木版画 (window.QINGLV from src/_lib.js)
// Reference: /home/user/Claudemv/new潮汐.mp4 | Storyboard: projects/new_chaoxi/STORYBOARD.md

(() => {
  // ---------- Cast Wrappers: 珊瑚琥珀灵 (Coral-Amber) & 汝窑天青仙 (Celadon-Jade) ----------
  function coralClawd(x, y, u, o = {}) {
    const ctx = drawingContext;
    const isReflect = !!o.reflect;
    const prevDraw = o.draw;

    if (isReflect) {
      // Also render the upside-down water reflection directly below (x, y + 14)
      coralClawd(x, y, u, { ...o, reflect: false });
      ctx.save();
      const waterY = y + 10;
      ctx.translate(x, waterY * 2 - y + 18);
      ctx.scale(1 + Math.sin(T * 4.2) * 0.03, -0.82);
      ctx.globalAlpha = o.reflectAlpha ?? 0.62;
      clawd(0, 0, u, {
        col: '#D96A52', dk: '#8F3826', lt: '#F5B89A',
        boilKey: 'coral_ref',
        ...o,
        emote: null,
        shadow: false
      });
      ctx.restore();
      // Shimmering water-ripple bars across the reflection
      drawReflectionRipples(ctx, x, waterY + u * 4.5, u * 6.5, o.reflectAlpha ?? 0.62);
      return;
    }

    clawd(x, y, u, {
      col: '#E06348', dk: '#943522', lt: '#F7B498',
      boilKey: o.boilKey || 'coral',
      ...o,
      draw(u0, sw0) {
        // Dunhuang 24K Mud-Gold Cloud-Collar Band (泥金云肩纹) + Coral Crown (珊瑚金冠)
        paint(rectPts(-5.1 * u0, -8.35 * u0, 10.2 * u0, 0.95 * u0, u0 * 0.03), {
          wash: '#1B4F82', fill: '#F5C85C', fillOp: 110, ink: PAL.ink, sw: sw0 * 0.65
        });
        // Gold-and-Coral forehead emblem (泥金珊瑚钿)
        paint(ellPts(0, -7.88 * u0, u0 * 0.62, u0 * 0.45, 12), {
          wash: '#F5C85C', fill: '#E05A47', fillOp: 120, ink: PAL.ink, sw: sw0 * 0.5
        });
        // Fluttering gold-silk ribbon tails
        const w1 = Math.sin(T * 5.8) * 0.6 * u0, w2 = Math.cos(T * 5.1) * 0.5 * u0;
        inkLine([[-5.0 * u0, -7.85 * u0], [-6.7 * u0, -7.2 * u0 + w1], [-8.2 * u0, -6.2 * u0 + w2]], sw0 * 1.05, '#F5C85C', 'ink', 0.5);
        if (prevDraw) prevDraw(u0, sw0);
      }
    });
  }

  function celadonClawd(x, y, u, o = {}) {
    const ctx = drawingContext;
    const alpha = o.alpha ?? 1;
    if (alpha <= 0.01) return;
    const onlyReflect = !!o.onlyReflect;
    const prevDraw = o.draw;

    if (onlyReflect) {
      ctx.save();
      const waterY = y + 10;
      ctx.translate(x, waterY * 2 - y + 18);
      ctx.scale(1 + Math.cos(T * 4.0) * 0.03, -0.82);
      ctx.globalAlpha = clamp(alpha * 0.72);
      clawd(0, 0, u, {
        col: '#6EC4CA', dk: '#2E7C86', lt: '#B8ECEE',
        boilKey: 'celadon_ref',
        ...o,
        shadow: false,
        draw(u0, sw0) {
          // Jade Crabapple Blossom Hairpin & Ribbon Bow in reflection
          const hx = -2.2 * u0, hy = -8.2 * u0;
          for (const s of [-1, 1]) {
            paint([[hx, hy], [hx + s * 1.65 * u0, hy - 1.1 * u0], [hx + s * 1.65 * u0, hy + 0.9 * u0]], {
              wash: '#E86878', ink: PAL.ink, sw: sw0 * 0.6, curv: 0.3
            });
          }
          PAPERCUT.plum(ctx, hx, hy, u0 * 0.78, 5, '#FFF8E8');
        }
      });
      ctx.restore();
      drawReflectionRipples(ctx, x, waterY + u * 4.5, u * 6.5, alpha * 0.75);
      return;
    }

    ctx.save();
    if (alpha < 0.999) ctx.globalAlpha = clamp(alpha);
    clawd(x, y, u, {
      col: '#6EC4CA', dk: '#2E7C86', lt: '#B8ECEE',
      boilKey: o.boilKey || 'celadon',
      ...o,
      draw(u0, sw0) {
        // White-Jade Crabapple Hairpin & Coral Ribbon Bow (白玉海棠簪与珊瑚蝶结)
        const hx = -2.2 * u0, hy = -8.25 * u0;
        const fl = Math.sin(T * 6.0) * 0.45 * u0;
        inkLine([[hx, hy], [hx - 2.3 * u0, hy - 0.8 * u0 + fl], [hx - 3.8 * u0, hy + 0.2 * u0 - fl]], sw0 * 0.95, '#F5C85C', 'ink', 0.5);
        for (const s of [-1, 1]) {
          paint([[hx, hy], [hx + s * 1.7 * u0, hy - 1.12 * u0], [hx + s * 1.7 * u0, hy + 0.92 * u0]], {
            wash: '#E86878', fill: '#F5C85C', fillOp: 70, ink: PAL.ink, sw: sw0 * 0.65, curv: 0.3
          });
        }
        PAPERCUT.plum(ctx, hx, hy, u0 * 0.82, 5, '#FFF8E8');
        if (prevDraw) prevDraw(u0, sw0);
      }
    });
    ctx.restore();
  }

  function drawReflectionRipples(ctx, cx, cy, w, alpha = 0.6) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 236, 175, ${(0.45 * alpha).toFixed(3)})`;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) {
      const ry = cy + i * 22;
      const rw = w * (0.85 - Math.abs(i) * 0.12);
      const sx = Math.sin(T * 4.5 + i * 1.4) * 10;
      ctx.moveTo(cx - rw * 0.5 + sx, ry);
      ctx.lineTo(cx + rw * 0.5 + sx, ry);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Hammered Gold-Leaf Setting Sun (贴金落日)
  function drawGoldSun(ctx, x, y, r = 95, alpha = 1) {
    if (alpha <= 0.02) return;
    glow(x, y, r * 3.2, '#FFCA68', 0.82 * alpha);
    paint(ellPts(x, y, r, r, 32, 1.5), {
      wash: '#F5C85C', fill: '#E05A47', fillOp: 85, ink: '#FFF4C8', sw: 0.9
    });
    paint(ellPts(x, y, r * 0.72, r * 0.72, 28, 1.0), {
      wash: '#FFF2C2', ink: null
    });
  }

  // Mother-of-Pearl Crescent Moon Polygon (螺钿泥金真弯月，无黑底遮挡)
  function drawMotherOfPearlMoon(ctx, x, y, r = 52, tilt = -0.35) {
    glow(x, y, r * 2.6, '#E8F2FF', 0.72);
    const pts = [];
    const N = 28;
    for (let i = 0; i <= N; i++) {
      const a = lerp(-Math.PI * 0.78, Math.PI * 0.78, i / N) + tilt;
      pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
    }
    const innerX = x + Math.cos(tilt) * r * 0.44;
    const innerY = y + Math.sin(tilt) * r * 0.44;
    const innerR = r * 0.82;
    for (let i = N; i >= 0; i--) {
      const a = lerp(-Math.PI * 0.64, Math.PI * 0.64, i / N) + tilt;
      pts.push([innerX + Math.cos(a) * innerR, innerY + Math.sin(a) * innerR]);
    }
    paint(pts, {
      wash: '#FFFDF5', fill: '#B8ECEE', fillOp: 70, ink: '#F5C85C', sw: 1.2, curv: 0.25
    });
  }

  // Mother-of-Pearl & Gold Leaf Night Stars (螺钿泥金星斗)
  function drawStars(t, count = 36, alpha = 0.8) {
    const ctx = drawingContext;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const sx = hash(i * 19 + 3) * W;
      const sy = hash(i * 37 + 11) * 410;
      const tw = (0.45 + 0.55 * Math.sin(t * (2.4 + (i % 4) * 0.7) + i * 1.9)) * alpha;
      const r = 1.6 + (i % 3) * 1.1;
      ctx.globalAlpha = tw;
      ctx.fillStyle = i % 3 === 0 ? '#FFE28A' : '#E8F4FF';
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  // Drifting Dunhuang Gold-Trimmed Clouds (敦煌勾金祥云)
  function drawDunhuangClouds(ctx, t, y0 = 260, col = '#C8929E', goldCol = '#F5C85C', alpha = 0.75) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const banks = [
      { x: 260 + Math.sin(t * 0.5) * 25, y: y0, rx: 220, ry: 48 },
      { x: 920 + Math.cos(t * 0.4) * 30, y: y0 + 25, rx: 280, ry: 54 },
      { x: 1580 + Math.sin(t * 0.6) * 25, y: y0 - 10, rx: 240, ry: 50 }
    ];
    for (const b of banks) {
      paint(ellPts(b.x, b.y, b.rx, b.ry, 28, 2), {
        wash: col, fill: goldCol, fillOp: 45, ink: goldCol, sw: 0.75
      });
    }
    ctx.restore();
  }

  // ============================================================================
  // SHOT 1 (0.00 - 3.63s): 当海面迎来汹涌的潮汐 — Sunset Shore & Towering Great Wave
  // ============================================================================
  function shot01(t, lt, dur) {
    const ctx = drawingContext;
    const swellK = seg(lt, 1.80, 3.18);
    const crashK = seg(lt, 3.18, 3.62);
    const shake = lt > 2.55 ? shakeXY(t, 6 * seg(lt, 2.55, 3.55)) : [0, 0];
    const zoom = kf(lt, [[0, 1.02], [1.9, 1.06], [3.2, 0.98]]);
    camBegin(960 + shake[0], kf(lt, [[0, 540], [2.8, 515]]) + shake[1], zoom);

    QINGLV.silkGround(ctx, W, H, 'sunset', t);
    drawDunhuangClouds(ctx, t, 280, '#B88498', '#F5C85C', 0.68);
    drawGoldSun(ctx, 1340, 445, 92, 1 - swellK * 0.65);

    // Song-dynasty Blue-and-Green Mineral Mountains on the left horizon
    QINGLV.qinglvMountains(ctx, 470, W, t, { side: 'left' });

    // Mineral sea & golden sandy shore
    QINGLV.seaShore(ctx, 470, 690, W, H, t, { mode: 'sunset', sunX: 1340 });

    // Colossal Woodblock & 青绿 Great Wave swelling up behind Coral-Amber Clawd!
    QINGLV.greatWave(ctx, 560, W, H, swellK, crashK, t);

    // Coral-Amber Clawd: watches sunset (0..1.85s) -> turns front -> shocked by giant wave -> runs right!
    const u = 18.5;
    const runK = easeIn(seg(lt, 3.02, 3.60));
    const cx = lerp(890, 1380, runK);
    const cy = 785 + Math.sin(t * 3) * 3;
    if (lt < 1.88) {
      coralClawd(cx, cy, u, { view: 'back', ...move('sway', t, 0) });
    } else if (lt < 3.02) {
      const tk = take(lt, 2.52, 1.3);
      coralClawd(cx, cy, u, {
        ...emotions(lt, [
          [1.88, 'neutral'],
          [2.48, 'surprised', { eyes: 'wide', mouth: 'o', emote: 'exclaim' }],
          [2.78, 'panic', { eyes: 'wide', mouth: 'open', emote: 'sweat' }]
        ]),
        dy: tk.dy, sq: tk.sq
      });
    } else {
      coralClawd(cx, cy, u, {
        view: 'q', flip: false, walk: lt * 5.2,
        eyes: 'wide', mouth: 'o', emote: 'sweat',
        dy: -Math.abs(Math.sin(lt * 16)) * 0.8
      });
    }

    // Opening woodblock white-and-gold wave curtain receding upward (0.0 -> 0.82s)
    if (lt < 0.82) {
      QINGLV.foamCurtain(ctx, W, H, 1 - easeOut(lt / 0.82), true, t);
    }
    camEnd();
  }

  // ============================================================================
  // SHOT 2 (3.63 - 5.90s): 我奔跑寻找昔日的足迹 — Footprints in the Sand Washed by Tide
  // ============================================================================
  function shot02(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = lerp(1.04, 0.99, ease(lt / dur));
    camBegin(960, 540, zoom);

    QINGLV.silkGround(ctx, W, H, 'sunset', t);
    drawDunhuangClouds(ctx, t, 275, '#B88498', '#F5C85C', 0.7);
    drawGoldSun(ctx, 480, 445, 88, 0.9);
    QINGLV.qinglvMountains(ctx, 470, W, t, { side: 'right' });

    // Tide washes up onto the sand during lt = 1.15 .. 2.15s to erase the footprints!
    const washWave = Math.sin(seg(lt, 1.10, 2.22) * Math.PI);
    QINGLV.seaShore(ctx, 470, 675, W, H, t, {
      mode: 'sunset', sunX: 480,
      surfOffset: washWave * 165
    });

    // Receding white surf tongue on the far left at the start of Shot 2 (lt = 0 .. 0.85s)
    if (lt < 0.85) {
      const wLeft = lerp(420, -80, easeOut(lt / 0.85));
      paint([[-120, 620], [wLeft, 650], [wLeft + 45, 880], [-120, 1080]], {
        wash: '#FAF5E8', ink: '#F5C85C', sw: 1.2
      });
    }

    // Trail of 10 pairs of mud-gold & ochre footprints in the sand (昔日的足迹)
    // Created as Coral-Amber Clawd runs from x = 1520 -> 680 during lt = 0 .. 1.08s, then erased by the wave!
    for (let i = 0; i < 10; i++) {
      const fx = 1480 - i * 78;
      const appearT = i * 0.095;
      const eraseT = 1.22 + (9 - i) * 0.065;
      if (lt > appearT && lt < eraseT + 0.25) {
        const fa = clamp(Math.min((lt - appearT) / 0.08, (eraseT + 0.25 - lt) / 0.25));
        ctx.save();
        ctx.globalAlpha = fa * 0.78;
        ctx.fillStyle = '#8C5230';
        ctx.strokeStyle = '#F5C85C';
        ctx.lineWidth = 1.4;
        for (const s of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(fx + s * 10, 815 + s * 11, 11, 5.5, -0.15, 0, TAU);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // Coral-Amber Clawd running R -> L (lt = 0..1.08s), then stopping & watching the tide erase his footprints
    const u = 19.5;
    const runP = easeOut(seg(lt, 0, 1.08));
    const cx = lerp(1520, 675, runP);
    const cy = lerp(805, 735, seg(lt, 1.05, 1.65));
    if (lt < 1.08) {
      coralClawd(cx, cy, u, {
        view: 'q', flip: true, walk: lt * 5.0,
        eyes: 'wide', mouth: 'o', emote: 'sweat',
        dy: -Math.abs(Math.sin(lt * 15)) * 0.7
      });
    } else {
      // Dark mini rain cloud appears above his head as footprints vanish
      const cloudA = seg(lt, 1.25, 1.55);
      if (cloudA > 0.02) {
        INK.washBlob(ctx, cx, cy - 10.8 * u, 52 * cloudA, 22 * cloudA, { tone: 0.75 * cloudA, seed: 31, col: '#2D3854' });
      }
      coralClawd(cx, cy, u, {
        ...emotions(lt, [
          [1.08, 'surprised', { lookX: 0.6 }],
          [1.38, 'sad', { lookX: 0.5, gloom: 0.35 }]
        ]),
        ...move('sway', t, 0)
      });
    }
    camEnd();
  }

  // ============================================================================
  // SHOT 3 (5.90 - 9.80s): 夕阳下倒影迷人的美丽 / 可我却丢失故事和你 — Sunset Mirror Reflection
  // ============================================================================
  function shot03(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = kf(lt, [[0, 1.06], [1.95, 1.02], [3.9, 0.98]]);
    camBegin(960, 545, zoom);

    QINGLV.silkGround(ctx, W, H, 'sunset', t);
    drawDunhuangClouds(ctx, t, 270, '#B88498', '#F5C85C', 0.75);
    drawGoldSun(ctx, 1290, 440, 94, 0.95);
    QINGLV.qinglvMountains(ctx, 465, W, t, { side: 'left' });

    // Mirror-like wet sunset tidal flat (wetSand: true)
    QINGLV.seaShore(ctx, 465, 635, W, H, t, { mode: 'sunset', sunX: 1290, wetSand: true });

    const u = 19.5;
    const sx = 865, sy = 642;

    // Celadon-Jade Partner's magical upside-down reflection in the water!
    // Appears at lt = 0.65s (t = 6.55s) and gets wiped away by a water ripple at lt = 2.75..3.15s (t = 8.65..9.05s)
    const refIn = ease(seg(lt, 0.62, 1.02));
    const refOut = 1 - ease(seg(lt, 2.72, 3.12));
    const celadonRefAlpha = refIn * refOut;

    if (celadonRefAlpha > 0.02) {
      celadonClawd(1035, sy, u, {
        onlyReflect: true,
        alpha: celadonRefAlpha,
        eyes: 'happy', mouth: 'smile', blush: 0.8
      });
      // Floating crimson heart above Coral-Amber Clawd while their reflections are together
      if (lt > 0.85 && lt < 2.05) {
        const ha = Math.sin(seg(lt, 0.85, 2.05) * Math.PI);
        PAPERCUT.heart(ctx, sx + 4.5 * u, sy - 9.2 * u - lt * 12, 18 * ha, 0.15, '#D2201F', '#FFF5E2');
      }
    }

    // Water ripple wave that washes away the partner's reflection at lt = 2.65..3.25s
    if (lt > 2.60 && lt < 3.35) {
      const rk = seg(lt, 2.60, 3.35);
      for (let k = 0; k < 4; k++) {
        const ry = lerp(660, 830, (rk + k * 0.18) % 1);
        inkLine([[700, ry], [1220, ry + Math.sin(rk * TAU + k) * 6]], 1.4, '#FFF2C6', 'ink', 0.4);
      }
    }

    // Overhead mini rain cloud after the reflection vanishes (lt > 3.05s)
    if (lt > 3.05) {
      const ca = seg(lt, 3.05, 3.35);
      INK.washBlob(ctx, sx, sy - 10.6 * u, 54 * ca, 22 * ca, { tone: 0.78 * ca, seed: 41, col: '#2D3854' });
    }

    // Coral-Amber Clawd standing at the water line WITH his upside-down reflection below
    const mood = emotions(lt, [
      [0.00, 'sad', { lookY: 0.5 }],
      [0.75, 'love', { eyes: 'happy', mouth: 'smile', blush: 0.85, lookX: 0.4, lookY: 0.6 }],
      [1.98, 'hopeful', { eyes: 'normal', mouth: 'smile', lookX: 0.85, lookY: 0.0 }],
      [2.55, 'surprised', { eyes: 'wide', mouth: 'o', lookX: 0.6, lookY: 0.6 }],
      [2.95, 'sad', { eyes: 'sad', mouth: 'frown', gloom: 0.4, lookY: 0.6 }]
    ]);
    coralClawd(sx, sy, u, {
      ...move('sway', t, 0),
      ...mood,
      reflect: true,
      reflectAlpha: 0.68
    });

    camEnd();

    // Warm golden flashback flash at the end of Shot 3 (9.62 - 9.80s)
    if (lt > dur - 0.22) {
      flash(easeIn((lt - (dur - 0.22)) / 0.22), '#FFF5D6');
    }
  }

  // ============================================================================
  // SHOT 4 (9.80 - 16.40s): 你说过向往大海的神秘 / 也憧憬我们遗失的过去 / 分享给大海秘密
  // Golden Daylight Flashback, Leaping Koi & Blue-and-White Porcelain Drift Bottle
  // ============================================================================
  function shot04(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = kf(lt, [[0, 1.0], [3.2, 1.06], [6.6, 1.02]]);
    camBegin(960, 540, zoom);

    // Radiant Golden Daylight Silk Ground (千里江山金碧白昼)
    QINGLV.silkGround(ctx, W, H, 'golden', t);
    drawGoldSun(ctx, 1520, 215, 115, 0.95);
    QINGLV.qinglvMountains(ctx, 470, W, t, { side: 'left', night: 0 });
    QINGLV.seaShore(ctx, 470, 685, W, H, t, { mode: 'golden', sunX: 1520 });

    // Leaping Vermilion-and-Gold Koi Fish (锦鲤跃浪) during [0.8 .. 1.9s] and [4.5 .. 5.6s]
    for (const tJump of [0.85, 4.45]) {
      const jk = seg(lt, tJump, tJump + 1.05);
      if (jk > 0 && jk < 1) {
        const kp = arcPt([1380, 565], [1160, 565], 115, jk);
        const ang = Math.atan2((jk - 0.5) * 220, -220);
        QINGLV.koi(ctx, kp[0], kp[1], 1.15, ang, t, '#E05A47');
        if (jk < 0.2 || jk > 0.8) {
          paint(ellPts(kp[0], 565, 28, 8, 14), { wash: '#FFF9EA', ink: '#F5C85C', sw: 0.8 });
        }
      }
    }

    const u = 19.5;
    // Phase A (0..1.85s): Standing side by side admiring the sea
    // Phase B (1.85..4.10s): Leaning affectionately together with floating hearts
    // Phase C (4.10..6.60s): Sharing secret -> tossing the Blue-and-White Porcelain Drift Bottle into the sea!
    const cuddleK = Math.sin(seg(lt, 1.85, 4.15) * Math.PI);
    const cx = lerp(845, 892, cuddleK), sx = lerp(1055, 1002, cuddleK);
    const gy = 765;

    celadonClawd(cx, gy, u, {
      ...emotions(lt, [
        [0.0, 'happy', { lookX: 0.4 }],
        [1.85, 'love', { blush: 0.85, rot: 0.08 * cuddleK }],
        [4.10, 'excited', { aR: 1.25 }]
      ]),
      ...move('sway', t, 0)
    });

    coralClawd(sx, gy, u, {
      ...emotions(lt, [
        [0.0, 'happy', { lookX: -0.4 }],
        [1.85, 'love', { blush: 0.85, rot: -0.08 * cuddleK, emote: 'hearts' }],
        [4.10, 'starstruck', { lookX: -0.5 }]
      ]),
      ...move('sway', t, 1)
    });

    // Blue-and-White Porcelain Drift Bottle (青花瓷漂流瓶) held up at lt = 4.10..5.15s, then arcing into the sea at 5.15..6.35s!
    if (lt >= 4.10) {
      if (lt < 5.15) {
        const popK = backOut(seg(lt, 4.10, 4.50));
        QINGLV.porcelainBottle(ctx, cx + 3.2 * u, gy - 6.5 * u, 0.95 * popK, Math.sin(t * 5) * 0.15, 0.8);
      } else {
        const tk = ease(seg(lt, 5.15, 6.32));
        const bp = arcPt([cx + 3.2 * u, gy - 6.5 * u], [1350, 560], 240, tk);
        if (tk < 0.98) {
          QINGLV.porcelainBottle(ctx, bp[0], bp[1], lerp(0.95, 0.55, tk), tk * 5.2, 0.9);
        }
        // Golden water splash when bottle hits the sea at lt = 6.20..6.60s!
        if (lt >= 6.20) {
          const spK = seg(lt, 6.20, 6.58);
          glow(1350, 560, 95 * (1 - spK * 0.5), '#FFF0B8', 0.9 * (1 - spK));
          paint(ellPts(1350, 560, 18 + 65 * spK, 6 + 20 * spK, 20), {
            wash: null, ink: '#FFF9EA', sw: 1.4 * (1 - spK)
          });
        }
      }
    }

    INK.seal(ctx, 1760, 135, 52, ['潮', '汐'], 19);
    camEnd();

    if (lt < 0.25) {
      flash(1 - lt / 0.25, '#FFF5D6');
    }
  }

  // ============================================================================
  // SHOT 5 (16.40 - 28.53s): 蓝色的海底 / 远山的风景 / 我们的距离遥不可及 / 退守的爱情 / 还剩下回忆
  // Lapis Seabed -> Pearl Bubble Wipe -> Dusk Shore & Distant Peak -> Bottle Returns -> Dunhuang Memory Mandala
  // ============================================================================
  function shot05(t, lt, dur) {
    const ctx = drawingContext;
    const tDusk = 2.02; // lt = 2.02s (t = 18.42s: transition from underwater seabed to dusk shore)

    if (lt < tDusk) {
      // ---- SUB-SCENE 5A (16.40 - 18.42s): 蓝色的海底 (Deep Lapis-Lazuli Seabed) ----
      camBegin(960, 540, lerp(1.0, 1.06, lt / tDusk));
      QINGLV.silkGround(ctx, W, H, 'seabed', t);

      // Slanting underwater sunbeams / caustics (深海天光水柱)
      ctx.save();
      for (let i = 0; i < 5; i++) {
        const bx = 320 + i * 310 + Math.sin(t * 1.5 + i) * 25;
        ctx.fillStyle = 'rgba(130, 215, 235, 0.08)';
        ctx.beginPath();
        ctx.moveTo(bx - 55, -50);
        ctx.lineTo(bx + 55, -50);
        ctx.lineTo(bx + 165, H + 50);
        ctx.lineTo(bx - 15, H + 50);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Deep ocean canyon silhouettes
      INK.mountainLayer(ctx, { yBase: 520, amp: 220, freq: 0.0025, seed: 81, tone: 0.55, fadeY: 900, col: '#0B1D3A', mistCol: '#112E56' });

      // Sandy seabed floor (海底沙床)
      paint([[-200, 830], [480, 805], [1180, 840], [2120, 810], [2120, 1180], [-200, 1180]], {
        wash: '#2B4C6E', fill: '#1A324E', fillOp: 120, ink: '#F5C85C', sw: 1.1, curv: 0.3
      });

      // Swaying Dunhuang-ribbon kelp forests (飞天绶带水草)
      const kelpXs = [180, 340, 560, 740, 1180, 1390, 1610, 1760];
      kelpXs.forEach((kx, idx) => {
        QINGLV.kelp(ctx, kx, 845, 160 + (idx % 3) * 55, t, idx + 1, idx % 2 ? '#267F68' : '#3B9E82');
      });

      // Swimming Vermilion & Gold Koi Fish
      const fishList = [
        { x0: 420, y: 380, sp: 95, dir: 1, col: '#E05A47' },
        { x0: 1380, y: 460, sp: -110, dir: -1, col: '#F5C85C' },
        { x0: 680, y: 610, sp: 85, dir: 1, col: '#F5C85C' },
        { x0: 1220, y: 310, sp: -90, dir: -1, col: '#E05A47' }
      ];
      for (let i = 0; i < fishList.length; i++) {
        const f = fishList[i];
        const fx = f.x0 + lt * f.sp;
        const fy = f.y + Math.sin(t * 3 + i * 2) * 14;
        QINGLV.koi(ctx, fx, fy, 0.9, f.dir > 0 ? 0 : Math.PI, t + i, f.col);
      }

      // Sinking Blue-and-White Porcelain Drift Bottle + rising pearl bubble trail!
      const sinkK = easeOut(seg(lt, 0.0, 1.65));
      const bx = 960 + Math.sin(lt * 4) * 18;
      const by = lerp(80, 780, sinkK);
      for (let b = 0; b < 12; b++) {
        const bu = b / 11;
        const py = lerp(by - 28, 40, bu) - frac(t * 2 + b * 0.2) * 24;
        const px = bx + Math.sin(t * 5 + b * 1.3) * (8 + bu * 16);
        if (py < by - 20) {
          paint(ellPts(px, py, 5 + (b % 3) * 3, 5 + (b % 3) * 3, 10), {
            wash: '#E0F7FF', washOp: 190, ink: '#FFFFFF', sw: 0.5
          });
        }
      }
      QINGLV.porcelainBottle(ctx, bx, by, 1.05, -0.25 + sinkK * 0.65, 0.95);
      camEnd();
    } else {
      // ---- SUB-SCENES 5B..5E (18.42 - 28.53s): Dusk Shore, Distant Mountain, Returned Bottle & Memory Orb ----
      const sub = lt - tDusk; // 0.0 .. 10.11s
      const zoom = kf(sub, [[0, 1.02], [2.2, 0.96], [5.8, 1.02], [8.2, 1.08]]);
      camBegin(960, kf(sub, [[0, 540], [8.2, 520]]), zoom);

      QINGLV.silkGround(ctx, W, H, 'dusk', t);
      drawStars(t, 28, 0.65);
      drawDunhuangClouds(ctx, t, 260, '#5E4B78', '#D8B478', 0.65);

      // Majestic Song-dynasty 青绿 Mountains on the far right peninsula (远山的风景)
      QINGLV.qinglvMountains(ctx, 470, W, t, {
        side: 'right', night: 0.42,
        peaks: [
          { x0: 1080, x1: 2060, px: 1620, py: 265, seed: 23 },
          { x0: 980,  x1: 1620, px: 1290, py: 355, seed: 29 }
        ]
      });

      QINGLV.seaShore(ctx, 470, 690, W, H, t, { mode: 'dusk', sunX: 1120 });

      // Sub-scene 5C (sub = 2.0 .. 5.75s, t = 20.42 .. 24.17s): 我们的距离遥不可及
      // Distant glowing silhouette of Celadon-Jade Partner on the far mountain shore (x = 1520, y = 458)
      if (sub > 1.85 && sub < 5.85) {
        const distA = Math.sin(seg(sub, 1.85, 5.85) * Math.PI);
        glow(1520, 452, 75 * distA, '#80E8F0', 0.85 * distA);
        celadonClawd(1520, 468, 6.2, {
          alpha: distA,
          eyes: 'happy', mouth: 'smile'
        });
      }

      // Sub-scene 5D & 5E (sub > 5.75s, t > 24.17s): 退守的爱情 — Porcelain bottle washes back onto the beach!
      if (sub > 5.75) {
        const bk = easeOut(seg(sub, 5.75, 7.20));
        const bx = lerp(1220, 1055, bk);
        const by = lerp(665, 768, bk) + Math.sin(t * 3) * 2.5;
        QINGLV.porcelainBottle(ctx, bx, by, 0.92, 1.15 - bk * 0.35, 0.82);
      }

      // Coral-Amber Clawd acting through 5B -> 5C -> 5D -> 5E
      const u = 19.5;
      if (sub < 1.98) {
        // 5B (18.42 - 20.40s): 远山的风景 — Sprawled flat on the dusk beach gazing at the distant mountains
        coralClawd(690, 775, u, {
          sq: 0.42, dy: 1.05,
          eyes: 'sad', mouth: 'flat', lookX: 0.7,
          ...move('breathe', t, 0)
        });
      } else if (sub < 5.75) {
        // 5C (20.40 - 24.15s): 我们的距离遥不可及 — Jumps up (!) and walks toward the water looking at distant partner
        const walkK = easeOut(seg(sub, 2.35, 4.20));
        const cx = lerp(690, 825, walkK);
        const cy = lerp(755, 675, walkK);
        const tk = take(sub, 2.05, 1.2);
        coralClawd(cx, cy, u, {
          view: sub > 2.35 ? 'q' : 'front',
          walk: sub > 2.35 && sub < 4.20 ? sub * 2.4 : null,
          eyes: sub < 2.45 ? 'wide' : 'sad',
          mouth: sub < 2.45 ? 'o' : 'frown',
          emote: sub < 2.55 ? 'exclaim' : null,
          lookX: 0.8,
          dy: tk.dy, sq: tk.sq
        });
      } else {
        // 5D & 5E (24.15 - 28.53s): 退守的爱情 / 还剩下回忆 — Bottle returns; Dunhuang Memory Mandala blooms overhead!
        const centerK = ease(seg(sub, 7.40, 8.25));
        const cx = lerp(825, 890, centerK);
        const cy = lerp(675, 760, centerK);
        coralClawd(cx, cy, u, {
          ...emotions(sub, [
            [5.75, 'sad', { lookX: 0.6, lookY: 0.5 }],
            [7.65, 'surprised', { eyes: 'wide', mouth: 'o', emote: 'exclaim' }],
            [8.35, 'teary', { eyes: 'teary', mouth: 'wobble', lookY: -0.7 }],
            [9.55, 'sad', { eyes: 'closed', mouth: 'frown', gloom: 0.35 }]
          ]),
          ...move('sway', t, 0)
        });

        // Sub-scene 5E (sub = 8.15 .. 9.85s, t = 26.57 .. 28.27s): Dunhuang Golden Memory Mandala Orb (敦煌泥金回忆光球)
        if (sub > 8.10 && sub < 9.95) {
          const orbIn = backOut(seg(sub, 8.10, 8.55));
          const orbOut = 1 - easeIn(seg(sub, 9.45, 9.92));
          const orbSc = orbIn * orbOut;
          const ox = cx, oy = cy - 15.2 * u;
          const or = 128 * orbSc;
          if (or > 8) {
            glow(ox, oy, or * 2.1, '#FFE07D', 0.85 * orbOut);
            // Outer Dunhuang mud-gold flame-petal mandala ring
            PAPERCUT.tuanhua(ctx, ox, oy, or * 1.12, t * 0.35, '#F5C85C', '#FFF6DC', 0.85 * orbOut);
            // Circular clip showing the golden beach memory of both characters snuggled together!
            ctx.save();
            ctx.beginPath();
            ctx.arc(ox, oy, or * 0.88, 0, TAU);
            ctx.clip();
            ctx.fillStyle = '#FFF0BE';
            ctx.fillRect(ox - or, oy - or, or * 2, or * 2);
            ctx.fillStyle = '#58B894';
            ctx.fillRect(ox - or, oy, or * 2, or);
            ctx.fillStyle = '#F5D696';
            ctx.fillRect(ox - or, oy + or * 0.25, or * 2, or);
            celadonClawd(ox - 24 * orbSc, oy + 42 * orbSc, 9.5 * orbSc, {
              eyes: 'happy', mouth: 'smile', rot: 0.08
            });
            coralClawd(ox + 22 * orbSc, oy + 42 * orbSc, 9.5 * orbSc, {
              eyes: 'happy', mouth: 'smile', rot: -0.08
            });
            PAPERCUT.heart(ctx, ox, oy - 36 * orbSc, 14 * orbSc, 0, '#D2201F', '#FFF5E2');
            ctx.restore();
            inkLine(ellPts(ox, oy, or * 0.88, or * 0.88, 32), 1.6, '#F5C85C', 'ink', 0);
          }
        }
      }
      camEnd();
    }

    // Pearl Bubble Curtain Transition (夜明珠气泡幕墙) at lt = 1.62 .. 2.38s (t = 18.02 .. 18.78s)
    if (lt > 1.62 && lt < 2.38) {
      const bp = (lt - 1.62) / 0.76; // 0 .. 1
      for (let i = 0; i < 44; i++) {
        const colIdx = i % 9, rowIdx = Math.floor(i / 9);
        const bx = (colIdx + 0.5) * (W / 9) + Math.sin(i * 2.3) * 35;
        const baseR = 95 + (i % 3) * 28;
        const by = lerp(H + 180 + rowIdx * 95, -220 - rowIdx * 65, ease(bp));
        const sc = bp < 0.65 ? 1 : Math.max(0, 1 - (bp - 0.65) / 0.35);
        if (sc > 0.05) {
          paint(ellPts(bx, by, baseR * sc, baseR * sc, 20), {
            wash: i % 2 ? '#C8ECF8' : '#E2F6FF', washOp: 235,
            fill: '#74C2C8', fillOp: 80, ink: '#1B4F82', sw: 0.9
          });
        }
      }
    }

    // Fast horizontal wind/brush streak wipe at the end of Shot 5 (lt = 11.92 .. 12.13s, t = 28.32 .. 28.53s)
    if (lt > dur - 0.24) {
      const wk = (lt - (dur - 0.24)) / 0.48;
      brushWipe(wk, ['#9EA8D8', '#25325C']);
    }
  }

  // ============================================================================
  // SHOT 6 (28.53 - 32.30s): 疯狂的寻觅你的身影 — Moonlit Lacquer Night & Water Reflection Reunion
  // ============================================================================
  function shot06(t, lt, dur) {
    const ctx = drawingContext;
    const zoom = kf(lt, [[0, 1.02], [1.4, 1.06], [dur, 1.02]]);
    camBegin(960, 540, zoom);

    // Mother-of-Pearl & Lacquer Night Sea (螺钿黑漆夜海)
    QINGLV.silkGround(ctx, W, H, 'night', t);
    drawStars(t, 42, 0.9);
    drawDunhuangClouds(ctx, t, 250, '#2C345E', '#9EA8D8', 0.55);

    // Mother-of-Pearl Crescent Moon (螺钿弯月) at (1350, 170)
    drawMotherOfPearlMoon(ctx, 1350, 170, 52, -0.42);

    QINGLV.qinglvMountains(ctx, 465, W, t, {
      side: 'right', night: 0.82,
      peaks: [
        { x0: 1120, x1: 2040, px: 1610, py: 280, seed: 23 },
        { x0: 1010, x1: 1620, px: 1310, py: 365, seed: 29 }
      ]
    });

    QINGLV.seaShore(ctx, 465, 645, W, H, t, { mode: 'night', sunX: 1350, wetSand: true });

    const u = 19.5;
    if (lt < 1.32) {
      // Phase A (28.53 - 29.85s): 疯狂的寻觅你的身影 — Frantically running back and forth searching along the moonlit beach
      const searchX = lt < 0.65
        ? lerp(580, 1080, easeOut(lt / 0.65))
        : lerp(1080, 835, ease((lt - 0.65) / 0.67));
      coralClawd(searchX, 652, u, {
        view: 'q',
        flip: lt >= 0.65,
        walk: lt * 5.8,
        eyes: 'wide', mouth: 'o', emote: 'sweat',
        dy: -Math.abs(Math.sin(lt * 18)) * 0.75,
        reflect: true,
        reflectAlpha: 0.55
      });
    } else {
      // Phase B (29.85 - 32.30s): Stops weeping at the water's edge; Celadon-Jade Partner's reflection appears in the moonlit water!
      const sx = 835, sy = 652;
      const refAlpha = ease(seg(lt, 1.92, 2.38));
      if (refAlpha > 0.02) {
        celadonClawd(1008, sy, u, {
          onlyReflect: true,
          alpha: refAlpha,
          eyes: 'happy', mouth: 'smile', blush: 0.85
        });
      }
      coralClawd(sx, sy, u, {
        ...feel('sad', t, { eyes: 'teary', mouth: 'wobble', gloom: 0.3, lookX: 0.4, lookY: 0.6, emote: null }),
        reflect: true,
        reflectAlpha: 0.68
      });
    }
    camEnd();

    if (lt < 0.24) {
      brushWipe(0.5 + lt / 0.48, ['#9EA8D8', '#25325C']);
    }
  }

  // ============================================================================
  // SHOT 7 (32.30 - 33.03s): 雕版白浪合卷 — Woodblock White-and-Gold Wave Curtain Outro
  // ============================================================================
  function shot07(t, lt, dur) {
    const ctx = drawingContext;
    // Render the final frame of Shot 6 underneath as the wave curtain sweeps down over it
    shot06(t, 3.77, 3.77);

    const cov = easeOut(seg(lt, 0.0, 0.38));
    QINGLV.foamCurtain(ctx, W, H, cov, true, t);

    // Subtle woodblock wave ripples & Vermilion Seal on the closed silk curtain (lt > 0.25s)
    if (cov > 0.85) {
      const sa = clamp((lt - 0.22) / 0.28);
      ctx.save();
      ctx.globalAlpha = sa;
      for (let i = 0; i < 5; i++) {
        const wx = 320 + i * 320, wy = 920 + (i % 2) * 35;
        inkLine([[wx - 45, wy], [wx, wy - 10], [wx + 45, wy]], 0.9, '#D8C8A8', 'inkfine', 0.4);
      }
      INK.seal(ctx, 960, 510, 68, ['潮', '汐'], 99);
      ctx.restore();
    }
  }

  // Register all 7 contiguous shots covering 0.00s .. 33.03s
  shots([
    [0.00,  shot01],
    [3.63,  shot02],
    [5.90,  shot03],
    [9.80,  shot04],
    [16.40, shot05],
    [28.53, shot06],
    [32.30, shot07]
  ]);
})();
