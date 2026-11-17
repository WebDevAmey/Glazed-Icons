import Link from 'next/link';
import { CATEGORIES, icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';
import { ArtImage } from './Art';
import { ThemeToggle } from './ThemeToggle';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-card">
          <div className="art-strip" aria-hidden="true"><ArtImage name="lavender" sizes="(max-width: 1240px) 100vw, 1240px" alt="" /></div>
          <div className="footer-top">
            <div className="footer-cta">
              <h2 className="h2">Free to use. Free to fork.</h2>
              <p>{SITE.count} glossy icons, MIT licensed for personal and commercial work. Missing one? Add a line to the catalog and open a pull request.</p>
              <div className="hero-actions" style={{ marginTop: 4 }}>
                <Link className="btn btn-primary" href="/icons/">Browse icons<Arrow /></Link>
                <a className="btn btn-quiet" href={SITE.repo} target="_blank" rel="noopener">View source</a>
              </div>
            </div>
            <div className="footer-cols">
              <nav aria-labelledby="f-library">
                <h2 id="f-library">Library</h2>
                <ul>
                  <li><Link href="/icons/">All icons</Link></li>
                  <li><Link href="/docs/">Docs</Link></li>
                  <li><Link href="/docs/#react">React</Link></li>
                  <li><Link href="/docs/#tailwind">Tailwind</Link></li>
                </ul>
              </nav>
              <nav aria-labelledby="f-browse">
                <h2 id="f-browse">Browse</h2>
                <ul>
                  {CATEGORIES.slice(0, 5).map((c) => (
                    <li key={c}><Link href={`/icons/?category=${encodeURIComponent(c)}`}>{c}</Link></li>
                  ))}
                </ul>
              </nav>
              <nav aria-labelledby="f-project">
                <h2 id="f-project">Project</h2>
                <ul>
                  <li><a href={SITE.repo} target="_blank" rel="noopener">GitHub</a></li>
                  <li><a href={`${SITE.repo}/issues/new`} target="_blank" rel="noopener">Request an icon</a></li>
                  <li><a href={`${SITE.repo}/blob/main/LICENSE`} target="_blank" rel="noopener">MIT licence</a></li>
                  <li><a href="https://tabler.io/icons" target="_blank" rel="noopener">Tabler Icons</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="footer-base">
            <Link href="/" className="brand" aria-label={`${SITE.name}, home`}>
              <Tile icon={icon('flower')} size={24} />
              <span>Glazed</span>
            </Link>
            <span>© 2026 {SITE.name} contributors. Glyphs from Tabler Icons, MIT.</span>
            <nav aria-label="Elsewhere">
              <ThemeToggle className="theme" />
              <a href={SITE.repo} target="_blank" rel="noopener" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
              </a>
              <a href="https://www.npmjs.com/package/glaze-icons" target="_blank" rel="noopener" aria-label="npm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m12 12 8-4.5M12 12v9M12 12 4 7.5" /></svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
