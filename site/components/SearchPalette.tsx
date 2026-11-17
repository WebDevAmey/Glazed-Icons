'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICONS, search } from '@/lib/icons';
import { Tile } from './Tile';

/** ⌘K / Ctrl K quick search. Arrow keys move, Enter opens the icon's page. */
export function SearchPalette() {
  const router = useRouter();
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [mac, setMac] = useState(true);

  const results = useMemo(() => search(ICONS, q).slice(0, 8), [q]);

  const open = () => {
    setQ(''); setSel(0);
    dlg.current?.showModal();
    requestAnimationFrame(() => input.current?.focus());
  };

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.current?.open ? dlg.current.close() : open(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const go = (name: string) => { dlg.current?.close(); router.push(`/icons/${name}/`); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[sel]) go(results[sel].name);
      else { dlg.current?.close(); router.push(`/icons/?q=${encodeURIComponent(q)}`); }
    }
  };

  return (
    <>
      <button type="button" className="search-pill" onClick={open} aria-label="Search icons" aria-keyshortcuts={mac ? 'Meta+K' : 'Control+K'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span>Search icons…</span>
        <kbd aria-hidden="true">{mac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
      <dialog ref={dlg} className="palette" aria-label="Search icons" onClick={(e) => { if (e.target === dlg.current) dlg.current.close(); }}>
        <div className="palette-in">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Search by name, tag or colour"
            aria-label="Search icons"
            aria-controls="palette-list"
            aria-activedescendant={results[sel] ? `pal-${results[sel].name}` : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd aria-hidden="true">Esc</kbd>
        </div>
        {results.length ? (
          <ul id="palette-list" role="listbox" aria-label="Matching icons">
            {results.map((ic, i) => (
              <li key={ic.name} role="presentation">
                <a
                  id={`pal-${ic.name}`}
                  role="option"
                  aria-selected={i === sel}
                  href={`/icons/${ic.name}/`}
                  onMouseMove={() => setSel(i)}
                  onClick={(e) => { e.preventDefault(); go(ic.name); }}
                >
                  <Tile icon={ic} size={32} />
                  <strong>{ic.name}</strong>
                  <small>{ic.category}</small>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="none">No icon matches “{q}”. Press Enter to search the full set.</p>
        )}
        <div className="palette-foot"><span>↑ ↓ to move, Enter to open</span><span>{ICONS.length} icons</span></div>
      </dialog>
    </>
  );
}
