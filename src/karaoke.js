// karaoke.js — 2D brush-font KTV lyric bar with per-character fill & Chinese scroll-plaque styling.
// Adapted from ReelMimic (.claude/skills/painted-animation/template/src/karaoke.js) for Claudemv.
//
// Accepts PROJECT.lyrics in either format:
//   1. Array of objects from align_lyrics.py: [{ t, end, text, words: [{w, s, e}] }, ...]
//   2. Array of tuples: [[t0, t1, 'text', { hold, pun }], ...]

window.EXTRA_FONTS = ['72px "Ma Shan Zheng"', '600 56px "Noto Serif SC"'];

(() => {
  const FONT = '52px "Ma Shan Zheng", "Noto Serif SC", "Permanent Marker", cursive';
  const PADX = 32, BH = 64, BR = 18;

  function normLine(entry) {
    if (Array.isArray(entry)) {
      const [t0, t1, txt, o = {}] = entry;
      return { t0, t1, txt, words: o.words || null, o };
    }
    return {
      t0: entry.t ?? entry.start ?? 0,
      t1: entry.end ?? (entry.t + 3),
      txt: entry.text ?? entry.txt ?? '',
      words: entry.words || null,
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

  function strikeAndFix(c, x0, x1, y, p, word) {
    const sk = easeOut(seg(p, 0, 0.35)), fk = backOut(seg(p, 0.25, 0.75));
    c.save();
    c.strokeStyle = '#D94436';
    c.lineCap = 'round';
    c.lineWidth = 6.5;
    for (const dy of [-5, 5]) {
      c.beginPath();
      c.moveTo(x0 - 6, y + dy);
      c.lineTo(lerp(x0 - 6, x1 + 6, sk), y - dy);
      c.stroke();
    }
    if (fk > 0.01) {
      c.translate((x0 + x1) / 2, y - 50);
      c.rotate(-0.07);
      c.scale(fk, fk);
      c.font = FONT;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineJoin = 'round';
      c.lineWidth = 8.5;
      c.strokeStyle = '#1C141B';
      c.strokeText(word, 0, 0);
      c.fillStyle = '#6E9F58';
      c.fillText(word, 0, 0);
    }
    c.restore();
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

    const cur = L[idx], { t0, t1, txt, words, o } = cur;
    const prev = idx > 0 && L[idx - 1].o?.hold && t < L[idx - 1].o.hold ? L[idx - 1] : null;
    const a = clamp(Math.min((t - (t0 - 0.06)) / 0.12, (t1 + 0.06 - t) / 0.12));
    if (a <= 0.01) return;

    c.save();
    c.globalAlpha = a;
    c.font = FONT;
    const w1 = c.measureText(txt).width;
    const w0 = prev ? c.measureText(prev.txt).width : 0;
    const bw = Math.max(w1, w0) + PADX * 2 + 24;

    if (prev) {
      const yTop = Y - 66, yBot = Y;
      c.fillStyle = 'rgba(24, 18, 22, 0.80)';
      pill(c, W / 2 - bw / 2, yTop - BH / 2 - 4, bw, BH + 74, BR);
      c.fill();
      paintRow(c, prev.txt, yTop, 1, prev.words, t);
      const k = clamp((t - t0) / Math.max(0.01, t1 - t0));
      const { x0, tw } = paintRow(c, txt, yBot, k, words, t);
      if (o.pun && t >= o.pun.at) {
        const i = txt.indexOf(o.pun.strike);
        if (i >= 0) {
          const sx0 = x0 + c.measureText(txt.slice(0, i)).width;
          const sx1 = sx0 + c.measureText(o.pun.strike).width;
          strikeAndFix(c, sx0, sx1, yBot, (t - o.pun.at) / 0.45, o.pun.fix);
        } else {
          strikeAndFix(c, x0, x0 + tw, yBot, (t - o.pun.at) / 0.45, o.pun.fix);
        }
      }
    } else {
      const px = W / 2 - bw / 2, py = Y - BH / 2;
      const isQinglv = typeof PROJECT !== 'undefined' && PROJECT.styles && PROJECT.styles.includes('qinglv-woodblock');
      // Traditional Ebony or Lapis-Lazuli & Gold-Trimmed Lyric Plaque (乌木/青绿描金词牌)
      c.fillStyle = isQinglv ? 'rgba(14, 28, 54, 0.84)' : 'rgba(24, 18, 24, 0.80)';
      pill(c, px, py, bw, BH, BR);
      c.fill();
      c.strokeStyle = isQinglv ? 'rgba(245, 200, 92, 0.72)' : 'rgba(232, 170, 56, 0.48)';
      c.lineWidth = isQinglv ? 2.0 : 1.6;
      c.stroke();

      // Ornament on left & right inside plaque
      c.fillStyle = isQinglv ? '#3B9E82' : '#B02E22';
      c.fillRect(px + 12, Y - 10, 8, 20);
      if (isQinglv) {
        c.fillStyle = '#F5C85C';
        c.fillRect(px + bw - 20, Y - 10, 6, 20);
      }

      const k = clamp((t - t0) / Math.max(0.01, t1 - t0));
      paintRow(c, txt, Y, k, words, t);
    }
    c.restore();
  }

  window.overlayHook = drawKaraoke;
})();
