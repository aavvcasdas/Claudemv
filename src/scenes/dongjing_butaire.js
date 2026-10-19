// 东京不太热 V4: lyric-led campus film. Original Clawd only; no wearable overlays.
// Shot data is authored first in projects/dongjing_butaire/{plan,config}.json.
function djBox(x,y,w,h,col,r=0){noStroke();fill(col);rect(x,y,w,h,r);}
function djLine(x,y,a,b,col='#6A6573',sw=4){stroke(col);strokeWeight(sw);line(x,y,a,b);noStroke();}
function djDisc(x,y,d,col){noStroke();fill(col);circle(x,y,d);}
function djText(s,x,y,size=28,col='#4F5665',align=CENTER){noStroke();fill(col);textFont('Noto Serif SC');textStyle(NORMAL);textAlign(align,CENTER);textSize(size);text(s,x,y);}
function djSky(t,night=false){const c=drawingContext,g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,night?'#26354F':'#B9D4D8');g.addColorStop(.65,night?'#797A96':'#EFDCBA');g.addColorStop(1,night?'#B5A1A8':'#F5E7CF');c.fillStyle=g;c.fillRect(0,0,W,H);for(let j=0;j<5;j++){let x=(j*490+t*7)%2400-240;noStroke();fill(night?'#6F7A92':'#F9F1DF');ellipse(x,110+(j%3)*70,260,32);}}
function djTree(x,y,t,k=1){push();translate(x,y);scale(k);djLine(0,0,12,-285,'#8B7867',22);djLine(5,-165,-75,-250,'#8B7867',11);for(let j=0;j<6;j++){let xx=(j%3-1)*70+Math.sin(t*.9+j)*6,yy=-250-Math.floor(j/3)*65;djDisc(xx,yy,140,['#A3B893','#B4C29B','#92AB8C'][j%3]);}pop();}
function djPlant(x,y,t,k=1){push();translate(x,y);scale(k);djBox(-25,0,50,55,'#BB8D78',6);for(let j=0;j<5;j++){let xx=(j-2)*18+Math.sin(t*1.3+j)*6;djLine(0,10,xx,-70-j%2*25,'#7F9C81',4);fill('#9CB797');ellipse(xx,-62-j%2*25,32,15);}pop();}
function djBench(x,y){for(let j=0;j<3;j++)djBox(x,y-90+j*24,300,16,'#AC8A71',5);djBox(x-8,y,316,22,'#A17C65',6);djBox(x+20,y+22,13,85,'#6C6770');djBox(x+265,y+22,13,85,'#6C6770');}
function djLamp(x,y,on,t){djBox(x-6,y,12,260,'#626A78');djLine(x,y,x+50,y-23,'#626A78',9);if(on){const c=drawingContext,g=c.createRadialGradient(x+50,y-22,3,x+50,y-22,140);g.addColorStop(0,'#FFE8AEAA');g.addColorStop(1,'#FFE8AE00');c.fillStyle=g;c.fillRect(x-90,y-162,280,280);}djDisc(x+50,y-22,34,on?'#FFE5A6':'#7D8793');}
function djFloor(t,night=false){djBox(0,735,W,345,night?'#666B7A':'#D4C2AA');for(let j=0;j<7;j++)djLine(0,780+j*48,W,780+j*48,night?'#757887':'#E0D1BC',2);for(let j=0;j<10;j++)djLine(j*240,735,j*300-200,1080,night?'#757887':'#E0D1BC',2);}
function djBuildings(t,night){for(let j=0;j<8;j++){let x=j*280-100;djBox(x,410-j%3*40,230,325,night?'#5A667C':'#B8B7AD');for(let a=0;a<3;a++)for(let b=0;b<3;b++)djBox(x+25+a*65,450+b*72,38,48,night?'#D9C7A1':'#E6DFCB',3);}}
function djRoom(t,type,night,progress=0){
 djSky(t,night);djFloor(t,night);
 // Windows: exterior school roof, moving clouds, glazing and curtains.
 for(let j=0;j<3;j++){let x=90+j*440;djBox(x,110,370,430,'#8A939C',8);djBox(x+12,122,346,406,night?'#465A78':'#B4CDD0',3);djBox(x+12,400,346,128,night?'#7D7184':'#E4BC9F');djBox(x+45,330,95,165,night?'#5D657A':'#B6B2AD');for(let z=0;z<2;z++)djBox(x+65+z*40,360,20,38,night?'#DCC79E':'#E8E2D3');djLine(x+185,120,x+185,530,'#D9CEBE',12);djLine(x+12,345,x+358,345,'#D9CEBE',10);}
 djBox(1420,125,420,290,'#6A897A',10);djBox(1432,137,396,266,'#3E675D',6);djText(type==='library'?'安 静 自 习':'今 日 自 习',1630,195,32,'#E9E0C6');djLine(1480,240,1760,240,'#D9D7BD',2);djText('夏天过去了，故事还没结束',1630,285,19,'#C4D0BE');djBox(1420,415,420,17,'#AC9276');
 if(type==='dorm'){
  djBox(75,540,320,200,'#9A7C64',8);for(let j=0;j<10;j++)djBox(95+j*27,565,19,120-j%3*12,['#B58079','#8597AB','#C9B288'][j%3],3);djBox(60,530,350,20,'#B79A7C');
 }else if(type==='library'){
  for(let j=0;j<2;j++){djBox(120+j*1370,450,280,285,'#9A816C',7);for(let k=0;k<9;k++)djBox(140+j*1370+k*27,480,18,100,['#A77D78','#788D93','#C8B18C'][k%3],2);djBox(125+j*1370,590,270,12,'#C0A283');}
 }else{
  for(let j=0;j<4;j++){djBox(150+j*430,645,270,18,'#B79979',5);djBox(170+j*430,665,13,100,'#857363');djBox(385+j*430,665,13,100,'#857363');}
 }
 djPlant(1770,735,t,.9);djBox(0,748,W,12,night?'#7D7780':'#A8947D');
}
function djAvenue(t,night,progress=0){djSky(t,night);djBuildings(t,night);djFloor(t,night);for(let j=0;j<5;j++){let x=130+j*420;djTree(x,750,t,.8);djLamp(x+130,465,night||progress>j/5,t);}djBench(1350,770);djBox(620,630,170,110,'#9EAA9C',7);djText('校园步道',705,675,22,'#F5ECD7');for(let j=0;j<12;j++){let x=(hash(j)*2200+t*15)%2200-100,y=760+hash(j+4)*125;push();translate(x,y);rotate(t*.7+j);fill('#C7AB88');noStroke();ellipse(0,0,20,7);pop();}}
function djCorridor(t,night){djSky(t,night);djFloor(t,night);for(let j=0;j<6;j++){let x=80+j*310;djBox(x,70,35,660,'#C1B5AB');djBox(x+45,100,210,350,night?'#61758B':'#BAD0CE',6);djLine(x+150,105,x+150,445,'#DBD1BE',9);}for(let j=0;j<5;j++){let x=1190+j*138;djBox(x,470,125,245,'#8A9D9D',6);djLine(x+90,555,x+90,600,'#D8CBB4',5);djBox(x+15,490,90,6,'#B9C6BE');}djBox(180,450,380,200,'#A88776',6);djBox(193,463,354,174,'#E7DAC2');djText('校园公告',370,500,26);for(let j=0;j<3;j++)djBox(220+j*102,540,78,70,['#CFB4A1','#B1BEB6','#DCC898'][j]);}
function djMusic(t){djRoom(t,'music',true);djBox(1250,530,570,145,'#575665',10);djBox(1260,675,25,120,'#575665');djBox(1760,675,25,120,'#575665');for(let j=0;j<22;j++){djBox(1270+j*24,600,21,65,'#EEE5D1',2);if(j%7!==2&&j%7!==6)djBox(1285+j*24,600,12,38,'#4A4D5B');}djBench(1310,805);djBox(370,650,600,28,'#A88A72',6);djBox(400,678,20,180,'#837264');djBox(920,678,20,180,'#837264');}
function djEnvironment(t,loc,rep,p){let night=rep%2===1||['dorm','desk','music','rooftop'].includes(loc);if(['classroom','dorm','library','desk'].includes(loc))djRoom(t,loc==='desk'?['dorm','library','classroom'][rep%3]:loc,night,p);else if(loc==='music')djMusic(t);else if(loc==='corridor')djCorridor(t,night);else if(loc==='rooftop'){djSky(t,true);djBuildings(t,true);djFloor(t,true);djBox(0,640,W,100,'#9E9CA2');for(let j=0;j<12;j++)djLine(j*170,650,j*170,570,'#AEB0AD',10);djBox(0,555,W,14,'#C7C3B8');djBench(1380,790);}else if(loc==='cafeteria'){djRoom(t,'classroom',false);djText('食 堂',1620,195,36,'#F2E4C7');for(let j=0;j<3;j++)djBench(1000+j*260,830);}else if(loc==='gate'){djSky(t);djBuildings(t,false);djFloor(t);djBox(300,215,50,520,'#B5A595');djBox(1570,215,50,520,'#B5A595');djBox(270,205,1380,110,'#9C9F93',8);djText('青 林 大 学',960,258,56,'#F5EDD9');for(let j=0;j<14;j++)djLine(350+j*90,460,350+j*90,730,'#7E9294',8);djTree(120,770,t,1.1);djTree(1800,770,t,1.1);}else djAvenue(t,night,p);}
function djActor(t,x,y,u,act='idle',p=0,seed=0){
 const breathe=Math.sin(t*2.1+seed)*.09;
 let o={t,boilKey:'student-'+seed,seed,dy:breathe,sq:.012*Math.sin(t*2.1+seed),eyes:'normal',mouth:'flat',aL:-.35,aR:-.35};
 if(act==='walk')Object.assign(o,{walk:t/BEAT,rot:Math.sin(t*4)*.018,aL:Math.sin(t*4)*.3,aR:-Math.sin(t*4)*.3});
 if(act==='sad')Object.assign(o,{eyes:'sad',mouth:'frown',rot:-.05,aL:-.7,aR:-.7,lookY:.4});
 if(act==='type')Object.assign(o,{lookX:1,lookY:.4,aL:.2+.3*Math.sin(t*9),aR:.5-.3*Math.sin(t*9),rot:.02*Math.sin(t*3)});
 if(act==='reach')Object.assign(o,{lookX:1,aR:.15+.9*Math.sin(p*Math.PI),aL:-.55,eyes:p<.6?'wide':'normal'});
 if(act==='aloof')Object.assign(o,{lookX:p<.4?1:-1,eyes:'half',mouth:'flat',aL:-.7,aR:-.7,rot:-.035});
 if(act==='selfhold')Object.assign(o,{lookY:.5,aL:-.4-p*.75,aR:-.4-p*.75,sq:.02*Math.sin(t*3),mouth:p>.5?'frown':'flat'});
 if(act==='turn')Object.assign(o,spinView(p*.5),{aL:-.5,aR:-.5});
 if(act==='happy')Object.assign(o,{eyes:'happy',mouth:'smile',aL:.1+.08*Math.sin(t*3),aR:.1-.08*Math.sin(t*3)});
 clawd(x,y,u,o);
}
function djDesk(x=850,y=740,w=530){djBox(x,y,w,30,'#BD9975',7);djBox(x+25,y+30,22,160,'#8E7563');djBox(x+w-47,y+30,22,160,'#8E7563');}
function djScreen(x,y,w,h,title='QQ',online=true){djBox(x-8,y-8,w+16,h+16,'#6C7082',16);djBox(x,y,w,h,'#EEEADF',10);djBox(x,y,w,56,online?'#86A7B7':'#A3A5AC',10);djDisc(x+25,y+28,12,online?'#B6DFBC':'#D1D0CF');djText(title,x+55,y+28,26,'#FFF5E5',LEFT);djLine(x+18,y+h-65,x+w-18,y+h-65,'#C4C5BE',2);}
function djAlbum(t,p,rep){djScreen(1000,195,650,490,'收藏夹');let x=1050-(p>.55?(p-.55)*700:0),y=285+(p>.55?(p-.55)*400:0);push();translate(x,y);rotate(p>.55?(p-.55)*-.4:0);djBox(0,0,360,245,'#FBF1DD',7);djBox(14,14,332,195,'#B7C9BE');djBox(14,150,332,59,'#CDB99E');djBox(45,70,240,60,'#E4D7BE');djText('去年夏天',180,228,22);pop();djBox(1475,505,70,85,'#A6AFB1',8);djLine(1465,500,1555,500,'#78848F',7);djText(p>.55?'已移除':'查看照片',1325,635,25);}
function djChat(t,p,type,rep){let x=930,y=195,w=760,h=480,shake=type==='notify'?Math.sin(t*34)*(1-p)*14:0;push();translate(shake,0);djScreen(x,y,w,h,type==='history'?'聊天记录 · 去年夏天':'QQ · 校园消息',!['offline','history'].includes(type));
 let line1='在吗？',line2='',line3='';
 if(type==='notify'){line1='收到一条新消息';line2=p>.35?'点击查看':'';djDisc(1570,290,52+8*pulse(t),'#E1AD8C');djText('1',1570,290,24,'#FFFFFF');}
 if(type==='who'){line1=p<.5?'会是谁呢？':'是她发来的消息';line2=p>.6?'你在吗？':'';}
 if(type==='question'){line1='这道题可以帮我看看吗？';line2=p>.2?'x² − 5x + 6 = 0':'';line3=p>.6?'想知道解题的过程':'';}
 if(type==='solve'){line1='这道题可以帮我看看吗？';line2=p>.25?'(x − 2)(x − 3) = 0':'';line3=p>.65?'x = 2 或 x = 3  · 已发送':'';}
 if(type==='offline'){line1='谢谢！不多聊啦';line2=p>.4?'我去吃饭了':'';line3=p>.7?'对方已离开':'';}
 if(type==='history'){line1='去年夏天  08 / 31';line2='下学期再见';line3=p<.45?'在吗……':p<.75?'还记得那天吗……':'';}
 djBox(x+32,y+95,650,88,'#DCE2D7',15);djText(line1,x+60,y+139,28,'#4C5E68',LEFT);
 if(line2){djBox(x+110,y+220,610,68,'#D8E5E5',12);djText(line2,x+135,y+254,27,'#4B5D66',LEFT);}
 if(line3)djText(line3,x+40,y+345,25,'#677684',LEFT);
 djText(['offline','history'].includes(type)?(line3||'没有再发出消息'):'输入消息'+(Math.floor(t*2)%2?' |':''),x+35,y+h-32,22,'#89939A',LEFT);pop();}
