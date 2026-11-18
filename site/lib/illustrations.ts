import data from './generated/illustrations.json';

/** A raster illustration, shipped exactly as supplied. */
export interface Illustration {
  name: string;
  title: string;
  tags: string[];
  width: number;
  height: number;
  png: string;
  webp: string;
}
export interface IllustrationCollection {
  id: string;
  title: string;
  description: string;
  count: number;
  items: Illustration[];
}

export const COLLECTIONS = data.collections as IllustrationCollection[];
export const GLASS = COLLECTIONS.find((c) => c.id === 'glass-resin')!;
export const ILLUSTRATIONS = COLLECTIONS.flatMap((c) => c.items.map((it) => ({ ...it, collection: c.id })));

const byName = new Map(ILLUSTRATIONS.map((i) => [i.name, i]));
export const getIllustration = (name: string) => byName.get(name);

/** Public URL of a file, served from /public at the same path as in the package. */
export const src = (file: string) => `/${file}`;

/** Search: title and name beat tags. Every word must match something. */
export function searchIllustrations(list: Illustration[], q: string): Illustration[] {
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

export function snippetsFor(it: Illustration) {
  const alt = `${it.title} in glass and resin`;
  return {
    html: `<img src="node_modules/glaze-icons/${it.webp}" width="${it.width}" height="${it.height}" alt="${alt}">`,
    react: `import ${it.name.replace(/-(\w)/g, (_, c) => c.toUpperCase())} from 'glaze-icons/${it.webp}';\n\n<img src={${it.name.replace(/-(\w)/g, (_, c) => c.toUpperCase())}} width={${it.width}} height={${it.height}} alt="${alt}" />`,
    markdown: `![${alt}](${it.webp})`,
  };
}
export type IllustrationSnippet = keyof ReturnType<typeof snippetsFor>;
export const ILLUSTRATION_SNIPPET_LABELS: Record<IllustrationSnippet, string> = { html: 'HTML', react: 'React', markdown: 'Markdown' };
