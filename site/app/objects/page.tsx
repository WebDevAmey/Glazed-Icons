import type { Metadata } from 'next';
import { Suspense } from 'react';
import { GLASS } from '@/lib/illustrations';
import { ObjectBrowser } from '@/components/ObjectBrowser';

export const metadata: Metadata = {
  title: GLASS.title,
  description: `${GLASS.description} Search them, preview each one and download it as lossless PNG or WebP. Free under MIT.`,
  alternates: { canonical: '/objects/' },
};

export default function ObjectsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <p className="abstract-kicker" style={{ color: 'var(--muted)' }}>Illustrations, {GLASS.count} objects</p>
        <h1 className="display">{GLASS.title}</h1>
        <p className="lede">{GLASS.description} Open any object to preview it and download the original file.</p>
      </div>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <ObjectBrowser collection={GLASS} />
      </Suspense>
    </div>
  );
}
