import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/icons';
import { GLASS, getIcon3D, src } from '@/lib/illustrations';
import { ObjectStudio } from '@/components/ObjectStudio';
import { ObjectCard } from '@/components/ObjectCard';

type Props = { params: Promise<{ name: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return GLASS.items.map((i) => ({ name: i.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const it = getIcon3D((await params).name);
  if (!it) return {};
  const title = `${it.title} 3D icon`;
  const description = `Free ${it.title.toLowerCase()} 3D icon in glass and resin on a transparent background. Download PNG or WebP from 64 to 512 px. Tags: ${it.tags.join(', ')}.`;
  return {
    title,
    description,
    alternates: { canonical: `/3d/${it.name}/` },
    openGraph: { title: `${title} | ${SITE.name}`, description, url: `/3d/${it.name}/`, images: [{ url: src(it.png), width: it.width, height: it.height }] },
  };
}

export default async function ObjectPage({ params }: Props) {
  const it = getIcon3D((await params).name);
  if (!it) notFound();
  const i = GLASS.items.findIndex((x) => x.name === it.name);
  const more = [...GLASS.items.slice(i + 1), ...GLASS.items.slice(0, i)].slice(0, 10);
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: GLASS.title, item: `${SITE.url}/3d/` },
      { '@type': 'ListItem', position: 2, name: it.title, item: `${SITE.url}/3d/${it.name}/` },
    ],
  };
  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/3d/">{GLASS.title}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{it.title}</span>
      </nav>
      <ObjectStudio it={it} />
      <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="more-title">
        <div className="section-head" style={{ marginBottom: 20 }}>
          <h2 id="more-title" className="h2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>More 3D icons</h2>
        </div>
        <div className="obj-grid">
          {more.map((m) => <ObjectCard key={m.name} it={m} />)}
        </div>
      </section>
    </div>
  );
}
