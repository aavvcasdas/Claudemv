// pixel.js — 像素风渲染引擎
// 在低分辨率 buffer 上绘制，然后放大到全分辨率，保持硬像素边缘
// 适配本项目 p5.js 管线

const PX = {
  scale: 4,            // 像素放大倍数（360p → 1440p 时 scale=4）
  W: 480, H: 270,      // 内部渲染分辨率（16:9）
};

// 初始化离屏 canvas 用于像素渲染
function setupPixelCanvas() {
  const c = createGraphics(PX.W, PX.H);
  c.pixelDensity(1);
  c.noSmooth();
  return c;
}

// 在主 canvas 上放大显示像素画面
function drawPixelBuffer(pg) {
  noSmooth();
  image(pg, 0, 0, W, H);
}

// ─ 像素绘图原语 ──
// 所有坐标在 PX.W × PX.H 空间内

function pxRect(pg, x, y, w, h, col) {
  pg.noStroke();
  pg.fill(col);
  pg.rect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
}

function pxEllipse(pg, x, y, w, h, col) {
  // 像素化的圆：用方形近似
  pg.noStroke();
  pg.fill(col);
  const cx = Math.floor(x), cy = Math.floor(y);
  const rx = Math.floor(w / 2), ry = Math.floor(h / 2);
  for (let py = -ry; py <= ry; py++) {
    for (let px = -rx; px <= rx; px++) {
      if ((px / rx) ** 2 + (py / ry) ** 2 <= 1) {
        pg.point(cx + px, cy + py);
      }
    }
  }
}

function pxLine(pg, x0, y0, x1, y1, col, thick = 1) {
  pg.stroke(col);
  pg.strokeWeight(thick);
  pg.line(Math.floor(x0), Math.floor(y0), Math.floor(x1), Math.floor(y1));
}

function pxPoint(pg, x, y, col) {
  pg.stroke(col);
  pg.strokeWeight(1);
  pg.point(Math.floor(x), Math.floor(y));
}

// 像素化星星（十字形）
function pxStar(pg, x, y, size, col) {
  const s = Math.floor(size);
  pg.noStroke();
  pg.fill(col);
  // 十字
  pg.rect(Math.floor(x) - s, Math.floor(y) - 1, s * 2 + 1, 3);
  pg.rect(Math.floor(x) - 1, Math.floor(y) - s, 3, s * 2 + 1);
  // 对角
  if (s >= 2) {
    pg.point(Math.floor(x) - s + 1, Math.floor(y) - s + 1);
    pg.point(Math.floor(x) + s - 1, Math.floor(y) - s + 1);
    pg.point(Math.floor(x) - s + 1, Math.floor(y) + s - 1);
    pg.point(Math.floor(x) + s - 1, Math.floor(y) + s - 1);
  }
}

// 像素化的月亮（圆形 + 挖掉一块）
function pxMoon(pg, x, y, r, col) {
  const cx = Math.floor(x), cy = Math.floor(y), cr = Math.floor(r);
  pg.noStroke();
  pg.fill(col);
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      const d = px * px + py * py;
      if (d <= cr * cr) {
        // 挖掉右上角形成新月
        const d2 = (px - cr * 0.4) ** 2 + (py + cr * 0.3) ** 2;
        if (d2 > cr * cr * 0.6) {
          pg.point(cx + px, cy + py);
        }
      }
    }
  }
}

// 像素化烟花爆炸
function pxFirework(pg, x, y, radius, colors, t) {
  const n = colors.length;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * TAU + t * 0.3;
    const r = radius * (0.5 + 0.5 * Math.sin(t * 3 + i));
    const ex = Math.floor(x + Math.cos(angle) * r);
    const ey = Math.floor(y + Math.sin(angle) * r);
    const trail = 3;
    for (let j = 0; j < trail; j++) {
      const tr = radius * (0.5 + 0.5 * Math.sin(t * 3 + i)) - j * 2;
      const tx = Math.floor(x + Math.cos(angle) * Math.max(0, tr));
      const ty = Math.floor(y + Math.sin(angle) * Math.max(0, tr));
      pg.noStroke();
      pg.fill(colors[i]);
      pg.point(tx, ty);
    }
  }
  // 中心亮光
  pg.noStroke();
  pg.fill('#FFFFFF');
  pg.point(Math.floor(x), Math.floor(y));
  pg.fill('#FFFFAA');
  pg.point(Math.floor(x) - 1, Math.floor(y));
  pg.point(Math.floor(x) + 1, Math.floor(y));
  pg.point(Math.floor(x), Math.floor(y) - 1);
  pg.point(Math.floor(x), Math.floor(y) + 1);
}

