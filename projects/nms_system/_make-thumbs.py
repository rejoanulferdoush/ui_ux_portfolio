"""Regenerate web-optimized thumbnails for the NMS case study.

Every *.png in this folder -> thumbs/<same-stem>.webp (max-width 1400px, q82).
On-page <img src> points at these webp files; data-full keeps the original PNG
for the lightbox. Run after adding or replacing a screenshot:

    python projects/nms_system/_make-thumbs.py
"""
import os
import sys
from PIL import Image

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, "thumbs")
os.makedirs(OUT, exist_ok=True)

MAXW = 1400
Q = 82

total_in = total_out = count = 0
for name in sorted(os.listdir(SRC)):
    if not name.lower().endswith(".png"):
        continue
    src = os.path.join(SRC, name)
    if not os.path.isfile(src):
        continue
    dst = os.path.join(OUT, os.path.splitext(name)[0] + ".webp")
    try:
        im = Image.open(src).convert("RGB")
        if im.width > MAXW:
            im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
        im.save(dst, "WEBP", quality=Q, method=6)
        ti, to = os.path.getsize(src), os.path.getsize(dst)
        total_in += ti
        total_out += to
        count += 1
        print(f"{name:70s} {ti/1024:8.0f}KB -> {to/1024:7.0f}KB")
    except Exception as e:  # noqa: BLE001
        print(f"FAIL {name}: {e}", file=sys.stderr)

if count:
    print(f"\n{count} files  {total_in/1024/1024:.1f}MB -> {total_out/1024/1024:.1f}MB "
          f"({100*total_out/total_in:.1f}%)")
