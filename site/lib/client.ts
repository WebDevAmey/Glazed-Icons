'use client';

export type ToastDetail = { message: string; icon?: string; hue?: string };

export function toast(message: string, icon?: string, hue?: string) {
  window.dispatchEvent(new CustomEvent<ToastDetail>('glazed:toast', { detail: { message, icon, hue } }));
}

export async function copyText(text: string, message = 'Copied', icon?: string, hue?: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) return toast('Your browser blocked the clipboard. Select the code and copy it instead.');
  }
  toast(message, icon, hue);
}

export function downloadBlob(filename: string, blob: Blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function svgToPng(svg: string, px = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = px;
      c.getContext('2d')!.drawImage(img, 0, 0, px, px);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png');
    };
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}