function djRecord(t,p){djBox(420,420,580,255,'#B09782',16);djBox(440,440,540,215,'#7C7E86',8);push();translate(675,545);rotate(t*1.5);for(let j=0;j<8;j++){noFill();stroke(j%2?'#454B5A':'#343D50');strokeWeight(9);circle(0,0,200-j*18);}djDisc(0,0,58,'#C7A596');djLine(0,0,26,0,'#E7CC9D',4);pop();djLine(910,470,850,590,'#D8CEB8',10);djDisc(910,470,20,'#B0AB9D');djText('单曲循环',690,705,24,'#E3D3BD');}
function djShot(t,lt,d,shot){
 const k=shot.kind,rep=shot.repeat||0,p=ease(seg(lt,0,d)),phase=Math.floor(lt/2.5),q=lt%2.5/2.5;
 const night=rep%2===1;
 // Gentle intentional push-in, with a different composition on repeated sections.
 push();translate(W/2,H/2);scale(1+.035*p);translate(-W/2-(rep%2)*18*p,-H/2);
 djEnvironment(t,shot.location,rep,p);
 if(k==='gate'){djText('东京不太热',960,500,80,'#F6EAD1');djText('校园暗恋 · Clawd',960,600,32,'#EEE3CE');}
 else if(k==='walk_intro')djActor(t,480+640*p,880,29,'walk',p);
 else if(k==='window_intro'){djDesk(700,720,650);djBox(920,640,145,78,'#EBDBBF',5);djText('收藏夹',995,676,23);}
 else if(k==='desk_intro'){djDesk(870,720,620);djActor(t,700+90*p,865,36,'reach',p);djScreen(1040,395,340,300,'相册');djText('去年夏天',1210,560,26);}
 else if(k==='album'){djDesk(780,760,650);djActor(t,590,865,37,'reach',p);djAlbum(t,p,rep);}
 else if(k==='history'){djDesk(600,775,800);djChat(t,p,k,rep);djBox(530,630,100,110,'#E1D5C0',9);}
 else if(k==='lamps'){djActor(t,460+600*p,885,31,'walk',p);for(let j=0;j<5;j++)djLamp(130+j*390,500,p>j*.18,t);}
 else if(k==='smoke'){
  djActor(t,720,870,34,phase%2?'turn':'sad',phase%2?p:.1);djBox(1110,665,400,24,'#C4B6A4');djBox(1250,648,68,15,'#D5D5C4',5);djLine(1255,642,1310,642,'#E8DDC4',7);djDisc(1310,641,6,'#BC8D76');
  for(let j=0;j<5;j++){let f=(t*.35+j*.2)%1;noFill();stroke(218,220,217,(1-f)*150);strokeWeight(3);arc(1290+Math.sin(t+j)*25,630-f*260,35+f*55,30,0,Math.PI);}
 }
 else if(k==='crowd'){for(let j=0;j<4;j++){let x=((t*75+j*510)%2400)-200;djActor(t,x,760+j%2*35,20+j%2*2,'walk',p,j+1);}djActor(t,1250-440*p,925,36,p>.75?'sad':'walk',p);}
 else if(k==='listen'){djRecord(t,p);djActor(t,1130,865,34,p>.6?'sad':'reach',p);djBench(1470,830);}
 else if(k==='glance'||k==='heartbreak'){
  djActor(t,520+(k==='heartbreak'?70*p:150*p),940,43,k==='heartbreak'?(p<.3?'walk':p>.65?'turn':'sad'):'turn',k==='glance'?.2*p:p>.65?seg(p,.65,1)*.7:0);
  let x=1200+250*p;djActor(t,x,770,21,'happy',p,1);djActor(t,x+220,770,21,'happy',p,2);djLine(x+120,685,x+100,685,'#D97757',12);
 }
 else if(k==='selfhold'||k==='selfhold_close'){djActor(t,960,880,k==='selfhold_close'?58:39,'selfhold',p);djBench(1320,800);}
 else if(['notify','who','question','solve','offline'].includes(k)){
  djDesk(780,770,780);if(shot.cast)djActor(t,550+80*p,895,38,k==='solve'?'type':'reach',p);djChat(t,p,k,rep);
  if(k==='solve'){djBox(810,685,260,80,'#F2E5CE',6);djText(p<.45?'x² − 5x + 6':'(x − 2)(x − 3)',940,721,23);djLine(840+150*p,755,870+150*p,706,'#877366',7);}
 }
 else if(k==='empty'){djDesk(1110,730,420);djBox(1170,675,230,45,'#D5D5C0',10);djDisc(1230,680,46,'#E4C895');djDisc(1330,680,50,'#9EAF89');djBench(1470,820);djActor(t,760+130*p,865,35,p<.5?'walk':'sad',p);}
 else if(k==='distance'){djActor(t,700-80*p,880,36,p>.35?'aloof':'reach',p);djActor(t,1250+230*p,820,28,'walk',p,1);}
 else if(k==='aloof'){djActor(t,880,870,48,'aloof',p);}
 else if(k==='wait'){djActor(t,660+130*Math.sin(p*Math.PI),880,33,p<.6?'walk':'turn',p>.6?(p-.6)*1.2:0);djBench(1300,810);}
 else if(k==='turn'){djActor(t,1110-150*p,860,36,'turn',p);djBench(1450,830);}
 else if(k==='record'){djRecord(t,p);}
 else if(k==='memory'||k==='fade'){
  djDesk(750,750,600);if(k==='fade')djActor(t,540,880,35,'reach',1-p);djBench(1400,810);
  push();translate(980+150*p,420);rotate(-.04+.1*p);const c=drawingContext;c.globalAlpha=1-p*.92;djBox(-220,-170,440,310,'#F4E8CD',8);djBox(-205,-155,410,245,'#B5C7B5');djBox(-170,-80,340,80,'#D7C8AF');djText('那个夏天',0,125,28);pop();
 }
 else if(k==='timeline'){djScreen(310,190,1300,510,'时间轴 · 去年夏天');djLine(430,455,1510,455,'#A6B7B8',8);for(let j=0;j<7;j++){let x=460+j*155-50*p;djDisc(x,455,20,'#A8B9B1');djText('08 / '+(12+j*3),x,510,22);}djBox(650+520*(1-p),330,8,245,'#D8AD87');djText('最后一次聊天',960,600,30);}
 else if(k==='loop'){djRecord(t,p);djActor(t,1220,870,36,phase%2?'sad':'reach',p);djText('↻',1120,510,60,'#D6BD9C');}
 pop();
}
shots(PROJECT.shotPlan.map(s=>[s.start,(t,lt,d)=>djShot(t,lt,d,s)]));
