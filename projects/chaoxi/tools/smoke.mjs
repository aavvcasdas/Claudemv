// Browser regression test: CHROME_PATH=/path/to/chrome node projects/chaoxi/tools/smoke.mjs
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox','--allow-file-access-from-files','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve('projects/chaoxi/studio.html')).href+'?render');
 await page.waitForFunction('window.ready === true');
 const result=await page.evaluate(()=>{
  const first=renderAt(21),second=renderAt(21);
  const stats=[4,11,15,21,26,31,37,42,47,52].map(t=>{
   renderAt(t);const d=document.querySelector('canvas').getContext('2d').getImageData(50,50,1180,620).data;
   const colors=new Set();for(let i=0;i<d.length;i+=160)colors.add(`${d[i]>>4},${d[i+1]>>4},${d[i+2]>>4}`);
   return {t,colors:colors.size};
  });return {deterministic:first===second,stats,motion:renderAt(11)!==renderAt(12)};
 });
 assert.equal(result.deterministic,true);assert.equal(result.motion,true);assert.deepEqual(errors,[]);
 for(const frame of result.stats)assert.ok(frame.colors>15,`blank/flat frame at ${frame.t}s: ${frame.colors} colours`);
 console.log('PASS deterministic renders, motion, 10 nonblank shots, no page errors',result.stats);
}finally{await browser.close();}
