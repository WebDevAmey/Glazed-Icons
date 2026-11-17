'use client';

import { useEffect, useRef, useState } from 'react';
import { component, icon, label } from '@/lib/icons';
import { copyText } from '@/lib/client';
import { Tile } from './Tile';

const NAMES = ['code', 'database', 'cloud-upload', 'sparkles', 'rocket', 'shield-check', 'chart-pie', 'message-circle', 'palette', 'bolt', 'music', 'calendar', 'heart'];
const MAX = 0.62;      // extra scale at the pointer
const REACH = 150;     // px of influence either side of the pointer

/**
 * A macOS-style dock. Magnification follows the pointer 1:1 and eases each tile toward
 * its target every frame from its current value, so it can be interrupted at any moment.
 */
export function Dock() {
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const scales = useRef<number[]>(NAMES.map(() => 1));
  const targets = useRef<number[]>(NAMES.map(() => 1));
  const raf = useRef(0);
  const [hot, setHot] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const tick = () => {
    let moving = false;
    items.current.forEach((el, i) => {
      if (!el) return;
      const cur = scales.current[i];
      const next = cur + (targets.current[i] - cur) * 0.24;
      scales.current[i] = Math.abs(next - targets.current[i]) < 0.001 ? targets.current[i] : next;
      if (scales.current[i] !== targets.current[i]) moving = true;
      const s = scales.current[i];
      el.style.width = `${58 * (1 + (s - 1) * 0.72)}px`;
      (el.firstElementChild as HTMLElement).style.transform = `translateY(${-(s - 1) * 22}px) scale(${s})`;
    });
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf.current) raf.current = requestAnimationFrame(tick); };

  const fine = () => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches && innerWidth > 760;

  const onMove = (e: React.PointerEvent) => {
    if (!fine()) return;
    items.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const t = Math.max(0, 1 - d / REACH);
      targets.current[i] = 1 + MAX * (0.5 - 0.5 * Math.cos(Math.PI * t));
    });
    kick();
  };
  const onLeave = () => { targets.current = targets.current.map(() => 1); setHot(null); kick(); };

  const copy = async (name: string) => {
    await copyText(`<${component(name)} size={40} />`, `Copied <${component(name)} />`, name);
    setCopied(name);
  };

  return (
    <div className="dock-wrap">
      <div className="dock" onPointerMove={onMove} onPointerLeave={onLeave} role="group" aria-label="Sample icons. Activate one to copy its React component.">
        {NAMES.map((n, i) => (
          <button
            key={n}
            ref={(el) => { items.current[i] = el; }}
            type="button"
            className="dock-item"
            data-copied={copied === n}
            onPointerEnter={() => setHot(n)}
            onFocus={() => setHot(n)}
            onClick={() => copy(n)}
            aria-label={`Copy ${label(n)} icon component`}
          >
            <Tile icon={icon(n)} size={58} />
          </button>
        ))}
      </div>
      <p className="dock-tip" aria-live="polite">
        {hot ? <>Click to copy <code>{`<${component(hot)} />`}</code></> : <>Click or tap any icon to copy it.</>}
      </p>
    </div>
  );
}
