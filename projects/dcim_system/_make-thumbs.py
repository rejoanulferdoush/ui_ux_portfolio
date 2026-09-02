"""Regenerate web-optimized thumbnails for the DCIM case study.

Every *.png under this folder (recursively, including the per-device
subfolders) -> thumbs/<same relative path>.webp, downscaled to max-width
1920px and encoded at WebP q92 / method 6.

The on-page <img src> points at these webp files; data-full keeps the original
PNG for the lightbox. High DPR phones render the hero / anatomy shots at close
to 1900 CSS px, so 1920 is the smallest width that still looks crisp there, and
q92 keeps small UI text and 1px rules from smearing. Run after adding or
replacing a screenshot:

    python projects/dcim_system/_make-thumbs.py
"""
import os
import sys
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # some full-screen exports are very large

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, "thumbs")

MAXW = 1920
Q = 92

total_in = total_out = count = 0
for root, dirs, files in os.walk(SRC):
    if OUT == root or root.startswith(OUT + os.sep):
        continue
    for name in sorted(files):
        if not name.lower().endswith(".png"):
            continue
        src = os.path.join(root, name)
        rel = os.path.relpath(src, SRC)
        dst = os.path.join(OUT, os.path.splitext(rel)[0] + ".webp")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        try:
            im = Image.open(src).convert("RGB")
            if im.width > MAXW:
                im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
            im.save(dst, "WEBP", quality=Q, method=6)
            ti, to = os.path.getsize(src), os.path.getsize(dst)
            total_in += ti
            total_out += to
            count += 1
            print(f"{rel:70s} {ti/1024:8.0f}KB -> {to/1024:7.0f}KB")
        except Exception as e:  # noqa: BLE001
            print(f"FAIL {rel}: {e}", file=sys.stderr)

if count:
    print(f"\n{count} files  {total_in/1024/1024:.1f}MB -> {total_out/1024/1024:.1f}MB "
          f"({100*total_out/total_in:.1f}%)")
