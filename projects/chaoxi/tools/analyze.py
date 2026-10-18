#!/usr/bin/env python3
"""ReelMimic analysis entry point. Upstream implementation and MIT notice are vendored."""
import runpy
from pathlib import Path
if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).parent / 'upstream/analyze.py'), run_name='__main__')
