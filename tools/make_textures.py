"""Bake parchment + chrome textures into public/tex. Run: python3 tools/make_textures.py"""
import os, random, math
from PIL import Image, ImageFilter, ImageDraw, ImageChops

random.seed(7)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'tex')
os.makedirs(OUT, exist_ok=True)

def noise_layer(w, h, scale, seed):
    r = random.Random(seed)
    sw, sh = max(2, w // scale), max(2, h // scale)
    small = Image.new('L', (sw, sh))
    small.putdata([r.randint(0, 255) for _ in range(sw * sh)])
    return small.resize((w, h), Image.BICUBIC)

def fbm(w, h, seed, octaves=(64, 32, 16, 8, 4)):
    acc = Image.new('L', (w, h), 128)
    amp, total = 1.0, 0.0
    for i, s in enumerate(octaves):
        layer = noise_layer(w, h, s, seed + i)
        acc = Image.blend(acc, layer, amp / (amp + 1.0)) if i else layer
        amp *= 0.55
    return acc

def parchment(w=1600, h=1000):
    base = Image.new('RGB', (w, h), (214, 190, 146))
    big = fbm(w, h, 11, (128, 64, 32))
    fine = noise_layer(w, h, 1, 99).filter(ImageFilter.GaussianBlur(0.6))
    fiber = noise_layer(w, h, 2, 5).resize((w, h // 6), Image.BILINEAR).resize((w, h), Image.BILINEAR)
    # tone map
    tint = Image.new('RGB', (w, h), (168, 132, 82))
    light = Image.new('RGB', (w, h), (240, 224, 188))
    img = Image.composite(light, tint, big)
    img = Image.blend(img, base, 0.3)
    img = ImageChops.multiply(img, Image.merge('RGB', [Image.eval(fine, lambda v: 190 + v // 4)] * 3))
    img = ImageChops.multiply(img, Image.merge('RGB', [Image.eval(fiber, lambda v: 200 + v // 5)] * 3))
    # creases / fold lines
    crease = Image.new('L', (w, h), 0)
    dc = ImageDraw.Draw(crease)
    for _ in range(9):
        x0, y0 = random.randint(0, w), random.randint(0, h)
        ang = random.uniform(0, math.pi)
        L = random.randint(300, 900)
        pts = []
        for t in range(0, L, 12):
            j = random.uniform(-3, 3)
            pts.append((x0 + math.cos(ang) * t + j, y0 + math.sin(ang) * t + j))
        dc.line(pts, fill=random.randint(70, 120), width=random.choice([1, 1, 2]))
    crease = crease.filter(ImageFilter.GaussianBlur(1.2))
    img = Image.composite(Image.new('RGB', (w, h), (110, 78, 40)), img, Image.eval(crease, lambda v: int(v * 0.6)))
    # stains
    stain = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(stain)
    for _ in range(26):
        cx, cy = random.randint(0, w), random.randint(0, h)
        rx, ry = random.randint(60, 320), random.randint(40, 220)
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=random.randint(20, 70))
    stain = stain.filter(ImageFilter.GaussianBlur(45))
    brown = Image.new('RGB', (w, h), (96, 62, 26))
    img = Image.composite(brown, img, Image.eval(stain, lambda v: int(v * 0.7)))
    # vignette / burnt edges
    vig = Image.new('L', (w, h), 0)
    dv = ImageDraw.Draw(vig)
    for i in range(18):
        k = i / 18
        col = int(255 * (1 - k))
        dv.rectangle([int(w * 0.02 * i / 2), int(h * 0.02 * i / 2), w - int(w * 0.02 * i / 2), h - int(h * 0.02 * i / 2)], fill=col)
    vig = vig.filter(ImageFilter.GaussianBlur(90))
    dark = Image.new('RGB', (w, h), (58, 34, 14))
    img = Image.composite(dark, img, Image.eval(vig, lambda v: int(v * 0.7)))
    img.save(os.path.join(OUT, 'parchment.jpg'), quality=82, optimize=True)

def wood(w=512, h=512):
    """Tileable dark wood/leather for chrome panels."""
    grain = noise_layer(w, h, 3, 21).resize((w // 8, h), Image.BILINEAR).resize((w, h), Image.BILINEAR)
    fine = noise_layer(w, h, 1, 22)
    img = Image.merge('RGB', [
        Image.eval(grain, lambda v: 26 + v // 7),
        Image.eval(grain, lambda v: 20 + v // 10),
        Image.eval(grain, lambda v: 16 + v // 14),
    ])
    img = ImageChops.multiply(img, Image.merge('RGB', [Image.eval(fine, lambda v: 205 + v // 5)] * 3))
    # make it tile by blending mirrored edges
    flipped = img.transpose(Image.FLIP_LEFT_RIGHT)
    img = Image.blend(img, flipped, 0.5)
    img.save(os.path.join(OUT, 'wood.jpg'), quality=80, optimize=True)

def grit(w=256, h=256):
    """Tileable fine grain overlay (PNG alpha) for buttons/metal."""
    n = noise_layer(w, h, 1, 31)
    a = Image.eval(n, lambda v: int(abs(v - 128) * 0.55))
    img = Image.merge('RGBA', [Image.new('L', (w, h), 255)] * 3 + [a])
    img.save(os.path.join(OUT, 'grit.png'), optimize=True)

parchment(); wood(); grit()
print('ok', os.listdir(OUT))
