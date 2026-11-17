'use client';

import { useState } from 'react';
import { snippets, SNIPPET_LABELS, type Icon, type SnippetKind, type TileOptions } from '@/lib/icons';
import { copyText } from '@/lib/client';
import { Tile } from './Tile';
import { Seg } from './Seg';

export function CodeTabs({ icon, opts = {}, size = 40, showOutput = true }: {
  icon: Icon; opts?: TileOptions; size?: number; showOutput?: boolean;
}) {
  const [tab, setTab] = useState<SnippetKind>('react');
  const code = snippets(icon, opts, size)[tab];
  return (
    <div className="code-card">
      <div className="code-bar">
        <Seg kind="tab" label="Code format" value={tab} onChange={setTab} options={(Object.keys(SNIPPET_LABELS) as SnippetKind[]).map((k) => ({ value: k, label: SNIPPET_LABELS[k] }))} />
        <button type="button" className="code-copy" onClick={() => copyText(code, `${SNIPPET_LABELS[tab]} copied`, icon.name, opts.hue)}>Copy</button>
      </div>
      <pre role="tabpanel" tabIndex={0} aria-label={`${SNIPPET_LABELS[tab]} code`}><code>{code}</code></pre>
      {showOutput && (
        <div className="code-out">
          <Tile icon={icon} {...opts} size={40} />
          <span>What it renders</span>
        </div>
      )}
    </div>
  );
}
