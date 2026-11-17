import data from './generated/data.json';
// Plain ESM copied from the library by scripts/sync.mjs
import { toSvg as coreToSvg } from './generated/core.mjs';

export type Hue = keyof typeof data.hues;
export type Radius = 'sharp' | 'soft' | 'round' | 'circle';
export interface Icon {
  name: string;
  category: string;
  hue: Hue;
  tags: string[];
  style: 'fill' | 'stroke';
  body: string;
}

export const HUES = data.hues as Record<Hue, [string, string, string]>;
export const HUE_NAMES = Object.keys(HUES) as Hue[];
export const ICONS = data.icons as Icon[];
export const RADII: Record<Radius, number> = { sharp: 4, soft: 8, round: 11, circle: 16 };
export const RADIUS_NAMES: Radius[] = ['sharp', 'soft', 'round', 'circle'];
export const CATEGORIES = [...new Set(ICONS.map((i) => i.category))];

const byName = new Map(ICONS.map((i) => [i.name, i]));
export const getIcon = (name: string) => byName.get(name);
export const icon = (name: string) => byName.get(name)!;

export const SITE = {
  name: 'Glazed Icons',
  pkg: 'glaze-icons',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://glazed-icons.vercel.app').replace(/\/$/, ''),
  repo: 'https://github.com/WebDevAmey/Glazed-Icons',
  count: ICONS.length,
};

export const pascal = (n: string) => n.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
export const component = (n: string) => `${pascal(n)}Icon`;
export const label = (n: string) => n.replace(/-/g, ' ');

export function toSvg(ic: Icon, opts: { size?: number; hue?: Hue; radius?: Radius } = {}): string {
  return coreToSvg(ic, HUES, opts);
}

export function snippets(ic: Icon, hue: Hue, radius: Radius, size = 40) {
  const props = [`size={${size}}`];
  if (hue !== ic.hue) props.push(`hue="${hue}"`);
  if (radius !== 'soft') props.push(`radius="${radius}"`);
  const opts = [`size: ${size}`];
  if (hue !== ic.hue) opts.push(`hue: '${hue}'`);
  if (radius !== 'soft') opts.push(`radius: '${radius}'`);
  const rc = { sharp: 'rounded-sm', soft: 'rounded-lg', round: 'rounded-[11px]', circle: 'rounded-full' }[radius];
  const grad = hue === 'ink'
    ? 'from-neutral-600 to-neutral-900 ring-offset-neutral-800'
    : `from-${hue}-400 to-${hue}-600 ring-offset-${hue}-500`;
  const paint = ic.style === 'fill'
    ? 'fill="currentColor"'
    : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  return {
    react: `import { ${component(ic.name)} } from '${SITE.pkg}/react';\n\n<${component(ic.name)} ${props.join(' ')} />`,
    js: `import { glaze } from '${SITE.pkg}';\n\nel.innerHTML = glaze('${ic.name}', { ${opts.join(', ')} });`,
    svg: toSvg(ic, { size, hue, radius }),
    tailwind: `<div class="flex size-8 items-center justify-center ${rc} bg-linear-to-b ${grad} shadow-lg ring-1 ring-white/20 ring-offset-2 ring-inset">\n  <svg class="size-4 text-white drop-shadow-xl drop-shadow-black/40" viewBox="0 0 24 24" ${paint}>${ic.body.replace(/#fff/g, 'currentColor')}</svg>\n</div>`,
  };
}
export type SnippetKind = keyof ReturnType<typeof snippets>;
export const SNIPPET_LABELS: Record<SnippetKind, string> = { react: 'React', js: 'JS', svg: 'SVG', tailwind: 'Tailwind' };

/** Search: name beats tag beats colour or category. Every word must match something. */
export function search(list: Icon[], q: string): Icon[] {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list
    .map((ic) => {
      let s = 0;
      for (const w of words) {
        if (ic.name === w) s += 10;
        else if (ic.name.startsWith(w)) s += 6;
        else if (ic.name.includes(w)) s += 4;
        else if (ic.tags.some((t) => t.startsWith(w))) s += 3;
        else if (ic.hue === w || ic.category.toLowerCase().includes(w)) s += 2;
        else return [ic, 0] as const;
      }
      return [ic, s] as const;
    })
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([ic]) => ic);
}
