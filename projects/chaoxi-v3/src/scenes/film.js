// Nineteen newly authored shots, indexed by the actual uploaded reference's story.
// Every pose, prop and camera is a pure function of t: no frame-to-frame simulation.
const FILM_SCENES=[
(t,lt,D)=>{ // S01: the tiny world. Subject scale is deliberately small only here.
 sky(t,{night:1,hy:365});camBegin(480,300,lerp(.67,1.05,ease(lt/D)));
 planet(t,480,395,116);actor(480,277,5,t,{view:'back',noShadow:true,aL:-.2,aR:-.2});flower(506,279,.42);camEnd();
},
(t,lt,D)=>{ // S02: loneliness is played through gaze and a tentative hand, not a static face.
 camBegin(480,300,lerp(1.05,1.18,ease(lt/D)));sky(t,{night:1,hy:265});planet(t,480,690,274);
 const reach=Math.sin(seg(lt,.5,2.5)*Math.PI)*.5;
 actor(440,422,20,t,{...feel('sad',t),view:'q',aR:reach,aL:-.25,lookX:.6,lookY:.2,dy:-Math.sin(t*1.8)*.04});flower(575,420,.9);camEnd();
},
(t,lt,D)=>{ // S03: local weather and the first shooting star.
 camBegin(480,300,1.08);sky(t,{night:1,hy:265});planet(t,480,690,274);
 const star=seg(lt,2.8,3.55);
 if(star>0&&star<1){let x=lerp(850,650,star),y=lerp(70,170,star);ln([[x+90,y-45],[x,y]],1.3,F.cream,0);inkDot(x,y,2,F.cream);}
 actor(445,422,20,t,{...feel(lt<2.8?'sad':'surprised',t),aL:-.3,aR:-.2,lookY:lt>2.8?-.8:0});localCloud(445,197,85,t);flower(575,420,.9);camEnd();
},
(t,lt,D)=>{ // S04: dawn is motivated by the arrival, not an arbitrary background recolour.
 camBegin(480+lt*4,320,1.04);shore(t,{warm:ease(lt/D),hy:260});
 actor(360,447,23,t,{...feel(lt<.7?'surprised':'happy',t),view:'q',lookX:.7,aR:.25+ease(seg(lt,.5,1.2))*.3+Math.sin(lt*7)*.12*(1-ease(seg(lt,1,2))),aL:-.1});
 const enter=easeOut(seg(lt,0,2));actor(lerp(850,620,enter),447,22,t,{...feel('happy',t),view:'q',flip:true,walk:lt<2?lt*2.3:0,aL:.4,aR:.1},true);
 flower(745,452,.8);camEnd();
},
(t,lt,D)=>{ // S05: a genuinely different shot size, close eyes and a held emotional beat.
 camBegin(480,310,1.85);sky(t,{warm:.85,hy:310});
 actor(480,455,32,t,{...feel('surprised',t),eyes:'shine',lookX:.2,aL:.1,aR:.3,blush:.65,dy:-.03*Math.sin(t*2)});
 // Two small paper glints above the eyes, never screen-filling neon.
 for(let k=0;k<2;k++){let x=420+k*120,y=285;paint(starPts(x,y,3+beatPulse(t),.35,4),{wash:F.cream,ink:null});}camEnd();
},
(t,lt,D)=>{ // S06: turn away from the viewer together, toward a wide horizon.
 camBegin(480,315,lerp(1.08,.96,ease(lt/D)));shore(t,{warm:1,hy:220});
 actor(388,445,21,t,{view:'back',aL:-.2,aR:.1,rot:.02,noShadow:true});actor(580,445,20,t,{view:'back',aL:.1,aR:-.1,rot:-.02,noShadow:true},true);
 for(let i=0;i<4;i++)ln([[650-i*12,278+i*21],[730+i*14,280+i*21]],.6,F.gold);camEnd();
},
(t,lt,D)=>{ // S07: exchange, anticipation and a small hop on the measured rhythm.
 camBegin(480,330,1.18);shore(t,{warm:.3,hy:250});
 actor(365,445,22,t,{...feel('happy',t),view:'q',lookX:.5,aL:.2,aR:.5,dy:-Math.max(0,Math.sin(lt*3.7))*.15});
 actor(605,445,21,t,{...feel('happy',t),view:'q',flip:true,aL:.4,aR:.2,dy:-Math.max(0,Math.sin(lt*3.7+.6))*.15},true);
 for(let i=0;i<3;i++){const p=frac(lt*.28+i*.33);heart(480+(i-1)*35,300-p*40,9*(1-p*.3),i%2?F.rose:F.red);}camEnd();
},
(t,lt,D)=>{ // S08: an umbrella arrival with clear screen direction.
 camBegin(480,310,1.03);shore(t,{night:.35,rain:1,hy:245});rain(t);localCloud(370,100,135,t);
 actor(355,450,22,t,{...feel('sad',t),lookY:.2,aL:-.35,aR:-.35});const x=lerp(850,610,easeOut(lt/D));
 actor(x,450,21,t,{...feel('determined',t),view:'q',flip:true,walk:lt*2.8,aL:1.15,aR:.15},true);umbrella(x-20,180,130,-.08);camEnd();
},
(t,lt,D)=>{ // S09: the umbrella is deliberately biased toward the other person.
 camBegin(480,320,1.15);shore(t,{night:.35,rain:1,hy:245});rain(t);
 actor(390,450,23,t,{...feel('moved',t),lookX:.6,aL:-.2,aR:.25});actor(610-lt*12,450,22,t,{...feel('happy',t),flip:true,aL:1.1,aR:.3},true);
 umbrella(lerp(535,478,ease(lt/D)),180,186,lerp(-.05,-.13,ease(lt/D)));camEnd();
},
(t,lt,D)=>{ // S10: storm clearing, a discarded prop remains as continuity evidence.
 camBegin(480,315,lerp(1.05,1,ease(lt/D)));shore(t,{warm:.35,night:.15*(1-lt/D),hy:245});
 actor(405,448,22,t,{...feel('happy',t),aL:.1,aR:.3});actor(590,448,21,t,{...feel('happy',t),flip:true,aL:.3,aR:.1},true);
 push();translate(740,455);rotate(1.1);umbrella(0,0,48,.2);pop();
 for(let i=0;i<3;i++){const x=150+i*270;paint([[x,0],[x+30,0],[x+180,460],[x+110,460]],{wash:F.cream,washOp:18*ease(seg(lt,.1,1)),ink:null});}camEnd();
},
(t,lt,D)=>{ // S11: a shared jar; hands and prop make a readable action triangle.
 camBegin(480,340,1.14);shore(t,{warm:.1,hy:230});
 actor(330,448,23,t,{...feel('happy',t),view:'q',aR:.8,aL:.15,lookX:.7});actor(635,448,22,t,{...feel('happy',t),view:'q',flip:true,aL:.85,aR:.15},true);
 jar(485,416,47,t);for(let i=0;i<5;i++){const p=seg(lt,.2+i*.18,1.7+i*.18);if(p>0&&p<1){let x=lerp(i%2?590:375,485,p),y=330-Math.sin(p*Math.PI)*55+p*55;paint(starPts(x,y,4,.4,4),{wash:i%2?F.rose:F.gold,ink:null});}}camEnd();
},
(t,lt,D)=>{ // S12: intimacy, then the beginning of distance.
 camBegin(480,325,1.32);shore(t,{night:lerp(.45,1,ease(lt/D)),hy:250});
 actor(411,447,24,t,{...feel('happy',t),eyes:'closed',rot:.04,aL:-.2,aR:.2});actor(610-lt*11,447,23,t,{...feel('happy',t),eyes:'closed',rot:-.04,aL:.2,aR:.4},true);
 jar(492,457,18,t);heart(500,218,12+beatPulse(t)*1.3,F.rose);camEnd();
},
(t,lt,D)=>{ // S13: pull back and reserve the upper two-thirds for the first burst.
 camBegin(480,310,lerp(1.08,.86,ease(lt/D)));sky(t,{night:1,hy:390});planet(t,480,735,300);
 actor(430,434,12,t,{...feel('happy',t),view:'back',noShadow:true});actor(555,434,11.5,t,{...feel('happy',t),view:'back',noShadow:true},true);
 const q=seg(lt,.2,1.1);if(q<1){ln([[350,385],[350,lerp(385,135,q)]],1.2,F.gold,0);inkDot(350,lerp(385,135,q),2,F.cream);}
 firework(350,140,lt-1,85,F.gold);firework(650,170,lt-1.7,65,F.rose);camEnd();
},
(t,lt,D)=>{ // S14: the largest burst is authored around the source's 35.09 s energy candidate.
 camBegin(480,310,.86);sky(t,{night:1,hy:390});planet(t,480,735,300);
 actor(433,434,12,t,{...feel('happy',t),rot:.06,noShadow:true});actor(548,434,11.5,t,{...feel('happy',t),rot:-.06,noShadow:true},true);
 const bursts=[[.09,460,140,195,'#ffd783'],[.55,230,160,118,'#f3a7c6'],[1.05,740,205,112,'#b8dcca'],[2.0,570,125,150,'#f6d18b']];
 for(const [at,x,y,r,col] of bursts)firework(x,y,lt-at,r,col);
 // First burst decays before the cut; there is no late reunion or endless looping party.
 camEnd();
},
(t,lt,D)=>{ // S15: the reflection/water match cut reveals that the companion has gone.
 camBegin(480+lt*4,320,1.15);sky(t,{night:1,hy:265});water(t,{night:1,hy:265});
 const sink=ease(seg(lt,.3,2));actor(480,438+sink*18,23,t,{...feel('sad',t),view:'q',lookX:-.4,aL:-.2,aR:-.2,rot:-.04});
 // Foreground water actually occludes the lower body, not an unrelated bed object.
 const edge=[];for(let i=0;i<=22;i++)edge.push([-100+i*(W+200)/22,415+Math.sin(i*.6+t)*4]);paint([[-100,H+100],...edge,[W+100,H+100]],{wash:F.seaDark,ink:null});ln(edge,.65,F.seaLight);camEnd();
},
(t,lt,D)=>{ // S16: the uploaded video's day/night time-difference motif, rebuilt as cut paper.
 sky(t,{night:1,hy:410});camBegin(480,285,.95);const cx=480,cy=290,r=176;
 inkDot(cx,cy,r,F.seaDark);const half=[[cx,cy-r]];for(let i=0;i<=24;i++){let a=Math.PI/2+i/24*Math.PI;half.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}half.push([cx,cy-r]);paint(half,{wash:'#a6b68c',ink:null});
 ln([[cx,cy-r],[cx,cy+r]],1,F.paper,0);inkDot(200,160,27,F.gold);inkDot(760,160,22,F.cream);inkDot(771,151,21,F.night);
 const a=-Math.PI*.78+lt*.045,b=-Math.PI*.23+lt*.045;
 push();translate(cx+Math.cos(a)*(r+4),cy+Math.sin(a)*(r+4));rotate(a+Math.PI/2);actor(0,0,8.5,t,{...feel('sad',t),noShadow:true,view:'q',walk:lt*.5},true);pop();
 push();translate(cx+Math.cos(b)*(r+4),cy+Math.sin(b)*(r+4));rotate(b+Math.PI/2);actor(0,0,8.5,t,{...feel('sad',t),noShadow:true,view:'q',walk:lt*.5});pop();camEnd();
},
(t,lt,D)=>{ // S17: broken heart; no happy ending is invented over the actual reference.
 camBegin(480,310,1.14);sky(t,{night:1,hy:270});planet(t,480,700,280);
 actor(480,425,23,t,{...feel('sad',t),eyes:'closed',aL:-.4,aR:-.4,lookY:.4});heart(480,160,24,F.rose,true);
 const fall=frac(lt*.35);teardrop(420,292+fall*35,4*(1-fall*.3));flower(630,430,.8);camEnd();
},
(t,lt,D)=>{ // S18: a small, physical gesture toward the chest replaces generic pulsing.
 camBegin(480,325,lerp(1.18,1.5,ease(lt/D)));sky(t,{night:1,hy:270});planet(t,480,700,280);
 actor(480,430,26,t,{...feel('moved',t),eyes:'closed',aL:.55,aR:.55,lookY:.2});
 const p=ease(seg(lt,0,2));heart(480,lerp(180,320,p),lerp(24,12,p),mixCol(F.rose,F.gold,p),p<.65);
 if(p>.6)glow(480,320,70,F.gold,(p-.6)*.5);flower(630,430,.8);camEnd();
},
(t,lt,D)=>{ // S19: a single character, self-care, flower, whole small world.
 const z=lerp(1.3,.40,ease(lt/D));camBegin(480,360,z);sky(t,{night:1,hy:430});planet(t,480,650,230);
 actor(480,418,18,t,{...feel('moved',t),eyes:'closed',aL:.35,aR:.35,noShadow:true});heart(480,332,9,F.gold);glow(480,332,110,F.gold,.28);flower(552,430,.9);camEnd();
}
];
shots(FILM_DATA.shots.map((s,i)=>[s.start_s,FILM_SCENES[i]]));
const drawWorldBase=drawWorld;
drawWorld=function(t){drawWorldBase(t);if(t<.7)flash(1-ease(t/.7),F.night);if(t>55)flash(ease((t-55)/1),F.night);};
