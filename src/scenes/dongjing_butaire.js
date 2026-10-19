// ═══════════════════════════════════════════════════════════════════════════
// 《东京不太热》 (Dongjing Butaire — 青春校园暗恋篇 MV)
// Audio: 东京不太热 .mp3 (219.453s, 126.05 BPM, beat = 0.4760s, offset = 0.186s)
// Setting: 青春校园 (樱花校门、晚自习教室、林荫大道、男生宿舍QQ弹窗、教学楼走廊、
//          天台街灯、夜间操场、图书馆自习室、音乐教室黑胶时间轴、校园文化祭、毕业黑板报)
// Cast:
//   - campusBoyClawd (#4884C8 深蓝DK校服+红领带+白色头戴式耳机+高冷/学霸眼镜切换)
//   - campusGirlClawd (#E8785A 水手服海魂领+红蝴蝶结+樱花发卡)
//   - rivalBoyClawd (#58A87C 学院风针织背心男配) & 校园情侣 Clawds
// ═══════════════════════════════════════════════════════════════════════════

const DJ_BPM = 126.05;
const DJ_BEAT = 60.0 / DJ_BPM;        // 0.4760s per beat
const DJ_BAR = DJ_BEAT * 4;           // 1.9040s per 4-beat bar
const DJ_OFFSET = 0.186;              // first downbeat offset

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

function djBeatNum(t) {
  return Math.max(0, (t - DJ_OFFSET) / DJ_BEAT);
}
function djBeatPhase(t) {
  const b = djBeatNum(t);
  return b - Math.floor(b);
}
function djBeatKick(t, pow = 3.0) {
  return Math.pow(1.0 - djBeatPhase(t), pow);
}
function djEighthKick(t, pow = 2.5) {
  const b2 = djBeatNum(t) * 2.0;
  const ph = b2 - Math.floor(b2);
  return Math.pow(1.0 - ph, pow);
}
function djBarPhase(t) {
  const bar = Math.max(0, (t - DJ_OFFSET) / DJ_BAR);
  return bar - Math.floor(bar);
}
function djBarKick(t, pow = 2.6) {
  return Math.pow(1.0 - djBarPhase(t), pow);
}

// ─── Custom Campus Clawd Cast ─────────────────────────────────────────────

