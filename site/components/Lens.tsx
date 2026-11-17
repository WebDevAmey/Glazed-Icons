/** The one iridescent glass object, after the reference brand book. Purely decorative. */
export function Lens({ className = '' }: { className?: string }) {
  return (
    <>
      <div className={`lens-glow ${className}`} aria-hidden="true" />
      <div className={`lens ${className}`} aria-hidden="true" />
    </>
  );
}
