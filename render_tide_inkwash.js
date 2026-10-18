// render_tide_inkwash.js — 水墨风重新诠释「潮汐」
// 不是复制原视频，而是用水墨风格重新讲述同一个故事
// 方块小人 → 写意水墨人物
// 月亮行星 → 水墨晕染的圆形
// 烟花 → 墨点飞溅
// 草地 → 留白中的几笔淡墨

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PW = 480, PH = 270;
const FPS = 24;
const DUR = 56;
const TOTAL_FRAMES = Math.ceil(DUR * FPS);
const TAU = Math.PI * 2;

// 水墨调色板（墨分五色 + 朱砂）
const INK = {
  paper: [242, 236, 222],        // 宣纸底色
  jiao: [26, 20, 24],            // 焦墨（最深）
  nong: [45, 36, 42],            // 浓墨
  zhong: [74, 63, 68],           // 重墨
  dan: [122, 110, 114],          // 淡墨
  qing: [176, 166, 169],         // 清墨（最淡）
  vermilion: [176, 46, 34],      // 朱砂（唯一彩色）
  mist: [200, 195, 188],         // 雾气
};

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

function createFrame() {
  return new Uint8Array(PW * PH * 3);
}

function setPixel(buf, x, y, r, g, b) {
  if (x < 0 || x >= PW || y < 0 || y >= PH) return;
  const i = (y * PW + x) * 3;
  buf[i] = clamp(r, 0, 255); buf[i+1] = clamp(g, 0, 255); buf[i+2] = clamp(b, 0, 255);
}

// 宣纸纹理
function drawPaper(buf) {
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const noise = (hash(x * 7 + y * 13) - 0.5) * 8;
      const fiber = Math.sin(x * 0.3 + y * 0.1) * 2;
      const r = INK.paper[0] + noise + fiber;
      const g = INK.paper[1] + noise + fiber;
      const b = INK.paper[2] + noise + fiber * 0.5;
      setPixel(buf, x, y, r, g, b);
    }
  }
}

// 水墨笔触（带压力变化和飞白）
function drawBrushStroke(buf, x0, y0, x1, y1, thickness, inkLevel, dryness) {
  const dx = x1 - x0, dy = y1 - y0;
  const dist = Math.sqrt(dx*dx + dy*dy);
  const steps = Math.max(1, Math.floor(dist));
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.floor(lerp(x0, x1, t));
    const y = Math.floor(lerp(y0, y1, t));
    
    // 压力变化（中间粗两端细）
    const pressure = Math.sin(t * Math.PI);
    const r = Math.floor(thickness * pressure);
    
    // 墨量递减（飞白效果）
    const currentInk = inkLevel * (1 - t * dryness * 0.5);
    
    for (let py = -r; py <= r; py++) {
      for (let px = -r; px <= r; px++) {
        if (px*px + py*py <= r*r) {
          // 随机飞白
          if (hash(x * 31 + py * 17 + i) > currentInk) continue;
          
          const dist2 = Math.sqrt(px*px + py*py) / Math.max(1, r);
          const alpha = 1 - dist2 * 0.5;
          const col = [
            Math.floor(INK.nong[0] * alpha + INK.paper[0] * (1-alpha)),
            Math.floor(INK.nong[1] * alpha + INK.paper[1] * (1-alpha)),
            Math.floor(INK.nong[2] * alpha + INK.paper[2] * (1-alpha))
          ];
          setPixel(buf, x + px, y + py, col[0], col[1], col[2]);
        }
      }
    }
  }
}

// 水墨晕染（圆形扩散）
function drawInkBloom(buf, cx, cy, radius, tone) {
  const col = INK[tone] || INK.dan;
  for (let py = -radius; py <= radius; py++) {
    for (let px = -radius; px <= radius; px++) {
      const dist = Math.sqrt(px*px + py*py);
      if (dist <= radius) {
        const alpha = Math.pow(1 - dist/radius, 1.5);
        const r = Math.floor(col[0] * alpha + INK.paper[0] * (1-alpha));
        const g = Math.floor(col[1] * alpha + INK.paper[1] * (1-alpha));
        const b = Math.floor(col[2] * alpha + INK.paper[2] * (1-alpha));
        setPixel(buf, cx + px, cy + py, r, g, b);
      }
    }
  }
}

