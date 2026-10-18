// render_tide_faithful.js — 忠实复刻「潮汐」的像素风版本
// 包含所有细节：木质纹理角色、月亮行星、多种场景、表情变化

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PW = 480, PH = 270;
const FPS = 24;
const DUR = 56;
const TOTAL_FRAMES = Math.ceil(DUR * FPS);
const TAU = Math.PI * 2;

// 颜色定义
const C = {
  // 背景
  space: [26, 30, 62],
  spaceLight: [45, 50, 95],
  sunset: [255, 180, 140],
  sunsetDark: [200, 120, 100],
  sky: [180, 210, 230],
  ocean: [40, 60, 120],
  oceanDark: [25, 40, 85],
  
  // 月亮/行星
  moon: [180, 185, 200],
  moonDark: [120, 125, 140],
  moonCrater: [100, 105, 120],
  planetGreen: [90, 160, 90],
  planetGreenDark: [60, 120, 60],
  planetNight: [40, 60, 90],
  
  // 角色 - 橙色（木质）
  orange: [220, 130, 80],
  orangeDark: [180, 100, 60],
  orangeLight: [240, 160, 110],
  orangeOutline: [30, 25, 20],
  
  // 角色 - 粉色
  pink: [240, 150, 170],
  pinkDark: [200, 110, 130],
  pinkLight: [255, 180, 195],
  pinkOutline: [30, 25, 20],
  pinkBow: [220, 80, 110],
  
  // 地面
  grass: [120, 180, 100],
  grassDark: [80, 140, 70],
  ground: [100, 90, 80],
  
  // 特效
  star: [255, 255, 240],
  cloud: [220, 225, 230],
  rain: [150, 180, 220],
  firework1: [255, 180, 180],
  firework2: [255, 220, 150],
  firework3: [200, 180, 255],
  heart: [255, 100, 130],
  heartOrange: [255, 180, 100],
  
  // 字幕
  subtitleBg: [40, 35, 50],
  subtitleText: [255, 220, 150],
};

// 歌词时间轴（从视频提取）
const LYRICS = [
  { t: 0.0, text: "我们都是渺小真实存在" },
  { t: 5.0, text: "祈愿小世界里不只有挫败" },
  { t: 10.4, text: "直到遇见你我以为就光明起来" },
  { t: 15.0, text: "眼睛里看到的都是广袤无垠的大海" },
  { t: 20.0, text: "有你在的日子里不可能被取代" },
  { t: 25.0, text: "你让我学会如何拨开阴霾" },
  { t: 30.0, text: "只停在绽放一刹那" },
  { t: 35.4, text: "我却已无法自拔" },
  { t: 40.0, text: "我们的爱总有时差" },
  { t: 44.7, text: "爱炙热的你却忘了爱自己" },
  { t: 50.0, text: "潮汐不停息" },
];

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// 帧缓冲
function createFrame() {
  return new Uint8Array(PW * PH * 3);
}

function setPixel(buf, x, y, r, g, b) {
  if (x < 0 || x >= PW || y < 0 || y >= PH) return;
  const i = (y * PW + x) * 3;
  buf[i] = clamp(r, 0, 255); buf[i+1] = clamp(g, 0, 255); buf[i+2] = clamp(b, 0, 255);
}

function fillRect(buf, x, y, w, h, col) {
  x = Math.floor(x); y = Math.floor(y); w = Math.floor(w); h = Math.floor(h);
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPixel(buf, px, py, col[0], col[1], col[2]);
    }
  }
}

