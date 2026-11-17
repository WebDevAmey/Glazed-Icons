import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Browser } from '@/components/Browser';
import { SITE } from '@/lib/icons';
import { ArtImage } from '@/components/Art';

export const metadata: Metadata = {
  title: `All ${SITE.count} icons`,
  description: `Search, recolour and copy all ${SITE.count} Glazed icons as SVG, React or Tailwind. Download single icons or the whole set as a ZIP.`,
  alternates: { canonical: '/icons/' },
};

export default function IconsPage() {
  return (
    <div className="container">
      <div className="art page-banner">
        <ArtImage name="meadow" sizes="(max-width: 1240px) 100vw, 1240px" priority style={{ objectPosition: '20% 45%' }} />
        <h1 className="display">All {SITE.count} icons</h1>
        <p className="lede">Search by name, tag, category or colour. Set a colour and corners, then open any icon to copy or download it.</p>
      </div>
      <Suspense fallback={<div className="panel" style={{ minHeight: 600 }} />}>
        <Browser />
      </Suspense>
    </div>
  );
}
