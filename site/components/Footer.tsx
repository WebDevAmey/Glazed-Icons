import Link from 'next/link';
import { CATEGORIES, icon, SITE } from '@/lib/icons';
import { Tile } from './Tile';

const slug = (c: string) => encodeURIComponent(c);

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" aria-label={`${SITE.name}, home`}>
              <Tile icon={icon('sparkles')} hue="violet" size={30} />
              <span>{SITE.name}</span>
            </Link>
            <p>{SITE.count} glossy app-tile icons for interfaces, docs and landing pages. Free and open source under MIT.</p>
          </div>
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
                <li key={c}><Link href={`/icons/?category=${slug(c)}`}>{c}</Link></li>
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
          <a href={SITE.repo} target="_blank" rel="noopener">Star on GitHub</a>
        </div>
        <div className="footer-word" aria-hidden="true">Glazed</div>
      </div>
    </footer>
  );
}
