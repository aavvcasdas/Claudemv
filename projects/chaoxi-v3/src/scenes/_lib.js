// Original art vocabulary for the actual 56 s upload. No imported song, LRC or scene timings.
const F={ink:'#243d3b',soft:'#4d6861',paper:'#eee2c8',cream:'#faf0d5',red:'#b94d36',redDark:'#793b32',redLight:'#d78b61',rose:'#ba7d7e',roseDark:'#845a67',roseLight:'#ddb0a5',gold:'#c3974c',sea:'#4f7774',seaLight:'#83a497',seaDark:'#294b50',night:'#1c3444',nightTop:'#182a3b',hill:'#627e69'};
Object.assign(PAL,{paper:F.paper,ink:F.ink,clay:F.red,clayDk:F.redDark,clayLt:F.redLight,cream:F.cream,rose:F.rose});
function slab(x,y,w,h,col,op=255){paint([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],{wash:col,washOp:op,ink:null});}
function ln(p,sw=1,col=F.ink,curv=.45){inkLine(p,sw,col,'inkfine',curv);}
function inkDot(x,y,r,col,op=255){paint(ellPts(x,y,r,r,14,.25),{wash:col,washOp:op,ink:null});}
function ridge(y,h,seed,col){
 const points=[];
 for(let i=0;i<=32;i++){let x=-160+i*(W+320)/32,base=Math.pow(.5+.5*Math.sin(i*.30+seed),1.4)*h;points.push([x,y-base-(hash(i+seed*23)-.5)*h*.2]);}
 paint([[-160,H+120],...points,[W+160,H+120]],{wash:col,ink:null});
 for(let j=2;j<29;j+=5){const a=points[j],m=points[j+1],b=points[j+2];ln([a,[m[0],m[1]+5],b],.45,mixCol(col,F.ink,.2));}
}
function gull(x,y,s,t,col=F.soft){ln([[x-s,y-4*Math.abs(Math.sin(t))],[x-s*.45,y-3],[x,y],[x+s*.45,y-3],[x+s,y-4*Math.abs(Math.sin(t))]],.7,col,.7);}
function clouds(t,dark=0){
 boilSeed('cloud-banks');
 for(let j=0;j<3;j++){const cx=100+j*320+Math.sin(t*.08+j)*16,cy=65+j%2*32;const pts=[];for(let i=0;i<15;i++)pts.push([cx-110+i*18,cy+Math.sin(i*.8)*3]);paint([...pts,[cx+145,cy+17],[cx-115,cy+17]],{wash:mixCol(F.cream,F.night,dark*.45),washOp:75,ink:null});}
}
function sky(t,{night=0,warm=0,rain=0,hy=275}={}){
 const base=mixCol(mixCol(F.paper,'#e0af80',warm*.55),F.night,night);
 boilSeed('sky');slab(-220,-200,W+440,H+400,base);
 if(night>.25){for(let i=0;i<42;i++){const x=hash(i+22)*W,y=hash(i+100)*hy*.9;inkDot(x,y,.6+hash(i)*1.1,F.cream,(70+hash(i+9)*120)*night);}}
 clouds(t,night);
 if(rain<.3){const col=night>.4?'#e4d5aa':'#cc9870';inkDot(760,92,night>.4?27:33,col,240);if(night>.4){ln(ellPts(760,92,36,36,28,.2),.4,mixCol(F.gold,base,.45));}}
 // 3 depths, broken contours and unpainted mist form a shanshui landscape.
 boilSeed('far-mountains');ridge(hy+10,110,2,mixCol(base,F.seaLight,.52));ridge(hy+24,83,5,mixCol(base,F.seaLight,.8));ridge(hy+32,54,8,mixCol(F.seaLight,F.seaDark,.15+night*.6));
 for(let j=0;j<2;j++)paint(ellPts(230+j*450,hy-30+j*24,240,6,20,.3),{wash:base,washOp:90,ink:null});
}
function water(t,{night=0,hy=275}={}){
 boilSeed('sea');slab(-200,hy,W+400,H-hy+180,mixCol(F.seaLight,F.seaDark,night*.65));
 for(let k=0;k<4;k++){const y=hy+24+k*44,edge=[];for(let i=0;i<=22;i++)edge.push([-150+i*(W+300)/22,y+Math.sin(i*.55+t*.65+k)*4]);paint([[-150,H+200],...edge,[W+150,H+200]],{wash:mixCol(F.seaLight,F.seaDark,.22+k*.16+night*.18),ink:null});
 for(let j=0;j<3;j++){let x=(hash(k*5+j+88)*W+Math.sin(t*.3+j)*12);ln([[x,y+12+j*8],[x+35,y+10+j*8],[x+90,y+13+j*8]],.45,mixCol(F.cream,F.seaLight,.22+night*.2));}}
}
function shore(t,opts={}){
 sky(t,opts);water(t,opts);boilSeed('shore');
 const edge=[];for(let i=0;i<=24;i++)edge.push([-150+i*(W+300)/24,422+Math.sin(i*.28+t*.4)*4]);
 paint([[-150,H+200],...edge,[W+150,H+200]],{wash:mixCol('#c4bd97',F.seaDark,(opts.night||0)*.5),ink:null});
 ln(edge,.65,mixCol(F.paper,F.seaLight,.25));
 for(let i=0;i<16;i++){const x=hash(i+400)*W,y=445+hash(i+600)*55;slab(x,y,3+hash(i+22)*7,.6,mixCol(F.hill,F.ink,.1),90);}
 reeds(35,535,t,opts.night||0);reeds(925,535,t+.6,opts.night||0,-1);
}
function reeds(x,y,t,night,flip=1){push();translate(x,y);scale(flip,1);boilSeed('reeds'+x);
 for(let i=0;i<6;i++){const tx=12+i*10+Math.sin(t*.7+i)*3,ty=-50-hash(i+77)*60;ln([[i*6,0],[tx-10,ty*.5],[tx,ty]],.7,mixCol(F.hill,F.ink,night*.55));paint([[tx,ty+16],[tx+19,ty-12],[tx+9,ty-1]],{wash:mixCol(F.hill,F.ink,night*.55),ink:null});}pop();}
