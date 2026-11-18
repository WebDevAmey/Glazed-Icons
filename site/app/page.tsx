import Link from 'next/link';
import { CATEGORIES, HUE_NAMES, ICONS, icon, label, SITE } from '@/lib/icons';
import { Marquee } from '@/components/Marquee';
import { InstallButton } from '@/components/InstallButton';
import { Playground } from '@/components/Playground';
import { Anatomy } from '@/components/Anatomy';
import { CodeTabs } from '@/components/CodeTabs';
import { Tile } from '@/components/Tile';
import { Faq } from '@/components/Faq';
import { ObjectCard } from '@/components/ObjectCard';
import { GLASS } from '@/lib/illustrations';

const COMPARE: [string, string, string][] = [
  ['What you drop in', 'A finished, full-colour tile', 'A one-colour glyph you style yourself'],
  ['Making it look like an app icon', 'Already done: gradient, edge, highlight and shadow', 'A wrapper, a gradient and a ring for every icon'],
  ['Changing colour', `One prop, ${HUE_NAMES.length} matched hues`, 'Pick shades by hand and keep them in step'],
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

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

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
          <Link href="/icons/?category=Blossom" className="badge" data-enter="1">
            <span className="badge-dot" aria-hidden="true" />
            New: Abstract and Blossom collections
            <Arrow />
          </Link>
          <h1 id="hero-title" className="display hero-title" data-enter="2">
            Glossy <Tile icon={icon('sparkles')} size={96} className="inline-tile t1" /> icons,{' '}
            ready <Tile icon={icon('kamal')} size={96} className="inline-tile t2" /> to ship <Tile icon={icon('rocket')} size={96} className="inline-tile t3" />
          </h1>
          <p className="lede" data-enter="3">{SITE.count} colour-coded app icons for your product. Copy any of them as SVG, React or Tailwind. Free and open source.</p>
          <div className="hero-actions" data-enter="4">
            <Link className="btn btn-primary btn-lg" href="/icons/">Browse icons<Arrow /></Link>
            <InstallButton />
          </div>
        </div>
        <Marquee />
      </section>

      <section className="section" aria-label="Highlights" style={{ paddingTop: 72 }}>
        <div className="container features">
          <Link href="/icons/" className="feature">
            <div className="feature-art" style={{ ['--tint' as string]: '#a684ff' }} aria-hidden="true">
              <Tile icon={icon('palette')} size={56} className="fa-a" />
              <Tile icon={icon('sparkles')} size={76} className="fa-b" />
              <Tile icon={icon('heart')} size={56} className="fa-c" />
            </div>
            <div className="feature-copy">
              <h2 className="h3">Expressive, not noisy</h2>
              <p>Bright tiles with one quiet recipe, so a page full of them still reads calm.</p>
            </div>
          </Link>
          <Link href="/docs/" className="feature">
            <div className="feature-art" style={{ ['--tint' as string]: '#ffb900' }} aria-hidden="true">
              <code className="fa-code">{'<RocketIcon size={48} />'}</code>
              <Tile icon={icon('rocket')} size={76} className="fa-b" />
            </div>
            <div className="feature-copy">
              <h2 className="h3">Ready for production</h2>
              <p>SVG files, a plain JS function, typed React components and Tailwind classes.</p>
            </div>
          </Link>
          <a href={SITE.repo} className="feature" target="_blank" rel="noopener">
            <div className="feature-art" style={{ ['--tint' as string]: '#00bc7d' }} aria-hidden="true">
              <Tile icon={icon('git-branch')} size={56} hue="ink" className="fa-a" />
              <Tile icon={icon('code')} size={76} className="fa-b" />
              <Tile icon={icon('git-pull-request')} size={56} className="fa-c" />
            </div>
            <div className="feature-copy">
              <h2 className="h3">Open source, for good</h2>
              <p>MIT licensed. Fork it, extend it, ship it in products you sell.</p>
            </div>
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="abs-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="abstract">
            <div className="abstract-copy">
              <p className="abstract-kicker">New collection, {ICONS.filter((i) => i.category === 'Abstract').length} icons</p>
              <h2 id="abs-title" className="h2">Abstract</h2>
              <p className="lede">A new collection exploring abstract geometry, spatial forms, organic patterns, movement and unconventional silhouettes.</p>
              <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 4 }}>
                <Link className="btn btn-white" href="/icons/?category=Abstract">Explore the collection<Arrow /></Link>
              </div>
            </div>
            <div className="abstract-grid">
              {ICONS.filter((i) => i.category === 'Abstract').slice(0, 24).map((ic) => (
                <Link key={ic.name} href={`/icons/${ic.name}/`} aria-label={`${label(ic.name)} icon`} className="abstract-cell">
                  <Tile icon={ic} size={64} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="bl-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="abstract abstract-blossom">
            <div className="abstract-grid">
              {ICONS.filter((i) => i.category === 'Blossom').slice(0, 24).map((ic) => (
                <Link key={ic.name} href={`/icons/${ic.name}/`} aria-label={`${label(ic.name)} icon`} className="abstract-cell">
                  <Tile icon={ic} size={64} />
                </Link>
              ))}
            </div>
            <div className="abstract-copy">
              <p className="abstract-kicker">New collection, {ICONS.filter((i) => i.category === 'Blossom').length} icons</p>
              <h2 id="bl-title" className="h2">Blossom</h2>
              <p className="lede">Flowers drawn in layers: cream outlines, bright petals and warm centres. Lotuses, marigolds, dahlias, rangoli and kolam, in full colour.</p>
              <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 4 }}>
                <Link className="btn btn-white" href="/icons/?category=Blossom">Explore the collection<Arrow /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="glass-title" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="glass-show">
            <div className="glass-copy">
              <p className="abstract-kicker" style={{ color: 'var(--muted)' }}>New, {GLASS.count} 3D icons</p>
              <h2 id="glass-title" className="h2">{GLASS.title}</h2>
              <p className="lede">{GLASS.description}</p>
              <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 4 }}>
                <Link className="btn btn-primary btn-lg" href="/3d/">Browse 3D icons<Arrow /></Link>
              </div>
            </div>
            <div className="glass-grid">
              {GLASS.items.slice(0, 10).map((it) => <ObjectCard key={it.name} it={it} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="make-title" style={{ paddingTop: 0 }}>
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
            <p className="body">Four layers, the same at 16 pixels and at 512, and each one has a slider. Point at a layer to see where it sits.</p>
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
          <Faq items={FAQ as [string, string][]} />
        </div>
      </section>

    </>
  );
}