// 1. 男主: 深蓝 DK 校服 + 红领带 + 白色头戴式耳机 Clawd
function campusBoyClawd(x, y, sc, o = {}) {
  const t = o.t || 0;
  const col = o.col || "#4884C8";
  const dk  = o.dk  || "#2A568F";
  const lt  = o.lt  || "#7EB4F0";
  const headphones = o.headphones || "neck"; // "on" | "neck" | "none"
  const mode = o.mode || "normal";           // "normal" | "glasses" | "aloof" | "selfHold" | "shock"
  const kick = djBeatKick(t, 2.8);
  const u = sc * 0.18;

  clawd(x, y, u, {
    ...o,
    col, dk, lt,
    tint: null, tintK: 0,
    glasses: mode === "glasses",
    sweat: mode === "selfHold" || mode === "shock" || !!o.sweat,
  });

  push();
  translate(x, y);

  // DK Uniform White Shirt V-Collar & Red Tie on lower torso
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

  // Crimson School Tie
  fill("#E03E52");
  beginShape();
  vertex(-0.55 * u, -0.8 * u);
  vertex(0.55 * u, -0.8 * u);
  vertex(0.75 * u, 0.45 * u);
  vertex(0, 0.95 * u);
  vertex(-0.75 * u, 0.45 * u);
  endShape(CLOSE);

  // Gold School Badge on left chest
  fill("#FFD25A");
  circle(-3.2 * u, -1.05 * u, 0.9 * u);

  // White Over-Ear Headphones hugging Clawd's 9*u head snugly
  if (headphones === "on") {
    noFill();
    stroke("#1C2536");
    strokeWeight(1.05 * u);
    arc(0, -6.8 * u, 9.6 * u, 6.2 * u, PI, TWO_PI);
    stroke("#F2F6FC");
    strokeWeight(0.65 * u);
    arc(0, -6.8 * u, 9.6 * u, 6.2 * u, PI, TWO_PI);

    // Ear cups pulsing on beat right on the sides of Clawd's head (±4.75*u)
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
    // Floating beat-synced music notes (drawn with Ma Shan Zheng / Noto Serif SC)
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

  // Special acting modes
  if (mode === "aloof") {
    // Ice-cube stoic aura ("伪装出高冷的表情") + secret beating heart
    noFill();
    stroke(150, 225, 255, 190);
    strokeWeight(0.28 * u);
    rect(-7.8 * u, -9.8 * u, 15.6 * u, 9.6 * u, 1.2 * u);
    // Floating ice crystals
    for (let k = 0; k < 3; k++) {
      const ix = (-6.5 + k * 6.5) * u;
      const iy = (-10.8 - 0.5 * Math.sin(t * 4 + k)) * u;
      fill("#B8F0FF");
      noStroke();
      circle(ix, iy, 0.75 * u);
    }
    // Secret hidden pounding heart bubble above
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
    // "你也牵过手 是左手牵右手" — clasping own left & right hands in front of belly
    const squeeze = 0.25 * Math.sin(t * 8);
    stroke("#1C2536");
    strokeWeight(0.35 * u);
    fill(col);
    rect((-2.6 + squeeze) * u, -2.5 * u, 2.7 * u, 1.55 * u, 0.6 * u);
    fill(lt);
    rect((0.0 - squeeze) * u, -2.5 * u, 2.7 * u, 1.55 * u, 0.6 * u);
    // Warm glow ring around self-held hands
    noFill();
    stroke(255, 215, 110, 190 + 60 * kick);
    strokeWeight(0.28 * u);
    circle(0, -1.75 * u, (4.8 + 0.6 * kick) * u);
  }
  pop();
}

// 2. 女主: 暖橘水手服 + 红领结 + 樱花发卡 Clawd
function campusGirlClawd(x, y, sc, o = {}) {
  const t = o.t || 0;
  const col = o.col || "#E8785A";
  const dk  = o.dk  || "#B84C32";
  const lt  = o.lt  || "#FFA58C";
  const u = sc * 0.18;

  clawd(x, y, u, {
    ...o,
    col, dk, lt,
    tint: null, tintK: 0,
    blush: o.blush !== undefined ? o.blush : true,
  });

  push();
  translate(x, y);

  // Sailor Uniform Collar (Navy with White Stripes)
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

  // Red Sailor Ribbon Bow
  fill("#FF4769");
  triangle(-1.45 * u, -1.25 * u, -0.1 * u, -0.75 * u, -1.45 * u, -0.25 * u);
  triangle(1.45 * u, -1.25 * u, 0.1 * u, -0.75 * u, 1.45 * u, -0.25 * u);
  circle(0, -0.75 * u, 0.72 * u);

  // Sakura Blossom Hairpin on top-right of head
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

  pop();
}

// 3. 男配 / 路人学长: 薄荷绿学院针织背心 Clawd
function rivalBoyClawd(x, y, sc, o = {}) {
  const col = o.col || "#58A87C";
  const dk  = o.dk  || "#34704E";
  const lt  = o.lt  || "#8AD4AA";
  const u = sc * 0.18;
  clawd(x, y, u, {
    ...o,
    col, dk, lt,
    tint: null, tintK: 0,
  });
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

// 4. 校园牵手情侣组件 ("悄悄看 外边的情侣暧昧牵着手")
function drawCampusCouple(cx, cy, sc, t, walkDir = 1) {
  const kick = djBeatKick(t, 2.5);
  const bob = 4 * Math.sin(t * 5.2);
  push();
  translate(cx, cy + bob);
  // Left partner (Lavender Clawd)
  clawd(-sc * 0.85, 0, sc * 0.17, {
    t, col: "#9B7EDE", dk: "#6348A6", lt: "#C4B0F5", tint: null, tintK: 0,
    pose: "walk", Look: walkDir * 0.3,
    eyes: "happy", mouth: "smile", blush: true,
  });
  // Right partner (Warm Gold Clawd)
  clawd(sc * 0.85, 0, sc * 0.17, {
    t: t + 0.25, col: "#F0A854", dk: "#B87324", lt: "#FFD08A", tint: null, tintK: 0,
    pose: "walk", Look: -walkDir * 0.3,
    eyes: "happy", mouth: "smile", blush: true,
  });
  // Clasped hands bridge in center
  stroke("#1C2536");
  strokeWeight(3);
  fill("#FFD08A");
  circle(0, -sc * 0.18, sc * 0.22);
  // Floating pink heart above their clasped hands pulsing on the beat
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

// ─── Beat-Synced Sakura Petals & Campus Atmosphere ────────────────────────

function drawSakuraPetals(t, count = 28, windX = -38, alpha = 220) {
  const kick = djBeatKick(t, 3.0);
  push();
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const speedY = 38 + (i % 5) * 14;
    const px = ((seed * 19 + t * (windX - (i % 4) * 11)) % (W + 160) + (W + 160)) % (W + 160) - 80;
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

// Rhythmic Campus Beat Equalizer Badge (Top-Right HUD — Visual 卡点 indicator)
function drawCampusBeatBadge(t, sceneLabel = "校园广播 · 126 BPM") {
  const kick = djBeatKick(t, 2.8);
  const barK = djBarKick(t, 2.4);
  push();
  translate(W - 235, 36);
  // Pill background
  fill(20, 28, 48, 195);
  stroke(255, 220, 140, 180 + 75 * kick);
  strokeWeight(2 + 1.2 * barK);
  rect(0, 0, 205, 42, 21);

  // Pulsing record disc icon
  push();
  translate(23, 21);
  rotate(t * 2.4);
  fill("#FF6B8B");
  noStroke();
  circle(0, 0, 24 + 4 * kick);
  fill("#182030");
  circle(0, 0, 8);
  pop();

  // 6 mini equalizer bars synced to beat harmonics
  noStroke();
  for (let i = 0; i < 6; i++) {
    const bh = 8 + 18 * Math.abs(Math.sin(t * 9.5 + i * 0.85)) * (0.45 + 0.55 * kick);
    fill(i % 2 === 0 ? "#FFE066" : "#66E8FF");
    rect(44 + i * 7, 31 - bh, 4.5, bh, 2);
  }

  // Scene label
  fill("#FFF8E8");
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(sceneLabel, 92, 21);
  pop();
}

// ─── Interactive Campus Story Props ───────────────────────────────────────

// 1. Smartphone Photo Album Modal ("收藏夹的照片看了又删 / 去年夏天后就没聊过天")
function drawPhoneAlbumModal(cx, cy, sc, t, localT) {
  const kick = djBeatKick(t, 2.8);
  const popK = easeOutBack(clamp01(localT / 0.55));
  push();
  translate(cx, cy);
  scale(sc * popK * (1 + 0.025 * kick));

  // Phone chassis
  fill("#1E2436");
  stroke("#101420");
  strokeWeight(4);
  rect(-185, -245, 370, 490, 32);

  // Screen area
  fill("#FFF9F2");
  stroke("#2C354D");
  strokeWeight(2);
  rect(-168, -215, 336, 430, 18);

  // Top header bar
  fill("#2C3E66");
  noStroke();
  rect(-168, -215, 336, 44, 18, 18, 0, 0);
  fill("#FFFFFF");
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("【相册收藏夹 · 去年夏天 (1/1)】", 0, -193);

  // Polaroid photo inside screen: Campus Boy & Girl Clawd under summer fireworks
  fill("#28385E");
  stroke("#D8C8B4");
  strokeWeight(3);
  rect(-144, -152, 288, 210, 10);

  // Sun/fireworks in photo
  fill(255, 215, 110, 210);
  noStroke();
  circle(-85, -110, 38 + 6 * kick);
  circle(90, -105, 28 + 5 * kick);

  // Mini Boy & Girl Clawd in the cherished photo
  campusBoyClawd(-54, 24, 52, {
    t, headphones: "neck", eyes: "happy", mouth: "smile",
  });
  campusGirlClawd(54, 24, 50, {
    t, eyes: "happy", mouth: "smile", blush: true,
  });

  // Caption under photo
  fill("#5A4A42");
  textSize(15);
  textStyle(BOLD);
  text("2025.07.18 · 校园夏日祭合照 ♥", 0, 82);

  // Delete confirmation dialog ("看了又删")
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

    // Cancel vs Delete buttons alternating highlight on the beat
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

// 2. Interactive QQ Notification & Chat Window ("叮叮叮当当Q / 响起会是谁呢 NaYo ...")
function drawQQChatModal(cx, cy, t, localT, variant = 1) {
  const kick = djBeatKick(t, 2.8);
  const eighthK = djEighthKick(t, 2.4);
  const popS = easeOutBack(clamp01(localT / 0.45));

  push();
  translate(cx, cy);
  scale(popS);

  // Phase A (localT < 3.4s): Giant Ringing QQ Bell & Penguin Badge ("叮叮叮当当Q / 响起会是谁呢 NaYo")
  if (localT < 3.4) {
    const shake = Math.sin(t * 36) * 0.18 * (0.4 + 0.6 * eighthK);
    // Concentric sound wave rings
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
    // Notification card
    fill("#FFFDF4");
    stroke("#1C2536");
    strokeWeight(4.5);
    rect(-210, -82, 420, 164, 28);

    // Golden ringing bell on left
    fill("#FFD23F");
    stroke("#1C2536");
    strokeWeight(3.5);
    arc(-130, -6, 74, 74, PI, TWO_PI);
    rect(-167, -6, 74, 24, 6);
    circle(-130, 24, 18);

    // Text
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

  // Phase B (localT >= 3.4s): Full Campus QQ Chat Window
  const isOffline = localT >= 11.0; // "不多聊了 NaYo / 去吃饭了 Ayo"
  const cardShake = localT < 5.2 ? Math.sin(t * 24) * 3 * kick : 0;
  translate(cardShake, 0);

  // Window frame
  fill("#F7FAFF");
  stroke("#1C2536");
  strokeWeight(4);
  rect(-270, -175, 540, 350, 22);

  // Header bar
  fill(isOffline ? "#6C788E" : "#3A7BD5");
  noStroke();
  rect(-270, -175, 540, 54, 22, 22, 0, 0);

  // Status dot & Title
  fill(isOffline ? "#B8C2D4" : "#58FF8A");
  stroke("#1C2536");
  strokeWeight(2);
  circle(-232, -148, 16);

  fill("#FFFFFF");
  noStroke();
  textSize(20);
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  const titleText = isOffline
    ? "暗恋的学妹 (已离线 · 去食堂吃饭了)"
    : "暗恋的学妹 (在线 · 正在输入... NaYo)";
  text(titleText, -210, -148);

  // Message 1 from Girl (3.4s+): "会是她吗 NaYo / 什么事呢 Ayo"
  if (localT >= 3.4) {
    fill("#FFE5EC");
    stroke("#1C2536");
    strokeWeight(2.5);
    rect(-245, -104, 340, 58, 14);
    fill("#263248");
    noStroke();
    textSize(17);
    textAlign(LEFT, CENTER);
    const qMsg = variant === 2
      ? "学妹：学长在吗？图书馆这题怎么做呀 Ayo？"
      : variant === 3
      ? "学妹：学长！文化祭音响出问题啦怎么调 Ayo？"
      : variant === 4
      ? "学妹：学长毕业快乐！这题最后帮我看下 Ayo？"
      : "学妹：学长在吗？这道高数题怎么做呀 Ayo？";
    text(qMsg, -228, -75);
  }

  // Message 2 from Boy (6.8s+): "假装正经帮她把问题都摆平 NaYo"
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

  // Message 3 from Girl (10.8s+): "不多聊了 NaYo / 去吃饭了 Ayo"
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

  // Bottom input bar
  fill("#EBF1F8");
  stroke("#BDC8D8");
  strokeWeight(2);
  rect(-245, 130, 490, 32, 10);
  fill("#7A889E");
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text(
    isOffline ? "对方已离线，你输入的那句「其实我很想你」还没发出去..." : "正在飞速敲键盘帮她摆平问题...",
    -230,
    146
  );

  pop();
}

// ─── Campus Environment Backdrops ─────────────────────────────────────────

// Campus Clock Tower & Cherry Blossom School Gate (S01 & S14)
function drawCampusGateBackdrop(t, isOutro = false) {
  const kick = djBeatKick(t, 2.8);
  // Warm sunset / golden-pink sky gradient
  skyGrad(
    isOutro ? "#2A1F4A" : "#3E2F5B",
    isOutro ? "#C85A6E" : "#E2726B",
    "#FFD09B"
  );

  // Glowing sunset sun pulsing on beat
  noStroke();
  fill(255, 225, 145, 55 + 35 * kick);
  circle(W * 0.52, H * 0.44, 340 + 28 * kick);
  fill(255, 242, 195, 210);
  circle(W * 0.52, H * 0.44, 175 + 10 * kick);

  // Distant Campus Main Teaching Building & Clock Tower
  fill("#2C3554");
  stroke("#1A2035");
  strokeWeight(3);
  rect(W * 0.26, H * 0.28, W * 0.48, H * 0.42, 6);
  // Clock tower spire
  rect(W * 0.45, H * 0.13, W * 0.10, H * 0.57, 4);
  triangle(W * 0.44, H * 0.13, W * 0.56, H * 0.13, W * 0.50, H * 0.04);

  // Glowing Clock Face synced to beat
  fill("#FFF8DC");
  stroke("#1A2035");
  strokeWeight(3);
  circle(W * 0.50, H * 0.21, 64 + 4 * kick);
  stroke("#2C3554");
  strokeWeight(3);
  line(W * 0.50, H * 0.21, W * 0.50, H * 0.21 - 22);
  line(W * 0.50, H * 0.21, W * 0.50 + 16 * Math.cos(t * 0.8), H * 0.21 + 16 * Math.sin(t * 0.8));

  // Classroom windows lighting up warmly
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

  // Campus Stone Gate Pillars & Plaque
  fill("#E8DCCB");
  stroke("#1C2536");
  strokeWeight(4);
  rect(W * 0.12, H * 0.44, 78, H * 0.32, 6);
  rect(W * 0.82, H * 0.44, 78, H * 0.32, 6);
  // Gate top caps
  fill("#4A5678");
  rect(W * 0.11, H * 0.42, 98, 22, 4);
  rect(W * 0.81, H * 0.42, 98, 22, 4);
  // Vertical wooden school nameplate
  fill("#FFF9EB");
  rect(W * 0.145, H * 0.48, 28, 145, 4);
  fill("#2C354D");
  noStroke();
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("青\n春\n学\n园", W * 0.159, H * 0.495);

  // Paved Campus Courtyard Road
  fill("#46485E");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.72, W, H * 0.28);
  // Road perspective stripes
  stroke(255, 230, 185, 110);
  strokeWeight(4);
  for (let i = 0; i < 7; i++) {
    line(W * 0.15 + i * 230, H * 0.84, W * 0.22 + i * 230, H * 0.84);
  }

  // Lush Sakura Tree Canopies on Left & Right
  fill("#FF9EBB");
  stroke("#1C2536");
  strokeWeight(3.5);
  for (let i = 0; i < 6; i++) {
    circle(80 + i * 75, 120 + (i % 2) * 35, 170 + (i % 3) * 25);
    circle(W - 80 - i * 75, 125 + (i % 2) * 35, 170 + (i % 3) * 25);
  }
}

// Campus Streetlamps Row ("一盏一盏街灯烘焙了夜") — lights up sequentially on beats!
function drawCampusStreetlamps(t, count = 5, yBase = H * 0.72, xStart = 210, xStep = 370) {
  const beatIdx = Math.floor(djBeatNum(t));
  const kick = djBeatKick(t, 2.8);
  for (let i = 0; i < count; i++) {
    const lx = xStart + i * xStep;
    const isActive = (beatIdx % count) >= i || (beatIdx % (count * 2)) >= i;
    const isCurrent = (beatIdx % count) === i;
    push();
    translate(lx, yBase);
    // Lamp post
    stroke("#1C2536");
    strokeWeight(4);
    fill("#36455E");
    rect(-6, -245, 12, 245, 3);
    rect(-22, -6, 44, 10, 3);
    // Crossbar
    line(-28, -238, 28, -238);

    // Warm baking night halo ("一盏一盏街灯烘焙了夜")
    const glowR = isCurrent ? 165 + 35 * kick : isActive ? 125 + 15 * kick : 60;
    noStroke();
    fill(255, 205, 105, isCurrent ? 95 : isActive ? 65 : 22);
    circle(0, -245, glowR);
    fill(255, 230, 150, isCurrent ? 165 : isActive ? 120 : 45);
    circle(0, -245, glowR * 0.52);

    // Lantern globe
    stroke("#1C2536");
    strokeWeight(3);
    fill(isActive ? "#FFF3B0" : "#8FA0B8");
    circle(0, -245, 34 + (isCurrent ? 6 * kick : 0));
    pop();
  }
}

// ─── S01 (0.00 – 19.90s): 樱花校门与钟楼教学楼序幕 (Intro) ─────────────────
function s01_CampusGateIntro(t) {
  const localT = t;
  const kick = djBeatKick(t, 2.8);
  const camScale = 1.0 + 0.04 * (localT / 19.9) + 0.008 * kick;

  push();
  translate(W / 2, H / 2);
  scale(camScale);
  translate(-W / 2, -H / 2);

  drawCampusGateBackdrop(t, false);
  drawCampusStreetlamps(t, 4, H * 0.72, 290, 440);

  // Girl Clawd on 2nd-floor balcony glancing down at Boy Clawd
  campusGirlClawd(W * 0.68, H * 0.45, 58, {
    t, Look: -0.6, eyes: "round", mouth: "o", blush: true,
  });

  // Boy Clawd walking into campus courtyard wearing headphones
  const bx = lerp(W * 0.22, W * 0.48, clamp01(localT / 19.5));
  campusBoyClawd(bx, H * 0.80, 118, {
    t, pose: "walk", headphones: "on",
    Look: 0.35, eyes: "calm", mouth: "flat",
  });

  // Campus Blackboard Title Plaque (0.6s – 18.8s)
  if (localT > 0.5 && localT < 19.2) {
    const a = clamp01(localT - 0.5) * clamp01(19.2 - localT);
    push();
    translate(W * 0.50, H * 0.28);
    scale(1 + 0.025 * kick);
    fill(28, 62, 48, 232 * a);
    stroke(212, 162, 95, 245 * a);
    strokeWeight(6);
    rect(-330, -92, 660, 184, 18);

    noStroke();
    fill(255, 248, 230, 250 * a);
    textSize(48);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("《 东 京 不 太 热 》", 0, -24);

    fill(255, 208, 125, 240 * a);
    textSize(24);
    text("封茗囧菌  ·  青春校园暗恋篇 (126 BPM 卡点 MV)", 0, 32);

    fill(185, 240, 210, 220 * a);
    textSize(16);
    text("词曲：Z新豪   |   主演：校园版 Clawd 学长 & 水手服学妹", 0, 68);
    pop();
  }

  drawSakuraPetals(t, 32, -42, 225);
  pop();
  drawCampusBeatBadge(t, "S01 · 樱花校门序幕");
}

// ─── S02 (19.90 – 35.00s): 夕阳晚自习教室与手机相册 (Verse 1A) ────────────
// Lyrics: 收藏夹的照片看了又删 / 去年夏天后就没聊过天 / 一盏一盏街灯烘焙了夜 / 只有手中烟在寂寞地渲染
function s02_ClassroomAlbum(t) {
  const localT = t - 15.74;
  const kick = djBeatKick(t, 2.8);

  // Classroom interior wall
  skyGrad("#232B45", "#3A4468", "#5E506E");

  // Large classroom windows looking out at dusk sky & campus streetlamps
  for (let w = 0; w < 3; w++) {
    const wx = 95 + w * 420;
    fill("#1B233D");
    stroke("#141824");
    strokeWeight(5);
    rect(wx, 95, 360, 410, 8);
    // Dusk gradient inside window
    fill("#FF9A76");
    noStroke();
    rect(wx + 8, 365, 344, 132);
    // Streetlamp outside each window lighting up on the beat ("一盏一盏街灯烘焙了夜")
    const lampOn = localT >= 7.2 ? (Math.floor(djBeatNum(t)) >= w) : (w === 0);
    const lx = wx + 180;
    const ly = 335;
    if (lampOn) {
      fill(255, 210, 110, 95 + 45 * kick);
      circle(lx, ly, 160 + 25 * kick);
    }
    stroke("#141824");
    strokeWeight(4);
    line(lx, ly, lx, 497);
    fill(lampOn ? "#FFF2A6" : "#6A7896");
    circle(lx, ly, 32 + 5 * kick);
  }

  // Classroom Blackboard on right wall
  fill("#1F4738");
  stroke("#B88652");
  strokeWeight(7);
  rect(W * 0.68, 110, 520, 340, 8);
  fill(255, 255, 255, 180);
  noStroke();
  textSize(22);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("值日生：Clawd\n倒计时：距离去年夏天已过 365 天\n今日自习：高等数学 & 难忘的回忆", W * 0.70, 145);

  // Wooden Classroom Floor & Desks
  fill("#4A372C");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.68, W, H * 0.32);

  // Student Desk
  fill("#C89462");
  rect(W * 0.22, H * 0.66, 460, 32, 6);
  fill("#7A5638");
  rect(W * 0.25, H * 0.69, 400, 180, 4);

  // Steaming mug on desk ("在寂寞地渲染" — rising warm mist swirls)
  fill("#FFF5E6");
  stroke("#1C2536");
  strokeWeight(3);
  rect(W * 0.48, H * 0.60, 46, 58, 8);
  noFill();
  for (let s = 0; s < 4; s++) {
    const sp = ((t * 0.6 + s * 0.25) % 1);
    stroke(255, 240, 220, (1 - sp) * 190);
    strokeWeight(3.5);
    const sx = W * 0.503 + Math.sin(t * 2.5 + s) * 18;
    const sy = H * 0.59 - sp * 130;
    arc(sx, sy, 28 + sp * 25, 36, 0, PI);
  }

  // Boy Clawd sitting at desk looking at his smartphone
  campusBoyClawd(W * 0.34, H * 0.72, 128, {
    t, pose: "Wave", headphones: "neck",
    Look: 0.45, eyes: localT > 7.5 ? "sad" : "focused", mouth: "flat",
  });

  // Pop-up Smartphone Album Modal ("收藏夹的照片看了又删 / 去年夏天后就没聊过天")
  drawPhoneAlbumModal(W * 0.72, H * 0.50, 0.96, t, localT);

  drawCampusBeatBadge(t, "S02 · 晚自习教室与相册");
}

// ─── S03 (35.00 – 50.20s): 放学银杏林荫道与左手牵右手 (Pre-Chorus 1) ──────
// Lyrics: 人太多 大部分是漫无目的地走 / 听着歌 想念一个人心痛也不说 / 悄悄看 外边的情侣暧昧牵着手 / 你也牵过手 是左手牵右手
function s03_BoulevardCouples(t) {
  const localT = t - 30.90;
  const kick = djBeatKick(t, 2.8);
  const isSelfHold = localT >= 11.2; // 46.2s+: "你也牵过手 是左手牵右手"

  // Zoom in on Boy Clawd during "你也牵过手 是左手牵右手"
  const z = isSelfHold ? lerp(1.0, 1.24, easeInOut(clamp01((localT - 11.2) / 1.2))) : 1.0 + 0.01 * kick;
  push();
  translate(W * 0.38, H * 0.68);
  scale(z);
  translate(-W * 0.38, -H * 0.68);

  skyGrad("#2D325A", "#7A527A", "#F2A47E");
  drawCampusStreetlamps(t, 5, H * 0.70, 180, 380);

  // Campus Bulletin Board & Bicycle Shed in background
  fill("#5E4433");
  stroke("#1C2536");
  strokeWeight(3);
  rect(160, H * 0.45, 320, 155, 8);
  fill("#FFF8E8");
  rect(176, H * 0.47, 288, 122, 4);
  fill("#2C354D");
  noStroke();
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text("【校园社团招新公告栏】\n吉他社 · 动漫社 · 天文社", 320, H * 0.50);

  // Paved Boulevard Ground
  fill("#3C4056");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.70, W, H * 0.30);

  // Background silhouette crowd walking aimlessly ("人太多 大部分是漫无目的地走")
  for (let i = 0; i < 4; i++) {
    const cx = ((220 + i * 430 - localT * 52) % (W + 200) + (W + 200)) % (W + 200) - 100;
    clawd(cx, H * 0.71, 13.5, {
      t: t + i, col: "#546280", dk: "#364058", lt: "#7484A6", tint: null, tintK: 0,
      pose: "walk", eyes: "calm", mouth: "flat",
    });
  }

  // Campus Couple walking hand-in-hand on the right ("悄悄看 外边的情侣暧昧牵着手")
  const coupleX = lerp(W * 0.86, W * 0.66, clamp01(localT / 15.0));
  drawCampusCouple(coupleX, H * 0.77, 96, t, -1);

  // Boy Clawd on the left: wearing headphones ("听着歌"), peeking at the couple, then holding his own hands!
  campusBoyClawd(W * 0.35, H * 0.80, 132, {
    t,
    pose: isSelfHold ? "idle" : "walk",
    headphones: "on",
    mode: isSelfHold ? "selfHold" : "normal",
    Look: isSelfHold ? 0 : 0.75,
    eyes: isSelfHold ? "sad" : "focused",
    mouth: isSelfHold ? "wavy" : "flat",
  });

  // Comic callout badge when holding own left & right hand
  if (isSelfHold) {
    push();
    translate(W * 0.35, H * 0.50);
    scale(1 + 0.08 * kick);
    fill("#FFF5D6");
    stroke("#1C2536");
    strokeWeight(3);
    rect(-145, -28, 290, 56, 16);
    fill("#D94343");
    noStroke();
    textSize(20);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("【左手牵右手 · 单身狗的倔强】", 0, 0);
    pop();
  }

  drawSakuraPetals(t, 22, -32, 185);
  pop();
  drawCampusBeatBadge(t, "S03 · 放学林荫大道");
}

// ─── S04 (50.20 – 65.55s): 男生宿舍书桌与叮叮叮当当Q弹窗 (Chorus 1A) ──────
// Lyrics: 叮叮叮当当Q / 响起会是谁呢 NaYo / 会是她吗 / 什么事呢 / 假装正经帮她把问题都摆平 / 不多聊了 / 去吃饭了 Ayo
function s04_DormQQPopup(t) {
  const localT = t - 46.30;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT >= 6.8 && localT < 11.0;
  const isDumped  = localT >= 11.0;

  // Night Dorm Room Interior
  skyGrad("#1A2238", "#283655", "#384B6E");

  // Dorm Bookshelf & Bunk Bed Ladder on left
  fill("#6E4E38");
  stroke("#1C2536");
  strokeWeight(4);
  rect(70, 90, 290, H * 0.62, 8);
  // Books on shelf
  const bookCols = ["#E05A47", "#4884C8", "#58A87C", "#F0B849", "#9B7EDE"];
  for (let b = 0; b < 10; b++) {
    fill(bookCols[b % bookCols.length]);
    rect(92 + b * 24, 150, 20, 78, 3);
  }

  // Dorm Desk across bottom
  fill("#8C6240");
  rect(0, H * 0.72, W, H * 0.28);
  fill("#B8885C");
  rect(0, H * 0.70, W, 28);

  // Laptop on desk with glowing screen
  fill("#D8E2F0");
  rect(W * 0.34, H * 0.56, 190, 128, 10);
  fill("#1C2536");
  rect(W * 0.31, H * 0.68, 250, 18, 6);

  // Boy Clawd at Dorm Desk reacting to every beat of the QQ Chorus!
  campusBoyClawd(W * 0.22, H * 0.74, 136, {
    t,
    pose: localT < 3.4 ? "Jump" : isSolving ? "Point" : isDumped ? "Wave" : "Excited",
    headphones: "neck",
    mode: isSolving ? "glasses" : isDumped ? "shock" : "normal",
    eyes: localT < 6.8 ? "starstruck" : isSolving ? "focused" : "dead",
    mouth: localT < 6.8 ? "open" : isSolving ? "smirk" : "wavy",
    bounce: !isDumped,
  });

  // Giant Beat-Synced QQ Chat Window on the right
  drawQQChatModal(W * 0.66, H * 0.43, t, localT, 1);

  drawCampusBeatBadge(t, "S04 · 宿舍叮叮当当Q");
}

// ─── S05 (65.55 – 80.90s): 教学楼走廊高冷伪装与樱花树心碎 (Chorus 1B) ────
// Lyrics: 明明心里很喜欢 却保持着距离 / 怕被伤害就伪装出高冷的表情 / 以为这样总有一天她会接近你 / 直到有天看见她和别人在一起
function s05_HallwayAloofHeartbreak(t) {
  const localT = t - 61.35;
  const kick = djBeatKick(t, 2.8);
  const isHeartbreak = localT >= 11.2; // 76.75s+: "直到有天看见她和别人在一起"

  if (!isHeartbreak) {
    // Part 1 (65.55 – 76.75s): Sunlit School Corridor with Lockers
    skyGrad("#D8E8F8", "#F4F8FF", "#FFEBD6");

    // Corridor Windows & School Lockers
    for (let i = 0; i < 4; i++) {
      fill("#8EB8E5");
      stroke("#1C2536");
      strokeWeight(4);
      rect(110 + i * 280, 110, 210, 290, 8);
    }
    // Row of lockers on right
    for (let k = 0; k < 5; k++) {
      fill("#6E88A8");
      stroke("#1C2536");
      strokeWeight(3);
      rect(W * 0.68 + k * 95, 160, 88, 360, 4);
    }

    // Checkered School Hallway Floor
    fill("#E6D5C3");
    stroke("#1C2536");
    strokeWeight(3);
    rect(0, H * 0.68, W, H * 0.32);

    // Distance meter line between them ("明明心里很喜欢 却保持着距离")
    stroke(255, 105, 135, 200);
    strokeWeight(3);
    drawingContext.setLineDash([12, 10]);
    line(W * 0.34, H * 0.74, W * 0.68, H * 0.74);
    drawingContext.setLineDash([]);
    fill("#FF4D6D");
    noStroke();
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER, BOTTOM);
    text("← 保持安全暗恋距离 2.5m (内心狂跳 180 BPM) →", W * 0.51, H * 0.72);

    // Boy Clawd pretending to be an aloof ice-cube ("伪装出高冷的表情")
    campusBoyClawd(W * 0.30, H * 0.78, 134, {
      t, pose: "Lean", headphones: "neck",
      mode: "aloof", Look: -0.6,
      eyes: "narrow", mouth: "flat",
    });

    // Girl Clawd walking past with books wondering why he's so aloof
    campusGirlClawd(W * 0.70, H * 0.78, 126, {
      t, pose: "walk", Look: -0.4,
      eyes: "round", mouth: "o", blush: true,
    });
  } else {
    // Part 2 (76.75 – 80.90s): "直到有天看见她和别人在一起" — Campus Cherry Tree Heartbreak!
    const hbT = localT - 11.2;
    const z = lerp(1.0, 1.16, clamp01(hbT / 3.5)) + 0.015 * kick;
    push();
    translate(W / 2, H / 2);
    scale(z);
    translate(-W / 2, -H / 2);

    skyGrad("#2A244D", "#6E3D66", "#D97B78");
    fill("#39425A");
    stroke("#1C2536");
    strokeWeight(3);
    rect(0, H * 0.70, W, H * 0.30);

    // Giant Cherry Tree on the right
    fill("#6B4230");
    rect(W * 0.66, H * 0.32, 65, H * 0.40);
    fill("#FF9EBB");
    circle(W * 0.69, H * 0.26, 360);
    circle(W * 0.58, H * 0.32, 260);
    circle(W * 0.79, H * 0.32, 260);

    // Girl Clawd & Rival Mint Boy Clawd walking together under the cherry tree
    campusGirlClawd(W * 0.60, H * 0.76, 118, {
      t, pose: "walk", Look: 0.4, eyes: "happy", mouth: "smile", blush: true,
    });
    rivalBoyClawd(W * 0.75, H * 0.76, 122, {
      t, pose: "walk", Look: -0.4, eyes: "happy", mouth: "smile",
    });

    // Brick wall on left where Boy Clawd peeks out heartbroken
    fill("#8C4A3E");
    stroke("#1C2536");
    strokeWeight(4);
    rect(0, H * 0.18, W * 0.22, H * 0.62);

    campusBoyClawd(W * 0.26, H * 0.79, 130, {
      t, pose: "Shrug", headphones: "neck",
      mode: "shock", Look: 0.8,
      eyes: "sad", mouth: "wavy",
    });

    // Cracking Golden-Pink Heart above Boy Clawd on the beat
    push();
    translate(W * 0.26, H * 0.44);
    scale(1 + 0.18 * kick);
    fill("#FF4D6D");
    stroke("#1C2536");
    strokeWeight(3.5);
    circle(-22, -8, 44);
    circle(22, -8, 44);
    triangle(-42, 2, 42, 2, 0, 48);
    // Jagged crack line down the center
    stroke("#FFF8E8");
    strokeWeight(4);
    line(0, -24, -8, -4);
    line(-8, -4, 8, 12);
    line(8, 12, -4, 38);
    pop();

    drawSakuraPetals(t, 34, -50, 230);
    pop();
  }

  drawCampusBeatBadge(t, "S05 · 高冷伪装与心碎");
}

// ─── S06 (80.90 – 96.35s): 教学楼天台晚风与校园街灯 (Verse 2A) ────────────
// Lyrics: 一盏一盏街灯烘焙了夜 / 只有手中烟在寂寞渲染 / 收藏夹的照片看了又删 / 去年夏天后就再没聊过天
function s06_RooftopStreetlamps(t) {
  const localT = t - 77.30;
  const kick = djBeatKick(t, 2.8);

  skyGrad("#13182E", "#283560", "#6B4E72");

  // Distant campus buildings & row of glowing streetlamps below ("一盏一盏街灯烘焙了夜")
  drawCampusStreetlamps(t, 6, H * 0.66, 160, 315);

  // Rooftop concrete floor & chain-link fence
  fill("#3B455E");
  stroke("#1C2536");
  strokeWeight(4);
  rect(0, H * 0.68, W, H * 0.32);

  // Chain-link rooftop fence
  stroke(190, 210, 235, 130);
  strokeWeight(2);
  for (let x = 0; x < W; x += 48) {
    line(x, H * 0.36, x + 90, H * 0.68);
    line(x + 90, H * 0.36, x, H * 0.68);
  }
  stroke("#232B3E");
  strokeWeight(6);
  line(0, H * 0.36, W, H * 0.36);

  // Boy Clawd leaning by the rooftop railing
  campusBoyClawd(W * 0.30, H * 0.78, 135, {
    t, pose: "Think", headphones: "on",
    Look: 0.5, eyes: "sad", mouth: "flat",
  });

  // Floating Polaroid Memory Cards drifting & dissolving in the night breeze ("收藏夹的照片看了又删")
  for (let p = 0; p < 3; p++) {
    const px = W * 0.55 + p * 185;
    const py = H * 0.32 + Math.sin(t * 2.2 + p * 1.4) * 18;
    const fade = localT > 8.0 ? clamp01(1.0 - (localT - 8.0 - p * 1.5) / 4.5) : 1.0;
    push();
    translate(px, py);
    rotate((p - 1) * 0.12 + 0.04 * Math.sin(t * 3 + p));
    scale(1 + 0.04 * kick);
    fill(255, 250, 240, 235 * fade);
    stroke(28, 37, 54, 235 * fade);
    strokeWeight(3);
    rect(-68, -82, 136, 164, 8);
    fill(72, 132, 200, 210 * fade);
    noStroke();
    rect(-56, -68, 112, 102, 4);
    fill(232, 120, 90, 220 * fade);
    circle(0, -16, 38);
    fill(60, 50, 50, 220 * fade);
    textSize(13);
    textAlign(CENTER, CENTER);
    text(p === 0 ? "去年夏天·课堂" : p === 1 ? "去年夏天·操场" : "去年夏天·校门", 0, 56);
    pop();
  }

  drawCampusBeatBadge(t, "S06 · 教学楼天台夜风");
}

// ─── S07 (96.35 – 111.45s): 晚间校园塑胶跑道与看台情侣 (Pre-Chorus 2) ─────
// Lyrics: 人太多 大部分是漫无目的地走 / 听着歌 想念一个人心痛也不说 / 悄悄看 外边的情侣暧昧牵着手 / 你也牵过手 是左手牵右手
function s07_NightTrackWalk(t) {
  const localT = t - 92.56;
  const kick = djBeatKick(t, 2.8);
  const isSelfHold = localT >= 11.3; // 107.65s+: "你也牵过手 是左手牵右手"

  skyGrad("#141B30", "#24345A", "#3B4F78");

  // Stadium Floodlights pulsing on beat
  for (const fx of [260, W - 260]) {
    stroke("#1C2536");
    strokeWeight(6);
    line(fx, 110, fx, H * 0.62);
    fill("#FFF6B8");
    rect(fx - 48, 82, 96, 34, 6);
    noStroke();
    fill(255, 245, 180, 45 + 30 * kick);
    triangle(fx, 110, fx - 260, H * 0.68, fx + 260, H * 0.68);
  }

  // Green Infield Turf & Red Running Track Lanes
  fill("#2D6B4F");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.56, W, H * 0.14);

  fill("#B84A3E");
  rect(0, H * 0.70, W, H * 0.30);
  stroke(255, 255, 255, 190);
  strokeWeight(3);
  line(0, H * 0.76, W, H * 0.76);
  line(0, H * 0.84, W, H * 0.84);
  line(0, H * 0.92, W, H * 0.92);

  // Couples holding hands on the right ("外边的情侣暧昧牵着手")
  drawCampusCouple(W * 0.74, H * 0.76, 94, t, -1);

  // Boy Clawd jogging/walking on the track with headphones, then clasping his own hands
  campusBoyClawd(W * 0.34, H * 0.81, 134, {
    t,
    pose: isSelfHold ? "idle" : "walk",
    headphones: "on",
    mode: isSelfHold ? "selfHold" : "normal",
    Look: isSelfHold ? 0 : 0.7,
    eyes: isSelfHold ? "sad" : "focused",
    mouth: isSelfHold ? "wavy" : "flat",
  });

  drawCampusBeatBadge(t, "S07 · 晚间操场塑胶跑道");
}

// ─── S08 (111.45 – 127.50s): 图书馆自习室震动解题大作战 (Chorus 2A) ───────
// Lyrics: 叮叮叮当当Q ... 假装正经帮她把问题都摆平 ... 去吃饭了 Ayo
function s08_LibraryQQSolve(t) {
  const localT = t - 107.75;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT >= 6.8 && localT < 11.2;
  const isDumped  = localT >= 11.2;

  // Warm Campus Library Interior
  skyGrad("#2B211B", "#4A372B", "#6E523F");

  // Tall Library Wooden Bookshelves across background
  for (let s = 0; s < 4; s++) {
    const sx = 80 + s * 450;
    fill("#523826");
    stroke("#1C2536");
    strokeWeight(4);
    rect(sx, 70, 380, H * 0.62, 6);
    for (let r = 0; r < 3; r++) {
      fill("#3B271A");
      rect(sx + 16, 95 + r * 135, 348, 110);
      for (let b = 0; b < 11; b++) {
        fill(b % 3 === 0 ? "#C84B31" : b % 3 === 1 ? "#3D73A8" : "#4E8C6F");
        rect(sx + 24 + b * 30, 112 + r * 135, 24, 92, 2);
      }
    }
  }

  // "保持安静 QUIET" Library Sign pulsing when QQ rings!
  push();
  translate(W * 0.23, 125);
  scale(localT < 3.4 ? 1 + 0.12 * kick : 1);
  fill("#FFF8E8");
  stroke("#1C2536");
  strokeWeight(3);
  rect(-115, -26, 230, 52, 10);
  fill("#C83E3E");
  noStroke();
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("【图书馆自习室 · 请保持安静】", 0, 0);
  pop();

  // Library Reading Table & Green Banker's Lamp
  fill("#7A5234");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.72, W, H * 0.28);

  // Banker's lamp on left
  fill("#D4AF37");
  rect(140, H * 0.56, 18, 110);
  fill("#2E8B57");
  arc(149, H * 0.56, 110, 70, PI, TWO_PI, CHORD);

  // Boy Clawd in the Library
  campusBoyClawd(W * 0.24, H * 0.75, 134, {
    t,
    pose: localT < 3.4 ? "Jump" : isSolving ? "Typing" : "Wave",
    headphones: "neck",
    mode: isSolving ? "glasses" : isDumped ? "shock" : "normal",
    eyes: localT < 6.8 ? "starstruck" : isSolving ? "focused" : "dead",
    mouth: localT < 6.8 ? "o" : isSolving ? "smirk" : "wavy",
  });

  // QQ Chat Modal Variant 2 (Library question)
  drawQQChatModal(W * 0.66, H * 0.43, t, localT, 2);

  drawCampusBeatBadge(t, "S08 · 图书馆解题大作战");
}

