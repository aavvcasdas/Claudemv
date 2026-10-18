// tide_p5.js — 《潮汐》p5.brush 风格重制
// 使用完整 p5.brush 引擎：相机系统、角色动画、笔触渲染
// 参考 chaoxi-tide 项目质量，用不同视觉语言诠释

(() => {
  // 本地辅助函数
  const slab = (x, y, w, h, col, j = 3, op = 255) => paint(rectPts(x, y, w, h, j), { wash: col, washOp: op, ink: null });
  const ln = (pts, sw = 1.1, col = PAL.ink, br = 'inkfine', curv = .6) => inkLine(pts, sw, col, br, curv);
  const dotAt = (x, y, r, col, op = 255) => paint(ellPts(x, y, r, r * .95, 8, .4), { wash: col, washOp: op, ink: null });

  // 节拍网格：118 BPM, 4/4, 第一正拍 0.456s
  const BEAT_S = 60 / 118;
  const BAR_S = 4 * BEAT_S;
  const GRID0 = 0.456;
  const beatNo = n => GRID0 + n * BEAT_S;

  // 角色尺寸
  const HERO_U = 24, DEAR_U = 22;

  // 调色板（海洋主题）
  const SEA = {
    deep: '#1A2847', mid: '#2E4A6E', surface: '#4A7FA5',
    foam: '#C8E0F0', sand: '#E4CFA6', sandWet: '#B8A882',
    sunset: '#FF9A6C', sunsetGlow: '#FFD4A8',
    night: '#1A1F3A', moon: '#F0E8D0',
    clay: '#D97757', clayDk: '#A84D33',
    blue: '#6FA3CE', blueDk: '#4A7BA3',
  };

  // ---- 场景元素 ----

  // 海平面 + 波浪
  function seaView(t, opts = {}) {
    const hy = opts.hy || H * 0.5;
    const dusk = opts.dusk || 0;

    // 天空渐变
    const skyTop = dusk ? mixCol('#1A1F3A', '#FF9A6C', dusk * 0.5) : '#1A2847';
    const skyBot = dusk ? mixCol('#4A7FA5', '#FFD4A8', dusk * 0.7) : '#4A7FA5';
    for (let y = 0; y < hy; y++) {
      const k = y / hy;
      const col = mixCol(skyTop, skyBot, k);
      slab(0, y, W, 1, col, 0, 255);
    }

    // 海面
    const seaTop = mixCol('#2E4A6E', '#FFD4A8', dusk * 0.3);
    const seaBot = mixCol('#1A2847', '#FF9A6C', dusk * 0.2);
    for (let y = hy; y < H; y++) {
      const k = (y - hy) / (H - hy);
      const col = mixCol(seaTop, seaBot, k);
      slab(0, y, W, 1, col, 0, 255);
    }

    // 波浪线
    boilSeed('seaWaves');
    for (let i = 0; i < 4; i++) {
      const y = hy + i * 30 + Math.sin(t * 0.8 + i) * 5;
      const pts = [];
      for (let x = 0; x <= W; x += 40) {
        pts.push([x, y + Math.sin(x * 0.02 + t * 1.5 + i * 2) * 8]);
      }
      ln(pts, 2 - i * 0.3, mixCol('#C8E0F0', '#FFFFFF', 0.3), 'inkfine', 0.6);
    }
  }

  // 沙滩
  function beachAt(t, opts = {}) {
    const by = opts.by || H * 0.75;
    const wet = opts.wet || 0;

    // 沙滩主体
    const sandCol = wet ? mixCol('#E4CFA6', '#B8A882', wet) : '#E4CFA6';
    slab(0, by, W, H - by, sandCol, 3, 255);

    // 沙滩纹理（小点）
    boilSeed('beachTex');
    for (let i = 0; i < 50; i++) {
      const x = hash(i * 7) * W;
      const y = by + hash(i * 11) * (H - by);
      const r = 1 + hash(i * 3) * 2;
      dotAt(x, y, r, mixCol('#D4B896', '#FFFFFF', hash(i * 5)), 180);
    }

    // 水线（湿润边缘）
    if (wet > 0.1) {
      boilSeed('waterLine');
      const pts = [];
      for (let x = 0; x <= W; x += 30) {
        pts.push([x, by + Math.sin(x * 0.03 + t * 2) * 6]);
      }
      ln(pts, 3, mixCol('#C8E0F0', '#FFFFFF', 0.4), 'inkfine', 0.8);
    }
  }

  // 月亮
  function moonAt(x, y, r, t) {
    // 光晕
    glow(x, y, r * 3, '#F0E8D0', 0.25);

    // 月盘
    paint(ellPts(x, y, r, r, 20, 1), { wash: '#F0E8D0', washOp: 240, ink: null });

    // 环形山（淡）
    boilSeed('moonCraters');
    for (let i = 0; i < 5; i++) {
      const cx = x + (hash(i * 7) - 0.5) * r * 1.2;
      const cy = y + (hash(i * 11) - 0.5) * r * 1.2;
      const cr = r * 0.15 + hash(i * 3) * r * 0.1;
      paint(ellPts(cx, cy, cr, cr * 0.8, 10, 0.5), { wash: '#D8D0C0', washOp: 150, ink: null });
    }
  }

  // 星星
  function starsAt(t, count = 30) {
    boilSeed('stars');
    for (let i = 0; i < count; i++) {
      const x = hash(i * 3) * W;
      const y = hash(i * 7 + 1) * H * 0.5;
      const twinkle = 0.5 + 0.5 * Math.sin(t * 2 + i * 1.7);
      const r = 1 + hash(i * 11) * 1.5;
      dotAt(x, y, r * twinkle, '#FFF8E8', 200 * twinkle);
    }
  }

  // 浪花飞溅
  function sprayAt(x, y, count, t) {
    boilSeed('spray' + x);
    for (let i = 0; i < count; i++) {
      const ph = frac(t * 1.5 + hash(i * 3.7));
      const sx = x + (hash(i * 2.1) - 0.5) * 60;
      const sy = y - ph * 40 + hash(i) * 20;
      const r = 1.5 + hash(i * 5) * 2.5;
      dotAt(sx, sy, r, '#C8E0F0', 200 * (1 - ph));
    }
  }

  // 纸花（记忆的象征）
  function paperFlowerAt(x, y, s, t) {
    const n = 5, r = s * 0.6;
    push(); translate(x, y);
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU - Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
      const px = Math.cos(a) * r * 0.5;
      const py = Math.sin(a) * r * 0.5;
      paint([[0, 0], [px - Math.sin(a) * r * 0.3, py + Math.cos(a) * r * 0.3],
             [px + Math.cos(a) * r * 0.15, py + Math.sin(a) * r * 0.15],
             [px + Math.sin(a) * r * 0.3, py - Math.cos(a) * r * 0.3]],
            { wash: i % 2 ? '#FFF8E8' : '#FFE0E8', ink: null });
    }
    paint(ellPts(0, 0, s * 0.2, s * 0.18, 10, 0.3), { wash: '#E08A96', ink: null });
    pop();
  }

  // 脚印
  function footTrail(x, y, count, spacing, dir, col) {
    boilSeed('footTrail');
    for (let i = 0; i < count; i++) {
      const fx = x + dir * i * spacing;
      const fy = y + Math.sin(i * 0.8) * 3;
      slab(fx - 6, fy - 4, 12, 8, col, 1, 150);
      slab(fx - 5, fy - 3, 4, 3, mixCol(col, '#000000', 0.2), 0.5, 120);
      slab(fx + 1, fy - 3, 4, 3, mixCol(col, '#000000', 0.2), 0.5, 120);
    }
  }

  // ---- 相机辅助 ----
  let camX = W / 2, camY = H / 2, camZoom = 1, camRot = 0;
  function camBegin(x, y, zoom, rot) {
    camX = x; camY = y; camZoom = zoom; camRot = rot;
    push(); translate(W / 2, H / 2); rotate(camRot); scale(camZoom); translate(-camX, -camY);
  }
  function camEnd() { pop(); }

  // ---- 镜头定义 ----

  // 第 1 镜 (0–1.98s): 潮汐涌来，小小背影面对大海
  const s1 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.1, 1.0, ease(seg(lt, 0, D))), 0);

    seaView(t, { hy: H * 0.45 });
    beachAt(t, { by: H * 0.72, wet: 0.3 });

    // 潮头推进
    const surge = ease(seg(lt, 0, 1.3));
    boilSeed('s1Surge');
    for (let i = 0; i < 3; i++) {
      const y = lerp(H * 0.55, H * 0.70 + i * H * 0.04, surge);
      const pts = [];
      for (let x = 0; x <= W; x += 30) {
        pts.push([x, y + Math.sin(x * 0.03 + t * 2 + i) * 10]);
      }
      ln(pts, 2.5 - i * 0.5, mixCol('#C8E0F0', '#FFFFFF', 0.4), 'inkfine', 0.8);
    }

    // 浪花
    sprayAt(W * 0.5, H * 0.65, 15, t);

    // 主角背影
    clawd(W * 0.5, H * 0.78, HERO_U, {
      col: SEA.clay, dk: SEA.clayDk, lt: '#F2A283',
      view: 'back', feel: 'moved',
      aL: -0.1, aR: -0.1,
      boilKey: 'hero1',
    });

    camEnd();
  };

  // 第 2 镜 (1.98–4.02s): 奔跑寻找足迹
  const s2 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.0, 1.05, ease(seg(lt, 0.3, D))), 0);

    seaView(t, { hy: H * 0.42 });
    beachAt(t, { by: H * 0.75, wet: 0.2 });

    // 奔跑位置
    const run = lt * 3.5;
    const px = lerp(W * 0.2, W * 0.7, easeOut(seg(lt, 0, 1.8)));

    // 脚印
    footTrail(px - W * 0.2, H * 0.82, 6, 18, 1, mixCol('#A9845C', '#000000', 0.2));

    // 浪抹脚印
    const wash = ease(seg(lt, 1.0, 1.9));
    boilSeed('s2Wash');
    ln([[-20, H * 0.84], [lerp(-20, W * 0.5, wash), H * 0.84 + Math.sin(t * 3) * 3]],
       2.5, mixCol('#C8E0F0', '#FFFFFF', 0.5), 'inkfine', 0.7);

    // 主角奔跑
    clawd(px, H * 0.82, HERO_U, {
      col: SEA.clay, dk: SEA.clayDk, lt: '#F2A283',
      view: 'side', walk: run,
      feel: 'determined',
      aL: 0.5, aR: 0.3,
      boilKey: 'hero2',
    });

    camEnd();
  };

  // 第 3 镜 (4.02–6.05s): 夕阳倒影
  const s3 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.0, 1.03, ease(seg(lt, 0.2, D))), 0);

    seaView(t, { hy: H * 0.48, dusk: 0.8 });
    beachAt(t, { by: H * 0.78, wet: 0.6 });

    // 夕阳光晕
    glow(W * 0.5, H * 0.3, 200, '#FFD4A8', 0.4);

    // 两个角色
    const hx = W * 0.42, dx = W * 0.58, fy = H * 0.78;
    const sway = Math.sin(t * 0.8) * 0.02;

    clawd(hx, fy, HERO_U, {
      col: SEA.clay, dk: SEA.clayDk, lt: '#F2A283',
      view: 'q', feel: 'moved',
      rot: sway,
      aL: 0.15, aR: 0.15,
      boilKey: 'hero3',
    });

    clawd(dx, fy, DEAR_U, {
      col: SEA.blue, dk: SEA.blueDk, lt: '#A9CEE6',
      view: 'q', flip: true, feel: 'happy',
      rot: -sway,
      aL: 0.15, aR: 0.15,
      boilKey: 'dear3',
    });

    // 倒影
    push(); translate(0, (fy + 16) * 1.4); scale(1, -0.4);
    drawingContext.globalAlpha = 0.3;
    clawd(hx, fy + 4, HERO_U, {
      col: mixCol(SEA.clay, '#FFD4A8', 0.3),
      dk: mixCol(SEA.clayDk, '#FFD4A8', 0.3),
      lt: '#F2A283',
      view: 'q', aL: 0.15, aR: 0.15, boilKey: 'hero3r',
    });
    clawd(dx, fy + 4, DEAR_U, {
      col: mixCol(SEA.blue, '#FFD4A8', 0.3),
      dk: mixCol(SEA.blueDk, '#FFD4A8', 0.3),
      lt: '#A9CEE6',
      view: 'q', flip: true, aL: 0.15, aR: 0.15, boilKey: 'dear3r',
    });
    pop();
    drawingContext.globalAlpha = 1;

    camEnd();
  };

  // 第 4 镜 (6.05–8.08s): 丢失
  const s4 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.05, 1.1, ease(seg(lt, 0.2, D))), 0);

    seaView(t, { hy: H * 0.5, dusk: 0.5 });
    beachAt(t, { by: H * 0.80, wet: 0.4 });

    // 右边角色碎成纸片
    const gone = ease(seg(lt, 0.4, 1.4));
    if (gone < 0.95) {
      clawd(W * 0.6, H * 0.78, DEAR_U, {
        col: mixCol(SEA.blue, '#C8E0F0', gone * 0.6),
        dk: mixCol(SEA.blueDk, '#C8E0F0', gone * 0.5),
        lt: '#A9CEE6',
        view: 'q', flip: true, feel: 'moved',
        aL: 0.3 + gone * 0.4, aR: 0.1,
        boilKey: 'dear4',
      });
    }

    // 碎片飞散
    boilSeed('s4Scraps');
    for (let i = 0; i < 10; i++) {
      const ph = clamp(gone * 1.2 - hash(i * 3.3) * 0.2);
      if (ph <= 0 || ph >= 1) continue;
      const sx = W * 0.6 + (hash(i * 2.1) - 0.3) * 150 * ph;
      const sy = H * 0.76 - ph * (60 + hash(i * 4.7) * 120);
      const rot = ph * 5 + i;
      push(); translate(sx, sy); rotate(rot);
      slab(-8, -8, 16, 16, mixCol(SEA.blue, '#C8E0F0', ph * 0.5), 0.5, 200);
      pop();
    }

    // 主角伸手
    clawd(W * 0.35, H * 0.79, HERO_U, {
      col: SEA.clay, dk: SEA.clayDk, lt: '#F2A283',
      view: 'q', feel: 'sad',
      aL: 0.8, aR: 0.2,
      boilKey: 'hero4',
    });

    camEnd();
  };

  // 第 5 镜 (8.08–10.12s): 回忆
  const s5 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.0, 1.02, ease(seg(lt, 0.3, D))), 0);

    seaView(t, { hy: H * 0.45, dusk: 0.3 });
    beachAt(t, { by: H * 0.75, wet: 0.3 });

    // 回忆色（暖金）
    glow(W * 0.5, H * 0.4, 250, '#FFD4A8', 0.2);

    // 两个角色坐着
    const hx = W * 0.4, dx = W * 0.6;
    clawd(hx, H * 0.76, HERO_U, {
      col: SEA.clay, dk: SEA.clayDk, lt: '#F2A283',
      view: 'q', feel: 'happy',
      aL: 0.2, aR: 0.2,
      boilKey: 'hero5',
    });
    clawd(dx, H * 0.76, DEAR_U, {
      col: SEA.blue, dk: SEA.blueDk, lt: '#A9CEE6',
      view: 'q', flip: true, feel: 'happy',
      aL: 0.2, aR: 0.2,
      boilKey: 'dear5',
    });

    // 纸船
    push(); translate(W * 0.5, H * 0.82); rotate(Math.sin(t * 0.5) * 0.1);
    slab(-15, -8, 30, 8, '#FFF8E8', 0.8, 240);
    slab(-12, -14, 10, 10, '#FFF8E8', 0.6, 220);
    pop();

    camEnd();
  };

  // 第 6 镜 (10.12–12.15s): 漂流瓶
  const s6 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.0, 0.95, ease(seg(lt, 0.2, D))), 0);

    seaView(t, { hy: H * 0.4 });
    beachAt(t, { by: H * 0.7, wet: 0.5 });

    // 扔瓶子动作
    const throw_ = ease(seg(lt, 0.3, 1.0));
    const bx = lerp(W * 0.45, W * 0.7, throw_);
    const by = lerp(H * 0.72, H * 0.5, Math.sin(throw_ * Math.PI));

    // 瓶子
    push(); translate(bx, by); rotate(throw_ * 3);
    slab(-6, -10, 12, 16, '#A8D8E8', 1, 230);
    slab(-4, -14, 8, 4, '#C8E0F0', 0.8, 200);
    pop();

    // 水花
    if (throw_ > 0.8) {
      sprayAt(bx, H * 0.72, 8, t);
    }

    // 主角
    clawd(W * 0.4, H * 0.78, HERO_U, {
      col: SEA.clay, dk: SEA.clayDk, lt: '#F2A283',
      view: 'side', feel: 'happy',
      aL: 0.6 + throw_ * 0.3, aR: 0.2,
      boilKey: 'hero6',
    });

    camEnd();
  };

  // 第 7 镜 (12.15–14.69s): 海底
  const s7 = (t, lt, D) => {
    camBegin(W * 0.5, H * 0.5, lerp(1.0, 1.05, ease(seg(lt, 0.3, D))), 0);

    // 深海背景
    const depth = ease(seg(lt, 0, D));
    slab(0, 0, W, H, mixCol('#1A2847', '#0F1830', depth * 0.5), 0, 255);

    // 光柱
    for (let i = 0; i < 5; i++) {
      const x = W * (0.2 + i * 0.15);
      const alpha = 0.1 + Math.sin(t * 0.5 + i) * 0.05;
      paint([[x - 20, 0], [x + 20, 0], [x + 60, H], [x - 60, H]],
            { wash: '#4A7FA5', washOp: alpha * 255, ink: null });
    }

    // 气泡
    boilSeed('bubbles');
    for (let i = 0; i < 12; i++) {
      const ph = frac(t * 0.5 + hash(i * 7));
      const x = W * (0.1 + hash(i * 3) * 0.8);
      const y = H * (1 - ph);
      const r = 3 + hash(i * 5) * 5;
      paint(ellPts(x, y, r, r * 1.2, 10, 0.5), { wash: '#C8E0F0', washOp: 100, ink: null });
    }

    // 瓶子下沉
    const sink = ease(seg(lt, 0.5, D));
    push(); translate(W * 0.5, lerp(H * 0.3, H * 0.7, sink)); rotate(sink * 2);
    slab(-8, -12, 16, 20, '#A8D8E8', 1, 230);
    pop();

    camEnd();
  };

  // 注册镜头
  shots([
    [0, s1],
    [beatNo(3), s2],      // 1.98s
    [beatNo(7), s3],      // 4.02s
    [beatNo(11), s4],     // 6.05s
    [beatNo(15), s5],     // 8.08s
    [beatNo(19), s6],     // 10.12s
    [beatNo(23), s7],     // 12.15s
  ]);
})();
