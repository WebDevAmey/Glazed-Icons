'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';
import { SearchPalette } from './SearchPalette';

const LINKS = [
  { href: '/icons/', label: 'Icons', match: '/icons' },
  { href: '/docs/', label: 'Docs', match: '/docs' },
  { href: '/#compare', label: 'Compare', wide: true },
  { href: SITE.repo, label: 'GitHub', external: true, wide: true },
];

/**
 * A frosted bar: the mark on the left, the links in one group where a soft
 * highlight glides to whichever link the pointer is on and rests on the current
 * page, then search and one solid action on the right.
 */
export function Nav() {
  const path = usePathname();
  const group = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });
  const current = LINKS.findIndex((l) => l.match && path.startsWith(l.match));

  useLayoutEffect(() => {
    const i = hover ?? current;
    const el = i >= 0 ? group.current?.querySelectorAll<HTMLElement>('[data-link]')[i] : null;
    if (el && el.offsetParent) setPill({ x: el.offsetLeft, w: el.offsetWidth, on: true });
    else setPill((p) => ({ ...p, on: false }));
  }, [hover, current]);

  return (
    <header className="nav">
      <div className="nav-bar">
        <Link href="/" className="nav-brand" aria-label={`${SITE.name} homepage`}>
          <Tile icon={icon('flower')} size={28} />
          <span>Glazed</span>
        </Link>

        <nav aria-label="Primary">
          <div className="nav-group" ref={group} onPointerLeave={() => setHover(null)}>
            <span className="nav-glide" aria-hidden="true" data-on={pill.on} style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
            {LINKS.map((l, i) => {
              const cls = `nav-link${l.wide ? ' wide' : ''}`;
              const props = { 'data-link': true, className: cls, onPointerEnter: () => setHover(i), onFocus: () => setHover(i), onBlur: () => setHover(null) };
              return l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noopener" {...props}>{l.label}</a>
              ) : (
                <Link key={l.label} href={l.href} aria-current={i === current ? 'page' : undefined} {...props}>{l.label}</Link>
              );
            })}
          </div>
        </nav>

        <div className="nav-end">
          <SearchPalette />
          <Link href="/docs/" className="nav-cta">Get started</Link>
        </div>
      </div>
    </header>
  );
}
