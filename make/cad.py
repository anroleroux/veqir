"""Pull a CAD-tool assembly or part into the shop: its still image and its meshes.

    python make/cad.py <cad build dir> <product slug> <layer>=<#colour> ...

The build dir is an assembled model's `cad/` folder, as `cad build
library/<category>/<item>` leaves it in a vequir catalogue repository
(../vequir-power/results/library/.../_assembly/cad).
Its component STLs are merged into one binary STL per layer, a layer being
every mesh drawn in that colour, and written to ui/models/<slug>/<layer>.stl;
its part.png has its axis triad blanked and is cropped, scaled and written to ui/img/products/<slug>.webp.
A single part's build dir (`results/library/<category>/<part>/cad`) takes
one layer: its part.stl becomes that layer, and the still is drawn again in
the layer's colour (the CAD tool draws a lone part in its default blue).
Needs Pillow and the CAD tool (`cad`, from vequir-standard/tools/cad; Pillow comes with it). The rows that point at
these files (products.image, meshes) live in ui/demo.js.
"""
import json
import struct
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGE_SIZE = 800  # longest side, px
TRIAD = (200, 220)  # the axis triad the CAD tool draws in the bottom-left corner, px


def triangles(stl: Path) -> bytes:
    """The 50-byte triangle records of a binary STL."""
    data = stl.read_bytes()
    (count,) = struct.unpack_from("<I", data, 80)
    if 84 + 50 * count != len(data):
        raise SystemExit(f"{stl}: not a binary STL")
    return data[84:]


def part_still(cad: Path, colour: str) -> Image.Image:
    """A lone part's still, drawn again in its layer's colour."""
    import tempfile

    import numpy as np
    # this script is make/cad.py: keep its folder from shadowing the package
    here = str(Path(__file__).resolve().parent)
    sys.path[:] = [d for d in sys.path if str(Path(d or ".").resolve()) != here]
    from cad import cadview
    from cad.cadview import _hex_rgb, render_triangles, stl_triangles

    # no axis triad: it is drawn beside the model, not in a fixed corner
    cadview._axis_triad = lambda *args: None
    points, tris = stl_triangles(cad / "part.stl")
    with tempfile.TemporaryDirectory() as tmp:
        png = render_triangles(points, tris, Path(tmp) / "part.png",
                               colors=np.tile(_hex_rgb(colour), (len(tris), 1)))
        return Image.open(png).convert("RGBA").copy()


def main(cad: Path, slug: str, layers: list[str]) -> None:
    summary = json.loads((cad / "summary.json").read_text())
    by_colour = {colour.lower(): name for name, colour in (l.split("=") for l in layers)}
    merged: dict[str, list[bytes]] = {name: [] for name in by_colour.values()}
    image = None
    if "components" not in summary:  # a single part: one layer, the whole part
        if len(by_colour) != 1:
            raise SystemExit(f"{cad}: a single part takes exactly one layer")
        (colour, name), = by_colour.items()
        merged[name].append(triangles(cad / "part.stl"))
        image = part_still(cad, colour)
    for component in summary.get("components", []):
        for mesh in component["meshes"]:
            name = by_colour.get(mesh["color"].lower())
            if name is None:
                raise SystemExit(f"{component['name']}: no layer for colour {mesh['color']}")
            merged[name].append(triangles(cad / mesh["stl"]))

    out = ROOT / "ui" / "models" / slug
    out.mkdir(parents=True, exist_ok=True)
    for name, parts in merged.items():
        body = b"".join(parts)
        header = f"VequIR {slug} {name}".encode().ljust(80, b" ")
        (out / f"{name}.stl").write_bytes(header + struct.pack("<I", len(body) // 50) + body)
        print(f"{out / name}.stl  {len(body) // 50} triangles")

    if image is None:
        image = Image.open(cad / "part.png").convert("RGBA")
        image.paste((0, 0, 0, 0), (0, image.height - TRIAD[1], TRIAD[0], image.height))
    image = image.crop(image.getbbox())
    image.thumbnail((IMAGE_SIZE, IMAGE_SIZE), Image.LANCZOS)
    still = ROOT / "ui" / "img" / "products" / f"{slug}.webp"
    still.parent.mkdir(parents=True, exist_ok=True)
    image.save(still, quality=86, method=6)
    print(f"{still}  {image.size[0]}×{image.size[1]}")


if __name__ == "__main__":
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    main(Path(sys.argv[1]), sys.argv[2], sys.argv[3:])
