// _lib.js — Traditional Chinese MV Style Engine & Curve Toolkit
// Ported and adapted from lemomo-ai/lemo-opuscar (core/lib.js + styles/{ink-wash,shadow-puppet,papercut-red})
// for Claudemv's lightweight p5 / 2D Canvas pipeline.

(() => {
  const TAU = Math.PI * 2;
  const clamp = (v, lo = 0, hi = 1) => v < lo ? lo : v > hi ? hi : v;
  const lerp = (a, b, t) => a + (b - a) * t;

  // ============================================================================
  // 1. LEMO CORE — Easing, Monotone Cubic Spline, Keyframe Tracks & Noise
  // ============================================================================
  const ss = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };
  const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eo = t => 1 - Math.pow(1 - clamp(t), 3);
  const ei = t => { t = clamp(t); return t * t * t; };
  const back = (t, s = 1.7) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; };
  const springLemo = (t, w = 12, z = .28) => {
    t = clamp(t);
    return 1 - Math.exp(-w * z * t) * (Math.cos(w * Math.sqrt(1 - z * z) * t) + (z / Math.sqrt(1 - z * z)) * Math.sin(w * Math.sqrt(1 - z * z) * t));
  };

  function mulberry(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hashLemo = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123; return x - Math.floor(x); };
  function vnoise(x, y = 0, s = 0) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const h = (i, j) => hashLemo(i * 57 + j * 131 + s * 17);
    return lerp(lerp(h(xi, yi), h(xi + 1, yi), u), lerp(h(xi, yi + 1), h(xi + 1, yi + 1), u), v);
  }

  // Fritsch-Carlson monotone cubic Hermite interpolation (no overshoot at keyframe extrema)
  function monotone(xs, ys) {
    const n = xs.length;
    if (n === 1) return () => ys[0];
    const dx = [], dy = [], m = [], tg = new Array(n);
    for (let i = 0; i < n - 1; i++) {
      dx[i] = xs[i + 1] - xs[i];
      dy[i] = ys[i + 1] - ys[i];
      m[i] = dy[i] / (dx[i] || 1e-6);
    }
    tg[0] = m[0];
    tg[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) {
      tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    }
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) {
        tg[i] = tg[i + 1] = 0;
      } else {
        const a = tg[i] / m[i], b = tg[i + 1] / m[i], h = Math.hypot(a, b);
        if (h > 3) {
          tg[i] = (3 / h) * a * m[i];
          tg[i + 1] = (3 / h) * b * m[i];
        }
      }
    }
    return x => {
      if (x <= xs[0]) return ys[0];
      if (x >= xs[n - 1]) return ys[n - 1];
      let lo = 0, hi = n - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] <= x) lo = mid; else hi = mid; }
      const h = dx[lo], t = (x - xs[lo]) / (h || 1e-6), t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[lo]
           + (t3 - 2 * t2 + t) * h * tg[lo]
           + (-2 * t3 + 3 * t2) * ys[ hi ]
           + (t3 - t2) * h * tg[hi];
    };
  }

  function track(kf) {
    const xs = kf.map(k => k[0]);
    if (typeof kf[0][1] === 'number') return monotone(xs, kf.map(k => k[1]));
    const d = kf[0][1].length;
    const fns = Array.from({ length: d }, (_, j) => monotone(xs, kf.map(k => k[1][j])));
    return t => fns.map(f => f(t));
  }

  function env(t, a, d, s, r, dur) {
    if (t < 0 || t > dur + r) return 0;
    if (t < a) return eo(t / a);
    if (t < a + d) return lerp(1, s, eio((t - a) / d));
    if (t < dur) return s;
    return s * (1 - ei((t - dur) / r));
  }

  window.Lemo = { TAU, clamp, lerp, ss, eio, eo, ei, back, spring: springLemo, mulberry, hash: hashLemo, vnoise, monotone, track, env };

  // ============================================================================
  // 2. INK — 水墨 (Traditional Chinese Shanshui Ink Wash, styles/ink-wash/STYLE.md)
  // ============================================================================
  const TONE = { jiao: .96, nong: .82, zhong: .60, dan: .34, qing: .16 };
  const INK_PAL = {
    paper: '#F2ECDE', paperDk: '#E3D9C4', ink: '#171614',
    seal: '#B02E22', cinnabar: '#C83E2B', indigo: '#263B4D', indigoDk: '#14202E',
    ochre: '#B87A44', gold: '#E8AA38', jade: '#4A7A62', mist: '#EDE5D4'
  };

  function inkCol(alpha = 1, tint = null) {
    if (!tint) return `rgba(22,20,18,${clamp(alpha).toFixed(3)})`;
    const p = parseInt(tint.slice(1), 16);
    const r = (p >> 16) & 255, g = (p >> 8) & 255, b = p & 255;
    return `rgba(${r},${g},${b},${clamp(alpha).toFixed(3)})`;
  }

  function ricePaper(ctx, w, h, nightMix = 0, warmMix = 0) {
    ctx.save();
    // Base ground transitions smoothly between Xuan rice paper, indigo night scroll, and dawn ochre-gold
    let base = INK_PAL.paper, edge = INK_PAL.paperDk;
    if (warmMix > 0) {
      base = mixCol(base, '#F6DEC0', warmMix);
      edge = mixCol(edge, '#D99E6A', warmMix);
    }
    if (nightMix > 0) {
      base = mixCol(base, '#162233', nightMix);
      edge = mixCol(edge, '#0B121D', nightMix);
    }
    const gr = ctx.createRadialGradient(w * 0.5, h * 0.45, h * 0.12, w * 0.5, h * 0.5, w * 0.95);
    gr.addColorStop(0, base);
    gr.addColorStop(1, edge);
    ctx.fillStyle = gr;
    ctx.fillRect(-600, -400, w + 1200, h + 800);

    // Subtle Xuan paper water-stain clouds
    const rnd = mulberry(101);
    for (let i = 0; i < 18; i++) {
      const x = rnd() * w, y = rnd() * h, r = 140 + rnd() * 280;
      const wg = ctx.createRadialGradient(x, y, 0, x, y, r);
      const stainCol = nightMix > 0.5 ? `rgba(45,70,98,${(0.06 * rnd()).toFixed(3)})` : `rgba(155,125,85,${(0.045 * rnd()).toFixed(3)})`;
      wg.addColorStop(0, stainCol);
      wg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = wg;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // Fine mulberry fibers
    ctx.lineWidth = 0.8;
    const fibAlpha = nightMix > 0.5 ? 0.045 : 0.055;
    ctx.strokeStyle = nightMix > 0.5 ? `rgba(180,200,220,${fibAlpha})` : `rgba(105,85,60,${fibAlpha})`;
    ctx.beginPath();
    for (let i = 0; i < 160; i++) {
      const x = rnd() * w, y = rnd() * h, l = 10 + rnd() * 24, a = rnd() * TAU;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a + 0.5) * l * 0.5, y + Math.sin(a + 0.5) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Catmull-Rom resampled stroke with cumulative arc-length u in [0..1]
  function mkStroke(pts, n = 36) {
    if (!pts || pts.length < 2) return [];
    if (pts.length === 2) {
      return Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        return { x: lerp(pts[0][0], pts[1][0], t), y: lerp(pts[0][1], pts[1][1], t), u: t };
      });
    }
    const out = [], segs = pts.length - 1;
    for (let i = 0; i < n; i++) {
      const g = (i / (n - 1)) * segs, k = Math.min(segs - 1, g | 0), t = g - k;
      const p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(segs, k + 2)];
      const t2 = t * t, t3 = t2 * t;
      const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push({ x, y, u: 0 });
    }
    let L = 0;
    for (let i = 1; i < out.length; i++) { L += Math.hypot(out[i].x - out[i - 1].x, out[i].y - out[i - 1].y); out[i].u = L; }
    for (let i = 1; i < out.length; i++) out[i].u /= (L || 1);
    return out;
  }

  function pressureEnv(u, mode = 'brush', seed = 1) {
    const w = 0.86 + 0.28 * vnoise(u * 6, seed, 3);
    if (mode === 'brush') return Math.sin(Math.pow(u, 0.72) * Math.PI) * w * (1.14 - 0.28 * u);
    if (mode === 'tip') return Math.pow(Math.sin(u * Math.PI), 0.6) * w;
    if (mode === 'nail') return (u < 0.14 ? u / 0.14 : Math.pow(1 - (u - 0.14) / 0.86, 0.8)) * w;
    if (mode === 'rise') return Math.pow(u, 0.55) * (1 - 0.3 * Math.pow(u, 4)) * w;
    return w;
  }

  function drawInkStroke(ctx, pts, o = {}) {
    const s = Array.isArray(pts[0]) ? mkStroke(pts, o.samples || 34) : pts;
    const p = o.p ?? 1;
    if (p <= 0.005 || s.length < 2) return;
    const w = o.w ?? 8, tone = o.tone ?? TONE.nong, mode = o.mode || 'brush', dry = o.dry ?? 0, seed = o.seed ?? 1, col = o.col || null;
    const N = Math.max(2, Math.floor(s.length * clamp(p)));
    const L = [], R = [];
    for (let i = 0; i < N; i++) {
      const a = s[Math.max(0, i - 1)], b = s[Math.min(N - 1, i + 1)];
      let dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l;
      const u = s[i].u / Math.max(0.08, p);
      const r = w * 0.5 * pressureEnv(clamp(u), mode, seed);
      const j = (vnoise(i * 0.35, seed, 9) - 0.5) * w * 0.16;
      L.push([s[i].x + nx * r + ny * j, s[i].y + ny * r - nx * j]);
      R.push([s[i].x - nx * r + ny * j, s[i].y - ny * r - nx * j]);
    }
    ctx.save();
    // Soft wet halo when ink is dilute (淡墨 / 清墨)
    if (tone < 0.72 && dry < 0.4) {
      ctx.beginPath();
      ctx.moveTo(L[0][0], L[0][1]);
      for (let i = 1; i < N; i++) ctx.lineTo(L[i][0], L[i][1]);
      for (let i = N - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
      ctx.closePath();
      ctx.fillStyle = inkCol(tone * 0.25, col);
      ctx.lineWidth = w * 0.42;
      ctx.strokeStyle = inkCol(tone * 0.16, col);
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.fill();
    }
    // Core stroke ribbon
    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    for (let i = 1; i < N; i++) ctx.lineTo(L[i][0], L[i][1]);
    for (let i = N - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath();
    ctx.fillStyle = inkCol(tone * (1 - dry * 0.35), col);
    ctx.fill();

    // Dry-brush flying white (飞白) filaments
    if (dry > 0.05) {
      const nb = 4;
      for (let b = 0; b < nb; b++) {
        const off = (b / (nb - 1) - 0.5) * 0.85;
        ctx.beginPath();
        let down = false;
        for (let i = 0; i < N; i++) {
          const gate = vnoise(i * 0.32 + b * 7, seed + b, 21);
          if (gate > dry * 0.52) {
            const x = lerp(L[i][0], R[i][0], 0.5 + off * 0.5);
            const y = lerp(L[i][1], R[i][1], 0.5 + off * 0.5);
            if (!down) { ctx.moveTo(x, y); down = true; } else ctx.lineTo(x, y);
          } else down = false;
        }
        ctx.strokeStyle = inkCol(Math.min(1, tone * 1.15), col);
        ctx.lineWidth = Math.max(0.9, w / nb * 0.65);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function washBlob(ctx, cx, cy, rx, ry, o = {}) {
    const tone = o.tone ?? TONE.dan, seed = o.seed ?? 1, rot = o.rot ?? 0, col = o.col || null, rings = o.rings ?? 4;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    for (let k = rings - 1; k >= 0; k--) {
      const sc = 0.55 + (k / Math.max(1, rings - 1)) * 0.55;
      ctx.beginPath();
      const M = 28;
      for (let i = 0; i <= M; i++) {
        const a = (i / M) * TAU;
        const n = 0.78 + 0.42 * vnoise(Math.cos(a) * 2 + k, Math.sin(a) * 2 + seed, seed);
        const px = Math.cos(a) * rx * sc * n, py = Math.sin(a) * ry * sc * n;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = inkCol((tone / rings) * (k === 0 ? 1.35 : 0.88), col);
      ctx.fill();
    }
    ctx.restore();
  }

  function mountainLayer(ctx, o) {
    const { yBase, amp, freq, seed, tone, fadeY, w = 1920, x0 = -520, x1 = w + 520, col = null, mistCol = INK_PAL.paper } = o;
    const step = 10;
    const mr = parseInt(mistCol.slice(1, 3), 16), mg = parseInt(mistCol.slice(3, 5), 16), mb = parseInt(mistCol.slice(5, 7), 16);
    ctx.save();
    for (let pass = 0; pass < 2; pass++) {
      const dy = pass * 6, sc = pass === 0 ? 0.45 : 0.72;
      ctx.beginPath();
      ctx.moveTo(x0, fadeY);
      for (let x = x0; x <= x1; x += step) {
        const n = vnoise(x * freq, seed + pass * 0.2, 1) * 0.65
                + vnoise(x * freq * 2.3, seed, 2) * 0.25
                + vnoise(x * freq * 5.7, seed, 3) * 0.10;
        const envX = ss(x0, x0 + 220, x) * (1 - ss(x1 - 220, x1, x) * 0.35);
        const y = yBase - n * amp * envX + dy;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(x1, fadeY);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, yBase - amp, 0, fadeY);
      g.addColorStop(0, inkCol(tone * sc, col));
      g.addColorStop(0.58, inkCol(tone * sc * 0.62, col));
      g.addColorStop(0.88, `rgba(${mr},${mg},${mb},0.12)`);
      g.addColorStop(1, `rgba(${mr},${mg},${mb},0)`);
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.restore();
  }

  // 披麻皴 (hemp-fiber contour strokes) + 苔点 (moss dots)
  function cun(ctx, ridgeFn, x0, x1, yBot, o = {}) {
    const seed = o.seed ?? 1, tone = o.tone ?? TONE.zhong, count = o.count ?? 28, col = o.col || null;
    const rng = mulberry(seed * 997);
    for (let i = 0; i < count; i++) {
      const xStart = lerp(x0, x1, rng());
      const yTop = ridgeFn(xStart) + 6 + rng() * 24;
      const len = (yBot - yTop) * (0.28 + rng() * 0.48);
      if (len < 12) continue;
      const drift = (rng() - 0.45) * 45;
      const pts = [];
      for (let k = 0; k < 5; k++) {
        const u = k / 4;
        pts.push([
          xStart + drift * u + (vnoise(k + i, seed, 7) - 0.5) * 12,
          yTop + len * u
        ]);
      }
      drawInkStroke(ctx, pts, { w: 2.2 + rng() * 3.5, tone: tone * (0.42 + rng() * 0.48), mode: 'tip', dry: 0.42, seed: seed + i, col, samples: 18 });
    }
    // 苔点 (horizontal moss dots along ridge crest)
    const dots = o.dots ?? 20;
    for (let i = 0; i < dots; i++) {
      const x = lerp(x0, x1, rng());
      const y = ridgeFn(x) + (rng() - 0.3) * 14;
      const rx = 2.5 + rng() * 4.5, ry = 1.6 + rng() * 2.8;
      ctx.save();
      ctx.fillStyle = inkCol( Math.min(0.95, tone * 1.25), col );
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, (rng() - 0.5) * 0.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  function cliff(ctx, side, topY, botY, reach, o = {}) {
    const w = o.w ?? 1920, bx = side < 0 ? -20 : w + 20, dir = -side, seed = o.seed ?? 31, col = o.col || null;
    const N = 16, prof = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, y = lerp(topY, botY, u);
      const envU = Math.sin(Math.pow(u, 0.65) * Math.PI);
      const jag = 0.65 + 0.55 * vnoise(i * 1.4, seed, 5);
      prof.push([bx + dir * reach * envU * jag, y]);
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bx, topY);
    for (const p of prof) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(bx, botY);
    ctx.closePath();
    const g = ctx.createLinearGradient(bx, 0, bx + dir * reach, 0);
    g.addColorStop(0, inkCol(TONE.nong * 0.88, col));
    g.addColorStop(0.7, inkCol(TONE.zhong * 0.72, col));
    g.addColorStop(1, inkCol(TONE.dan * 0.45, col));
    ctx.fillStyle = g;
    ctx.fill();
    drawInkStroke(ctx, prof, { w: 10, tone: TONE.jiao, mode: 'brush', dry: 0.45, seed: 41, col });
    ctx.restore();
    return prof;
  }

  function pine(ctx, x0, y0, len, ang, seed = 1, o = {}) {
    const col = o.col || null, p = o.p ?? 1;
    if (p <= 0) return;
    const rng = mulberry(seed * 131);
    const trunk = [[x0, y0]];
    let x = x0, y = y0, a = ang;
    for (let i = 1; i <= 6; i++) {
      a += (rng() - 0.46) * 0.36;
      const step = (len / 6) * (0.85 + rng() * 0.3);
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
      trunk.push([x, y]);
    }
    drawInkStroke(ctx, trunk, { w: 12, tone: TONE.jiao, p: clamp(p * 1.3), mode: 'nail', dry: 0.35, seed, col });
    for (let i = 2; i <= 6; i++) {
      const bp = trunk[i];
      const bAng = ang + (i % 2 ? 0.52 : -0.42);
      const bLen = len * (0.34 - i * 0.032);
      const bEnd = [bp[0] + Math.cos(bAng) * bLen, bp[1] + Math.sin(bAng) * bLen * 0.65];
      const subP = clamp((p - i * 0.08) * 1.6);
      if (subP <= 0) continue;
      drawInkStroke(ctx, [bp, [(bp[0] + bEnd[0]) * 0.5, bp[1] - 5], bEnd], { w: 5.5, tone: TONE.nong, p: subP, mode: 'nail', dry: 0.28, seed: seed + i * 7, col, samples: 16 });
      // Pine needle fan (松针攒簇)
      if (subP > 0.4) {
        ctx.save();
        ctx.strokeStyle = inkCol(TONE.jiao, col);
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let k = 0; k < 11; k++) {
          const na = -Math.PI + (k / 10) * Math.PI + (rng() - 0.5) * 0.12;
          const nl = (12 + rng() * 6) * clamp((subP - 0.4) * 2);
          ctx.moveTo(bEnd[0], bEnd[1]);
          ctx.lineTo(bEnd[0] + Math.cos(na) * nl, bEnd[1] + Math.sin(na) * nl);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Song-dynasty Ma Yuan wave layer (宋人马远《水图》浪纹)
  function wave(ctx, yBase, w, h, t, o = {}) {
    const amp = o.amp ?? 26, crests = o.crests ?? 7, tone = o.tone ?? TONE.nong, col = o.col || '#1B3044', foam = o.foam ?? true, speed = o.speed ?? 1.2, seed = o.seed ?? 1;
    const pts = [];
    const N = crests * 8;
    for (let i = 0; i <= N; i++) {
      const u = i / N, x = -480 + u * (w + 960);
      const ph = u * crests * TAU + t * speed + seed * 1.7;
      // Sharp trochoidal wave crest (pointed peak, rounded trough)
      const cyc = (ph % TAU + TAU) % TAU / TAU;
      const scallop = 1 - 4 * Math.pow(cyc - 0.5, 2);
      const swell = Math.sin(u * TAU * 2 - t * 0.8 + seed) * amp * 0.35;
      const y = yBase - scallop * amp + swell;
      pts.push([x, y]);
    }
    ctx.save();
    // Wave body wash down to bottom of screen
    ctx.beginPath();
    ctx.moveTo(-480, h + 300);
    for (const [x, y] of pts) ctx.lineTo(x, y);
    ctx.lineTo(w + 480, h + 300);
    ctx.closePath();
    const gr = ctx.createLinearGradient(0, yBase - amp, 0, Math.max(yBase + 260, h));
    gr.addColorStop(0, inkCol(tone * 0.85, col));
    gr.addColorStop(0.35, inkCol(tone * 0.94, col));
    gr.addColorStop(1, inkCol(Math.min(1, tone * 1.05), '#0E1A28'));
    ctx.fillStyle = gr;
    ctx.fill();

    // Calligraphic wave crest line & internal Song-dynasty water ribs (水纹勾勒)
    drawInkStroke(ctx, pts, { w: 4.5, tone: Math.min(1, tone * 1.15), mode: 'brush', dry: 0.22, seed: seed + 10, col: '#101820', samples: 48 });
    for (let r = 1; r <= 2; r++) {
      const ribPts = pts.filter((_, idx) => idx % 2 === 0).map(([x, y], idx) => [
        x + Math.sin(idx + t) * 6,
        y + r * amp * 0.55 + Math.cos(idx * 0.7 - t) * 4
      ]);
      drawInkStroke(ctx, ribPts, { w: 2.2 - r * 0.4, tone: tone * 0.48, mode: 'tip', dry: 0.35, seed: seed + r * 30, col: '#D8E4EC', samples: 28 });
    }

    // White foam pearls along wave peaks
    if (foam) {
      ctx.fillStyle = 'rgba(246, 241, 230, 0.82)';
      for (let i = 0; i < pts.length; i += 4) {
        const [px, py] = pts[i];
        const r0 = 2.5 + 2.5 * hashLemo(i + seed * 19);
        ctx.beginPath();
        ctx.arc(px, py + 2, r0, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function sampan(ctx, x, y, sc = 1, tilt = 0, o = {}) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    ctx.scale(sc, sc);
    // Hull: one bold curved calligraphy stroke
    drawInkStroke(ctx, [[-82, -4], [-35, 12], [28, 11], [86, -8]], { w: 11, tone: TONE.jiao, mode: 'brush', dry: 0.25, seed: 61, samples: 20 });
    // Awning arch (乌篷)
    drawInkStroke(ctx, [[-28, 6], [-10, -24], [22, -22], [36, 5]], { w: 7, tone: TONE.zhong, mode: 'tip', dry: 0.35, seed: 63, col: INK_PAL.ochre, samples: 16 });
    // Oar / pole
    if (o.pole !== false) {
      drawInkStroke(ctx, [[-42, -2], [-78, 28]], { w: 2.6, tone: TONE.zhong, mode: 'nail', dry: 0.2, seed: 67, samples: 10 });
    }
    ctx.restore();
  }

  function seal(ctx, x, y, size = 48, chars = ['潮', '汐'], seed = 7) {
    ctx.save();
    ctx.translate(x, y);
    const rng = mulberry(seed * 313);
    // Vermilion stamp body with slight hand-carved irregularity
    ctx.fillStyle = INK_PAL.seal;
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size, 4);
    ctx.fill();
    // Carved white seal characters (白文印)
    ctx.fillStyle = INK_PAL.paper;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (chars.length === 1) {
      ctx.font = `600 ${Math.round(size * 0.68)}px "Ma Shan Zheng", "Noto Serif SC", serif`;
      ctx.fillText(chars[0], 0, 1);
    } else {
      ctx.font = `600 ${Math.round(size * 0.42)}px "Ma Shan Zheng", "Noto Serif SC", serif`;
      ctx.fillText(chars[0], 0, -size * 0.21);
      ctx.fillText(chars[1], 0, size * 0.23);
    }
    // Stone-chip weathering flecks
    for (let i = 0; i < 14; i++) {
      const sx = (rng() - 0.5) * size * 0.92, sy = (rng() - 0.5) * size * 0.92;
      ctx.fillRect(sx, sy, 1.5 + rng() * 2.5, 1.5 + rng() * 2);
    }
    ctx.restore();
  }

  window.INK = {
    TONE, PAL: INK_PAL, col: inkCol, ricePaper, mk: mkStroke, draw: drawInkStroke, stroke: drawInkStroke,
    washBlob, mountainLayer, cun, cliff, pine, wave, sampan, seal
  };

  // ============================================================================
  // 3. SHADOW — 皮影 (Huaxian Shadow Puppetry, styles/shadow-puppet/STYLE.md)
  // ============================================================================
  const DYE = {
    red:    { hex: '#C9241B', rgba: (a = .86) => `rgba(201,36,27,${a})` },
    green:  { hex: '#1E7E48', rgba: (a = .85) => `rgba(30,126,72,${a})` },
    amber:  { hex: '#DF8B17', rgba: (a = .84) => `rgba(223,139,23,${a})` },
    black:  { hex: '#23160C', rgba: (a = .92) => `rgba(35,22,12,${a})` },
    raw:    { hex: '#E3BD78', rgba: (a = .78) => `rgba(227,189,120,${a})` },
    indigo: { hex: '#203966', rgba: (a = .85) => `rgba(32,57,102,${a})` },
    teal:   { hex: '#1D6A6B', rgba: (a = .85) => `rgba(29,106,107,${a})` },
    plum:   { hex: '#A62C5C', rgba: (a = .85) => `rgba(166,44,92,${a})` }
  };

  function shadowBackdrop(ctx, w, h, t, o = {}) {
    const night = o.night ?? 0.35; // 0 = bright warm oil-lamp cotton screen, 1 = deep night shadow-lantern stage
    const flick = 1 + 0.018 * Math.sin(t * 37) + 0.012 * Math.cos(t * 23);
    const lx = (o.lx ?? 0.5) * w + Math.sin(t * 2.7) * 5;
    const ly = (o.ly ?? 0.48) * h + Math.cos(t * 3.3) * 4;
    ctx.save();
    const rg = ctx.createRadialGradient(lx, ly, 20, lx, ly, w * 0.72 * flick);
    if (night < 0.5) {
      rg.addColorStop(0.00, mixCol('#FFF6DC', '#3A2848', night * 1.4));
      rg.addColorStop(0.28, mixCol('#F5DFB0', '#251D3A', night * 1.4));
      rg.addColorStop(0.62, mixCol('#C89652', '#17152B', night * 1.4));
      rg.addColorStop(0.88, mixCol('#6E431E', '#0E0D1C', night * 1.4));
      rg.addColorStop(1.00, '#1C0F06');
    } else {
      // Night firework lantern stage: warm oil-lamp horizon below, deep indigo-amber sky above
      rg.addColorStop(0.00, '#2B2240');
      rg.addColorStop(0.45, '#1B1832');
      rg.addColorStop(0.82, '#110F22');
      rg.addColorStop(1.00, '#090713');
    }
    ctx.fillStyle = rg;
    ctx.fillRect(-600, -400, w + 1200, h + 800);

    // Warm oil-lamp glow along the stage floor
    const fg = ctx.createRadialGradient(w * 0.5, h * 0.82, 10, w * 0.5, h * 0.82, w * 0.48 * flick);
    fg.addColorStop(0, `rgba(255, 210, 125, ${(0.38 * (1 - night * 0.45)).toFixed(3)})`);
    fg.addColorStop(0.6, `rgba(210, 130, 50, ${(0.16 * (1 - night * 0.45)).toFixed(3)})`);
    fg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, w, h);

    // Woven cotton cloth lines (亮子布纹)
    ctx.strokeStyle = night > 0.5 ? 'rgba(255,220,160,0.025)' : 'rgba(90,55,20,0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = 0; y < h; y += 6) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    // Carved shadow-stage side curtains / top valence (雕花影窗边框)
    if (o.frame !== false) {
      ctx.fillStyle = '#1B0E06';
      ctx.fillRect(0, 0, 38, h);
      ctx.fillRect(w - 38, 0, 38, h);
      ctx.fillRect(0, 0, w, 28);
      // Carved glowing pearl beads along the stage frame
      ctx.fillStyle = '#F5D38E';
      for (let y = 44; y < h - 40; y += 28) {
        ctx.beginPath();
        ctx.arc(19, y, 3.2, 0, TAU);
        ctx.arc(w - 19, y, 3.2, 0, TAU);
        ctx.fill();
      }
      for (let x = 56; x < w - 56; x += 36) {
        ctx.beginPath();
        ctx.arc(x, 14, 3, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function shadowCut(ctx, drawPath, glowCol = '#FCE5B4') {
    ctx.save();
    ctx.fillStyle = glowCol;
    ctx.beginPath();
    drawPath(ctx);
    ctx.fill();
    ctx.strokeStyle = 'rgba(35,20,10,0.75)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  function shadowCutLine(ctx, x0, y0, x1, y1, w = 2.6, glowCol = '#FCE5B4') {
    ctx.save();
    ctx.strokeStyle = glowCol;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.restore();
  }

  function shadowBeads(ctx, x0, y0, x1, y1, n, r = 2.6, glowCol = '#FCE5B4') {
    ctx.save();
    ctx.fillStyle = glowCol;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u);
      ctx.moveTo(x + r, y);
      ctx.arc(x, y, r, 0, TAU);
    }
    ctx.fill();
    ctx.restore();
  }

  function shadowPlum(ctx, cx, cy, r = 7, glowCol = '#FCE5B4') {
    shadowCut(ctx, c => {
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * TAU - Math.PI / 2;
        const px = cx + Math.cos(a) * r * 0.56, py = cy + Math.sin(a) * r * 0.56;
        c.moveTo(px + r * 0.4, py);
        c.arc(px, py, r * 0.4, 0, TAU);
      }
    }, glowCol);
  }

  function shadowCloud(ctx, cx, cy, sc = 1, flip = 1, glowCol = '#FCE5B4') {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sc * flip, sc);
    shadowCut(ctx, c => {
      c.arc(0, 0, 10, 0, TAU);
      c.moveTo(15, 2); c.arc(9, 2, 7, 0, TAU);
      c.moveTo(-3, 2); c.arc(-9, 2, 7, 0, TAU);
      c.moveTo(6, -6); c.arc(0, -6, 6, 0, TAU);
    }, glowCol);
    ctx.restore();
  }

  function shadowJoint(ctx, x, y, r = 4.2) {
    ctx.save();
    ctx.fillStyle = 'rgba(30, 18, 8, 0.88)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#DF9B32';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = '#FFF4D2';
    ctx.beginPath(); ctx.arc(x, y, r * 0.36, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function shadowRod(ctx, x, y, ang = 1.48, len = 280) {
    ctx.save();
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
    ctx.strokeStyle = 'rgba(35, 20, 10, 0.58)';
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = 'rgba(235, 185, 100, 0.32)';
    ctx.lineWidth = 1.0;
    ctx.beginPath(); ctx.moveTo(x + 1, y); ctx.lineTo(x2 + 1, y2); ctx.stroke();
    shadowJoint(ctx, x, y, 3.6);
    ctx.restore();
  }

  // Translucent shadow-puppet firework burst (皮影彩绘镂空烟花)
  function shadowFirework(ctx, cx, cy, r, p, col = '#E8AA38', seed = 1) {
    if (p <= 0 || p >= 1) return;
    const rng = mulberry(seed * 409);
    const expand = eo(clamp(p * 1.25));
    const fade = 1 - ei(clamp((p - 0.35) / 0.65));
    const droop = p * p * 38;
    const R = r * expand;
    ctx.save();
    ctx.translate(cx, cy + droop);
    // Backlit oil-lamp / lantern halo behind the burst
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.15);
    gr.addColorStop(0, col);
    gr.addColorStop(0.45, col + '88');
    gr.addColorStop(1, col + '00');
    ctx.globalAlpha = 0.58 * fade;
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(0, 0, R * 1.15, 0, TAU); ctx.fill();
    ctx.restore();

    // Carved willow-petal & pearl-bead spokes (镂空柳叶联珠纹放射)
    const spokes = 16;
    ctx.globalAlpha = 0.92 * fade;
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * TAU + p * 0.25 + (rng() - 0.5) * 0.06;
      const r0 = R * 0.14, r1 = R * (0.78 + 0.22 * (i % 2));
      const x0 = Math.cos(a) * r0, y0 = Math.sin(a) * r0;
      const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1 + p * 12;
      // Spoke rib
      ctx.strokeStyle = i % 2 ? col : '#FFF1C8';
      ctx.lineWidth = 2.8 * (1 - p * 0.4);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo((x0 + x1) * 0.5, (y0 + y1) * 0.5 - 6, x1, y1);
      ctx.stroke();

      // Carved teardrop tip & glowing pinhole bead
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x1, y1, 4.8 * (1 - p * 0.35), 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#FFF9E6';
      ctx.beginPath();
      ctx.arc(x1, y1, 2.1 * (1 - p * 0.35), 0, TAU);
      ctx.fill();
    }
    // Inner carved plum-blossom ring
    if (fade > 0.25) {
      shadowPlum(ctx, 0, 0, Math.min(20, R * 0.22), '#FFF4D4');
    }
    ctx.restore();
  }

  window.SHADOW = {
    DYE, backdrop: shadowBackdrop, cut: shadowCut, cutLine: shadowCutLine,
    beads: shadowBeads, plum: shadowPlum, cloud: shadowCloud,
    joint: shadowJoint, rod: shadowRod, firework: shadowFirework
  };

  // ============================================================================
  // 4. PAPERCUT — 剪纸 (Chinese Folk Red Papercut, styles/papercut-red/STYLE.md)
  // ============================================================================
  const PC_PAL = {
    red: '#D2201F', redDk: '#961211', cinnabar: '#E03B2B',
    gold: '#E8AA38', goldLt: '#F8D87C', cream: '#F4EFE3', warm: '#F7ECD4',
    night: '#1A233A', jade: '#3D7E5A', ink: '#24191C'
  };

  // Serrated saw-tooth row (锯齿纹)
  function sawRow(ctx, x0, y0, x1, y1, n, depth, fillCol = PC_PAL.cream) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, nx = -uy, ny = ux, step = L / n;
    ctx.save();
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const s = i * step;
      const ax = x0 + ux * (s + step * 0.14), ay = y0 + uy * (s + step * 0.14);
      const bx = x0 + ux * (s + step * 0.86), by = y0 + uy * (s + step * 0.86);
      const tx = x0 + ux * (s + step * 0.5) + nx * depth, ty = y0 + uy * (s + step * 0.5) + ny * depth;
      ctx.moveTo(ax, ay); ctx.lineTo(tx, ty); ctx.lineTo(bx, by); ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
  }

  // Crescent slit cutout (月牙纹)
  function crescent(ctx, x, y, r, th, a0 = -Math.PI * 0.42, a1 = Math.PI * 0.42, bend = 1, fillCol = PC_PAL.cream) {
    ctx.save();
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.arc(x, y, r, a0, a1, false);
    const off = th * 0.65 * bend;
    const mid = (a0 + a1) * 0.5;
    ctx.arc(x + Math.cos(mid) * off, y + Math.sin(mid) * off, Math.max(1.5, r - th * 0.45), a1, a0, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Teardrop / willow-leaf cutout (水滴/柳叶纹)
  function teardrop(ctx, x, y, r, len, ang = 0, fillCol = PC_PAL.cream) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(0, -len * 0.6);
    ctx.bezierCurveTo(r, -len * 0.1, r * 0.95, len * 0.4, 0, len * 0.45);
    ctx.bezierCurveTo(-r * 0.95, len * 0.4, -r, -len * 0.1, 0, -len * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 5-petal plum blossom punch (梅花孔)
  function pcPlum(ctx, cx, cy, r, petals = 5, fillCol = PC_PAL.cream) {
    ctx.save();
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    for (let k = 0; k < petals; k++) {
      const a = (k / petals) * TAU - Math.PI / 2;
      const px = cx + Math.cos(a) * r * 0.55, py = cy + Math.sin(a) * r * 0.55;
      ctx.moveTo(px + r * 0.42, py);
      ctx.arc(px, py, r * 0.42, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = PC_PAL.gold;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.22, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  // Coin punch (铜钱纹: 外圆内方)
  function pcCoin(ctx, cx, cy, r, fillCol = PC_PAL.red, holeCol = PC_PAL.cream) {
    ctx.save();
    ctx.fillStyle = fillCol;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.fillStyle = holeCol;
    const s = r * 0.62;
    ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
    ctx.restore();
  }

  // 8-fold radial folk rosette (团花)
  function tuanhua(ctx, cx, cy, R, rot = 0, col = PC_PAL.red, holeCol = PC_PAL.cream, alpha = 1) {
    if (R < 4 || alpha <= 0.01) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.globalAlpha = clamp(alpha);
    // Drop shadow for paper thickness
    ctx.fillStyle = 'rgba(45, 10, 8, 0.22)';
    ctx.beginPath();
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * TAU, rr = R * (k % 2 ? 0.92 : 1.0);
      const px = 3 + Math.cos(a) * rr, py = 4 + Math.sin(a) * rr;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Scalloped red paper disc
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let k = 0; k < 32; k++) {
      const a = (k / 32) * TAU, rr = R * (0.93 + 0.07 * Math.cos(k * Math.PI));
      const px = Math.cos(a) * rr, py = Math.sin(a) * rr;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PC_PAL.redDk;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // 8-fold interior folk cutouts (水滴纹 + 月牙纹 + 锯齿环 + 中心梅花)
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * TAU;
      ctx.save();
      ctx.rotate(a);
      teardrop(ctx, 0, -R * 0.56, R * 0.11, R * 0.34, 0, holeCol);
      crescent(ctx, 0, -R * 0.32, R * 0.14, R * 0.055, -0.9, 0.9, 1, holeCol);
      teardrop(ctx, R * 0.18, -R * 0.72, R * 0.055, R * 0.16, 0.4, holeCol);
      teardrop(ctx, -R * 0.18, -R * 0.72, R * 0.055, R * 0.16, -0.4, holeCol);
      ctx.restore();
    }
    pcPlum(ctx, 0, 0, R * 0.18, 5, holeCol);
    ctx.restore();
  }

  // Folk papercut heart with interior plum blossom & crescent slits (剪纸喜心)
  function pcHeart(ctx, cx, cy, r, rot = 0, col = PC_PAL.red, holeCol = PC_PAL.cream) {
    if (r < 2) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    const traceH = (ox = 0, oy = 0) => {
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const t = (i / 36) * TAU;
        const x = r * 0.062 * 16 * Math.pow(Math.sin(t), 3);
        const y = -r * 0.058 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        if (i === 0) ctx.moveTo(x + ox, y + oy); else ctx.lineTo(x + ox, y + oy);
      }
      ctx.closePath();
    };
    ctx.fillStyle = 'rgba(45, 10, 8, 0.24)';
    traceH(2.5, 3.2); ctx.fill();
    ctx.fillStyle = col;
    traceH(0, 0); ctx.fill();
    ctx.strokeStyle = PC_PAL.redDk;
    ctx.lineWidth = Math.max(1, r * 0.05);
    ctx.stroke();
    if (r >= 14) {
      pcPlum(ctx, 0, -r * 0.05, r * 0.32, 5, holeCol);
      crescent(ctx, -r * 0.36, -r * 0.22, r * 0.22, r * 0.08, -1.1, 0.5, 1, holeCol);
      crescent(ctx, r * 0.36, -r * 0.22, r * 0.22, r * 0.08, -0.5, 1.1, 1, holeCol);
    }
    ctx.restore();
  }

  // Traditional window-flower corner fretwork (窗花四角边框)
  function cornerFrame(ctx, w = 1920, h = 1080, inset = 22, col = PC_PAL.red, holeCol = PC_PAL.cream) {
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 4;
    ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset + 8, inset + 8, w - (inset + 8) * 2, h - (inset + 8) * 2);
    const corners = [
      [inset, inset, 1, 1],
      [w - inset, inset, -1, 1],
      [inset, h - inset, 1, -1],
      [w - inset, h - inset, -1, -1]
    ];
    for (const [cx, cy, sx, sy] of corners) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sx, sy);
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(92, 0); ctx.lineTo(92, 18);
      ctx.quadraticCurveTo(48, 22, 46, 46);
      ctx.quadraticCurveTo(22, 48, 18, 92);
      ctx.lineTo(0, 92); ctx.closePath();
      ctx.fill();
      pcPlum(ctx, 26, 26, 12, 5, holeCol);
      teardrop(ctx, 60, 10, 4, 14, Math.PI / 2, holeCol);
      teardrop(ctx, 10, 60, 4, 14, 0, holeCol);
      ctx.restore();
    }
    ctx.restore();
  }

  // Jiangnan oiled-paper / papercut umbrella (江南油纸伞)
  function umbrella(ctx, x, y, r = 130, rot = -0.12, o = {}) {
    const canopyCol = o.col || '#E8AA38', trimCol = o.trim || PC_PAL.red;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    // Bamboo handle shaft
    ctx.strokeStyle = '#6E4726';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.72);
    ctx.lineTo(0, r * 0.72);
    ctx.arc(-9, r * 0.72, 9, 0, Math.PI, false);
    ctx.stroke();

    // Canopy dome
    ctx.fillStyle = canopyCol;
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r, Math.PI, TAU, false);
    // Scalloped bamboo-rib bottom edge
    const ribs = 7;
    for (let i = ribs; i >= 1; i--) {
      const x1 = lerp(-r, r, i / ribs), x0 = lerp(-r, r, (i - 1) / ribs);
      ctx.quadraticCurveTo((x0 + x1) * 0.5, -r * 0.1 - 14, x0, -r * 0.1);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2B1D14';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Bamboo ribs radiating from top finial
    ctx.strokeStyle = 'rgba(95, 58, 24, 0.55)';
    ctx.lineWidth = 1.6;
    for (let i = 1; i < ribs; i++) {
      const rx = lerp(-r, r, i / ribs);
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.1);
      ctx.lineTo(rx, -r * 0.1);
      ctx.stroke();
    }
    // Red papercut plum blossoms painted on the oiled-paper canopy
    pcPlum(ctx, -r * 0.42, -r * 0.46, r * 0.13, 5, trimCol);
    pcPlum(ctx, r * 0.36, -r * 0.52, r * 0.11, 5, trimCol);
    // Top finial
    ctx.fillStyle = trimCol;
    ctx.beginPath();
    ctx.moveTo(-6, -r * 1.08); ctx.lineTo(0, -r * 1.22); ctx.lineTo(6, -r * 1.08); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Celadon porcelain jar with red papercut label (青瓷双喜集乐罐)
  function celadonJar(ctx, x, y, r = 62, glowK = 0.7) {
    ctx.save();
    ctx.translate(x, y);
    if (glowK > 0.05) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const gr = ctx.createRadialGradient(0, -r * 0.2, 4, 0, -r * 0.2, r * 1.8);
      gr.addColorStop(0, '#FFE28A');
      gr.addColorStop(0.5, 'rgba(232,170,56,0.35)');
      gr.addColorStop(1, 'rgba(232,170,56,0)');
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(0, -r * 0.2, r * 1.8, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // Jar body (translucent celadon jade)
    ctx.fillStyle = 'rgba(136, 186, 168, 0.78)';
    ctx.strokeStyle = '#243832';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-r * 0.52, -r * 0.78);
    ctx.bezierCurveTo(-r * 0.98, -r * 0.35, -r * 0.92, r * 0.55, -r * 0.55, r * 0.82);
    ctx.lineTo(r * 0.55, r * 0.82);
    ctx.bezierCurveTo(r * 0.92, r * 0.55, r * 0.98, -r * 0.35, r * 0.52, -r * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jar lip rim
    ctx.fillStyle = '#A8D0C0';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.78, r * 0.56, r * 0.14, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Red diamond papercut label (斗方福贴) on the front of the jar
    ctx.save();
    ctx.rotate(Math.PI / 4);
    const s = r * 0.44;
    ctx.fillStyle = PC_PAL.red;
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.strokeStyle = PC_PAL.gold;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-s * 0.4, -s * 0.4, s * 0.8, s * 0.8);
    ctx.restore();
    pcHeart(ctx, 0, 0, r * 0.18, 0, PC_PAL.goldLt, PC_PAL.red);
    ctx.restore();
  }

  window.PAPERCUT = {
    PAL: PC_PAL, sawRow, crescent, teardrop, plum: pcPlum, coin: pcCoin,
    tuanhua, cornerFrame, heart: pcHeart, umbrella, jar: celadonJar
  };

  // ============================================================================
  // 5. QINGLV — 青绿金碧·敦煌重彩木版画 (styles/qinglv-woodblock/STYLE.md)
  // ============================================================================
  const QL_PAL = {
    azurite: '#1B4F82', azuriteLt: '#3C88B8',
    malachite: '#267F68', malachiteLt: '#58B894',
    ochre: '#B86B43', mudGold: '#F5C85C', goldLt: '#FFF0B8',
    cinnabar: '#E05A47', celadon: '#6EC4CA',
    violet: '#583E6E', violetLt: '#B88498',
    lapis: '#112244', lapisDk: '#091326', silk: '#F4E6CC'
  };

  function silkGround(ctx, w, h, mode = 'sunset', t = 0) {
    ctx.save();
    const g = ctx.createLinearGradient(0, -250, 0, h + 250);
    if (mode === 'sunset') {
      g.addColorStop(0.00, '#3D2E58');
      g.addColorStop(0.28, '#8E5A7C');
      g.addColorStop(0.52, '#E29A72');
      g.addColorStop(0.72, '#F6CE86');
      g.addColorStop(1.00, '#D9A46C');
    } else if (mode === 'golden') {
      g.addColorStop(0.00, '#D99B52');
      g.addColorStop(0.35, '#F4C97A');
      g.addColorStop(0.65, '#FFF0BE');
      g.addColorStop(1.00, '#E8BA78');
    } else if (mode === 'seabed') {
      g.addColorStop(0.00, '#1B4F82');
      g.addColorStop(0.45, '#112E56');
      g.addColorStop(0.85, '#0A1B36');
      g.addColorStop(1.00, '#071224');
    } else if (mode === 'dusk') {
      g.addColorStop(0.00, '#231F42');
      g.addColorStop(0.38, '#4E3C6E');
      g.addColorStop(0.68, '#8A6888');
      g.addColorStop(1.00, '#4A3B5C');
    } else {
      // night (螺钿黑漆夜海)
      g.addColorStop(0.00, '#0B1026');
      g.addColorStop(0.45, '#182448');
      g.addColorStop(0.80, '#25325C');
      g.addColorStop(1.00, '#141B34');
    }
    ctx.fillStyle = g;
    ctx.fillRect(-500, -350, w + 1000, h + 700);

    // Subtle woodblock baren horizontal silk grain (熟绢与饾版横纹)
    ctx.strokeStyle = mode === 'night' || mode === 'seabed' ? 'rgba(245,200,92,0.03)' : 'rgba(90,45,25,0.035)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = -100; y < h + 100; y += 8) {
      ctx.moveTo(-200, y);
      ctx.lineTo(w + 200, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Three-tiered Song-dynasty Blue-and-Green Mineral Mountains with 24K Mud-Gold Ridge Outlines (千里江山青绿叠嶂)
  function qinglvMountains(ctx, yBase, w, t, o = {}) {
    const night = o.night ?? 0;
    const side = o.side || 'both'; // 'left', 'right', 'both'
    const peaks = o.peaks || [
      { x0: -220, x1: 780,  px: 210, py: yBase - 165, seed: 11 },
      { x0: 80,   x1: 960,  px: 480, py: yBase - 115, seed: 17 },
      { x0: 1120, x1: 2140, px: 1620, py: yBase - 150, seed: 23 }
    ];
    ctx.save();
    for (const pk of peaks) {
      if (side === 'left' && pk.px > w * 0.55) continue;
      if (side === 'right' && pk.px < w * 0.45) continue;
      const pts = [];
      const N = 24;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const x = lerp(pk.x0, pk.x1, u);
        const d = u < 0.5 ? u * 2 : (1 - u) * 2;
        const arch = Math.pow(Math.max(0, d), 0.78);
        const jag = (vnoise(u * 5.2, pk.seed, 3) - 0.5) * 26 * arch;
        const y = lerp(yBase, pk.py, arch) + jag;
        pts.push([x, y]);
      }
      // Mineral gradient: Ochre base -> Malachite middle -> Azurite peak
      const mg = ctx.createLinearGradient(0, pk.py, 0, yBase);
      mg.addColorStop(0.00, mixCol(QL_PAL.azurite, '#16203E', night * 0.65));
      mg.addColorStop(0.45, mixCol(QL_PAL.malachite, '#223858', night * 0.65));
      mg.addColorStop(0.82, mixCol(QL_PAL.malachiteLt, '#384668', night * 0.65));
      mg.addColorStop(1.00, mixCol(QL_PAL.ochre, '#2C2644', night * 0.65));

      ctx.beginPath();
      ctx.moveTo(pk.x0, yBase + 6);
      for (const [x, y] of pts) ctx.lineTo(x, y);
      ctx.lineTo(pk.x1, yBase + 6);
      ctx.closePath();
      ctx.fillStyle = mg;
      ctx.fill();

      // Internal mineral contour veins (石青石绿分染结构线)
      ctx.strokeStyle = mixCol(QL_PAL.mudGold, '#9EA8D8', night * 0.5);
      ctx.lineWidth = 2.4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach(([x, y], idx) => idx ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();

      // Vertical gold-and-malachite ridge ribs (泥金皴脊线)
      for (let k = 4; k < N - 3; k += 4) {
        const [rx, ry] = pts[k];
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.quadraticCurveTo(rx + (k < N / 2 ? -18 : 18), (ry + yBase) * 0.5, rx + (k < N / 2 ? -36 : 36), yBase);
        ctx.strokeStyle = `rgba(245, 200, 92, ${(0.48 * (1 - night * 0.4)).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Mineral Sea, Shimmering Sun/Moon Ladder, and Golden Sandy Beach (碧海金沙与鎏金水纹)
  function seaShore(ctx, horizonY, shoreY, w, h, t, o = {}) {
    const mode = o.mode || 'sunset'; // 'sunset' | 'golden' | 'dusk' | 'night'
    const sunX = o.sunX ?? 1280;
    const wetSand = o.wetSand ?? false;
    ctx.save();

    // 1. Sandy Beach (金沙或暮紫镜面滩涂)
    const sg = ctx.createLinearGradient(0, shoreY - 30, 0, h + 200);
    if (mode === 'golden') {
      sg.addColorStop(0, '#F5D696');
      sg.addColorStop(1, '#D8A45C');
    } else if (mode === 'sunset') {
      sg.addColorStop(0, wetSand ? '#B88498' : '#E6BA8E');
      sg.addColorStop(0.5, wetSand ? '#8E6888' : '#D49E78');
      sg.addColorStop(1, wetSand ? '#5E4868' : '#B87C5C');
    } else if (mode === 'dusk') {
      sg.addColorStop(0, '#6E5A7E');
      sg.addColorStop(1, '#3E3252');
    } else {
      sg.addColorStop(0, '#323458');
      sg.addColorStop(1, '#1B1D36');
    }
    ctx.fillStyle = sg;
    ctx.fillRect(-400, shoreY - 20, w + 800, h - shoreY + 300);

    // 2. Layered Azurite & Malachite Sea Band (horizonY .. shoreY)
    const seaG = ctx.createLinearGradient(0, horizonY, 0, shoreY);
    if (mode === 'golden') {
      seaG.addColorStop(0.0, '#1E6E7A');
      seaG.addColorStop(0.5, '#389E92');
      seaG.addColorStop(1.0, '#78CCB4');
    } else if (mode === 'sunset') {
      seaG.addColorStop(0.0, '#2B4870');
      seaG.addColorStop(0.55, '#426B8E');
      seaG.addColorStop(1.0, '#7A92A8');
    } else if (mode === 'dusk') {
      seaG.addColorStop(0.0, '#1E2C56');
      seaG.addColorStop(0.6, '#2E4270');
      seaG.addColorStop(1.0, '#4E628E');
    } else {
      seaG.addColorStop(0.0, '#0F1A3A');
      seaG.addColorStop(0.6, '#1C2C54');
      seaG.addColorStop(1.0, '#2E4470');
    }
    ctx.fillStyle = seaG;
    ctx.fillRect(-400, horizonY, w + 800, shoreY - horizonY + 12);

    // Gold-outlined mineral wave ripples across the sea
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      const ry = lerp(horizonY + 18, shoreY - 16, r / (rows - 1));
      ctx.beginPath();
      for (let x = -300; x <= w + 300; x += 28) {
        const wy = ry + Math.sin(x * 0.015 + t * (1.6 + r * 0.25) + r * 1.7) * (3 + r * 1.4);
        if (x === -300) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
      }
      ctx.strokeStyle = mode === 'night' ? 'rgba(180,210,255,0.28)' : 'rgba(245,200,92,0.38)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    // 3. Shimmering Sun/Moon Reflection Ladder on the Water (浮光跃金水阶)
    const shimCol = mode === 'night' ? 'rgba(225, 238, 255, 0.72)' : 'rgba(255, 230, 145, 0.75)';
    ctx.fillStyle = shimCol;
    const stripCount = wetSand ? 22 : 12;
    const maxY = wetSand ? h - 60 : shoreY - 6;
    for (let i = 0; i < stripCount; i++) {
      const u = i / (stripCount - 1);
      const sy = lerp(horizonY + 6, maxY, u);
      const sw = lerp(26, wetSand ? 155 : 95, u) * (0.75 + 0.25 * Math.sin(t * 4.2 + i * 1.3));
      const sx = sunX + Math.sin(t * 3.1 + i * 0.9) * (6 + u * 14);
      ctx.beginPath();
      ctx.roundRect(sx - sw * 0.5, sy, sw, 3.2 + u * 2.5, 2);
      ctx.fill();
    }

    // 4. Scalloped Woodblock Foam Shoreline (雕版浪沫线)
    const surfSwell = Math.sin(t * 2.2) * 10 + (o.surfOffset || 0);
    const foamY = shoreY + surfSwell;
    ctx.beginPath();
    ctx.moveTo(-300, horizonY + 40);
    for (let x = -300; x <= w + 300; x += 24) {
      const fy = foamY + Math.sin(x * 0.018 + t * 2.4) * 7 + Math.cos(x * 0.045 - t * 3.2) * 4;
      ctx.lineTo(x, fy);
    }
    ctx.lineTo(w + 300, horizonY + 40);
    ctx.closePath();
    ctx.fillStyle = mode === 'golden' ? 'rgba(120, 210, 190, 0.32)' : 'rgba(190, 220, 245, 0.18)';
    ctx.fill();

    // Crisp white & gold foam lace along shoreY
    ctx.beginPath();
    for (let x = -300; x <= w + 300; x += 18) {
      const fy = foamY + Math.sin(x * 0.018 + t * 2.4) * 7 + Math.cos(x * 0.045 - t * 3.2) * 4;
      if (x === -300) ctx.moveTo(x, fy); else ctx.lineTo(x, fy);
    }
    ctx.strokeStyle = '#FFF9EA';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.strokeStyle = QL_PAL.mudGold;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.restore();
  }

  // Towering Woodblock & Mineral Great Wave (汹涌的潮汐 · 浮世木版鹰爪巨浪)
  function greatWave(ctx, yBase, w, h, swellK, crashK, t) {
    if (swellK <= 0.01) return;
    ctx.save();
    const peakH = lerp(20, 490, easeOut(swellK)) * (1 - crashK * 0.35);
    const cx = w * 0.5 + Math.sin(t * 1.8) * 18;
    const pts = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const x = -120 + u * (w + 240);
      const bell = Math.exp(-Math.pow((x - cx) / 560, 2));
      const shoulder = 0.25 * Math.sin(u * Math.PI);
      const y = yBase - (bell * 0.82 + shoulder) * peakH + Math.sin(u * 18 + t * 4) * 6;
      pts.push([x, y]);
    }

    // Mineral Azurite-to-Malachite Wave Body
    const wg = ctx.createLinearGradient(0, yBase - peakH, 0, yBase + 60);
    wg.addColorStop(0.00, '#68C4B8');
    wg.addColorStop(0.22, '#2B7F88');
    wg.addColorStop(0.60, '#1B4F82');
    wg.addColorStop(1.00, '#102B52');

    ctx.beginPath();
    ctx.moveTo(-120, yBase + 40);
    for (const [x, y] of pts) ctx.lineTo(x, y);
    ctx.lineTo(w + 120, yBase + 40);
    ctx.closePath();
    ctx.fillStyle = wg;
    ctx.fill();

    // Gold-and-cyan woodblock vertical water striation ribs (木版水纹肋线)
    for (let i = 4; i < N - 3; i += 2) {
      const [px, py] = pts[i];
      ctx.beginPath();
      ctx.moveTo(px, py + 12);
      ctx.quadraticCurveTo(px + (px < cx ? -24 : 24), (py + yBase) * 0.5, px + (px < cx ? -45 : 45), yBase + 15);
      ctx.strokeStyle = i % 4 === 0 ? 'rgba(245,200,92,0.42)' : 'rgba(150,225,235,0.32)';
      ctx.lineWidth = 2.0;
      ctx.stroke();
    }

    // Thick woodblock crest band + Eagle-Claw Foam Tendrils (木版鹰爪浪头 + 飞沫水珠)
    if (swellK > 0.25) {
      const clawA = clamp((swellK - 0.25) / 0.35);
      ctx.strokeStyle = QL_PAL.mudGold;
      ctx.lineWidth = 22 * clawA;
      ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();

      ctx.strokeStyle = '#FFF9EE';
      ctx.lineWidth = 16 * clawA;
      ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();

      // Claw hooks + flying pearl spray along the crest
      for (let i = 4; i <= N - 4; i += 2) {
        const [px, py] = pts[i];
        const dir = px < cx ? -1 : 1;
        ctx.fillStyle = '#FFF9EE';
        ctx.strokeStyle = '#1B365C';
        ctx.lineWidth = 2.2;
        for (const k of [-1, 0, 1]) {
          ctx.beginPath();
          const hx = px + k * 10, hy = py + 3;
          ctx.moveTo(hx, hy);
          ctx.quadraticCurveTo(hx + dir * 22, hy + 16, hx + dir * (30 + k * 6), hy + 36 * clawA);
          ctx.quadraticCurveTo(hx + dir * 10, hy + 24, hx - dir * 5, hy + 6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        // Flying sea-spray pearl droplets above the crest
        if (i % 4 === 0) {
          ctx.fillStyle = '#FFF9EE';
          ctx.strokeStyle = QL_PAL.mudGold;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px + Math.sin(t * 5 + i) * 12, py - 22 - (i % 3) * 10, 5.5 * clawA, 0, TAU);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // Crashing White Surf Billows (3.25 - 3.63s)
    if (crashK > 0.01) {
      const nPuffs = 11;
      for (let i = 0; i < nPuffs; i++) {
        const u = i / (nPuffs - 1);
        const bx = lerp(80, w - 80, u) + Math.sin(i * 3.1 + t * 4) * 20;
        const by = lerp(yBase - peakH * 0.35, yBase + 110, crashK) + Math.cos(i * 2.3) * 18;
        const br = (75 + 35 * Math.sin(i * 1.7)) * easeOut(crashK);
        ctx.fillStyle = '#FAF5E8';
        ctx.strokeStyle = '#2B4870';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Blue-and-White Porcelain Drift Bottle with Red Silk Cord & Glowing Secret (青花瓷漂流瓶)
  function porcelainBottle(ctx, x, y, sc = 1, rot = 0, glowAmt = 0.6) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(sc, sc);
    if (glowAmt > 0.05) {
      const rg = ctx.createRadialGradient(0, 0, 2, 0, 0, 56 * glowAmt);
      rg.addColorStop(0, `rgba(255, 232, 148, ${(0.75 * glowAmt).toFixed(3)})`);
      rg.addColorStop(1, 'rgba(255, 232, 148, 0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(0, 0, 56 * glowAmt, 0, TAU);
      ctx.fill();
    }
    // Translucent porcelain/glass bottle silhouette
    ctx.fillStyle = 'rgba(235, 248, 252, 0.88)';
    ctx.strokeStyle = '#1B3B5A';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-7, -28);
    ctx.lineTo(7, -28);
    ctx.lineTo(6, -15);
    ctx.bezierCurveTo(18, -10, 19, 18, 12, 28);
    ctx.lineTo(-12, 28);
    ctx.bezierCurveTo(-19, 18, -18, -10, -6, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rolled golden scroll + tiny red heart inside the bottle (瓶中心事锦书)
    ctx.fillStyle = '#F5C85C';
    ctx.strokeStyle = '#8C5222';
    ctx.lineWidth = 1.5;
    ctx.save();
    ctx.rotate(-0.18);
    ctx.fillRect(-5, -8, 10, 22);
    ctx.strokeRect(-5, -8, 10, 22);
    ctx.restore();
    pcHeart(ctx, 0, 4, 6.5, 0, '#D2201F', '#FFF5E2');

    // Cobalt blue-and-white cloud band around bottle belly (青花缠枝云纹)
    ctx.strokeStyle = '#1E5898';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-13, 18);
    ctx.lineTo(13, 18);
    ctx.moveTo(-14, 22);
    ctx.lineTo(14, 22);
    ctx.stroke();

    // Cork stopper & crimson silk cord
    ctx.fillStyle = '#B87A44';
    ctx.fillRect(-6, -34, 12, 7);
    ctx.strokeStyle = '#D2201F';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-7, -22);
    ctx.lineTo(7, -22);
    ctx.quadraticCurveTo(16, -24, 20, -16);
    ctx.stroke();
    ctx.restore();
  }

  // Vermilion-and-Gold Swimming/Leaping Koi Fish (朱金锦鲤)
  function koi(ctx, x, y, sc = 1, ang = 0, t = 0, col = '#E85A3C') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.scale(sc, sc);
    const wag = Math.sin(t * 14) * 5;
    ctx.fillStyle = col;
    ctx.strokeStyle = '#1C1624';
    ctx.lineWidth = 2.0;
    // Body
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.quadraticCurveTo(6, -10, -14, -4 + wag * 0.3);
    ctx.lineTo(-26, -11 + wag);
    ctx.lineTo(-21, 0 + wag * 0.6);
    ctx.lineTo(-26, 11 + wag);
    ctx.lineTo(-14, 4 + wag * 0.3);
    ctx.quadraticCurveTo(6, 10, 18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Gold dorsal spot & eye
    ctx.fillStyle = '#F5C85C';
    ctx.beginPath();
    ctx.arc(3, -2, 4.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#1C1624';
    ctx.beginPath();
    ctx.arc(11, -2.5, 1.8, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  // Swaying Dunhuang-Ribbon Underwater Kelp (敦煌绶带水草)
  function kelp(ctx, x0, yBot, h, t, seed = 1, col = '#267F68') {
    ctx.save();
    const ptsL = [], ptsR = [];
    const N = 12;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const sway = Math.sin(t * 2.6 + u * 4.2 + seed) * (18 * u);
      const w = (1 - u * 0.85) * 11;
      const x = x0 + sway, y = yBot - u * h;
      ptsL.push([x - w, y]);
      ptsR.push([x + w, y]);
    }
    ctx.beginPath();
    ptsL.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ptsR.reverse().forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = QL_PAL.mudGold;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();
  }

  // Scalloped Woodblock White-and-Gold Wave Curtain (雕版白浪卷帘，用于开场与结尾转场)
  function foamCurtain(ctx, w, h, cov, fromTop = true, t = 0) {
    if (cov <= 0.005) return;
    ctx.save();
    const edgeY = fromTop ? lerp(-60, h + 80, cov) : lerp(h + 60, -80, cov);
    ctx.beginPath();
    if (fromTop) {
      ctx.moveTo(-100, -100);
      ctx.lineTo(w + 100, -100);
      for (let x = w + 100; x >= -100; x -= 24) {
        const sc = Math.abs(Math.sin(x * 0.025 + t * 3)) * 22 + Math.sin(x * 0.06 - t * 4) * 8;
        ctx.lineTo(x, edgeY + sc);
      }
    } else {
      ctx.moveTo(-100, h + 100);
      ctx.lineTo(w + 100, h + 100);
      for (let x = w + 100; x >= -100; x -= 24) {
        const sc = Math.abs(Math.sin(x * 0.025 + t * 3)) * 22 + Math.sin(x * 0.06 - t * 4) * 8;
        ctx.lineTo(x, edgeY - sc);
      }
    }
    ctx.closePath();
    ctx.fillStyle = '#F6EFE0';
    ctx.fill();
    ctx.strokeStyle = QL_PAL.mudGold;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();
  }

  window.QINGLV = {
    PAL: QL_PAL, silkGround, qinglvMountains, seaShore, greatWave,
    porcelainBottle, koi, kelp, foamCurtain
  };
})();
