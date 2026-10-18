// render_pixel_tide.js — 无浏览器渲染：纯 JS 像素计算 → rawvideo → ffmpeg → MP4
// 用法: node render_pixel_tide.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PW = 480, PH = 270;
const FPS = 24;
const DUR = 56;
const TOTAL_FRAMES = Math.ceil(DUR * FPS);
const BPM = 143.6, BEAT = 60 / BPM;
const TAU = Math.PI * 2;

// 颜色
const C = {
  night1: [26, 26, 62], night2: [45, 45, 94], night3: [61, 61, 126],
  stars: [255, 255, 255], moon: [255, 250, 205],
  orange: [232, 115, 74], orangeDark: [192, 88, 48], orangeLight: [255, 144, 112],
  pink: [240, 144, 160], pinkDark: [208, 104, 120], pinkLight: [255, 176, 192],
  ground: [74, 107, 74], groundDark: [58, 85, 56],
  sunset1: [255, 140, 90], sunset2: [255, 176, 122], sunset3: [255, 208, 144],
  planetGreen: [90, 154, 90], planetDark: [45, 93, 45],
  firework1: [255, 107, 107], firework2: [107, 255, 107], firework3: [107, 107, 255],
  firework4: [255, 255, 107], firework5: [255, 107, 255],
  heart: [255, 68, 102],
};

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

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}

// 帧缓冲
function createFrame() {
  return new Uint8Array(PW * PH * 3);
}

function setPixel(buf, x, y, r, g, b) {
  if (x < 0 || x >= PW || y < 0 || y >= PH) return;
  const i = (y * PW + x) * 3;
  buf[i] = r; buf[i+1] = g; buf[i+2] = b;
}

function fillRect(buf, x, y, w, h, col) {
  const [r,g,b] = typeof col === 'string' ? hexToRgb(col) : col;
  x = Math.floor(x); y = Math.floor(y); w = Math.floor(w); h = Math.floor(h);
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPixel(buf, px, py, r, g, b);
    }
  }
}

function drawStar(buf, x, y, size, col, twinkle) {
  const s = Math.max(1, Math.floor(size));
  const a = 0.5 + 0.5 * Math.sin(twinkle);
  const [cr,cg,cb] = typeof col === 'string' ? hexToRgb(col) : col;
  const alpha = a;
  const br = Math.floor(cr * alpha), bg2 = Math.floor(cg * alpha), bb = Math.floor(cb * alpha);
  const fx = Math.floor(x), fy = Math.floor(y);
  // 十字
  for (let i = -s; i <= s; i++) setPixel(buf, fx+i, fy, br, bg2, bb);
  for (let i = -s; i <= s; i++) setPixel(buf, fx, fy+i, br, bg2, bb);
  if (s >= 2 && a > 0.7) {
    setPixel(buf, fx-s+1, fy-1, br, bg2, bb); setPixel(buf, fx+s-1, fy-1, br, bg2, bb);
    setPixel(buf, fx-s+1, fy+1, br, bg2, bb); setPixel(buf, fx+s-1, fy+1, br, bg2, bb);
    setPixel(buf, fx-1, fy-s+1, br, bg2, bb); setPixel(buf, fx-1, fy+s-1, br, bg2, bb);
    setPixel(buf, fx+1, fy-s+1, br, bg2, bb); setPixel(buf, fx+1, fy+s-1, br, bg2, bb);
  }
}

function drawMoon(buf, x, y, r) {
  const cx = Math.floor(x), cy = Math.floor(y), cr = Math.floor(r);
  const col = typeof C.moon === 'string' ? hexToRgb(C.moon) : C.moon;
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      if (px*px+py*py <= cr*cr) {
        const d2 = (px-cr*0.35)**2 + (py+cr*0.3)**2;
        if (d2 > cr*cr*0.55) setPixel(buf, cx+px, cy+py, col[0], col[1], col[2]);
      }
    }
  }
}