// ─── S09 (127.50 – 142.85s): 校园连廊伞架与雨中错位 (Chorus 2B) ───────────
// Lyrics: 明明心里很喜欢 却保持着距离 / Oh 怕被伤害就伪装出高冷的表情 / 以为这样总有一天她会接近你 / 直到有天看见她和别人在一起
function s09_CourtyardUmbrella(t) {
  const localT = t - 122.90;
  const kick = djBeatKick(t, 2.8);
  const isTogether = localT >= 11.0; // 138.5s+: "直到有天看见她和别人在一起"

  skyGrad("#243048", "#425878", "#768EA8");

  // Covered Campus Walkway Pillars
  fill("#D8D2C5");
  stroke("#1C2536");
  strokeWeight(4);
  rect(0, 0, W, 88);
  for (let p = 0; p < 4; p++) {
    rect(120 + p * 520, 88, 54, H * 0.62);
  }
  // Wet Courtyard Ground
  fill("#39465E");
  rect(0, H * 0.70, W, H * 0.30);

  // Gentle Campus Rain streaks
  stroke(195, 225, 255, 135);
  strokeWeight(2);
  for (let r = 0; r < 40; r++) {
    const rx = ((r * 97 - t * 180) % W + W) % W;
    const ry = ((r * 61 + t * 520) % H);
    line(rx, ry, rx - 12, ry + 32);
  }

  // Boy Clawd holding a spare yellow umbrella for her, pretending to be aloof
  campusBoyClawd(W * 0.26, H * 0.78, 132, {
    t, pose: "idle", headphones: "neck",
    mode: isTogether ? "shock" : "aloof",
    Look: 0.6,
    eyes: isTogether ? "sad" : "narrow",
    mouth: isTogether ? "wavy" : "flat",
  });
  // Yellow spare umbrella in Boy Clawd's hand
  push();
  translate(W * 0.35, H * 0.62);
  rotate(0.15);
  stroke("#1C2536");
  strokeWeight(4);
  line(0, -60, 0, 85);
  fill("#FFD24C");
  arc(0, -55, 150, 95, PI, TWO_PI, CHORD);
  pop();

  if (!isTogether) {
    // Girl Clawd standing by the walkway waiting for rain to stop
    campusGirlClawd(W * 0.72, H * 0.78, 124, {
      t, pose: "idle", Look: -0.4,
      eyes: "round", mouth: "flat", blush: true,
    });
  } else {
    // Under a big shared mint umbrella, Rival Boy Clawd walks Girl Clawd out into the rain
    push();
    translate(W * 0.68, H * 0.77);
    stroke("#1C2536");
    strokeWeight(5);
    line(0, -210, 0, -20);
    fill("#66D9B8");
    arc(0, -205, 310, 145, PI, TWO_PI, CHORD);
    campusGirlClawd(-62, 0, 114, {
      t, pose: "walk", Look: 0.4, eyes: "happy", mouth: "smile",
    });
    rivalBoyClawd(62, 0, 118, {
      t, pose: "walk", Look: -0.4, eyes: "happy", mouth: "smile",
    });
    pop();
  }

  drawCampusBeatBadge(t, "S09 · 校园雨廊与黄伞");
}

