from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_BRAND_DIR = ROOT / "public" / "brand"
BUILD_DIR = ROOT / "build"
SVG_PATH = PUBLIC_BRAND_DIR / "cipher-mark.svg"


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def color_lerp(start: tuple[int, int, int], end: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(int(start[i] + (end[i] - start[i]) * t) for i in range(3))


def make_base_canvas(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pixels = image.load()
    top = (5, 16, 25)
    bottom = (11, 33, 47)
    center = size / 2
    max_distance = (2 * (center ** 2)) ** 0.5

    for y in range(size):
        vertical_mix = y / max(1, size - 1)
        row_color = color_lerp(top, bottom, vertical_mix)
        for x in range(size):
            distance = ((x - center) ** 2 + (y - center) ** 2) ** 0.5 / max_distance
            glow = max(0.0, 1.0 - distance * 1.6)
            r = min(255, int(row_color[0] + glow * 10))
            g = min(255, int(row_color[1] + glow * 34))
            b = min(255, int(row_color[2] + glow * 34))
            pixels[x, y] = (r, g, b, 255)

    return image


def draw_icon(size: int) -> Image.Image:
    image = make_base_canvas(size)
    radius = round(size * 0.23)
    mask = rounded_mask(size, radius)
    image.putalpha(mask)

    glow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    glow_draw.rounded_rectangle(
        (round(size * 0.05), round(size * 0.05), round(size * 0.95), round(size * 0.95)),
        radius=round(size * 0.2),
        outline=(0, 245, 196, 180),
        width=max(4, round(size * 0.02)),
    )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=max(4, round(size * 0.03))))
    image = Image.alpha_composite(image, glow_layer)

    draw = ImageDraw.Draw(image)

    inner_margin = round(size * 0.08)
    draw.rounded_rectangle(
        (inner_margin, inner_margin, size - inner_margin, size - inner_margin),
        radius=round(size * 0.18),
        outline=(92, 255, 222, 165),
        width=max(3, round(size * 0.012)),
    )

    ring_center = size / 2
    outer_box = (
        round(size * 0.19),
        round(size * 0.19),
        round(size * 0.81),
        round(size * 0.81),
    )
    middle_box = (
        round(size * 0.27),
        round(size * 0.27),
        round(size * 0.73),
        round(size * 0.73),
    )

    draw.ellipse(outer_box, outline=(0, 245, 196, 115), width=max(4, round(size * 0.018)))
    draw.arc(
        middle_box,
        start=28,
        end=332,
        fill=(113, 255, 231, 160),
        width=max(3, round(size * 0.014)),
    )

    c_box = (
        round(size * 0.24),
        round(size * 0.24),
        round(size * 0.76),
        round(size * 0.76),
    )

    c_glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    c_glow_draw = ImageDraw.Draw(c_glow)
    c_glow_draw.arc(
        c_box,
        start=42,
        end=318,
        fill=(0, 245, 196, 190),
        width=max(10, round(size * 0.09)),
    )
    c_glow = c_glow.filter(ImageFilter.GaussianBlur(radius=max(4, round(size * 0.025))))
    image = Image.alpha_composite(image, c_glow)
    draw = ImageDraw.Draw(image)
    draw.arc(
        c_box,
        start=42,
        end=318,
        fill=(126, 255, 232, 255),
        width=max(10, round(size * 0.078)),
    )

    dot_radius = round(size * 0.05)
    dot_x = round(ring_center + size * 0.2)
    dot_y = round(ring_center - size * 0.065)
    draw.ellipse(
        (dot_x - dot_radius, dot_y - dot_radius, dot_x + dot_radius, dot_y + dot_radius),
        fill=(245, 255, 252, 255),
    )
    dot_glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dot_glow_draw = ImageDraw.Draw(dot_glow)
    dot_glow_draw.ellipse(
        (
            dot_x - dot_radius * 2,
            dot_y - dot_radius * 2,
            dot_x + dot_radius * 2,
            dot_y + dot_radius * 2,
        ),
        fill=(128, 255, 228, 100),
    )
    dot_glow = dot_glow.filter(ImageFilter.GaussianBlur(radius=max(4, round(size * 0.03))))
    image = Image.alpha_composite(image, dot_glow)

    slash = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    slash_draw = ImageDraw.Draw(slash)
    slash_draw.rounded_rectangle(
        (
            round(size * 0.53),
            round(size * 0.58),
            round(size * 0.74),
            round(size * 0.615),
        ),
        radius=round(size * 0.02),
        fill=(195, 255, 243, 120),
    )
    slash = slash.rotate(-27, center=(round(size * 0.635), round(size * 0.598)), resample=Image.Resampling.BICUBIC)
    image = Image.alpha_composite(image, slash)

    vignette = Image.new("L", (size, size), 0)
    vignette_draw = ImageDraw.Draw(vignette)
    vignette_draw.ellipse(
        (round(size * 0.08), round(size * 0.08), round(size * 0.92), round(size * 0.92)),
        fill=220,
    )
    vignette = ImageChops.invert(vignette).filter(ImageFilter.GaussianBlur(radius=max(6, round(size * 0.07))))
    image.putalpha(ImageChops.multiply(image.getchannel("A"), ImageChops.invert(vignette)))
    image.putalpha(mask)

    return image


def write_svg(path: Path) -> None:
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bg" x1="92" y1="72" x2="420" y2="448" gradientUnits="userSpaceOnUse">
      <stop stop-color="#07131C"/>
      <stop offset="1" stop-color="#102A38"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(256 256) rotate(90) scale(240)">
      <stop stop-color="#0F3F44" stop-opacity=".7"/>
      <stop offset="1" stop-color="#0F3F44" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stroke" x1="112" y1="128" x2="408" y2="384" gradientUnits="userSpaceOnUse">
      <stop stop-color="#78FFE6"/>
      <stop offset="1" stop-color="#00D8B0"/>
    </linearGradient>
  </defs>
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#bg)"/>
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#glow)"/>
  <rect x="42" y="42" width="428" height="428" rx="96" stroke="#5CFFE0" stroke-opacity=".45" stroke-width="8"/>
  <circle cx="256" cy="256" r="158" stroke="#00F5C4" stroke-opacity=".35" stroke-width="10"/>
  <path d="M337 167A128 128 0 1 0 337 345" stroke="url(#stroke)" stroke-width="42" stroke-linecap="round"/>
  <circle cx="358" cy="223" r="24" fill="#F4FFFC"/>
  <path d="M286 336L343 309" stroke="#C3FFF3" stroke-opacity=".55" stroke-width="14" stroke-linecap="round"/>
</svg>
"""
    path.write_text(svg, encoding="utf-8")


def main() -> None:
    PUBLIC_BRAND_DIR.mkdir(parents=True, exist_ok=True)
    BUILD_DIR.mkdir(parents=True, exist_ok=True)

    write_svg(SVG_PATH)

    master = draw_icon(512)
    master.save(PUBLIC_BRAND_DIR / "icon-512.png")

    for size in (256, 128, 64, 48, 32, 16):
        resized = master.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(PUBLIC_BRAND_DIR / f"icon-{size}.png")

    master.save(BUILD_DIR / "icon.ico", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])


if __name__ == "__main__":
    main()
