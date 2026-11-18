"""Step 2 of the Glass & Resin 3D icons: turn each tile into a transparent 3D icon.

For every tile in src/sources/glass-resin/ (written by scripts/glass.py):
  1. upscale it 4x with Real-ESRGAN, which sharpens edges and clears JPEG noise;
  2. mask the object with U2-Net;
  3. fit the tile's pastel gradient and unmix it from the object's soft edges,
     so no background tint is left in the rim;
  4. lift the original shadow and coloured glow out as a translucent layer
     (darkening only, so the icon sits on light and dark grounds alike);
  5. centre it on a square transparent canvas and save 512 px PNG and WebP.

Run: python3 scripts/glass3d.py [name ...]   (needs torch, spandrel, rembg, scipy, Pillow)
"""
import json, os, sys, urllib.request
import numpy as np
import torch
from PIL import Image
from scipy import ndimage as ndi
from rembg import remove, new_session
from spandrel import ModelLoader
from glass import ASSETS, COLLECTION, ROOT

SRC = os.path.join(ROOT, 'src', 'sources', 'glass-resin')
OUT = os.path.join(ROOT, '3d', 'glass-resin')
SIZE = 512
WEIGHTS = 'https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth'
CACHE = os.path.expanduser('~/.cache/glazed')
_session = None
# objects sitting inside a clear glass case
CASED = {'glass-terrarium', 'glass-mail'}


def session():
    global _session
    _session = _session or new_session('u2net')
    return _session


def upscaler():
    path = os.path.join(CACHE, 'RealESRGAN_x4plus.pth')
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        urllib.request.urlretrieve(WEIGHTS, path)
    return ModelLoader().load_from_file(path).eval()


def upscale(model, img):
    t = torch.from_numpy(np.asarray(img.convert('RGB')).astype(np.float32) / 255).permute(2, 0, 1)[None]
    with torch.no_grad():
        o = model(t)[0].clamp(0, 1).permute(1, 2, 0).numpy()
    return Image.fromarray((o * 255 + 0.5).astype(np.uint8))


def convex_hull(mask):
    from scipy.spatial import ConvexHull
    from matplotlib.path import Path
    ys, xs = np.nonzero(mask)
    pts = np.c_[xs, ys]
    hull = pts[ConvexHull(pts).vertices]
    h, w = mask.shape
    yy, xx = np.mgrid[0:h, 0:w]
    return Path(hull).contains_points(np.c_[xx.ravel(), yy.ravel()]).reshape(h, w)