// 带纹理的木质方块角色
function drawWoodenBoxChar(buf, x, y, size, isPink, face, opts = {}) {
  const s = Math.floor(size);
  const bx = Math.floor(x) - s/2, by = Math.floor(y) - s/2;
  const col = isPink ? C.pink : C.orange;
  const colDark = isPink ? C.pinkDark : C.orangeDark;
  const colLight = isPink ? C.pinkLight : C.orangeLight;
  const outline = isPink ? C.pinkOutline : C.orangeOutline;
  
  // 主体（带木纹效果）
  fillRect(buf, bx, by, s, s, col);
  
  // 木纹纹理（水平条纹）
  for (let i = 0; i < 3; i++) {
    const ly = by + Math.floor(s * (0.25 + i * 0.25));
    for (let px = bx + 2; px < bx + s - 2; px++) {
      if (hash(px * 7 + ly * 13) > 0.6) {
        setPixel(buf, px, ly, colDark[0], colDark[1], colDark[2]);
      }
    }
  }
  
  // 粗黑轮廓
  for (let px = bx; px < bx + s; px++) {
    setPixel(buf, px, by, ...outline);
    setPixel(buf, px, by + s - 1, ...outline);
  }
  for (let py = by; py < by + s; py++) {
    setPixel(buf, bx, py, ...outline);
    setPixel(buf, bx + s - 1, py, ...outline);
  }
  
  // 亮边（左上）
  for (let px = bx + 1; px < bx + s - 1; px++) {
    setPixel(buf, px, by + 1, colLight[0], colLight[1], colLight[2]);
  }
  for (let py = by + 1; py < by + s - 1; py++) {
    setPixel(buf, bx + 1, py, colLight[0], colLight[1], colLight[2]);
  }
  
  // 暗边（右下）
  for (let px = bx + 1; px < bx + s - 1; px++) {
    setPixel(buf, px, by + s - 2, colDark[0], colDark[1], colDark[2]);
  }
  for (let py = by + 1; py < by + s - 1; py++) {
    setPixel(buf, bx + s - 2, py, colDark[0], colDark[1], colDark[2]);
  }
  
  // 脸
  const faceY = by + Math.floor(s * 0.4);
  const eyeSp = Math.floor(s * 0.2);
  const eyeSz = Math.max(3, Math.floor(s * 0.15));
  const eyeL = bx + Math.floor(s/2) - eyeSp - eyeSz;
  const eyeR = bx + Math.floor(s/2) + eyeSp;
  
  if (face === 'sad') {
    // 下垂眼 + 撇嘴
    fillRect(buf, eyeL, faceY, eyeSz, eyeSz, [30, 25, 20]);
    fillRect(buf, eyeR, faceY, eyeSz, eyeSz, [30, 25, 20]);
    // 撇嘴
    for (let px = bx + Math.floor(s/2) - 3; px < bx + Math.floor(s/2) + 3; px++) {
      setPixel(buf, px, faceY + eyeSz + 3, 30, 25, 20);
    }
  } else if (face === 'happy') {
    // 大眼睛 + 微笑
    fillRect(buf, eyeL, faceY, eyeSz, eyeSz, [30, 25, 20]);
    fillRect(buf, eyeR, faceY, eyeSz, eyeSz, [30, 25, 20]);
    // 眼睛高光
    setPixel(buf, eyeL + 1, faceY + 1, 255, 255, 255);
    setPixel(buf, eyeR + 1, faceY + 1, 255, 255, 255);
    // 微笑
    setPixel(buf, bx + Math.floor(s/2) - 2, faceY + eyeSz + 3, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2), faceY + eyeSz + 4, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2) + 2, faceY + eyeSz + 3, 30, 25, 20);
  } else if (face === 'surprised') {
    // 大圆眼 + O 形嘴
    for (let py = 0; py < eyeSz; py++) {
      for (let px = 0; px < eyeSz; px++) {
        if (px*px + py*py <= eyeSz*eyeSz) {
          setPixel(buf, eyeL + px, faceY + py, 30, 25, 20);
          setPixel(buf, eyeR + px, faceY + py, 30, 25, 20);
        }
      }
    }
    setPixel(buf, eyeL + 2, faceY + 2, 255, 255, 255);
    setPixel(buf, eyeR + 2, faceY + 2, 255, 255, 255);
    // O 形嘴
    setPixel(buf, bx + Math.floor(s/2) - 1, faceY + eyeSz + 3, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2), faceY + eyeSz + 3, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2) + 1, faceY + eyeSz + 3, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2) - 1, faceY + eyeSz + 4, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2) + 1, faceY + eyeSz + 4, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2), faceY + eyeSz + 5, 30, 25, 20);
  } else if (face === 'love') {
    // 爱心眼
    const drawHeart = (hx, hy, hs) => {
      setPixel(buf, hx-1, hy, 255, 100, 130); setPixel(buf, hx+1, hy, 255, 100, 130);
      setPixel(buf, hx-2, hy+1, 255, 100, 130); setPixel(buf, hx, hy+1, 255, 100, 130);
      setPixel(buf, hx+2, hy+1, 255, 100, 130);
      setPixel(buf, hx-1, hy+2, 255, 100, 130); setPixel(buf, hx+1, hy+2, 255, 100, 130);
      setPixel(buf, hx, hy+3, 255, 100, 130);
    };
    drawHeart(bx + Math.floor(s/2) - eyeSp, faceY + 1, 2);
    drawHeart(bx + Math.floor(s/2) + eyeSp, faceY + 1, 2);
    // 微笑
    setPixel(buf, bx + Math.floor(s/2) - 2, faceY + eyeSz + 3, 30, 25, 20);
    setPixel(buf, bx + Math.floor(s/2) + 2, faceY + eyeSz + 3, 30, 25, 20);
  }
  
  // 粉色角色的蝴蝶结
  if (isPink && opts.bow !== false) {
    const bowY = by - 4;
    const bowX = bx + Math.floor(s/2);
    // 左瓣
    fillRect(buf, bowX - 6, bowY, 5, 4, C.pinkBow);
    // 右瓣
    fillRect(buf, bowX + 1, bowY, 5, 4, C.pinkBow);
    // 中心
    fillRect(buf, bowX - 1, bowY + 1, 2, 2, [180, 60, 90]);
  }
  
  // 手（小矩形）
  if (opts.hands !== false) {
    const handY = by + Math.floor(s * 0.5);
    fillRect(buf, bx - 4, handY, 4, 5, col);
    fillRect(buf, bx + s, handY, 4, 5, col);
    // 手的轮廓
    setPixel(buf, bx - 4, handY, ...outline);
    setPixel(buf, bx + s + 3, handY, ...outline);
  }
  
  // 腿（4 条）
  if (opts.legs !== false) {
    const legY = by + s;
    const legW = Math.floor(s * 0.12);
    const legH = Math.floor(s * 0.2);
    const spacing = Math.floor(s * 0.2);
    for (let i = 0; i < 4; i++) {
      const lx = bx + Math.floor(s * 0.15) + i * spacing;
      fillRect(buf, lx, legY, legW, legH, colDark);
      setPixel(buf, lx, legY, ...outline);
      setPixel(buf, lx + legW - 1, legY, ...outline);
    }
  }
}