// ─── S10 (142.85 – 157.95s): 音乐教室黑胶时间轴与单曲循环 (Bridge) ────────
// Lyrics: 优雅的转身 / 熟悉的音乐 是我们曾经那一段 / 你已经淡出 在我时间轴 / 只留下那天的回忆 单曲循环
function s10_MusicRoomTimeline(t) {
  const localT = t - 138.60;
  const kick = djBeatKick(t, 2.8);

  // Golden-Dusk Campus Music Room
  skyGrad("#1E1936", "#4B2E59", "#B86B77");

  // Music Room Floor
  fill("#4E3629");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.72, W, H * 0.28);

  // Giant Spinning Vinyl Record & Memory Flashback in Center-Right ("熟悉的音乐 是我们曾经那一段 / 单曲循环")
  push();
  translate(W * 0.64, H * 0.42);
  // Outer vinyl disc
  push();
  rotate(t * 1.35);
  fill("#181C28");
  stroke("#FFD266");
  strokeWeight(4);
  circle(0, 0, 360 + 12 * kick);
  noFill();
  stroke(255, 255, 255, 45);
  strokeWeight(2);
  circle(0, 0, 310);
  circle(0, 0, 260);
  circle(0, 0, 210);
  pop();

  // Warm center label with flashback of Boy & Girl sharing earphones
  fill("#FFF3D6");
  stroke("#1C2536");
  strokeWeight(3);
  circle(0, 0, 168);

  const girlFade = localT > 8.0 ? clamp01(1.0 - (localT - 8.0) / 5.5) : 1.0; // "你已经淡出 在我时间轴"
  campusBoyClawd(-34, 24, 46, {
    t, headphones: "on", eyes: "happy", mouth: "smile",
  });
  if (girlFade > 0.05) {
    push();
    drawingContext.globalAlpha = girlFade;
    campusGirlClawd(34, 24, 44, {
      t, eyes: "happy", mouth: "smile", blush: true,
    });
    pop();
  }

  // Single-Track Repeat Badge ("只留下那天的回忆 单曲循环")
  push();
  translate(0, 222);
  scale(1 + 0.06 * kick);
  fill("#232B45");
  stroke("#FFD266");
  strokeWeight(3);
  rect(-210, -28, 420, 56, 28);
  fill("#FFE680");
  noStroke();
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("【校园时间轴 · 单曲循环 02:36 / 03:39】", 0, 0);
  pop();
  pop();

  // Boy Clawd on Left performing a smooth 360° "优雅的转身" (turn())!
  const turnProps = localT < 4.5
    ? turn(localT, 0.2, 4.2, 0, 1.0)
    : { view: "q" };
  campusBoyClawd(W * 0.25, H * 0.78, 138, {
    t, ...turnProps, headphones: "on",
    eyes: "calm", mouth: "flat",
  });

  drawSakuraPetals(t, 30, -35, 210);
  drawCampusBeatBadge(t, "S10 · 音乐教室单曲循环");
}

