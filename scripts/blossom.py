"""Draws the Blossom collection: layered, multi-colour flower glyphs on the 24-unit grid.

Every flower is built from a few exact primitives (rounded, pointed, teardrop and
swirl petals, scalloped discs, stars and circles). A cream outline is drawn under
the whole flower by stroking a copy of every layer, like a sticker cut-out.
Output: one SVG per flower in src/glyphs/blossom/.

Run: python3 scripts/blossom.py
"""
import math, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'src', 'glyphs', 'blossom')
C = 12.0  # centre

P = dict(
    coral='#ff6b4a', salmon='#ff9e7a', pink='#ff6f9e', blush='#ffaecb', gold='#ffc21a',
    orange='#ff8a1f', teal='#0f7d72', green='#1f9d58', mint='#7fd3a8', blue='#2c63d9',
    sky='#4aa6f2', violet='#a67cf2', purple='#6f45cf', navy='#1d2766', cream='#fff3dc',
)
OUTLINE = '#fff4de'  # same cream as the palette, its own value so it is its own slot

f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')


def tf(points, deg):
    a = math.radians(deg - 90)  # 0 deg points up
    c, s = math.cos(a), math.sin(a)
    return [(C + x * c - y * s, C + x * s + y * c) for x, y in points]


def cubic(start, segs, deg):
    pts = tf([start] + [p for seg in segs for p in seg], deg)
    out = f'M{f(pts[0][0])} {f(pts[0][1])}'
    for i in range(len(segs)):
        a, b, c = pts[1 + 3 * i: 4 + 3 * i]
        out += f'C{f(a[0])} {f(a[1])} {f(b[0])} {f(b[1])} {f(c[0])} {f(c[1])}'
    return out + 'Z'


def petal(kind, b, L, w, deg):
    if kind == 'round':
        return cubic((b, 0), [((b + L * .2, w), (b + L * 1.06, w * .95), (b + L, 0)), ((b + L * 1.06, -w * .95), (b + L * .2, -w), (b, 0))], deg)
    if kind == 'tear':  # wide, round tip
        return cubic((b, 0), [((b + L * .25, w * .35), (b + L * 1.12, w * 1.35), (b + L, 0)), ((b + L * 1.12, -w * 1.35), (b + L * .25, -w * .35), (b, 0))], deg)
    if kind == 'point':
        return cubic((b, 0), [((b + L * .3, w), (b + L * .7, w * .6), (b + L, 0)), ((b + L * .7, -w * .6), (b + L * .3, -w), (b, 0))], deg)
    if kind == 'swirl':
        return cubic((0, 0), [((L * .35, -w * 1.2), (L * 1.05, -w * .9), (L, w * .45)), ((L * .62, w * 1.05), (L * .22, w * .55), (0, 0))], deg)
    raise ValueError(kind)


def circle(x, y, r):
    return f'M{f(x - r)} {f(y)}a{f(r)} {f(r)} 0 1 0 {f(2 * r)} 0a{f(r)} {f(r)} 0 1 0 {f(-2 * r)} 0Z'


def star(n, R, r, rot=0):
    pts = []
    for i in range(2 * n):
        a = math.radians(rot - 90 + i * 180 / n)
        rr = R if i % 2 == 0 else r
        pts.append((C + rr * math.cos(a), C + rr * math.sin(a)))
    return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts) + 'Z'


# Layer builders, each returns (path, colour)
def ring(n, kind, b, L, w, col, off=0):
    return [(petal(kind, b, L, w, off + i * 360 / n), P[col]) for i in range(n)]


def two(n, kind, b, L, w, cols, off=0):
    return [(petal(kind, b, L, w, off + i * 360 / n), P[cols[i % 2]]) for i in range(n)]


def scallop(n, d, r, col, off=0):
    out = [(circle(C, C, d), P[col])]
    for i in range(n):
        a = math.radians(off - 90 + i * 360 / n)
        out.append((circle(C + d * math.cos(a), C + d * math.sin(a), r), P[col]))
    return out


def dot(r, col):
    return [(circle(C, C, r), P[col])]


def starl(n, R, r, col, rot=0):
    return [(star(n, R, r, rot), P[col])]


def lotus(side, mid, centre, base='green', leaves=False):
    """Upright lotus: pointed petals fanning from a base point."""
    out = []
    def up(cx, cy, L, w, deg, col):
        a = math.radians(deg - 90); c, s = math.cos(a), math.sin(a)
        loc = [(0, 0), (L * .3, w), (L * .7, w * .6), (L, 0), (L * .7, -w * .6), (L * .3, -w), (0, 0)]
        pts = [(cx + x * c - y * s, cy + x * s + y * c) for x, y in loc]
        return (f'M{f(pts[0][0])} {f(pts[0][1])}C{f(pts[1][0])} {f(pts[1][1])} {f(pts[2][0])} {f(pts[2][1])} {f(pts[3][0])} {f(pts[3][1])}'
                f'C{f(pts[4][0])} {f(pts[4][1])} {f(pts[5][0])} {f(pts[5][1])} {f(pts[6][0])} {f(pts[6][1])}Z', P[col])
    if leaves:
        out += [up(12, 19.6, 9, 3.2, -78, base), up(12, 19.6, 9, 3.2, 78, base)]
    out += [up(12, 19, 10, 3.6, -55, side), up(12, 19, 10, 3.6, 55, side)]
    out += [up(12, 19, 12, 4, -26, mid), up(12, 19, 12, 4, 26, mid)]
    out += [up(12, 19.2, 14, 4.4, 0, centre)]
    return out


