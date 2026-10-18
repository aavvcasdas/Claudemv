// CHROME_PATH=/path/to/chrome node projects/chaoxi-v2/tools/smoke.mjs
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:true,protocolTimeout:180000,args:['--no-sandbox','--allow-file-access-from-files','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(resolve('projects/chaoxi-v2/studio.html')).href+'?render');
 await page.waitForFunction('window.ready === true',{timeout:60000});
 const result=await page.evaluate(async()=>{
  const first=await renderAt(10.3);await renderAt(44);const second=await renderAt(10.3);
  const stats=[];
  for(const shot of FILM_DATA.shots){
   const t=(shot.start_s+shot.end_s)/2;await renderAt(t);
   const ctx=document.querySelector('#out').getContext('2d');const d=ctx.getImageData(40,40,1840,1000).data;
   const colors=new Set();for(let i=0;i<d.length;i+=320)colors.add(`${d[i]>>4},${d[i+1]>>4},${d[i+2]>>4}`);
   stats.push({shot:shot.id,t,colors:colors.size});
  }
  const motion=(await renderAt(19))!==(await renderAt(20));
  return {deterministic:first===second,motion,stats,physical:[drawingContext.canvas.width,drawingContext.canvas.height],duration:DUR,bpm:BPM,caption_count:FILM_DATA.captions.length,caption_source:FILM_DATA.captions[0].text};
 });
 assert.equal(result.deterministic,true,'order-dependent frame / uncleared depth buffer');
 assert.equal(result.motion,true);assert.deepEqual(errors,[]);assert.deepEqual(result.physical,[1920,1080]);
 assert.equal(result.duration,56);assert.equal(result.caption_count,16);assert.equal(result.caption_source,'我们都是渺小真实存在');assert.notEqual(result.bpm,118);
 for(const f of result.stats)assert.ok(f.colors>18,`blank frame ${f.shot}`);
 console.log('PASS: deterministic out-of-order frames; motion; 19 nonblank shots; 1920x1080 native canvas; 56s source; 16 actual-source captions; no JS errors');
 console.log(JSON.stringify(result.stats));
}finally{await browser.close();}