function drawBoxChar(buf, x, y, size, colKey, face, opts = {}) {
  const color = C[colKey];
  const darkCol = C[colKey+'Dark'];
  const lightCol = C[colKey+'Light'];
  const s = Math.floor(size);
  const bx = Math.floor(x)-s/2, by = Math.floor(y)-s/2;

  fillRect(buf, bx, by, s, s, color);
  fillRect(buf, bx, by+s-2, s, 2, darkCol);
  fillRect(buf, bx+s-2, by, 2, s, darkCol);
  fillRect(buf, bx, by, s, 1, lightCol);
  fillRect(buf, bx, by, 1, s, lightCol);

  const faceY = by + Math.floor(s*0.35);
  const eyeSp = Math.floor(s*0.22);
  const eyeSz = Math.max(2, Math.floor(s*0.13));
  const eyeL = bx + Math.floor(s/2) - eyeSp - eyeSz;
  const eyeR = bx + Math.floor(s/2) + eyeSp - 1;
  const black = [26,26,26];

  if (face === 'happy' || face === 'love') {
    fillRect(buf, eyeL, faceY, eyeSz, eyeSz, black);
    fillRect(buf, eyeR, faceY, eyeSz, eyeSz, black);
    fillRect(buf, bx+Math.floor(s/2)-2, faceY+eyeSz+2, 4, 2, black);
  } else if (face === 'sad') {
    fillRect(buf, eyeL, faceY, eyeSz, eyeSz, black);
    fillRect(buf, eyeR, faceY, eyeSz, eyeSz, black);
    fillRect(buf, bx+Math.floor(s/2)-2, faceY+eyeSz+4, 4, 1, black);
  } else if (face === 'surprised') {
    fillRect(buf, eyeL-1, faceY-1, eyeSz+2, eyeSz+2, black);
    fillRect(buf, eyeR-1, faceY-1, eyeSz+2, eyeSz+2, black);
    fillRect(buf, bx+Math.floor(s/2)-1, faceY+eyeSz+2, 3, 3, [255,255,255]);
  } else if (face === 'love') {
    const hc = C.heart;
    const hx1 = bx+Math.floor(s/2)-eyeSp, hx2 = bx+Math.floor(s/2)+eyeSp;
    fillRect(buf, hx1-1, faceY-1, 2, 2, hc); fillRect(buf, hx1+1, faceY-1, 2, 2, hc);
    fillRect(buf, hx1, faceY+1, 2, 1, hc);
    fillRect(buf, hx2-1, faceY-1, 2, 2, hc); fillRect(buf, hx2+1, faceY-1, 2, 2, hc);
    fillRect(buf, hx2, faceY+1, 2, 1, hc);
    fillRect(buf, bx+Math.floor(s/2)-2, faceY+eyeSz+2, 4, 2, black);
  } else if (face === 'sleep') {
    fillRect(buf, eyeL-1, faceY+1, eyeSz*2+2, 2, black);
    fillRect(buf, eyeR-1, faceY+1, eyeSz*2+2, 2, black);
  }

  if (opts.blush) {
    fillRect(buf, bx+Math.floor(s/2)-eyeSp-3, faceY+3, 3, 2, [255,153,153]);
    fillRect(buf, bx+Math.floor(s/2)+eyeSp+1, faceY+3, 3, 2, [255,153,153]);
  }
  if (opts.hands !== false) {
    const handY = by + Math.floor(s*0.5);
    fillRect(buf, bx-3, handY, 3, 4, color);
    fillRect(buf, bx+s, handY, 3, 4, color);
  }
  if (opts.legs !== false) {
    fillRect(buf, bx+3, by+s, 4, 4, darkCol);
    fillRect(buf, bx+s-7, by+s, 4, 4, darkCol);
  }
}