// ─── S11 (157.95 – 173.25s): 校园文化祭灯笼夜街与QQ弹窗 (Chorus 3A) ───────
// Lyrics: 叮叮叮当当Q ... 假装正经帮她把问题都摆平 ... 去吃饭了 Ayo
function s11_FestivalLanternQQ(t) {
  const localT = t - 153.76;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT >= 6.8 && localT < 11.2;
  const isDumped  = localT >= 11.2;

  skyGrad("#16132B", "#31224F", "#6B3860");

  // String of Campus Cultural Festival Paper Lanterns pulsing on every beat!
  stroke("#1C2536");
  strokeWeight(3);
  line(0, 115, W, 145);
  for (let i = 0; i < 11; i++) {
    const lx = 95 + i * 172;
    const ly = 115 + (i / 10) * 30 + Math.sin(t * 4 + i) * 5;
    const isBeatLantern = (Math.floor(djBeatNum(t)) + i) % 2 === 0;
    noStroke();
    fill(255, 190, 90, isBeatLantern ? 120 + 60 * kick : 45);
    circle(lx, ly + 28, 92 + 20 * kick);
    stroke("#1C2536");
    strokeWeight(3);
    fill(i % 2 === 0 ? "#FF5268" : "#FFF2C2");
    ellipse(lx, ly + 28, 46, 58);
  }

  // Cultural Festival Wooden Booth on Left
  fill("#7A492E");
  stroke("#1C2536");
  strokeWeight(4);
  rect(75, H * 0.45, 360, H * 0.30, 6);
  fill("#E84A5F");
  rect(60, H * 0.42, 390, 44, 6);
  fill("#FFF8E8");
  noStroke();
  textSize(22);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("【校园文化祭 · 学长万能解题站】", 255, H * 0.442);

  fill("#322C42");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.72, W, H * 0.28);

  campusBoyClawd(W * 0.24, H * 0.76, 136, {
    t,
    pose: localT < 3.4 ? "Jump" : isSolving ? "Point" : "Wave",
    headphones: "neck",
    mode: isSolving ? "glasses" : isDumped ? "shock" : "normal",
    eyes: localT < 6.8 ? "starstruck" : isSolving ? "focused" : "dead",
    mouth: localT < 6.8 ? "open" : isSolving ? "smirk" : "wavy",
  });

  drawQQChatModal(W * 0.66, H * 0.45, t, localT, 3);
  drawCampusBeatBadge(t, "S11 · 校园文化祭夜街");
}

