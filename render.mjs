// render.mjs — Headless frame renderer, contact-sheet generator, and ffmpeg encoder.
// Supports both desktop Chrome/Chromium and container headless Chromium (@sparticuz/chromium).
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import os from 'node:os';

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [a, true];
}));

const FPS = +(args.fps || 24);
const WORKERS = +(args.workers || Math.min(4, Math.max(1, Math.floor(os.cpus().length))));
const OUT = args.out || 'out';

// Prepare environment for @sparticuz/chromium if present in /tmp
if (existsSync('/tmp/al2023/lib')) {
  process.env.LD_LIBRARY_PATH = `/tmp/al2023/lib:/tmp:${process.env.LD_LIBRARY_PATH || ''}`;
}
if (existsSync('/tmp/vk_swiftshader_icd.json')) {
  process.env.VK_ICD_FILENAMES = '/tmp/vk_swiftshader_icd.json';
}

const CHROMES = [
  process.env.CHROME_PATH,
  '/tmp/chromium',
  '/usr/local/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

const executablePath = CHROMES.find(p => existsSync(p));
if (!executablePath) {
  console.error('No Chrome/Chromium found. Set CHROME_PATH=/path/to/chrome');
  process.exit(1);
}

// Build self-contained HTML from studio.html with embedded woff2 fonts & scripts
let _cachedHtml = null;
function buildRenderHtml() {
  if (_cachedHtml) return _cachedHtml;
  let html = readFileSync('studio.html', 'utf8');
  // Inline fonts.css with base64 woff2 data URIs so fonts load instantaneously in setContent
  html = html.replace(/<link[^>]*href="([^"]*fonts\.css)"[^>]*>/g, (_, cssPath) => {
    if (!existsSync(cssPath)) return '';
    const cssDir = dirname(cssPath);
    let css = readFileSync(cssPath, 'utf8');
    css = css.replace(/url\(['"]?([^'")]+)['"]?\)/g, (m, relUrl) => {
      const fp = resolve(cssDir, relUrl);
      if (!existsSync(fp)) return m;
      const b64 = readFileSync(fp).toString('base64');
      return `url('data:font/woff2;base64,${b64}')`;
    });
    return `<style>\n${css}\n</style>`;
  });
  // Inline script tags
  html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
    if (src.includes('p5.brush')) {
      return `<script>window.brush = { scaleBrushes(){}, add(){}, noWash(){}, noFill(){}, noHatch(){}, noStroke(){}, set(){} };</script>`;
    }
    const code = readFileSync(src, 'utf8');
    return `<script>\n${code}\n</script>`;
  });
  html = html.replace("location.search.includes('render')", 'true');
  _cachedHtml = html;
  return html;
}

const LAUNCH_ARGS = [
  '--no-sandbox',
  '--no-zygote',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-web-security',
  '--allow-file-access-from-files',
  '--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
  '--disable-site-isolation-trials',
  '--ignore-gpu-blocklist',
  '--disable-accelerated-2d-canvas',
  '--in-process-gpu',
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--font-render-hinting=none',
  '--window-size=1920,1080',
];

const launch = () => puppeteer.launch({
  executablePath,
  headless: executablePath === '/tmp/chromium' ? 'shell' : true,
  args: LAUNCH_ARGS,
});

const closeBrowser = async (b) => {
  const proc = b?.process?.();
  await Promise.race([b.close().catch(() => {}), new Promise(r => setTimeout(r, 1200))]);
  try { proc?.kill('SIGKILL'); } catch (_) {}
};

async function openPage(b) {
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('[page error]', e.message));
  const html = buildRenderHtml();
  await p.setContent(html, { waitUntil: 'domcontentloaded', timeout: 20000 });
  for (let i = 0; i < 60; i++) {
    const r = await p.evaluate(() => window.ready === true).catch(() => false);
    if (r) break;
    await new Promise(res => setTimeout(res, 100));
  }
  if (args.loop) {
    await p.evaluate((name) => {
      if (!LOOPS[name]) throw new Error(`No LOOPS.${name}`);
      window.LOOP = LOOPS[name];
    }, args.loop);
  }
  return p;
}

