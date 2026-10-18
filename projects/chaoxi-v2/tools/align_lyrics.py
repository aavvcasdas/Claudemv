#!/usr/bin/env python3
"""Shared ReelMimic entry point; source/licence: ../../chaoxi/tools/upstream/."""
import runpy
from pathlib import Path
if __name__=='__main__':
    runpy.run_path(str(Path(__file__).resolve().parents[2]/'chaoxi/tools/upstream/align_lyrics.py'),run_name='__main__')
