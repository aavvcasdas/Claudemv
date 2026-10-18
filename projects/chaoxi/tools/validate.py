#!/usr/bin/env python3
"""Validate the lightweight project contract (not artistic quality)."""
import json
from pathlib import Path

def validate(root):
    plan=json.loads((root/'plan.json').read_text())
    review=json.loads((root/'review.json').read_text())
    assert plan['version']==1
    duration=plan['format']['duration_s']
    assert duration>0 and plan['format']['fps']>0
    ids=set(); end=0
    for shot in plan['shots']:
        assert shot['id'] not in ids, 'duplicate shot'
        ids.add(shot['id'])
        assert abs(shot['start_s']-end)<.001, 'gap/overlap'
        assert shot['end_s']>shot['start_s'], 'invalid shot duration'
        for key in ['summary','action','camera_note','transition_out']:
            assert shot.get(key), f'missing {key}'
        end=shot['end_s']
    assert abs(end-duration)<.001, 'timeline incomplete'
    rows=review['shots']
    assert len(rows)==len(ids) and {s['shot_id'] for s in rows}==ids, 'missing/duplicate review'
    by_id={s['id']:s for s in plan['shots']}
    for row in rows:
        shot=by_id[row['shot_id']]
        assert shot['start_s']<=row['sample_s']<shot['end_s']
        assert row['status'] in ['pass','needs_fix','pending']
        assert row['notes']
        assert (root/row['frame']).is_file(), 'missing review frame'
    prod=json.loads((root/'production.json').read_text())
    if prod['status']=='complete':
        assert (root/prod['output']).is_file(), 'missing video'
        assert (root/plan['music']['file']).is_file(), 'missing audio'
    return len(ids)

if __name__=='__main__':
    import argparse
    ap=argparse.ArgumentParser();ap.add_argument('project',nargs='?',default=str(Path(__file__).resolve().parents[1]))
    args=ap.parse_args();print(f'OK: {validate(Path(args.project))} shots')
