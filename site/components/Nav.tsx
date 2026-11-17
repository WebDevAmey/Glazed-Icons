'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '/icons/', label: 'Icons' },
  { href: '/docs/', label: 'Docs' },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="container nav-in">
        <Link href="/" className="brand" aria-label={`${SITE.name}, home`}>
          <Tile icon={icon('sparkles')} hue="violet" size={30} />
          <span>{SITE.name}</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path.startsWith(l.href.slice(0, -1)) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
          <a className="wide" href={SITE.repo} target="_blank" rel="noopener">GitHub</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