// ─── S12 (173.25 – 188.80s): 钟楼烟花夜空与高冷面具背后 (Chorus 3B) ───────
// Lyrics: 明明心里很喜欢 却保持着距离 ... 直到有天看见她和别人在一起
function s12_ClocktowerFireworks(t) {
  const localT = t - 169.14;
  const kick = djBeatKick(t, 2.8);
  const isTogether = localT >= 11.2;

  skyGrad("#0F152B", "#222E56", "#4E3868");

  // Beat-synced Campus Fireworks bursting in the sky!
  const fwCenters = [
    [W * 0.28, H * 0.26, "#FF6B8B"],
    [W * 0.52, H * 0.20, "#FFE066"],
    [W * 0.76, H * 0.25, "#66E8FF"],
  ];
  for (let f = 0; f < fwCenters.length; f++) {
    const [fx, fy, fcol] = fwCenters[f];
    const fp = ((t * 0.85 + f * 0.33) % 1);
    const rMax = 60 + fp * 130;
    stroke(fcol);
    strokeWeight(3.2 * (1 - fp * 0.6));
    for (let a = 0; a < 12; a++) {
      const ang = (a * TWO_PI) / 12;
      line(
        fx + Math.cos(ang) * (rMax * 0.25),
        fy + Math.sin(ang) * (rMax * 0.25),
        fx + Math.cos(ang) * rMax,
        fy + Math.sin(ang) * rMax
      );
    }
  }

  // Campus Clock Tower Terrace
  fill("#2C354D");
  stroke("#1C2536");
  strokeWeight(4);
  rect(0, H * 0.70, W, H * 0.30);

  campusBoyClawd(W * 0.28, H * 0.78, 134, {
    t,
    pose: isTogether ? "Shrug" : "Lean",
    headphones: "on",
    mode: isTogether ? "shock" : "aloof",
    Look: 0.6,
    eyes: isTogether ? "sad" : "narrow",
    mouth: isTogether ? "wavy" : "flat",
  });

  if (!isTogether) {
    campusGirlClawd(W * 0.70, H * 0.78, 124, {
      t, pose: "idle", Look: -0.4, eyes: "sparkle", mouth: "o", blush: true,
    });
  } else {
    campusGirlClawd(W * 0.64, H * 0.78, 118, {
      t, pose: "walk", Look: 0.4, eyes: "happy", mouth: "smile",
    });
    rivalBoyClawd(W * 0.78, H * 0.78, 122, {
      t, pose: "walk", Look: -0.4, eyes: "happy", mouth: "smile",
    });
  }

  drawCampusBeatBadge(t, "S12 · 钟楼烟花夜空");
}

