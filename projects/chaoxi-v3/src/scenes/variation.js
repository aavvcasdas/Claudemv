// V3 detail variation: source-like small worlds, not a duplicate of the source frames.
// Loaded after the shared vocabulary, before the shot list. All changes are deterministic.
Object.assign(F,{ink:'#29273b',soft:'#666b8a',paper:'#f4eadb',cream:'#fff1cd',red:'#e08b62',redDark:'#af604e',redLight:'#f3b58c',rose:'#d591b1',roseDark:'#a26591',roseLight:'#efbad0',gold:'#f0c76a',sea:'#596c9c',seaLight:'#91b1ce',seaDark:'#303b68',night:'#20264d',nightTop:'#192041',hill:'#7dac6d'});
Object.assign(PAL,{paper:F.paper,ink:F.ink,clay:F.red,clayDk:F.redDark,clayLt:F.redLight,cream:F.cream,rose:F.rose});
// Layered curved horizons instead of V2's mountain panorama.
sky=function(t,{night=0,warm=0,rain=0,hy=275}={}){
 const sunset=t>=8.7&&t<15.6,storm=t>=18.2&&t<23.7;
 const n=t<8.7||t>=29.3?Math.max(.88,night):Math.min(.15,night);
 const base=storm?'#8d98aa':sunset?'#ecb58e':mixCol('#b7d7e7',F.night,n);
 boilSeed('v3-sky');slab(-250,-220,W+500,H+500,base);
 for(let j=0;j<3;j++){const edge=[];for(let k=0;k<=28;k++){let x=-200+k*(W+400)/28;edge.push([x,hy+65+j*40+Math.sin(k*.16+j*.8)*24]);}paint([[-200,H+200],...edge,[W+200,H+200]],{wash:mixCol(base,n>.5?'#555b8d':'#9bbdd0',.12+j*.08),ink:null});}
 if(n>.5){for(let i=0;i<46;i++){let x=hash(i+53)*W,y=hash(i+710)*hy*.95;inkDot(x,y,.5+hash(i)*1.2,F.cream,(60+hash(i+9)*130)*(.8+.2*Math.sin(t+i)));}for(let i=0;i<4;i++){const x=hash(i+400)*W,y=25+hash(i+500)*hy*.6;paint(starPts(x,y,2.4,.18,4),{wash:F.cream,washOp:150,ink:null});}}
 if(sunset){const sx=665,sy=245;inkDot(sx,sy,50,'#f9d99a');glow(sx,sy,170,'#ffe1a2',.15);}
 if(storm){for(let j=0;j<5;j++){const x=-70+j*240;paint(ellPts(x,30+Math.sin(j)*16,160,33,32,1),{wash:'#707b92',ink:null});}}
};
planet=function(t,cx,cy,r,{night=1}={}){
 boilSeed('v3-planet');
 const col=night>.5?mixCol('#788aac','#58668d',.3):'#a4c777';
 const outline=[];for(let i=0;i<84;i++){const a=i*TAU/84;outline.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}
 paint(outline,{wash:col,ink:mixCol(F.ink,col,.55),sw:.8});
 // Crescent-shaped pond is an original variation, not a copied crater layout.
 if(r<350){paint(ellPts(cx+r*.28,cy+r*.2,r*.24,r*.105,24,.3,-.2),{wash:mixCol(col,F.seaDark,.27),ink:null});paint(ellPts(cx+r*.32,cy+r*.16,r*.21,r*.08,24,.2,-.2),{wash:col,ink:null});
 for(let i=0;i<9;i++){let a=hash(i+71)*TAU,d=Math.sqrt(hash(i+145))*r*.67;paint(ellPts(cx+Math.cos(a)*d,cy+Math.sin(a)*d,3+hash(i+3)*r*.08,2+hash(i+7)*r*.05,16,.3),{wash:mixCol(col,F.seaDark,.14),ink:null});}}
 // Scalloped rim and grass shoots run along the upper hemisphere.
 const rim=[];for(let i=0;i<=48;i++){const a=Math.PI+i*Math.PI/48;rim.push([cx+Math.cos(a)*(r-3),cy+Math.sin(a)*(r-3)]);}ln(rim,1.2,mixCol(col,F.cream,.4));
 for(let i=0;i<29;i++){const a=Math.PI+.12+i*(Math.PI-.24)/28;const rr=r-2,x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;const len=Math.min(9,r*.055)*( .5+hash(i+91)*.7);ln([[x,y],[x+Math.cos(a-.2)*len,y+Math.sin(a-.2)*len]],.55,mixCol(col,F.ink,.35),0);}
};
shore=function(t,opts={}){
 sky(t,opts);const night=t>=29.3?1:0;
 // Source-like spherical stage; a new curved shoreline and tiny flowers distinguish it.
 planet(t,480,1125,700,{night});
 for(const [x,y,s] of [[220,476,.65],[750,475,.7]])flower(x,y,s);
 if(t>=13.5&&t<15.6){water(t,{hy:255,night:0});planet(t,480,1125,700,{night:0});}
};
water=function(t,{night=0,hy=275}={}){
 boilSeed('v3-water');slab(-200,hy,W+400,H-hy+200,mixCol('#91b7d0','#293359',night));
 for(let i=0;i<7;i++){let y=hy+22+i*35;const p=[];for(let k=0;k<=12;k++)p.push([-100+k*(W+200)/12,y+Math.sin(k*.8+t*.65+i)*3]);ln(p,.55,mixCol(F.cream,F.seaLight,.55),.65);}
};
// Replace V2's hem diamonds with one star badge / a small flower hair clip.
motif=function(u,rose=false){
 if(!rose){paint(starPts(-3.5*u,-3.15*u,.4*u,.45,5),{wash:'#f8db8b',ink:'#b98048',sw:.35});}
 else{for(let i=0;i<5;i++){const a=i*TAU/5;inkDot(1.8*u+Math.cos(a)*.36*u,-8.2*u+Math.sin(a)*.36*u,.23*u,'#fbe5c0');}inkDot(1.8*u,-8.2*u,.16*u,F.roseDark);}
};
const plainUmbrella=umbrella;
umbrella=function(x,y,s,tilt=0){
 plainUmbrella(x,y,s,tilt);push();translate(x,y);rotate(tilt);boilSeed('v3-umbrella-stripes');
 for(let k=-2;k<=2;k++){const xx=k*s*.27;const top=-s*.48*Math.sqrt(Math.max(0,1-(xx/s)**2));ln([[xx*.2,-s*.43],[xx*.65,top*.56],[xx, -2]],1.15,k%2?'#f9e1a3':'#8ea99c',.45);}pop();
};
// Petal/star bursts, brighter trailing sparks and varied radii, rather than copied radial rings.
firework=function(x,y,age,r,col){
 if(age<0||age>2.35)return;const grow=ease(seg(age,0,.6)),fade=1-ease(seg(age,.8,2.35));
 boilSeed('v3-firework-'+x+y);const tint=mixCol(col,'#ffe9b0',.42);
 for(let i=0;i<30;i++){const a=i*TAU/30,shape=1+.12*Math.cos(5*a),d=r*grow*shape*(.76+hash(i+26)*.24),fall=age*age*12;
  const px=x+Math.cos(a)*d,py=y+Math.sin(a)*d*.87+fall;const back=d*(.55+.16*hash(i+41));
  ln([[x+Math.cos(a)*back,y+Math.sin(a)*back*.87+fall*.55],[px,py]],1.05,mixCol(F.night,tint,fade),.15);
  paint(starPts(px,py,(2.1+hash(i+70)*1.5)*fade,.35,4),{wash:tint,washOp:255*fade,ink:null});
  if(i%3===0)inkDot(px+Math.cos(a)*12,py+Math.sin(a)*12,1.4*fade,F.cream,240*fade);
 }
 if(age<.6)glow(x,y,r*.7,tint,.28*(1-age/.6));
};
