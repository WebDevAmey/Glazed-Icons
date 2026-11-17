'use client';

import { HUES, HUE_NAMES, RADIUS_NAMES, type Hue, type Radius } from '@/lib/icons';
import { Seg } from './Seg';

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function HuePicker({ value, onChange, allowOwn = true, label = 'Colour', custom, onCustom }: {
  value: Hue | null; onChange: (h: Hue | null) => void; allowOwn?: boolean; label?: string;
  custom?: string | null; onCustom?: (hex: string) => void;
}) {
  return (
    <div className="swatches" role="radiogroup" aria-label={label}>
      {allowOwn && (
        <button type="button" role="radio" className="swatch swatch-own" aria-checked={value === null && !custom} aria-label="Each icon's own colour" title="Own colour" onClick={() => onChange(null)} />
      )}
      {HUE_NAMES.map((h) => (
        <button
          key={h}
          type="button"
          role="radio"
          className="swatch"
          aria-checked={value === h && !custom}
          aria-label={cap(h)}
          title={cap(h)}
          style={{ background: `linear-gradient(180deg, ${HUES[h][0]}, ${HUES[h][2]})` }}
          onClick={() => onChange(h)}
        />
      ))}
      {onCustom && (
        <label className="swatch swatch-custom" data-on={!!custom} title="Pick any colour" style={custom ? { background: custom } : undefined}>
          <span className="visually-hidden">Custom colour</span>
          <input type="color" value={custom ?? '#ff2d55'} onChange={(e) => onCustom(e.target.value)} />
          {!custom && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg>}
        </label>
      )}
    </div>
  );
}

export function RadiusPicker({ value, onChange }: { value: Radius; onChange: (r: Radius) => void }) {
  return <Seg label="Corners" value={value} onChange={onChange} options={RADIUS_NAMES.map((r) => ({ value: r, label: cap(r) }))} />;
}