// 写意人物（简约几笔）
function drawXieyiFigure(buf, x, y, size, mood, t) {
  const s = Math.floor(size);
  
  // 身体（一笔浓墨）
  drawBrushStroke(buf, x - s*0.3, y - s*0.4, x + s*0.3, y + s*0.4, s*0.4, 0.9, 0.3);
  
  // 头部（淡墨圆）
  drawInkBloom(buf, x, y - s*0.5, s*0.25, 'dan');
  
  // 眼睛（两点焦墨）
  if (mood === 'happy' || mood === 'love') {
    setPixel(buf, x - 3, y - s*0.5, ...INK.jiao);
    setPixel(buf, x + 3, y - s*0.5, ...INK.jiao);
  } else if (mood === 'sad') {
    // 下垂
    drawBrushStroke(buf, x - 4, y - s*0.5 - 1, x - 2, y - s*0.5 + 1, 1, 0.95, 0);
    drawBrushStroke(buf, x + 2, y - s*0.5 + 1, x + 4, y - s*0.5 - 1, 1, 0.95, 0);
  }
  
  // 手臂（两笔淡墨）
  const armWave = Math.sin(t * 2) * 0.1;
  drawBrushStroke(buf, x - s*0.3, y, x - s*0.6, y + s*0.3 + armWave*10, s*0.15, 0.7, 0.4);
  drawBrushStroke(buf, x + s*0.3, y, x + s*0.6, y + s*0.3 - armWave*10, s*0.15, 0.7, 0.4);
  
  // 腿（两笔重墨）
  drawBrushStroke(buf, x - s*0.15, y + s*0.4, x - s*0.2, y + s*0.7, s*0.12, 0.8, 0.2);
  drawBrushStroke(buf, x + s*0.15, y + s*0.4, x + s*0.2, y + s*0.7, s*0.12, 0.8, 0.2);
  
  // 朱砂印章（角色标记）
  if (mood === 'love') {
    drawInkBloom(buf, x + s*0.5, y - s*0.6, 4, 'vermilion');
  }
}

// 水墨月亮（晕染 + 留白）
function drawInkMoon(buf, cx, cy, radius) {
  // 外晕（清墨）
  drawInkBloom(buf, cx, cy, radius * 1.3, 'qing');
  // 主体（淡墨）
  drawInkBloom(buf, cx, cy, radius, 'dan');
  // 中心留白（不画 = 纸色）
  // 边缘几笔浓墨勾勒
  for (let angle = 0; angle < TAU; angle += 0.2) {
    const x = cx + Math.floor(Math.cos(angle) * radius);
    const y = cy + Math.floor(Math.sin(angle) * radius);
    drawBrushStroke(buf, x - 2, y, x + 2, y, 1, 0.9, 0);
  }
}

// 水墨星星（点苔）
function drawInkStar(buf, x, y, size, twinkle) {
  const s = Math.max(1, Math.floor(size));
  const alpha = 0.5 + 0.5 * Math.sin(twinkle);
  const col = [
    Math.floor(INK.jiao[0] * alpha + INK.paper[0] * (1-alpha)),
    Math.floor(INK.jiao[1] * alpha + INK.paper[1] * (1-alpha)),
    Math.floor(INK.jiao[2] * alpha + INK.paper[2] * (1-alpha))
  ];
  // 苔点式星星
  setPixel(buf, x, y, col[0], col[1], col[2]);
  if (s >= 2) {
    setPixel(buf, x - 1, y, col[0], col[1], col[2]);
    setPixel(buf, x + 1, y, col[0], col[1], col[2]);
    setPixel(buf, x, y - 1, col[0], col[1], col[2]);
    setPixel(buf, x, y + 1, col[0], col[1], col[2]);
  }
}

// 水墨山丘（几笔淡墨）
function drawInkHill(buf, y, tone) {
  const col = INK[tone] || INK.dan;
  // 山形轮廓（一波三折）
  for (let x = 0; x < PW; x++) {
    const h = Math.floor(20 + 15 * Math.sin(x * 0.02) + 8 * Math.sin(x * 0.05));
    const alpha = 0.3 + 0.2 * Math.sin(x * 0.01);
    const r = Math.floor(col[0] * alpha + INK.paper[0] * (1-alpha));
    const g = Math.floor(col[1] * alpha + INK.paper[1] * (1-alpha));
    const b = Math.floor(col[2] * alpha + INK.paper[2] * (1-alpha));
    for (let py = 0; py < h; py++) {
      setPixel(buf, x, y - py, r, g, b);
    }
  }
}

