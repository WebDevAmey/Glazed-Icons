'use client';

import { useState } from 'react';
import { HUES, component, toSvg, type Hue, type Icon, type Radius } from '@/lib/icons';
import { downloadBlob, svgToPng, toast } from '@/lib/client';
import { Tile } from './Tile';
import { HuePicker, RadiusPicker } from './Controls';
import { CodeTabs } from './CodeTabs';

/** The interactive half of an icon's page: preview, colour, corners, code and downloads. */
export function IconStudio({ icon }: { icon: Icon }) {
  const [hue, setHue] = useState<Hue>(icon.hue);
  const [radius, setRadius] = useState<Radius>('soft');
  const svg = (px: number) => toSvg(icon, { size: px, hue, radius });

  return (
    <div className="detail">
      <div className="detail-stage" style={{ ['--c5' as string]: HUES[hue][1] }}>
        <div className="halo" aria-hidden="true" />
        <Tile icon={icon} hue={hue} radius={radius} size={168} />
        <div className="detail-sizes" aria-hidden="true">
          {[16, 24, 32, 48].map((s) => <Tile key={s} icon={icon} hue={hue} radius={radius} size={s} />)}
        </div>
      </div>

      <div className="detail-side">
        <div>
          <h1 className="display">{icon.name}</h1>
          <p className="body" style={{ marginTop: 10 }}>
            A glossy {icon.name.replace(/-/g, ' ')} icon in {hue}. Import it as <code>{`<${component(icon.name)} />`}</code>, or copy the SVG.
          </p>
        </div>
        <div className="meta">
          <span>{icon.category}</span>
          {icon.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        <div>
          <span className="control-label">Colour</span>
          <HuePicker value={hue} onChange={(h) => setHue(h ?? icon.hue)} allowOwn={false} />
        </div>
        <div>
          <span className="control-label">Corners</span>
          <RadiusPicker value={radius} onChange={setRadius} />
        </div>
        <CodeTabs icon={icon} hue={hue} radius={radius} showOutput={false} />
        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => { downloadBlob(`${icon.name}.svg`, new Blob([svg(64)], { type: 'image/svg+xml' })); toast('SVG downloaded', icon.name, hue); }}>Download SVG</button>
          <button type="button" className="btn btn-quiet" onClick={async () => { downloadBlob(`${icon.name}.png`, await svgToPng(svg(512))); toast('512px PNG downloaded', icon.name, hue); }}>Download PNG</button>
        </div>
      </div>
    </div>
  );
}
