const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const r=JSON.parse(fs.readFileSync('projects/pengyou_de_jiu/download_check.json'));
for(const p of r.paths){assert(fs.lstatSync(p).isFile());const b=fs.readFileSync(p);assert.equal(b.length,r.bytes);assert.equal(b.subarray(4,8).toString(),'ftyp');assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.sha256);}
console.log('Friends MV download paths are actual MP4 files with matching SHA256.');
