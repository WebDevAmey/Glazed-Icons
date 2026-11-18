"""Draws the Abstract collection: solid geometric glyphs on the 24-unit grid.

Each glyph is built from exact primitives (circles, rings, sectors, lenses,
four-point stars), so curves stay true at any size. Output: one SVG per glyph
in src/glyphs/abstract/, read by scripts/extract.py like any other source.

Run: python3 scripts/abstract.py
"""
import math, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'src', 'glyphs', 'abstract')

f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')


def pt(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def circle(cx, cy, r):
    return f'M{f(cx - r)} {f(cy)}a{f(r)} {f(r)} 0 1 0 {f(2 * r)} 0a{f(r)} {f(r)} 0 1 0 {f(-2 * r)} 0Z'


def ellipse(cx, cy, rx, ry):
    return f'M{f(cx - rx)} {f(cy)}a{f(rx)} {f(ry)} 0 1 0 {f(2 * rx)} 0a{f(rx)} {f(ry)} 0 1 0 {f(-2 * rx)} 0Z'


def sector(cx, cy, r, a0, a1):
    x0, y0 = pt(cx, cy, r, a0); x1, y1 = pt(cx, cy, r, a1)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return f'M{f(cx)} {f(cy)}L{f(x0)} {f(y0)}A{f(r)} {f(r)} 0 {large} 1 {f(x1)} {f(y1)}Z'


def ring(cx, cy, r1, r2, a0, a1):
    """Band between radii r1 < r2, from angle a0 to a1 (clockwise, degrees, 0 = east)."""
    o0, o1 = pt(cx, cy, r2, a0), pt(cx, cy, r2, a1)
    i0, i1 = pt(cx, cy, r1, a1), pt(cx, cy, r1, a0)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    return (f'M{f(o0[0])} {f(o0[1])}A{f(r2)} {f(r2)} 0 {large} 1 {f(o1[0])} {f(o1[1])}'
            f'L{f(i0[0])} {f(i0[1])}A{f(r1)} {f(r1)} 0 {large} 0 {f(i1[0])} {f(i1[1])}Z')


def poly(*pts):
    return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts) + 'Z'


def rot(points, cx, cy, deg):
    a = math.radians(deg); c, s = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in points]


def star4(cx, cy, R, pinch=0.0):
    """Concave four-point star (a sparkle). pinch pulls the curves toward the centre."""
    k = pinch
    q = lambda x, y: f'{f(cx + (x - cx) * k)} {f(cy + (y - cy) * k)}'
    return (f'M{f(cx)} {f(cy - R)}Q{q(cx + R * .5, cy - R * .5)} {f(cx + R)} {f(cy)}'
            f'Q{q(cx + R * .5, cy + R * .5)} {f(cx)} {f(cy + R)}'
            f'Q{q(cx - R * .5, cy + R * .5)} {f(cx - R)} {f(cy)}'
            f'Q{q(cx - R * .5, cy - R * .5)} {f(cx)} {f(cy - R)}Z')


def petal(cx, cy, length, width, deg, base=0.0):
    """A lens-shaped petal pointing out from (cx, cy) at angle deg."""
    x0, y0 = pt(cx, cy, base, deg); x1, y1 = pt(cx, cy, base + length, deg)
    mx, my = pt(cx, cy, base + length / 2, deg)
    nx, ny = math.cos(math.radians(deg + 90)), math.sin(math.radians(deg + 90))
    w = width
    return (f'M{f(x0)} {f(y0)}Q{f(mx + nx * w)} {f(my + ny * w)} {f(x1)} {f(y1)}'
            f'Q{f(mx - nx * w)} {f(my - ny * w)} {f(x0)} {f(y0)}Z')


def rrect(x, y, w, h, r):
    return (f'M{f(x + r)} {f(y)}H{f(x + w - r)}A{f(r)} {f(r)} 0 0 1 {f(x + w)} {f(y + r)}V{f(y + h - r)}'
            f'A{f(r)} {f(r)} 0 0 1 {f(x + w - r)} {f(y + h)}H{f(x + r)}A{f(r)} {f(r)} 0 0 1 {f(x)} {f(y + h - r)}'
            f'V{f(y + r)}A{f(r)} {f(r)} 0 0 1 {f(x + r)} {f(y)}Z')


