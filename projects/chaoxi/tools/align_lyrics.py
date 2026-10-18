#!/usr/bin/env python3
"""Align user-supplied lyrics, never generate lyric text. Requires local Whisper weights offline."""
import runpy
from pathlib import Path
if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).parent / 'upstream/align_lyrics.py'), run_name='__main__')
