// ═══════════════════════════════════════════════════════════════════════════
// 《东京不太热》 (Dongjing Butaire — 青春校园暗恋篇 MV)  V2 高密度动作版
// Audio: 东京不太热 .mp3 (219.453s, 126.05 BPM, beat = 0.4760s, offset = 0.186s)
// Alignment: faster-whisper 词级时间戳 (69 lines, 15.74s - 218.85s)
// Choreography: 每 2-3秒必有新动作/表情/镜头/道具变化，全程 beat-synced
// ═══════════════════════════════════════════════════════════════════════════

const DJ_BPM = 126.05;
const DJ_BEAT = 60.0 / DJ_BPM;
const DJ_BAR = DJ_BEAT * 4;
const DJ_OFFSET = 0.186;

const clamp01 = x => Math.max(0, Math.min(1, x));
const easeInOut = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
const easeOutBack = x => { x = clamp01(x); const s = 1.85; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };

function skyGrad(c1, c2, c3) {
  textFont("Noto Serif SC");
  const ctx = drawingContext;
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.76);
  g.addColorStop(0, c1);
  g.addColorStop(0.55, c2);
  g.addColorStop(1, c3 || c2);
  ctx.save();
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function djBeatNum(t) { return Math.max(0, (t - DJ_OFFSET) / DJ_BEAT); }
function djBeatPhase(t) { const b = djBeatNum(t); return b - Math.floor(b); }
function djBeatKick(t, pow = 3.0) { return Math.pow(1.0 - djBeatPhase(t), pow); }
function djEighthKick(t, pow = 2.5) { const b2 = djBeatNum(t) * 2.0; const ph = b2 - Math.floor(b2); return Math.pow(1.0 - ph, pow); }
function djBarPhase(t) { const bar = Math.max(0, (t - DJ_OFFSET) / DJ_BAR); return bar - Math.floor(bar); }
function djBarKick(t, pow = 2.6) { return Math.pow(1.0 - djBarPhase(t), pow); }

// 每N秒切换的细粒度动作节拍器 - 确保每2-3秒就有变化
function microPhase(localT, cycle = 2.4) { return Math.floor(localT / cycle); }
function microT(localT, cycle = 2.4) { return (localT % cycle) / cycle; }

// ─── Custom Campus Clawd Cast ─────────────────────────────────────────────

function campusBoyClawd(x, y, sc, o = {}) {
  const t = o.t || 0;
  const col = o.col || "#4884C8";
  const dk  = o.dk  || "#2A568F";
  const lt  = o.lt  || "#7EB4F0";
  const headphones = o.headphones || "neck";
  const mode = o.mode || "normal";
  const kick = djBeatKick(t, 2.8);
  const u = sc * 0.18;
  // 如果没指定pose，自动根据beat赋予bounce
  if (!o.pose && !o.move && o.aL === undefined) o.pose = "bounce";

  clawd(x, y, u, {
    ...o,
    t, col, dk, lt,
    tint: null, tintK: 0,
    glasses: mode === "glasses",
    sweat: mode === "selfHold" || mode === "shock" || !!o.sweat,
  });

  push();
  translate(x, y);
  fill("#F7FAFF");
  stroke("#1C2536");
  strokeWeight(Math.max(1.8, 2.2 * (sc / 100)));
  beginShape();
  vertex(-3.2 * u, -2.0 * u);
  vertex(0, -0.3 * u);
  vertex(3.2 * u, -2.0 * u);
  vertex(2.1 * u, -2.0 * u);
  vertex(0, -0.9 * u);
  vertex(-2.1 * u, -2.0 * u);
  endShape(CLOSE);
  fill("#E03E52");
  beginShape();
  vertex(-0.55 * u, -0.8 * u);
  vertex(0.55 * u, -0.8 * u);
  vertex(0.75 * u, 0.45 * u);
  vertex(0, 0.95 * u);
  vertex(-0.75 * u, 0.45 * u);
  endShape(CLOSE);
  fill("#FFD25A");
  circle(-3.2 * u, -1.05 * u, 0.9 * u);

  if (headphones === "on") {
    noFill();
    stroke("#1C2536");
    strokeWeight(1.05 * u);
    arc(0, -6.8 * u, 9.6 * u, 6.2 * u, PI, TWO_PI);
    stroke("#F2F6FC");
    strokeWeight(0.65 * u);
    arc(0, -6.8 * u, 9.6 * u, 6.2 * u, PI, TWO_PI);
    const cupPulse = 1 + 0.14 * kick;
    for (const side of [-1, 1]) {
      push();
      translate(side * 4.75 * u, -5.6 * u);
      scale(cupPulse);
      fill("#FFFFFF");
      stroke("#1C2536");
      strokeWeight(0.32 * u);
      rect(-0.72 * u, -1.35 * u, 1.44 * u, 2.7 * u, 0.6 * u);
      fill("#5EE6FF");
      noStroke();
      circle(0, 0, 0.72 * u);
      pop();
    }
    for (let i = 0; i < 2; i++) {
      const np = ((t * 0.9 + i * 0.5) % 1);
      const nx = (i === 0 ? -1 : 1) * (6.2 + np * 3.5) * u;
      const ny = (-6.8 - np * 4.5) * u;
      fill(255, 230, 120, (1 - np) * 240);
      stroke("#1C2536");
      strokeWeight(0.22 * u);
      circle(nx, ny, 0.9 * u);
      line(nx + 0.4 * u, ny, nx + 0.4 * u, ny - 1.3 * u);
    }
  } else if (headphones === "neck") {
    noFill();
    stroke("#1C2536");
    strokeWeight(0.75 * u);
    arc(0, -2.0 * u, 9.6 * u, 3.4 * u, 0.08 * PI, 0.92 * PI);
    fill("#FFFFFF");
    stroke("#1C2536");
    strokeWeight(0.3 * u);
    ellipse(-3.8 * u, -1.1 * u, 1.9 * u, 1.45 * u);
    ellipse(3.8 * u, -1.1 * u, 1.9 * u, 1.45 * u);
    fill("#5EE6FF");
    noStroke();
    circle(-3.8 * u, -1.1 * u, 0.65 * u);
    circle(3.8 * u, -1.1 * u, 0.65 * u);
  }

  if (mode === "aloof") {
    noFill();
    stroke(150, 225, 255, 190);
    strokeWeight(0.28 * u);
    rect(-7.8 * u, -9.8 * u, 15.6 * u, 9.6 * u, 1.2 * u);
    for (let k = 0; k < 3; k++) {
      const ix = (-6.5 + k * 6.5) * u;
      const iy = (-10.8 - 0.5 * Math.sin(t * 4 + k)) * u;
      fill("#B8F0FF");
      noStroke();
      circle(ix, iy, 0.75 * u);
    }
    const hs = 1.0 + 0.22 * kick;
    push();
    translate(5.8 * u, -11.8 * u);
    scale(hs);
    fill(255, 95, 130, 235);
    stroke("#1C2536");
    strokeWeight(0.25 * u);
    circle(-0.55 * u, -0.2 * u, 1.25 * u);
    circle(0.55 * u, -0.2 * u, 1.25 * u);
    triangle(-1.12 * u, 0.05 * u, 1.12 * u, 0.05 * u, 0, 1.35 * u);
    pop();
  } else if (mode === "selfHold") {
    const squeeze = 0.25 * Math.sin(t * 8);
    stroke("#1C2536");
    strokeWeight(0.35 * u);
    fill(col);
    rect((-2.6 + squeeze) * u, -2.5 * u, 2.7 * u, 1.55 * u, 0.6 * u);
    fill(lt);
    rect((0.0 - squeeze) * u, -2.5 * u, 2.7 * u, 1.55 * u, 0.6 * u);
    noFill();
    stroke(255, 215, 110, 190 + 60 * kick);
    strokeWeight(0.28 * u);
    circle(0, -1.75 * u, (4.8 + 0.6 * kick) * u);
  }
  pop();
}

function campusGirlClawd(x, y, sc, o = {}) {
  const t = o.t || 0;
  const col = o.col || "#E8785A";
  const dk  = o.dk  || "#B84C32";
  const lt  = o.lt  || "#FFA58C";
  const u = sc * 0.18;
  if (!o.pose && o.aL === undefined) o.pose = "bounce";
  clawd(x, y, u, { ...o, t, col, dk, lt, tint: null, tintK: 0, blush: o.blush !== undefined ? o.blush : true });
  push();
  translate(x, y);
  fill("#243B6B");
  stroke("#1C2536");
  strokeWeight(Math.max(1.8, 2.2 * (sc / 100)));
  beginShape();
  vertex(-4.2 * u, -2.05 * u);
  vertex(0, -0.35 * u);
  vertex(4.2 * u, -2.05 * u);
  vertex(2.8 * u, -2.05 * u);
  vertex(0, -0.95 * u);
  vertex(-2.8 * u, -2.05 * u);
  endShape(CLOSE);
  fill("#FF4769");
  triangle(-1.45 * u, -1.25 * u, -0.1 * u, -0.75 * u, -1.45 * u, -0.25 * u);
  triangle(1.45 * u, -1.25 * u, 0.1 * u, -0.75 * u, 1.45 * u, -0.25 * u);
  circle(0, -0.75 * u, 0.72 * u);
  push();
  translate(4.6 * u, -8.55 * u);
  rotate(0.15 * Math.sin(t * 3));
  fill("#FFB5D0");
  stroke("#1C2536");
  strokeWeight(0.24 * u);
  for (let i = 0; i < 5; i++) {
    push();
    rotate((i * TWO_PI) / 5);
    ellipse(0, -0.72 * u, 0.75 * u, 1.05 * u);
    pop();
  }
  fill("#FFE680");
  noStroke();
  circle(0, 0, 0.55 * u);
  pop();
  // 手中小包包细节 - 每2秒轻晃
  if (o.bag) {
    push();
    translate(3.8 * u, -1.2 * u + 0.15 * Math.sin(t*6)*u);
    rotate(0.08*Math.sin(t*4));
    fill("#FFD48A");
    stroke("#1C2536"); strokeWeight(0.28*u);
    rect(-0.9*u, -0.6*u, 1.8*u, 1.6*u, 0.4*u);
    fill("#E8785A"); circle(0, -0.2*u, 0.5*u);
    pop();
  }
  pop();
}