// 月亮/行星（带陨石坑）
function drawMoon(buf, cx, cy, r) {
  const cr = Math.floor(r);
  // 主体
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      if (px*px + py*py <= cr*cr) {
        // 光影效果
        const dist = Math.sqrt(px*px + py*py) / cr;
        const light = 1 - dist * 0.3;
        const col = [
          Math.floor(C.moon[0] * light),
          Math.floor(C.moon[1] * light),
          Math.floor(C.moon[2] * light)
        ];
        setPixel(buf, cx + px, cy + py, col[0], col[1], col[2]);
      }
    }
  }
  
  // 陨石坑
  const craters = [[-0.3, -0.2, 0.15], [0.2, 0.3, 0.12], [-0.1, 0.4, 0.1], [0.4, -0.1, 0.08]];
  for (const [ox, oy, os] of craters) {
    const kx = cx + Math.floor(ox * r);
    const ky = cy + Math.floor(oy * r);
    const kr = Math.floor(os * r);
    for (let py = -kr; py <= kr; py++) {
      for (let px = -kr; px <= kr; px++) {
        if (px*px + py*py <= kr*kr) {
          setPixel(buf, kx + px, ky + py, C.moonCrater[0], C.moonCrater[1], C.moonCrater[2]);
        }
      }
    }
  }
  
  // 轮廓
  for (let angle = 0; angle < TAU; angle += 0.05) {
    const px = cx + Math.floor(Math.cos(angle) * cr);
    const py = cy + Math.floor(Math.sin(angle) * cr);
    setPixel(buf, px, py, 30, 25, 20);
  }
}

// 绿色行星（昼夜半球）
function drawPlanet(buf, cx, cy, r, t) {
  const cr = Math.floor(r);
  const lightX = Math.cos(t * 0.1) * 0.2;
  
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      if (px*px + py*py <= cr*cr) {
        const b = (px/cr) * lightX + 0.5;
        if (b > 0.3) {
          // 昼半球（绿色）
          setPixel(buf, cx + px, cy + py, C.planetGreen[0], C.planetGreen[1], C.planetGreen[2]);
        } else {
          // 夜半球（深蓝）
          setPixel(buf, cx + px, cy + py, C.planetNight[0], C.planetNight[1], C.planetNight[2]);
        }
      }
    }
  }
  
  // 轮廓
  for (let angle = 0; angle < TAU; angle += 0.05) {
    const px = cx + Math.floor(Math.cos(angle) * cr);
    const py = cy + Math.floor(Math.sin(angle) * cr);
    setPixel(buf, px, py, 30, 25, 20);
  }
}