function planet(t,cx,cy,r,{night=1}={}){
 boilSeed('paper-planet');inkDot(cx+7,cy+9,r,F.ink,120);inkDot(cx,cy,r,mixCol('#9caa92',F.seaDark,night*.3));
 const arc=[];for(let i=0;i<=25;i++){const a=Math.PI+Math.PI*i/25;arc.push([cx+Math.cos(a)*(r-4),cy+Math.sin(a)*(r-4)]);}ln(arc,1.8,mixCol(F.cream,F.hill,.35));
 for(let i=0;i<16;i++){const a=hash(i+60)*Math.PI*2,rr=Math.sqrt(hash(i+100))*r*.78;inkDot(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,2+hash(i+6)*7,mixCol(F.hill,F.seaDark,.2),90);}
}
function flower(x,y,s=1){push();translate(x,y);scale(s);ln([[0,0],[1,-22]],.65,F.hill);for(let i=0;i<5;i++){const a=i*TAU/5;inkDot(Math.cos(a)*5,-24+Math.sin(a)*5,3.3,F.cream);}inkDot(0,-24,2,F.gold);pop();}
function motif(u,rose=false){for(let i=-3;i<=3;i++){paint([[i*u,-2.55*u],[i*u+.15*u,-2.8*u],[i*u,-3.05*u],[i*u-.15*u,-2.8*u]],{wash:F.cream,washOp:190,ink:null});}
 if(rose){paint([[-.25*u,-8.25*u],[-1.2*u,-8.85*u],[-1.2*u,-7.85*u]],{wash:F.roseLight,ink:F.roseDark,sw:.55});paint([[.25*u,-8.25*u],[1.2*u,-8.85*u],[1.2*u,-7.85*u]],{wash:F.roseLight,ink:F.roseDark,sw:.55});inkDot(0,-8.25*u,.23*u,F.roseDark);}}