function rivalBoyClawd(x, y, sc, o = {}) {
  const col = o.col || "#58A87C";
  const dk  = o.dk  || "#34704E";
  const lt  = o.lt  || "#8AD4AA";
  const u = sc * 0.18;
  if (!o.pose && o.aL === undefined) o.pose = "bounce";
  clawd(x, y, u, { ...o, col, dk, lt, tint: null, tintK: 0 });
  push();
  translate(x, y);
  fill("#F5E8C7");
  stroke("#1C2536");
  strokeWeight(Math.max(1.6, 2.0 * (sc / 100)));
  triangle(-3.0 * u, -2.0 * u, 3.0 * u, -2.0 * u, 0, -0.2 * u);
  fill("#34704E");
  circle(2.5 * u, -1.1 * u, 0.75 * u);
  pop();
}

function drawCampusCouple(cx, cy, sc, t, walkDir = 1) {
  const kick = djBeatKick(t, 2.5);
  const bob = 3 * Math.sin(t * 5.2);
  const sway = 0.06*Math.sin(t*2.5);
  push();
  translate(cx, cy + bob);
  rotate(sway);
  clawd(-sc * 0.85, 0, sc * 0.17, {
    t, col: "#9B7EDE", dk: "#6348A6", lt: "#C4B0F5", tint: null, tintK: 0,
    pose: "walk", Look: walkDir * 0.3, eyes: "happy", mouth: "smile", blush: true,
  });
  clawd(sc * 0.85, 0, sc * 0.17, {
    t: t + 0.25, col: "#F0A854", dk: "#B87324", lt: "#FFD08A", tint: null, tintK: 0,
    pose: "walk", Look: -walkDir * 0.3, eyes: "happy", mouth: "smile", blush: true,
  });
  stroke("#1C2536");
  strokeWeight(3);
  fill("#FFD08A");
  circle(0, -sc * 0.18, sc * 0.22);
  const hs = (1.0 + 0.25 * kick) * (sc / 95);
  push();
  translate(0, -sc * 0.92 - 6 * Math.sin(t * 3.5));
  scale(hs);
  fill("#FF5E8E");
  stroke("#1C2536");
  strokeWeight(2.2);
  circle(-8, -8, 18);
  circle(8, -8, 18);
  triangle(-16, -4, 16, -4, 0, 14);
  pop();
  pop();
}

// ─── Beat-Synced Sakura Petals ────────────────────────
function drawSakuraPetals(t, count = 28, windX = -38, alpha = 220) {
  const kick = djBeatKick(t, 3.0);
  push();
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const speedY = 38 + (i % 5) * 14;
    const px = ((seed * 19 + t * (windX - (i % 4) * 11)) % (W + 160) + (W + 160)) % (W + 160) - 80);
    const py = ((seed * 31 + t * speedY) % (H + 120)) - 60;
    const rot = t * (1.4 + (i % 3) * 0.6) + i;
    const sz = (10 + (i % 4) * 4) * (1 + 0.14 * kick);
    push();
    translate(px, py);
    rotate(rot);
    fill(255, 192 + (i % 3) * 18, 212 + (i % 2) * 15, alpha);
    stroke(180, 90, 120, alpha * 0.55);
    strokeWeight(1.2);
    ellipse(0, 0, sz * 1.15, sz * 0.72);
    pop();
  }
  pop();
}

function drawCampusBeatBadge(t, sceneLabel = "校园广播 · 126 BPM") {
  const kick = djBeatKick(t, 2.8);
  const barK = djBarKick(t, 2.4);
  push();
  translate(W - 235, 36);
  fill(20, 28, 48, 195);
  stroke(255, 220, 140, 180 + 75 * kick);
  strokeWeight(2 + 1.2 * barK);
  rect(0, 0, 205, 42, 21);
  push();
  translate(23, 21);
  rotate(t * 2.4);
  fill("#FF6B8B");
  noStroke();
  circle(0, 0, 24 + 4 * kick);
  fill("#182030");
  circle(0, 0, 8);
  pop();
  noStroke();
  for (let i = 0; i < 6; i++) {
    const bh = 8 + 18 * Math.abs(Math.sin(t * 9.5 + i * 0.85)) * (0.45 + 0.55 * kick);
    fill(i % 2 === 0 ? "#FFE066" : "#66E8FF");
    rect(44 + i * 7, 31 - bh, 4.5, bh, 2);
  }
  fill("#FFF8E8");
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(sceneLabel, 92, 21);
  pop();
}

// ─── Props ───────────────────────────────────────

function drawPhoneAlbumModal(cx, cy, sc, t, localT) {
  const kick = djBeatKick(t, 2.8);
  const popK = easeOutBack(clamp01(localT / 0.55));
  push();
  translate(cx, cy);
  scale(sc * popK * (1 + 0.025 * kick));
  fill("#1E2436");
  stroke("#101420");
  strokeWeight(4);
  rect(-185, -245, 370, 490, 32);
  fill("#FFF9F2");
  stroke("#2C354D");
  strokeWeight(2);
  rect(-168, -215, 336, 430, 18);
  fill("#2C3E66");
  noStroke();
  rect(-168, -215, 336, 44, 18, 18, 0, 0);
  fill("#FFFFFF");
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("【相册收藏夹 · 去年夏天 (1/1)】", 0, -193);
  fill("#28385E");
  stroke("#D8C8B4");
  strokeWeight(3);
  rect(-144, -152, 288, 210, 10);
  fill(255, 215, 110, 210);
  noStroke();
  circle(-85, -110, 38 + 6 * kick);
  circle(90, -105, 28 + 5 * kick);
  campusBoyClawd(-54, 24, 52, { t, headphones: "neck", eyes: "happy", mouth: "smile" });
  campusGirlClawd(54, 24, 50, { t, eyes: "happy", mouth: "smile", blush: true });
  fill("#5A4A42");
  textSize(15);
  textStyle(BOLD);
  text("2025.07.18 · 校园夏日祭合照 ♥", 0, 82);
  const showDialog = localT > 1.2;
  if (showDialog) {
    const dlgBeat = 1 + 0.05 * kick;
    push();
    translate(0, 148);
    scale(dlgBeat);
    fill(255, 255, 255, 245);
    stroke("#1C2536");
    strokeWeight(2.5);
    rect(-142, -42, 284, 84, 12);
    fill("#2C354D");
    noStroke();
    textSize(14);
    text("确定要从收藏夹删除这张照片吗？", 0, -16);
    const hoverDel = Math.floor(djBeatNum(t)) % 2 === 0;
    fill(hoverDel ? "#FF4D6A" : "#F0E6E8");
    stroke("#1C2536");
    strokeWeight(2);
    rect(-125, 4, 112, 28, 8);
    fill(hoverDel ? "#FFFFFF" : "#5A4A42");
    noStroke();
    textSize(13);
    text("× 删除照片", -69, 18);
    fill(!hoverDel ? "#4884C8" : "#E8EEF5");
    stroke("#1C2536");
    strokeWeight(2);
    rect(13, 4, 112, 28, 8);
    fill(!hoverDel ? "#FFFFFF" : "#2C354D");
    noStroke();
    text("↺ 再看一眼", 69, 18);
    pop();
  }
  pop();
}

