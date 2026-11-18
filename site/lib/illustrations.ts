import data from './generated/3d.json';

/** A 3D icon: a raster cut-out on a transparent, square canvas. */
export interface Icon3D {
  name: string;
  title: string;
  tags: string[];
  width: number;
  height: number;
  png: string;
  webp: string;
}
export interface Icon3DCollection {
  id: string;
  title: string;
  description: string;
  count: number;
  items: Icon3D[];
}

export const COLLECTIONS = data.collections as Icon3DCollection[];
export const GLASS = COLLECTIONS.find((c) => c.id === 'glass-resin')!;
export const ICONS_3D = COLLECTIONS.flatMap((c) => c.items.map((it) => ({ ...it, collection: c.id })));

const byName = new Map(ICONS_3D.map((i) => [i.name, i]));
export const getIcon3D = (name: string) => byName.get(name);
export const href3D = (it: Icon3D) => `/3d/${it.name}/`;

/** Public URL of a file, served from /public at the same path as in the package. */
export const src = (file: string) => `/${file}`;

/** Sizes offered in the detail view and for download. */
export const SIZES_3D = [64, 128, 256, 512] as const;
export type Size3D = (typeof SIZES_3D)[number];

/** Search: title and name beat tags. Every word must match something. */
export function search3D(list: Icon3D[], q: string): Icon3D[] {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list
    .map((it) => {
      let s = 0;
      const title = it.title.toLowerCase();
      for (const w of words) {
        if (it.name.endsWith(`-${w}`) || title === w) s += 10;
        else if (title.startsWith(w)) s += 6;
        else if (it.name.includes(w) || title.includes(w)) s += 4;
        else if (it.tags.some((t) => t.startsWith(w))) s += 3;
        else return [it, 0] as const;
      }
      return [it, s] as const;
    })
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([it]) => it);
}

const camel = (n: string) => n.replace(/-(\w)/g, (_, c) => c.toUpperCase());

export function snippetsFor(it: Icon3D, size: number) {
  return {
    html: `<img src="node_modules/glaze-icons/${it.webp}" width="${size}" height="${size}" alt="${it.title}">`,
    react: `import ${camel(it.name)} from 'glaze-icons/${it.webp}';\n\n<img src={${camel(it.name)}} width={${size}} height={${size}} alt="${it.title}" />`,
    css: `.icon-${it.name.replace(/^glass-/, '')} {\n  width: ${size}px;\n  height: ${size}px;\n  background: url("glaze-icons/${it.webp}") center / contain no-repeat;\n}`,
  };
}
export type Snippet3D = keyof ReturnType<typeof snippetsFor>;
export const SNIPPET_3D_LABELS: Record<Snippet3D, string> = { html: 'HTML', react: 'React', css: 'CSS' };

/** Resize the 512 px master in the browser, halving in steps so edges stay clean. */
export async function render3D(it: Icon3D, size: number, type: 'image/png' | 'image/webp'): Promise<Blob> {
  const img = new Image();
  img.src = src(it.png);
  await img.decode();
  let cur: CanvasImageSource = img;
  let w = img.naturalWidth;
  while (w / 2 >= size) {
    const c = document.createElement('canvas');
    c.width = c.height = w / 2;
    const g = c.getContext('2d')!;
    g.imageSmoothingQuality = 'high';
    g.drawImage(cur, 0, 0, c.width, c.height);
    cur = c; w = c.width;
  }
  const out = document.createElement('canvas');
  out.width = out.height = size;
  const g = out.getContext('2d')!;
  g.imageSmoothingQuality = 'high';
  g.drawImage(cur, 0, 0, size, size);
  return new Promise((res, rej) => out.toBlob((b) => (b ? res(b) : rej(new Error('export failed'))), type, 1));
}
