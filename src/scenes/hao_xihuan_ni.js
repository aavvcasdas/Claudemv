// Original, unaccessorized Clawd. All embellishment belongs to the environment.
const HAO_STARTS=[0,3.23,5.74,8.24,11.38,14.54,17.65,20.78];
function haoBox(x,y,w,h,col,r=0){noStroke();fill(col);rect(x,y,w,h,r);}
function haoLine(x,y,a,b,col='#72565A',weight=4){stroke(col);strokeWeight(weight);line(x,y,a,b);noStroke();}
function haoCircle(x,y,r,col){noStroke();fill(col);circle(x,y,r);}
function haoText(s,x,y,size=32,col='#684F59'){noStroke();fill(col);textFont('Noto Serif SC');textSize(size);textAlign(CENTER,CENTER);text(s,x,y);}
function haoHeart(x,y,k,col='#ED8C96') {const c=drawingContext;c.save();c.translate(x,y);c.scale(k,k);c.fillStyle=col;c.beginPath();c.moveTo(0,12);c.bezierCurveTo(-35,-10,-18,-36,0,-17);c.bezierCurveTo(18,-36,35,-10,0,12);c.fill();c.restore();}
function haoPlant(x,y,t,k=1){push();translate(x,y);scale(k);haoBox(-22,0,44,54,'#CE937F',7);for(let j=0;j<3;j++){let xx=(j-1)*25+Math.sin(t*1.3+j)*7;haoLine(0,5,xx,-85-j*10,'#6B947D',5);fill('#91AC89');ellipse(xx-10,-47-j*10,32,14);for(let a=0;a<5;a++){let q=a*TAU/5;haoCircle(xx+Math.cos(q)*13,-85-j*10+Math.sin(q)*13,23,['#EDAFB1','#F0C97C','#D7B2CC'][j]);}haoCircle(xx,-85-j*10,13,'#FFF4C9');}pop();}
function haoBench(x,y){haoBox(x,y,260,20,'#B48567',5);for(let j=0;j<3;j++)haoBox(x,y-80+j*22,260,14,'#BF987A',4);haoBox(x+20,y+20,12,75,'#675E61');haoBox(x+225,y+20,12,75,'#675E61');}
// Lyric-led montage: solitude, protection, facade, helplessness, devotion, moth and awkwardness.
function hvRoom(t,night=false){
 background(night?'#2C344D':'#B9C8CB');haoBox(0,720,W,360,night?'#6C6374':'#C8B4A0');
 haoBox(1050,100,650,525,'#6E7D91',12);haoBox(1075,125,600,475,night?'#314764':'#8EACB9',6);
 for(let i=0;i<24;i++){let x=1080+hash(i)*580,y=130+((t*160+i*67)%460);haoLine(x,y,x-5,y+33,'#AFC3CD',2);}
 haoLine(1370,125,1370,600,'#D0C3B3',12);haoLine(1075,380,1675,380,'#D0C3B3',12);
 haoBox(1010,85,50,590,'#9C8490',4);haoBox(1690,85,90,590,'#9C8490',4);
 haoPlant(1650,755,t,1.2);haoBox(180,330,15,405,'#746273');haoCircle(187,315,110,'#F3D9AC');
 for(let i=0;i<8;i++)haoLine(0,780+i*44,W,780+i*44,night?'#756E7C':'#D6C3AF',2);
}
function hvClawd(t,x,y,u,o={}){clawd(x,y,u,{t,boilKey:'solo',dy:Math.sin(t*2)*.08,sq:.015*Math.sin(t*2),mouth:'flat',...o});}
function hvRain(t){for(let j=0;j<100;j++){let x=hash(j+2)*W,y=(hash(j+20)*1200+t*430)%1200;haoLine(x,y,x-18,y+48,'#AFC7D2',2);}for(let j=0;j<12;j++){noFill();stroke('#A9BBC8');strokeWeight(2);ellipse(hash(j)*W,760+hash(j+3)*150,20+((t*45+j*31)%120),5+((t*10+j)%20));}}
function hvUmbrella(x,y,t,k=1){push();translate(x,y);scale(k);haoLine(0,0,0,245,'#A68E79',8);fill('#DCA16F');noStroke();arc(0,0,530,280,Math.PI,TAU);for(let j=-2;j<=2;j++)haoLine(0,-140,j*120,0,'#BA835D',3);pop();}
function hvStage(t,lt,d,id){
 let p=ease(seg(lt,0,d)),n=Math.sin(lt*2.4);
 if(id===0){ // resolve to protect: one subject in rain then second enters on next shot
  background('#71889B');haoBox(0,730,W,350,'#88959F');haoBox(120,180,470,480,'#687C8C');for(let j=0;j<4;j++)haoBox(160+j*100,250,55,220,'#B2B7AC');hvRain(t);
  hvClawd(t,1160-160*p,800,32,{eyes:'sad',lookY:.5,aL:-.7,aR:-.7,rot:-.06});hvUmbrella(350+290*p,400,t);haoBench(1450,725);
 }else if(id===1){
  background('#738C9A');haoBox(0,730,W,350,'#879CA6');hvRain(t);haoBench(1350,720);
  hvUmbrella(940,400,t,1.2);hvClawd(t,800+60*p,800,29,{lookX:1,aR:.8,eyes:'determined',mouth:'smile'});hvClawd(t,1130-50*p,800,27,{lookX:-1,eyes:p>.5?'normal':'sad',aL:-.5,aR:-.5,mouth:p>.5?'smile':'frown'});
  // Raindrops stop at the canopy instead of decorating the characters.
 }else if(id===2){ // mirror facade, one actual character and reflection within frame
  hvRoom(t,true);haoBox(180,120,620,570,'#B19385',28);haoBox(205,145,570,520,'#7E91A3',18);
  hvClawd(t,495,590,28,{eyes:'happy',mouth:'smile',aL:.2+n*.1,aR:.2-n*.1,flip:true});
  hvClawd(t,900,850,37,{eyes:'sad',mouth:'frown',lookX:-1,aL:-.7,aR:-.7,rot:-.04});
  haoBox(260,720,370,28,'#8B6F62');haoBox(290,748,18,150,'#8B6F62');haoBox(570,748,18,150,'#8B6F62');
 }else if(id===3){ // smile falls away, close single face
  hvRoom(t,true);hvClawd(t,800,880,54,{eyes:lt<.7?'happy':'sad',mouth:lt<.7?'smile':'frown',aL:-.4-p*.3,aR:-.4-p*.3,lookX:-.2,rot:-p*.05});
  // A detached smiling card on the table represents the facade, never worn.
  haoBox(1340,740,230,24,'#8B6F62');haoBox(1370,640+p*60,160,88,'#F2D8BA',12);haoCircle(1410,674+p*60,9,'#7B6270');haoCircle(1490,674+p*60,9,'#7B6270');haoLine(1420,697+p*60,1480,697+p*60,'#7B6270',4);
 }else if(id===4){ // helpless: unread message, empty chair and retreating hand
  hvRoom(t,true);haoBench(1250,760);hvClawd(t,620,855,39,{eyes:'sad',mouth:'frown',aR:.8-p*1.5,aL:-.7,rot:-p*.08});
  haoBox(830,700,300,24,'#987B70');haoBox(960,724,20,160,'#987B70');haoBox(914,580,95,115,'#53546A',12);haoBox(923,591,77,90,'#B5C7CE',4);haoText('…',963,635,28,'#657281');
  for(let j=0;j<3;j++){noFill();stroke('#ADB7C9');strokeWeight(3);arc(960,600,150+lt*50+j*50,90+lt*30+j*30,Math.PI,TAU);}
 }else if(id===5){ // I love you, sole character deciding to send letter
  hvRoom(t);hvClawd(t,790+160*p,850,42,{eyes:'normal',mouth:'smile',aR:.1+p*.7,lookX:1});
  haoBox(1190,640,340,25,'#997760');haoBox(1335,665,22,210,'#997760');haoBox(1240,570,160,75,'#FFF0D4',6);haoLine(1240,570,1320,625,'#D6A8A0',3);haoLine(1400,570,1320,625,'#D6A8A0',3);haoHeart(1320,610,.38);
 }else if(id===6){ // devotion: send warmth out while own room remains cold
  background('#9AB2BD');haoBox(0,760,W,320,'#C7BDB1');haoBox(230,200,430,520,'#D5BAA1',14);haoBox(268,250,350,370,'#E9D4AD',8);haoBox(1400,180,330,560,'#7B8FA3',12);haoBox(1440,220,250,440,'#677B91',6);
  hvClawd(t,850+190*p,840,35,{...move('walk',t),lookX:1,mouth:'smile',aR:.4});
  let x=1030+300*p,y=540-80*Math.sin(p*Math.PI);haoBox(x,y,160,78,'#FFE6BE',8);haoLine(x,y,x+80,y+48,'#D7A7A0');haoLine(x+160,y,x+80,y+48,'#D7A7A0');haoHeart(x+80,y+44,.38);
  for(let j=0;j<10;j++)haoCircle(x+hash(j)*140,650+Math.sin(t*2+j)*40,3,'#F8D3A6');
 }else if(id===7){ // humble liking, very wide solitary courtyard
  background('#35445E');haoBox(0,700,W,380,'#697885');for(let j=0;j<8;j++){haoBox(j*260,220,180,480,'#536076');haoBox(j*260+40,290,80,230,'#E0C4A1');}haoBench(1150,750);hvClawd(t,620+40*p,850,21,{eyes:'sad',lookX:1,mouth:'flat',aL:-.65,aR:-.65});
  haoHeart(1120,440+Math.sin(t*2)*15,.5,'#C49EAC');
  for(let j=0;j<18;j++)haoCircle(hash(j)*W,hash(j+3)*570,2+Math.sin(t+j)**2*2,'#D8D0B7');
 }else if(id===8){ // no characters: moth flies toward lantern, lyric metaphor close-up
  background('#27354D');for(let j=0;j<9;j++)haoBox(j*260,580-hash(j)*150,150,500,'#34435B');
  const c=drawingContext,g=c.createRadialGradient(1370,420,30,1370,420,500);g.addColorStop(0,'#EDC58B');g.addColorStop(1,'#27354D00');c.fillStyle=g;c.fillRect(800,0,1100,960);
  haoLine(1370,0,1370,265,'#BC9D7A',7);haoBox(1240,260,260,310,'#DCA672',30);haoBox(1260,280,220,270,'#F3CE8F',20);haoLine(1240,320,1500,320,'#B98F67');haoLine(1240,510,1500,510,'#B98F67');
  let x=400+820*p,y=660-260*p+Math.sin(t*5)*35;push();translate(x,y);rotate(-.25+Math.sin(t*3)*.15);fill('#E9D7BC');ellipse(-35,0,60*(.3+.7*Math.abs(Math.sin(t*22))),65);ellipse(35,0,60*(.3+.7*Math.abs(Math.sin(t*22))),65);haoLine(0,-28,0,28,'#B9A79C',8);pop();
  for(let j=0;j<18;j++)haoCircle(1220+hash(j)*300,550-((lt*80+j*23)%320),3,'#FFE2A0');
 }else if(id===9){
  hvRoom(t,true);haoBench(1250,760);hvClawd(t,680,860,29,{lookX:1,eyes:'normal',mouth:'flat',aL:-.4,aR:-.4,rot:-.035});haoHeart(1040,450,.45+.07*n,'#BC96A7');
 }else{ // awkwardness: abortive wave, shifting eyes and steps; solo close up
  hvRoom(t);let step=Math.sin(lt*5)*22*(1-p*.6);hvClawd(t,850+step,860,48,{eyes:lt<.7?'wide':'normal',mouth:lt<1?'smile':'wobble',lookX:Math.sin(lt*4),aR:lt<1?.8*Math.sin(lt*3):-.5,aL:-.5,rot:Math.sin(lt*6)*.035,walk:lt*1.3});
  haoBox(1280,700,200,24,'#9B7965');haoPlant(1380,685,t,.7);for(let j=0;j<3;j++)haoLine(640+j*22,360+j*5,634+j*22,390+j*5,'#A5B8BC',5);
 }
 haoText('好喜欢你',170,75,30,id===7||id===8?'#E7D8CC':'#715B68');
}
const HV_START=[0,2.6,5.12,7.25,9,10.4,11.92,14.82,16.44,19.46,20.9];
shots(HV_START.map((s,i)=>[s,(t,lt,d)=>hvStage(t,lt,d,i)]));
// Full sentence remains readable from line onset; only the sung characters change colour.
window.overlayHook=(c,t)=>{
 const l=PROJECT.lyrics.find(l=>t>=l.t&&t<l.end);if(!l)return;
 c.save();c.font='600 52px "Noto Serif SC"';c.textBaseline='middle';c.textAlign='left';
 const chars=[...l.text],width=chars.reduce((a,v)=>a+c.measureText(v).width,0),y=990;
 const g=c.createLinearGradient(0,900,0,1080);g.addColorStop(0,'#1F293700');g.addColorStop(1,'#1F2937BB');c.fillStyle=g;c.fillRect(0,900,W,180);
 let x=(W-width)/2;
 chars.forEach((v,i)=>{const w=l.words[i];c.lineWidth=5;c.strokeStyle='#263347';c.strokeText(v,x,y);c.fillStyle=w&&t>=w.s?'#FFD49B':'#FFF5E8';c.fillText(v,x,y);x+=c.measureText(v).width;});c.restore();
};