function drawQQChatModal(cx, cy, t, localT, variant = 1) {
  const kick = djBeatKick(t, 2.8);
  const eighthK = djEighthKick(t, 2.4);
  const popS = easeOutBack(clamp01(localT / 0.45));
  push();
  translate(cx, cy);
  scale(popS);
  if (localT < 3.4) {
    const shake = Math.sin(t * 36) * 0.18 * (0.4 + 0.6 * eighthK);
    noFill();
    for (let r = 0; r < 3; r++) {
      const rp = ((t * 2.2 + r * 0.33) % 1);
      stroke(255, 215, 80, (1 - rp) * 230);
      strokeWeight(4 - rp * 2.5);
      circle(0, 0, 140 + rp * 220);
    }
    push();
    rotate(shake);
    scale(1 + 0.14 * eighthK);
    fill("#FFFDF4");
    stroke("#1C2536");
    strokeWeight(4.5);
    rect(-210, -82, 420, 164, 28);
    fill("#FFD23F");
    stroke("#1C2536");
    strokeWeight(3.5);
    arc(-130, -6, 74, 74, PI, TWO_PI);
    rect(-167, -6, 74, 24, 6);
    circle(-130, 24, 18);
    fill("#FF4365");
    noStroke();
    textSize(32);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("叮叮叮当当 Q !", -72, -22);
    fill("#3B4B6B");
    textSize(21);
    text("【QQ新消息】响起会是谁呢 NaYo？", -72, 24);
    pop();
    pop();
    return;
  }
  const isOffline = localT >= 11.0;
  const cardShake = localT < 5.2 ? Math.sin(t * 24) * 3 * kick : 0;
  translate(cardShake, 0);
  fill("#F7FAFF");
  stroke("#1C2536");
  strokeWeight(4);
  rect(-270, -175, 540, 350, 22);
  fill(isOffline ? "#6C788E" : "#3A7BD5");
  noStroke();
  rect(-270, -175, 540, 54, 22, 22, 0, 0);
  fill(isOffline ? "#B8C2D4" : "#58FF8A");
  stroke("#1C2536");
  strokeWeight(2);
  circle(-232, -148, 16);
  fill("#FFFFFF");
  noStroke();
  textSize(20);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  const titleText = isOffline ? "暗恋的学妹 (已离线 · 去食堂吃饭了)" : "暗恋的学妹 (在线 · 正在输入... NaYo)";
  text(titleText, -210, -148);
  if (localT >= 3.4) {
    fill("#FFE5EC");
    stroke("#1C2536");
    strokeWeight(2.5);
    rect(-245, -104, 340, 58, 14);
    fill("#263248");
    noStroke();
    textSize(17);
    textAlign(LEFT, CENTER);
    const qMsg = variant === 2 ? "学妹：学长在吗？图书馆这题怎么做呀 Ayo？" : variant === 3 ? "学妹：学长！文化祭音响出问题啦怎么调 Ayo？" : variant === 4 ? "学妹：学长毕业快乐！这题最后帮我看下 Ayo？" : "学妹：学长在吗？这道高数题怎么做呀 Ayo？";
    text(qMsg, -228, -75);
  }
  if (localT >= 6.8) {
    fill("#DDF2FF");
    stroke("#1C2536");
    strokeWeight(2.5);
    rect(-95, -32, 340, 74, 14);
    fill("#1E3A5F");
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    text("学长：(推眼镜假装正经) 很简单，小意思！", -78, -10);
    fill("#2B7A4B");
    textSize(15);
    text("【解题步骤已全部摆平 100% · 附件.pdf】", -78, 18);
  }
  if (localT >= 10.8) {
    fill("#FFF0D6");
    stroke("#1C2536");
    strokeWeight(2.5);
    rect(-245, 56, 365, 62, 14);
    fill("#B84228");
    noStroke();
    textSize(18);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text("学妹：太棒啦谢谢学长！不多聊了，去吃饭了 Ayo~", -228, 87);
  }
  fill("#EBF1F8");
  stroke("#BDC8D8");
  strokeWeight(2);
  rect(-245, 130, 490, 32, 10);
  fill("#7A889E");
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text(isOffline ? "对方已离线，你输入的那句「其实我很想你」还没发出去..." : "正在飞速敲键盘帮她摆平问题...", -230, 146);
  pop();
}

// ─── Campus Environment Backdrops ─────────────────────────────────────────

function drawCampusGateBackdrop(t, isOutro = false) {
  const kick = djBeatKick(t, 2.8);
  skyGrad(isOutro ? "#2A1F4A" : "#3E2F5B", isOutro ? "#C85A6E" : "#E2726B", "#FFD09B");
  noStroke();
  fill(255, 225, 145, 55 + 35 * kick);
  circle(W * 0.52, H * 0.44, 340 + 28 * kick);
  fill(255, 242, 195, 210);
  circle(W * 0.52, H * 0.44, 175 + 10 * kick);
  fill("#2C3554");
  stroke("#1A2035");
  strokeWeight(3);
  rect(W * 0.26, H * 0.28, W * 0.48, H * 0.42, 6);
  rect(W * 0.45, H * 0.13, W * 0.10, H * 0.57, 4);
  triangle(W * 0.44, H * 0.13, W * 0.56, H * 0.13, W * 0.50, H * 0.04);
  fill("#FFF8DC");
  stroke("#1A2035");
  strokeWeight(3);
  circle(W * 0.50, H * 0.21, 64 + 4 * kick);
  stroke("#2C3554");
  strokeWeight(3);
  line(W * 0.50, H * 0.21, W * 0.50, H * 0.21 - 22);
  line(W * 0.50, H * 0.21, W * 0.50 + 16 * Math.cos(t * 0.8), H * 0.21 + 16 * Math.sin(t * 0.8));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if (c === 3 || c === 4) continue;
      const wx = W * 0.29 + c * 56;
      const wy = H * 0.34 + r * 55;
      const lit = (r + c + Math.floor(djBeatNum(t))) % 3 !== 0;
      fill(lit ? color(255, 225, 135, 215) : color(62, 78, 112, 180));
      noStroke();
      rect(wx, wy, 36, 34, 4);
    }
  }
  fill("#E8DCCB");
  stroke("#1C2536");
  strokeWeight(4);
  rect(W * 0.12, H * 0.44, 78, H * 0.32, 6);
  rect(W * 0.82, H * 0.44, 78, H * 0.32, 6);
  fill("#4A5678");
  rect(W * 0.11, H * 0.42, 98, 22, 4);
  rect(W * 0.81, H * 0.42, 98, 22, 4);
  fill("#FFF9EB");
  rect(W * 0.145, H * 0.48, 28, 145, 4);
  fill("#2C354D");
  noStroke();
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("青\n春\n学\n园", W * 0.159, H * 0.495);
  fill("#46485E");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.72, W, H * 0.28);
  stroke(255, 230, 185, 110);
  strokeWeight(4);
  for (let i = 0; i < 7; i++) {
    line(W * 0.15 + i * 230, H * 0.84, W * 0.22 + i * 230, H * 0.84);
  }
  fill("#FF9EBB");
  stroke("#1C2536");
  strokeWeight(3.5);
  for (let i = 0; i < 6; i++) {
    circle(80 + i * 75, 120 + (i % 2) * 35, 170 + (i % 3) * 25);
    circle(W - 80 - i * 75, 125 + (i % 2) * 35, 170 + (i % 3) * 25);
  }
}

function drawCampusStreetlamps(t, count = 5, yBase = H * 0.72, xStart = 210, xStep = 370) {
  const beatIdx = Math.floor(djBeatNum(t));
  const kick = djBeatKick(t, 2.8);
  for (let i = 0; i < count; i++) {
    const lx = xStart + i * xStep;
    const isActive = (beatIdx % count) >= i || (beatIdx % (count * 2)) >= i;
    const isCurrent = (beatIdx % count) === i;
    push();
    translate(lx, yBase);
    stroke("#1C2536");
    strokeWeight(4);
    fill("#36455E");
    rect(-6, -245, 12, 245, 3);
    rect(-22, -6, 44, 10, 3);
    line(-28, -238, 28, -238);
    const glowR = isCurrent ? 165 + 35 * kick : isActive ? 125 + 15 * kick : 60;
    noStroke();
    fill(255, 205, 105, isCurrent ? 95 : isActive ? 65 : 22);
    circle(0, -245, glowR);
    fill(255, 230, 150, isCurrent ? 165 : isActive ? 120 : 45);
    circle(0, -245, glowR * 0.52);
    stroke("#1C2536");
    strokeWeight(3);
    fill(isActive ? "#FFF3B0" : "#8FA0B8");
    circle(0, -245, 34 + (isCurrent ? 6 * kick : 0));
    pop();
  }
}

// 动态镜头抖动 + 呼吸缩放
function camPulse(localT, t) {
  const kick = djBeatKick(t, 3.2);
  const barK = djBarKick(t, 2.6);
  return { zoom: 1.0 + 0.018*kick + 0.01*barK, shakeX: Math.sin(t*18)*0.6*kick, shakeY: Math.cos(t*22)*0.4*kick };
}

