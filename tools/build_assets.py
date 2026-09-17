#!/usr/bin/env python3
"""Turn raw generated art (see tools/gen_art.py) into optimised runtime assets in public/art.

- parchment / hero / wood -> JPEG plates
- wood is made seamlessly tileable by mirror-tiling
- plaques -> alpha-cropped PNGs used via CSS border-image
- icons / cursors sprite sheets -> individual alpha-cropped PNGs
- fibre.png -> high-pass of the generated parchment, used as a grain overlay

Usage: RAW=/tmp/cw-art/raw python3 tools/build_assets.py
"""
import os, sys, json
from PIL import Image, ImageFilter, ImageChops, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.environ.get('RAW', '/tmp/cw-art/raw')
OUT = os.path.join(HERE, '..', 'public', 'art')
os.makedirs(os.path.join(OUT, 'icons'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'cursors'), exist_ok=True)
meta = {}

def raw(name):
    return Image.open(os.path.join(RAW, name + '.png'))

def save_jpg(im, name, w=None, q=82):
    im = im.convert('RGB')
    if w and im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.jpg'), quality=q, optimize=True, progressive=True)
    meta[name] = im.size
    return im

def alpha_crop(im, thresh=24, pad=0):
    im = im.convert('RGBA')
    a = im.getchannel('A').point(lambda v: 255 if v > thresh else 0)
    box = a.getbbox()
    if not box:
        return im
    l, t, r, b = box
    l, t = max(0, l - pad), max(0, t - pad)
    r, b = min(im.width, r + pad), min(im.height, b + pad)
    return im.crop((l, t, r, b))

def save_png(im, name, w=None):
    if w and im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.png'), optimize=True)
    meta[name] = im.size
    return im

def save_webp(im, name, w=None, q=86):
    """Alpha sprites/plaques ship as WebP (a fifth of the PNG size)."""
    if w and im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + '.webp'), quality=q, method=6)
    meta[name] = im.size
    return im

def fit_square(im, size, pad=0.08):
    """Centre an alpha-cropped sprite in a transparent square canvas."""
    inner = int(size * (1 - pad * 2))
    im = ImageOps.contain(im, (inner, inner), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    canvas.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return canvas

def split_grid(im, cols, rows, inset=0.03):
    """Cells of a generated sprite grid, inset a little so a neighbour's edge never bleeds in."""
    cw, ch = im.width / cols, im.height / rows
    ix, iy = cw * inset, ch * inset
    for r in range(rows):
        for c in range(cols):
            yield im.crop((round(c * cw + ix), round(r * ch + iy), round((c + 1) * cw - ix), round((r + 1) * ch - iy)))

# ---- plates
if os.path.exists(os.path.join(RAW, 'parchment.png')):
    p = raw('parchment')
    save_jpg(p, 'parchment', w=1600, q=80)
    # fibre/grain overlay: high-pass of the parchment itself, tiled small
    g = p.convert('L').resize((512, 512), Image.LANCZOS)
    hp = ImageChops.subtract(g, g.filter(ImageFilter.GaussianBlur(3)), scale=1, offset=128)
    hp = ImageOps.autocontrast(hp, cutoff=1)
    # mirror-tile so it repeats seamlessly, alpha from contrast
    t = Image.new('L', (1024, 1024))
    t.paste(hp, (0, 0)); t.paste(ImageOps.mirror(hp), (512, 0))
    t.paste(ImageOps.flip(hp), (0, 512)); t.paste(ImageOps.flip(ImageOps.mirror(hp)), (512, 512))
    t = t.resize((256, 256), Image.LANCZOS)
    a = t.point(lambda v: int(abs(v - 128) * 1.4))
    fibre = Image.merge('RGBA', [Image.new('L', t.size, 20)] * 3 + [a])
    save_png(fibre.quantize(64, method=Image.Quantize.FASTOCTREE).convert('RGBA'), 'fibre')

if os.path.exists(os.path.join(RAW, 'wood.png')):
    w = raw('wood').convert('RGB')
    w = w.crop((0, 0, min(w.size), min(w.size))).resize((512, 512), Image.LANCZOS)
    tile = Image.new('RGB', (1024, 1024))
    tile.paste(w, (0, 0)); tile.paste(ImageOps.mirror(w), (512, 0))
    tile.paste(ImageOps.flip(w), (0, 512)); tile.paste(ImageOps.flip(ImageOps.mirror(w)), (512, 512))
    save_jpg(tile.resize((768, 768), Image.LANCZOS), 'wood', q=78)

if os.path.exists(os.path.join(RAW, 'hero.png')):
    save_jpg(raw('hero'), 'hero', w=1600, q=82)

# ---- plaques (border-image). All idle/hover/pressed share the idle crop box so they line up.
plaques = ['plaque_idle', 'plaque_hover', 'plaque_pressed', 'plaque_primary', 'plaque_primary_hover']
box_for = {}
for name in plaques:
    path = os.path.join(RAW, name + '.png')
    if not os.path.exists(path):
        continue
    base = 'plaque_primary' if name.startswith('plaque_primary') else 'plaque_idle'
    im = raw(name).convert('RGBA')
    if base not in box_for:
        a = raw(base).convert('RGBA').getchannel('A').point(lambda v: 255 if v > 24 else 0)
        box_for[base] = a.getbbox()
    im = im.crop(box_for[base])
    save_webp(im, name.replace('_', '-'), w=1200)

# ---- icons sprite sheet (3x2)
if os.path.exists(os.path.join(RAW, 'icons.png')):
    names = ['sword', 'scroll', 'sun', 'cards', 'cog', 'dice']
    for n, cell in zip(names, split_grid(raw('icons').convert('RGBA'), 3, 2)):
        save_webp(fit_square(alpha_crop(cell, thresh=40), 144, pad=0.04), 'icons/' + n)

# ---- cursors sprite sheet (2x2)
if os.path.exists(os.path.join(RAW, 'cursors.png')):
    names = ['arrow', 'pointer', 'grab', 'grabbing']
    for n, cell in zip(names, split_grid(raw('cursors').convert('RGBA'), 2, 2)):
        c = alpha_crop(cell, thresh=40)
        # 1x and 2x PNGs (CSS cursors need PNG); the blade tips sit at the top-left of the box
        save_png(fit_square(c, 36, pad=0.03), 'cursors/' + n)
        save_png(fit_square(c, 72, pad=0.03), 'cursors/' + n + '@2x')

for n in ['crest', 'medallion_play']:
    if os.path.exists(os.path.join(RAW, n + '.png')):
        save_webp(fit_square(alpha_crop(raw(n), thresh=24), 256, pad=0.02), n.replace('_', '-'))

json.dump(meta, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
print(json.dumps(meta, indent=1))
