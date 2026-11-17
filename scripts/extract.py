"""Reads src/catalog.py and pulls each glyph from @tabler/icons into src/data.json.

Run after `npm install`, then `npm run build`.
"""
import json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
sys.path.insert(0, os.path.join(ROOT, 'src'))
from catalog import CATALOG, HUES  # noqa: E402

TABLER = os.path.join(ROOT, 'node_modules', '@tabler', 'icons', 'icons')
icons, seen = [], set()
for line in CATALOG.strip().splitlines():
    name, src, category, hue, tags = line.split('|')
    kind, glyph = src.split(':')
    if name in seen:
        sys.exit(f'duplicate icon name: {name}')
    if hue not in HUES:
        sys.exit(f'unknown hue "{hue}" on {name}')
    seen.add(name)
    path = os.path.join(TABLER, 'filled' if kind == 'f' else 'outline', glyph + '.svg')
    svg = open(path).read()
    body = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1)
    body = re.sub(r'<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*/>', '', body)
    body = re.sub(r'\s+', ' ', body).strip().replace('currentColor', '#fff')
    icons.append(dict(name=name, category=category, hue=hue, tags=tags.split(),
                      style='fill' if kind == 'f' else 'stroke', source=glyph, body=body))

with open(os.path.join(ROOT, 'src', 'data.json'), 'w') as f:
    json.dump(dict(hues=HUES, icons=icons), f)
print(len(icons), 'icons written to src/data.json')