// ─── S01 (0.00 – 15.74s): Intro Instrumental ────────────────────────────────
function s01_CampusGateIntro(t) {
  const localT = t;
  const kick = djBeatKick(t, 2.8);
  const ph = microPhase(localT, 2.8);
  const cp = camPulse(localT, t);
  push();
  translate(W/2, H/2);
  scale(cp.zoom);
  translate(-W/2 + cp.shakeX, -H/2 + cp.shakeY);

  drawCampusGateBackdrop(t, false);
  drawCampusStreetlamps(t, 4, H * 0.72, 290, 440);

  // Girl on balcony: every 2.8s change gesture
  let gPose = "bounce", gEyes="round", gMouth="o", gLook=-0.6;
  if (ph===1) { gPose="wave"; gMouth="smile"; }
  else if (ph>=2) { gPose="phone"; gEyes="happy"; gMouth="smile"; gLook=-0.2; }
  campusGirlClawd(W * 0.68, H * 0.45, 58 + 4*Math.sin(t*2), { t, pose: gPose, Look: gLook, eyes: gEyes, mouth: gMouth, blush: true });

  // Boy walking with subtle direction changes + arm swings
  const walkProg = clamp01(localT / 15.0);
  const bx = lerp(W*0.18, W*0.48, walkProg) + Math.sin(t*6)*3;
  let bPose="walk", bEyes="calm", bMouth="flat", bLook=0.35;
  if (ph===1) { bPose="wave"; bEyes="happy"; }
  else if (ph===2) { bPose="phone"; }
  else if (ph===3) { bPose="sway"; bEyes="happy"; bMouth="smile"; }
  else if (ph>=4) { bPose="bounce"; bEyes="happy"; bMouth="smile"; }
  campusBoyClawd(bx, H*0.80, 118, { t, pose: bPose, headphones: "on", Look: bLook + 0.1*Math.sin(t*3), eyes: bEyes, mouth: bMouth });

  // 远处飞鸟 / 无人机横穿 (每6秒一架)
  for (let k=0;k<2;k++) {
    const bx2 = ((t*90 + k*400) % (W+200)) -100;
    const by2 = 95 + k*35 + Math.sin(t*2+k)*6;
    push(); translate(bx2, by2); scale(0.7);
    fill("#1C2536"); noStroke();
    // simple bird
    const wing = Math.sin(t*12+k)*0.6;
    triangle(-10,0, 0, -4+wing*3, 10,0);
    pop();
  }

  if (localT > 0.5 && localT < 15.0) {
    const a = clamp01(localT - 0.5) * clamp01(15.0 - localT);
    push();
    translate(W*0.50, H*0.28);
    scale(1 + 0.025 * kick);
    fill(28, 62, 48, 232 * a);
    stroke(212, 162, 95, 245 * a);
    strokeWeight(6);
    rect(-330, -92, 660, 184, 18);
    noStroke();
    fill(255, 248, 230, 250 * a);
    textSize(48); textStyle(BOLD); textAlign(CENTER, CENTER);
    text("《 东 京 不 太 热 》", 0, -24);
    fill(255, 208, 125, 240 * a); textSize(24);
    text("封茗囧菌  ·  青春校园暗恋篇 (126 BPM 卡点 MV)", 0, 32);
    fill(185, 240, 210, 220 * a); textSize(16);
    text("词曲：Z新豪   |   主演：校园版 Clawd 学长 & 水手服学妹", 0, 68);
    pop();
  }
  drawSakuraPetals(t, 36, -42, 225);
  pop();
  drawCampusBeatBadge(t, "S01 · 樱花校门序幕");
}

// ─── S02 (15.74 – 30.90s): Verse 1A ──────────────────────────────────────
function s02_ClassroomAlbum(t) {
  const localT = t - 15.74;
  const kick = djBeatKick(t, 2.8);
  const ph = microPhase(localT, 2.6);
  const cp = camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);

  skyGrad("#232B45", "#3A4468", "#5E506E");
  for (let w = 0; w < 3; w++) {
    const wx = 95 + w * 420;
    fill("#1B233D"); stroke("#141824"); strokeWeight(5);
    rect(wx, 95, 360, 410, 8);
    fill("#FF9A76"); noStroke(); rect(wx + 8, 365, 344, 132);
    const lampOn = localT >= 7.2 ? (Math.floor(djBeatNum(t)) >= w) : (w === 0);
    const lx = wx + 180; const ly = 335;
    if (lampOn) { fill(255, 210, 110, 95 + 45 * kick); circle(lx, ly, 160 + 25 * kick); }
    stroke("#141824"); strokeWeight(4); line(lx, ly, lx, 497);
    fill(lampOn ? "#FFF2A6" : "#6A7896"); circle(lx, ly, 32 + 5 * kick);
  }
  fill("#1F4738"); stroke("#B88652"); strokeWeight(7); rect(W*0.68, 110, 520, 340, 8);
  fill(255,255,255,180); noStroke(); textSize(22); textStyle(BOLD); textAlign(LEFT, TOP);
  // 黑板粉笔字每3秒换行高亮
  const chalkHi = ph % 3;
  fill(chalkHi===0? "#FFF59A":"#FFFFFF"); text("值日生：Clawd  今日自习：高等数学", W*0.70, 145);
  fill(chalkHi===1? "#FFF59A":"#FFFFFF"); text("倒计时：距离去年夏天已过 " + (365+Math.floor(t/2)) + " 天", W*0.70, 180);
  fill(chalkHi===2? "#FFF59A":"#FFD0A0"); text(ph===2? "♥ 难忘的回忆 单曲循环中..." : "♥ 难忘的回忆", W*0.70, 215);

  fill("#4A372C"); stroke("#1C2536"); strokeWeight(3); rect(0, H*0.68, W, H*0.32);
  fill("#C89462"); rect(W*0.22, H*0.66, 460, 32, 6);
  fill("#7A5638"); rect(W*0.25, H*0.69, 400, 180, 4);
  // 水杯蒸汽
  fill("#FFF5E6"); stroke("#1C2536"); strokeWeight(3);
  rect(W*0.48, H*0.60, 46, 58, 8);
  noFill();
  for (let s=0;s<4;s++){ const sp=((t*0.6+s*0.25)%1); stroke(255,240,220,(1-sp)*190); strokeWeight(3.5); const sx=W*0.503+Math.sin(t*2.5+s)*18; const sy=H*0.59-sp*130; arc(sx,sy,28+sp*25,36,0,PI); }

  // 桌面小摆件：每2.6秒切换 男主动作
  let bPose="typing", bMode="normal", bEyes="focused", bMouth="flat", bLook=0.45;
  if (ph===0) { bPose="typing"; }
  else if (ph===1) { bPose="phone"; bMode="normal"; bEyes="sad"; } // 盯手机发呆
  else if (ph===2) { bPose="sway"; bEyes="sad"; bMouth="wavy"; } // 叹气摇摆
  else if (ph===3) { bPose="aloof"; bMode="aloof"; bEyes="sad"; } // 冰块脸
  else { bPose="selfhold"; bMode="selfHold"; bEyes="sad"; bMouth="wavy"; }
  campusBoyClawd(W*0.34, H*0.72, 128 + 3*Math.sin(t*3), { t, pose: bPose, headphones: "neck", Look: bLook+0.1*Math.sin(t*2), eyes: bEyes, mouth: bMouth, mode: bMode });

  // 窗帘微风摆动
  push(); fill(255,255,255,38); noStroke();
  for(let c=0;c<3;c++){ const wx=95+c*420; const swayC=Math.sin(t*1.2+c)*8; rect(wx+300+swayC, 105, 18, 390, 6); }
  pop();

  drawPhoneAlbumModal(W*0.72, H*0.50, 0.96, t, localT);
  pop();
  drawCampusBeatBadge(t, "S02 · 晚自习教室与相册");
}

// ─── S03 (30.90 – 46.30s): Pre-Chorus 1 ────────────────────────────────────
function s03_BoulevardCouples(t) {
  const localT = t - 30.90;
  const kick = djBeatKick(t, 2.8);
  const isSelfHold = localT >= 11.2;
  const ph = microPhase(localT, 2.5);
  const cp = camPulse(localT,t);
  const z = isSelfHold ? lerp(1.0, 1.2, easeInOut(clamp01((localT - 11.2) / 1.2))) : 1.0;
  push();
  translate(W*0.38, H*0.68); scale(z*cp.zoom); translate(-W*0.38, -H*0.68); translate(cp.shakeX, cp.shakeY);
  skyGrad("#2D325A", "#7A527A", "#F2A47E");
  drawCampusStreetlamps(t, 5, H*0.70, 180, 380);
  fill("#5E4433"); stroke("#1C2536"); strokeWeight(3); rect(160, H*0.45, 320, 155, 8);
  fill("#FFF8E8"); rect(176, H*0.47, 288, 122, 4);
  fill("#2C354D"); noStroke(); textSize(18); textStyle(BOLD); textAlign(CENTER, TOP);
  // 公告栏海报每2.5秒轮播
  const posters=["【吉他社招新】","【动漫社COS祭】","【天文社·今晚流星】","【篮球赛决赛】"];
  text("【校园社团招新公告栏】\n"+posters[ph%posters.length], 320, H*0.50);

  fill("#3C4056"); stroke("#1C2536"); strokeWeight(3); rect(0, H*0.70, W, H*0.30);
  // 路面落叶随风
  fill("#E8A85C"); noStroke();
  for(let l=0;l<6;l++){ const lx=((l*310 - localT*70)% (W+100) +W+100)%(W+100)-50; const ly=H*0.78 + Math.sin(t*2+l)*12; push(); translate(lx,ly); rotate(t*1.8+l); ellipse(0,0,18,10); pop(); }

  // 背景人群：2.5秒一轮不同的走法
  for (let i=0;i<4;i++){
    const cx=((220+i*430-localT*52)%(W+200)+W+200)%(W+200)-100;
    const pWalk = (ph+i)%2===0? "walk":"bounce";
    clawd(cx, H*0.71, 13.5, { t:t+i, col:"#546280", dk:"#364058", lt:"#7484A6", tint:null, tintK:0, pose:pWalk, eyes:"calm", mouth:"flat" });
    // 每个人头顶偶尔冒对话泡
    if ((ph+i)%3===0){ fill("#FFF8E8"); stroke("#1C2536"); strokeWeight(1.5); const bx=cx, by=H*0.62; rect(bx-18, by-12, 36,14,6); fill("#2C354D"); noStroke(); textSize(9); textAlign(CENTER,CENTER); text("w", bx, by-5); }
  }
  const coupleX = lerp(W*0.86, W*0.66, clamp01(localT / 15.0)) + 0.02*Math.sin(t*1.5);
  // 情侣每2.5秒换一个小互动
  let coupleScale=96;
  if (ph===2) coupleScale=100; // 靠近
  drawCampusCouple(coupleX, H*0.77, coupleScale, t, -1);

  let bPose="walk", bMode="normal", bLook=0.75, bEyes="focused", bMouth="flat";
  if (ph===0){ bPose="walk"; }
  else if (ph===1){ bPose="phone"; bLook=0.5; bEyes="happy"; bMouth="smile"; } // 听歌点头
  else if (ph===2){ bPose="sway"; bEyes="sad"; } // 偷看情侣
  else if (isSelfHold){ bPose="selfhold"; bMode="selfHold"; bEyes="sad"; bMouth="wavy"; bLook=0; }
  else { bPose="aloof"; bMode="aloof"; bEyes="narrow"; }
  campusBoyClawd(W*0.35, H*0.80, 132, { t, pose:bPose, headphones:"on", mode:bMode, Look:bLook+0.15*Math.sin(t*2), eyes:bEyes, mouth:bMouth });

  if (isSelfHold){
    push(); translate(W*0.35, H*0.50); scale(1+0.08*kick);
    fill("#FFF5D6"); stroke("#1C2536"); strokeWeight(3); rect(-145,-28,290,56,16);
    fill("#D94343"); noStroke(); textSize(20); textStyle(BOLD); textAlign(CENTER,CENTER);
    text("【左手牵右手 · 单身狗的倔强】",0,0); pop();
  }
  drawSakuraPetals(t, 22, -32, 185);
  pop();
  drawCampusBeatBadge(t, "S03 · 放学林荫大道");
}

