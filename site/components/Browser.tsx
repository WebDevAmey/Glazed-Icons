'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES, ICONS, icon, label, search, toSvg, type Hue, type Radius } from '@/lib/icons';
import { downloadBlob, toast } from '@/lib/client';
import { Tile } from './Tile';
import { HuePicker, RadiusPicker } from './Controls';

export function Browser() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [cat, setCat] = useState(() => {
    const c = params.get('category');
    return c && CATEGORIES.includes(c) ? c : 'All';
  });
  const [hue, setHue] = useState<Hue | null>(null);
  const [radius, setRadius] = useState<Radius>('soft');
  const [size, setSize] = useState(48);
  const input = useRef<HTMLInputElement>(null);

  // Remember the look between visits.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('glazed-browser') || '{}');
      if (s.hue !== undefined) setHue(s.hue);
      if (s.radius) setRadius(s.radius);
      if (s.size) setSize(s.size);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('glazed-browser', JSON.stringify({ hue, radius, size })); } catch {}
  }, [hue, radius, size]);

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    const u = new URL(location.href);
    q ? u.searchParams.set('q', q) : u.searchParams.delete('q');
    cat !== 'All' ? u.searchParams.set('category', cat) : u.searchParams.delete('category');
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

  const list = useMemo(() => search(ICONS.filter((i) => cat === 'All' || i.category === cat), q), [q, cat]);
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c, ICONS.filter((i) => i.category === c).length])), []);

  const zip = async () => {
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    list.forEach((ic) => z.file(`${ic.name}.svg`, toSvg(ic, { size: 64, hue: hue ?? ic.hue, radius })));
    z.file('LICENSE.txt', 'Glazed Icons, MIT License. Glyphs from Tabler Icons (MIT), Copyright (c) 2020-2024 Pawel Kuna.\n');
    downloadBlob('glazed-icons.zip', await z.generateAsync({ type: 'blob' }));
    toast(`Downloaded ${list.length} SVGs`, 'download');
  };

  const cell = Math.max(104, size + 56);

  return (
    <div className="panel browser">
      <div className="toolbar">
        <div className="toolbar-row">
          <label className="search">
            <span className="visually-hidden">Search icons</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: chart, secure, pink…" autoComplete="off" spellCheck={false} />
            <kbd aria-hidden="true">/</kbd>
          </label>
          <RadiusPicker value={radius} onChange={setRadius} />
          <label className="size-ctl">
            Size
            <input type="range" min={32} max={80} step={8} value={size} onChange={(e) => setSize(+e.target.value)} />
            <output>{size}</output>
          </label>
        </div>
        <HuePicker value={hue} onChange={setHue} />
        <div className="chips" role="group" aria-label="Category">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}<span className="n">{c === 'All' ? ICONS.length : counts[c]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-meta">
        <span aria-live="polite">{list.length} {list.length === 1 ? 'icon' : 'icons'}</span>
        {list.length > 0 && <button type="button" className="text-btn" onClick={zip}>Download {list.length === ICONS.length ? 'all' : 'these'} as ZIP</button>}
      </div>

      <div className="icon-grid" style={{ ['--ts' as string]: `${size}px`, ['--cell' as string]: `${cell}px` }}>
        {list.map((ic) => (
          <Link key={ic.name} href={`/icons/${ic.name}/`} className="cell" aria-label={`${label(ic.name)} icon`}>
            <Tile icon={ic} hue={hue ?? undefined} radius={radius} size={size} />
            <span aria-hidden="true">{ic.name}</span>
          </Link>
        ))}
        {list.length === 0 && (
          <div className="empty">
            <Tile icon={icon('search')} hue="ink" size={48} />
            <p style={{ margin: 0 }}>No icon matches “{q}”{cat !== 'All' ? ` in ${cat}` : ''}.</p>
            <button type="button" className="btn btn-quiet" onClick={() => { setQ(''); setCat('All'); input.current?.focus(); }}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}