const saveUrl = (url, file) => writeFileSync(file, Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'));
const parseBox = s => s ? s.split(',').map((v, i) => i < 2 && isNaN(+v) ? v : +v) : null;

// Mode 1: contact sheet (--sheet or --sheet=t1,t2,... or --strip=t0,t1)
if (args.sheet || args.strip) {
  const b = await launch(), p = await openPage(b);
  const [dur, gpu] = await p.evaluate(() => [window.LOOP ? (window.LOOP.len || 4) : DUR, window.gpuInfo()]);
  let times;
  if (args.strip) {
    const [a, b0] = String(args.strip).split(',').map(Number);
    const step = +(args.every || (b0 - a) / 11);
    times = [];
    for (let t = a; t <= b0 + 1e-6; t += step) times.push(+t.toFixed(3));
  } else if (typeof args.sheet === 'string') {
    times = args.sheet.split(',').map(Number);
  } else {
    const c0 = +(args.cols || 4), r0 = +(args.rows || 5), n = c0 * r0;
    times = Array.from({ length: n }, (_, i) => +((i + 0.5) / n * dur).toFixed(2));
  }
  const cols = +(args.cols || Math.min(4, times.length));
  const crop = parseBox(args.crop), at = parseBox(args.at);
  const file = args.out || 'out/sheet.jpg';
  mkdirSync(dirname(file), { recursive: true });
  const { url, ms } = await p.evaluate((ts, c, cr, a) => window.renderSheet(ts, c, 640, cr, a), times, cols, crop, at);
  saveUrl(url, file);
  const avg = Math.round(ms.reduce((a, b) => a + b, 0) / ms.length);
  console.log(`sheet -> ${file}  (${times.length} frames, avg ${avg} ms/frame [${ms.join(', ')}])  [${gpu}]`);
  await closeBrowser(b);
  process.exit(0);
}

// Mode 2: full-res stills (--stills=t1,t2,...)
if (args.stills) {
  const times = String(args.stills).split(',').map(Number);
  mkdirSync(OUT, { recursive: true });
  const b = await launch(), p = await openPage(b);
  for (const t of times) {
    const t0 = Date.now(), f = `${OUT}/t_${t.toFixed(2)}s.jpg`;
    saveUrl(await p.evaluate(s => window.renderAt(s, 'image/jpeg', .92), t), f);
    console.log(`${f}  (${Date.now() - t0} ms)`);
  }
  await closeBrowser(b);
  process.exit(0);
}

// Mode 3: sequence render -> out/frames/f_NNNNN.jpg (and optional --encode -> out/video.mp4)
const fdir = `${OUT}/frames`;
mkdirSync(fdir, { recursive: true });

// Hash all source scripts so unchanged frames can be reused unless --force
const srcHash = (() => {
  const h = createHash('sha1');
  const html = readFileSync('studio.html', 'utf8');
  for (const m of html.matchAll(/<script src="([^"]+)"><\/script>/g)) {
    if (existsSync(m[1])) h.update(m[1]).update(readFileSync(m[1]));
  }
  return h.digest('hex').slice(0, 12);
})();
const mfPath = `${fdir}/manifest.json`;
const prevMf = (!args.force && existsSync(mfPath)) ? JSON.parse(readFileSync(mfPath, 'utf8')) : null;

const b0 = await launch(), p0 = await openPage(b0);
const [dur, gpu, cfgAudio] = await p0.evaluate(() => [
  window.LOOP ? (window.LOOP.len || 4) : DUR,
  window.gpuInfo(),
  typeof PROJECT !== 'undefined' ? PROJECT.audio : null,
]);
await closeBrowser(b0);

const [t0, t1] = args.range ? args.range.split(',').map(Number) : [0, dur];
const f0 = Math.round(t0 * FPS), f1 = Math.round(t1 * FPS), total = f1 - f0;

const reuse = prevMf && prevMf.srcHash === srcHash && prevMf.fps === FPS && prevMf.loop === (args.loop || null);
if (!reuse) {
  for (const f of readdirSync(fdir)) {
    if (/^f_\d+\.jpg$/.test(f)) unlinkSync(`${fdir}/${f}`);
  }
}
writeFileSync(mfPath, JSON.stringify({ srcHash, fps: FPS, loop: args.loop || null, t0, t1 }, null, 2));

const todo = [];
for (let f = f0; f < f1; f++) {
  const path = `${fdir}/f_${String(f - f0).padStart(5, '0')}.jpg`;
  if (!(reuse && existsSync(path))) todo.push(f);
}
const cached = total - todo.length;
console.log(`rendering ${todo.length}/${total} frames (${cached} cached) @ ${FPS} fps (${(t1 - t0).toFixed(2)}s) with ${WORKERS} workers  [${gpu}]`);

let nextIdx = 0, done = 0;
const start = Date.now();
const BATCH = 16;

async function worker() {
  const b = await launch(), p = await openPage(b);
  while (true) {
    const i0 = nextIdx;
    if (i0 >= todo.length) break;
    nextIdx += BATCH;
    const batch = todo.slice(i0, i0 + BATCH);
    const urls = await p.evaluate(async (fs, fps) => {
      const res = [];
      for (const f of fs) {
        res.push(await window.renderAt(f / fps, 'image/jpeg', .90));
      }
      return res;
    }, batch, FPS);
    for (let k = 0; k < batch.length; k++) {
      const f = batch[k];
      saveUrl(urls[k], `${fdir}/f_${String(f - f0).padStart(5, '0')}.jpg`);
      done++;
    }
    const el = (Date.now() - start) / 1000, rate = done / el, eta = (todo.length - done) / Math.max(0.1, rate);
    console.log(`  ${done}/${todo.length}  (${rate.toFixed(1)} fps, ETA ${eta.toFixed(0)}s)`);
  }
  await closeBrowser(b);
}

if (todo.length) await Promise.all(Array.from({ length: Math.min(WORKERS, todo.length) }, worker));
writeFileSync(mfPath, JSON.stringify({ srcHash, fps: FPS, loop: args.loop || null, t0, t1 }, null, 2));

if (args.encode) {
  const mp4 = `${OUT}/video.mp4`;
  const audioFile = typeof args.audio === 'string' ? args.audio : (!args.loop && cfgAudio && existsSync(cfgAudio) ? cfgAudio : null);
  const ff = ['-y', '-framerate', String(FPS), '-i', `${fdir}/f_%05d.jpg`];
  if (audioFile) {
    if (t0 > 0) ff.push('-ss', String(t0));
    ff.push('-i', audioFile, '-c:a', 'aac', '-b:a', '192k', '-shortest');
  }
  const crf = String(args.crf || ((t1 - t0) > 90 ? 22 : 18));
  ff.push('-c:v', 'libx264', '-preset', 'medium', '-crf', crf, '-vf', 'scale=out_range=tv', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-movflags', '+faststart', mp4);
  execFileSync('ffmpeg', ff, { stdio: 'inherit' });
  console.log(`encoded -> ${mp4}${audioFile ? ` (audio: ${audioFile})` : ' (silent)'}`);
}