// ─── S04 (46.30 – 61.35s): Chorus 1A Dorm QQ ─────────────────────────────
function s04_DormQQPopup(t) {
  const localT = t - 46.30;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT >= 6.8 && localT < 11.0;
  const isDumped  = localT >= 11.0;
  const ph = microPhase(localT, 2.4);
  const cp = camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#1A2238", "#283655", "#384B6E");
  fill("#6E4E38"); stroke("#1C2536"); strokeWeight(4); rect(70, 90, 290, H*0.62, 8);
  const bookCols=["#E05A47","#4884C8","#58A87C","#F0B849","#9B7EDE"];
  for(let b=0;b<10;b++){ fill(bookCols[b%bookCols.length]); rect(92+b*24,150,20,78,3); }
  // 书架上小摆件随拍晃动
  push(); translate(92+5*24+10, 128); rotate(0.05*Math.sin(t*8)); fill("#FFD66B"); stroke("#1C2536"); strokeWeight(1.5); rect(-10,-8,20,16,3); pop();
  fill("#8C6240"); rect(0, H*0.72, W, H*0.28);
  fill("#B8885C"); rect(0, H*0.70, W, 28);
  fill("#D8E2F0"); rect(W*0.34, H*0.56, 190, 128, 10);
  fill("#1C2536"); rect(W*0.31, H*0.68, 250, 18, 6);
  // 桌上饮料罐随拍抖
  push(); translate(W*0.46, H*0.68); rotate(0.06*Math.sin(t*10)); fill("#FF6B6B"); stroke("#1C2536"); strokeWeight(2); rect(-12,-18,24,36,6); fill("#FFF"); noStroke(); textSize(10); textAlign(CENTER,CENTER); text("可乐",0,0); pop();

  let bPose="bounce", bMode="normal", bEyes="starstruck", bMouth="open";
  if (localT<3.4){ bPose= ph%2===0? "hop":"roof"; }
  else if (isSolving){ bPose="typing"; bMode="glasses"; bEyes="focused"; bMouth="smirk"; }
  else if (isDumped){ bPose= ph%2===0? "shrug":"aloof"; bMode="shock"; bEyes="dead"; bMouth="wavy"; }
  else { bPose="excited"; }
  // 窗外夜景灯每拍闪
  fill("#FFD66B", 80+40*kick); noStroke(); for(let w=0;w<3;w++) circle(W-120-w*50, 180, 18+6*kick);
  campusBoyClawd(W*0.22, H*0.74, 136, { t, pose:bPose, headphones:"neck", mode:bMode, eyes:bEyes, mouth:bMouth });

  drawQQChatModal(W*0.66, H*0.43, t, localT, 1);
  pop();
  drawCampusBeatBadge(t, "S04 · 宿舍叮叮当当Q");
}

// ─── S05 (61.35 – 77.30s): Hallway Aloof + Heartbreak ────────────────────
function s05_HallwayAloofHeartbreak(t) {
  const localT = t - 61.35;
  const kick = djBeatKick(t, 2.8);
  const isHeartbreak = localT >= 11.2;
  const ph = microPhase(localT, 2.7);
  const cp = camPulse(localT,t);
  if (!isHeartbreak){
    push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
    skyGrad("#D8E8F8", "#F4F8FF", "#FFEBD6");
    for(let i=0;i<4;i++){ fill("#8EB8E5"); stroke("#1C2536"); strokeWeight(4); rect(110+i*280,110,210,290,8);
      // 窗外树影晃动
      fill("#6EBF8A", 60); noStroke(); const sway=Math.sin(t*1.5+i)*12; ellipse(110+i*280+105+sway, 220, 90, 140);
    }
    for(let k=0;k<5;k++){ fill("#6E88A8"); stroke("#1C2536"); strokeWeight(3); rect(W*0.68+k*95,160,88,360,4);
      // 储物柜门每2.7秒开关一个
      if ((ph+k)%5===0){ fill("#FFD66B"); rect(W*0.68+k*95+10, 200, 68, 80,4); }
    }
    fill("#E6D5C3"); stroke("#1C2536"); strokeWeight(3); rect(0, H*0.68, W, H*0.32);
    // 地面反光随拍
    fill(255,255,255, 18+10*kick); noStroke(); rect(0, H*0.78, W, 22);
    stroke(255,105,135,200); strokeWeight(3); drawingContext.setLineDash([12,10]); line(W*0.34,H*0.74,W*0.68,H*0.74); drawingContext.setLineDash([]);
    fill("#FF4D6D"); noStroke(); textSize(18); textStyle(BOLD); textAlign(CENTER,BOTTOM);
    const distTexts=["← 保持安全暗恋距离 2.5m (内心狂跳 180 BPM) →","← 假装不在意其实余光全在她 →","← 心跳漏一拍 但表情管理满分 →"];
    text(distTexts[ph%3], W*0.51, H*0.72);

    let bPose="bounce", bMode="aloof", bLook=-0.6, bEyes="narrow", bMouth="flat";
    if (ph===0){ bPose="aloof"; bMode="aloof"; }
    else if (ph===1){ bPose="walk"; bMode="aloof"; bLook=-0.2; }
    else if (ph===2){ bPose="sway"; bEyes="sad"; bMouth="flat"; }
    else { bPose="aloof"; bEyes="narrow"; }
    campusBoyClawd(W*0.30, H*0.78, 134, { t, pose:bPose, headphones:"neck", mode:bMode, Look:bLook+0.1*Math.sin(t*2), eyes:bEyes, mouth:bMouth });
    // 女生动作丰富
    let gPose="walk", gLook=-0.4, gEyes="round", gMouth="o";
    if (ph===1){ gPose="wave"; gEyes="happy"; gMouth="smile"; }
    else if (ph===2){ gPose="phone"; gEyes="happy"; }
    campusGirlClawd(W*0.70, H*0.78, 126, { t, pose:gPose, Look:gLook, eyes:gEyes, mouth:gMouth, blush:true, bag: ph%2===0 });

    // 走廊路过同学每3秒换人
    if (ph%2===0){ rivalBoyClawd(W*0.50, H*0.78, 100, { t, pose:"walk", eyes:"calm", mouth:"flat" }); }
    pop();
  } else {
    const hbT = localT - 11.2;
    const z = lerp(1.0, 1.16, clamp01(hbT/3.5)) +0.015*kick;
    push(); translate(W/2,H/2); scale(z); translate(-W/2,-H/2); translate(cp.shakeX, cp.shakeY);
    skyGrad("#2A244D", "#6E3D66", "#D97B78");
    fill("#39425A"); stroke("#1C2536"); strokeWeight(3); rect(0,H*0.70,W,H*0.30);
    fill("#6B4230"); rect(W*0.66,H*0.32,65,H*0.40);
    fill("#FF9EBB"); circle(W*0.69,H*0.26,360); circle(W*0.58,H*0.32,260); circle(W*0.79,H*0.32,260);
    // 风吹樱花
    drawSakuraPetals(t, 40, -55, 200);
    campusGirlClawd(W*0.60, H*0.76, 118, { t, pose: ph%2===0?"walk":"bounce", Look:0.4, eyes:"happy", mouth:"smile", blush:true });
    rivalBoyClawd(W*0.75, H*0.76, 122, { t, pose:"walk", Look:-0.4, eyes:"happy", mouth:"smile" });
    fill("#8C4A3E"); stroke("#1C2536"); strokeWeight(4); rect(0,H*0.18,W*0.22,H*0.62);
    // 男主心碎：2秒一切换表情
    let hbEyes="sad", hbMouth="wavy", hbPose="shrug";
    if (Math.floor(hbT/2)%2===0){ hbEyes="cry"; hbPose="heartbreak"; }
    campusBoyClawd(W*0.26, H*0.79, 130, { t, pose:hbPose, headphones:"neck", mode:"shock", Look:0.8, eyes:hbEyes, mouth:hbMouth });
    push(); translate(W*0.26,H*0.44); scale(1+0.18*kick);
    fill("#FF4D6D"); stroke("#1C2536"); strokeWeight(3.5); circle(-22,-8,44); circle(22,-8,44); triangle(-42,2,42,2,0,48);
    stroke("#FFF8E8"); strokeWeight(4); line(0,-24,-8,-4); line(-8,-4,8,12); line(8,12,-4,38); pop();
    pop();
  }
  drawCampusBeatBadge(t, "S05 · 高冷伪装与心碎");
}

