'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Segmented control. The highlight is one element that slides to the chosen
 * option from wherever it is, so quick changes stay smooth and interruptible.
 */
export function Seg<T extends string>({ options, value, onChange, label, kind = 'radio', className = '' }: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  kind?: 'radio' | 'tab';
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = wrap.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(value)}"]`);
      if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [value, options.length]);

  const onKey = (e: React.KeyboardEvent) => {
    const i = options.findIndex((o) => o.value === value);
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = options[(i + step + options.length) % options.length];
    onChange(next.value);
    wrap.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };

  return (
    <div ref={wrap} className={`seg ${className}`} role={kind === 'tab' ? 'tablist' : 'radiogroup'} aria-label={label} onKeyDown={onKey}>
      {pill && <span className="seg-pill" aria-hidden="true" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />}
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            data-value={o.value}
            role={kind === 'tab' ? 'tab' : 'radio'}
            aria-selected={kind === 'tab' ? on : undefined}
            aria-checked={kind === 'radio' ? on : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
