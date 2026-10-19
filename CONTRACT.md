# CONTRACT — Lightweight Reference-to-Remake File Contract & Shot-by-Shot Review

This repository combines:
1. **ReelMimic's reference analysis & verification tools** (`tools/analyze.py`, `tools/align_lyrics.py`, `tools/beat_grid.py`, `tools/clip_strip.py`, `tools/motion_check.py`, `tools/compare.py`) and **file contract + shot-by-shot review** methodology.
2. **lemo-opuscar's `STYLE.md` specification** (Material / Palette / Camera / Soundscape / Red Lines) and **Chinese traditional MV procedural toolkits** (**水墨 `INK`**, **皮影 `SHADOW`**, **剪纸 `PAPERCUT`**) in `src/_lib.js` and `styles/*/STYLE.md`.
3. **Claudemv's lightweight single-page rendering pipeline** (`studio.html` + `render.mjs` + `src/core.js` + `src/karaoke.js` + `src/timeline.js`) — avoiding heavy multi-agent orchestration overhead while keeping deterministic, frame-accurate verification.

---

## Directory Layout (`projects/<slug>/` & Workspace Root)

```text
Claudemv/
├── CONTRACT.md                      # This file contract & shot-by-shot review protocol
├── studio.html                      # Render harness (loads fonts, core.js, _lib.js, karaoke.js, scene scripts)
├── render.mjs                       # Headless Chromium frame renderer, contact-sheet generator & ffmpeg muxer
├── tools/                           # Shared reference breakdown & verification scripts (mirrored in projects/*/tools/)
│   ├── analyze.py                   # Reference video -> report.json, sheet_1fps.jpg, sheet_scenes.jpg, audio.wav
│   ├── align_lyrics.py              # Audio/video + lyrics.txt -> subs.lrc, subs.json, lyrics.json (Whisper + offline onset/KTV fallback)
│   ├── beat_grid.py                 # Audio + subs.lrc -> plan.json (BPM, beat grid, energy curve, lyric spans)
│   ├── clip_strip.py                # High-fps contact strip of a reference or rendered time range
│   ├── motion_check.py              # Per-frame pixel-diff diagnostic (catches frozen holds, inadvertent cuts, strobing)
│   └── compare.py                   # Side-by-side contact sheet + synchronized dual video (reference vs. remake)
├── styles/
│   ├── ink-wash/STYLE.md            # 水墨 (Ink-Wash) — Material, Palette, Camera, Soundscape, INK.* API
│   ├── shadow-puppet/STYLE.md       # 皮影 (Shadow-Puppet) — Material, Palette, Camera, Soundscape, SHADOW.* API
│   └── papercut-red/STYLE.md        # 剪纸 (Papercut-Red) — Material, Palette, Camera, Soundscape, PAPERCUT.* API
├── src/
│   ├── config.js                    # Active project configuration (BPM, duration, offset, audio, style, lyrics)
│   ├── core.js                      # Timing helpers, camera, paint/inkLine engine, paper/grain compositor
│   ├── _lib.js                      # lemo-opuscar math/interpolation core + INK (水墨), SHADOW (皮影), PAPERCUT (剪纸)
│   ├── karaoke.js                   # Brush-calligraphy KTV subtitle renderer with per-character fill & emphasis
│   ├── clawd.js                     # Expressive character rig (plus Eastern scholar/maiden accessories)
│   ├── timeline.js                  # Shot dispatcher & transitions
│   └── scenes/                      # Scene / MV modules
└── projects/<slug>/
    ├── tools/                       # Project-local copy of analysis & verification scripts
    ├── analysis/
    │   ├── source.mp4               # Reference video
    │   ├── audio.wav                # Extracted reference audio (44.1 kHz)
    │   ├── report.json              # Scene cuts, BPM, beat grid, peak candidates, energy curve
    │   ├── sheet_1fps.jpg           # 1 fps overview contact sheet
    │   ├── sheet_scenes.jpg         # Start / mid / end thumbnails for every detected scene
    │   ├── peak_1.jpg..peak_N.jpg   # 6–8 fps micro-strips around each musical/visual climax
    │   ├── peaks.json               # Annotated peak breakdown (reference action -> remake translation)
    │   ├── lyrics.txt               # Plain-text lyric lines
    │   ├── subs.lrc                 # Timestamped LRC lines
    │   ├── subs.json / lyrics.json  # Line + per-character karaoke timings
    │   └── STYLE.md                 # Project style bible (reference analysis + target remake style spec)
    ├── STORYBOARD.md                # Shot-by-shot storyboard locking timestamps, lyrics, camera, and style motifs
    ├── plan.json                    # Beat grid + lyric alignment + shot plan
    └── out/
        ├── video.mp4                # Final rendered 1920x1080 @ 24fps H.264 + AAC MV with extracted audio
        └── check/
            ├── motion.json          # Output of motion_check.py
            ├── sheet_1fps.jpg       # 1 fps contact sheet of rendered remake
            ├── vs_sheet.jpg         # Side-by-side reference vs. remake contact sheet (from compare.py)
            ├── vs_video.mp4         # Side-by-side reference vs. remake synchronized video (from compare.py)
            └── review.md            # Shot-by-shot audit against STORYBOARD.md & STYLE.md
```

