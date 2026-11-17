/** Rendered dreamscapes, served as sized WebP from /public/art. */
export const ART = {
  dunes: { widths: [800, 1199, 1600, 2000], ratio: 675 / 1199, alt: 'Soft pink dunes beside still water and a single red tree' },
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
