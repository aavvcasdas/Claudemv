const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const r=JSON.parse(fs.readFileSync('projects/dongjing_butaire/download_check.json'));
for(const p of r.paths){
 assert(fs.lstatSync(p).isFile(),`${p} must be a real video file, not a symbolic link`);
 const a=fs.readFileSync(p);assert.equal(a.length,r.bytes);
 assert.equal(a.subarray(4,8).toString(),'ftyp');
 assert.equal(crypto.createHash('sha256').update(a).digest('hex'),r.sha256);
}
console.log('All three download paths contain matching real MP4 files.');