// ─── S06 (77.30 – 92.56s): Rooftop ───────────────────────────────────────
function s06_RooftopStreetlamps(t) {
  const localT = t - 77.30;
  const kick = djBeatKick(t, 2.8);
  const ph = microPhase(localT, 2.5);
  const cp = camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#13182E", "#283560", "#6B4E72");
  drawCampusStreetlamps(t, 6, H*0.66, 160, 315);
  fill("#3B455E"); stroke("#1C2536"); strokeWeight(4); rect(0,H*0.68,W,H*0.32);
  stroke(190,210,235,130); strokeWeight(2);
  for(let x=0;x<W;x+=48){ line(x,H*0.36,x+90,H*0.68); line(x+90,H*0.36,x,H*0.68); }
  stroke("#232B3E"); strokeWeight(6); line(0,H*0.36,W,H*0.36);
  // 天台风向旗
  push(); translate(W*0.85, H*0.38); rotate(Math.sin(t*1.8)*0.15); fill("#FF6B6B"); stroke("#1C2536"); strokeWeight(2); rect(0,-8,60,18,4); pop();
  // 飞机划过
  const planeX = ((t*120)% (W+300))-150; fill(255,255,255,180); noStroke(); circle(planeX, 90, 6); circle(planeX-12,90,4); circle(planeX+12,90,4);

  let bPose="bounce", bEyes="sad", bLook=0.5;
  if (ph===0){ bPose="think"; bEyes="sad"; }
  else if (ph===1){ bPose="phone"; bEyes="sad"; }
  else if (ph===2){ bPose="sway"; bEyes="narrow"; }
  else if (ph===3){ bPose="aloof"; bEyes="sad"; }
  else { bPose="walk"; bEyes="calm"; }
  campusBoyClawd(W*0.30, H*0.78, 135, { t, pose:bPose, headphones:"on", Look:bLook+0.12*Math.sin(t*2), eyes:bEyes, mouth:"flat" });

  for(let p=0;p<3;p++){
    const px=W*0.55+p*185; const py=H*0.32+Math.sin(t*2.2+p*1.4)*18;
    const fade= localT>8.0? clamp01(1.0-(localT-8.0-p*1.5)/4.5):1.0;
    push(); translate(px,py); rotate((p-1)*0.12+0.04*Math.sin(t*3+p)); scale(1+0.04*kick);
    fill(255,250,240,235*fade); stroke(28,37,54,235*fade); strokeWeight(3); rect(-68,-82,136,164,8);
    fill(72,132,200,210*fade); noStroke(); rect(-56,-68,112,102,4); fill(232,120,90,220*fade); circle(0,-16,38);
    fill(60,50,50,220*fade); textSize(13); textAlign(CENTER,CENTER); text(p===0?"去年夏天·课堂":p===1?"去年夏天·操场":"去年夏天·校门",0,56); pop();
  }
  pop();
  drawCampusBeatBadge(t, "S06 · 教学楼天台夜风");
}

// ─── S07 (92.56 – 107.75s): Night Track ──────────────────────────────────
function s07_NightTrackWalk(t) {
  const localT = t - 92.56;
  const kick = djBeatKick(t, 2.8);
  const isSelfHold = localT >= 11.3;
  const ph = microPhase(localT, 2.6);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#141B30", "#24345A", "#3B4F78");
  for(const fx of [260, W-260]){ stroke("#1C2536"); strokeWeight(6); line(fx,110,fx,H*0.62); fill("#FFF6B8"); rect(fx-48,82,96,34,6); noStroke(); fill(255,245,180,45+30*kick); triangle(fx,110,fx-260,H*0.68,fx+260,H*0.68); }
  fill("#2D6B4F"); stroke("#1C2536"); strokeWeight(3); rect(0,H*0.56,W,H*0.14);
  fill("#B84A3E"); rect(0,H*0.70,W,H*0.30);
  stroke(255,255,255,190); strokeWeight(3); line(0,H*0.76,W,H*0.76); line(0,H*0.84,W,H*0.84); line(0,H*0.92,W,H*0.92);
  // 跑道上其他夜跑学生
  for(let i=0;i<3;i++){ const rx=((t*110+i*280)%(W+200))-100; clawd(rx, H*0.82, 11, {t:t+i, col:"#FFD66B", dk:"#B89330", lt:"#FFE8A0", pose:"run", eyes:"happy", mouth:"smile"}); }
  drawCampusCouple(W*0.74, H*0.76, isSelfHold? 92: 94+2*Math.sin(t*3), t, -1);
  let bPose=isSelfHold?"selfhold":"walk", bMode=isSelfHold?"selfHold":"normal", bLook=isSelfHold?0:0.7, bEyes=isSelfHold?"sad":"focused", bMouth=isSelfHold?"wavy":"flat";
  if (!isSelfHold){
    if (ph===0) bPose="walk";
    else if (ph===1) bPose="run";
    else if (ph===2) bPose="phone";
    else bPose="sway";
  }
  campusBoyClawd(W*0.34, H*0.81, 134, { t, pose:bPose, headphones:"on", mode:bMode, Look:bLook, eyes:bEyes, mouth:bMouth });
  pop();
  drawCampusBeatBadge(t, "S07 · 晚间操场塑胶跑道");
}

// ─── S08 (107.75 – 122.90s): Library ──────────────────────────────────────
function s08_LibraryQQSolve(t) {
  const localT = t - 107.75;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT >= 6.8 && localT < 11.2;
  const isDumped  = localT >= 11.2;
  const ph = microPhase(localT, 2.4);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#2B211B", "#4A372B", "#6E523F");
  for(let s=0;s<4;s++){ const sx=80+s*450; fill("#523826"); stroke("#1C2536"); strokeWeight(4); rect(sx,70,380,H*0.62,6);
    for(let r=0;r<3;r++){ fill("#3B271A"); rect(sx+16,95+r*135,348,110);
      for(let b=0;b<11;b++){ fill(b%3===0?"#C84B31":b%3===1?"#3D73A8":"#4E8C6F"); rect(sx+24+b*30,112+r*135,24,92,2); }
    }
  }
  push(); translate(W*0.23,125); scale(localT<3.4?1+0.12*kick:1);
  fill("#FFF8E8"); stroke("#1C2536"); strokeWeight(3); rect(-115,-26,230,52,10);
  fill("#C83E3E"); noStroke(); textSize(20); textStyle(BOLD); textAlign(CENTER,CENTER); text("【图书馆自习室 · 请保持安静】",0,0); pop();
  fill("#7A5234"); stroke("#1C2536"); strokeWeight(3); rect(0,H*0.72,W,H*0.28);
  fill("#D4AF37"); rect(140,H*0.56,18,110); fill("#2E8B57"); arc(149,H*0.56,110,70,PI,TWO_PI,CHORD);
  // 台灯光晕随拍
  fill(255,240,150, 30+20*kick); noStroke(); ellipse(220, H*0.72, 300+40*kick, 80);
  // 复习资料翻页动画每2.4秒
  push(); translate(W*0.38, H*0.62); rotate(0.08*Math.sin(t*2)); fill("#FFF9E8"); stroke("#1C2536"); strokeWeight(2); rect(-40,-22,80,44,4); fill("#2C354D"); noStroke(); textSize(11); textAlign(CENTER,CENTER); text(ph%2===0?"高数 P32":"错题本",0,0); pop();

  let bPose="typing", bMode="normal", bEyes="focused", bMouth="flat";
  if (localT<3.4){ bPose= ph%2===0?"hop":"roof"; bEyes="starstruck"; bMouth="open"; }
  else if (isSolving){ bPose="typing"; bMode="glasses"; bEyes="focused"; bMouth="smirk"; }
  else if (isDumped){ bPose="shrug"; bMode="shock"; bEyes="dead"; bMouth="wavy"; }
  campusBoyClawd(W*0.24, H*0.75, 134, { t, pose:bPose, headphones:"neck", mode:bMode, eyes:bEyes, mouth:bMouth });
  drawQQChatModal(W*0.66, H*0.43, t, localT, 2);
  // 管理员阿姨路过
  if (ph===2){ campusGirlClawd(W*0.88, H*0.76, 88, {t, pose:"walk", col:"#8A6EAA", dk:"#5A3E7A", lt:"#B89AD4", eyes:"narrow", mouth:"flat"}); }
  pop();
  drawCampusBeatBadge(t, "S08 · 图书馆解题大作战");
}

