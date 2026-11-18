import type { CSSProperties } from 'react';
import { RADII, darkInk, glyphOf, inkOf, shades, type Icon, type TileOptions } from '@/lib/icons';

/**
 * The CSS twin of the package's SVG tile: gradient fill, top gloss, glass rim,
 * hairline edge and a white glyph with a short shadow. Every layer reads a CSS
 * variable, so sliders update it without re-rendering the glyph.
 */
export function Tile({ icon, size = 48, className = '', style, ...opts }: TileOptions & {
  icon: Icon; size?: number; className?: string; style?: CSSProperties;
}) {
  const [c4, c5, c6] = shades(icon, opts);
  const r = typeof opts.radius === 'number' ? opts.radius : RADII[opts.radius ?? 'soft'];
  const vars = {
    '--c4': c4, '--c5': c5, '--c6': c6,
    '--rad': r,
    '--s': `${size}px`,
    '--glyph': opts.glyph ?? glyphOf(icon),
    ...(opts.gloss !== undefined && { '--gloss': opts.gloss }),
    ...(opts.rim !== undefined && { '--rim': opts.rim }),
    ...(opts.shadow !== undefined ? { '--sh': opts.shadow } : darkInk(inkOf(icon, opts)) ? { '--sh': 0 } : {}),
    ...style,
  } as CSSProperties;
  const ink = inkOf(icon, opts);
  const paint = icon.style === 'fill'
    ? { fill: ink }
    : { fill: 'none', stroke: ink, strokeWidth: opts.stroke ?? 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <span className={`tile ${className}`} style={vars} aria-hidden="true">
      <svg viewBox="0 0 24 24" {...paint} dangerouslySetInnerHTML={{ __html: icon.body }} />
    </span>
  );
}
