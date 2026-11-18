import Link from 'next/link';
import { ICONS, label } from '@/lib/icons';
import { Tile } from './Tile';

/** Pick an even spread across every collection, so the rows show the whole range. */
function spread(n: number, offset: number) {
  const step = ICONS.length / n;
  return Array.from({ length: n }, (_, i) => ICONS[Math.floor(i * step + offset) % ICONS.length]);
}

/**
 * Two rows of tiles drifting in opposite directions. Each row is rendered twice
 * so the loop is seamless; the copy is hidden from assistive tech. Pauses on hover,
 * and stands still for anyone who prefers reduced motion.
 */
export function Marquee() {
  const rows = [spread(22, 0), spread(22, 6)];
  return (
    <div className="marquee" aria-label="A sample of the icons">
      {rows.map((row, r) => (
        <div key={r} className="marquee-row" data-dir={r ? 'right' : 'left'}>
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-track" aria-hidden={copy === 1 || undefined}>
              {row.map((ic) => (
                <Link key={ic.name} href={`/icons/${ic.name}/`} tabIndex={copy ? -1 : undefined} className="marquee-cell" aria-label={`${label(ic.name)} icon`}>
                  <Tile icon={ic} size={72} />
                </Link>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
