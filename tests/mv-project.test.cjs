const assert=require('node:assert/strict'),fs=require('node:fs');
const c=JSON.parse(fs.readFileSync('projects/dongjing_butaire/config.json'));
assert.equal(c.characterPolicy,'original');assert.equal(c.subtitleMode,'kinetic');
assert.equal(c.lyrics.length,69);assert.equal(c.shotPlan.length,73);
assert.equal(c.shotPlan[0].start,0);
for(let i=0;i<c.shotPlan.length;i++){
 const s=c.shotPlan[i];assert(s.end>s.start);
 if(i)assert(Math.abs(c.shotPlan[i-1].end-s.start)<.001);
 if(i>=4)assert.equal(s.lyric,c.lyrics[i-4].text);
}
assert.equal(c.shotPlan.at(-1).end,c.duration);
assert(c.shotPlan.filter(s=>s.cast===1).length>c.shotPlan.filter(s=>s.cast===2).length);
for(const l of c.lyrics){assert(l.end>l.t);for(const w of l.words){assert(w.e>=w.s);assert(w.s>=l.t-.05);assert(w.e<=l.end+.05);}}
const s=fs.readFileSync(c.scene,'utf8');for(const word of ['headphones','hairpin','glasses','Uniform','Sailor'])assert(!s.includes(word));
console.log('MV project: contiguous 73-shot timeline, 69 lyric lines, original character & kinetic subtitle policy passed');