// 星星
function drawStar(buf, x, y, size, twinkle) {
  const s = Math.max(1, Math.floor(size));
  const a = 0.5 + 0.5 * Math.sin(twinkle);
  const alpha = a;
  const brightness = Math.floor(255 * alpha);
  const fx = Math.floor(x), fy = Math.floor(y);
  
  // 十字形
  for (let i = -s; i <= s; i++) {
    setPixel(buf, fx + i, fy, brightness, brightness, brightness - 20);
    setPixel(buf, fx, fy + i, brightness, brightness, brightness - 20);
  }
  if (s >= 2 && a > 0.7) {
    setPixel(buf, fx - s + 1, fy - 1, brightness, brightness, brightness);
    setPixel(buf, fx + s - 1, fy - 1, brightness, brightness, brightness);
    setPixel(buf, fx - s + 1, fy + 1, brightness, brightness, brightness);
    setPixel(buf, fx + s - 1, fy + 1, brightness, brightness, brightness);
  }
}

// 云朵
function drawCloud(buf, x, y, size) {
  const s = Math.floor(size);
  const col = C.cloud;
  // 主体
  fillRect(buf, x - s, y - s/3, s * 2, s * 0.6, col);
  fillRect(buf, x - s * 0.7, y - s * 0.7, s * 1.4, s * 0.5, col);
  // 轮廓
  for (let px = x - s; px < x + s; px++) {
    setPixel(buf, px, y - Math.floor(s/3), 30, 25, 20);
    setPixel(buf, px, y + Math.floor(s/3), 30, 25, 20);
  }
}

// 雨滴
function drawRain(buf, x, y, count) {
  for (let i = 0; i < count; i++) {
    const rx = x + (hash(i * 7) - 0.5) * 20;
    const ry = y + hash(i * 11) * 30;
    fillRect(buf, rx, ry, 1, 4, C.rain);
  }
}

// 小花
function drawFlower(buf, x, y, size) {
  const s = Math.floor(size);
  // 茎
  fillRect(buf, x, y, 1, s * 2, [80, 140, 60]);
  // 花瓣
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * TAU;
    const px = x + Math.floor(Math.cos(angle) * s);
    const py = y + Math.floor(Math.sin(angle) * s);
    setPixel(buf, px, py, 255, 255, 255);
  }
  // 中心
  setPixel(buf, x, y, 255, 200, 100);
}

// 烟花
function drawFirework(buf, x, y, radius, colors, t) {
  const n = 16;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * TAU + t * 0.3;
    const r = radius * (0.5 + 0.5 * Math.sin(t * 2 + i * 0.5));
    const col = colors[i % colors.length];
    
    // 射线
    for (let j = 0; j < Math.floor(r); j++) {
      const px = x + Math.floor(Math.cos(angle) * j);
      const py = y + Math.floor(Math.sin(angle) * j);
      const alpha = 1 - j / r;
      setPixel(buf, px, py, 
        Math.floor(col[0] * alpha), 
        Math.floor(col[1] * alpha), 
        Math.floor(col[2] * alpha)
      );
    }
    
    // 末端亮点
    const ex = x + Math.floor(Math.cos(angle) * r);
    const ey = y + Math.floor(Math.sin(angle) * r);
    setPixel(buf, ex, ey, 255, 255, 255);
  }
  
  // 中心亮光
  setPixel(buf, x, y, 255, 255, 255);
  setPixel(buf, x - 1, y, 255, 255, 255);
  setPixel(buf, x + 1, y, 255, 255, 255);
  setPixel(buf, x, y - 1, 255, 255, 255);
  setPixel(buf, x, y + 1, 255, 255, 255);
}

// 心形
function drawHeart(buf, x, y, size, col) {
  const s = Math.floor(size);
  // 左瓣
  for (let py = 0; py < s; py++) {
    for (let px = 0; px < s; px++) {
      if (px*px + py*py <= s*s) {
        setPixel(buf, x - s/2 + px, y - s/2 + py, col[0], col[1], col[2]);
      }
    }
  }
  // 右瓣
  for (let py = 0; py < s; py++) {
    for (let px = 0; px < s; px++) {
      if (px*px + py*py <= s*s) {
        setPixel(buf, x + px, y - s/2 + py, col[0], col[1], col[2]);
      }
    }
  }
  // 下部
  for (let py = 0; py < s; py++) {
    for (let px = 0; px < s * 2; px++) {
      const dx = px - s;
      const dy = py - s/2;
      if (dx*dx + dy*dy <= s*s) {
        setPixel(buf, x - s/2 + px, y + py, col[0], col[1], col[2]);
      }
    }
  }
}

