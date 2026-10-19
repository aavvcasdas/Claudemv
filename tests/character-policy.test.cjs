const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('src/character-policy.js','utf8'),ctx);
const dirty={hat:'cap',glasses:true,col:'#000000',draw(){},armL(){},armR(){},headphones:'on',eyes:'sad',aL:.8,walk:.3};
const clean=ctx.cleanClawdOptions(dirty);
for(const k of ['hat','glasses','col','draw','armL','armR','headphones']) assert.equal(clean[k],undefined);
assert.equal(clean.eyes,'sad');assert.equal(clean.aL,.8);assert.equal(clean.walk,.3);
assert.equal(dirty.hat,'cap');assert.equal(ctx.cleanClawdOptions(dirty,'custom').hat,'cap');
console.log('Character policy tests passed');