function drawGround(buf, y, col, darkCol) {
  const gc = typeof col === 'string' ? hexToRgb(col) : col;
  const dc = typeof darkCol === 'string' ? hexToRgb(darkCol) : darkCol;
  // 填充地面以下区域
  for (let py = y; py < PH; py++) {
    for (let x = 0; x < PW; x++) setPixel(buf, x, py, gc[0], gc[1], gc[2]);
  }
  // 地面顶部波浪轮廓
  for (let x = 0; x < PW; x++) {
    const h = Math.floor(8 + 4*Math.sin(x*0.04) + 2*Math.sin(x*0.11));
    setPixel(buf, x, y-h, dc[0], dc[1], dc[2]);
    setPixel(buf, x, y-h+1, dc[0], dc[1], dc[2]);
  }
}

function drawFirework(buf, x, y, radius, colors, t) {
  const n = colors.length;
  for (let i = 0; i < n; i++) {
    const angle = (i/n)*TAU + t*0.5;
    const r = radius*(0.3+0.7*Math.abs(Math.sin(t*2+i*0.7)));
    for (let j = 0; j < 3; j++) {
      const tr = r-j*3;
      if (tr > 0) {
        const col = typeof colors[i] === 'string' ? hexToRgb(colors[i]) : colors[i];
        setPixel(buf, Math.floor(x+Math.cos(angle)*tr), Math.floor(y+Math.sin(angle)*tr), col[0], col[1], col[2]);
      }
    }
    setPixel(buf, Math.floor(x+Math.cos(angle)*r), Math.floor(y+Math.sin(angle)*r), 255,255,255);
  }
  setPixel(buf, Math.floor(x), Math.floor(y), 255,255,255);
}

function drawPlanet(buf, x, y, r, t) {
  const cx = Math.floor(x), cy = Math.floor(y), cr = Math.floor(r);
  const lightX = Math.cos(t*0.15)*0.3;
  const gc = typeof C.planetGreen === 'string' ? hexToRgb(C.planetGreen) : C.planetGreen;
  const dc = typeof C.planetDark === 'string' ? hexToRgb(C.planetDark) : C.planetDark;
  for (let py = -cr; py <= cr; py++) {
    for (let px = -cr; px <= cr; px++) {
      if (px*px+py*py <= cr*cr) {
        const b = (px/cr)*lightX+0.5;
        const col = b > 0 ? gc : dc;
        setPixel(buf, cx+px, cy+py, col[0], col[1], col[2]);
      }
    }
  }
  fillRect(buf, cx-cr*0.3, cy-cr*0.3, cr*0.3, cr*0.2, [128,192,128]);
}

function drawSubtitle(buf, text, alpha) {
  if (!text) return;
  const barH = 14, barY = PH-barH-4;
  fillRect(buf, 0, barY, PW, barH, [0,0,0]);
  // 简单文字渲染用白色小方块模拟
  // 由于纯 JS 没有字体，用像素块表示文字存在
  const textW = text.length * 10;
  const startX = Math.floor((PW - textW) / 2);
  for (let i = 0; i < text.length; i++) {
    fillRect(buf, startX + i*10, barY+3, 8, 8, [255,255,255]);
  }
}

// 渐变填充
function fillGradient(buf, y0, y1, col0, col1) {
  const c0 = hexToRgb(col0), c1 = hexToRgb(col1);
  for (let y = y0; y < y1; y++) {
    const k = (y-y0)/(y1-y0);
    const r = Math.floor(lerp(c0[0],c1[0],k));
    const g = Math.floor(lerp(c0[1],c1[1],k));
    const b = Math.floor(lerp(c0[2],c1[2],k));
    for (let x = 0; x < PW; x++) setPixel(buf, x, y, r, g, b);
  }
}

