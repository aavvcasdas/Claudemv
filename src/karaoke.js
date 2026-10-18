// karaoke.js — Dual-mode 2D brush-font lyric renderer:
//   1. Classic Scroll-Plaque KTV mode (default, for 潮汐 / new潮汐)
//   2. Frameless Kinetic Pop-In Typography mode (PROJECT.subtitleMode === 'kinetic', for 去年夏天)

window.EXTRA_FONTS = ['72px "Ma Shan Zheng"', '600 56px "Noto Serif SC"'];

(() => {
  const FONT = '52px "Ma Shan Zheng", "Noto Serif SC", "Permanent Marker", cursive';
  const PADX = 32, BH = 64, BR = 18;

  function normLine(entry) {
    if (Array.isArray(entry)) {
      const [t0, t1, txt, o = {}] = entry;
      return { t0, t1, txt, words: o.words || null, meta: o.meta || {}, o };
    }
    return {
      t0: entry.t ?? entry.start ?? 0,
      t1: entry.end ?? (entry.t + 3),
      txt: entry.text ?? entry.txt ?? '',
      words: entry.words || null,
      meta: entry.meta || {},
      o: entry
    };
  }

  function pill(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  // Compute which character indices in `txt` belong to highlighted keywords (`meta.hi`)
  function getHighlightSet(txt, hiStr) {
    const set = new Set();
    if (!hiStr) return set;
    for (const kw of String(hiStr).split(',').map(s => s.trim()).filter(Boolean)) {
      const idx = txt.indexOf(kw);
      if (idx >= 0) {
        for (let k = idx; k < idx + kw.length; k++) set.add(k);
      }
    }
    return set;
  }

  // Draw comic golden burst rays around a highlighted word
  function drawWordRays(c, cx, cy, rx, ry, popK) {
    if (popK <= 0.05) return;
    c.save();
    c.strokeStyle = '#F5C84C';
    c.lineWidth = 3.2;
    c.lineCap = 'round';
    const angles = [-2.5, -1.9, -1.2, -0.5, 0.4, 1.1, 1.9, 2.6];
    for (const a of angles) {
      const r0 = 1.05, r1 = 1.05 + 0.36 * Math.sin(popK * Math.PI);
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * rx * r0, cy + Math.sin(a) * ry * r0);
      c.lineTo(cx + Math.cos(a) * rx * r1, cy + Math.sin(a) * ry * r1);
      c.stroke();
    }
    c.restore();
  }

  // Frameless Kinetic Pop-In Subtitle Renderer (《去年夏天》手绘弹出式高光黄字字幕)
  function drawKineticSubtitle(c, cur, t, alpha) {
    const { t0, t1, txt, words, meta } = cur;
    const chars = [...txt];
    const n = chars.length || 1;
    const hiSet = getHighlightSet(txt, meta.hi);
    const posMode = meta.pos || 'center';

    c.save();
    c.globalAlpha = alpha;
    c.textBaseline = 'middle';
    c.textAlign = 'center';
    c.lineJoin = 'round';

    const drawCharAt = (ch, i, gx, gy) => {
      const ws = t0 + (i / n) * Math.min(1.35, (t1 - t0) * 0.52);
      const we = ws + 0.18;
      if (t < ws - 0.03) return;
      const p = clamp((t - ws) / Math.max(0.08, we - ws));
      const isHi = hiSet.has(i);
      const sc = backOut(p) * (isHi ? 1.32 : 1.0);
      const bounceY = p < 1 ? -Math.sin(p * Math.PI) * (isHi ? 12 : 6) : 0;

      c.save();
      c.translate(gx, gy + bounceY);
      c.scale(sc, sc);
      if (isHi && p > 0.15 && p < 0.98) {
        drawWordRays(c, 0, 0, 28, 26, p);
      }
      c.font = isHi
        ? 'bold 60px "Ma Shan Zheng", "Noto Serif SC", cursive'
        : '50px "Ma Shan Zheng", "Noto Serif SC", cursive';
      c.lineWidth = isHi ? 11 : 9.5;
      c.strokeStyle = '#23141E';
      c.strokeText(ch, 0, 0);
      c.fillStyle = isHi ? '#F5C445' : '#FFFDF7';
      c.fillText(ch, 0, 0);
      c.restore();
    };

    if (posMode === 'vert_right' || posMode === 'vert_left') {
      const vx = posMode === 'vert_right' ? 1420 : 490;
      const vy0 = 235;
      const stepY = 60;
      chars.forEach((ch, i) => drawCharAt(ch, i, vx, vy0 + i * stepY));
    } else if (posMode === 'two_line') {
      const splitIdx = meta.split || Math.ceil(n / 2);
      const row1 = chars.slice(0, splitIdx);
      const row2 = chars.slice(splitIdx);
      const stepX = 56;
      const cx1 = W / 2 - 55, cy1 = H - 132;
      const cx2 = W / 2 + 55, cy2 = H - 68;
      row1.forEach((ch, i) => {
        const gx = cx1 + (i - (row1.length - 1) / 2) * stepX;
        drawCharAt(ch, i, gx, cy1);
      });
      row2.forEach((ch, j) => {
        const i = splitIdx + j;
        const gx = cx2 + (j - (row2.length - 1) / 2) * stepX;
        drawCharAt(ch, i, gx, cy2);
      });
    } else {
      let cx = W / 2, cy = H - 88;
      if (posMode === 'left') { cx = 640; cy = H - 92; }
      else if (posMode === 'cloud_right') { cx = 1230; cy = 365; }
      const stepX = 56;
      chars.forEach((ch, i) => {
        const gx = cx + (i - (n - 1) / 2) * stepX;
        drawCharAt(ch, i, gx, cy);
      });
    }

    c.restore();
  }

  function paintRow(c, txt, y, k, words = null, t = 0) {
    c.font = FONT;
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    const chars = [...txt];
    const cw = chars.map(ch => c.measureText(ch).width);
    const tw = cw.reduce((a, b) => a + b, 0);
    let x = W / 2 - tw / 2;
    const pos = cw.map(w => { const p = x; x += w; return p; });
    const n = chars.length || 1;

    chars.forEach((ch, i) => {
      let ck;
      if (words && words[i] && words[i].e > words[i].s) {
        ck = clamp((t - words[i].s) / Math.max(0.04, words[i].e - words[i].s));
      } else {
        ck = clamp(k * n - i);
      }
      const pop = ck > 0 && ck < 1 ? Math.sin(ck * Math.PI) * 5 : 0;
      const gx = pos[i], gy = y - pop;

      c.lineJoin = 'round';
      c.lineWidth = 8.5;
      c.strokeStyle = '#1C141B';
      c.strokeText(ch, gx, gy);
      c.fillStyle = '#F4EFE3';
      c.fillText(ch, gx, gy);

      if (ck > 0) {
        c.save();
        c.beginPath();
        c.rect(gx - 4, gy - 44, (cw[i] + 8) * ck, 88);
        c.clip();
        c.lineWidth = 8.5;
        c.strokeStyle = '#1C141B';
        c.strokeText(ch, gx, gy);
        const isQinglv = typeof PROJECT !== 'undefined' && PROJECT.styles && PROJECT.styles.includes('qinglv-woodblock');
        c.fillStyle = isQinglv ? '#FFD460' : (PAL.ochre || '#E8AA38');
        c.fillText(ch, gx, gy);
        c.restore();
      }
    });
    return { x0: W / 2 - tw / 2, x1: W / 2 + tw / 2, tw };
  }

  function drawKaraoke(c, t) {
    const Y = (typeof H !== 'undefined' ? H : 1080) - 62;
    const raw = PROJECT.lyrics;
    if (!raw || !raw.length) return;
    const L = raw.map(normLine);
    let idx = -1;
    for (let i = 0; i < L.length; i++) {
      if (t >= L[i].t0 - 0.06 && t <= L[i].t1 + 0.06) { idx = i; break; }
    }
    if (idx < 0) return;

    const cur = L[idx], { t0, t1, txt, words } = cur;
    const a = clamp(Math.min((t - (t0 - 0.06)) / 0.12, (t1 + 0.06 - t) / 0.12));
    if (a <= 0.01) return;

    if (typeof PROJECT !== 'undefined' && PROJECT.subtitleMode === 'kinetic') {
      drawKineticSubtitle(c, cur, t, a);
      return;
    }

    c.save();
    c.globalAlpha = a;
    c.font = FONT;
    const w1 = c.measureText(txt).width;
    const bw = w1 + PADX * 2 + 24;
    const px = W / 2 - bw / 2, py = Y - BH / 2;
    const isQinglv = typeof PROJECT !== 'undefined' && PROJECT.styles && PROJECT.styles.includes('qinglv-woodblock');
    c.fillStyle = isQinglv ? 'rgba(14, 28, 54, 0.84)' : 'rgba(24, 18, 24, 0.80)';
    pill(c, px, py, bw, BH, BR);
    c.fill();
    c.strokeStyle = isQinglv ? 'rgba(245, 200, 92, 0.72)' : 'rgba(232, 170, 56, 0.48)';
    c.lineWidth = isQinglv ? 2.0 : 1.6;
    c.stroke();

    c.fillStyle = isQinglv ? '#3B9E82' : '#B02E22';
    c.fillRect(px + 12, Y - 10, 8, 20);
    if (isQinglv) {
      c.fillStyle = '#F5C85C';
      c.fillRect(px + bw - 20, Y - 10, 6, 20);
    }

    const k = clamp((t - t0) / Math.max(0.01, t1 - t0));
    paintRow(c, txt, Y, k, words, t);
    c.restore();
  }

  window.overlayHook = drawKaraoke;
})();
