import fs from 'node:fs';
import path from 'node:path';
import { toSvg } from '../src/core.mjs';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const here = path.join(root, 'src');
const { hues, icons } = JSON.parse(fs.readFileSync(path.join(here, 'data.json'), 'utf8'));
const out = root;
for (const d of ['svg', 'dist']) {
  fs.rmSync(path.join(out, d), { recursive: true, force: true });
  fs.mkdirSync(path.join(out, d), { recursive: true });
}

const pascal = (n) => n.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
const VERSION = '0.1.0';

// 1. Standalone SVGs, one per icon, in its own colour.
for (const ic of icons) fs.writeFileSync(path.join(out, 'svg', `${ic.name}.svg`), toSvg(ic, hues) + '\n');

// 2. Metadata
const meta = icons.map(({ body, source, ...m }) => ({ ...m, component: pascal(m.name) + 'Icon' }));
fs.writeFileSync(path.join(out, 'icons.json'), JSON.stringify({ version: VERSION, hues, icons: meta }, null, 2));

// 3. Core ESM: data + toSvg, framework free.
const coreSrc = fs.readFileSync(path.join(here, 'core.mjs'), 'utf8');
const data = icons.map(({ name, hue, style, body, category, tags, ink, glyph, multi, shadow, palette }) => ({ name, hue, style, body, category, tags, ...(ink && { ink }), ...(glyph && { glyph }), ...(multi && { multi }), ...(shadow !== undefined && { shadow }), ...(palette && { palette }) }));
fs.writeFileSync(path.join(out, 'dist', 'index.js'),
`${coreSrc}
export const hues = ${JSON.stringify(hues)};
export const icons = ${JSON.stringify(data)};
const byName = Object.fromEntries(icons.map((i) => [i.name, i]));
/** glaze('rocket', { size: 48, hue: 'violet', radius: 'round' }) -> SVG string */
export function glaze(name, opts) {
  const icon = byName[name];
  if (!icon) throw new Error('glaze-icons: unknown icon "' + name + '"');
  return toSvg(icon, hues, opts);
}
`);

// 4. React components, one named export per icon, tree-shakable.
fs.writeFileSync(path.join(out, 'dist', 'react.js'),
`import { createElement, forwardRef } from 'react';
import { glaze } from './index.js';
function make(name, displayName) {
  const C = forwardRef(function GlazeIcon({ size = 32, hue, color, ink, colors, radius, glyph, gloss, rim, shadow, stroke, title, className, style, ...rest }, ref) {
    return createElement('span', {
      ref, className, role: title ? 'img' : undefined, 'aria-label': title, 'aria-hidden': title ? undefined : true,
      style: { display: 'inline-flex', width: size, height: size, lineHeight: 0, filter: 'drop-shadow(0 6px 10px rgb(0 0 0 / 0.12)) drop-shadow(0 2px 3px rgb(0 0 0 / 0.08))', ...style },
      dangerouslySetInnerHTML: { __html: glaze(name, { size, hue, color, ink, colors, radius, glyph, gloss, rim, shadow, stroke }) }, ...rest,
    });
  });
  C.displayName = displayName;
  return C;
}
${icons.map((i) => `export const ${pascal(i.name)}Icon = /*#__PURE__*/ make('${i.name}', '${pascal(i.name)}Icon');`).join('\n')}
`);

// 5. Types
const hueUnion = Object.keys(hues).map((h) => `'${h}'`).join(' | ');
const nameUnion = icons.map((i) => `'${i.name}'`).join(' | ');
const optsType = `export type GlazeHue = ${hueUnion};
export type GlazeRadius = 'sharp' | 'soft' | 'round' | 'circle' | number;
export interface GlazeOptions {
  /** Pixel size of the tile. Default 32. */
  size?: number;
  /** One of the 18 built-in hues. Default: the icon's own. */
  hue?: GlazeHue;
  /** Any hex colour; the light and dark shades are derived from it. Overrides hue. */
  color?: string;
  /** Glyph colour as a hex. Default white; Abstract icons default to near-black ink. */
  ink?: string;
  /** Multi-colour icons only: new colours for the glyph's palette slots, as an array in slot order or a map from original hex to new hex. */
  colors?: (string | null)[] | Record<string, string>;
  /** sharp | soft | round | circle, or 0 to 16 on the 32-unit grid. Default soft (8). */
  radius?: GlazeRadius;
  /** Glyph size on the 32-unit grid, 8 to 26. Default 17. */
  glyph?: number;
  /** Top light, 0 to 1. Default 0.6. */
  gloss?: number;
  /** Glass line inside the edge, 0 to 1. Default 0.7. */
  rim?: number;
  /** Glyph shadow, 0 to 1. Default 0.6. */
  shadow?: number;
  /** Line weight for outline glyphs, 1 to 3. Default 2. */
  stroke?: number;
  /** Accessible name. Without it the icon is decorative. */
  title?: string;
}
export type GlazeIconName = ${nameUnion};`;
fs.writeFileSync(path.join(out, 'dist', 'index.d.ts'), `${optsType}
export declare const RADII: Record<'sharp' | 'soft' | 'round' | 'circle', number>;
export declare const DEFAULTS: Required<Pick<GlazeOptions, 'size' | 'glyph' | 'gloss' | 'rim' | 'shadow' | 'stroke'>> & { radius: 'soft' };
export declare function shadesFrom(hex: string): [string, string, string];
export declare const hues: Record<GlazeHue, [string, string, string]>;
export declare const icons: { name: GlazeIconName; hue: GlazeHue; style: 'fill' | 'stroke'; body: string; category: string; tags: string[]; ink?: string; multi?: boolean; palette?: string[] }[];
export declare function repaint(icon: { body: string; palette?: string[] }, colors?: GlazeOptions['colors']): string;
export declare function isDarkInk(hex: string): boolean;
export declare function glaze(name: GlazeIconName, opts?: GlazeOptions): string;
`);
fs.writeFileSync(path.join(out, 'dist', 'react.d.ts'), `import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from 'react';
import type { GlazeOptions } from './index';
export interface GlazeIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'title' | 'color'>, Omit<GlazeOptions, 'title'> { title?: string }
type C = ForwardRefExoticComponent<GlazeIconProps & RefAttributes<HTMLSpanElement>>;
${icons.map((i) => `export declare const ${pascal(i.name)}Icon: C;`).join('\n')}
`);

console.log('built', icons.length, 'icons');
