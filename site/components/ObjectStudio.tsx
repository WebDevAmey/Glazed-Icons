'use client';

import { useEffect, useState } from 'react';
import { ILLUSTRATION_SNIPPET_LABELS, snippetsFor, src, type Illustration, type IllustrationSnippet } from '@/lib/illustrations';
import { copyText, downloadBlob, toast } from '@/lib/client';
import { Seg } from './Seg';

type Ground = 'light' | 'dark';
type Scale = '1' | '2';

/** Detail view: the illustration on a stage, its code, and the original files. */
export function ObjectStudio({ it }: { it: Illustration }) {
  const [ground, setGround] = useState<Ground>('light');
  const [scale, setScale] = useState<Scale>('2');
  const [tab, setTab] = useState<IllustrationSnippet>('html');
  useEffect(() => { if (document.documentElement.dataset.theme === 'dark') setGround('dark'); }, []);
  const code = snippetsFor(it)[tab];

  const save = async (kind: 'png' | 'webp') => {
    const file = kind === 'png' ? it.png : it.webp;
    downloadBlob(`${it.name}.${kind}`, await (await fetch(src(file))).blob());
    toast(`${kind.toUpperCase()} downloaded`);
  };

  return (
    <div className="studio">
      <div className="studio-stage" data-ground={ground}>
        <div className="studio-ground" aria-hidden="true" />
        <div className="stage-controls">
          <Seg label="Preview background" className="stage-seg" value={ground} onChange={setGround} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
        </div>
        <picture className="obj-stage-img" style={{ width: it.width * +scale, aspectRatio: `${it.width} / ${it.height}` }}>
          <source srcSet={src(it.webp)} type="image/webp" />
          <img src={src(it.png)} width={it.width} height={it.height} alt={`${it.title}, a glass and resin illustration`} />
        </picture>
        <div className="studio-size-bar">
          <Seg label="Preview size" className="stage-seg" value={scale} onChange={setScale} options={[{ value: '1', label: '1×' }, { value: '2', label: '2×' }]} />
          <span className="studio-size">{it.width} × {it.height} px</span>
        </div>
      </div>

      <div className="studio-side">
        <header>
          <h1 className="display">{it.title}</h1>
          <p className="body" style={{ marginTop: 10 }}>
            From the Digital Objects collection, in glass and resin. Shipped exactly as supplied, at its native {it.width} × {it.height} px.
          </p>
          <div className="meta" style={{ marginTop: 14 }}>
            <span>Glass &amp; Resin</span>
            {it.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        </header>

        <div className="code-card">
          <div className="code-bar">
            <Seg kind="tab" label="Code format" value={tab} onChange={setTab} options={(Object.keys(ILLUSTRATION_SNIPPET_LABELS) as IllustrationSnippet[]).map((k) => ({ value: k, label: ILLUSTRATION_SNIPPET_LABELS[k] }))} />
            <button type="button" className="code-copy" onClick={() => copyText(code, `${ILLUSTRATION_SNIPPET_LABELS[tab]} copied`)}>Copy</button>
          </div>
          <pre role="tabpanel" tabIndex={0} aria-label={`${ILLUSTRATION_SNIPPET_LABELS[tab]} code`}><code>{code}</code></pre>
        </div>

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => save('png')}>Download PNG</button>
          <button type="button" className="btn btn-quiet" onClick={() => save('webp')}>Download WebP</button>
          <button type="button" className="btn btn-quiet" onClick={() => copyText(`${location.origin}${src(it.webp)}`, 'Link copied')}>Copy link</button>
        </div>
        <p className="small" style={{ margin: 0 }}>Both files are lossless and pixel-identical to the original. The 2× preview is enlarged on screen only.</p>
      </div>
    </div>
  );
}
