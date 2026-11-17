'use client';

import { copyText } from '@/lib/client';
import { SITE } from '@/lib/icons';

export function InstallButton() {
  const cmd = `npm i ${SITE.pkg}`;
  return (
    <button type="button" className="install" onClick={() => copyText(cmd, 'Install command copied', 'package')} aria-label={`Copy install command: ${cmd}`}>
      <span><span className="prompt">$ </span>{cmd}</span>
      <span className="copy-dot" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
      </span>
    </button>
  );
}
