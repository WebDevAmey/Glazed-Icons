'use client';

import { useState } from 'react';
import { icon } from '@/lib/icons';

const LAYERS = [
  { id: 'glyph', name: 'Glyph', text: 'White, half the tile, lifted by a short soft shadow.', code: 'drop-shadow 0 1px black/35', sw: 'linear-gradient(180deg,#fff,#e8e8ee)' },
  { id: 'hi', name: 'Highlight', text: 'A 1px line of white at 20%, two pixels in. This is the glaze.', code: 'ring-1 ring-white/20', sw: 'linear-gradient(180deg,#bcd3ff,#8fb2ff)' },
  { id: 'edge', name: 'Edge band', text: 'Two pixels of the 500 shade, so the tile holds its shape on any ground.', code: 'ring-offset-2 · 500', sw: '#3b82f6' },
  { id: 'grad', name: 'Gradient', text: 'The 400 shade at the top falling to 600, as if lit from above.', code: 'from-400 to-600', sw: 'linear-gradient(180deg,#60a5fa,#2563eb)' },
] as const;

export function Anatomy() {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const rk = icon('rocket');
  return (
    <div className="panel anat">
      <div className="anat-stage" data-open={open}>
        <div className="anat-stack" aria-hidden="true">
          <div className="layer l-grad" data-hot={hot === 'grad'} />
          <div className="layer l-edge" data-hot={hot === 'edge'} />
          <div className="layer l-hi" data-hot={hot === 'hi'} />
          <div className="layer l-glyph" data-hot={hot === 'glyph'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: rk.body }} />
          </div>
        </div>
        <button type="button" className="btn btn-quiet anat-toggle" aria-pressed={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Put it back together' : 'Take it apart'}
        </button>
      </div>
      <ul className="anat-list" style={{ listStyle: 'none', margin: 0 }}>
        {LAYERS.map((l) => (
          <li key={l.id} className="anat-row" data-hot={hot === l.id} onPointerEnter={() => { setHot(l.id); setOpen(true); }} onPointerLeave={() => setHot(null)}>
            <span className="chip-swatch" style={{ background: l.sw, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / .08)' }} aria-hidden="true" />
            <div>
              <h3 className="h3">{l.name}</h3>
              <p>{l.text}</p>
              <code>{l.code}</code>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
