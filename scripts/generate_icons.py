"""Generates Lunara's original app icons (crescent moon over a palm arc).

Run from the repo root: python3 scripts/generate_icons.py   (needs Pillow)
"""
import math
from PIL import Image, ImageDraw, ImageFilter

S = 4  # supersampling factor
GOLD = (240, 210, 140, 255)
LAV = (201, 168, 255, 255)


def gradient(size):
    img = Image.new("RGBA", (size, size))
    px = img.load()
    cx, cy = size * 0.5, size * 0.38
    top, bottom = (74, 42, 147), (11, 8, 32)
    for y in range(size):
        for x in range(size):
            d = min(1.0, math.hypot(x - cx, y - cy) / (size * 0.75))
            px[x, y] = tuple(int(top[i] * (1 - d) + bottom[i] * d) for i in range(3)) + (255,)
    return img


def mark(size, color=GOLD, line=LAV, scale=1.0):
    """Crescent moon with a palm 'life line' arc and two stars, on transparency."""
    big = size * S
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c = big / 2
    r = big * 0.27 * scale
    # Crescent: full disc minus offset disc.
    moon = Image.new("L", (big, big), 0)
    md = ImageDraw.Draw(moon)
    md.ellipse([c - r, c - r * 1.05, c + r, c + r * 0.95], fill=255)
    off = r * 0.42
    md.ellipse([c - r + off, c - r * 1.2, c + r + off, c + r * 0.8], fill=0)
    img.paste(Image.new("RGBA", (big, big), color), (0, 0), moon)
    # Palm arc: a cupped curve cradling the moon from below.
    w = int(big * 0.024 * scale)
    box = [c - r * 1.4, c - r * 0.95, c + r * 1.4, c + r * 1.35]
    d.arc(box, start=22, end=158, fill=line, width=w)
    # Stars.
    for sx, sy, sr in [(c + r * 0.95, c - r * 0.75, r * 0.13), (c + r * 1.35, c - r * 0.15, r * 0.08)]:
        pts = []
        for k in range(8):
            ang = math.pi / 4 * k - math.pi / 2
            rr = sr if k % 2 == 0 else sr * 0.35
            pts.append((sx + rr * math.cos(ang), sy + rr * math.sin(ang)))
        d.polygon(pts, fill=color)
    return img.resize((size, size), Image.LANCZOS)


def main():
    bg = gradient(1024)
    icon = bg.copy()
    glow = mark(1024, (255, 230, 170, 120)).filter(ImageFilter.GaussianBlur(18))
    icon.alpha_composite(glow)
    icon.alpha_composite(mark(1024))
    icon.convert("RGB").save("assets/icon.png")  # iOS: no transparency

    bg.convert("RGB").save("assets/android-icon-background.png")
    mark(1024, scale=0.72).save("assets/android-icon-foreground.png")
    white = (255, 255, 255, 255)
    mark(1024, white, white, scale=0.72).save("assets/android-icon-monochrome.png")
    mark(1024, scale=1.1).save("assets/splash-icon.png")
    fav = icon.resize((48, 48), Image.LANCZOS)
    fav.convert("RGB").save("assets/favicon.png")


if __name__ == "__main__":
    main()
