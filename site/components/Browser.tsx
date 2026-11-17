'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES, ICONS, RADII, icon, label, search, toSvg, type Hue, type Radius } from '@/lib/icons';
import { downloadBlob, toast } from '@/lib/client';
import { Tile } from './Tile';
import { HuePicker, RadiusPicker } from './Controls';
import { Slider } from './Slider';

const ALL = 'All icons';

/** Ruler-style list: a tick beside each label, spacer ticks between, ticks grow toward the pointer. */
function Ruler({ items, value, onChange, counts }: { items: string[]; value: string; onChange: (c: string) => void; counts: Record<string, number> }) {
  const list = useRef<HTMLDivElement>(null);
  const grow = (y: number | null) => {
    list.current?.querySelectorAll<HTMLElement>('[data-tick]').forEach((t) => {
      if (y === null) return t.style.removeProperty('--grow');
      const r = t.getBoundingClientRect();
      const d = Math.abs(y - (r.top + r.height / 2));
      t.style.setProperty('--grow', String(Math.max(0, 1 - d / 64)));
    });
  };
  return (
    <div className="ruler" ref={list} onPointerMove={(e) => grow(e.clientY)} onPointerLeave={() => grow(null)} role="radiogroup" aria-label="Category">
      {items.map((c, i) => (
        <div key={c} className="ruler-group">
          {i > 0 && <><span className="tick" data-tick aria-hidden="true" /><span className="tick" data-tick aria-hidden="true" /></>}
          <button type="button" role="radio" aria-checked={value === c} className="ruler-item" onClick={() => onChange(c)}>
            <span className="tick" data-tick aria-hidden="true" />
            <span className="ruler-label">{c}</span>
            <span className="ruler-count">{counts[c]}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export function Browser() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [cat, setCat] = useState(() => {
    const c = params.get('category');
    return c && CATEGORIES.includes(c) ? c : ALL;
  });
  const [hue, setHue] = useState<Hue | null>(null);
  const [radius, setRadius] = useState<Radius>('soft');
  const [size, setSize] = useState(48);
  const [open, setOpen] = useState(true);
  const input = useRef<HTMLInputElement>(null);

  // Remember the look between visits.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('glazed-browser') || '{}');
      if (s.hue !== undefined) setHue(s.hue);
      if (s.radius) setRadius(s.radius);
      if (s.size) setSize(s.size);
      if (s.open === false && innerWidth >= 1024) setOpen(false);
      if (innerWidth < 1024) setOpen(false);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('glazed-browser', JSON.stringify({ hue, radius, size, open })); } catch {}
  }, [hue, radius, size, open]);

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    const u = new URL(location.href);
    q ? u.searchParams.set('q', q) : u.searchParams.delete('q');
    cat !== ALL ? u.searchParams.set('category', cat) : u.searchParams.delete('category');
    history.replaceState(null, '', u);
  }, [q, cat]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const list = useMemo(() => search(ICONS.filter((i) => cat === ALL || i.category === cat), q), [q, cat]);
  const counts = useMemo(() => ({ [ALL]: ICONS.length, ...Object.fromEntries(CATEGORIES.map((c) => [c, ICONS.filter((i) => i.category === c).length])) }), []);

  const zip = async () => {
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    list.forEach((ic) => z.file(`${ic.name}.svg`, toSvg(ic, { size: 64, hue: hue ?? ic.hue, radius })));
    z.file('LICENSE.txt', 'Glazed Icons, MIT License. Glyphs from Tabler Icons (MIT), Copyright (c) 2020-2024 Pawel Kuna.\n');
    downloadBlob('glazed-icons.zip', await z.generateAsync({ type: 'blob' }));
    toast(`Downloaded ${list.length} SVGs`, 'download');
  };

  const pick = (c: string) => {
    setCat(c);
    if (innerWidth < 1024) setOpen(false);
  };

  return (
    <div className="explorer" data-open={open}>
      <aside className="sidebar" aria-label="Filters">
        <button type="button" className="sidebar-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="sidebar-panel" aria-label={open ? 'Hide filters' : 'Show filters'}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><path d="M9.5 4.5v15" /></svg>
          <span className="sidebar-toggle-label">Filters</span>
        </button>
        <div className="sidebar-panel" id="sidebar-panel" inert={!open}>
          <div className="sidebar-scroll">
            <p className="sidebar-title">Categories</p>
            <Ruler items={[ALL, ...CATEGORIES]} value={cat} onChange={pick} counts={counts} />
            <div className="sidebar-style">
              <p className="sidebar-title">Style</p>
              <div>
                <span className="control-label">Colour</span>
                <HuePicker value={hue} onChange={setHue} />
              </div>
              <div>
                <span className="control-label">Corners</span>
                <RadiusPicker value={radius} onChange={setRadius} />
              </div>
              <Slider label="Size" value={size} min={32} max={80} step={4} onChange={setSize} format={(v) => `${v}px`} />
            </div>
          </div>
        </div>
      </aside>

      <div className="explorer-main">
        <div className="explorer-bar">
          <label className="search">
            <span className="visually-hidden">Search icons</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: chart, secure, pink…" autoComplete="off" spellCheck={false} />
            <kbd aria-hidden="true">/</kbd>
          </label>
        </div>
        <div className="grid-meta">
          <span aria-live="polite">{cat === ALL ? '' : `${cat}: `}{list.length} {list.length === 1 ? 'icon' : 'icons'}</span>
          {list.length > 0 && <button type="button" className="text-btn" onClick={zip}>Download {list.length === ICONS.length ? 'all' : 'these'} as ZIP</button>}
        </div>
        <div key={`${cat}|${q}`} className="icon-grid grid-in" style={{ ['--ts' as string]: `${size}px`, ['--cell' as string]: `${Math.max(104, size + 56)}px` }}>
          {list.map((ic, i) => (
            <Link key={ic.name} href={`/icons/${ic.name}/`} className="cell" aria-label={`${label(ic.name)} icon`} style={{ ['--i' as string]: Math.min(i, 24) }}>
              <Tile icon={ic} hue={hue ?? undefined} radius={RADII[radius]} size={size} />
              <span aria-hidden="true">{ic.name}</span>
            </Link>
          ))}
          {list.length === 0 && (
            <div className="empty">
              <Tile icon={icon('search')} hue="ink" size={48} />
              <p style={{ margin: 0 }}>No icon matches “{q}”{cat !== ALL ? ` in ${cat}` : ''}.</p>
              <button type="button" className="btn btn-quiet" onClick={() => { setQ(''); setCat(ALL); input.current?.focus(); }}>Clear search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
