'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchIllustrations, src, type IllustrationCollection } from '@/lib/illustrations';
import { downloadBlob, toast } from '@/lib/client';
import { ObjectCard } from './ObjectCard';

export function ObjectBrowser({ collection }: { collection: IllustrationCollection }) {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const input = useRef<HTMLInputElement>(null);
  const list = useMemo(() => searchIllustrations(collection.items, q), [collection.items, q]);

  useEffect(() => {
    const u = new URL(location.href);
    q ? u.searchParams.set('q', q) : u.searchParams.delete('q');
    history.replaceState(null, '', u);
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/input|textarea|select/i.test(t.tagName)) { e.preventDefault(); input.current?.focus(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const zip = async () => {
    const { default: JSZip } = await import('jszip');
    const z = new JSZip();
    await Promise.all(list.map(async (it) => z.file(`${it.name}.png`, await (await fetch(src(it.png))).blob())));
    downloadBlob('glass-and-resin.zip', await z.generateAsync({ type: 'blob' }));
    toast(`Downloaded ${list.length} PNGs`, 'download');
  };

  return (
    <div className="obj-browser">
      <div className="explorer-bar">
        <label className="search">
          <span className="visually-hidden">Search illustrations</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: crystal, orbit, time…" autoComplete="off" spellCheck={false} />
          <kbd aria-hidden="true">/</kbd>
        </label>
      </div>
      <div className="grid-meta">
        <span aria-live="polite">{list.length} {list.length === 1 ? 'illustration' : 'illustrations'}</span>
        {list.length > 0 && <button type="button" className="text-btn" onClick={zip}>Download {list.length === collection.items.length ? 'all' : 'these'} as ZIP</button>}
      </div>
      <div key={q} className="obj-grid grid-in">
        {list.map((it, i) => <div key={it.name} className="cell-wrap" style={{ ['--i' as string]: Math.min(i, 24) }}><ObjectCard it={it} priority={i < 10} /></div>)}
        {list.length === 0 && (
          <div className="empty">
            <p style={{ margin: 0 }}>No illustration matches “{q}”.</p>
            <button type="button" className="btn btn-quiet" onClick={() => { setQ(''); input.current?.focus(); }}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}
