import Link from 'next/link';
import { icon } from '@/lib/icons';
import { Tile } from '@/components/Tile';

export default function NotFound() {
  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '120px 0', textAlign: 'center' }}>
      <Tile icon={icon('compass')} size={72} />
      <h1 className="h2">This page isn&apos;t here.</h1>
      <p className="body">The link may be old, or the icon may have a new name. Search the set to find it.</p>
      <Link className="btn btn-primary" href="/icons/">Search icons</Link>
    </div>
  );
}