// 字幕条
function drawSubtitle(buf, text, alpha) {
  if (!text) return;
  const barH = 16;
  const barY = PH - barH - 8;
  const barW = PW - 40;
  const barX = 20;
  
  // 背景
  fillRect(buf, barX, barY, barW, barH, C.subtitleBg);
  
  // 文字位置标记（用白色小方块表示）
  const textLen = text.length;
  const charW = 8;
  const startX = barX + (barW - textLen * charW) / 2;
  for (let i = 0; i < textLen; i++) {
    fillRect(buf, startX + i * charW, barY + 4, charW - 1, barH - 8, C.subtitleText);
  }
}

// 渐变背景
function fillGradient(buf, y0, y1, col0, col1) {
  for (let y = y0; y < y1; y++) {
    const k = (y - y0) / (y1 - y0);
    const r = Math.floor(lerp(col0[0], col1[0], k));
    const g = Math.floor(lerp(col0[1], col1[1], k));
    const b = Math.floor(lerp(col0[2], col1[2], k));
    for (let x = 0; x < PW; x++) setPixel(buf, x, y, r, g, b);
  }
}

// 地面（带草）
function drawGround(buf, y, col, darkCol) {
  const gc = col, dc = darkCol;
  // 填充地面
  for (let py = y; py < PH; py++) {
    for (let x = 0; x < PW; x++) setPixel(buf, x, py, gc[0], gc[1], gc[2]);
  }
  // 顶部轮廓（波浪形）
  for (let x = 0; x < PW; x++) {
    const h = Math.floor(6 + 3 * Math.sin(x * 0.05) + 2 * Math.sin(x * 0.12));
    setPixel(buf, x, y - h, dc[0], dc[1], dc[2]);
    setPixel(buf, x, y - h + 1, dc[0], dc[1], dc[2]);
  }
  // 草
  for (let x = 0; x < PW; x += 8) {
    const h = Math.floor(6 + 3 * Math.sin(x * 0.05));
    setPixel(buf, x, y - h - 2, dc[0], dc[1], dc[2]);
    setPixel(buf, x + 1, y - h - 3, dc[0], dc[1], dc[2]);
  }
}