// 像素化行星（带明暗半球）
function pxPlanet(pg, x, y, r, lightCol, darkCol, t) {
  const cx = Math.floor(x), cy = Math.floor(y), cr = Math.floor(r);
  // 光照方向随时间微动
  const lightX = Math.cos(t * 0.2) * 0.3;
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      if (px * px + py * py <= cr * cr) {
        const brightness = (px / cr) * lightX + 0.5;
        const col = brightness > 0 ? lightCol : darkCol;
        pg.noStroke();
        pg.fill(col);
        pg.point(cx + px, cy + py);
      }
    }
  }
}

// ── 方块角色（像素风） ──
// boxChar(pg, x, y, size, color, face, accessories)
function pxBoxChar(pg, x, y, size, color, face, opts = {}) {
  const s = Math.floor(size);
  const bx = Math.floor(x) - s / 2, by = Math.floor(y) - s / 2;

  // 身体（方块）
  pg.noStroke();
  pg.fill(color);
  pg.rect(bx, by, s, s);

  // 身体暗边（右下）
  pg.fill(darken(color, 30));
  pg.rect(bx, by + s - 2, s, 2);
  pg.rect(bx + s - 2, by, 2, s);

  // 身体亮边（左上）
  pg.fill(lighten(color, 30));
  pg.rect(bx, by, s, 1);
  pg.rect(bx, by, 1, s);

  // 脸
  const faceY = by + s * 0.35;
  const eyeY = Math.floor(faceY);
  const eyeSpacing = Math.floor(s * 0.25);
  const eyeSize = Math.max(2, Math.floor(s * 0.12));

  if (face === 'happy') {
    // 弯眼（笑）
    pg.noStroke();
    pg.fill('#1A1A1A');
    pg.rect(bx + s / 2 - eyeSpacing - eyeSize, eyeY, eyeSize, eyeSize);
    pg.rect(bx + s / 2 + eyeSpacing - 1, eyeY, eyeSize, eyeSize);
    // 微笑嘴
    pg.rect(bx + s / 2 - 2, eyeY + eyeSize + 2, 4, 2);
  } else if (face === 'sad') {
    pg.noStroke();
    pg.fill('#1A1A1A');
    pg.rect(bx + s / 2 - eyeSpacing - eyeSize, eyeY, eyeSize, eyeSize);
    pg.rect(bx + s / 2 + eyeSpacing - 1, eyeY, eyeSize, eyeSize);
    // 下弯嘴
    pg.rect(bx + s / 2 - 2, eyeY + eyeSize + 4, 4, 1);
  } else if (face === 'surprised') {
    pg.noStroke();
    pg.fill('#1A1A1A');
    // 大圆眼
    pg.ellipse(bx + s / 2 - eyeSpacing, eyeY + 1, eyeSize + 2, eyeSize + 2);
    pg.ellipse(bx + s / 2 + eyeSpacing, eyeY + 1, eyeSize + 2, eyeSize + 2);
    // O 形嘴
    pg.ellipse(bx + s / 2, eyeY + eyeSize + 4, 3, 3);
  } else if (face === 'love') {
    // 爱心眼
    pg.noStroke();
    pg.fill('#FF4466');
    const heartX1 = bx + s / 2 - eyeSpacing;
    const heartX2 = bx + s / 2 + eyeSpacing;
    pg.rect(heartX1 - 1, eyeY - 1, 2, 2);
    pg.rect(heartX1 + 1, eyeY - 1, 2, 2);
    pg.rect(heartX1, eyeY + 1, 2, 1);
    pg.rect(heartX2 - 1, eyeY - 1, 2, 2);
    pg.rect(heartX2 + 1, eyeY - 1, 2, 2);
    pg.rect(heartX2, eyeY + 1, 2, 1);
    // 微笑
    pg.fill('#1A1A1A');
    pg.rect(bx + s / 2 - 2, eyeY + eyeSize + 2, 4, 2);
  } else if (face === 'sleep') {
    pg.noStroke();
    pg.fill('#1A1A1A');
    // 闭眼（横线）
    pg.rect(bx + s / 2 - eyeSpacing - eyeSize, eyeY + 1, eyeSize * 2, 2);
    pg.rect(bx + s / 2 + eyeSpacing - 1, eyeY + 1, eyeSize * 2, 2);
    // Zzz
    if (opts.zzz) {
      pg.fill('#FFFFFF');
      pg.rect(bx + s / 2 + s * 0.4, eyeY - 4, 3, 2);
      pg.rect(bx + s / 2 + s * 0.5, eyeY - 8, 4, 2);
    }
  } else {
    // 默认：简单点眼
    pg.noStroke();
    pg.fill('#1A1A1A');
    pg.rect(bx + s / 2 - eyeSpacing, eyeY, eyeSize, eyeSize);
    pg.rect(bx + s / 2 + eyeSpacing - 1, eyeY, eyeSize, eyeSize);
  }

  // 腮红（可选）
  if (opts.blush) {
    pg.noStroke();
    pg.fill('#FF9999', 150);
    pg.rect(bx + s / 2 - eyeSpacing - 3, eyeY + 3, 3, 2);
    pg.rect(bx + s / 2 + eyeSpacing + 1, eyeY + 3, 3, 2);
  }

  // 手（小方块）
  if (opts.hands !== false) {
    const handY = by + s * 0.5;
    pg.noStroke();
    pg.fill(color);
    pg.rect(bx - 3, handY, 3, 4);
    pg.rect(bx + s, handY, 3, 4);
  }

  // 腿（小方块）
  if (opts.legs !== false) {
    const legY = by + s;
    pg.noStroke();
    pg.fill(darken(color, 20));
    pg.rect(bx + 3, legY, 4, 4);
    pg.rect(bx + s - 7, legY, 4, 4);
  }

  // 配件
  if (opts.hat) {
    pg.noStroke();
    pg.fill(opts.hat);
    pg.rect(bx + 2, by - 4, s - 4, 4);
    pg.rect(bx + 4, by - 7, s - 8, 3);
  }
  if (opts.umbrella) {
    pg.noStroke();
    pg.fill(opts.umbrella);
    // 伞面
    for (let i = 0; i < 6; i++) {
      pg.rect(bx - 3 + i * 2, by - 8 - i, 2 + i * 0.5, 1);
    }
    // 伞柄
    pg.fill('#8B4513');
    pg.rect(bx + s / 2 - 1, by - 8, 2, s / 2 + 8);
  }
}

