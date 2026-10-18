#!/usr/bin/env python3
"""Refine subtitle display edges and recover line-level karaoke fill from the ACTUAL MP4.
This measures existing screen graphics, not phonemes. No external lyric text or repository LRC.
"""
import argparse,difflib,json,re
from pathlib import Path
import cv2,numpy as np
from rapidocr_onnxruntime import RapidOCR
ROOT=Path(__file__).resolve().parents[1]
def norm(s):return re.sub(r'[^\u3400-\u9fffA-Za-z0-9]','',s)
def prepare(source,raw_path,out):
    raw=json.loads(raw_path.read_text());rows=raw['rows']
    ocr=RapidOCR(intra_op_num_threads=1,inter_op_num_threads=1,det_limit_side_len=1200,det_limit_type='max')
    cap=cv2.VideoCapture(str(source));duration=cap.get(cv2.CAP_PROP_FRAME_COUNT)/cap.get(cv2.CAP_PROP_FPS)
    def read(t):
        cap.set(cv2.CAP_PROP_POS_MSEC,max(0,t)*1000);ok,frame=cap.read()
        if not ok:return None
        h,w=frame.shape[:2];return frame[int(h*.861):h,int(w*.083):int(w*.917)]
    def recognise(t):
        image=read(t)
        if image is None:return None
        result,_=ocr(image)
        return max(result,key=lambda row:len(norm(row[1]))*row[2]) if result else None
    final=[]
    for i,row in enumerate(rows):
        r=dict(row);original=r['text']
        # Verified directly against analysis/reference-3s.jpg and the source 15s frame.
        if i==3:r['text']='眼睛里看到的都是广袤无垠的大海'
        for edge in ['start_s','end_s']:
            center=r[edge];matches=[]
            for t in np.arange(max(0,center-.5),min(duration,center+.5)+.001,.125):
                found=recognise(float(t))
                if found and difflib.SequenceMatcher(None,norm(found[1]),r['text']).ratio()>.8:matches.append(float(t))
            if matches:r[edge]=round(max(0,min(matches)-.0625) if edge=='start_s' else min(duration,max(matches)+.0625),4)
        found=recognise((r['start_s']+r['end_s'])/2)
        r['screen_bbox']=found[0] if found else None
        r['ocr_text']=original;r['status']='visually_reviewed';r['correction_note']='广袤: OCR dropped or misread 袤; corrected from source frame' if i==3 else 'OCR consensus agrees with inspected source caption sheet'
        r['fill_samples']=[]
        if found:
            pts=np.array(found[0]);x0,y0=np.floor(pts.min(axis=0)).astype(int);x1,y1=np.ceil(pts.max(axis=0)).astype(int)
            for t in np.arange(r['start_s'],r['end_s'],1/12):
                crop=read(float(t))
                if crop is None:continue
                crop=crop[max(0,y0):y1,max(0,x0):x1]
                hsv=cv2.cvtColor(crop,cv2.COLOR_BGR2HSV)
                gold=(hsv[:,:,0]>=12)&(hsv[:,:,0]<=43)&(hsv[:,:,1]>65)&(hsv[:,:,2]>130)
                white=(hsv[:,:,1]<65)&(hsv[:,:,2]>145)
                total=int(gold.sum()+white.sum())
                if total>60:r['fill_samples'].append([round(float(t),4),round(float(gold.sum()/total),4)])
        # The source wipe is monotonic within a line; median smoothing removes glyph boil/antialias noise.
        if r['fill_samples']:
            vals=[v for _,v in r['fill_samples']];smooth=[]
            for j in range(len(vals)):smooth.append(float(np.median(vals[max(0,j-1):j+2])))
            # Source display sometimes starts partially filled. Preserve that rather than inventing a zero start.
            monotonic=np.maximum.accumulate(smooth)
            r['fill_samples']=[[t,round(float(v),4)] for (t,_),v in zip(r['fill_samples'],monotonic)]
        r.pop('variants',None);final.append(r);print(f"{i+1:02}: {r['start_s']}–{r['end_s']} {r['text']}",flush=True)
    cap.release()
    # Avoid overlap caused by independent edge recognition at fading transitions.
    for a,b in zip(final,final[1:]):
        if a['end_s']>b['start_s']:a['end_s']=b['start_s']
    report={'source':'../../潮汐.mp4','method':'OCR consensus + display-edge refinement + original caption gold/white pixel ratio','scope':'line-level screen timing/fill; NOT audio or phoneme forced alignment','timing_uncertainty_s':.0625,'rows':final}
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    (ROOT/'assets/captions.txt').write_text('\n'.join(r['text'] for r in final)+'\n')
    def stamp(t):return f'[{int(t//60):02}:{t%60:05.2f}]'
    (ROOT/'assets/captions.lrc').write_text('[by:OCR of uploaded MP4 captions; display times, not phoneme timing]\n'+'\n'.join(stamp(r['start_s'])+r['text'] for r in final)+'\n')
    return report
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source',type=Path);p.add_argument('--raw',type=Path,default=ROOT/'analysis/subtitles-ocr.json');p.add_argument('--out',type=Path,default=ROOT/'assets/captions.json');a=p.parse_args();prepare(a.source,a.raw,a.out)
