import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GLASS } from '@/lib/illustrations';
import { ObjectBrowser } from '@/components/ObjectBrowser';

export const metadata: Metadata = {
  title: GLASS.title,
  description: `${GLASS.description} Search them, preview each one on light or dark and download transparent PNG or WebP. Free under MIT.`,
  alternates: { canonical: '/3d/' },
};

export default function Icons3DPage() {
  return (
    <div className="container">
      <div className="page-head">
        <p className="abstract-kicker" style={{ color: 'var(--muted)' }}>3D icons, {GLASS.count} in the set</p>
        <h1 className="display">{GLASS.title}</h1>
        <p className="lede">{GLASS.description} Open any icon to preview it at size and download it.</p>
      </div>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <ObjectBrowser collection={GLASS} />
      </Suspense>
    </div>
  );
}