// Shot 渲染函数
function shot1(buf, t, lt, dur) {
  // 镜头 1: 小角色站在大月亮上，镜头推进
  const progress = lt / dur;
  
  // 太空背景
  fillGradient(buf, 0, PH, C.space, C.spaceLight);
  
  // 星星
  for (let i = 0; i < 50; i++) {
    drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.7, hash(i*11+2)>0.8?2:1, t*(1+hash(i*5))*2+i);
  }
  
  // 月亮（从小到大）
  const moonR = lerp(60, 120, easeOut(progress));
  drawMoon(buf, PW/2, PH*0.6, moonR);
  
  // 角色（在月亮顶部）
  const charSize = lerp(8, 20, easeOut(progress));
  const charY = PH*0.6 - moonR - charSize/2;
  drawWoodenBoxChar(buf, PW/2, charY, charSize, false, progress < 0.5 ? 'sad' : 'happy', { legs: true });
  
  // 小花
  if (progress > 0.3) {
    drawFlower(buf, PW/2 + 30, charY + charSize, 3);
  }
  
  // 云和雨
  if (progress > 0.4 && progress < 0.8) {
    drawCloud(buf, PW/2 - 20, charY - 30, 8);
    if (progress > 0.6) drawRain(buf, PW/2 - 20, charY - 20, 5);
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t-lyric.t)/0.5, 0, 1) * clamp((lyric.t+4.5-t)/0.5, 0, 1) : 0;
  drawSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot2(buf, t, lt, dur) {
  // 镜头 2: 两个角色在绿色山丘上，温暖背景
  const progress = lt / dur;
  
  // 温暖渐变背景
  fillGradient(buf, 0, PH*0.7, C.sunset, C.sunsetDark);
  
  // 绿色山丘
  drawGround(buf, Math.floor(PH*0.7), C.grass, C.grassDark);
  
  // 两个角色
  const cs = 18;
  drawWoodenBoxChar(buf, PW*0.42, PH*0.7 - cs/2 - 4, cs, false, 'happy', { bow: false });
  drawWoodenBoxChar(buf, PW*0.58, PH*0.7 - cs/2 - 4, cs, true, 'happy', { bow: true });
  
  // 花
  drawFlower(buf, PW*0.5, PH*0.7 - 20, 4);
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t-lyric.t)/0.5, 0, 1) * clamp((lyric.t+4.5-t)/0.5, 0, 1) : 0;
  drawSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot3(buf, t, lt, dur) {
  // 镜头 3: 多种场景（心形、阳光、烟花、海洋）
  const progress = lt / dur;
  
  if (progress < 0.25) {
    // 心形场景
    fillGradient(buf, 0, PH*0.7, C.sky, [200, 220, 240]);
    drawGround(buf, Math.floor(PH*0.7), C.grass, C.grassDark);
    
    const cs = 20;
    drawWoodenBoxChar(buf, PW*0.35, PH*0.7 - cs/2 - 4, cs, false, 'happy', { bow: false });
    drawWoodenBoxChar(buf, PW*0.65, PH*0.7 - cs/2 - 4, cs, true, 'happy', { bow: true });
    
    // 中间心形
    drawHeart(buf, PW/2, PH*0.5, 15, C.heart);
    
  } else if (progress < 0.5) {
    // 阳光场景
    fillGradient(buf, 0, PH*0.7, C.sky, [220, 230, 240]);
    drawGround(buf, Math.floor(PH*0.7), C.grass, C.grassDark);
    
    // 阳光光束
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI/2 + (i - 2) * 0.2;
      for (let j = 0; j < 100; j++) {
        const px = PW/2 + Math.floor(Math.cos(angle) * j);
        const py = Math.floor(PH*0.3 + Math.sin(angle) * j * 0.5);
        if (py > 0 && py < PH*0.7) {
          setPixel(buf, px, py, 255, 255, 200);
        }
      }
    }
    
    const cs = 20;
    drawWoodenBoxChar(buf, PW*0.45, PH*0.7 - cs/2 - 4, cs, false, 'surprised', { bow: false });
    drawWoodenBoxChar(buf, PW*0.55, PH*0.7 - cs/2 - 4, cs, true, 'happy', { bow: true });
    
  } else if (progress < 0.75) {
    // 烟花场景
    fillGradient(buf, 0, PH*0.7, C.space, C.spaceLight);
    drawGround(buf, Math.floor(PH*0.7), C.grass, C.grassDark);
    
    for (let i = 0; i < 30; i++) {
      drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.5, 1, C.star, t*2+i);
    }
    
    const colors = [C.firework1, C.firework2, C.firework3];
    for (let i = 0; i < 3; i++) {
      drawFirework(buf, PW*(0.3+i*0.2), PH*(0.3+i*0.05), 30, colors, t+i*0.5);
    }
    
    const cs = 18;
    drawWoodenBoxChar(buf, PW*0.42, PH*0.7 - cs/2 - 4, cs, false, 'love', { bow: false });
    drawWoodenBoxChar(buf, PW*0.58, PH*0.7 - cs/2 - 4, cs, true, 'love', { bow: true });
    
  } else {
    // 海洋场景
    fillGradient(buf, 0, PH*0.5, C.space, C.spaceLight);
    fillGradient(buf, Math.floor(PH*0.5), PH, C.ocean, C.oceanDark);
    
    // 海平面
    for (let x = 0; x < PW; x++) {
      const h = Math.floor(2 * Math.sin(x * 0.03 + t));
      setPixel(buf, x, Math.floor(PH*0.5) + h, 200, 200, 220);
    }
    
    const cs = 22;
    drawWoodenBoxChar(buf, PW*0.5, PH*0.5 - cs/2, cs, false, 'love', { bow: false, legs: false });
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t-lyric.t)/0.5, 0, 1) * clamp((lyric.t+4.5-t)/0.5, 0, 1) : 0;
  drawSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot4(buf, t, lt, dur) {
  // 镜头 4: 快速过渡
  const progress = lt / dur;
  const flash = progress < 0.3 ? easeOut(progress/0.3) : 1 - ease((progress-0.3)/0.7);
  const b = Math.floor(flash * 100);
  fillGradient(buf, 0, PH, [26+b, 30+b, 62+b], [45+b, 50+b, 95+b]);
  
  for (let i = 0; i < 20; i++) {
    if (hash(i*17+Math.floor(t*10)) > 0.5) {
      drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.6, 2, C.star, t*10+i);
    }
  }
}