// 水墨烟花（墨点飞溅）
function drawInkFirework(buf, x, y, radius, t) {
  const n = 12;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * TAU + t * 0.2;
    const r = radius * (0.6 + 0.4 * Math.sin(t * 3 + i));
    
    // 飞白射线
    const ex = x + Math.floor(Math.cos(angle) * r);
    const ey = y + Math.floor(Math.sin(angle) * r);
    drawBrushStroke(buf, x, y, ex, ey, 2, 0.8, 0.6);
    
    // 末端苔点
    drawInkBloom(buf, ex, ey, 3, 'jiao');
  }
  
  // 中心浓墨点
  drawInkBloom(buf, x, y, 5, 'nong');
}

// 水墨心形（朱砂）
function drawInkHeart(buf, x, y, size) {
  const s = Math.floor(size);
  // 左瓣
  drawInkBloom(buf, x - s/2, y, s/2, 'vermilion');
  // 右瓣
  drawInkBloom(buf, x + s/2, y, s/2, 'vermilion');
  // 下部
  for (let py = 0; py < s; py++) {
    for (let px = 0; px < s; px++) {
      const dx = px - s/2;
      const dy = py;
      if (dx*dx + dy*dy <= s*s) {
        const alpha = 0.7;
        const r = Math.floor(INK.vermilion[0] * alpha + INK.paper[0] * (1-alpha));
        const g = Math.floor(INK.vermilion[1] * alpha + INK.paper[1] * (1-alpha));
        const b = Math.floor(INK.vermilion[2] * alpha + INK.paper[2] * (1-alpha));
        setPixel(buf, x - s/2 + px, y + py, r, g, b);
      }
    }
  }
}

// 云雾（淡墨晕染）
function drawInkCloud(buf, x, y, size) {
  drawInkBloom(buf, x, y, size, 'qing');
  drawInkBloom(buf, x - size*0.5, y + 2, size*0.7, 'qing');
  drawInkBloom(buf, x + size*0.5, y + 2, size*0.7, 'qing');
}

// 雨滴（细笔）
function drawInkRain(buf, x, y, count) {
  for (let i = 0; i < count; i++) {
    const rx = x + (hash(i * 7) - 0.5) * 30;
    const ry = y + hash(i * 11) * 40;
    drawBrushStroke(buf, rx, ry, rx - 2, ry + 8, 1, 0.7, 0.3);
  }
}

// 小花（写意）
function drawInkFlower(buf, x, y, size) {
  // 茎（一笔）
  drawBrushStroke(buf, x, y, x, y + size * 2, 1, 0.8, 0.2);
  // 花瓣（点苔）
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * TAU;
    const px = x + Math.floor(Math.cos(angle) * size);
    const py = y + Math.floor(Math.sin(angle) * size);
    drawInkBloom(buf, px, py, 2, 'dan');
  }
  // 花心（朱砂点）
  setPixel(buf, x, y, ...INK.vermilion);
}

// 字幕（书法风格标记）
function drawInkSubtitle(buf, text, alpha) {
  if (!text) return;
  const barH = 14;
  const barY = PH - barH - 6;
  const barW = PW - 60;
  const barX = 30;
  
  // 淡墨底
  for (let y = barY; y < barY + barH; y++) {
    for (let x = barX; x < barX + barW; x++) {
      const alpha2 = 0.15 * alpha;
      const r = Math.floor(INK.jiao[0] * alpha2 + INK.paper[0] * (1-alpha2));
      const g = Math.floor(INK.jiao[1] * alpha2 + INK.paper[1] * (1-alpha2));
      const b = Math.floor(INK.jiao[2] * alpha2 + INK.paper[2] * (1-alpha2));
      setPixel(buf, x, y, r, g, b);
    }
  }
  
  // 文字位置（朱砂小方块表示）
  const textLen = text.length;
  const charW = 7;
  const startX = barX + (barW - textLen * charW) / 2;
  for (let i = 0; i < textLen; i++) {
    const alpha2 = alpha;
    const r = Math.floor(INK.vermilion[0] * alpha2 + INK.paper[0] * (1-alpha2));
    const g = Math.floor(INK.vermilion[1] * alpha2 + INK.paper[1] * (1-alpha2));
    const b = Math.floor(INK.vermilion[2] * alpha2 + INK.paper[2] * (1-alpha2));
    for (let py = 0; py < barH - 6; py++) {
      for (let px = 0; px < charW - 1; px++) {
        setPixel(buf, startX + i * charW + px, barY + 3 + py, r, g, b);
      }
    }
  }
}

