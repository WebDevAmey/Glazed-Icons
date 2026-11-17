'use client';

import { useState } from 'react';
import Link from 'next/link';
import { icon, type Hue, type Radius } from '@/lib/icons';
import { Tile } from './Tile';
import { HuePicker, RadiusPicker } from './Controls';

const SET = ['home', 'search', 'bell', 'mail', 'calendar', 'settings', 'user', 'heart', 'star', 'camera', 'map-pin', 'lock', 'folder', 'chart-pie', 'cloud', 'shopping-cart', 'message', 'bolt'];

export function Playground() {
  const [hue, setHue] = useState<Hue | null>(null);
  const [radius, setRadius] = useState<Radius>('soft');
  return (
    <div className="panel play">
      <div className="play-grid">
        {SET.map((n) => (
          <Link key={n} href={`/icons/${n}/`} aria-label={`${n.replace(/-/g, ' ')} icon`} style={{ borderRadius: 14 }}>
            <Tile icon={icon(n)} hue={hue ?? undefined} radius={radius} size={52} />
          </Link>
        ))}
      </div>
      <div className="play-controls">
        <div>
          <span className="control-label" id="pg-colour">Colour</span>
          <HuePicker value={hue} onChange={setHue} label="Colour for the sample set" />
        </div>
        <div>
          <span className="control-label">Corners</span>
          <RadiusPicker value={radius} onChange={setRadius} />
        </div>
      </div>
    </div>
  );
}
