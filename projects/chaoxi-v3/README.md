# 潮汐 · 星屿微光（细节变奏版 03）

参考用户链接的分支根目录 **`潮汐.mp4`（56 秒）**，不是另一个上传文件 `new潮汐.mp4`，也不是参考仓库的 32 秒歌曲。

这版向原片的美术和舞台靠近：深靛星空、橘杏/莓粉人物、弧形小星球、暖橙日出和浅蓝白昼。保留原声、情节顺序、歌词及单人结尾；不是逐帧照描。

## 改动的细节

| 保留 | 新设计 |
|---|---|
| 橘色主角、粉色伴侣 | 小星形徽章与五瓣花发饰，替代原片装饰 |
| 圆形小世界 | 新的环形边缘、草芽、新月形小水洼和陨坑布局 |
| 相遇与遮雨 | 补短暂挥手，伞面改为交错色细条纹，伞向对方倾斜 |
| 收集快乐的意象 | 小罐改为纸星罐，碎片先飞入再停住 |
| 烟花盛放与消逝 | 更明亮的五瓣/星形轮廓、拖尾火星与不同的爆发布局 |
| 失落、时差、独处 | 保留单人结尾，接住破心后回到小星球；不新增团聚 |

这是在 v2 的手绘骨架、19 镜结构与源字幕恢复成果上继续迭代，不声称重新训练模型或重新声学对齐歌词。上一版完整保留在 `../chaoxi-v2/`。

## 交付与检查

- `out/video.mp4`：56 秒、1920×1080、24 fps；每秒 12 幅独立手绘（拍二）。
- 原片 → 提取 M4A → 最终 MP4 的 AAC 流须 SHA256 一致。音乐不改速、不换曲、不重新编码。
- 16 行字幕沿用从同一源 MP4 恢复、校对的文字与屏幕金色填充比例，不冒称音素级强制对齐。
- `out/check/Sxx.jpg` 和 `storyboard.jpg` 从最终成片解码提取；`review.json` 逐镜记录检查范围与局限。
- 变体绘图词典：`src/scenes/variation.js`。它覆盖美术函数，不替换音轨和歌词时序。

## 预览与复现

在仓库根目录，准备 Node 22、Python、Chrome、ffmpeg、ffprobe：

```bash
npm ci
python projects/chaoxi-v3/tools/preview.py --port=37189
# 渲染（无 GPU 可用软件 GL；CHROME_PATH 指向 Chrome）
CHROME_PATH=/path/to/chrome python projects/chaoxi-v3/tools/render.py
python projects/chaoxi-v3/tools/review_video.py
python projects/chaoxi-v3/tools/validate.py
python -m unittest discover -s projects/chaoxi-v3/tools -p 'test_*.py' -v
CHROME_PATH=/path/to/chrome node projects/chaoxi-v3/tools/smoke.mjs
```

Python 依赖见 `tools/requirements.txt`。重新分析节奏、OCR 提取字幕与真正歌词声学对齐的工具仍保留；本次不更换来源，不重复声称执行了 ASR。
预览支持 HTTP Range 拖动和下载。源码审查与成片播放分开，防止无声源码预览冒充有声成片。

## 来源与版权

与 v2 同源的引擎/字体许可见 `IMPORT.md`、`LICENSE` 与字体目录。歌曲和歌词权利归原权利人。按用户要求随工作分支交付，不推定其他用途的再分发许可。
