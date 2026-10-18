#!/usr/bin/env python3
"""Render 12 drawings/s on twos, mux the original AAC unchanged into a 24 fps / 1080p MP4."""
import argparse,json,os,shutil,subprocess
from pathlib import Path
PROJECT=Path(__file__).resolve().parents[1]
REPO=PROJECT.parents[1]
def run(cmd):
    print('+', ' '.join(map(str,cmd)),flush=True)
    subprocess.run(list(map(str,cmd)),cwd=REPO,check=True)
def main():
    p=argparse.ArgumentParser();p.add_argument('--chrome',default=os.environ.get('CHROME_PATH'));p.add_argument('--skip-render',action='store_true');p.add_argument('--hardware-gl',action='store_true');a=p.parse_args()
    ffmpeg=shutil.which('ffmpeg');ffprobe=shutil.which('ffprobe')
    if not ffmpeg or not ffprobe:p.error('ffmpeg and ffprobe are required on PATH')
    work=PROJECT/'out/work-12fps.mp4';output=PROJECT/'out/video.mp4';output.parent.mkdir(exist_ok=True,parents=True)
    if not a.skip_render:
        cmd=['node','render.mjs','--page=projects/chaoxi-v2/studio.html','--clip','--fps=12','--no-audio',f'--out={work}']
        if a.chrome:cmd.append(f'--chrome={a.chrome}')
        if not a.hardware_gl:cmd.append('--soft-gl')
        run(cmd)
    run([ffmpeg,'-y','-v','error','-i',work,'-i',PROJECT/'assets/song.m4a','-map','0:v:0','-map','1:a:0','-vf','fps=24','-t','56','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',output])
    meta=json.loads(subprocess.check_output([ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(output)]))
    (PROJECT/'out/metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
    print('Wrote',output,flush=True)
if __name__=='__main__':main()