function shot5(buf, t, lt, dur) {
  // 镜头 5: 角色在海洋中，心形眼
  const progress = lt / dur;
  
  fillGradient(buf, 0, PH*0.4, C.space, C.spaceLight);
  fillGradient(buf, Math.floor(PH*0.4), PH, C.ocean, C.oceanDark);
  
  // 星星
  for (let i = 0; i < 40; i++) {
    drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.4, 1, C.star, t*2+i);
  }
  
  // 海平面
  for (let x = 0; x < PW; x++) {
    const h = Math.floor(3 * Math.sin(x * 0.02 + t * 0.5));
    setPixel(buf, x, Math.floor(PH*0.4) + h, 200, 200, 220);
  }
  
  // 角色（半身在水中）
  const cs = 24;
  drawWoodenBoxChar(buf, PW*0.5, PH*0.4 - cs/4, cs, false, 'love', { bow: false, legs: false });
  
  // 水面波纹
  for (let i = 0; i < 3; i++) {
    const rx = PW*0.5 + (i - 1) * 30;
    const ry = PH*0.4 + 5;
    for (let px = -20; px < 20; px++) {
      const py = Math.floor(3 * Math.sin(px * 0.3 + t + i));
      setPixel(buf, rx + px, ry + py, 180, 200, 220);
    }
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t-lyric.t)/0.5, 0, 1) * clamp((lyric.t+4.5-t)/0.5, 0, 1) : 0;
  drawSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot6(buf, t, lt, dur) {
  // 镜头 6: 行星昼夜半球，两个角色在两侧
  const progress = lt / dur;
  
  // 背景（左昼右夜）
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW/2; x++) {
      const k = x / (PW/2);
      setPixel(buf, x, y, 
        Math.floor(lerp(180, 220, k)), 
        Math.floor(lerp(210, 230, k)), 
        Math.floor(lerp(230, 240, k))
      );
    }
    for (let x = PW/2; x < PW; x++) {
      const k = (x - PW/2) / (PW/2);
      setPixel(buf, x, y, 
        Math.floor(lerp(40, 26, k)), 
        Math.floor(lerp(60, 30, k)), 
        Math.floor(lerp(90, 62, k))
      );
    }
  }
  
  // 行星（昼夜半球）
  drawPlanet(buf, PW/2, PH*0.5, 60, t);
  
  // 太阳（左）
  const sunX = PW*0.15;
  const sunY = PH*0.2;
  for (let py = -15; py <= 15; py++) {
    for (let px = -15; px <= 15; px++) {
      if (px*px + py*py <= 225) {
        setPixel(buf, sunX + px, sunY + py, 255, 220, 150);
      }
    }
  }
  
  // 月亮（右）
  drawMoon(buf, PW*0.85, PH*0.2, 12);
  
  // 两个角色
  const cs = 16;
  drawWoodenBoxChar(buf, PW*0.3, PH*0.5 - 60 - cs/2, cs, true, 'sleep', { bow: true });
  drawWoodenBoxChar(buf, PW*0.7, PH*0.5 - 60 - cs/2, cs, false, 'sad', { bow: false });
  
  // Zzz
  if (progress > 0.3) {
    setPixel(buf, PW*0.3 + 15, PH*0.5 - 80, 255, 255, 255);
    setPixel(buf, PW*0.3 + 17, PH*0.5 - 82, 255, 255, 255);
    setPixel(buf, PW*0.3 + 19, PH*0.5 - 84, 255, 255, 255);
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t-lyric.t)/0.5, 0, 1) * clamp((lyric.t+4.5-t)/0.5, 0, 1) : 0;
  drawSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot7(buf, t, lt, dur) {
  // 镜头 7: 角色独自行星上，破碎的心
  const progress = lt / dur;
  
  fillGradient(buf, 0, PH, C.space, C.spaceLight);
  
  for (let i = 0; i < 50; i++) {
    drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.6, 1, C.star, t*2+i);
  }
  
  // 小行星
  const planetR = lerp(40, 60, easeOut(progress));
  drawMoon(buf, PW/2, PH*0.6, planetR);
  
  // 角色
  const cs = lerp(16, 20, easeOut(progress));
  const charY = PH*0.6 - planetR - cs/2;
  drawWoodenBoxChar(buf, PW*0.5, charY, cs, false, 'surprised', { bow: false });
  
  // 花
  drawFlower(buf, PW*0.5 + 25, charY + cs, 3);
  
  // 破碎的心（天空）
  if (progress > 0.3) {
    const heartY = PH*0.2 + Math.sin(t) * 5;
    // 左半（橙色）
    for (let py = 0; py < 10; py++) {
      for (let px = 0; px < 8; px++) {
        if (px*px + py*py <= 64) {
          setPixel(buf, PW*0.5 - 15 + px, heartY + py, C.heartOrange[0], C.heartOrange[1], C.heartOrange[2]);
        }
      }
    }
    // 右半（粉色）
    for (let py = 0; py < 10; py++) {
      for (let px = 0; px < 8; px++) {
        if (px*px + py*py <= 64) {
          setPixel(buf, PW*0.5 + 7 + px, heartY + py, C.heart[0], C.heart[1], C.heart[2]);
        }
      }
    }
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t-lyric.t)/0.5, 0, 1) * clamp((lyric.t+4.5-t)/0.5, 0, 1) : 0;
  drawSubtitle(buf, lyric ? lyric.text : '', la);
}

