'use client';

import { useState } from 'react';
import { snippets, SNIPPET_LABELS, type Hue, type Icon, type Radius, type SnippetKind } from '@/lib/icons';
import { copyText } from '@/lib/client';
import { Tile } from './Tile';

export function CodeTabs({ icon, hue, radius = 'soft', size = 40, showOutput = true }: {
  icon: Icon; hue?: Hue; radius?: Radius; size?: number; showOutput?: boolean;
}) {
  const [tab, setTab] = useState<SnippetKind>('react');
  const h = hue ?? icon.hue;
  const code = snippets(icon, h, radius, size)[tab];
  return (
    <div className="code-card">
      <div className="code-bar">
        <div className="seg" role="tablist" aria-label="Code format">
          {(Object.keys(SNIPPET_LABELS) as SnippetKind[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{SNIPPET_LABELS[k]}</button>
          ))}
        </div>
        <button type="button" className="code-copy" onClick={() => copyText(code, `${SNIPPET_LABELS[tab]} copied`, icon.name, h)}>Copy</button>
      </div>
      <pre role="tabpanel" tabIndex={0} aria-label={`${SNIPPET_LABELS[tab]} code`}><code>{code}</code></pre>
      {showOutput && (
        <div className="code-out">
          <Tile icon={icon} hue={h} radius={radius} size={40} />
          <span>What it renders</span>
        </div>
      )}
    </div>
  );
}