G = {}

# 1 fan: three quarter bands spreading from the bottom-left corner
G['fan'] = [ring(3, 21, 15.6, 18, 270, 360), ring(3, 21, 10.4, 12.8, 270, 360), ring(3, 21, 5.2, 7.6, 270, 360)]
# 2 stack: three discs seen edge-on, a sparkle above
G['strata'] = [star4(12, 4.4, 2.4), ellipse(12, 10.6, 8.2, 2.2), ellipse(12, 15.2, 8.2, 2.2), ellipse(12, 19.8, 8.2, 2.2)]
# 3 hourglass: a square pinched by two curves
G['pinch'] = ['M4 3H20Q11.5 12 20 21H4Q12.5 12 4 3Z']
# 4 pinwheel: four blades turning around the centre
G['pinwheel'] = [poly(*rot([(12, 12), (12, 2.6), (19.4, 9.2)], 12, 12, k * 90)) for k in range(4)]
# 5 halves: two half discs facing each other, a ball between
G['halves'] = ['M3 3.5V20.5A8.5 8.5 0 0 0 3 3.5Z', 'M21 3.5V20.5A8.5 8.5 0 0 1 21 3.5Z', circle(12, 12, 2.6)]
# 6 arches: two nested arches standing on the baseline
G['arches'] = ['M3 21V12A9 9 0 0 1 21 12V21H18.2V12A6.2 6.2 0 0 0 5.8 12V21Z', 'M8 21V14.4A4 4 0 0 1 16 14.4V21H13.4V14.4A1.4 1.4 0 0 0 10.6 14.4V21Z']
# 7 sparkle: a single four-point star
G['sparkle'] = [star4(12, 12, 9.5, 0.05)]
# 8 bowl: a ball resting over an open bowl
G['bowl'] = [circle(12, 5, 2.6), 'M3 10.5H21A9 9 0 0 1 3 10.5Z']
# 9 open-book: two curved pages with a sparkle above
G['open-book'] = [star4(12, 4.6, 2.6), 'M3 9Q7.5 9 11 12.5V21Q7.5 17.5 3 17.5Z', 'M21 9Q16.5 9 13 12.5V21Q16.5 17.5 21 17.5Z']
# 10 ripple: three waves stacked
def wave(y, h=2.2):
    return (f'M3 {f(y)}Q6 {f(y - 2.4)} 9 {f(y)}T15 {f(y)}T21 {f(y)}V{f(y + h)}'
            f'Q18 {f(y + h + 2.4)} 15 {f(y + h)}T9 {f(y + h)}T3 {f(y + h)}Z')
