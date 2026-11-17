'use client';

import { useId } from 'react';

/** A labelled range with its value beside it. The track fills up to the thumb. */
export function Slider({ label, value, min, max, step = 1, onChange, format, hint }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string; hint?: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  const shown = format ? format(value) : String(value);
  return (
    <div className="slider">
      <div className="slider-top">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{shown}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-valuetext={shown}
        title={hint}
        style={{ ['--p' as string]: `${pct}%` }}
      />
    </div>
  );
}
