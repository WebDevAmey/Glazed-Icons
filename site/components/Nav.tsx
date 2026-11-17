'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';
import { ThemeToggle } from './ThemeToggle';
import { SearchPalette } from './SearchPalette';

const LINKS = [
  { href: '/icons/', label: 'Icons' },
  { href: '/docs/', label: 'Docs' },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="container">
        <div className="nav-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Link href="/" className="brand" aria-label={`${SITE.name}, home`}>
              <Tile icon={icon('flower')} size={30} />
              <span>Glazed</span>
            </Link>
            <nav className="nav-links" aria-label="Main">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} aria-current={path.startsWith(l.href.slice(0, -1)) ? 'page' : undefined}>{l.label}</Link>
              ))}
              <a className="wide" href={SITE.repo} target="_blank" rel="noopener">GitHub</a>
            </nav>
          </div>
          <div className="nav-right">
            <SearchPalette />
            <ThemeToggle />
            <Link className="btn btn-primary btn-sm nav-cta" href="/docs/">
              Get started
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