const shotFns = [shot1, shot2, shot3, shot4, shot5, shot6, shot7];
const shotTimes = [0, 10.42, 13.54, 35.42, 42.71, 44.67, 56.00];

function renderFrame(frameNum) {
  const t = frameNum / FPS;
  const buf = createFrame();
  
  let si = 0;
  for (let i = shotTimes.length - 1; i >= 0; i--) {
    if (t >= shotTimes[i]) { si = i; break; }
  }
  const t0 = shotTimes[si];
  const lt = t - t0;
  const nextT = si + 1 < shotTimes.length ? shotTimes[si + 1] : DUR;
  const dur = nextT - t0;
  
  shotFns[si](buf, t, lt, dur);
  return buf;
}

// 放大帧
function upscaleFrame(buf, scale) {
  const w = PW * scale, h = PH * scale;
  const out = new Uint8Array(w * h * 3);
  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      const px = Math.floor(sx / scale);
      const py = Math.floor(sy / scale);
      const si = (py * PW + px) * 3;
      const di = (sy * w + sx) * 3;
      out[di] = buf[si]; out[di+1] = buf[si+1]; out[di+2] = buf[si+2];
    }
  }
  return out;
}

// 主渲染
const FFMPEG = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const OUTPUT = path.join(__dirname, 'out', 'tide_pixel_faithful.mp4');
const SCALE = 4;
const OUT_W = PW * SCALE, OUT_H = PH * SCALE;

fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });

const ffmpeg = spawn(FFMPEG, [
  '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${OUT_W}x${OUT_H}`, '-r', String(FPS),
  '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-y', OUTPUT
]);

let frameCount = 0;
const totalFrames = Math.ceil(DUR * FPS);
const startTime = Date.now();

process.stdout.write(`渲染 ${totalFrames} 帧 (${DUR}s @ ${FPS}fps) → ${OUT_W}x${OUT_H}...\n`);

function renderNext() {
  if (frameCount >= totalFrames) { ffmpeg.stdin.end(); return; }
  
  const buf = renderFrame(frameCount);
  const upscaled = upscaleFrame(buf, SCALE);
  const canWrite = ffmpeg.stdin.write(Buffer.from(upscaled.buffer));
  
  frameCount++;
  if (frameCount % 24 === 0) {
    const elapsed = (Date.now() - startTime) / 1000;
    const fps = frameCount / elapsed;
    const pct = (frameCount / totalFrames * 100).toFixed(1);
    process.stdout.write(`\r帧: ${frameCount}/${totalFrames} (${pct}%) ${fps.toFixed(1)} fps`);
  }
  
  if (canWrite) setImmediate(renderNext);
  else ffmpeg.stdin.once('drain', renderNext);
}

ffmpeg.on('close', code => {
  process.stdout.write(`\n完成! 输出: ${OUTPUT}\n`);
  process.stdout.write(`文件大小: ${(fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1)} MB\n`);
  process.exit(code);
});

ffmpeg.on('error', err => { console.error('ffmpeg 错误:', err.message); process.exit(1); });

renderNext();
