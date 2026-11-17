'use client';

import Link from 'next/link';
import { HUES, HUE_NAMES, icon } from '@/lib/icons';
import { Tile } from './Tile';
import { ArtImage } from './Art';
import { setTheme, useDark } from './ThemeToggle';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/** Two painted windows beside the hero: one flips the theme, one opens the colour set. */
export function HeroSide() {
  const dark = useDark();
  return (
    <div className="hero-side">
      <div className="art side-card art-hover" data-enter="3">
        <ArtImage name="cabin" sizes="(max-width: 1080px) 50vw, 400px" priority />
        <button type="button" className="side-chip" onClick={() => setTheme(!dark)} aria-pressed={!!dark}>
          <Tile icon={icon(dark ? 'sun' : 'moon')} size={38} />
          <span>
            <strong>{dark ? 'Back to daylight' : 'Made for night, too'}</strong>
            <span>{dark ? 'Switch the site to its light theme.' : 'Every tile holds up on dark. Try it here.'}</span>
          </span>
          <span className="go" aria-hidden="true"><Arrow /></span>
        </button>
      </div>
      <Link href="/icons/" className="art side-card" data-enter="4">
        <ArtImage name="falls" sizes="(max-width: 1080px) 50vw, 400px" priority />
        <span className="side-chip">
          <Tile icon={icon('palette')} size={38} />
          <span>
            <strong>{HUE_NAMES.length} colours, any icon</strong>
            <span className="side-dots" aria-hidden="true">
              {HUE_NAMES.slice(0, 12).map((h) => <i key={h} style={{ background: HUES[h][1] }} />)}
            </span>
          </span>
          <span className="go" aria-hidden="true"><Arrow /></span>
        </span>
      </Link>
    </div>
  );
}
