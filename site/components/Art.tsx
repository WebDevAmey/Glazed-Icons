/** Painted illustrations, served as sized WebP from /public/art. */
export const ART = {
  meadow: { widths: [960, 1440, 2048], ratio: 768 / 2048, alt: 'A traveller in a red cloak beneath a blossoming tree, looking out at ruins and a full moon' },
  cabin: { widths: [510], ratio: 191 / 510, alt: 'A lit cabin under a blossom tree on a cliff at night, beneath a crescent moon' },
  falls: { widths: [381], ratio: 191 / 381, alt: 'A waterfall framed by cherry blossom' },
  pagoda: { widths: [534], ratio: 191 / 534, alt: 'A pagoda on the shore beside breaking waves' },
  twilight: { widths: [1177], ratio: 140 / 1177, alt: '' },
  clouds: { widths: [802], ratio: 302 / 802, alt: 'Pink and orange clouds with a pale moon' },
  arches: { widths: [552], ratio: 191 / 552, alt: 'Stone arches overgrown with flowers' },
} as const;
export type ArtName = keyof typeof ART;

export function ArtImage({ name, sizes = '100vw', priority = false, alt, style }: {
  name: ArtName; sizes?: string; priority?: boolean; alt?: string; style?: React.CSSProperties;
}) {
  const a = ART[name];
  const max = a.widths[a.widths.length - 1];
  return (
    <img
      src={`/art/${name}-${max}.webp`}
      srcSet={a.widths.map((w) => `/art/${name}-${w}.webp ${w}w`).join(', ')}
      sizes={sizes}
      width={max}
      height={Math.round(max * a.ratio)}
      alt={alt ?? a.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      style={style}
    />
  );
}