G['ripple'] = [wave(6.2), wave(11.2), wave(16.2)]
# 11 doorway: an arch with steps climbing into it
G['doorway'] = ['M8 21V9.5A6.5 6.5 0 0 1 21 9.5V21H17.6V9.5A3.1 3.1 0 0 0 11.4 9.5V21Z', poly((3, 21), (3, 17.6), (5.4, 17.6), (5.4, 15.2), (8, 15.2), (8, 21))]
# 12 sunburst: rays around a small sun
G['sunburst'] = [circle(12, 12, 2.2)] + [poly(pt(12, 12, 3.6, a - 6), pt(12, 12, 10, a - 3.2), pt(12, 12, 10, a + 3.2), pt(12, 12, 3.6, a + 6)) for a in range(0, 360, 30)]
# 13 crescents: two moons waxing side by side
G['crescents'] = ['M12.4 3A9 9 0 0 0 12.4 21A3.4 9 0 0 1 12.4 3Z', 'M20.6 6.6A5.4 5.4 0 0 0 20.6 17.4A2 5.4 0 0 1 20.6 6.6Z']
# 14 clover: four lobes around a knot
G['clover'] = [circle(7.6, 7.6, 4.6), circle(16.4, 7.6, 4.6), circle(7.6, 16.4, 4.6), circle(16.4, 16.4, 4.6), circle(12, 12, 3)]
# 15 peaks: two mountains and a sun
G['peaks'] = [poly((2.5, 20), (9, 9), (15.5, 20)), poly((11, 20), (16, 12), (21.5, 20)), circle(17.6, 6, 2.4)]
# 16 tide: a dome cut by waves
G['tide'] = ['M3 11A9 9 0 0 1 21 11Z', wave(13.4, 2), wave(17.8, 2)]
# 17 vortex: six hooked blades spinning
G['vortex'] = [f'M12 12Q{f(pt(12, 12, 9, a - 40)[0])} {f(pt(12, 12, 9, a - 40)[1])} {f(pt(12, 12, 10, a)[0])} {f(pt(12, 12, 10, a)[1])}Q{f(pt(12, 12, 6, a + 25)[0])} {f(pt(12, 12, 6, a + 25)[1])} 12 12Z' for a in range(0, 360, 60)]
# 18 chalice: a ball, a cup and a foot
G['chalice'] = [circle(12, 4.6, 2.4), 'M4 9H20A8 8 0 0 1 4 9Z', 'M7 21A5 5 0 0 1 17 21Z']
# 19 sprout: two leaves and a seed
G['sprout'] = ['M3 9H11.4V21A8.4 8.4 0 0 1 3 12.6Z', 'M12.6 21V18.4A8 8 0 0 1 20.6 10.4H21V12.8A8.2 8.2 0 0 1 12.8 21Z', circle(15, 5.2, 2.6)]
# 20 rainbow: three arches around a dot
G['rainbow'] = [ring(12, 20, 7.6, 9.6, 180, 360), ring(12, 20, 4.4, 6.4, 180, 360), circle(12, 18.6, 2), 'M2.4 20H4.4V21H2.4ZM19.6 20H21.6V21H19.6Z']
# 21 quatrefoil: four petals in an X
G['quatrefoil'] = [petal(12, 12, 9.6, 5.2, a, 0.6) for a in (45, 135, 225, 315)]
# 22 turn: an S drawn in two blocks
G['turn'] = ['M8 3.5H20.5V7.5H8.6A2.1 2.1 0 0 0 8.6 11.7H15.4A6 6 0 0 1 15.4 23.7V20.5H3.5V16.5H15.4A2.1 2.1 0 0 0 15.4 12.3H8.6A6 6 0 0 1 8 3.5Z'.replace('23.7', '20.5')]
# 23 cubes: one cube, faces split by gaps
G['cubic'] = [poly((12, 2.6), (20.6, 7.4), (12, 12.2), (3.4, 7.4)), poly((3.4, 8.9), (11.2, 13.4), (11.2, 21.6), (3.4, 17.1)), poly((20.6, 8.9), (12.8, 13.4), (12.8, 21.6), (20.6, 17.1))]
# 24 mirror: two bows and a point between
G['mirror'] = ['M3 3H8.4A12 12 0 0 0 8.4 21H3Z', 'M21 3H15.6A12 12 0 0 1 15.6 21H21Z', circle(12, 12, 2)]
# 25 bloom: eight petals and a centre
G['bloom'] = [petal(12, 12, 8.4, 3.2, a, 1.6) for a in range(0, 360, 45)] + [circle(12, 12, 2)]
# 26 compass: a disc with a sparkle cut through
G['lodestar'] = [circle(12, 12, 9.5) + star4(12, 12, 9.5, 0.12).replace('M', 'M', 1)]
# 27 venn: two circles meeting
G['venn'] = [circle(8.8, 12, 6.8), circle(15.2, 12, 6.8)]
# 28 horizon: hills under a setting sun
G['horizon'] = [circle(17.5, 6, 2.6), 'M3 16Q8 9 13 13.4T21 12.4V15Q16 15.2 12.6 17T3 19Z', 'M3 20.2Q10 16.8 21 17.2V21H3Z']
# 29 eye: a lid, a lens and a pupil
G['gaze'] = ['M2.6 8Q12 1.6 21.4 8L20.4 9.4Q12 3.8 3.6 9.4Z', 'M3 13.6Q12 4.6 21 13.6Q12 22.6 3 13.6Z' + circle(12, 13.6, 4).replace('a4 4 0 1 0 8 0a4 4 0 1 0 -8 0', 'a4 4 0 1 1 8 0a4 4 0 1 1 -8 0'), circle(12, 13.6, 1.8)]
# 30 pillar: a column with hollow sides
G['pillar'] = ['M5 3H19Q14.6 12 19 21H5Q9.4 12 5 3Z', 'M3 3H4.4Q8.2 12 4.4 21H3ZM21 3H19.6Q15.8 12 19.6 21H21Z']
# 31 grove: three canopies on a trunk
G['grove'] = ['M7.4 9.4A4.6 4.6 0 0 1 16.6 9.4Z', 'M3 15.6A4.6 4.6 0 0 1 12.2 15.6ZM11.8 15.6A4.6 4.6 0 0 1 21 15.6Z', 'M7.4 21A4.6 4.6 0 0 1 16.6 21Z']
# 32 phases: a full moon over two crescents
G['phases'] = [circle(12, 4.8, 2.6), ring(12, 9.6, 5.6, 7.8, 20, 160), ring(12, 13.6, 5.6, 7.8, 20, 160)]
# 33 slope: a ball rolling off a ramp
G['slope'] = [circle(7, 7, 3.6), poly((3, 21), (17, 7), (21, 7), (21, 9.6), (9.6, 21)), poly((3, 16), (11, 8), (13.6, 8), (3, 18.6))]
# 34 window: a square with concave sides
G['window'] = ['M3 3Q12 9 21 3Q15 12 21 21Q12 15 3 21Q9 12 3 3Z']
# 35 wind: gusts with curled ends
G['gust'] = [rrect(3, 7.4, 11.4, 2.2, 1.1), ring(15.4, 5.8, 0.8, 3, 90, 360), rrect(3, 12, 15.6, 2.2, 1.1), rrect(3, 16.6, 9, 2.2, 1.1), ring(13, 18.4, 0.8, 3, 0, 270)]
# 36 lotus: petals opening, a drop above
G['lotus'] = ['M12 2.4Q14.6 5.6 12 8Q9.4 5.6 12 2.4Z', 'M12 9Q16.4 13.6 12 20.6Q7.6 13.6 12 9Z', 'M10.6 20.6Q4 19.6 3 11.4Q8.6 13 10.6 20.6Z', 'M13.4 20.6Q20 19.6 21 11.4Q15.4 13 13.4 20.6Z']
# 37 stairs: a staircase rising to an arch
G['stairs'] = ['M13.2 21V8.4A3.9 3.9 0 0 1 21 8.4V21H18.4V8.4A1.3 1.3 0 0 0 15.8 8.4V21Z', poly((3, 21), (3, 18.4), (5.6, 18.4), (5.6, 15.8), (8.2, 15.8), (8.2, 13.2), (10.8, 13.2), (10.8, 21))]
# 38 orbit: a planet in a tilted ring with two moons
G['orbit'] = [circle(12, 12, 3.6), 'M3.1 14.6A9.6 4.6 -30 1 1 20.9 9.4A9.6 4.6 -30 1 1 3.1 14.6ZM4.6 14A8.2 3.3 -30 1 0 19.4 10A8.2 3.3 -30 1 0 4.6 14Z', circle(4.6, 15.6, 1.6), circle(19.6, 8.2, 1.6)]
# 39 petals: four quarter discs around the centre
G['petals'] = [sector(11, 11, 8, 180, 270), sector(13, 11, 8, 270, 360), sector(13, 13, 8, 0, 90), sector(11, 13, 8, 90, 180)]
# 40 seed: a split almond with a dot
G['seed'] = ['M12 2.6Q22 12 12 21.4Q2 12 12 2.6Z' + 'M12 6.4V17.6' , circle(12, 12, 1.6)]


def write():
    os.makedirs(OUT, exist_ok=True)
    for name, paths in G.items():
        body = ''.join(f'<path d="{d}" fill-rule="evenodd"/>' for d in paths)
        with open(os.path.join(OUT, f'{name}.svg'), 'w') as fh:
            fh.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">{body}</svg>\n')
    print(len(G), 'abstract glyphs written to src/glyphs/abstract')


if __name__ == '__main__':
    write()