def fit_bg(img, keep):
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w]; X = xx / w - .5; Y = yy / h - .5
    terms = [np.ones_like(X), X, Y, X*X, X*Y, Y*Y, X**3, X*X*Y, X*Y*Y, Y**3]
    A = np.stack([t[keep] for t in terms], 1)
    sub = np.arange(A.shape[0]); sub = sub[::max(1, len(sub)//20000)]
    out = np.zeros_like(img)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A[sub], img[..., c][keep][sub], rcond=None)
        out[..., c] = sum(k*t for k, t in zip(coef, terms))
    return out

def cut(tile, dst_dir, name, case=False):
    I8 = np.asarray(tile.convert('RGB')); h, w, _ = I8.shape
    I = I8.astype(np.float32) / 255
    m = np.asarray(remove(Image.fromarray(I8), session=session(), only_mask=True, post_process_mask=False)).astype(np.float32) / 255
    # tile interior: away from the rounded border where the sheet gutter shows
    margin = int(w * 0.07)
    inner = np.zeros((h, w), bool); inner[margin:h-margin, margin:w-margin] = True
    hard = m > 0.5
    near = ndi.binary_dilation(hard, iterations=int(w*0.03))
    B = np.clip(fit_bg(I, inner & ~near), 0, 1)
    # residual of the fit tells us the noise floor
    res = np.abs(I - B)[inner & ~ndi.binary_dilation(hard, iterations=int(w*0.12))]
    floor = float(np.percentile(res, 97)) if res.size else 0.02
    a = np.clip(m, 0, 1)
    if case:
        # a clear glass case around the object: take the whole case as the icon and
        # give it see-through alpha from how far each pixel departs from the background
        dev = np.abs(I - B).max(-1)
        seed = ndi.binary_dilation(hard, iterations=int(w * 0.02))
        lab, _ = ndi.label((dev > floor * 2.5) & inner)
        keep = np.isin(lab, np.unique(lab[seed & (lab > 0)]))
        region = convex_hull(keep | hard)
        D0 = I - B
        u = np.where(D0 > 0, D0 / np.maximum(1 - B, 1e-3), 0); d = np.where(D0 < 0, -D0 / np.maximum(B, 1e-3), 0)
        glass = np.clip((np.maximum(u, d).max(-1) - floor) / (1 - floor), 0, 1)
        glass = np.clip(glass * 1.4, 0, 1)
        core = ndi.binary_erosion(m > 0.9, iterations=int(w * 0.004) + 1) * m
        a = np.where(region, np.maximum(core, np.maximum(glass, 0.05)), a)
        a = ndi.gaussian_filter(a, w * 0.0015)
        hard = a > 0.5
    # object: decontaminate edge colour from the background
    F = np.where(a[..., None] > 0.02, (I - (1 - a[..., None]) * B) / np.maximum(a[..., None], 0.02), I)
    F = np.clip(F, 0, 1)
    # shadow / glow: minimum alpha that explains the difference from the background
    D = I - B
    up = np.where(D > 0, D / np.maximum(1 - B, 1e-3), 0); dn = np.where(D < 0, -D / np.maximum(B, 1e-3), 0)
    sa = np.max(dn, -1)
    sa = np.clip((sa - floor * 1.4) / (1 - floor * 1.4), 0, 1)
    # keep it near the object and fade towards the tile border
    dist = ndi.distance_transform_edt(~hard)
    sa *= np.clip(1 - dist / (w * 0.22), 0, 1) ** 1.5
    edge = ndi.distance_transform_edt(np.pad(np.ones((h-2*margin, w-2*margin)), margin))
    sa *= np.clip(edge / (w * 0.06), 0, 1)
    sa = ndi.gaussian_filter(sa, w * 0.004)
    SF = np.clip((I - (1 - sa[..., None]) * B) / np.maximum(sa[..., None], 1e-3), 0, 1)
    sa = np.where(a > 0.98, 0, sa)
    # composite object over shadow layer
    out_a = a + sa * (1 - a)
    out_rgb = (F * a[..., None] + SF * sa[..., None] * (1 - a[..., None])) / np.maximum(out_a[..., None], 1e-4)
    rgba = np.dstack([np.clip(out_rgb, 0, 1), np.clip(out_a, 0, 1)])
    im = Image.fromarray((rgba * 255 + .5).astype(np.uint8), 'RGBA')
    # square, centred on the visible content, with breathing room
    bb = Image.fromarray((np.clip(out_a, 0, 1) > 0.04).astype(np.uint8) * 255).getbbox()
    cx, cy = (bb[0]+bb[2]) / 2, (bb[1]+bb[3]) / 2; side = max(bb[2]-bb[0], bb[3]-bb[1]) * 1.12
    canvas = Image.new('RGBA', (int(side), int(side)), (0, 0, 0, 0))
    canvas.paste(im, (int(side/2 - cx), int(side/2 - cy)))
    return canvas.resize((SIZE, SIZE), Image.LANCZOS)


def item(name, title, tags):
    return {'name': name, 'title': title, 'tags': tags.split(), 'width': SIZE, 'height': SIZE,
            'png': f'3d/glass-resin/{name}.png', 'webp': f'3d/glass-resin/{name}.webp'}


def main():
    model = upscaler()
    os.makedirs(OUT, exist_ok=True)
    items = []
    only = set(sys.argv[1:])
    for name, title, tags in ASSETS:
        if only and name not in only:
            items.append(item(name, title, tags)); continue
        icon = cut(upscale(model, Image.open(os.path.join(SRC, f'{name}.png'))), OUT, name, case=name in CASED)
        icon.save(os.path.join(OUT, f'{name}.png'), optimize=True)
        icon.save(os.path.join(OUT, f'{name}.webp'), lossless=True, quality=100, method=6)
        items.append(item(name, title, tags))
        print(name)
    with open(os.path.join(ROOT, '3d.json'), 'w') as fh:
        json.dump({'collections': [{**COLLECTION, 'count': len(items), 'items': items}]}, fh, indent=2, ensure_ascii=False)
    print(len(items), 'icons written to 3d/glass-resin')


if __name__ == '__main__':
    main()
