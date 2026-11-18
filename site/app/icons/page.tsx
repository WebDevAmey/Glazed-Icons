import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Browser } from '@/components/Browser';
import { SITE } from '@/lib/icons';

export const metadata: Metadata = {
  title: `All ${SITE.count} icons`,
  description: `Search, recolour and copy all ${SITE.count} Glazed icons as SVG, React or Tailwind. Download single icons or the whole set as a ZIP.`,
  alternates: { canonical: '/icons/' },
};

export default function IconsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1 className="display">All {SITE.count} icons</h1>
        <p className="lede">Search by name, tag or colour, or filter by category. Open any icon to customise it.</p>
      </div>
      <Suspense fallback={<div style={{ minHeight: 600 }} />}>
        <Browser />
      </Suspense>
    </div>
  );
}
