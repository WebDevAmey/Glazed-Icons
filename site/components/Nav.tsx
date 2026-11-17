'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';
import { SearchPalette } from './SearchPalette';

/** Clove's floating plaque: logo left, quiet links right, one raised action. */
export function Nav() {
  const path = usePathname();
  const here = (p: string) => (path.startsWith(p) ? 'page' : undefined);
  return (
    <header className="nav">
      <div className="nav-bar">
        <Link href="/" className="brand" aria-label={`${SITE.name} homepage`}>
          <Tile icon={icon('flower')} size={24} />
          <span>Glazed</span>
        </Link>
        <nav aria-label="Primary" className="nav-links">
          <Link href="/icons/" aria-current={here('/icons')}>Icons</Link>
          <Link href="/docs/" aria-current={here('/docs')}>Docs</Link>
          <Link href="/#compare" className="md-up">Compare</Link>
          <a href={SITE.repo} target="_blank" rel="noopener" className="md-up">GitHub</a>
          <SearchPalette />
          <Link href="/docs/" className="nav-cta">Get started</Link>
        </nav>
      </div>
    </header>
  );
}
