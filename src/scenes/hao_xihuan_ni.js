// Original, unaccessorized Clawd. All embellishment belongs to the environment.
const HAO_STARTS=[0,3.23,5.74,8.24,11.38,14.54,17.65,20.78];
function haoBox(x,y,w,h,col,r=0){noStroke();fill(col);rect(x,y,w,h,r);}
function haoLine(x,y,a,b,col='#72565A',weight=4){stroke(col);strokeWeight(weight);line(x,y,a,b);noStroke();}
function haoCircle(x,y,r,col){noStroke();fill(col);circle(x,y,r);}
function haoText(s,x,y,size=32,col='#684F59'){noStroke();fill(col);textFont('Noto Serif SC');textSize(size);textAlign(CENTER,CENTER);text(s,x,y);}
function haoHeart(x,y,k,col='#ED8C96') {const c=drawingContext;c.save();c.translate(x,y);c.scale(k,k);c.fillStyle=col;c.beginPath();c.moveTo(0,12);c.bezierCurveTo(-35,-10,-18,-36,0,-17);c.bezierCurveTo(18,-36,35,-10,0,12);c.fill();c.restore();}
function haoPlant(x,y,t,k=1){push();translate(x,y);scale(k);haoBox(-22,0,44,54,'#CE937F',7);for(let j=0;j<3;j++){let xx=(j-1)*25+Math.sin(t*1.3+j)*7;haoLine(0,5,xx,-85-j*10,'#6B947D',5);fill('#91AC89');ellipse(xx-10,-47-j*10,32,14);for(let a=0;a<5;a++){let q=a*TAU/5;haoCircle(xx+Math.cos(q)*13,-85-j*10+Math.sin(q)*13,23,['#EDAFB1','#F0C97C','#D7B2CC'][j]);}haoCircle(xx,-85-j*10,13,'#FFF4C9');}pop();}
function haoBench(x,y){haoBox(x,y,260,20,'#B48567',5);for(let j=0;j<3;j++)haoBox(x,y-80+j*22,260,14,'#BF987A',4);haoBox(x+20,y+20,12,75,'#675E61');haoBox(x+225,y+20,12,75,'#675E61');}
function haoActors(t,lt,ax,ay,bx,by,kind='look'){
 const k=ease(seg(lt,0,1.8)), walk=kind==='walk';
 const wave=Math.sin(lt*3.2), gaze=Math.sin(lt*1.2)*.3;
 clawd(ax,ay,19,{t,boilKey:'hao-a',...move(walk?'walk':'idle',t),lookX:1,lookY:gaze,eyes:lt<.6?'wide':'normal',mouth:'smile',aR:kind==='wave'?.4+wave*.6:.15+k*.35,rot:kind==='lean'?k*.07:wave*.018});
 clawd(bx,by,18,{t,boilKey:'hao-b',...move(walk?'walk':'idle',t,.4),lookX:-1,eyes:kind==='lean'?'happy':'normal',mouth:'smile',aL:kind==='wave'?.4-wave*.6:.15+k*.35,rot:kind==='lean'?-k*.07:-wave*.018});
}
function haoScene(t,lt,dur,id){
 const night=id>=6, dusk=id>=4;
 background(night?'#283752':dusk?'#F5D2BC':'#F5E7DC');
 const ctx=drawingContext,gr=ctx.createLinearGradient(0,0,0,1080);gr.addColorStop(0,night?'#273750':dusk?'#E8B9B6':'#BFDCDD');gr.addColorStop(1,night?'#BE9AA9':'#FFF1D7');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 // Lateral parallax clouds, distant roofs and foliage.
 for(let j=0;j<6;j++){let x=((j*380+t*9)%(W+400))-200;noStroke();fill(night?'#66718B':'#FFF6E5');ellipse(x,130+j%3*65,230,36);}
 if(night){for(let j=0;j<40;j++)haoCircle(hash(j+44)*W,hash(j+89)*500,2+2*Math.sin(t*2+j)**2,'#FFF2C9');haoCircle(1540,170,95,'#FFF0C9');}
 for(let j=0;j<12;j++){haoBox(j*180,480-hash(j)*110,150,260,night?'#4D566F':'#C7B7B1',5);for(let k=0;k<3;k++)haoBox(j*180+25+k*38,440,18,30,night?'#F8D99A':'#EDE7D6',3);}
 haoBox(0,700,W,380,night?'#68657B':'#D7C5AB');
 for(let j=0;j<9;j++)haoLine(0,750+j*48,W,750+j*48,night?'#79718B':'#E4D5BF',2);
 push();translate(W/2,H/2);scale(1.025+.009*Math.sin(lt*.9));translate(-W/2,-H/2);
 const p=ease(seg(lt,.25,dur-.3));
 if(id===0){ // Flower shop: sliding door, swaying bouquets, mutual glance.
  haoBox(200,235,1450,470,'#E7C9B7',16);haoBox(270,315,650,310,'#A6C4C0',10);haoBox(1010,300,460,400,'#789E9C',8);
  for(let j=0;j<9;j++)haoBox(200+j*162,235,162,75,j%2?'#FFF1D7':'#CC7F7E');
  haoText('花与晴天',600,385,48,'#FFF3DA');haoLine(1240+p*110,305,1240+p*110,695,'#F1DDC1',8);
  for(let j=0;j<5;j++)haoPlant(340+j*120,680,t,j%2*.2+.8);
  haoActors(t,lt,1080-150*p,925,1450-160*p,925,'wave');
 }else if(id===1){ // Street approach with moving bicycle and foreground leaves.
  for(let j=0;j<3;j++){haoBox(120+j*600,340,410,355,['#C9A395','#B0BDA8','#D4B68E'][j]);haoBox(160+j*600,410,320,155,'#DDE8DE',7);haoBox(130+j*600,320,390,55,'#E8D4AD',5);}
  haoBench(1180,715);haoActors(t,lt,440+330*p,930,1030+140*p,930,'walk');
  let x=1900-lt*240;for(let q of [-65,65]){noFill();stroke('#6C7470');strokeWeight(7);circle(x+q,770,88);}haoLine(x-65,770,x,690,'#BC7E7D',6);haoLine(x,690,x+65,770,'#BC7E7D',6);
 }else if(id===2){ // Rain shelter, ripples and changing distance; canopy is scenery, not costume.
  haoBox(320,270,1280,55,'#B58B94',10);haoBox(350,325,18,430,'#827783');haoBox(1550,325,18,430,'#827783');haoBench(1100,740);
  haoActors(t,lt,620+140*p,925,1080-90*p,925,'look');
  for(let j=0;j<85;j++){let x=hash(j+2)*W,y=(hash(j+500)*1100+t*510)%1100;if(x<320||x>1600||y<260)haoLine(x,y,x-14,y+45,'#A3BCC6',2);}
  for(let j=0;j<10;j++){noFill();stroke('#A5B7BC');strokeWeight(2);ellipse(hash(j+30)*W,960+hash(j+40)*100,40+((t*35+j*9)%80),6+((t*8+j)%15));}
 }else if(id===3){ // Cafe, steam, pastries and approaching table.
  haoBox(140,180,1640,560,'#C89984',12);for(let j=0;j<3;j++){haoBox(210+j*530,230,450,390,'#A8C6C2',12);haoLine(435+j*530,230,435+j*530,620,'#F5DFC1',12);}
  haoActors(t,lt,440+180*p,925,1470-180*p,925,lt<1.8?'walk':'wave');haoBox(770,730,370,25,'#916A56',12);haoBox(940,755,25,190,'#916A56');
  for(let j=0;j<2;j++){haoBox(825+j*190,680,52,52,'#FFF2D8',10);for(let a=0;a<3;a++){noFill();stroke('#FBECD6');strokeWeight(4);arc(850+j*190+Math.sin(t*2+a)*9,640-a*14,18,26,0,Math.PI);}}
  haoPlant(1650,800,t,1.6);
 }else if(id===4){ // Riverbank, paper boat and ducks moving independently.
  haoBox(0,700,W,380,'#89B5B9');for(let j=0;j<24;j++){let x=(j*180+t*35)%2100-90;haoLine(x,730+(j%7)*48,x+70,730+(j%7)*48,'#C4D7CB',3);}
  haoBox(0,630,880,200,'#D8C1A4',15);haoActors(t,lt,320,790,680,790,'lean');
  let x=900+p*550;fill('#FFF2D7');noStroke();triangle(x-75,840,x+75,840,x,900);triangle(x,835,x,750,x+70,835);
  for(let j=0;j<3;j++){let x=1320+j*130+t*12;fill('#F6D797');ellipse(x,950+Math.sin(t+j)*10,65,35);haoCircle(x+28,930+Math.sin(t+j)*10,28,'#F6D797');}
 }else if(id===5){ // Carousel scenery, Clawds on the ground watching, rotating lamps.
  haoBox(430,650,1050,90,'#CA8C88',35);fill('#D88B88');triangle(360,330,1540,330,950,100);haoBox(380,330,1140,55,'#F5D6A5',10);
  for(let j=0;j<6;j++){let a=t*.8+j*TAU/6,x=950+Math.cos(a)*430,y=570+Math.sin(a)*45;haoLine(x,385,x,y,'#D0A56C',7);haoBox(x-45,y+Math.sin(t*3+j)*15,90,40,'#FBE6C1',20);haoCircle(430+j*205,355,16+3*pulse(t),'#FFF2AF');}
  haoActors(t,lt,460+90*p,970,1420-90*p,970,'wave');
 }else if(id===6){ // Bridge rendezvous: lateral entry then lean, illuminated reflections.
  for(let j=0;j<20;j++)haoLine(j*110,930,j*110+70,950+Math.sin(t+j)*12,'#BDA4A8',4);
  haoBox(0,780,W,48,'#B7A6A4');for(let j=0;j<14;j++)haoBox(j*150,660,13,130,'#BAAAA8');haoBox(0,640,W,24,'#D2BBAA');
  haoActors(t,lt,630+140*p,950,1230-140*p,950,'lean');
  for(let j=0;j<2;j++){let x=210+j*1500;haoBox(x,290,13,500,'#62596C');haoCircle(x+6,285,78,'#EFCB94');haoCircle(x+6,285,48,'#FFF0BB');}
 }else { // Wide night finale, lanterns lift from background rather than worn accessories.
  haoBox(0,760,W,320,'#668280');haoBench(790,800);haoActors(t,lt,810,960,1110,960,'lean');
  for(let j=0;j<14;j++){let x=hash(j+77)*W+Math.sin(t+j)*20,y=900-((lt*100+j*80)%1050);haoBox(x,y,33,43,'#F1BE85',8);haoCircle(x+16,y+28,9,'#FFF0B4');}
  for(let j=0;j<5;j++)haoHeart(680+j*145,530-Math.sin(lt+j)*22,.4+.12*Math.sin(lt*2+j),'#E9A2A4');
 }
 pop();
 // Foreground petals provide depth, not a substitute for the scene-specific actions above.
 if(id!==2)for(let j=0;j<14;j++){let x=(hash(j+3)*2200+t*(20+j%4*8))%2200-100,y=(hash(j+9)*1200+t*22)%1200;push();translate(x,y);rotate(t*.6+j);noStroke();fill(night?'#BAA1B0':'#E9AFB4');ellipse(0,0,16,7);pop();}
 haoText('好 喜 欢 你',235,95,38,night?'#FFF0DA':'#775962');
 haoText(String(id+1).padStart(2,'0')+' / 08',1730,95,23,night?'#E4CCCA':'#927E78');
 if(t>PROJECT.duration-.65){noStroke();fill(38,42,59,255*seg(t,PROJECT.duration-.65,PROJECT.duration));rect(0,0,W,H);}
}
shots(HAO_STARTS.map((s,i)=>[s,(t,lt,d)=>haoScene(t,lt,d,i)]));
