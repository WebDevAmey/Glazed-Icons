// Glaze core: turns an icon record into a standalone glossy tile SVG.
//
// The tile, on a 32-unit grid:
//   fill   a vertical gradient from the hue's 400 shade to its 600 shade
//   gloss  white light falling from the top edge, fading out by the middle
//   edge   a hairline of black at 10%, so the tile holds its shape on any ground
//   rim    a 1px glass line just inside the edge, brightest at the top
//   glyph  white (or the icon's own ink), with a short soft shadow on light glyphs
// Every layer has a knob, so the same recipe goes from flat to very glossy.

export const RADII = { sharp: 4, soft: 8, round: 11, circle: 16 };
export const DEFAULTS = { size: 32, radius: 'soft', glyph: 17, gloss: 0.6, rim: 0.7, shadow: 0.6, stroke: 2 };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const num = (v, d) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

function hexToRgb(hex) {
  const h = String(hex).replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(f.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (rgb) => '#' + rgb.map((c) => Math.round(clamp(c, 0, 255)).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);
const hash = (str) => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return (h >>> 0).toString(36).slice(0, 6); };

/** Light, base and dark shades from any hex colour. */
export function shadesFrom(hex) {
  const base = hexToRgb(hex);
  return [toHex(mix(base, [255, 255, 255], 0.26)), toHex(base), toHex(mix(base, [0, 0, 0], 0.16))];
}

/** True when a glyph colour is dark enough that a drop shadow would muddy it. */
export function isDarkInk(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}

/** Resolves options to concrete numbers on the 32-unit grid. */
export function resolve(icon, hues, opts = {}) {
  const colors = opts.color ? shadesFrom(opts.color) : hues[opts.hue ?? icon.hue] ?? hues[icon.hue];
  const r = typeof opts.radius === 'number' ? clamp(opts.radius, 0, 16) : RADII[opts.radius ?? DEFAULTS.radius] ?? RADII.soft;
  const ink = opts.ink || icon.ink || '#fff';
  const dark = isDarkInk(ink);
  return {
    ink,
    size: num(opts.size, DEFAULTS.size),
    colors,
    r,
    glyph: clamp(num(opts.glyph, num(icon.glyph, DEFAULTS.glyph)), 8, 26),
    gloss: clamp(num(opts.gloss, DEFAULTS.gloss), 0, 1),
    rim: clamp(num(opts.rim, DEFAULTS.rim), 0, 1),
    shadow: clamp(num(opts.shadow, dark ? 0 : DEFAULTS.shadow), 0, 1),
    stroke: clamp(num(opts.stroke, DEFAULTS.stroke), 1, 3),
  };
}

export function toSvg(icon, hues, opts = {}) {
  const o = resolve(icon, hues, opts);
  const [c4, , c6] = o.colors;
  const { ink: _ink, ...plain } = o;
  const id = `glz-${icon.name}-${hash(JSON.stringify(o.ink === '#fff' ? plain : o))}`;
  const off = (32 - o.glyph) / 2;
  const k = (o.glyph / 24).toFixed(4);
  const paint = icon.style === 'fill'
    ? `fill="${o.ink}" stroke="none"`
    : `fill="none" stroke="${o.ink}" stroke-width="${o.stroke}" stroke-linecap="round" stroke-linejoin="round"`;
  const title = opts.title ? `<title>${String(opts.title).replace(/</g, '&lt;')}</title>` : '';
  const a11y = opts.title ? 'role="img"' : 'aria-hidden="true"';
  const shadow = o.shadow > 0
    ? `<filter id="${id}-s" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="${(0.4 + 0.6 * o.shadow).toFixed(2)}" stdDeviation="${(0.35 + 0.55 * o.shadow).toFixed(2)}" flood-color="#000" flood-opacity="${(0.32 * o.shadow).toFixed(3)}"/></filter>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${o.size}" height="${o.size}" viewBox="0 0 32 32" fill="none" ${a11y}>${title}<defs>`
    + `<linearGradient id="${id}-f" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="${c4}"/><stop offset="1" stop-color="${c6}"/></linearGradient>`
    + `<linearGradient id="${id}-g" x1="16" y1="0" x2="16" y2="18" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="${(0.42 * o.gloss).toFixed(3)}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`
    + `<linearGradient id="${id}-r" x1="16" y1="1" x2="16" y2="31" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="${(0.6 * o.rim).toFixed(3)}"/><stop offset="0.5" stop-color="#fff" stop-opacity="${(0.16 * o.rim).toFixed(3)}"/><stop offset="1" stop-color="#fff" stop-opacity="${(0.28 * o.rim).toFixed(3)}"/></linearGradient>`
    + shadow + `</defs>`
    + `<rect width="32" height="32" rx="${o.r}" fill="url(#${id}-f)"/>`
    + (o.gloss > 0 ? `<rect width="32" height="32" rx="${o.r}" fill="url(#${id}-g)"/>` : '')
    + (o.rim > 0 ? `<rect x="1.5" y="1.5" width="29" height="29" rx="${Math.max(o.r - 1.5, 0)}" stroke="url(#${id}-r)"/>` : '')
    + `<rect x="0.5" y="0.5" width="31" height="31" rx="${Math.max(o.r - 0.5, 0)}" stroke="#000" stroke-opacity="0.1"/>`
    + `<g${o.shadow > 0 ? ` filter="url(#${id}-s)"` : ''}><g transform="translate(${off} ${off}) scale(${k})" ${paint}>${icon.body}</g></g>`
    + `</svg>`;
}