---

## 当前默认约束

遵守 `AGENTS.md` 和 `docs/MV_WORKFLOW.md`：先更新项目配置及逐句分镜，再制作；Clawd默认原貌无穿戴；人物数量随歌词需要；完整句字幕及词高亮。旧角色服装示例仅为历史内容，不能作为新制作默认。运动检查不许靠不可见像素变化规避。

## Stage Gates & Artifact Contract

### Stage 1 — Reference Breakdown (`analysis/`)
**Producer**: `tools/analyze.py`, `tools/align_lyrics.py`, `tools/clip_strip.py`, `tools/beat_grid.py`

**Required Artifacts**:
- `analysis/report.json`, `analysis/sheet_1fps.jpg`, `analysis/sheet_scenes.jpg`, `analysis/audio.wav`
- `analysis/peak_1.jpg` .. `analysis/peak_3.jpg` + `analysis/peaks.json`
- `analysis/lyrics.txt`, `analysis/subs.lrc`, `analysis/subs.json`, `analysis/lyrics.json`
- `analysis/STYLE.md`

**Gate**:
1. Every lyric line in `subs.json` / `lyrics.json` must have monotonic `[t, end]` timestamps within `[0, duration]` and character-level `words: [{w, s, e}]`.
2. `sheet_1fps.jpg`, `sheet_scenes.jpg`, and `peak_*.jpg` must be visually inspected before writing `STORYBOARD.md`.

---

### Stage 2 — Storyboard & Style Lock (`STORYBOARD.md` + `analysis/STYLE.md`)
**Required Content**:
- **Cast & Motifs**: Named character designs, props, and which `src/_lib.js` style toolkit (`INK`, `SHADOW`, `PAPERCUT`) governs each act/shot.
- **Shot Table**: Contiguous shots covering `0.00s` to `duration` (`56.00s`) with exact `[t0, t1]`, synced lyric line(s), camera movement (`camBegin` / zoom / pan), background layers, character action, and transition (`iris`, `brushWipe`, `flash`, scroll split).
- **Peak Mapping**: Every peak in `analysis/peaks.json` must map to a concrete visual climax in `STORYBOARD.md`.

---

### Stage 3 — Scene Authoring & Stills Check (`src/`)
**Rules**:
- Every frame must be a **pure function of `t`** (`drawWorld(t)`). No mutable state may accumulate across frames.
- Before rendering the full video, render representative stills across every shot (`node render.mjs --stills=...`) and inspect them visually to catch coordinate, layering, palette, or subtitle placement issues early.

---

### Stage 4 — Full Render & Shot-by-Shot Review (`out/video.mp4` & `out/check/review.md`)
**Verification Commands**:
```bash
node render.mjs --encode
python3 tools/motion_check.py out/video.mp4 --json out/check/motion.json
python3 tools/compare.py <ref.mp4> out/video.mp4 --sheet out/check/vs_sheet.jpg --video out/check/vs_video.mp4
```

**Shot-by-Shot Review Checklist (`out/check/review.md`)**:
1. **Timing & Rhythm**: Does every shot cut and climax land on the planned beat and lyric timestamp?
2. **Style Fidelity**: Do the rendered frames honor `STYLE.md` (material texture, color palette, traditional Chinese motifs, lighting, and typography)?
3. **Motion Continuity**: Does `motion_check.py` confirm active motion in every shot with no accidental freezes or unintended black frames?
4. **Karaoke Legibility**: Are all 16 lyric lines legible, accurately timed to the vocal, and harmoniously integrated with the artwork?