// 颜色工具
function darken(hex, amt) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return '#' + [r, g, b].map(c => Math.max(0, c - amt).toString(16).padStart(2, '0')).join('');
}

function lighten(hex, amt) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return '#' + [r, g, b].map(c => Math.min(255, c + amt).toString(16).padStart(2, '0')).join('');
}

// 像素化文字（简单的位图字体）
const PX_FONT = {
  'A': ['01110','10001','10001','11111','10001','10001','10001'],
  'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'],
  'D': ['11110','10001','10001','10001','10001','10001','11110'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'],
  'F': ['11111','10000','10000','11110','10000','10000','10000'],
  'G': ['01110','10001','10000','10011','10001','10001','01110'],
  'H': ['10001','10001','10001','11111','10001','10001','10001'],
  'I': ['11111','00100','00100','00100','00100','00100','11111'],
  'J': ['00111','00010','00010','00010','00010','10010','01100'],
  'K': ['10001','10010','10100','11000','10100','10010','10001'],
  'L': ['10000','10000','10000','10000','10000','10000','11111'],
  'M': ['10001','11011','10101','10001','10001','10001','10001'],
  'N': ['10001','11001','10101','10011','10001','10001','10001'],
  'O': ['01110','10001','10001','10001','10001','10001','01110'],
  'P': ['11110','10001','10001','11110','10000','10000','10000'],
  'Q': ['01110','10001','10001','10001','10101','10010','01101'],
  'R': ['11110','10001','10001','11110','10100','10010','10001'],
  'S': ['01110','10001','10000','01110','00001','10001','01110'],
  'T': ['11111','00100','00100','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','10001','10001','01110'],
  'V': ['10001','10001','10001','10001','10001','01010','00100'],
  'W': ['10001','10001','10001','10101','11011','10001','10001'],
  'X': ['10001','10001','01010','00100','01010','10001','10001'],
  'Y': ['10001','10001','01010','00100','00100','00100','00100'],
  'Z': ['11111','00001','00010','00100','01000','10000','11111'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'],
  '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['01110','10000','10000','11110','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00010','01100'],
};

function pxText(pg, text, x, y, size, col) {
  text = text.toUpperCase();
  const s = Math.floor(size);
  let cx = Math.floor(x);
  pg.noStroke();
  pg.fill(col);
  for (const ch of text) {
    const glyph = PX_FONT[ch] || PX_FONT[' '];
    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < glyph[row].length; col++) {
        if (glyph[row][col] === '1') {
          pg.rect(cx + col * s, y + row * s, s, s);
        }
      }
    }
    cx += (glyph[0].length + 1) * s;
  }
}

// 像素化地面/山丘
function pxGround(pg, y, col, darkCol) {
  pg.noStroke();
  pg.fill(col);
  for (let x = 0; x < PX.W; x++) {
    const h = Math.floor(10 + 5 * Math.sin(x * 0.05) + 3 * Math.sin(x * 0.12));
    for (let py = 0; py < h; py++) {
      pg.point(x, y - py);
    }
  }
  // 暗边
  pg.fill(darkCol);
  for (let x = 0; x < PX.W; x++) {
    const h = Math.floor(10 + 5 * Math.sin(x * 0.05) + 3 * Math.sin(x * 0.12));
    pg.point(x, y - h);
    pg.point(x, y - h + 1);
  }
}