function actor(x,y,u,t,o={},rose=false){
 const draw=o.draw;
 clawd(x,y,u,{col:rose?F.rose:F.red,dk:rose?F.roseDark:F.redDark,lt:rose?F.roseLight:F.redLight,...o,emote:null,boilKey:rose?'companion':'hero',draw:(uu,sw)=>{motif(uu,rose);if(draw)draw(uu,sw);}});
}
function heart(x,y,r,col=F.red,broken=false){
 const pts=[];for(let i=0;i<32;i++){let a=i/32*TAU;pts.push([x+r*Math.pow(Math.sin(a),3),y-r*(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/16]);}
 paint(pts,{wash:col,ink:null});if(broken)ln([[x+2,y-r*.7],[x-3,y-r*.1],[x+5,y+r*.16],[x-2,y+r*.6]],1.2,F.cream,0);
}
function rain(t,k=1){boilSeed('rain');for(let i=0;i<38;i++){let x=hash(i+2)*(W+150)-75,y=frac(hash(i+30)+t*.7)*(H+80)-40;ln([[x,y],[x-7,y+21]],.5,F.cream,.1);}}
function localCloud(x,y,s,t){boilSeed('little-cloud');for(let i=0;i<5;i++)inkDot(x+(i-2)*s*.32,y-Math.sin(i*.8)*s*.13,s*.28,mixCol(F.paper,F.night,.65));for(let i=0;i<6;i++){let yy=y+18+frac(t*1.6+i*.17)*30;ln([[x-25+i*10,yy],[x-27+i*10,yy+7]],.6,F.seaLight,0);}}
function umbrella(x,y,s,tilt=0){push();translate(x,y);rotate(tilt);boilSeed('umbrella');const dome=[];for(let i=0;i<=16;i++){let a=Math.PI+i/16*Math.PI;dome.push([Math.cos(a)*s,Math.sin(a)*s*.48]);}
 const rim=[];for(let i=8;i>=0;i--)rim.push([-s+i*s/4,i%2?8:0]);paint([...dome,...rim],{wash:F.gold,ink:F.ink,sw:.8});
 for(let side of [-1,0,1])ln([[0,-s*.48],[side*s*.38,-s*.27],[side*s*.65,0]],.55,mixCol(F.gold,F.ink,.4));ln([[0,-s*.48],[0,s*.98],[8,s*1.05],[13,s*.94]],1,F.ink);pop();}
function teardrop(x,y,s,col=F.seaLight){paint([[x,y-s],[x+s*.55,y],[x+s*.3,y+s*.45],[x-s*.3,y+s*.45],[x-s*.55,y]],{wash:col,ink:null,curv:.3});}
function jar(x,y,s,t){boilSeed('memory-jar');paint(rectPts(x-s*.5,y-s*1.3,s,s*1.5,2,.1),{wash:mixCol(F.cream,F.seaLight,.5),washOp:180,ink:F.ink,sw:.7});slab(x-s*.44,y-s*1.45,s*.88,s*.2,F.gold);for(let i=0;i<6;i++){const xx=x+(hash(i+90)-.5)*s*.7,yy=y-s*.9+hash(i+80)*s*.7;paint(starPts(xx,yy,2.5+hash(i)*1.5,.45,4),{wash:i%2?F.gold:F.rose,ink:null});}}
function firework(x,y,age,r,col){if(age<0||age>2.2)return;const grow=ease(seg(age,0,.65)),fade=1-ease(seg(age,.8,2.2));boilSeed('firework-'+x+y);
 for(let i=0;i<28;i++){const a=i*TAU/28,d=r*grow*(.78+hash(i+3)*.22),fall=age*age*10;const xx=x+Math.cos(a)*d,yy=y+Math.sin(a)*d*.86+fall;ln([[x+Math.cos(a)*d*.65,y+Math.sin(a)*d*.56+fall*.6],[xx,yy]],.8,mixCol(F.night,col,fade),0);inkDot(xx,yy,1.8*fade,col,240*fade);}
 if(age<.5)glow(x,y,r*.7,col,.5*(1-age/.5));}
function beatPulse(t){let last=0;for(const b of FILM_DATA.beats){if(b>t)break;last=b;}return Math.exp(-(t-last)*8);}
