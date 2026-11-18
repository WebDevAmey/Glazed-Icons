import Link from 'next/link';
import { href3D, src, type Icon3D } from '@/lib/illustrations';

/** One 3D icon on a plain card: transparent cut-out, same size and padding for every icon. */
export function ObjectCard({ it, priority = false }: { it: Icon3D; priority?: boolean }) {
  return (
    <Link href={href3D(it)} className="obj-card" aria-label={`${it.title}, 3D icon`}>
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
