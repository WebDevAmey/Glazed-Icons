/** Rendered dreamscapes, served as sized WebP from /public/art. */
export const ART = {
  fuji: { widths: [960, 1440, 2048], ratio: 768 / 2048, alt: 'A woman beneath cherry blossom by a still lake, looking toward Mount Fuji at sunrise' },
  pagoda: { widths: [1240, 2048], ratio: 768 / 2048, alt: '' },
  lavender: { widths: [735, 1200, 1470], ratio: 490 / 735, alt: 'Lavender grass islands in a calm lilac lake' },
  crystal: { widths: [736, 1104], ratio: 414 / 736, alt: 'A blossom tree on an island of ice, ringed by pink crystals and floating spheres' },
  frost: { widths: [736, 1104], ratio: 521 / 736, alt: 'A frosted tree beside glass crystals on pink moss under a pale moon' },
} as const;
export type ArtName = keyof typeof ART;

export function ArtImage({ name, sizes = '100vw', priority = false, alt, style, className }: {
  name: ArtName; sizes?: string; priority?: boolean; alt?: string; style?: React.CSSProperties; className?: string;
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
      className={className}
    />
  );
}
