#!/usr/bin/env python3
"""Recover EXISTING burned-in subtitles from a local reference video, offline.
Not ASR, not lyric generation, and not a substitute for audio forced alignment.
OCR models ship in the rapidocr_onnxruntime wheel. No model-host downloads required.
"""
import argparse,collections,difflib,json,re
from pathlib import Path
import cv2
from rapidocr_onnxruntime import RapidOCR

def normal(text): return re.sub(r'[^\u3400-\u9fffA-Za-z0-9]','',text)
def extract(source,out,step=.5):
    assert step>0
    model=RapidOCR(intra_op_num_threads=1,inter_op_num_threads=1,det_limit_side_len=1200,det_limit_type='max')
    cap=cv2.VideoCapture(str(source));fps=cap.get(cv2.CAP_PROP_FPS);count=cap.get(cv2.CAP_PROP_FRAME_COUNT)
    if not cap.isOpened() or fps<=0:raise ValueError('cannot decode video')
    duration=count/fps;samples=[]
    for index in range(int(duration/step)):
        t=index*step+step/2;cap.set(cv2.CAP_PROP_POS_MSEC,t*1000);ok,frame=cap.read()
        if not ok:continue
        h,w=frame.shape[:2];crop=frame[int(h*.861):h,int(w*.083):int(w*.917)]
        result,_=model(crop)
        if result:
            best=max(result,key=lambda row:len(normal(row[1]))*row[2]);text=normal(best[1]);score=float(best[2])
            if len(text)>=4 and score>.65:samples.append({'t':round(t,3),'text':text,'confidence':round(score,4)})
        if index%16==0:print(f'OCR {index}/{int(duration/step)}',flush=True)
    cap.release();groups=[]
    for s in samples:
        if groups and s['t']-groups[-1][-1]['t']<step*2.1 and difflib.SequenceMatcher(None,s['text'],groups[-1][-1]['text']).ratio()>.7:
            groups[-1].append(s)
        else:groups.append([s])
    rows=[]
    for g in groups:
        if len(g)<2:continue
        # Repeated recognition wins over a high-scoring one-off error.
        votes=collections.Counter(s['text'] for s in g);text=max(votes,key=lambda x:(votes[x],len(x)))
        rows.append({'start_s':max(0,round(g[0]['t']-step/2,3)),'end_s':min(duration,round(g[-1]['t']+step/2,3)),'text':text,'confidence':round(sum(s['confidence'] for s in g)/len(g),3),'sample_count':len(g),'variants':dict(votes),'status':'needs_visual_review'})
    report={'source':str(source),'method':'burned-in subtitle OCR consensus; no speech recognition','sampling_step_s':step,'timing_uncertainty_s':step/2,'rows':rows,'samples':samples}
    out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(rows,ensure_ascii=False,indent=2),flush=True)
    return report
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('--out',type=Path,required=True);p.add_argument('--step',type=float,default=.5)
    a=p.parse_args();extract(a.source,a.out,a.step)