// Shot 渲染
function shot1(buf, t, lt, dur) {
  // 镜头 1: 小人物站在大月亮上，渺小的存在
  const progress = lt / dur;
  
  drawPaper(buf);
  
  // 远山（淡墨）
  drawInkHill(buf, Math.floor(PH * 0.75), 'qing');
  
  // 大月亮（晕染）
  const moonR = lerp(50, 100, easeOut(progress));
  drawInkMoon(buf, PW / 2, PH * 0.55, moonR);
  
  // 小人物（写意）
  const charSize = lerp(6, 14, easeOut(progress));
  const charY = PH * 0.55 - moonR - charSize * 0.7;
  drawXieyiFigure(buf, PW / 2, charY, charSize, progress < 0.5 ? 'sad' : 'happy', t);
  
  // 小花
  if (progress > 0.3) {
    drawInkFlower(buf, PW / 2 + 20, charY + charSize, 2);
  }
  
  // 云雨
  if (progress > 0.4 && progress < 0.8) {
    drawInkCloud(buf, PW / 2 - 15, charY - 25, 10);
    if (progress > 0.6) drawInkRain(buf, PW / 2 - 15, charY - 15, 4);
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
  drawInkSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot2(buf, t, lt, dur) {
  // 镜头 2: 两个角色相遇，温暖
  const progress = lt / dur;
  
  drawPaper(buf);
  
  // 暖色晕染背景（淡朱砂）
  for (let y = 0; y < PH * 0.7; y++) {
    for (let x = 0; x < PW; x++) {
      const k = y / (PH * 0.7);
      const alpha = 0.08 * (1 - k);
      const r = Math.floor(INK.vermilion[0] * alpha + INK.paper[0] * (1 - alpha));
      const g = Math.floor(INK.vermilion[1] * alpha + INK.paper[1] * (1 - alpha));
      const b = Math.floor(INK.vermilion[2] * alpha + INK.paper[2] * (1 - alpha));
      setPixel(buf, x, y, r, g, b);
    }
  }
  
  // 绿色山丘（淡墨）
  drawInkHill(buf, Math.floor(PH * 0.72), 'dan');
  
  // 两个角色
  const cs = 12;
  drawXieyiFigure(buf, PW * 0.42, PH * 0.72 - cs * 0.7, cs, 'happy', t);
  drawXieyiFigure(buf, PW * 0.58, PH * 0.72 - cs * 0.7, cs, 'love', t);
  
  // 花
  drawInkFlower(buf, PW * 0.5, PH * 0.72 - 15, 3);
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
  drawInkSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot3(buf, t, lt, dur) {
  // 镜头 3: 多场景（心形、阳光、烟花、海洋）
  const progress = lt / dur;
  
  drawPaper(buf);
  
  if (progress < 0.25) {
    // 心形场景
    drawInkHill(buf, Math.floor(PH * 0.72), 'dan');
    const cs = 12;
    drawXieyiFigure(buf, PW * 0.35, PH * 0.72 - cs * 0.7, cs, 'happy', t);
    drawXieyiFigure(buf, PW * 0.65, PH * 0.72 - cs * 0.7, cs, 'love', t);
    drawInkHeart(buf, PW / 2, PH * 0.5, 12);
    
  } else if (progress < 0.5) {
    // 阳光（留白中的光）
    drawInkHill(buf, Math.floor(PH * 0.72), 'dan');
    
    // 光束（淡墨放射）
    for (let i = 0; i < 7; i++) {
      const angle = -Math.PI / 2 + (i - 3) * 0.15;
      for (let j = 0; j < 80; j++) {
        const px = PW / 2 + Math.floor(Math.cos(angle) * j);
        const py = Math.floor(PH * 0.25 + Math.sin(angle) * j * 0.5);
        if (py > 0 && py < PH * 0.72) {
          const alpha = 0.1 * (1 - j / 80);
          const r = Math.floor(INK.paper[0] + (255 - INK.paper[0]) * alpha);
          const g = Math.floor(INK.paper[1] + (255 - INK.paper[1]) * alpha);
          const b = Math.floor(INK.paper[2] + (250 - INK.paper[2]) * alpha);
          setPixel(buf, px, py, r, g, b);
        }
      }
    }
    
    const cs = 12;
    drawXieyiFigure(buf, PW * 0.45, PH * 0.72 - cs * 0.7, cs, 'happy', t);
    drawXieyiFigure(buf, PW * 0.55, PH * 0.72 - cs * 0.7, cs, 'happy', t);
    
  } else if (progress < 0.75) {
    // 烟花（墨点飞溅）
    for (let i = 0; i < 20; i++) {
      drawInkStar(buf, hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.5, 1, t * 2 + i);
    }
    
    for (let i = 0; i < 3; i++) {
      drawInkFirework(buf, PW * (0.3 + i * 0.2), PH * (0.3 + i * 0.05), 25, t + i * 0.5);
    }
    
    const cs = 12;
    drawXieyiFigure(buf, PW * 0.42, PH * 0.72 - cs * 0.7, cs, 'love', t);
    drawXieyiFigure(buf, PW * 0.58, PH * 0.72 - cs * 0.7, cs, 'love', t);
    
  } else {
    // 海洋（大片留白 + 几笔淡墨）
    for (let y = Math.floor(PH * 0.5); y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        const k = (y - PH * 0.5) / (PH * 0.5);
        const alpha = 0.15 * k;
        const r = Math.floor(INK.dan[0] * alpha + INK.paper[0] * (1 - alpha));
        const g = Math.floor(INK.dan[1] * alpha + INK.paper[1] * (1 - alpha));
        const b = Math.floor(INK.dan[2] * alpha + INK.paper[2] * (1 - alpha));
        setPixel(buf, x, y, r, g, b);
      }
    }
    
    // 海平面（一笔）
    for (let x = 0; x < PW; x++) {
      const h = Math.floor(2 * Math.sin(x * 0.03 + t));
      setPixel(buf, x, Math.floor(PH * 0.5) + h, ...INK.zhong);
    }
    
    const cs = 14;
    drawXieyiFigure(buf, PW * 0.5, PH * 0.5 - cs * 0.3, cs, 'love', t);
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
  drawInkSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot4(buf, t, lt, dur) {
  // 镜头 4: 过渡（墨晕扩散）
  const progress = lt / dur;
  
  drawPaper(buf);
  
  // 墨晕扩散
  const bloomR = progress * 150;
  drawInkBloom(buf, PW / 2, PH / 2, bloomR, 'qing');
  
  for (let i = 0; i < 15; i++) {
    if (hash(i * 17 + Math.floor(t * 10)) > 0.5) {
      drawInkStar(buf, hash(i * 3) * PW, hash(i * 7 + 1) * PH * 0.6, 2, t * 10 + i);
    }
  }
}

function shot5(buf, t, lt, dur) {
  // 镜头 5: 海洋中，心形眼
  const progress = lt / dur;
  
  drawPaper(buf);
  
  // 天空（留白）
  // 海洋（淡墨）
  for (let y = Math.floor(PH * 0.45); y < PH; y++) {
    for (let x = 0; x < PW; x++) {
      const k = (y - PH * 0.45) / (PH * 0.55);
      const alpha = 0.2 * k;
      const r = Math.floor(INK.zhong[0] * alpha + INK.paper[0] * (1 - alpha));
      const g = Math.floor(INK.zhong[1] * alpha + INK.paper[1] * (1 - alpha));
      const b = Math.floor(INK.zhong[2] * alpha + INK.paper[2] * (1 - alpha));
      setPixel(buf, x, y, r, g, b);
    }
  }
  
  // 海平面
  for (let x = 0; x < PW; x++) {
    const h = Math.floor(3 * Math.sin(x * 0.02 + t * 0.5));
    setPixel(buf, x, Math.floor(PH * 0.45) + h, ...INK.nong);
  }
  
  const cs = 14;
  drawXieyiFigure(buf, PW * 0.5, PH * 0.45 - cs * 0.3, cs, 'love', t);
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
  drawInkSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot6(buf, t, lt, dur) {
  // 镜头 6: 行星昼夜半球
  const progress = lt / dur;
  
  drawPaper(buf);
  
  // 左昼右夜（淡墨分区）
  for (let y = 0; y < PH; y++) {
    for (let x = 0; x < PW / 2; x++) {
      const alpha = 0.05;
      const r = Math.floor(INK.paper[0] + (255 - INK.paper[0]) * alpha);
      const g = Math.floor(INK.paper[1] + (255 - INK.paper[1]) * alpha);
      const b = Math.floor(INK.paper[2] + (250 - INK.paper[2]) * alpha);
      setPixel(buf, x, y, r, g, b);
    }
  }
  
  // 行星（昼夜）
  const cx = PW / 2, cy = PH * 0.5, cr = 50;
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      if (px * px + py * py <= cr * cr) {
        if (px < 0) {
          const alpha = 0.2;
          const r = Math.floor(INK.dan[0] * alpha + INK.paper[0] * (1 - alpha));
          const g = Math.floor(INK.dan[1] * alpha + INK.paper[1] * (1 - alpha));
          const b = Math.floor(INK.dan[2] * alpha + INK.paper[2] * (1 - alpha));
          setPixel(buf, cx + px, cy + py, r, g, b);
        } else {
          const alpha = 0.3;
          const r = Math.floor(INK.zhong[0] * alpha + INK.paper[0] * (1 - alpha));
          const g = Math.floor(INK.zhong[1] * alpha + INK.paper[1] * (1 - alpha));
          const b = Math.floor(INK.zhong[2] * alpha + INK.paper[2] * (1 - alpha));
          setPixel(buf, cx + px, cy + py, r, g, b);
        }
      }
    }
  }
  
  // 太阳（左，留白中的光）
  drawInkBloom(buf, PW * 0.15, PH * 0.2, 15, 'qing');
  
  // 月亮（右）
  drawInkMoon(buf, PW * 0.85, PH * 0.2, 10);
  
  // 两个角色
  const cs = 10;
  drawXieyiFigure(buf, PW * 0.3, PH * 0.5 - 50 - cs * 0.7, cs, 'sleep', t);
  drawXieyiFigure(buf, PW * 0.7, PH * 0.5 - 50 - cs * 0.7, cs, 'sad', t);
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
  drawInkSubtitle(buf, lyric ? lyric.text : '', la);
}

function shot7(buf, t, lt, dur) {
  // 镜头 7: 独自，破碎的心
  const progress = lt / dur;
  
  drawPaper(buf);
  
  // 远山
  drawInkHill(buf, Math.floor(PH * 0.75), 'qing');
  
  // 小行星
  const planetR = lerp(30, 50, easeOut(progress));
  drawInkMoon(buf, PW / 2, PH * 0.6, planetR);
  
  // 角色
  const cs = lerp(10, 14, easeOut(progress));
  const charY = PH * 0.6 - planetR - cs * 0.7;
  drawXieyiFigure(buf, PW * 0.5, charY, cs, 'surprised', t);
  
  // 花
  drawInkFlower(buf, PW * 0.5 + 18, charY + cs, 2);
  
  // 破碎的心（朱砂）
  if (progress > 0.3) {
    const heartY = PH * 0.2 + Math.sin(t) * 3;
    // 左半（淡朱砂）
    drawInkBloom(buf, PW * 0.5 - 8, heartY, 6, 'vermilion');
    // 右半（更淡）
    for (let py = -6; py <= 6; py++) {
      for (let px = 0; px <= 6; px++) {
        if (px * px + py * py <= 36) {
          const alpha = 0.4;
          const r = Math.floor(INK.vermilion[0] * alpha + INK.paper[0] * (1 - alpha));
          const g = Math.floor(INK.vermilion[1] * alpha + INK.paper[1] * (1 - alpha));
          const b = Math.floor(INK.vermilion[2] * alpha + INK.paper[2] * (1 - alpha));
          setPixel(buf, PW * 0.5 + 2 + px, heartY + py, r, g, b);
        }
      }
    }
  }
  
  const lyric = LYRICS.find(l => t >= l.t && t < l.t + 5);
  const la = lyric ? clamp((t - lyric.t) / 0.5, 0, 1) * clamp((lyric.t + 4.5 - t) / 0.5, 0, 1) : 0;
  drawInkSubtitle(buf, lyric ? lyric.text : '', la);
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

const FFMPEG = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const OUTPUT = path.join(__dirname, 'out', 'tide_inkwash.mp4');
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

process.stdout.write(`渲染水墨风 ${totalFrames} 帧 (${DUR}s @ ${FPS}fps)...\n`);

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
