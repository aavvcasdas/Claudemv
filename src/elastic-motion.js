// Audio-timed Q motion: area-conserving 2D squash/stretch, anticipation, flight and follow-through.
// Pure time function: deterministic for scrubbing and parallel rendering.
function elasticSample(array,t,step=.1){const f=Math.max(0,t/step),i=Math.min(array.length-1,Math.floor(f));return lerp(array[i]??0,array[Math.min(i+1,array.length-1)]??0,frac(f));}
function elasticPose(t,audio,seed=0){
 const beats=audio.beats;let lo=0,hi=beats.length;
 while(lo<hi){const mid=(lo+hi)>>1;if(beats[mid]<=t)lo=mid+1;else hi=mid;}
 const i=Math.max(0,lo-1),a=beats[i],b=beats[i+1]??a+60/PROJECT.bpm;
 const ph=clamp((t-a)/(b-a));
 const e=elasticSample(audio.energy,t,audio.sample_step),on=elasticSample(audio.onsets,t,audio.sample_step);
 const m=elasticSample(audio.melody,t-.08,audio.sample_step),mel=(m-.5)*2;
 const strength=.65+.35*e,accent=i%4===0?1.18:1;
 // Initial impact compression; late anticipation prepares the following bounce.
 const impact=Math.exp(-ph*13),anticipate=ease(seg(ph,.83,1));
 const flight=ph<.13?0:Math.sin(clamp((ph-.13)/.72)*Math.PI);
 const sy=1-(.20+.08*on)*impact*strength-.08*anticipate+(.11+.05*e)*Math.sin(ph*Math.PI*2.2)*strength;
 return {sy,sx:1/sy,sq:0,dy:-flight*(.75+e*1.65)*accent,
  rot:(.025+.025*e)*Math.sin(t*3.5+seed)+mel*.035,
  dx:.18*Math.sin(ph*TAU+seed)+mel*.24,
  aL:.15+.32*Math.sin(ph*TAU+seed)+mel*.2,
  aR:.15-.32*Math.sin(ph*TAU+seed)+mel*.2,
  walk:t/(b-a)*.5,energy:e,beatPhase:ph};
}
