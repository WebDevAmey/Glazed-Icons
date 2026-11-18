import type { MetadataRoute } from 'next';
import { ICONS, SITE } from '@/lib/icons';
import { GLASS } from '@/lib/illustrations';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/icons/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/docs/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/3d/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...GLASS.items.map((i) => ({ url: `${SITE.url}/3d/${i.name}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...ICONS.map((i) => ({ url: `${SITE.url}/icons/${i.name}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
