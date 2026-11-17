'use client';

import { useEffect, useRef, useState } from 'react';
import { getIcon, type Hue } from '@/lib/icons';
import type { ToastDetail } from '@/lib/client';
import { Tile } from './Tile';

export function Toaster() {
  const [t, setT] = useState<ToastDetail | null>(null);
  const [on, setOn] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onToast = (e: Event) => {
      setT((e as CustomEvent<ToastDetail>).detail);
      setOn(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setOn(false), 1900);
    };
    window.addEventListener('glazed:toast', onToast);
    return () => window.removeEventListener('glazed:toast', onToast);
  }, []);

  const ic = t?.icon ? getIcon(t.icon) : undefined;
  return (
    <div className="toast" data-on={on} role="status" aria-live="polite">
      {ic && <Tile icon={ic} hue={(t?.hue as Hue) || undefined} size={26} />}
      <span>{t?.message}</span>
    </div>
  );
}