// ─── S13 (188.80 – 204.25s): 毕业季黑板报教室与最后的叮当Q (Chorus 4A) ────
// Lyrics: 叮叮叮当当Q ... 假装正经帮她把问题都摆平 ... 去吃饭了 Ayo
function s13_GraduationChalkboard(t) {
  const localT = t - 184.60;
  const kick = djBeatKick(t, 2.8);
  const isSolving = localT >= 6.8 && localT < 11.2;

  // Golden Graduation Sunset Classroom
  skyGrad("#3E2B47", "#8F4F5E", "#F5A872");

  // Large Graduation Chalkboard across the back wall
  fill("#1E4738");
  stroke("#B88652");
  strokeWeight(8);
  rect(90, 85, W - 180, 410, 12);

  fill(255, 248, 225, 230);
  noStroke();
  textSize(38);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("毕业快乐 · 青春不散场", 135, 125);
  fill(255, 210, 130, 215);
  textSize(22);
  text("「明明心里很喜欢，却保持着距离」\n—— 致我们单曲循环的那个夏天", 135, 190);

  // Classroom floor
  fill("#5E4332");
  stroke("#1C2536");
  strokeWeight(3);
  rect(0, H * 0.72, W, H * 0.28);

  campusBoyClawd(W * 0.24, H * 0.76, 136, {
    t,
    pose: isSolving ? "Point" : "Wave",
    headphones: "neck",
    mode: isSolving ? "glasses" : "normal",
    eyes: isSolving ? "focused" : "happy",
    mouth: "smile",
  });

  drawQQChatModal(W * 0.66, H * 0.44, t, localT, 4);
  drawSakuraPetals(t, 24, -30, 200);
  drawCampusBeatBadge(t, "S13 · 毕业季黑板报教室");
}

