// Text and dynamic LINE-LEVEL fill come from the uploaded MP4's burned-in captions.
// The gold pixel ratio is not phoneme/word forced alignment. No unrelated LRC is loaded.
const CAPTION_FONT='"Ma Shan Zheng", serif';
window.EXTRA_FONTS=[[`22px ${CAPTION_FONT}`,(FILM_DATA.captions||[]).map(r=>r.text).join('')]];
function captionProgress(row,t){
 const points=row.fill_samples||[];if(!points.length)return 0;
 if(t<=points[0][0])return points[0][1];
 for(let i=1;i<points.length;i++){if(t<points[i][0]){const [a,va]=points[i-1],[b,vb]=points[i];return lerp(va,vb,clamp((t-a)/(b-a)));}}
 return points.at(-1)[1];
}
window.overlayHook=(c,t)=>{
 c.save();
 if(FILM_DATA.captions_enabled){
  const row=FILM_DATA.captions.find(r=>t>=r.start_s&&t<r.end_s);
  if(row){
   const fade=Math.min(1,(t-row.start_s)/.12,(row.end_s-t)/.12);c.globalAlpha=clamp(fade);
   c.font=`22px ${CAPTION_FONT}`;c.textBaseline='middle';c.textAlign='left';
   const width=c.measureText(row.text).width,x=(W-width)/2,y=506;
   c.fillStyle='#183333';c.beginPath();c.moveTo(x-25,y-18);c.lineTo(x+width+25,y-18);c.lineTo(x+width+32,y);c.lineTo(x+width+25,y+18);c.lineTo(x-25,y+18);c.lineTo(x-32,y);c.closePath();c.fill();
   c.fillStyle=F.cream;c.fillText(row.text,x,y);
   c.save();c.beginPath();c.rect(x-2,y-20,(width+4)*captionProgress(row,t),42);c.clip();c.fillStyle='#e4bc6c';c.fillText(row.text,x,y);c.restore();
  }
 }
 c.globalAlpha=1;c.fillStyle=F.paper;c.fillRect(0,0,W,8);c.fillRect(0,H-8,W,8);c.fillRect(0,0,8,H);c.fillRect(W-8,0,8,H);
 c.strokeStyle='#9b855855';c.lineWidth=.45;c.strokeRect(13,13,W-26,H-26);c.restore();
};
