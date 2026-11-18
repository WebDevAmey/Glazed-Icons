import Link from 'next/link';
import { src, type Illustration } from '@/lib/illustrations';

/**
 * One illustration in a fixed square frame. The image is drawn at its native size,
 * centred, never cropped or stretched, so every card has the same size and spacing.
 */
export function ObjectCard({ it, priority = false }: { it: Illustration; priority?: boolean }) {
  return (
    <Link href={`/objects/${it.name}/`} className="obj-card" aria-label={`${it.title}, glass and resin illustration`}>
      <span className="obj-frame">
        <picture>
          <source srcSet={src(it.webp)} type="image/webp" />
          <img src={src(it.png)} width={it.width} height={it.height} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" />
        </picture>
      </span>
      <span className="obj-title" aria-hidden="true">{it.title}</span>
    </Link>
  );
}