// ─── S09 (122.90 – 138.60s): Rain Corridor ────────────────────────────────
function s09_CourtyardUmbrella(t) {
  const localT = t - 122.90;
  const kick = djBeatKick(t, 2.8);
  const isTogether = localT >= 11.0;
  const ph = microPhase(localT, 2.6);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#243048", "#425878", "#768EA8");
  fill("#D8D2C5"); stroke("#1C2536"); strokeWeight(4); rect(0,0,W,88);
  for(let p=0;p<4;p++) rect(120+p*520,88,54,H*0.62);
  fill("#39465E"); rect(0,H*0.70,W,H*0.30);
  // 雨线 + 水洼涟漪
  stroke(195,225,255,135); strokeWeight(2);
  for(let r=0;r<40;r++){ const rx=((r*97 - t*180)%W+W)%W; const ry=((r*61+t*520)%H); line(rx,ry,rx-12,ry+32); }
  // 水洼反光
  noStroke(); for(let w=0;w<5;w++){ const wx=200+w*340; const wy=H*0.86; fill(180,210,255, 35+15*Math.sin(t*3+w)); ellipse(wx, wy, 120+20*Math.sin(t*2+w), 18); }

  // 雨伞每2秒轻转
  let bMode=isTogether?"shock":"aloof", bEyes=isTogether?"sad":"narrow", bMouth=isTogether?"wavy":"flat", bPose="bounce";
  if (!isTogether && ph===2){ bPose="phone"; bEyes="sad"; }
  campusBoyClawd(W*0.26, H*0.78, 132, { t, pose:bPose, headphones:"neck", mode:bMode, Look:0.6, eyes:bEyes, mouth:bMouth });
  push(); translate(W*0.35, H*0.62); rotate(0.15+0.04*Math.sin(t*3)); stroke("#1C2536"); strokeWeight(4); line(0,-60,0,85); fill("#FFD24C"); arc(0,-55,150,95,PI,TWO_PI,CHORD); pop();

  if (!isTogether){
    let gPose="bounce", gEyes="round", gMouth="flat";
    if (ph===1){ gPose="phone"; gEyes="happy"; gMouth="smile"; }
    else if (ph===2){ gPose="shiver"; gEyes="sad"; }
    campusGirlClawd(W*0.72, H*0.78, 124, { t, pose:gPose, Look:-0.4, eyes:gEyes, mouth:gMouth, blush:true });
    // 伞架上其他伞
    for(let u=0;u<3;u++){ push(); translate(W*0.62+u*22, H*0.72); rotate(-0.1); stroke("#1C2536"); strokeWeight(2); line(0,0,0,-28); fill(["#FF6B6B","#66D9B8","#8A7DE8"][u]); arc(0,-26,30,18,PI,TWO_PI,CHORD); pop(); }
  } else {
    push(); translate(W*0.68,H*0.77); stroke("#1C2536"); strokeWeight(5); line(0,-210,0,-20); fill("#66D9B8"); arc(0,-205,310,145,PI,TWO_PI,CHORD);
    campusGirlClawd(-62,0,114,{ t, pose:"walk", Look:0.4, eyes:"happy", mouth:"smile" });
    rivalBoyClawd(62,0,118,{ t, pose:"walk", Look:-0.4, eyes:"happy", mouth:"smile" }); pop();
  }
  pop();
  drawCampusBeatBadge(t, "S09 · 校园雨廊与黄伞");
}

// ─── S10 (138.60 – 153.76s): Music Room ──────────────────────────────────
function s10_MusicRoomTimeline(t) {
  const localT = t - 138.60;
  const kick = djBeatKick(t, 2.8);
  const ph = microPhase(localT, 2.4);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#1E1936", "#4B2E59", "#B86B77");
  fill("#4E3629"); stroke("#1C2536"); strokeWeight(3); rect(0,H*0.72,W,H*0.28);
  // 墙上音乐海报每2.4秒换
  const posters2=["♪ 周杰伦 · 晴天","♪ 陈奕迅 · 十年","♪ 林俊杰 · 江南"];
  push(); translate(W*0.22, 160); fill("#FFF8E8"); stroke("#1C2536"); strokeWeight(3); rect(-80,-50,160,100,6); fill("#2C354D"); noStroke(); textSize(14); textAlign(CENTER,CENTER); text(posters2[ph%3],0,0); pop();
  // 钢琴
  fill("#1C2536"); rect(80, H*0.52, 260, 120,6); fill("#FFF"); for(let k=0;k<7;k++) rect(92+k*34, H*0.56, 30, 80,2); fill("#1C2536"); for(let k of [1,2,4,5]) rect(92+k*34-6, H*0.56, 12, 50,2);

  push(); translate(W*0.64,H*0.42);
  push(); rotate(t*1.35); fill("#181C28"); stroke("#FFD266"); strokeWeight(4); circle(0,0,360+12*kick); noFill(); stroke(255,255,255,45); strokeWeight(2); circle(0,0,310); circle(0,0,260); circle(0,0,210); pop();
  fill("#FFF3D6"); stroke("#1C2536"); strokeWeight(3); circle(0,0,168);
  const girlFade = localT>8.0? clamp01(1.0-(localT-8.0)/5.5):1.0;
  campusBoyClawd(-34,24,46,{ t, headphones:"on", eyes:"happy", mouth:"smile" });
  if (girlFade>0.05){ push(); drawingContext.globalAlpha=girlFade; campusGirlClawd(34,24,44,{ t, eyes:"happy", mouth:"smile", blush:true }); pop(); }
  push(); translate(0,222); scale(1+0.06*kick);
  fill("#232B45"); stroke("#FFD266"); strokeWeight(3); rect(-210,-28,420,56,28);
  fill("#FFE680"); noStroke(); textSize(20); textStyle(BOLD); textAlign(CENTER,CENTER);
  const barTxts=["【校园时间轴 · 单曲循环 02:36 / 03:39】","♪ 熟悉的音乐 是我们曾经那一段","♪ 你已经淡出 在我时间轴"];
  text(barTxts[ph%3],0,0); pop();
  pop();
  const turnProps = localT < 4.5 ? turn(localT, 0.2, 4.2, 0, 1.0) : { view: "q" };
  // 转身后每2.4秒换表情
  let tEyes="calm", tMouth="flat"; if (ph===1){ tEyes="happy"; tMouth="smile"; } else if (ph===2){ tEyes="sad"; tMouth="wavy"; }
  campusBoyClawd(W*0.25, H*0.78, 138, { t, ...turnProps, headphones:"on", eyes:tEyes, mouth:tMouth });
  drawSakuraPetals(t, 30, -35, 210);
  pop();
  drawCampusBeatBadge(t, "S10 · 音乐教室单曲循环");
}

// ─── S11 (153.76 – 169.14s): Festival ────────────────────────────────────
function s11_FestivalLanternQQ(t) {
  const localT = t - 153.76;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT>=6.8 && localT<11.2; const isDumped=localT>=11.2;
  const ph=microPhase(localT,2.5);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#16132B","#31224F","#6B3860");
  stroke("#1C2536"); strokeWeight(3); line(0,115,W,145);
  for(let i=0;i<11;i++){ const lx=95+i*172; const ly=115+(i/10)*30+Math.sin(t*4+i)*5;
    const isBeat=(Math.floor(djBeatNum(t))+i)%2===0; noStroke(); fill(255,190,90,isBeat?120+60*kick:45); circle(lx,ly+28,92+20*kick);
    stroke("#1C2536"); strokeWeight(3); fill(i%2===0?"#FF5268":"#FFF2C2"); ellipse(lx,ly+28,46,58);
    // 灯笼穗随风
    noStroke(); fill("#FFD66B"); rect(lx-6, ly+56, 12, 10+4*Math.sin(t*3+i),3);
  }
  // 小吃摊位
  fill("#7A492E"); stroke("#1C2536"); strokeWeight(4); rect(75,H*0.45,360,H*0.30,6);
  fill("#E84A5F"); rect(60,H*0.42,390,44,6); fill("#FFF8E8"); noStroke(); textSize(22); textStyle(BOLD); textAlign(CENTER,CENTER); text("【校园文化祭 · 学长万能解题站】",255,H*0.442);
  fill("#322C42"); stroke("#1C2536"); strokeWeight(3); rect(0,H*0.72,W,H*0.28);
  // 逛祭典的学生
  for(let i=0;i<3;i++){ const cx=((t*40+i*300)%(W+200))-100; clawd(cx, H*0.81, 12, {t:t+i*0.5, col:"#FFE066", dk:"#B89A20", lt:"#FFF5AA", pose:"bounce", eyes:"happy", mouth:"smile", hat: ph%2===0?"cap":null}); }
  let bPose="bounce", bMode="normal", bEyes="starstruck", bMouth="open";
  if (localT<3.4){ bPose= ph%2===0?"hop":"roof"; }
  else if (isSolving){ bPose="typing"; bMode="glasses"; bEyes="focused"; bMouth="smirk"; }
  else if (isDumped){ bPose="shrug"; bMode="shock"; bEyes="dead"; bMouth="wavy"; }
  campusBoyClawd(W*0.24,H*0.76,136,{ t, pose:bPose, headphones:"neck", mode:bMode, eyes:bEyes, mouth:bMouth });
  drawQQChatModal(W*0.66,H*0.45,t,localT,3);
  pop();
  drawCampusBeatBadge(t, "S11 · 校园文化祭夜街");
}

