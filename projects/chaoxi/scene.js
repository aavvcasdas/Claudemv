const PROJECT={duration:56,bpm:143.55,offset:.093,audio:'projects/chaoxi/assets/song.m4a'};
const DUR=56, LOOPS={};
const c=document.querySelector('canvas'),ctx=c.getContext('2d');
const {palette:P,hash,paper,mountain,wave,crab,heart}=InkPaper;
const paperLayer=document.createElement('canvas');paperLayer.width=1280;paperLayer.height=720;paper(paperLayer.getContext('2d'),1280,720);
const shots=[0,8.66,13.35,17.55,23.8,28.4,33.8,40.2,44.5,49.3,56];
function draw(t){
 ctx.drawImage(paperLayer,0,0);let n=shots.findIndex((a,i)=>i<shots.length-1&&t>=a&&t<shots[i+1]);if(n<0)n=9;
 let u=(t-shots[n])/(shots[n+1]-shots[n]), night=[0,5,6,7,8,9].includes(n), beat=Math.pow(Math.max(0,Math.cos((t-.093)*Math.PI*2*143.55/60)),9);
 // The night is a translucent indigo wash; the paper tooth remains visible.
 if(night){ctx.fillStyle='#233f4b';ctx.globalAlpha=.91;ctx.fillRect(0,0,1280,720);ctx.globalAlpha=1;}
 ctx.save();const close=[2,4,5,8].includes(n);ctx.translate(640,close?495:365);let zoom=(close?1.38:1)+.045*Math.sin(u*Math.PI);ctx.scale(zoom,zoom);ctx.translate(-640,close?-495:-365);
 mountain(ctx,455,1,night?'#35545b':'#bbc2af');mountain(ctx,505,3,night?'#41646a':'#8ba89b',Math.sin(t*.1)*4);
 // sun / moon: gilt pigment, not neon
 ctx.fillStyle=night?'#e7d5a4':'#c89b62';ctx.beginPath();ctx.arc(n===8?1000:980,153,night?42:50,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle=night?'#d3c6a044':'#a97b4644';ctx.lineWidth=1;ctx.beginPath();ctx.arc(n===8?1000:980,153,59,0,Math.PI*2);ctx.stroke();
 if(night){ctx.fillStyle='#ebdbb1';for(let i=0;i<45;i++){ctx.globalAlpha=.2+.5*hash(i);ctx.fillRect(60+hash(i+1)*1150,55+hash(i+22)*320,1.5,1.5);}ctx.globalAlpha=1;}
 ctx.fillStyle=night?'#24474e':'#71968a';ctx.fillRect(0,525,1280,195);
 for(let k=0;k<5;k++)wave(ctx,t+k*.3,530+k*38,5+k*1.5,night?'#a1b3a348':'#e6dfc175');
 // central island, scalloped cut-paper shoreline
 ctx.fillStyle=night?'#b7bba3':'#d7d1aa';ctx.beginPath();ctx.ellipse(640,669,420,115,0,Math.PI,Math.PI*2);ctx.lineTo(1060,720);ctx.lineTo(220,720);ctx.fill();
 ctx.strokeStyle=night?'#8eaa9a':'#59776b';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(640,676,400,110,0,Math.PI+.1,Math.PI*2-.1);ctx.stroke();
 let x1=555,x2=705,y=560,s=1.2;
 if(n===0){x1=470+u*150;crab(ctx,x1,y,s,P.red,t);for(let i=0;i<9;i++){ctx.strokeStyle='#c9d5c255';ctx.beginPath();ctx.moveTo(100+i*120,420);ctx.lineTo(105+i*120,426);ctx.lineTo(110+i*120,420);ctx.stroke();}}
 if(n===1){x1=460+u*95;x2=820-u*115;crab(ctx,x1,y,s,P.red,t);crab(ctx,x2,y,s,P.rose,t+.6);heart(ctx,640,450-Math.sin(u*Math.PI)*22,.7+beat*.05);}
 if(n===2){crab(ctx,x1,y,s,P.red,t);crab(ctx,x2,y,s,P.rose,t+.6);for(let i=0;i<3;i++)heart(ctx,610+i*36,445-i*18-Math.sin(u*4+i)*9,.45);}
 if(n===3){
  ctx.strokeStyle='#455b6655';ctx.lineWidth=1;for(let i=0;i<90;i++){let x=hash(i)*1400-60,y0=((hash(i+400)*800+t*160)%800)-70;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x-10,y0+28);ctx.stroke();}
  crab(ctx,580,y,s,P.red,t);crab(ctx,715-u*55,y,s,P.rose,t+.6);
  let ux=660;ctx.fillStyle=P.gold;ctx.beginPath();ctx.moveTo(ux-145,450);ctx.quadraticCurveTo(ux,285,ux+145,450);ctx.quadraticCurveTo(ux+70,429,ux,450);ctx.quadraticCurveTo(ux-70,429,ux-145,450);ctx.fill();ctx.strokeStyle=P.ink;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ux,373);ctx.lineTo(ux,540);ctx.quadraticCurveTo(ux,555,ux-13,547);ctx.stroke();
 }
 if(n===4){crab(ctx,x1,y,s,P.red,t);crab(ctx,x2,y,s,P.rose,t+.6);for(let x of [612,652]){ctx.fillStyle=P.paper;ctx.fillRect(x,529,24,30);ctx.strokeStyle=P.ink;ctx.strokeRect(x,529,24,30);ctx.beginPath();ctx.moveTo(x+8,520);ctx.bezierCurveTo(x-2,509,x+20,504,x+8,492);ctx.stroke();}}
 if(n===5||n===6){crab(ctx,600,y,s,P.red,t,'sleep');crab(ctx,700-u*18,y,s,P.rose,t+.6,'sleep');}
 if(n===6){for(let i=0;i<5;i++){let age=(t*.5+i*.33)%1,xx=260+hash(i+2)*750,yy=180+hash(i+4)*150;ctx.strokeStyle=i%2?P.gold:'#cc9690';ctx.globalAlpha=Math.sin(age*Math.PI)*.8;ctx.lineWidth=1.5;for(let k=0;k<36;k++){let a=k*Math.PI/18,r=age*(60+i*9);ctx.beginPath();ctx.moveTo(xx+Math.cos(a)*r*.5,yy+Math.sin(a)*r*.5);ctx.lineTo(xx+Math.cos(a)*r,yy+Math.sin(a)*r+age*age*20);ctx.stroke();}}ctx.globalAlpha=1;}
 if(n===7){ctx.fillStyle='#183b43';ctx.beginPath();ctx.ellipse(640,572,280,46,0,0,Math.PI*2);ctx.fill();crab(ctx,610,566,1.05,P.red,t,'sleep');wave(ctx,t,584,5,'#cccfb37a');}
 if(n===8){crab(ctx,595,y,1.15,P.red,t);heart(ctx,640,440-Math.sin(u*Math.PI)*40,.8);ctx.globalAlpha=.25+.5*Math.sin(u*Math.PI);crab(ctx,740,y,1.1,P.rose,t+.6);ctx.globalAlpha=1;}
 if(n===9){crab(ctx,590,y,s,P.red,t,'sleep');crab(ctx,700,y,s,P.rose,t+.6,'sleep');heart(ctx,645,440,1+beat*.04);}
 // Reed silhouettes frame the paper stage, with wind anchored to each stem.
 for(let side of [-1,1]){ctx.save();ctx.translate(side<0?80:1200,710);ctx.scale(side,1);ctx.strokeStyle=night?'#17383d':'#46685e';ctx.lineWidth=2;
 for(let k=0;k<9;k++){let endx=25+k*9+Math.sin(t*.8+k)*6,endy=-85-hash(k+80)*75;ctx.beginPath();ctx.moveTo(k*8,0);ctx.quadraticCurveTo(endx-30,endy*.6,endx,endy);ctx.stroke();ctx.beginPath();ctx.moveTo(endx,endy+28);ctx.quadraticCurveTo(endx+35,endy-3,endx+38,endy-18);ctx.quadraticCurveTo(endx+13,endy-10,endx,endy+28);ctx.fillStyle=ctx.strokeStyle;ctx.fill();}ctx.restore();}
 ctx.restore();
 // Ink-wash transitions rather than hard cuts. Fixed deterministic framing at every t.
 let edge=Math.min(t-shots[n],shots[n+1]-t);if(edge<.35&&t>.4&&t<55.6){ctx.fillStyle=P.paper;ctx.globalAlpha=(1-edge/.35)*.85;ctx.fillRect(0,0,1280,720);ctx.globalAlpha=1;}
 // fibre overlay and rough deckle margins
 ctx.globalAlpha=.055;ctx.drawImage(paperLayer,0,0);ctx.globalAlpha=1;
 ctx.fillStyle=P.paper;ctx.fillRect(0,0,1280,19);ctx.fillRect(0,701,1280,19);ctx.fillRect(0,0,18,720);ctx.fillRect(1262,0,18,720);
 ctx.strokeStyle='#978a6970';ctx.lineWidth=.7;ctx.strokeRect(26,27,1228,666);
 let fade=t<1?1-t:t>54.7?(t-54.7)/1.3:0;if(fade>0){ctx.globalAlpha=fade;ctx.fillStyle=P.paper;ctx.fillRect(0,0,1280,720);ctx.globalAlpha=1;}
}
window.renderAt=(t,type='image/jpeg',q=.93)=>{draw(t);return c.toDataURL(type,q);};
window.ready=true;
const audio=document.querySelector('audio'),scrub=document.querySelector('#scrub');
function update(t){draw(t);scrub.value=t;document.querySelector('#time').textContent=t.toFixed(1)+' / 56 s';}
scrub.oninput=()=>{audio.currentTime=+scrub.value;update(+scrub.value);};
document.querySelector('#play').onclick=async()=>{if(audio.paused){await audio.play();}else audio.pause();};
function tick(){if(!audio.paused)update(audio.currentTime);requestAnimationFrame(tick);}update(0);if(!location.search.includes('render'))tick();
window.gpuInfo=()=> 'Canvas 2D / deterministic paper compositor';
window.renderSheet=(ts,cols=3,w=640,crop=null,at=null)=>{
 if(at)throw Error('World-tracked crop is not supported by this 2D project');
 const region=crop||[0,0,1280,720],h=Math.round(w*region[3]/region[2]),sheet=document.createElement('canvas');sheet.width=cols*w;sheet.height=Math.ceil(ts.length/cols)*(h+24);let sc=sheet.getContext('2d'),ms=[];
 ts.forEach((t,i)=>{let start=performance.now();draw(t);let x=i%cols*w,y=Math.floor(i/cols)*(h+24);sc.drawImage(c,...region,x,y,w,h);sc.fillStyle=P.paper;sc.fillRect(x,y+h,w,24);sc.fillStyle=P.ink;sc.font='13px sans-serif';sc.fillText(t.toFixed(2)+'s',x+8,y+h+17);ms.push(Math.round(performance.now()-start));});return{url:sheet.toDataURL('image/jpeg',.92),ms};
};