// Shot 渲染
function shot1(buf, t, lt, dur) {
  const progress = lt/dur;
  fillGradient(buf, 0, Math.floor(PH*0.7), '#1A1A3E', '#2D2D5E');
  for (let i = 0; i < 60; i++) drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.6, hash(i*11+2)>0.8?2:1, C.stars, t*(1+hash(i*5))*2+i);
  drawMoon(buf, PW*0.8, PH*0.15, 12);
  drawGround(buf, Math.floor(PH*0.78), C.ground, C.groundDark);
  const cs = lerp(16,24,easeOut(progress));
  drawBoxChar(buf, PW*0.5, PH*0.78-cs/2-4+Math.sin(t*2)*1, cs, 'orange', 'happy', { blush: true });
  const lyric = LYRICS.find(l => t >= l.t && t < l.t+5);
  const la = lyric ? clamp((t-lyric.t)/0.5,0,1)*clamp((lyric.t+4.5-t)/0.5,0,1) : 0;
  drawSubtitle(buf, lyric?lyric.text:'', la);
}

function shot2(buf, t, lt, dur) {
  const progress = lt/dur;
  if (progress < 0.3) {
    fillGradient(buf, 0, Math.floor(PH*0.6), '#FF8C5A', '#644878');
    const sunY = lerp(PH*0.5, PH*0.35, progress/0.3);
    fillRect(buf, PW*0.5-15, sunY, 30, 30, C.sunset3);
    drawGround(buf, Math.floor(PH*0.78), C.ground, C.groundDark);
    drawBoxChar(buf, PW*0.42, PH*0.78-13, 18, 'orange', 'happy', { blush: true });
    drawBoxChar(buf, PW*0.58, PH*0.78-13, 18, 'pink', 'happy', { blush: true });
  } else if (progress < 0.6) {
    fillGradient(buf, 0, Math.floor(PH*0.75), '#1A1A3E', '#282850');
    for (let i = 0; i < 40; i++) drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.5, 1, C.stars, t*2+i);
    drawGround(buf, Math.floor(PH*0.78), C.ground, C.groundDark);
    const fwP = (progress-0.3)/0.3;
    if (fwP > 0.1) {
      const colors = [C.firework1,C.firework2,C.firework3,C.firework4,C.firework5];
      for (let i = 0; i < 3; i++) drawFirework(buf, PW*(0.3+i*0.2), PH*(0.2+i*0.05), 20+10*Math.sin(t*3+i), colors, t+i*0.5);
    }
    drawBoxChar(buf, PW*0.42, PH*0.78-13, 18, 'orange', 'surprised', { blush: true });
    drawBoxChar(buf, PW*0.58, PH*0.78-13, 18, 'pink', 'love', { blush: true });
  } else {
    fillGradient(buf, 0, Math.floor(PH*0.7), '#141432', '#232346');
    for (let i = 0; i < 80; i++) drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.6, hash(i*11+2)>0.9?2:1, C.stars, t*(1+hash(i*5))*2+i);
    drawMoon(buf, PW*0.15, PH*0.12, 10);
    drawGround(buf, Math.floor(PH*0.78), C.ground, C.groundDark);
    drawBoxChar(buf, PW*0.42, PH*0.78-13, 18, 'orange', 'happy', { blush: true });
    drawBoxChar(buf, PW*0.58, PH*0.78-13, 18, 'pink', 'happy', { blush: true });
  }
  const lyric = LYRICS.find(l => t >= l.t && t < l.t+5);
  const la = lyric ? clamp((t-lyric.t)/0.5,0,1)*clamp((lyric.t+4.5-t)/0.5,0,1) : 0;
  drawSubtitle(buf, lyric?lyric.text:'', la);
}

function shot3(buf, t, lt, dur) {
  const progress = lt/dur;
  fillGradient(buf, 0, Math.floor(PH*0.7), '#1A1A3E', '#2D2D5E');
  for (let i = 0; i < 50; i++) drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.5, 1, C.stars, t*2+i);
  drawPlanet(buf, PW*0.5, PH*0.4, lerp(20,40,easeOut(progress)), t);
  drawGround(buf, Math.floor(PH*0.82), C.ground, C.groundDark);
  const lyric = LYRICS.find(l => t >= l.t && t < l.t+5);
  const la = lyric ? clamp((t-lyric.t)/0.5,0,1)*clamp((lyric.t+4.5-t)/0.5,0,1) : 0;
  drawSubtitle(buf, lyric?lyric.text:'', la);
}

