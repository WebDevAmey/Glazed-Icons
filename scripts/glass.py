"""Separates the "Digital Objects — Glass & Resin" sheet into 40 individual illustrations.

The supplied sheet sits on a flat gutter colour. Each asset is cut at its own edge,
found where the gutter colour stops, so nothing inside an illustration is trimmed,
resized, redrawn or recoloured. Files are written losslessly as PNG at their native
size, with a WebP copy for the web, and described in illustrations.json.

Run: python3 scripts/glass.py   (needs Pillow and NumPy)
"""
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SHEET = os.path.join(ROOT, 'src', 'sources', 'glass-resin-sheet.jpg')
OUT = os.path.join(ROOT, 'illustrations', 'glass-resin')
GUTTER = (238, 239, 244)
COLLECTION = {
    'id': 'glass-resin',
    'title': 'Digital Objects — Glass & Resin',
    'description': 'Forty translucent 3D objects in glass and resin: prisms, orbits, crystals, portals and more, with soft refraction and pastel light.',
}

# In sheet order, left to right, top to bottom: name, title, tags
ASSETS = [
    ('glass-prism', 'Prism', 'triangle pyramid refraction light shape'),
    ('glass-cube', 'Cube', 'box square nested frame shape'),
    ('glass-layers', 'Layers', 'stack sheets levels planes'),
    ('glass-torus', 'Torus', 'ring orbit donut sphere'),
    ('glass-mobius', 'Möbius loop', 'infinity loop ribbon twist'),
    ('glass-molecule', 'Molecule', 'atoms bond chemistry science bubbles'),
    ('glass-dodecahedron', 'Dodecahedron', 'polyhedron gem geometry glow'),
    ('glass-sand-timer', 'Sand timer', 'hourglass time wait sand'),
    ('glass-arch', 'Arch', 'portal gate doorway neon'),
    ('glass-orbital', 'Orbital', 'atom orbit planet science'),
    ('glass-terrarium', 'Terrarium', 'tree nature plant box eco'),
    ('glass-wifi', 'Wi-Fi block', 'wifi signal wireless network cube'),
    ('glass-idea', 'Idea bulb', 'lightbulb idea mountain creative'),
    ('glass-key', 'Key', 'key lock access security unlock'),
    ('glass-mail', 'Mail block', 'envelope email message cube'),
    ('glass-brain', 'Brain', 'mind ai think intelligence cube'),
    ('glass-telephone', 'Telephone', 'phone call rotary retro'),
    ('glass-globe', 'Globe', 'earth world planet water'),
    ('glass-crystals', 'Crystals', 'crystal gem quartz cluster'),
    ('glass-blocks', 'Blocks', 'cubes stack build boxes'),
    ('glass-planet', 'Planet', 'saturn ring space sphere'),
    ('glass-gem', 'Gem', 'jewel faceted diamond polyhedron'),
    ('glass-chart', 'Bar chart', 'chart growth analytics bars stats'),
    ('glass-hourglass', 'Hourglass', 'time timer wait sand violet'),
    ('glass-lotus', 'Lotus', 'flower calm bloom petals'),
    ('glass-waves', 'Waves', 'water flow wave sea'),
    ('glass-vortex', 'Vortex', 'swirl spiral sphere motion'),
    ('glass-core', 'Core cube', 'cube glow core energy nested'),
    ('glass-bubbles', 'Bubbles', 'spheres orbs drops balls'),
    ('glass-rings', 'Rings', 'stack rings loops coils'),
    ('glass-portal', 'Portal', 'ring gate mirror stage'),
    ('glass-stairs', 'Stairs', 'steps progress climb growth'),
    ('glass-infinity', 'Infinity', 'loop endless forever ribbon'),
    ('glass-blob', 'Blob', 'jelly organic shape soft'),
    ('glass-coil', 'Coil', 'spring rings stack gold'),
    ('glass-network', 'Network sphere', 'globe mesh nodes connection web'),
    ('glass-pearl', 'Pearl', 'shell clam ocean treasure'),
    ('glass-cross', 'Cross', 'plus cubes add health blocks'),
    ('glass-atom', 'Atom', 'science orbit nucleus energy'),
    ('glass-ring-chart', 'Ring chart', 'donut chart pie progress segments'),
]


def runs(mask, minlen=60):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        if not v and start is not None:
            if i - start >= minlen:
                out.append((start, i))
            start = None
    if start is not None and len(mask) - start >= minlen:
        out.append((start, len(mask)))
    return out


def boxes(img):
    a = np.asarray(img).astype(int)
    art = np.abs(a - np.array(GUTTER)).sum(axis=2) > 9
    found = []
    for y0, y1 in runs(art.mean(axis=1) > 0.05):
        for x0, x1 in runs(art[y0:y1].mean(axis=0) > 0.3):
            cell = art[y0:y1, x0:x1]
            ys, xs = np.where(cell)
            # the asset's own edge inside its cell: where the gutter colour stops
            found.append((x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1))
    return found


def main():
    img = Image.open(SHEET).convert('RGB')
    found = boxes(img)
    assert len(found) == len(ASSETS), f'found {len(found)} assets, expected {len(ASSETS)}'
    os.makedirs(OUT, exist_ok=True)
    items = []
    for (name, title, tags), box in zip(ASSETS, found):
        piece = img.crop(box)
        piece.save(os.path.join(OUT, f'{name}.png'), optimize=True)
        piece.save(os.path.join(OUT, f'{name}.webp'), lossless=True, method=6)
        items.append({'name': name, 'title': title, 'tags': tags.split(), 'width': piece.width, 'height': piece.height,
                      'png': f'illustrations/glass-resin/{name}.png', 'webp': f'illustrations/glass-resin/{name}.webp'})
    with open(os.path.join(ROOT, 'illustrations.json'), 'w') as fh:
        json.dump({'collections': [{**COLLECTION, 'count': len(items), 'items': items}]}, fh, indent=2, ensure_ascii=False)
    print(len(items), 'illustrations written to illustrations/glass-resin')


if __name__ == '__main__':
    main()
