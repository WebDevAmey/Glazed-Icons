import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HUE_NAMES, ICONS, SITE, component, getIcon, label } from '@/lib/icons';
import { IconStudio } from '@/components/IconStudio';
import { Tile } from '@/components/Tile';

type Props = { params: Promise<{ name: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return ICONS.map((i) => ({ name: i.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ic = getIcon((await params).name);
  if (!ic) return {};
  const title = `${label(ic.name)[0].toUpperCase()}${label(ic.name).slice(1)} icon`;
  const description = `Free glossy ${label(ic.name)} icon in ${ic.hue}. Copy it as SVG, React (<${component(ic.name)} />) or Tailwind, recolour it in ${HUE_NAMES.length} hues, or download a PNG. Tags: ${ic.tags.join(', ')}.`;
  return {
    title,
    description,
    alternates: { canonical: `/icons/${ic.name}/` },
    openGraph: { title: `${title} | ${SITE.name}`, description, url: `/icons/${ic.name}/` },
  };
}

export default async function IconPage({ params }: Props) {
  const ic = getIcon((await params).name);
  if (!ic) notFound();
  const related = ICONS.filter((i) => i.category === ic.category && i.name !== ic.name).slice(0, 12);
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Icons', item: `${SITE.url}/icons/` },
      { '@type': 'ListItem', position: 2, name: ic.name, item: `${SITE.url}/icons/${ic.name}/` },
    ],
  };

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/icons/">Icons</Link><span aria-hidden="true">/</span>
        <Link href={`/icons/?category=${encodeURIComponent(ic.category)}`}>{ic.category}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{ic.name}</span>
      </nav>

      <IconStudio icon={ic} />

      <section className="section" style={{ paddingBottom: 0 }} aria-labelledby="rel-title">
        <div className="section-head" style={{ marginBottom: 20 }}>
          <h2 id="rel-title" className="h2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>More in {ic.category}</h2>
        </div>
        <div className="panel related">
          {related.map((r) => (
            <Link key={r.name} href={`/icons/${r.name}/`} className="cell" aria-label={`${label(r.name)} icon`}>
              <Tile icon={r} size={44} />
              <span aria-hidden="true">{r.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
