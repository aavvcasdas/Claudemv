# 本项目音频工具

先运行通用音频识别得到analysis/subtitles_raw.json，再搜索比对歌词；本上传混音让tiny识别困难，transcribe_chunks.py为带歌词提示的分块识别，align_uploaded.py为已知文本的注意力强制对齐。脚本使用已安装faster-whisper、librosa、soundfile及本地/tmp/whisper-app模型，可按环境修改模型路径。anchors来自本上传分块结果，不可移植到其他翻唱版本。自动时间仍可能有偏差，不能称为人工听校。report.json中节拍、RMS、onset、harmonic-chroma轮廓用于运动；chroma不是精确音符。
