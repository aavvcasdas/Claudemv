// tide_pixel.js — 像素风复刻「潮汐」
// 56 秒 MV，BPM 143.6，5 个镜头，像素艺术风格
// 原始参考：潮汐.mp4（2D 方块小人动画）
//
// 在 studio.html 中替换 script 标签使用此文件

(() => {
  // 像素风渲染在低分辨率 buffer 上
  const PW = 480, PH = 270;  // 内部像素分辨率
  let pg;  // 像素 buffer

  // 颜色（像素风调色板）
  const C = {
    night1: '#1A1A3E',   // 深夜空
    night2: '#2D2D5E',   // 夜空
    night3: '#3D3D7E',   // 浅夜空
    stars: '#FFFFFF',
    moon: '#FFFACD',
    orange: '#E8734A',   // 橙色角色
    orangeDark: '#C05830',
    orangeLight: '#FF9070',
    pink: '#F090A0',     // 粉色角色
    pinkDark: '#D06878',
    pinkLight: '#FFB0C0',
    ground: '#4A6B4A',   // 草地
    groundDark: '#3A5538',
    sunset1: '#FF8C5A',  // 日落
    sunset2: '#FFB07A',
    sunset3: '#FFD090',
    planetGreen: '#5A9A5A',
    planetDark: '#2D5D2D',
    firework1: '#FF6B6B',
    firework2: '#6BFF6B',
    firework3: '#6B6BFF',
    firework4: '#FFFF6B',
    firework5: '#FF6BFF',
    text: '#E0E0E0',
    heart: '#FF4466',
  };

  // 歌词（从视频中观察到的中文歌词）
  const LYRICS = [
    { t: 0.0, text: "潮汐起落" },
    { t: 5.0, text: "心跳随着节拍" },
    { t: 10.4, text: "你是我心中的光" },
    { t: 15.0, text: "照亮每个夜晚" },
    { t: 20.0, text: "烟花绽放时" },
    { t: 25.0, text: "我们一起许愿" },
    { t: 30.0, text: "星星为我们见证" },
    { t: 35.4, text: "世界那么大" },
    { t: 40.0, text: "却只遇见你" },
    { t: 44.7, text: "潮汐不停息" },
    { t: 50.0, text: "爱意永流转" },
  ];

  // BPM 参数
  const BPM = 143.6;
  const BEAT = 60 / BPM;
  const DUR = 56;

  // 工具函数
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, x) => a + (b - a) * x;
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
  const bpOf = t => t / BEAT;
  const pulse = (t, k = 6) => Math.exp(-((t / BEAT) % 1) * k);
  const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // 像素绘图辅助
  function pRect(x, y, w, h, col) {
    pg.noStroke(); pg.fill(col);
    pg.rect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }
  function pPoint(x, y, col) {
    pg.stroke(col); pg.strokeWeight(1); pg.point(Math.floor(x), Math.floor(y));
  }
  function pLine(x0, y0, x1, y1, col) {
    pg.stroke(col); pg.strokeWeight(1);
    pg.line(Math.floor(x0), Math.floor(y0), Math.floor(x1), Math.floor(y1));
  }

  // 像素星星
  function drawStar(x, y, size, col, twinkle) {
    const s = Math.max(1, Math.floor(size));
    const a = 0.5 + 0.5 * Math.sin(twinkle);
    pg.noStroke();
    pg.fill(col, Math.floor(255 * a));
    // 十字
    pg.rect(Math.floor(x) - s, Math.floor(y), s * 2 + 1, 1);
    pg.rect(Math.floor(x), Math.floor(y) - s, 1, s * 2 + 1);
    if (s >= 2 && a > 0.7) {
      pg.rect(Math.floor(x) - s + 1, Math.floor(y) - 1, 1, 3);
      pg.rect(Math.floor(x) + s - 1, Math.floor(y) - 1, 1, 3);
      pg.rect(Math.floor(x) - 1, Math.floor(y) - s + 1, 3, 1);
      pg.rect(Math.floor(x) - 1, Math.floor(y) + s - 1, 3, 1);
    }
  }

  // 像素月亮
  function drawMoon(x, y, r) {
    const cx = Math.floor(x), cy = Math.floor(y), cr = Math.floor(r);
    pg.noStroke(); pg.fill(C.moon);
    for (let py = -cr; py <= cr; py++) {
      for (let px = -cr; px <= cr; px++) {
        if (px * px + py * py <= cr * cr) {
          // 挖掉右上形成新月
          const d2 = (px - cr * 0.35) ** 2 + (py + cr * 0.3) ** 2;
          if (d2 > cr * cr * 0.55) {
            pg.point(cx + px, cy + py);
          }
        }
      }
    }
  }

  // 方块角色
  function drawBoxChar(x, y, size, color, face, opts = {}) {
    const s = Math.floor(size);
    const bx = Math.floor(x) - s / 2, by = Math.floor(y) - s / 2;

    // 身体
    pRect(bx, by, s, s, color);
    // 暗边
    pRect(bx, by + s - 2, s, 2, color === C.orange ? C.orangeDark : C.pinkDark);
    pRect(bx + s - 2, by, 2, s, color === C.orange ? C.orangeDark : C.pinkDark);
    // 亮边
    pRect(bx, by, s, 1, color === C.orange ? C.orangeLight : C.pinkLight);
    pRect(bx, by, 1, s, color === C.orange ? C.orangeLight : C.pinkLight);

    // 脸
    const faceY = by + Math.floor(s * 0.35);
    const eyeSp = Math.floor(s * 0.22);
    const eyeSz = Math.max(2, Math.floor(s * 0.13));
    const eyeL = bx + Math.floor(s / 2) - eyeSp - eyeSz;
    const eyeR = bx + Math.floor(s / 2) + eyeSp - 1;

    pg.noStroke(); pg.fill('#1A1A1A');
    if (face === 'happy' || face === 'love') {
      pRect(eyeL, faceY, eyeSz, eyeSz, '#1A1A1A');
      pRect(eyeR, faceY, eyeSz, eyeSz, '#1A1A1A');
      // 嘴
      pRect(bx + Math.floor(s / 2) - 2, faceY + eyeSz + 2, 4, 2, '#1A1A1A');
    } else if (face === 'sad') {
      pRect(eyeL, faceY, eyeSz, eyeSz, '#1A1A1A');
      pRect(eyeR, faceY, eyeSz, eyeSz, '#1A1A1A');
      pRect(bx + Math.floor(s / 2) - 2, faceY + eyeSz + 4, 4, 1, '#1A1A1A');
    } else if (face === 'surprised') {
      pg.fill('#1A1A1A');
      pRect(eyeL - 1, faceY - 1, eyeSz + 2, eyeSz + 2, '#1A1A1A');
      pRect(eyeR - 1, faceY - 1, eyeSz + 2, eyeSz + 2, '#1A1A1A');
      // O 嘴
      pg.fill('#FFFFFF');
      pRect(bx + Math.floor(s / 2) - 1, faceY + eyeSz + 2, 3, 3, '#FFFFFF');
    } else if (face === 'love') {
      // 爱心眼
      pg.noStroke(); pg.fill(C.heart);
      const hx1 = bx + Math.floor(s / 2) - eyeSp;
      const hx2 = bx + Math.floor(s / 2) + eyeSp;
      pRect(hx1 - 1, faceY - 1, 2, 2, C.heart);
      pRect(hx1 + 1, faceY - 1, 2, 2, C.heart);
      pRect(hx1, faceY + 1, 2, 1, C.heart);
      pRect(hx2 - 1, faceY - 1, 2, 2, C.heart);
      pRect(hx2 + 1, faceY - 1, 2, 2, C.heart);
      pRect(hx2, faceY + 1, 2, 1, C.heart);
      pRect(bx + Math.floor(s / 2) - 2, faceY + eyeSz + 2, 4, 2, '#1A1A1A');
    } else if (face === 'sleep') {
      pRect(eyeL - 1, faceY + 1, eyeSz * 2 + 2, 2, '#1A1A1A');
      pRect(eyeR - 1, faceY + 1, eyeSz * 2 + 2, 2, '#1A1A1A');
    } else {
      pRect(eyeL, faceY, eyeSz, eyeSz, '#1A1A1A');
      pRect(eyeR, faceY, eyeSz, eyeSz, '#1A1A1A');
    }

    // 腮红
    if (opts.blush) {
      pg.noStroke(); pg.fill('#FF9999', 150);
      pRect(bx + Math.floor(s / 2) - eyeSp - 3, faceY + 3, 3, 2, '#FF9999');
      pRect(bx + Math.floor(s / 2) + eyeSp + 1, faceY + 3, 3, 2, '#FF9999');
    }

    // 手
    if (opts.hands !== false) {
      const handY = by + Math.floor(s * 0.5);
      pRect(bx - 3, handY, 3, 4, color);
      pRect(bx + s, handY, 3, 4, color);
    }
    // 腿
    if (opts.legs !== false) {
      pRect(bx + 3, by + s, 4, 4, color === C.orange ? C.orangeDark : C.pinkDark);
      pRect(bx + s - 7, by + s, 4, 4, color === C.orange ? C.orangeDark : C.pinkDark);
    }
  }

  // 地面
  function drawGround(y, col, darkCol) {
    pg.noStroke(); pg.fill(col);
    for (let x = 0; x < PW; x++) {
      const h = Math.floor(8 + 4 * Math.sin(x * 0.04) + 2 * Math.sin(x * 0.11));
      for (let py = 0; py < h; py++) {
        pg.point(x, y - py);
      }
    }
    pg.fill(darkCol);
    for (let x = 0; x < PW; x++) {
      const h = Math.floor(8 + 4 * Math.sin(x * 0.04) + 2 * Math.sin(x * 0.11));
      pg.point(x, y - h);
      pg.point(x, y - h + 1);
    }
  }

  // 像素烟花
  function drawFirework(x, y, radius, colors, t) {
    const n = colors.length;
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + t * 0.5;
      const r = radius * (0.3 + 0.7 * Math.abs(Math.sin(t * 2 + i * 0.7)));
      const ex = Math.floor(x + Math.cos(angle) * r);
      const ey = Math.floor(y + Math.sin(angle) * r);
      // 尾迹
      for (let j = 0; j < 3; j++) {
        const tr = r - j * 3;
        if (tr > 0) {
          const tx = Math.floor(x + Math.cos(angle) * tr);
          const ty = Math.floor(y + Math.sin(angle) * tr);
          pPoint(tx, ty, colors[i]);
        }
      }
      pPoint(ex, ey, '#FFFFFF');
    }
    // 中心
    pPoint(Math.floor(x), Math.floor(y), '#FFFFFF');
  }

  // 像素行星
  function drawPlanet(x, y, r, t) {
    const cx = Math.floor(x), cy = Math.floor(y), cr = Math.floor(r);
    const lightX = Math.cos(t * 0.15) * 0.3;
    for (let py = -cr; py <= cr; py++) {
      for (let px = -cr; px <= cr; px++) {
        if (px * px + py * py <= cr * cr) {
          const b = (px / cr) * lightX + 0.5;
          const col = b > 0 ? C.planetGreen : C.planetDark;
          pg.noStroke(); pg.fill(col);
          pg.point(cx + px, cy + py);
        }
      }
    }
    // 高光
    pg.noStroke(); pg.fill('#80C080', 100);
    pRect(cx - cr * 0.3, cy - cr * 0.3, cr * 0.3, cr * 0.2, '#80C080');
  }

  // 字幕
  function drawSubtitle(text, alpha) {
    if (!text) return;
    const fontSize = 8;
    const barH = 14;
    const barY = PH - barH - 4;
    // 半透明背景条
    pg.noStroke(); pg.fill(0, 0, 0, Math.floor(120 * alpha));
    pg.rect(0, barY, PW, barH);
    // 文字（简单像素字）
    pg.fill(255, 255, 255, Math.floor(255 * alpha));
    pg.textSize(fontSize);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.text(text, PW / 2, barY + barH / 2);
  }

  // 转场：像素溶解
  function pixelDissolve(p, seed) {
    if (p <= 0 || p >= 1) return;
    const threshold = p * 100;
    pg.loadPixels();
    for (let i = 0; i < pg.pixels.length; i += 4) {
      const px = (i / 4) % PW;
      const py = Math.floor((i / 4) / PW);
      const h = hash(px * 7 + py * 13 + seed * 31) * 100;
      if (h < threshold) {
        pg.pixels[i + 3] = 0;
      }
    }
    pg.updatePixels();
  }

  // ─── 镜头定义 ───
  function shot1(t, lt, dur) {
    // Shot 1: 暗夜，一个橙色角色站在小丘上，push_in + rotate
    // 时间：0 - 10.4s
    const progress = lt / dur;

    // 夜空渐变
    for (let y = 0; y < PH * 0.7; y++) {
      const k = y / (PH * 0.7);
      const r = Math.floor(lerp(26, 45, k));
      const g = Math.floor(lerp(26, 45, k));
      const b = Math.floor(lerp(62, 90, k));
      pg.noStroke(); pg.fill(r, g, b);
      pg.rect(0, y, PW, 1);
    }

    // 星星
    for (let i = 0; i < 60; i++) {
      const sx = hash(i * 3) * PW;
      const sy = hash(i * 7 + 1) * PH * 0.6;
      const ss = hash(i * 11 + 2) > 0.8 ? 2 : 1;
      drawStar(sx, sy, ss, C.stars, t * (1 + hash(i * 5)) * 2 + i);
    }

    // 月亮
    drawMoon(PW * 0.8, PH * 0.15, 12);

    // 小丘（地面）
    drawGround(PH * 0.78, C.ground, C.groundDark);

    // 角色位置（随 push_in 放大）
    const charSize = lerp(16, 24, easeOut(progress));
    const charX = PW * 0.5 + Math.sin(progress * Math.PI) * 2;
    const charY = PH * 0.78 - charSize / 2 - 4;

    // 角色呼吸动画
    const breathe = Math.sin(t * 2) * 1;

    drawBoxChar(charX, charY + breathe, charSize, C.orange, 'happy', { blush: true });

    // 歌词
    const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
    const lyricAlpha = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
    drawSubtitle(lyric ? lyric.text : '', lyricAlpha);
  }

  function shot2(t, lt, dur) {
    // Shot 2: 两个角色互动，多种场景（日落、烟花、星空）
    // 时间：10.4 - 35.4s (25s)
    const progress = lt / dur;

    // 根据进度切换子场景
    if (progress < 0.3) {
      // 日落场景 (10.4 - 17.9s)
      for (let y = 0; y < PH * 0.6; y++) {
        const k = y / (PH * 0.6);
        const r = Math.floor(lerp(255, 100, k));
        const g = Math.floor(lerp(140, 80, k));
        const b = Math.floor(lerp(90, 120, k));
        pg.noStroke(); pg.fill(r, g, b);
        pg.rect(0, y, PW, 1);
      }
      // 太阳
      pg.noStroke(); pg.fill(C.sunset3);
      const sunY = lerp(PH * 0.5, PH * 0.35, progress / 0.3);
      pRect(PW * 0.5 - 15, sunY, 30, 30, C.sunset3);
      pRect(PW * 0.5 - 12, sunY - 3, 24, 3, C.sunset2);
      pRect(PW * 0.5 - 12, sunY + 30, 24, 3, C.sunset2);

      drawGround(PH * 0.78, C.ground, C.groundDark);

      const cs = 18;
      drawBoxChar(PW * 0.42, PH * 0.78 - cs / 2 - 4, cs, C.orange, 'happy', { blush: true });
      drawBoxChar(PW * 0.58, PH * 0.78 - cs / 2 - 4, cs, C.pink, 'happy', { blush: true });

    } else if (progress < 0.6) {
      // 烟花场景 (17.9 - 25.4s)
      for (let y = 0; y < PH * 0.75; y++) {
        const k = y / (PH * 0.75);
        const r = Math.floor(lerp(26, 40, k));
        const g = Math.floor(lerp(26, 40, k));
        const b = Math.floor(lerp(62, 80, k));
        pg.noStroke(); pg.fill(r, g, b);
        pg.rect(0, y, PW, 1);
      }
      for (let i = 0; i < 40; i++) {
        drawStar(hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.5, 1, C.stars, t * 2 + i);
      }

      drawGround(PH * 0.78, C.ground, C.groundDark);

      // 烟花
      const fwProgress = (progress - 0.3) / 0.3;
      if (fwProgress > 0.1) {
        const colors = [C.firework1, C.firework2, C.firework3, C.firework4, C.firework5];
        for (let i = 0; i < 3; i++) {
          const fx = PW * (0.3 + i * 0.2);
          const fy = PH * (0.2 + i * 0.05);
          const fr = 20 + 10 * Math.sin(t * 3 + i);
          drawFirework(fx, fy, fr, colors, t + i * 0.5);
        }
      }

      const cs = 18;
      drawBoxChar(PW * 0.42, PH * 0.78 - cs / 2 - 4, cs, C.orange, 'surprised', { blush: true });
      drawBoxChar(PW * 0.58, PH * 0.78 - cs / 2 - 4, cs, C.pink, 'love', { blush: true });

    } else {
      // 星空场景 (25.4 - 35.4s)
      for (let y = 0; y < PH * 0.7; y++) {
        const k = y / (PH * 0.7);
        const r = Math.floor(lerp(20, 35, k));
        const g = Math.floor(lerp(20, 35, k));
        const b = Math.floor(lerp(50, 70, k));
        pg.noStroke(); pg.fill(r, g, b);
        pg.rect(0, y, PW, 1);
      }
      for (let i = 0; i < 80; i++) {
        const ss = hash(i * 11 + 2) > 0.9 ? 2 : 1;
        drawStar(hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.6, ss, C.stars, t * (1 + hash(i * 5)) * 2 + i);
      }
      drawMoon(PW * 0.15, PH * 0.12, 10);

      drawGround(PH * 0.78, C.ground, C.groundDark);

      const cs = 18;
      drawBoxChar(PW * 0.42, PH * 0.78 - cs / 2 - 4, cs, C.orange, 'happy', { blush: true });
      drawBoxChar(PW * 0.58, PH * 0.78 - cs / 2 - 4, cs, C.pink, 'happy', { blush: true });
    }

    const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
    const lyricAlpha = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
    drawSubtitle(lyric ? lyric.text : '', lyricAlpha);
  }

  function shot3(t, lt, dur) {
    // Shot 3: 行星，夜空
    // 时间：35.4 - 42.7s
    const progress = lt / dur;

    for (let y = 0; y < PH * 0.7; y++) {
      const k = y / (PH * 0.7);
      const r = Math.floor(lerp(26, 45, k));
      const g = Math.floor(lerp(26, 45, k));
      const b = Math.floor(lerp(62, 90, k));
      pg.noStroke(); pg.fill(r, g, b);
      pg.rect(0, y, PW, 1);
    }
    for (let i = 0; i < 50; i++) {
      drawStar(hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.5, 1, C.stars, t * 2 + i);
    }

    // 行星（pull_out 效果：从小到大）
    const planetR = lerp(20, 40, easeOut(progress));
    drawPlanet(PW * 0.5, PH * 0.4, planetR, t);

    drawGround(PH * 0.82, C.ground, C.groundDark);

    const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
    const lyricAlpha = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
    drawSubtitle(lyric ? lyric.text : '', lyricAlpha);
  }

  function shot4(t, lt, dur) {
    // Shot 4: 快速过渡
    // 时间：42.7 - 44.7s
    const progress = lt / dur;

    // 闪白过渡
    const flash = progress < 0.3 ? easeOut(progress / 0.3) : 1 - ease((progress - 0.3) / 0.7);
    const brightness = Math.floor(flash * 200);

    pg.noStroke(); pg.fill(26 + brightness, 26 + brightness, 62 + brightness);
    pg.rect(0, 0, PW, PH);

    // 快速闪烁的星星
    for (let i = 0; i < 30; i++) {
      if (hash(i * 17 + Math.floor(t * 10)) > 0.5) {
        drawStar(hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.6, 2, C.stars, t * 10 + i);
      }
    }
  }

  function shot5(t, lt, dur) {
    // Shot 5: 夜空，一个角色，结尾行星
    // 时间：44.7 - 56s
    const progress = lt / dur;

    for (let y = 0; y < PH * 0.7; y++) {
      const k = y / (PH * 0.7);
      const r = Math.floor(lerp(26, 45, k));
      const g = Math.floor(lerp(26, 45, k));
      const b = Math.floor(lerp(62, 90, k));
      pg.noStroke(); pg.fill(r, g, b);
      pg.rect(0, y, PW, 1);
    }
    for (let i = 0; i < 60; i++) {
      drawStar(hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.6, 1, C.stars, t * 2 + i);
    }
    drawMoon(PW * 0.8, PH * 0.15, 12);

    drawGround(PH * 0.78, C.ground, C.groundDark);

    const cs = lerp(20, 16, easeOut(progress));
    drawBoxChar(PW * 0.5, PH * 0.78 - cs / 2 - 4, cs, C.orange, 'happy', { blush: true });

    // 结尾出现小行星
    if (progress > 0.7) {
      const endProgress = (progress - 0.7) / 0.3;
      const planetR = lerp(5, 15, easeOut(endProgress));
      drawPlanet(PW * 0.75, PH * 0.3, planetR, t);
    }

    const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
    const lyricAlpha = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
    drawSubtitle(lyric ? lyric.text : '', lyricAlpha);
  }

  // ─── 镜头列表 ───
  shots([
    [0, shot1],
    [10.4, shot2],
    [35.4, shot3],
    [42.7, shot4],
    [44.7, shot5],
  ]);

  // ─── drawWorld 覆盖：像素渲染 ──
  // 在低分辨率 buffer 上绘制，然后放大
  const origDrawWorld = window.drawWorld;
  window.drawWorld = function(t) {
    if (!pg) {
      pg = createGraphics(PW, PH);
      pg.pixelDensity(1);
      pg.noSmooth();
    }

    pg.clear();

    if (window.LOOP) {
      window.LOOP(t);
    } else if (!SHOTS.length) {
      // placeholder
    } else {
      let i = 0;
      while (i + 1 < SHOTS.length && t >= SHOTS[i + 1][0]) i++;
      const t0 = SHOTS[i][0];
      const end = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
      SHOTS[i][1](t, t - t0, end - t0);
    }

    // 放大到主 canvas
    noSmooth();
    image(pg, 0, 0, W, H);
  };
})();
