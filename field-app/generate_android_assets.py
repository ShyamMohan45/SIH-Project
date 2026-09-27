import os
from PIL import Image, ImageDraw, ImageFont

res_dir = r"C:\Users\shyam\.gemini\antigravity\scratch\n-lams-national-platform\field-app\android\app\src\main\res"

def draw_icon(size, is_round=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background
    bg_color = (11, 27, 54, 255) # Deep navy #0b1b36
    if is_round:
        draw.ellipse([(0, 0), (size, size)], fill=bg_color)
    else:
        radius = int(size * 0.22)
        draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=bg_color)

    # Cadastral Parcel Polygon in Gold / Cyan
    pad = size * 0.15
    w = size - 2 * pad
    
    # Polygon coordinates representing survey parcel
    pts = [
        (pad + w * 0.2, pad + w * 0.1),
        (pad + w * 0.85, pad + w * 0.25),
        (pad + w * 0.75, pad + w * 0.85),
        (pad + w * 0.15, pad + w * 0.75)
    ]
    draw.polygon(pts, fill=(26, 54, 93, 200), outline=(245, 158, 11, 255), width=max(2, int(size * 0.04)))

    # Grid lines inside parcel
    draw.line([pts[0], pts[2]], fill=(56, 189, 248, 140), width=max(1, int(size * 0.02)))
    draw.line([pts[3], pts[1]], fill=(56, 189, 248, 140), width=max(1, int(size * 0.02)))

    # Center Verified Pin / Shield
    cx, cy = size * 0.5, size * 0.5
    r = size * 0.18
    # Outer circle
    draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=(16, 185, 129, 255), outline=(255, 255, 255, 255), width=max(2, int(size * 0.03)))
    
    # Checkmark inside circle
    chk = [
        (cx - r * 0.45, cy - r * 0.05),
        (cx - r * 0.1, cy + r * 0.35),
        (cx + r * 0.45, cy - r * 0.35)
    ]
    draw.line(chk, fill=(255, 255, 255, 255), width=max(2, int(size * 0.06)), joint="curve")

    return img

# Generate all mipmap icons
icon_sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

for folder, s in icon_sizes.items():
    fpath = os.path.join(res_dir, folder)
    os.makedirs(fpath, exist_ok=True)
    
    square = draw_icon(s, is_round=False)
    square.save(os.path.join(fpath, "ic_launcher.png"), "PNG")
    
    round_icon = draw_icon(s, is_round=True)
    round_icon.save(os.path.join(fpath, "ic_launcher_round.png"), "PNG")

    # Foreground for adaptive
    fg = draw_icon(s, is_round=False)
    fg.save(os.path.join(fpath, "ic_launcher_foreground.png"), "PNG")

print("Generated all mipmap icons!")

def draw_splash(w, h):
    img = Image.new("RGB", (w, h), (11, 27, 54)) # Deep Navy
    draw = ImageDraw.Draw(img)

    # Subtle background geometric grid
    grid_spacing = max(30, int(w * 0.08))
    for x in range(0, w, grid_spacing):
        draw.line([(x, 0), (x, h)], fill=(18, 38, 72), width=1)
    for y in range(0, h, grid_spacing):
        draw.line([(0, y), (w, y)], fill=(18, 38, 72), width=1)

    # Tricolor top stripe
    stripe_h = max(4, int(h * 0.008))
    draw.rectangle([(0, 0), (w, stripe_h)], fill=(255, 153, 51)) # Saffron
    draw.rectangle([(0, stripe_h), (w, stripe_h * 2)], fill=(255, 255, 255)) # White
    draw.rectangle([(0, stripe_h * 2), (w, stripe_h * 3)], fill=(19, 136, 8)) # Green

    # Central emblem icon
    cx, cy = w * 0.5, h * 0.44
    icon_s = min(w * 0.35, h * 0.22, 220)
    ic = draw_icon(int(icon_s), is_round=False)
    img.paste(ic, (int(cx - icon_s * 0.5), int(cy - icon_s * 0.5)), ic)

    # Title & Subtitle
    title_y = int(cy + icon_s * 0.58)
    
    # Text fallback drawing with shapes/boxes if default font
    # Draw pill for N-LAMS
    pill_w = min(w * 0.7, 340)
    pill_h = max(38, int(h * 0.045))
    draw.rounded_rectangle(
        [(cx - pill_w * 0.5, title_y), (cx + pill_w * 0.5, title_y + pill_h)],
        radius=int(pill_h * 0.3),
        fill=(20, 48, 90),
        outline=(56, 189, 248),
        width=2
    )

    # Footer note
    footer_y = h - max(40, int(h * 0.06))
    foot_w = min(w * 0.8, 380)
    draw.rectangle(
        [(cx - foot_w * 0.5, footer_y), (cx + foot_w * 0.5, footer_y + 2)],
        fill=(30, 60, 100)
    )

    return img

splash_sizes = {
    "drawable-port-mdpi": (320, 480),
    "drawable-port-hdpi": (480, 800),
    "drawable-port-xhdpi": (720, 1280),
    "drawable-port-xxhdpi": (960, 1600),
    "drawable-port-xxxhdpi": (1280, 1920),
    "drawable-land-mdpi": (480, 320),
    "drawable-land-hdpi": (800, 480),
    "drawable-land-xhdpi": (1280, 720),
    "drawable-land-xxhdpi": (1600, 960),
    "drawable-land-xxxhdpi": (1920, 1280),
}

for folder, (w, h) in splash_sizes.items():
    fpath = os.path.join(res_dir, folder)
    os.makedirs(fpath, exist_ok=True)
    sp = draw_splash(w, h)
    sp.save(os.path.join(fpath, "splash.png"), "PNG")

# Default drawable/splash.png
default_sp = draw_splash(480, 800)
default_sp.save(os.path.join(res_dir, "drawable", "splash.png"), "PNG")

print("Generated all splash screens successfully!")
