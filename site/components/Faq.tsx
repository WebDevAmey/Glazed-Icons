'use client';

import { useId, useState } from 'react';

/**
 * Accordion that animates height with a grid row (0fr to 1fr), so the answer
 * grows from its real size instead of snapping. Each item opens on its own,
 * and quick clicks reverse smoothly because it is a transition, not a keyframe.
 */
export function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const base = useId();
  const toggle = (i: number) => setOpen((s) => {
    const n = new Set(s);
    n.has(i) ? n.delete(i) : n.add(i);
    return n;
  });

  return (
    <div className="faq-list">
      {items.map(([q, a], i) => {
        const on = open.has(i);
        return (
          <div key={q} className="faq-item" data-open={on}>
            <h3 className="faq-q">
              <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} id={`${base}-q${i}`} onClick={() => toggle(i)}>
                <span>{q}</span>
                <span className="plus" aria-hidden="true" />
              </button>
            </h3>
            <div className="faq-a" id={`${base}-${i}`} role="region" aria-labelledby={`${base}-q${i}`}>
              <div className="faq-a-in"><p>{a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
