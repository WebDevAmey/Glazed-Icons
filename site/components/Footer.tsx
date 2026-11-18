import Link from 'next/link';
import { CATEGORIES, icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';
import { ThemeToggle } from './ThemeToggle';

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const ROW = ['code', 'database', 'cloud', 'sparkles', 'orbit', 'kamal', 'rocket', 'heart', 'marigold', 'bolt', 'bloom', 'palette'];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <div className="footer-tiles" aria-hidden="true">
            {ROW.map((n, i) => <Tile key={n} icon={icon(n)} size={44} style={{ ['--i' as string]: i }} />)}
          </div>
          <h2 className="h2">Free to use. Free to fork.</h2>
          <p className="lede">{SITE.count} glossy icons, MIT licensed for personal and commercial work. Missing one? Add a line to the catalog and open a pull request.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" href="/icons/">Browse icons<Arrow /></Link>
            <a className="btn btn-quiet btn-lg" href={SITE.repo} target="_blank" rel="noopener">View source</a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label={`${SITE.name}, home`}>
              <Tile icon={icon('flower')} size={28} />
              <span>Glazed</span>
            </Link>
            <p>Glossy app-tile icons for interfaces, docs and landing pages.</p>
          </div>
          <nav aria-labelledby="f-library">
            <h2 id="f-library">Library</h2>
            <ul>
              <li><Link href="/icons/">All icons</Link></li>
              <li><Link href="/objects/">Glass &amp; Resin</Link></li>
              <li><Link href="/docs/">Docs</Link></li>
              <li><Link href="/docs/#react">React</Link></li>
              <li><Link href="/docs/#tailwind">Tailwind</Link></li>
            </ul>
          </nav>
          <nav aria-labelledby="f-browse">
            <h2 id="f-browse">Collections</h2>
            <ul>
              {['Abstract', 'Blossom', ...CATEGORIES.filter((c) => c !== 'Abstract' && c !== 'Blossom').slice(0, 3)].map((c) => (
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

        <div className="footer-base">
          <span>© 2026 {SITE.name} contributors. Glyphs from Tabler Icons, MIT.</span>
          <div className="footer-base-actions">
            <ThemeToggle />
            <a className="icon-btn" href={SITE.repo} target="_blank" rel="noopener" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" /></svg>
            </a>
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">Glazed</div>
      </div>
    </footer>
  );
}
