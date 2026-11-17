'use client';

import { HUES, HUE_NAMES, RADIUS_NAMES, type Hue, type Radius } from '@/lib/icons';

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function HuePicker({ value, onChange, allowOwn = true, label = 'Colour' }: {
  value: Hue | null; onChange: (h: Hue | null) => void; allowOwn?: boolean; label?: string;
}) {
  return (
    <div className="swatches" role="group" aria-label={label}>
      {allowOwn && (
        <button type="button" className="swatch swatch-own" aria-pressed={value === null} aria-label="Each icon's own colour" onClick={() => onChange(null)} />
      )}
      {HUE_NAMES.map((h) => (
        <button
          key={h}
          type="button"
          className="swatch"
          aria-pressed={value === h}
          aria-label={cap(h)}
          title={cap(h)}
          style={{ background: `linear-gradient(180deg, ${HUES[h][0]}, ${HUES[h][2]})` }}
          onClick={() => onChange(h)}
        />
      ))}
    </div>
  );
}

export function RadiusPicker({ value, onChange }: { value: Radius; onChange: (r: Radius) => void }) {
  return (
    <div className="seg" role="group" aria-label="Corners">
      {RADIUS_NAMES.map((r) => (
        <button key={r} type="button" aria-pressed={value === r} onClick={() => onChange(r)}>{cap(r)}</button>
      ))}
    </div>
  );
}
