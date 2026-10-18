#!/usr/bin/env python3
"""Extract per-shot evidence FROM THE ENCODED VIDEO and make a labelled contact sheet."""
import json,subprocess,shutil
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
def extract(root=ROOT):
    p=json.loads((root/'plan.json').read_text());ff=shutil.which('ffmpeg');assert ff
    out=root/'out/check';out.mkdir(parents=True,exist_ok=True);samples=[]
    cols=4;w=480;h=270;label=25;sheet=Image.new('RGB',(cols*w,((len(p['shots'])+cols-1)//cols)*(h+label)),'#172e31');d=ImageDraw.Draw(sheet)
    for i,s in enumerate(p['shots']):
        t=(s['start_s']+s['end_s'])/2;path=out/f"{s['id']}.jpg"
        subprocess.run([ff,'-y','-v','error','-ss',str(t),'-i',str(root/'out/video.mp4'),'-frames:v','1','-q:v','2',str(path)],check=True)
        with Image.open(path) as image:sheet.paste(image.resize((w,h),Image.Resampling.LANCZOS),((i%cols)*w,(i//cols)*(h+label)))
        d.text(((i%cols)*w+10,(i//cols)*(h+label)+h+5),f"{s['id']}  {t:.2f}s",fill='#eddfbd')
        samples.append({'shot_id':s['id'],'sample_s':t,'frame':f"out/check/{s['id']}.jpg"})
    sheet.save(out/'storyboard.jpg',quality=92)
    with Image.open(out/'S07.jpg') as image:image.save(out/'poster.jpg',quality=94)
    (out/'samples.json').write_text(json.dumps(samples,ensure_ascii=False,indent=2)+'\n');return samples
if __name__=='__main__':print(f'Extracted {len(extract())} shot frames from final MP4')
