import data from './generated/data.json';
// Plain ESM copied from the library by scripts/sync.mjs
import { toSvg as coreToSvg, shadesFrom, isDarkInk, DEFAULTS as CORE_DEFAULTS } from './generated/core.mjs';

export type Hue = keyof typeof data.hues;
export type Radius = 'sharp' | 'soft' | 'round' | 'circle';
export interface Icon {
  name: string;
  category: string;
  hue: Hue;
  tags: string[];
  style: 'fill' | 'stroke';
  body: string;
  /** Glyph colour when it is not white (the Abstract collection is drawn in dark ink). */
  ink?: string;
  /** Default glyph size on the 32 grid when it differs from the library default. */
  glyph?: number;
  /** The glyph paints its own colours (the Blossom collection), so ink does not apply. */
  multi?: boolean;
  /** Default glyph shadow when it differs from the library default. */
  shadow?: number;
}

/** Everything a tile can be told, shared by the site, the SVG export and the code snippets. */
export interface TileOptions {
  hue?: Hue;
  color?: string;
  ink?: string;
  radius?: Radius | number;
  glyph?: number;
  gloss?: number;
  rim?: number;
  shadow?: number;
  stroke?: number;
}

export const HUES = data.hues as Record<Hue, [string, string, string]>;
export const HUE_NAMES = Object.keys(HUES) as Hue[];
export const ICONS = data.icons as Icon[];
export const RADII: Record<Radius, number> = { sharp: 4, soft: 8, round: 11, circle: 16 };
export const RADIUS_NAMES: Radius[] = ['sharp', 'soft', 'round', 'circle'];
export const DEFAULTS = CORE_DEFAULTS as { size: number; radius: 'soft'; glyph: number; gloss: number; rim: number; shadow: number; stroke: number };
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

export function shades(ic: Icon, opts: TileOptions = {}): [string, string, string] {
  if (opts.color) return shadesFrom(opts.color) as [string, string, string];
  return HUES[opts.hue ?? ic.hue];
}

export function toSvg(ic: Icon, opts: TileOptions & { size?: number } = {}): string {
  return coreToSvg(ic, HUES, opts);
}

const round = (n: number) => Math.round(n * 100) / 100;

export const WHITE = '#fff';
export const INK = '#141414';
export const inkOf = (ic: Icon, opts: TileOptions = {}) => opts.ink || ic.ink || WHITE;
export const darkInk = (hex: string) => isDarkInk(hex) as boolean;
export const glyphOf = (ic: Icon) => ic.glyph ?? DEFAULTS.glyph;
export const shadowOf = (ic: Icon, opts: TileOptions = {}) => ic.shadow ?? (darkInk(inkOf(ic, opts)) ? 0 : DEFAULTS.shadow);

/** Only the options that differ from the defaults, so snippets stay short. */
export function changed(ic: Icon, opts: TileOptions) {
  const out: [string, string | number][] = [];
  if (opts.color) out.push(['color', opts.color]);
  else if (opts.hue && opts.hue !== ic.hue) out.push(['hue', opts.hue]);
  if (opts.radius !== undefined && opts.radius !== 'soft' && opts.radius !== RADII.soft) out.push(['radius', opts.radius]);
  if (opts.ink && opts.ink !== (ic.ink || WHITE)) out.push(['ink', opts.ink]);
  if (opts.glyph !== undefined && opts.glyph !== glyphOf(ic)) out.push(['glyph', opts.glyph]);
  if (opts.gloss !== undefined && round(opts.gloss) !== DEFAULTS.gloss) out.push(['gloss', round(opts.gloss)]);
  if (opts.rim !== undefined && round(opts.rim) !== DEFAULTS.rim) out.push(['rim', round(opts.rim)]);
  if (opts.shadow !== undefined && round(opts.shadow) !== shadowOf(ic, opts)) out.push(['shadow', round(opts.shadow)]);
  if (ic.style === 'stroke' && opts.stroke !== undefined && opts.stroke !== DEFAULTS.stroke) out.push(['stroke', opts.stroke]);
  return out;
}

export function snippets(ic: Icon, opts: TileOptions = {}, size = 40) {
  const diff = changed(ic, opts);
  const jsxProps = [`size={${size}}`, ...diff.map(([k, v]) => (typeof v === 'number' ? `${k}={${v}}` : `${k}="${v}"`))];
  const jsOpts = [`size: ${size}`, ...diff.map(([k, v]) => (typeof v === 'number' ? `${k}: ${v}` : `${k}: '${v}'`))];
  const hue = opts.hue ?? ic.hue;
  const r = typeof opts.radius === 'number' ? opts.radius : RADII[opts.radius ?? 'soft'];
  const rc = r >= 16 ? 'rounded-full' : `rounded-[${Math.round(r)}px]`;
  const grad = opts.color
    ? `from-[${shadesFrom(opts.color)[0]}] to-[${shadesFrom(opts.color)[2]}]`
    : hue === 'ink' ? 'from-neutral-600 to-neutral-900' : `from-${hue}-400 to-${hue}-600`;
  const textInk = darkInk(inkOf(ic, opts)) ? 'text-neutral-950' : 'text-white';
  const paint = ic.style === 'fill'
    ? 'fill="currentColor"'
    : `fill="none" stroke="currentColor" stroke-width="${opts.stroke ?? 2}" stroke-linecap="round" stroke-linejoin="round"`;
  return {
    react: `import { ${component(ic.name)} } from '${SITE.pkg}/react';\n\n<${component(ic.name)} ${jsxProps.join(' ')} />`,
    js: `import { glaze } from '${SITE.pkg}';\n\nel.innerHTML = glaze('${ic.name}', { ${jsOpts.join(', ')} });`,
    svg: toSvg(ic, { ...opts, size }),
    tailwind: `<div class="relative flex size-8 items-center justify-center overflow-hidden ${rc} bg-linear-to-b ${grad} shadow-[inset_0_0_0_1px_rgb(0_0_0/.1),inset_0_0_0_2px_rgb(255_255_255/.22)] before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:bg-linear-to-b before:from-white/25 before:to-transparent">\n  <svg class="relative size-[${glyphOf(ic)}px] ${textInk}${textInk === 'text-white' ? ' drop-shadow-[0_1px_1px_rgb(0_0_0/.3)]' : ''}" viewBox="0 0 24 24" ${paint}>${ic.body.replace(/#fff/g, 'currentColor')}</svg>\n</div>`,
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
