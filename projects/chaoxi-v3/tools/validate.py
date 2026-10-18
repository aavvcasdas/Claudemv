#!/usr/bin/env python3
"""Validate source boundaries, timeline, review evidence, captions and exact audio stream copy."""
import hashlib,json,subprocess,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
def check_plan(root=ROOT):
    p=json.loads((root/'plan.json').read_text());end=0;ids=set()
    assert p['format']['duration_s']==56
    assert (p['format']['width'],p['format']['height'])==(1920,1080)
    assert p['music']['file']=='assets/song.m4a' and p['music']['bpm']!=118
    for s in p['shots']:
        assert s['id'] not in ids;ids.add(s['id'])
        assert abs(s['start_s']-end)<1e-6 and s['end_s']>s['start_s']
        assert all(s.get(k) for k in ['summary','action','camera_note','transition_out'])
        end=s['end_s']
    assert len(ids)==19 and end==56
    captions=json.loads((root/'assets/captions.json').read_text())['rows'];end=0
    assert len(captions)==16
    for row in captions:
        assert 0<=row['start_s']<row['end_s']<=56 and row['start_s']>=end
        assert row['status']=='visually_reviewed' and row['text'];end=row['end_s']
        vals=[v for _,v in row['fill_samples']];assert vals and all(0<=v<=1 for v in vals)
        assert all(a<=b for a,b in zip(vals,vals[1:]))
    assert captions[0]['text']=='我们都是渺小真实存在'
    assert captions[-1]['text']=='爱炙热的你却忘了爱自己'
    assert not (root/'assets/song.mp3').exists(),'wrong 32 s source accidentally imported'
    assert hashlib.sha256((REPO/'潮汐.mp4').read_bytes()).hexdigest()==p['source_sha256']
    return p

def elementary_hash(path):
    ff=shutil.which('ffmpeg');assert ff,'ffmpeg required'
    audio=subprocess.check_output([ff,'-v','error','-i',str(path),'-map','0:a:0','-c:a','copy','-f','adts','-'])
    return hashlib.sha256(audio).hexdigest()

def validate(root=ROOT,complete=True):
    plan=check_plan(root)
    hashes=[elementary_hash(p) for p in [REPO/'潮汐.mp4',root/'assets/song.m4a']]
    if complete:
        production=json.loads((root/'production.json').read_text());assert production['status']=='complete'
        hashes.append(elementary_hash(root/'out/video.mp4'))
        metadata=json.loads((root/'out/metadata.json').read_text());v=next(s for s in metadata['streams'] if s['codec_type']=='video')
        assert (v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==(1920,1080,'24/1',1344)
        assert abs(float(metadata['format']['duration'])-56)<.05
        review=json.loads((root/'review.json').read_text())['shots'];assert len(review)==19
        assert {r['shot_id'] for r in review}=={s['id'] for s in plan['shots']}
        for row in review:
            assert (root/row['frame']).is_file() and row['status']=='pass' and row['notes']
            shot=next(s for s in plan['shots'] if s['id']==row['shot_id']);assert shot['start_s']<=row['sample_s']<shot['end_s']
    assert len(set(hashes))==1,'audio is not the original AAC stream'
    return {'shots':len(plan['shots']),'captions':16,'original_audio_sha256':hashes[0]}
if __name__=='__main__':
    import argparse
    a=argparse.ArgumentParser();a.add_argument('--preflight',action='store_true');args=a.parse_args();print(json.dumps(validate(complete=not args.preflight),ensure_ascii=False,indent=2))
