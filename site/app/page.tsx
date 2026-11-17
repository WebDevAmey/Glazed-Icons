import Link from 'next/link';
import { CATEGORIES, HUE_NAMES, icon, SITE } from '@/lib/icons';
import { Dock } from '@/components/Dock';
import { Lens } from '@/components/Lens';
import { InstallButton } from '@/components/InstallButton';
import { Playground } from '@/components/Playground';
import { Anatomy } from '@/components/Anatomy';
import { CodeTabs } from '@/components/CodeTabs';
import { Tile } from '@/components/Tile';

const COMPARE: [string, string, string][] = [
  ['What you drop in', 'A finished, full-colour tile', 'A one-colour glyph you style yourself'],
  ['Making it look like an app icon', 'Already done: gradient, edge, highlight and shadow', 'A wrapper, a gradient and a ring for every icon'],
  ['Changing colour', 'One prop, 18 matched hues', 'Pick shades by hand and keep them in step'],
  ['Corners', 'Sharp, soft, round or circle', 'Whatever your wrapper does'],
  ['Where it shines', 'Feature lists, empty states, docs, landing pages', 'Dense UI: toolbars, menus, tables'],
  ['Range', `${SITE.count} icons`, 'Thousands of glyphs'],
];

const FAQ = [
  ['Is it free for commercial work?', 'Yes. Glazed Icons is MIT licensed, the same as the Tabler glyphs it draws on. Use it in products you sell, no attribution needed.'],
  ['How is this different from Lucide or Heroicons?', 'Those are excellent line icon sets with far more glyphs. Glazed is the finished, full-colour tile around a glyph, for the places a plain line icon looks flat. Many projects use both.'],
  ['Does it work without React?', 'Yes. The core package returns an SVG string from glaze(name, options), and every icon also ships as an .svg file. Vue, Svelte, plain HTML and servers all work.'],
  ['Can I change the colours?', `Every icon takes any of ${HUE_NAMES.length} hues, each a 400, 500 and 600 shade from the Tailwind palette, plus a neutral ink. Pass hue="pink" in React or { hue: 'pink' } in JS.`],
  ['Will it bloat my bundle?', 'No. Each React icon is its own named export and the package is marked side-effect free, so your bundler keeps only the icons you import.'],
  ['Can I request an icon?', 'Open an issue on GitHub with the name and what it is for, or add a line to src/catalog.py and send a pull request.'],
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: SITE.name,
    description: `${SITE.count} glossy app-tile icons as SVG, React and Tailwind.`,
    codeRepository: SITE.repo,
    programmingLanguage: ['TypeScript', 'JavaScript'],
    license: 'https://opensource.org/licenses/MIT',
    url: SITE.url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-copy">
          <h1 id="hero-title" className="display" data-enter="1">App icon polish for every icon in your interface.</h1>
          <p className="lede" data-enter="2">
            {SITE.count} glossy tile icons in {HUE_NAMES.length} colours. Copy one as SVG, React or Tailwind, recolour it, round its corners. Free and open source.
          </p>
          <div className="hero-actions" data-enter="3">
            <Link className="btn btn-primary" href="/icons/">Browse all {SITE.count} icons</Link>
            <InstallButton />
          </div>
        </div>
        <div className="container hero-stage" data-enter="4">
          <Lens />
          <Dock />
        </div>
      </section>

      <section className="container" aria-label="At a glance">
        <div className="proof">
          <div><strong>{SITE.count} icons</strong><span>{CATEGORIES.length} categories</span></div>
          <div><strong>{HUE_NAMES.length} colours</strong><span>Any icon, any hue</span></div>
          <div><strong>4 formats</strong><span>SVG, JS, React, Tailwind</span></div>
          <div><strong>MIT</strong><span>Free for commercial use</span></div>
        </div>
      </section>

      <section className="section" aria-labelledby="make-title">
        <div className="container split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2 id="make-title" className="h2">Your colours, your corners.</h2>
            <p className="body">Every icon takes any of the {HUE_NAMES.length} hues, or keeps its own. Corners go from sharp to a full circle. The glyph, highlight and shadow adjust with it, so a mixed set still looks like one family.</p>
            <p className="body"><Link className="link" href="/icons/">Try it on all {SITE.count} icons</Link></p>
          </div>
          <Playground />
        </div>
      </section>

      <section className="section" aria-labelledby="anat-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 id="anat-title" className="h2">Built like a real app tile.</h2>
            <p className="body">Four layers, the same at 16 pixels and at 512. Point at a layer to see where it sits.</p>
          </div>
          <Anatomy />
        </div>
      </section>

      <section className="section" aria-labelledby="code-title" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2 id="code-title" className="h2">One install. Use it anywhere.</h2>
            <p className="body">React components for React. An SVG string for everything else. Plain files for Figma and slides. Or copy the tile as Tailwind classes and keep the glyphs you already use.</p>
            <ul className="body" style={{ paddingLeft: 18, margin: 0 }}>
              <li>Typed icon names and props</li>
              <li>Tree-shaken: you ship only what you import</li>
              <li>Accessible: decorative by default, labelled with <code>title</code></li>
            </ul>
            <p className="body"><Link className="link" href="/docs/">Read the docs</Link></p>
          </div>
          <CodeTabs icon={icon('rocket')} />
        </div>
      </section>

      <section className="section" aria-labelledby="cmp-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2 id="cmp-title" className="h2">Glazed, or a line icon set?</h2>
            <p className="body">Line sets like Lucide, Heroicons, Phosphor and Tabler are the right tool for dense UI. Glazed is for the moments a glyph should look finished on its own.</p>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th scope="col"><span className="visually-hidden">Question</span></th><th scope="col">Glazed Icons</th><th scope="col">A line icon set</th></tr></thead>
              <tbody>
                {COMPARE.map(([q, a, b]) => (
                  <tr key={q}><th scope="row">{q}</th><td className="us"><strong>{a}</strong></td><td><span>{b}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
        <div className="container faq">
          <div className="section-head">
            <h2 id="faq-title" className="h2">Questions, answered.</h2>
            <p className="body">Something else? <a className="link" href={`${SITE.repo}/issues`} target="_blank" rel="noopener">Ask on GitHub</a>.</p>
          </div>
          <div className="faq-list">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<span className="plus" aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container" aria-labelledby="close-title">
        <div className="closing">
          <Lens />
          <div className="closing-in">
            <div className="stack" aria-hidden="true">
              {(['heart', 'bolt', 'leaf', 'cloud', 'sparkles'] as const).map((n) => <Tile key={n} icon={icon(n)} size={44} />)}
            </div>
            <h2 id="close-title" className="h2">Free to use. Free to fork.</h2>
            <p className="lede">MIT licensed for personal and commercial work. Missing an icon? Add a line to the catalog and open a pull request.</p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
              <Link className="btn btn-primary" href="/icons/">Browse icons</Link>
              <a className="btn btn-quiet" href={SITE.repo} target="_blank" rel="noopener">View source on GitHub</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
