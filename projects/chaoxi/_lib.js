/* Reusable Chinese paper/ink vocabulary. No external textures or nondeterministic random(). */
const InkPaper = (() => {
  const palette = {paper:'#e9dfc9',ink:'#223e43',far:'#a2b3a7',sea:'#547d7a',red:'#af4436',rose:'#be827b',gold:'#c29754'};
  const hash = n => { const v=Math.sin(n*127.1+311.7)*43758.5453; return v-Math.floor(v); };
  function paper(ctx,w,h) {
    ctx.fillStyle=palette.paper;ctx.fillRect(0,0,w,h);
    for(let i=0;i<13000;i++){ctx.fillStyle=`rgba(50,45,28,${.015+hash(i+3)*.045})`;ctx.fillRect(hash(i)*w,hash(i+18000)*h,1+hash(i+900)*2,.6);}
  }
  function mountain(c,y,seed,color,shift=0){c.fillStyle=color;c.beginPath();c.moveTo(-100,720);for(let x=-100;x<=1400;x+=8)c.lineTo(x,y-60*Math.sin(x*.005+seed)-28*Math.sin(x*.017+seed)+shift);c.lineTo(1400,720);c.fill();}
  function wave(c,t,y,amp,color){c.strokeStyle=color;c.lineWidth=1.2;for(let k=0;k<5;k++){c.beginPath();for(let x=-20;x<=1300;x+=7){let yy=y+k*13+Math.sin(x*.012-t*.7+k*.6)*amp+Math.sin(x*.027+t*.4)*3;x===-20?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();}}
  function crab(c,x,y,s,color,t,mood='happy',facing=1){
    c.save();c.translate(x,y+Math.sin(t*3)*2);c.scale(s*facing,s);c.rotate(Math.sin(t*2)*.025);
    c.lineCap='round';c.lineJoin='round';c.strokeStyle=palette.ink;c.lineWidth=3;
    for(let side of [-1,1])for(let i=0;i<3;i++){let xx=side*(21+i*10), yy=30+Math.sin(t*5+i)*3;c.beginPath();c.moveTo(xx,16);c.lineTo(xx+side*8,yy);c.lineTo(xx+side*17,yy+5);c.stroke();}
    c.save();c.translate(3,5);c.fillStyle='#0000001a';c.fillRect(-44,-27,88,52);c.restore();
    c.fillStyle=color;c.beginPath();c.moveTo(-46,-27);c.lineTo(43,-30);c.lineTo(48,24);c.lineTo(-43,27);c.closePath();c.fill();c.stroke();
    c.strokeStyle='#f4dfbd88';c.lineWidth=1;c.strokeRect(-39,-22,74,42);
    // punched paper ornament
    c.fillStyle='#e9dfc960';for(let i=0;i<5;i++){c.beginPath();c.arc(-30+i*15,17,2,0,Math.PI*2);c.fill();}
    c.strokeStyle=palette.ink;c.lineWidth=3;
    for(let side of [-1,1]){c.beginPath();c.moveTo(side*44,0);c.lineTo(side*63,-12-Math.sin(t*3)*5);c.stroke();c.beginPath();c.arc(side*67,-19-Math.sin(t*3)*5,10,.3,5.7);c.stroke();}
    for(let xx of [-18,18]){c.beginPath();if(mood==='sleep'){c.moveTo(xx-5,-5);c.quadraticCurveTo(xx,-1,xx+5,-5);c.stroke();}else{c.fillStyle=palette.ink;c.ellipse(xx,-8,3.8,6,0,0,Math.PI*2);c.fill();c.fillStyle=palette.paper;c.fillRect(xx-1,-11,1.5,2);}}
    c.beginPath();c.arc(0,1,6,.15,Math.PI-.15);c.stroke();c.restore();
  }
  function heart(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=palette.red;c.beginPath();c.moveTo(0,8);c.bezierCurveTo(-28,-10,-9,-27,0,-12);c.bezierCurveTo(9,-27,28,-10,0,8);c.fill();c.restore();}
  return {palette,hash,paper,mountain,wave,crab,heart};
})();
