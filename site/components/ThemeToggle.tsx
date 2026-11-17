'use client';

import { useEffect, useState } from 'react';

/** Runs before paint (inlined in <head>) so the page never flashes the wrong theme. */
export const themeScript = `(function(){try{var t=localStorage.getItem('glazed-theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}})()`;

export function isDark() {
  return typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark';
}

export function setTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  try { localStorage.setItem('glazed-theme', dark ? 'dark' : 'light'); } catch {}
  window.dispatchEvent(new CustomEvent('glazed:theme', { detail: dark }));
}

export function useDark() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    setDark(isDark());
    const on = (e: Event) => setDark((e as CustomEvent<boolean>).detail);
    addEventListener('glazed:theme', on);
    return () => removeEventListener('glazed:theme', on);
  }, []);
  return dark;
}

export function ThemeToggle() {
  const dark = useDark();
  return (
    <button type="button" className="icon-btn" onClick={() => setTheme(!dark)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
      {dark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      )}
    </button>
  );
}