F = {}
def add(name, *layers):
    F[name] = [l for layer in layers for l in layer]

# Row one
add('aster', two(4, 'tear', 1, 9, 3.6, ['salmon', 'orange'], 45), ring(4, 'point', 2, 6, 1.2, 'gold', 45), dot(1.4, 'coral'))
add('waterlily', lotus('violet', 'purple', 'gold'))
add('camellia', scallop(8, 6.4, 3.6, 'coral'), ring(4, 'tear', 1, 5, 2, 'teal', 45), dot(1.8, 'gold'))
add('periwinkle', ring(8, 'point', 1.2, 10, 2, 'cream'), ring(8, 'point', 1.2, 7.2, 1.3, 'blue', 22.5), dot(2.4, 'gold'))
add('mallow', two(4, 'tear', 1, 9.4, 3.8, ['pink', 'blush'], 45), ring(4, 'point', 2.4, 5.6, 1.1, 'gold', 45))
add('marigold', scallop(8, 6.2, 3.6, 'gold'), starl(8, 6.6, 3, 'blue'), starl(8, 3.6, 1.6, 'cream'))
add('plumeria', [(petal('swirl', 0, 10.4, 2.6, i * 36), P['salmon' if i % 2 else 'blush']) for i in range(10)], dot(1.2, 'gold'))
add('shamrock', ring(4, 'round', 0.6, 9, 4.2, 'green'), dot(1.8, 'gold'))
# Row two
add('cornflower', ring(12, 'round', 1.4, 9.4, 1.9, 'blue'), ring(12, 'point', 1.4, 6.4, 1, 'sky', 15), dot(2.2, 'gold'))
add('jasmine', ring(4, 'point', 1, 10.4, 3.8, 'cream'), ring(4, 'point', 1.6, 6, 1.6, 'green'), dot(1.4, 'orange'))
add('zinnia', ring(8, 'point', 1, 10, 2.8, 'coral'), ring(8, 'point', 1, 6.6, 1.4, 'salmon'), dot(1.4, 'gold'))
add('pinwheel-bloom', [(petal('swirl', 0, 10.4, 3.4, i * 72), P[['gold', 'violet', 'pink', 'gold', 'purple'][i]]) for i in range(5)], dot(1.3, 'cream'))
add('rangoli', starl(4, 10.6, 6.2, 'teal', 45), ring(4, 'point', 1.4, 7.2, 2.6, 'cream'), ring(4, 'point', 1.6, 5.4, 1.4, 'gold'), dot(1.4, 'teal'))
add('peony', lotus('pink', 'blush', 'pink', 'green', leaves=True))
add('bluebell', ring(4, 'point', 0.8, 10.4, 3.2, 'blue'), dot(1.2, 'gold'))
add('dahlia', scallop(8, 6.6, 3.6, 'gold'), ring(8, 'round', 1, 6.4, 2.2, 'pink', 22.5), dot(2.6, 'blush'))
# Row three
add('primrose', ring(4, 'round', 0.6, 9.6, 4.4, 'blush'), ring(4, 'tear', 1, 6, 2.2, 'green'), dot(1.6, 'cream'))
add('kamal', lotus('violet', 'purple', 'gold', 'gold', leaves=True))
add('hibiscus', ring(6, 'point', 0.8, 10.6, 3.2, 'coral'), ring(6, 'point', 1, 5, 1, 'gold'), dot(1.4, 'green'))
add('champa', ring(4, 'tear', 1, 8.4, 3.2, 'cream'), ring(4, 'tear', 1.2, 6.4, 2.4, 'green'), dot(1.6, 'pink'))
add('cosmos', ring(8, 'round', 1.2, 9.4, 2.6, 'pink'), dot(2.4, 'orange'))
add('lantana', scallop(4, 5.8, 4.6, 'green', 45), ring(4, 'tear', 1, 7.4, 3, 'gold', 45), ring(4, 'point', 1.2, 5, 1.4, 'mint'), dot(1.8, 'gold'))
add('magnolia', lotus('teal', 'pink', 'blush', 'teal', leaves=True))
add('iris', ring(4, 'point', 0.8, 10.4, 3.6, 'sky'), ring(4, 'point', 1.2, 6, 1.4, 'blue'), dot(1.5, 'orange'))
# Row four
add('frangipani', [(petal('swirl', 0, 10.4, 3.4, i * 60), P[['gold', 'violet', 'gold', 'purple', 'gold', 'violet'][i]]) for i in range(6)], dot(1.3, 'cream'))
add('kolam', scallop(4, 5.6, 4.8, 'teal', 45), starl(4, 6.2, 2.4, 'pink', 45), dot(1.2, 'gold'))
add('begonia', two(4, 'tear', 1, 9.4, 3.8, ['pink', 'blush'], 45), ring(4, 'point', 2, 6, 1.1, 'coral', 45))
add('gerbera', ring(16, 'point', 1.6, 10, 1.4, 'sky'), ring(16, 'point', 1.6, 6.6, 1, 'teal', 11.25), dot(2.2, 'gold'))
add('marsh-marigold', ring(4, 'tear', 0.8, 9.4, 3, 'orange'), dot(1.4, 'pink'))
add('pansy', ring(4, 'round', 0.6, 9, 3.8, 'violet'), ring(1, 'point', 1, 7, 1.6, 'pink', 180), dot(1.6, 'gold'))
add('lily', ring(8, 'point', 1, 10.6, 2.6, 'coral'), ring(8, 'point', 1, 6.2, 1.4, 'salmon', 22.5), dot(1.6, 'gold'))
add('sakura', ring(4, 'tear', 0.6, 9.8, 4, 'pink', 45), ring(4, 'point', 2, 5, 0.9, 'green', 45))
# Row five
add('mogra', starl(4, 10.8, 4.4, 'gold', 45), ring(4, 'point', 1.4, 7, 2, 'green', 45), dot(1.6, 'gold'))
add('ranunculus', scallop(8, 6.4, 3.6, 'pink'), starl(8, 6, 2.8, 'navy'), starl(8, 3.6, 1.6, 'cream'))
add('forget-me-not', ring(4, 'round', 0.6, 9.4, 4, 'sky'), dot(2, 'orange'))
add('star-jasmine', ring(6, 'point', 0.8, 10.6, 3.2, 'gold'), ring(6, 'point', 1, 6, 1.6, 'green'), dot(1.6, 'mint'))
add('gulmohar', scallop(8, 6.6, 3.6, 'salmon'), scallop(4, 3, 2.6, 'cream', 45), starl(4, 4.6, 1.6, 'teal'), dot(1.2, 'teal'))
add('butterfly-pea', ring(4, 'point', 0.6, 10.8, 4.2, 'teal', 45), ring(4, 'point', 1.2, 6.4, 1.6, 'cream', 45))
add('sunflower', dot(10.4, 'cream'), [(f'M{f(C)} {f(C)}L' + 'L'.join(f'{f(C + 10 * math.cos(math.radians(a)))} {f(C + 10 * math.sin(math.radians(a)))}' for a in (i * 22.5 - 5, i * 22.5 + 5)) + 'Z', P['gold' if i % 2 else 'navy']) for i in range(16)], dot(3, 'navy'))
add('phlox', ring(4, 'round', 1, 9.4, 3.8, 'pink'), ring(4, 'round', 2, 6.2, 2.2, 'cream'), dot(1.8, 'pink'))
# Row six
add('carnation', ring(4, 'tear', 0.6, 9.8, 4, 'blush', 45), ring(4, 'tear', 1.4, 6.2, 2.2, 'pink', 45), dot(1.4, 'cream'))
add('oxalis', ring(4, 'round', 0.6, 9.6, 4.6, 'green'), ring(4, 'point', 1.2, 6, 1.6, 'gold', 45), dot(2, 'orange'))
add('chrysanthemum', ring(16, 'point', 1.4, 10, 1.5, 'orange'), ring(16, 'point', 1.4, 6.6, 1, 'salmon', 11.25), dot(2.2, 'gold'))
add('poppy', ring(4, 'round', 0.6, 9.4, 4.4, 'pink', 45), dot(1.8, 'gold'))
add('crocus', lotus('orange', 'blue', 'gold', 'sky', leaves=True))
add('orchid', ring(4, 'tear', 0.6, 10, 3.4, 'violet', 45), ring(4, 'point', 2.4, 4.6, 0.8, 'cream', 45))
add('mandala', scallop(8, 6.4, 3.6, 'mint'), starl(8, 7, 3.2, 'teal'), starl(8, 4.2, 2, 'cream'), dot(1.2, 'gold'))
add('geranium', ring(5, 'round', 0.6, 9.8, 4.6, 'coral'), dot(2, 'gold'))

assert len(F) == 48, len(F)


def write():
    os.makedirs(OUT, exist_ok=True)
    for name, layers in F.items():
        outline = ''.join(f'<path d="{d}" fill="{OUTLINE}" stroke="{OUTLINE}" stroke-width="1.7" stroke-linejoin="round"/>' for d, _ in layers)
        colour = ''.join(f'<path d="{d}" fill="{c}"/>' for d, c in layers)
        with open(os.path.join(OUT, f'{name}.svg'), 'w') as fh:
            fh.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">{outline}{colour}</svg>\n')
    print(len(F), 'blossom glyphs written to src/glyphs/blossom')


if __name__ == '__main__':
    write()
