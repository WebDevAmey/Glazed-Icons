import type { CSSProperties } from 'react';
import { HUES, RADII, type Hue, type Icon, type Radius } from '@/lib/icons';

/** The CSS twin of the package's SVG tile: same gradient, edge band, highlight and glyph. */
export function Tile({ icon, hue, radius = 'soft', size = 48, className = '', style }: {
  icon: Icon; hue?: Hue; radius?: Radius; size?: number; className?: string; style?: CSSProperties;
}) {
  const [c4, c5, c6] = HUES[hue ?? icon.hue];
  const vars = { '--c4': c4, '--c5': c5, '--c6': c6, '--rad': RADII[radius], '--s': `${size}px`, ...style } as CSSProperties;
  const paint = icon.style === 'fill'
    ? { fill: '#fff' }
    : { fill: 'none', stroke: '#fff', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <span className={`tile ${className}`} style={vars} aria-hidden="true">
      <svg viewBox="0 0 24 24" {...paint} dangerouslySetInnerHTML={{ __html: icon.body }} />
    </span>
  );
}
