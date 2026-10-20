const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const cfg=JSON.parse(fs.readFileSync('projects/pengyou_de_jiu/config.json'));
const audio=JSON.parse(fs.readFileSync('projects/pengyou_de_jiu/analysis/report.json'));
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const ctx=vm.createContext({Math,TAU:Math.PI*2,PROJECT:cfg,clamp,lerp:(a,b,k)=>a+(b-a)*k,frac:x=>x-Math.floor(x),seg:(t,a,b)=>clamp((t-a)/(b-a)),ease:x=>{x=clamp(x);return x*x*(3-2*x);}});
vm.runInContext(fs.readFileSync('src/elastic-motion.js','utf8'),ctx);
let peak=0,minSy=10,maxSy=-1;
for(let t=0;t<cfg.duration;t+=1/24){let p=ctx.elasticPose(t,audio);assert(Number.isFinite(p.dy));assert(Math.abs(p.sx*p.sy-1)<1e-9);assert(p.sy>.5&&p.sy<1.5);peak=Math.max(peak,Math.abs(p.dy));minSy=Math.min(minSy,p.sy);maxSy=Math.max(maxSy,p.sy);}
assert(peak>1);assert(maxSy-minSy>.2);assert.equal(cfg.characterPolicy,'original');assert.equal(cfg.subtitleMode,'kinetic');
for(let i=1;i<cfg.shotPlan.length;i++)assert(Math.abs(cfg.shotPlan[i].start-cfg.shotPlan[i-1].end)<.001);
assert(Math.abs(cfg.shotPlan.at(-1).end-cfg.duration)<.001);
assert(cfg.shotPlan.filter(s=>s.cast===1).length>0);assert(cfg.shotPlan.filter(s=>s.kind==='sun').every(s=>s.location==='hill'));
for(const l of cfg.lyrics){assert(l.end>l.t);assert(l.words.every(w=>w.e>=w.s));}
console.log(`Elastic test passed: 24fps full-song sampling, sx*sy=1, sy ${minSy.toFixed(3)}–${maxSy.toFixed(3)}, hop ${peak.toFixed(2)}u; ${cfg.shotPlan.length} contiguous shots.`);
