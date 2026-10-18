#!/usr/bin/env python3
"""Same-time source/variation contact sheet. Difference evidence, not a quality score."""
import io,shutil,subprocess
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
def main():
    ff=shutil.which('ffmpeg');assert ff
    times=[10.2,21.5,35.8];w=640;h=360;label=28
    sheet=Image.new('RGB',(w*2,(h+label)*len(times)),'#1d264b');draw=ImageDraw.Draw(sheet)
    for i,t in enumerate(times):
        for j,path in enumerate([REPO/'潮汐.mp4',ROOT/'out/video.mp4']):
            data=subprocess.check_output([ff,'-v','error','-ss',str(t),'-i',str(path),'-frames:v','1','-f','image2pipe','-c:v','png','-'])
            with Image.open(io.BytesIO(data)) as image:sheet.paste(image.resize((w,h),Image.Resampling.LANCZOS),(j*w,i*(h+label)))
            draw.text((j*w+12,i*(h+label)+h+7),('SOURCE' if j==0 else 'DETAIL VARIATION')+f'  {t:.2f}s',fill='#f2dfb6')
    out=ROOT/'out/check/source-vs-variation.jpg';sheet.save(out,quality=93);print(out)
if __name__=='__main__':main()