// ─── S12 (169.14 – 184.60s): Fireworks ───────────────────────────────────
function s12_ClocktowerFireworks(t) {
  const localT = t - 169.14;
  const isTogether=localT>=11.2;
  const ph=microPhase(localT,2.6);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#0F152B","#222E56","#4E3868");
  const fwCenters=[[W*0.28,H*0.26,"#FF6B8B"],[W*0.52,H*0.20,"#FFE066"],[W*0.76,H*0.25,"#66E8FF"]];
  for(let f=0;f<fwCenters.length;f++){ const [fx,fy,fcol]=fwCenters[f]; const fp=((t*0.85+f*0.33)%1); const rMax=60+fp*130; stroke(fcol); strokeWeight(3.2*(1-fp*0.6)); for(let a=0;a<12;a++){ const ang=(a*TWO_PI)/12; line(fx+Math.cos(ang)*(rMax*0.25), fy+Math.sin(ang)*(rMax*0.25), fx+Math.cos(ang)*rMax, fy+Math.sin(ang)*rMax); } }
  fill("#2C354D"); stroke("#1C2536"); strokeWeight(4); rect(0,H*0.70,W,H*0.30);
  // 观星情侣
  for(let i=0;i<2;i++){ const ox=W*0.55+i*140; clawd(ox, H*0.74, 10, {t:t+i, col:"#9B7EDE", dk:"#5A3AA0", lt:"#CAB8FF", pose:"bounce", eyes:"happy", mouth:"smile"}); }

  let bPose="bounce", bMode=isTogether?"shock":"aloof", bEyes=isTogether?"sad":"narrow", bMouth=isTogether?"wavy":"flat";
  if (!isTogether){
    if (ph===0){ bPose="aloof"; }
    else if (ph===1){ bPose="sway"; bEyes="happy"; bMouth="smile"; }
    else if (ph===2){ bPose="phone"; }
  } else { bPose="heartbreak"; }
  campusBoyClawd(W*0.28,H*0.78,134,{ t, pose:bPose, headphones:"on", mode:bMode, Look:0.6, eyes:bEyes, mouth:bMouth });
  if (!isTogether){
    let gPose= ph===1?"wave":"bounce"; campusGirlClawd(W*0.70,H*0.78,124,{ t, pose:gPose, Look:-0.4, eyes:"sparkle", mouth:ph===1?"smile":"o", blush:true });
  } else {
    campusGirlClawd(W*0.64,H*0.78,118,{ t, pose:"walk", Look:0.4, eyes:"happy", mouth:"smile" });
    rivalBoyClawd(W*0.78,H*0.78,122,{ t, pose:"walk", Look:-0.4, eyes:"happy", mouth:"smile" });
  }
  pop();
  drawCampusBeatBadge(t, "S12 · 钟楼烟花夜空");
}

// ─── S13 (184.60 – 199.70s): Graduation ──────────────────────────────────
function s13_GraduationChalkboard(t) {
  const localT = t - 184.60;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT>=6.8 && localT<11.2;
  const ph=microPhase(localT,2.5);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  skyGrad("#3E2B47","#8F4F5E","#F5A872");
  fill("#1E4738"); stroke("#B88652"); strokeWeight(8); rect(90,85,W-180,410,12);
  fill(255,248,225,230); noStroke(); textSize(38); textStyle(BOLD); textAlign(LEFT,TOP); text("毕业快乐 · 青春不散场",135,125);
  fill(255,210,130,215); textSize(22);
  const chalkLines=["「明明心里很喜欢，却保持着距离」\n—— 致我们单曲循环的那个夏天","「假装正经帮她把问题都摆平」\n—— 学长万能解题中","「直到有天看见她和别人在一起」\n—— 心碎也要优雅转身"];
  text(chalkLines[ph%3],135,190);
  // 黑板上粉笔画每2.5秒换
  push(); translate(W-260, 380); scale(0.9); noFill(); stroke(255,255,255,180); strokeWeight(2.5); if (ph%2===0){ circle(0,0,60); circle(0,0,40); } else { for(let i=0;i<5;i++) line(-30+i*15,-20, -10+i*15,20); } pop();
  // 彩带气球
  for(let b=0;b<6;b++){ const bx=160+b*160; const by=120+Math.sin(t*2+b)*12; fill(["#FF6B6B","#FFE066","#66E8FF","#9B7EDE"][b%4]); noStroke(); circle(bx,by,26); stroke("#1C2536"); strokeWeight(2); line(bx,by+13, bx, by+60); }
  fill("#5E4332"); stroke("#1C2536"); strokeWeight(3); rect(0,H*0.72,W,H*0.28);
  let bPose="bounce", bMode="normal", bEyes="happy"; if (isSolving){ bPose="typing"; bMode="glasses"; bEyes="focused"; } else if (ph===2){ bPose="wave"; }
  campusBoyClawd(W*0.24,H*0.76,136,{ t, pose:bPose, headphones:"neck", mode:bMode, eyes:bEyes, mouth:"smile" });
  drawQQChatModal(W*0.66,H*0.44,t,localT,4);
  // 同学抛学士帽
  for(let i=0;i<2;i++){ const cx=W*0.42+i*120; const cy=180+Math.sin(t*3+i)*18; push(); translate(cx,cy); rotate(t*2+i); fill("#1C2536"); rect(-18,-6,36,12,3); pop(); }
  drawSakuraPetals(t, 28, -30, 200);
  pop();
  drawCampusBeatBadge(t, "S13 · 毕业季黑板报教室");
}

// ─── S14 (199.70 – 219.453s): Outro ───────────────────────────────────────
function s14_SakuraGateOutro(t) {
  const localT = t - 199.70;
  const kick = djBeatKick(t, 2.8);
  const isOutroCard = t >= 216.2;
  const ph=microPhase(localT,2.8);
  const cp=camPulse(localT,t);
  push(); translate(cp.shakeX, cp.shakeY); scale(cp.zoom);
  drawCampusGateBackdrop(t, true);
  drawCampusStreetlamps(t, 4, H*0.72, 290, 440);
  // 远处情侣背影
  campusGirlClawd(W*0.68, H*0.74, 82, { t, pose: ph%2===0?"walk":"bounce", Look:0.4, eyes:"happy", mouth:"smile" });
  rivalBoyClawd(W*0.77, H*0.74, 85, { t, pose:"walk", Look:-0.4, eyes:"happy", mouth:"smile" });
  // 男主动作每2.8秒切换
  let bPose="wave", bEyes="happy", bMouth="smile", hp="neck";
  if (ph===0){ bPose="wave"; }
  else if (ph===1){ bPose="sway"; bEyes="sad"; bMouth="flat"; hp="neck"; }
  else if (ph===2){ bPose="bounce"; bEyes="happy"; bMouth="smile"; }
  else { bPose="aloof"; bEyes="narrow"; bMouth="flat"; }
  campusBoyClawd(W*0.34, H*0.81, 138, { t, pose:bPose, headphones:hp, mode:"normal", Look:0.2, eyes:bEyes, mouth:bMouth });
  drawSakuraPetals(t, 46, -48, 240);
  // 跑过的小狗
  const dogX = ((t*150)%(W+200))-100; push(); translate(dogX, H*0.82); fill("#E8A85C"); noStroke(); ellipse(0,0,36,22); circle(14, -8, 18); pop();
  if (isOutroCard){
    const a=clamp01((t-216.2)/0.8);
    push(); translate(W/2,H*0.36); scale(1+0.02*kick);
    fill(24,30,52,235*a); stroke(255,215,130,245*a); strokeWeight(5); rect(-320,-85,640,170,20);
    noStroke(); fill(255,245,225,250*a); textSize(42); textStyle(BOLD); textAlign(CENTER,CENTER); text("《东京不太热 · 青春校园篇》",0,-18);
    fill(255,195,135,240*a); textSize(22); text("致每一份藏在心底、伪装高冷的校园暗恋  ·  FIN",0,36); pop();
  }
  pop();
  drawCampusBeatBadge(t, "S14 · 樱花校门终章");
}

// ─── Master Timeline (0.00 – 219.453s) ─────────────────────────
shots([
  [0.00,   s01_CampusGateIntro],
  [15.74,  s02_ClassroomAlbum],
  [30.90,  s03_BoulevardCouples],
  [46.30,  s04_DormQQPopup],
  [61.35,  s05_HallwayAloofHeartbreak],
  [77.30,  s06_RooftopStreetlamps],
  [92.56,  s07_NightTrackWalk],
  [107.75, s08_LibraryQQSolve],
  [122.90, s09_CourtyardUmbrella],
  [138.60, s10_MusicRoomTimeline],
  [153.76, s11_FestivalLanternQQ],
  [169.14, s12_ClocktowerFireworks],
  [184.60, s13_GraduationChalkboard],
  [199.70, s14_SakuraGateOutro],
]);