function shot4(buf, t, lt, dur) {
  const progress = lt/dur;
  const flash = progress<0.3 ? easeOut(progress/0.3) : 1-ease((progress-0.3)/0.7);
  const b = Math.floor(flash*200);
  fillRect(buf, 0, 0, PW, PH, [26+b, 26+b, 62+b]);
  for (let i = 0; i < 30; i++) {
    if (hash(i*17+Math.floor(t*10))>0.5) drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.6, 2, C.stars, t*10+i);
  }
}

function shot5(buf, t, lt, dur) {
  const progress = lt/dur;
  fillGradient(buf, 0, Math.floor(PH*0.7), '#1A1A3E', '#2D2D5E');
  for (let i = 0; i < 60; i++) drawStar(buf, hash(i*3)*PW, hash(i*7+1)*PH*0.6, 1, C.stars, t*2+i);
  drawMoon(buf, PW*0.8, PH*0.15, 12);
  drawGround(buf, Math.floor(PH*0.78), C.ground, C.groundDark);
  const cs = lerp(20,16,easeOut(progress));
  drawBoxChar(buf, PW*0.5, PH*0.78-cs/2-4, cs, 'orange', 'happy', { blush: true });
  if (progress > 0.7) {
    const ep = (progress-0.7)/0.3;
    drawPlanet(buf, PW*0.75, PH*0.3, lerp(5,15,easeOut(ep)), t);
  }
  const lyric = LYRICS.find(l => t >= l.t && t < l.t+5);
  const la = lyric ? clamp((t-lyric.t)/0.5,0,1)*clamp((lyric.t+4.5-t)/0.5,0,1) : 0;
  drawSubtitle(buf, lyric?lyric.text:'', la);
}

const shotFns = [shot1, shot2, shot3, shot4, shot5];
const shotTimes = [0, 10.4, 35.4, 42.7, 44.7];

function renderFrame(frameNum) {
  const t = frameNum / FPS;
  const buf = createFrame();

  let si = 0;
  for (let i = shotTimes.length-1; i >= 0; i--) {
    if (t >= shotTimes[i]) { si = i; break; }
  }
  const t0 = shotTimes[si];
  const lt = t - t0;
  const nextT = si+1 < shotTimes.length ? shotTimes[si+1] : DUR;
  const dur = nextT - t0;

  shotFns[si](buf, t, lt, dur);
  return buf;
}

// 放大帧到目标分辨率
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
const OUTPUT = path.join(__dirname, 'out', 'tide_pixel.mp4');
const SCALE = 4; // 480x270 → 1920x1080
const OUT_W = PW * SCALE, OUT_H = PH * SCALE;

fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });

const ffmpeg = spawn(FFMPEG, [
  '-f', 'rawvideo',
  '-pix_fmt', 'rgb24',
  '-s', `${OUT_W}x${OUT_H}`,
  '-r', String(FPS),
  '-i', '-',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-y', OUTPUT
]);

let frameCount = 0;
const totalFrames = Math.ceil(DUR * FPS);
const startTime = Date.now();

process.stdout.write(`渲染 ${totalFrames} 帧 (${DUR}s @ ${FPS}fps) → ${OUT_W}x${OUT_H}...\n`);

function renderNext() {
  if (frameCount >= totalFrames) {
    ffmpeg.stdin.end();
    return;
  }

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

  if (canWrite) {
    setImmediate(renderNext);
  } else {
    ffmpeg.stdin.once('drain', renderNext);
  }
}

ffmpeg.stderr.on('data', data => {
  // ffmpeg 进度信息
});

ffmpeg.on('close', code => {
  process.stdout.write(`\n完成! 输出: ${OUTPUT}\n`);
  process.stdout.write(`文件大小: ${(fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1)} MB\n`);
  process.exit(code);
});

ffmpeg.on('error', err => {
  console.error('ffmpeg 错误:', err.message);
  process.exit(1);
});

renderNext();
