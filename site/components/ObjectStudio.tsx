'use client';

import { useEffect, useState } from 'react';
import { render3D, SIZES_3D, SNIPPET_3D_LABELS, snippetsFor, src, type Icon3D, type Size3D, type Snippet3D } from '@/lib/illustrations';
import { copyText, downloadBlob, toast } from '@/lib/client';
import { Seg } from './Seg';

type Ground = 'light' | 'dark' | 'clear';

/** Detail view: the 3D icon on a choice of grounds and sizes, its code, and downloads. */
export function ObjectStudio({ it }: { it: Icon3D }) {
  const [ground, setGround] = useState<Ground>('light');
  const [size, setSize] = useState<Size3D>(256);
  const [tab, setTab] = useState<Snippet3D>('html');
  useEffect(() => { if (document.documentElement.dataset.theme === 'dark') setGround('dark'); }, []);
  const code = snippetsFor(it, size)[tab];

  const save = async (kind: 'png' | 'webp') => {
    const name = `${it.name}-${size}.${kind}`;
    const blob = size === it.width
      ? await (await fetch(src(kind === 'png' ? it.png : it.webp))).blob()
      : await render3D(it, size, kind === 'png' ? 'image/png' : 'image/webp');
    downloadBlob(name, blob);
    toast(`${size} px ${kind.toUpperCase()} downloaded`);
  };

  return (
    <div className="studio">
      <div className="studio-stage" data-ground={ground}>
        <div className="studio-ground" aria-hidden="true" />
        <div className="stage-controls">
          <Seg label="Preview background" className="stage-seg" value={ground} onChange={setGround} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'clear', label: 'Clear' }]} />
        </div>
        <picture className="obj-stage-img" style={{ width: size }}>
          <source srcSet={src(it.webp)} type="image/webp" />
          <img src={src(it.png)} width={it.width} height={it.height} alt={`${it.title}, a 3D glass icon`} />
        </picture>
        <div className="studio-size-bar">
          <Seg label="Icon size" className="stage-seg" value={String(size)} onChange={(v) => setSize(+v as Size3D)} options={SIZES_3D.map((s) => ({ value: String(s), label: String(s) }))} />
        </div>
      </div>

      <div className="studio-side">
        <header>
          <h1 className="display">{it.title}</h1>
          <p className="body" style={{ marginTop: 10 }}>
            A 3D icon in glass and resin on a transparent background. Its shadow and glow are kept as soft alpha, so it works on light and dark surfaces.
          </p>
          <div className="meta" style={{ marginTop: 14 }}>
            <span>Glass &amp; Resin</span>
            {it.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        </header>

        <div className="code-card">
          <div className="code-bar">
            <Seg kind="tab" label="Code format" value={tab} onChange={setTab} options={(Object.keys(SNIPPET_3D_LABELS) as Snippet3D[]).map((k) => ({ value: k, label: SNIPPET_3D_LABELS[k] }))} />
            <button type="button" className="code-copy" onClick={() => copyText(code, `${SNIPPET_3D_LABELS[tab]} copied`)}>Copy</button>
          </div>
          <pre role="tabpanel" tabIndex={0} aria-label={`${SNIPPET_3D_LABELS[tab]} code`}><code>{code}</code></pre>
        </div>

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => save('png')}>Download PNG</button>
          <button type="button" className="btn btn-quiet" onClick={() => save('webp')}>Download WebP</button>
          <button type="button" className="btn btn-quiet" onClick={() => copyText(`${location.origin}${src(it.webp)}`, 'Link copied')}>Copy link</button>
        </div>
        <p className="small" style={{ margin: 0 }}>Downloads are {size} × {size} px with a transparent background. The 512 px files are the lossless masters.</p>
      </div>
    </div>
  );
}
