#!/usr/bin/env python3
"""Turn raw Codex image_gen PNGs (art/raw) into optimised web assets (src/art).
- Trims transparent padding on cutout assets, resizes to web sizes, exports WebP (PNG for cursors).
- Prints per-asset output size. Re-run any time; idempotent.
"""
import os, sys, json
from PIL import Image, ImageOps, ImageFilter

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = f"{root}/art/raw"; OUT = f"{root}/src/art"
os.makedirs(OUT, exist_ok=True)

def load(name):
    p = f"{RAW}/{name}.png"
    return Image.open(p).convert("RGBA") if os.path.exists(p) else None

def trim(im, pad=0, thresh=8):
    a = im.getchannel("A").point(lambda v: 255 if v > thresh else 0)
    box = a.getbbox()
    if not box: return im
    l, t, r, b = box
    l = max(0, l - pad); t = max(0, t - pad); r = min(im.width, r + pad); b = min(im.height, b + pad)
    return im.crop((l, t, r, b))

def fit(im, max_w, max_h=None):
    max_h = max_h or max_w
    im = im.copy(); im.thumbnail((max_w, max_h), Image.LANCZOS); return im

def save(im, name, fmt="webp", q=82, lossless=False):
    path = f"{OUT}/{name}.{fmt}"
    if fmt == "webp":
        im.save(path, "WEBP", quality=q, lossless=lossless, method=6)
    else:
        im.save(path, "PNG", optimize=True)
    print(f"{name}.{fmt:<4} {im.width}x{im.height} {os.path.getsize(path)//1024} KB")
    return path

def feather_alpha(im, margin=0.12):
    """Fade the outer `margin` of an opaque image to transparent (for the hero scene blend)."""
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    from PIL import ImageDraw
    d = ImageDraw.Draw(mask)
    mx, my = int(w * margin), int(h * margin)
    d.rectangle((mx, my, w - mx, h - my), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=min(mx, my) * 0.6))
    im = im.copy(); im.putalpha(mask); return im

spec = {
    # name: (kind, max_w, max_h, quality)
    "parchment-bg": ("opaque", 1600, 1100, 78),
    "stone-chrome": ("opaque", 1600, 1100, 78),
    "hero-scene": ("hero", 1400, 1000, 80),
    "plate-primary": ("cutout", 1200, 500, 86),
    "plate-secondary": ("cutout", 1200, 500, 86),
    "rune-ring": ("cutout", 700, 700, 84),
    "crest": ("cutout", 512, 512, 86),
    "wordmark": ("cutout", 1200, 500, 88),
    "corner-ornament": ("cutout", 360, 360, 86),
    "wax-seal": ("cutout", 320, 320, 86),
    "icon-play": ("cutout", 192, 192, 86),
    "icon-howto": ("cutout", 192, 192, 86),
    "icon-gold": ("cutout", 192, 192, 86),
    "icon-packs": ("cutout", 192, 192, 86),
    "icon-settings": ("cutout", 192, 192, 86),
    "icon-minigames": ("cutout", 192, 192, 86),
    "cursor-arrow": ("cursor", 40, 40, 0),
    "cursor-hand": ("cursor", 40, 40, 0),
}
only = set(sys.argv[1:])
meta = {}
for name, (kind, mw, mh, q) in spec.items():
    if only and name not in only: continue
    im = load(name)
    if im is None:
        print(f"-- missing raw: {name}"); continue
    if kind == "opaque":
        im = fit(im.convert("RGB"), mw, mh); save(im, name, q=q)
    elif kind == "hero":
        im = fit(im, mw, mh); im = feather_alpha(im, 0.10); save(im, name, q=q)
    elif kind == "cutout":
        im = trim(im, pad=4); im = fit(im, mw, mh); save(im, name, q=q)
    elif kind == "cursor":
        im = trim(im, pad=2); im = fit(im, mw, mh)
        # hotspot: arrow -> topmost-leftmost opaque pixel; hand -> topmost opaque pixel (fingertip)
        a = im.getchannel("A")
        px = a.load(); best = None
        for y in range(im.height):
            for x in range(im.width):
                if px[x, y] > 60:
                    best = (x, y); break
            if best: break
        canvas = Image.new("RGBA", (mw, mh), (0, 0, 0, 0)); canvas.paste(im, (0, 0))
        save(canvas, name, fmt="png"); meta[name] = {"hotspot": best}
fav = load("crest")
if fav is not None:
    fav = trim(fav); fav.thumbnail((64, 64), Image.LANCZOS); c = Image.new("RGBA", (64, 64), (0,0,0,0)); c.paste(fav, ((64-fav.width)//2, (64-fav.height)//2)); save(c, "favicon", fmt="png")
if meta:
    json.dump(meta, open(f"{OUT}/meta.json", "w"), indent=1); print("meta.json", meta)
