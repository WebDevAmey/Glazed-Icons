// Glaze core: turns an icon record into a standalone glossy tile SVG.
// The tile follows one recipe: a 400 -> 600 vertical gradient, a 2px band of the
// 500 shade at the edge, a 1px white/20 inner line, and a white glyph with a soft drop shadow.

export const RADII = { sharp: 4, soft: 8, round: 11, circle: 16 };

export function toSvg(icon, hues, opts = {}) {
  const size = opts.size ?? 32;
  const r = typeof opts.radius === 'number' ? opts.radius : RADII[opts.radius ?? 'soft'];
  const hue = hues[opts.hue ?? icon.hue] ?? hues[icon.hue];
  const [c4, c5, c6] = hue;
  const id = `glz-${icon.name}-${opts.hue ?? icon.hue}`;
  const glyphScale = (opts.glyph ?? 16) / 24;
  const off = (32 - (opts.glyph ?? 16)) / 2;
  const paint = icon.style === 'fill'
    ? 'fill="#fff" stroke="none"'
    : 'fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const title = opts.title ? `<title>${opts.title}</title>` : '';
  const a11y = opts.title ? 'role="img"' : 'aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" ${a11y}>${title}<defs><linearGradient id="${id}-g" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="${c4}"/><stop offset="1" stop-color="${c6}"/></linearGradient><filter id="${id}-s" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="1" stdDeviation="0.8" flood-color="#000" flood-opacity="0.35"/></filter></defs><rect width="32" height="32" rx="${r}" fill="url(#${id}-g)"/><rect x="1" y="1" width="30" height="30" rx="${Math.max(r - 1, 0)}" stroke="${c5}" stroke-width="2"/><rect x="2.5" y="2.5" width="27" height="27" rx="${Math.max(r - 2.5, 0)}" stroke="#fff" stroke-opacity="0.2"/><g filter="url(#${id}-s)"><g transform="translate(${off} ${off}) scale(${glyphScale.toFixed(4)})" ${paint}>${icon.body}</g></g></svg>`;
}