// ─── S14 (204.25 – 219.453s): 樱花校门落日归途与尾奏 (Chorus 4B & Outro) ──
// Lyrics: 明明心里很喜欢 却保持着距离 ... 直到有天看见她和别人在一起 (204.25–219.45s)
function s14_SakuraGateOutro(t) {
  const localT = t - 199.70;
  const kick = djBeatKick(t, 2.8);
  const isOutroCard = t >= 216.2;

  drawCampusGateBackdrop(t, true);
  drawCampusStreetlamps(t, 4, H * 0.72, 290, 440);

  // Distant Girl Clawd & Rival Boy Clawd silhouettes walking away in the golden sunset
  campusGirlClawd(W * 0.68, H * 0.74, 82, {
    t, pose: "walk", Look: 0.4, eyes: "happy", mouth: "smile",
  });
  rivalBoyClawd(W * 0.77, H * 0.74, 85, {
    t, pose: "walk", Look: -0.4, eyes: "happy", mouth: "smile",
  });

  // Foreground Boy Clawd removing headphones around neck, waving goodbye with a warm, mature smile
  campusBoyClawd(W * 0.34, H * 0.81, 138, {
    t, pose: "Wave", headphones: "neck",
    mode: "normal", Look: 0.2,
    eyes: "happy", mouth: "smile",
  });

  drawSakuraPetals(t, 42, -48, 240);

  // Final Closing Campus Yearbook Stamp (216.2 – 219.45s)
  if (isOutroCard) {
    const a = clamp01((t - 216.2) / 0.8);
    push();
    translate(W / 2, H * 0.36);
    scale(1 + 0.02 * kick);
    fill(24, 30, 52, 235 * a);
    stroke(255, 215, 130, 245 * a);
    strokeWeight(5);
    rect(-320, -85, 640, 170, 20);

    noStroke();
    fill(255, 245, 225, 250 * a);
    textSize(42);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("《东京不太热 · 青春校园篇》", 0, -18);

    fill(255, 195, 135, 240 * a);
    textSize(22);
    text("致每一份藏在心底、伪装高冷的校园暗恋  ·  FIN", 0, 36);
    pop();
  }

  drawCampusBeatBadge(t, "S14 · 樱花校门终章");
}

// ─── Master Timeline Dispatcher (0.00 – 219.453s) ─────────────────────────
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
