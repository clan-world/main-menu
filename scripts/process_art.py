#!/usr/bin/env python3
"""Key magenta, crop cursors, emit PNG/JPG plates, compile the hearth loop."""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path(
    "/home/box/.grok/sessions/%2Fworkspace%2Fclan-world%2Fmain-menu-grok"
    "/01a0b0f8-200e-73f2-87ef-441ab3e1a925/images"
)
ART = Path("/workspace/clan-world/main-menu-grok/public/art")
CURS = Path("/workspace/clan-world/main-menu-grok/public/cursors")
TMP = Path("/tmp/clan-art")
ART.mkdir(parents=True, exist_ok=True)
CURS.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)


def rgb_to_hsv(arr: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    diff = mx - mn
    s = np.where(mx > 1e-6, diff / np.maximum(mx, 1e-6), 0.0)
    v = mx
    h = np.zeros_like(mx)
    mask = diff > 1e-6
    rc = np.zeros_like(mx)
    gc = np.zeros_like(mx)
    bc = np.zeros_like(mx)
    np.divide((g - b), diff, out=rc, where=mask)
    np.divide((b - r), diff, out=gc, where=mask)
    np.divide((r - g), diff, out=bc, where=mask)
    h = np.where((mx == r) & mask, (rc % 6.0) * 60.0, h)
    h = np.where((mx == g) & mask, (gc + 2.0) * 60.0, h)
    h = np.where((mx == b) & mask, (bc + 4.0) * 60.0, h)
    h = np.mod(h, 360.0)
    return h, s, v


def key_magenta(im: Image.Image) -> Image.Image:
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0
    h, s, v = rgb_to_hsv(rgb)
    # Magenta / hot-pink / purple chroma field.
    mag = (
        ((h >= 265) | (h <= 340))
        & (h >= 265)
        & (s >= 0.22)
        & (v >= 0.22)
        & (rgb[..., 1] < np.minimum(rgb[..., 0], rgb[..., 2]) + 0.08)
    )
    mag = mag | ((h >= 300) | (h <= 20)) & (h >= 300) & (s >= 0.18) & (v >= 0.3)
    # Soft alpha: fully gone on strong magenta, keep gold/iron.
    dist = np.minimum(np.abs(h - 310.0), 360.0 - np.abs(h - 310.0))
    mag_score = np.clip(1.0 - dist / 45.0, 0.0, 1.0) * np.clip((s - 0.15) / 0.5, 0.0, 1.0)
    mag_score = np.where(rgb[..., 1] > 0.55, mag_score * 0.15, mag_score)  # protect gold
    alpha = 1.0 - mag_score
    alpha = np.where(mag & (s > 0.35) & (rgb[..., 1] < 0.45), 0.0, alpha)
    alpha = np.clip(alpha, 0.0, 1.0)

    out = rgb.copy()
    # Despill remaining magenta on edges.
    spill = (1.0 - alpha)[..., None]
    out = out * (1.0 - 0.65 * spill) + np.array([0.12, 0.08, 0.04]) * 0.65 * spill
    # Despill remaining magenta toward bronze so hover glow stays gold.
    b = out[..., 2]
    g = out[..., 1]
    r = out[..., 0]
    spill_amt = np.clip((b - g) * 1.4, 0.0, 1.0) * np.clip(alpha, 0.0, 1.0)
    out[..., 2] = np.clip(b - spill_amt * 0.85, 0.0, 1.0)
    out[..., 0] = np.clip(r - spill_amt * 0.15, 0.0, 1.0)
    out[..., 1] = np.clip(g + spill_amt * 0.08, 0.0, 1.0)

    rgba = np.dstack([np.clip(out, 0, 1), alpha])
    rgba[alpha < 0.07, :3] = 0.0
    rgba[alpha < 0.07, 3] = 0.0
    img = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
    a = np.array(img.split()[-1])
    a = np.where(a < 18, 0, a)
    img.putalpha(Image.fromarray(a))
    return img


def bbox(im: Image.Image, thresh: int = 12) -> tuple[int, int, int, int]:
    a = np.array(im.split()[-1])
    ys, xs = np.where(a > thresh)
    if len(xs) == 0:
        return (0, 0, im.width, im.height)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def square_pad(im: Image.Image, size: int = 1024) -> Image.Image:
    x0, y0, x1, y1 = bbox(im)
    crop = im.crop((x0, y0, x1, y1))
    side = max(crop.width, crop.height)
    pad = int(side * 0.12)
    canvas = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    canvas.paste(crop, ((canvas.width - crop.width) // 2, (canvas.height - crop.height) // 2), crop)
    return canvas.resize((size, size), Image.Resampling.NEAREST)


def cursor_sprite(im: Image.Image, size: int = 64) -> Image.Image:
    x0, y0, x1, y1 = bbox(im)
    crop = im.crop((x0, y0, x1, y1))
    # Hotspot at the top-left of the opaque sprite (arrow tip / fingertip).
    canvas = Image.new("RGBA", (crop.width + 6, crop.height + 6), (0, 0, 0, 0))
    canvas.paste(crop, (2, 2), crop)
    return canvas.resize((size, size), Image.Resampling.NEAREST)


def gold_fringe(im: Image.Image) -> Image.Image:
    gold = np.array([226, 177, 58], dtype=np.float32)
    a = np.array(im.convert("RGBA")).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3]
    fringe = (alpha > 8) & (alpha < 252)
    g, r, b = rgb[..., 1], rgb[..., 0], rgb[..., 2]
    pink = fringe & (b > g * 0.65) & (r > g * 0.9)
    t = np.clip((b - g) / 80.0, 0, 1)[..., None]
    rgb = np.where(pink[..., None], rgb * (1 - t) + gold * t, rgb)
    rgb[..., 2] = np.where(pink, np.minimum(rgb[..., 2], rgb[..., 1] * 0.45), rgb[..., 2])
    rgb[alpha < 12] = 0
    alpha[alpha < 12] = 0
    return Image.fromarray(np.dstack([rgb.clip(0, 255), alpha.clip(0, 255)]).astype(np.uint8))


def save_png(im: Image.Image, dest: Path) -> None:
    im.save(dest, "PNG", optimize=True)
    print(f"  {dest.name:28s} {dest.stat().st_size:8d}  {im.size} {im.mode}")


def save_jpg(im: Image.Image, dest: Path, quality: int = 86) -> None:
    rgb = im.convert("RGB")
    rgb.save(dest, "JPEG", quality=quality, optimize=True)
    print(f"  {dest.name:28s} {dest.stat().st_size:8d}  {rgb.size} {rgb.mode}")


def load(n: int) -> Image.Image:
    return Image.open(SRC / f"{n}.jpg")


def main() -> None:
    print("keying icons")
    icons = {
        "icon-play.png": 3,
        "icon-pack.png": 11,
        "icon-settings.png": 14,
        "icon-howto.png": 15,
        "icon-gold.png": 18,
        "icon-minigames.png": 19,
    }
    for name, n in icons.items():
        save_png(square_pad(key_magenta(load(n)), 256), ART / name)

    print("keying buttons")
    buttons = {
        "btn-idle.png": 10,
        "btn-pressed.png": 17,
        "btn-hover.png": 20,
        "btn-primary.png": 21,
        "btn-primary-pressed.png": 23,
        "btn-primary-hover.png": 25,
    }
    for name, n in buttons.items():
        keyed = key_magenta(load(n)).resize((704, 352), Image.Resampling.LANCZOS)
        if "hover" in name:
            keyed = gold_fringe(keyed)
        save_png(keyed, ART / name)

    print("cursors")
    save_png(cursor_sprite(key_magenta(load(8)), 64), CURS / "arrow.png")
    save_png(cursor_sprite(key_magenta(load(16)), 64), CURS / "pointer.png")

    print("plates")
    save_jpg(load(4), ART / "parchment.jpg", quality=88)
    save_jpg(load(7), ART / "runes.jpg", quality=88)
    frame = load(2).convert("RGBA")
    # Keep black center for border-image; drop the outer black margin.
    arr = np.asarray(frame.convert("RGB"))
    luma = arr.mean(axis=2)
    ys, xs = np.where(luma > 18)
    x0, y0, x1, y1 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    pad = 8
    frame = frame.crop((max(0, x0 - pad), max(0, y0 - pad), min(frame.width, x1 + pad), min(frame.height, y1 + pad)))
    frame = frame.resize((640, 640), Image.Resampling.LANCZOS)
    fa = np.array(frame.convert("RGBA"))
    m = int(min(fa.shape[0], fa.shape[1]) * 0.20)
    fa[m : fa.shape[0] - m, m : fa.shape[1] - m, :] = 0
    frame = Image.fromarray(fa)
    save_png(frame, ART / "frame.png")

    print("hero still + frames")
    save_jpg(load(6), ART / "hero-camp.jpg", quality=88)
    for i, n in enumerate((6, 24, 22, 24), start=1):
        load(n).convert("RGB").save(TMP / f"hero-{i:02d}.jpg", "JPEG", quality=90)

    print("favicon from hearth")
    ico = square_pad(key_magenta(load(3)), 64)
    save_png(ico, Path("/workspace/clan-world/main-menu-grok/public/favicon.png"))

    print("done")


if __name__ == "__main__":
    main()
