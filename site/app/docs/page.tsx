import type { Metadata } from 'next';
import Link from 'next/link';
import { HUE_NAMES, SITE } from '@/lib/icons';
import { ArtImage } from '@/components/Art';

export const metadata: Metadata = {
  title: 'Docs',
  description: `Install ${SITE.name} and use it in React, plain JavaScript, HTML or Tailwind. Props, options, colours and corners.`,
  alternates: { canonical: '/docs/' },
};

const SECTIONS = [
  ['install', 'Install'],
  ['react', 'React'],
  ['javascript', 'JavaScript'],
  ['svg', 'SVG files'],
  ['tailwind', 'Tailwind'],
  ['colours', 'Colours and corners'],
  ['accessibility', 'Accessibility'],
  ['contributing', 'Contributing'],
] as const;

export default function Docs() {
  return (
    <div className="container">
      <div className="art page-banner">
        <ArtImage name="clouds" sizes="(max-width: 1240px) 100vw, 1240px" priority style={{ objectPosition: '50% 40%' }} />
        <h1 className="display">Docs</h1>
        <p className="lede">Everything you need to put a Glazed icon on screen. It takes about a minute.</p>
      </div>
      <div className="docs">
        <nav className="docs-nav" aria-label="On this page">
          {SECTIONS.map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
        </nav>
        <article className="prose">
          <h2 id="install">Install</h2>
          <pre><code>npm i {SITE.pkg}</code></pre>
          <p>pnpm, yarn and bun work the same way. React is an optional peer dependency, so the core package works without it.</p>

          <h2 id="react">React</h2>
          <pre><code>{`import { RocketIcon, SparklesIcon } from '${SITE.pkg}/react';

export function Launch() {
  return (
    <>
      <RocketIcon size={40} />
      <SparklesIcon size={40} hue="pink" radius="round" title="New" />
    </>
  );
}`}</code></pre>
          <p>Every icon is a named export ending in <code>Icon</code>. Your bundler keeps only the ones you import.</p>
          <table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
            <tbody>
              <tr><td><code>size</code></td><td>number, in px</td><td>32</td></tr>
              <tr><td><code>hue</code></td><td>one of the {HUE_NAMES.length} hues</td><td>the icon&apos;s own</td></tr>
              <tr><td><code>radius</code></td><td><code>sharp</code>, <code>soft</code>, <code>round</code>, <code>circle</code> or a number on a 32 grid</td><td><code>soft</code></td></tr>
              <tr><td><code>title</code></td><td>string, the accessible name</td><td>none, so the icon is decorative</td></tr>
            </tbody>
          </table>
          <p>Any other prop, such as <code>className</code> or <code>onClick</code>, passes to the wrapping <code>span</code>.</p>

          <h2 id="javascript">JavaScript</h2>
          <pre><code>{`import { glaze, icons } from '${SITE.pkg}';

button.innerHTML = glaze('database', { size: 48, hue: 'orange' });
console.log(icons.length); // ${SITE.count}`}</code></pre>
          <p><code>glaze(name, options)</code> returns an SVG string, so it works in Vue, Svelte, Astro, emails and on a server. It takes the same options as the React props.</p>

          <h2 id="svg">SVG files</h2>
          <p>Every icon ships as <code>svg/&lt;name&gt;.svg</code> in its own colour. Use it in an <code>img</code> tag, as a CSS background, or drop it into Figma or Keynote. Any icon page on this site also downloads an SVG or a 512px PNG in the colour and corners you pick.</p>
          <pre><code>{`<img src="/node_modules/${SITE.pkg}/svg/cloud.svg" width="40" height="40" alt="">`}</code></pre>

          <h2 id="tailwind">Tailwind</h2>
          <p>The tile is plain Tailwind, so you can wrap any glyph from any set. Every icon page has a Tailwind tab with the exact classes.</p>
          <pre><code>{`<div class="flex size-8 items-center justify-center rounded-lg
  bg-linear-to-b from-pink-400 to-pink-600 shadow-lg
  ring-1 ring-white/20 ring-offset-2 ring-offset-pink-500 ring-inset">
  <svg class="size-4 text-white drop-shadow-xl drop-shadow-black/40">…</svg>
</div>`}</code></pre>

          <h2 id="colours">Colours and corners</h2>
          <p>Hues: {HUE_NAMES.join(', ')}. Each uses its Tailwind 400, 500 and 600 shades; <code>ink</code> is a neutral near-black. Corners are 4, 8, 11 or 16 on a 32-unit tile.</p>

          <h2 id="accessibility">Accessibility</h2>
          <p>Without a <code>title</code>, an icon is hidden from screen readers, which is right when a text label sits next to it. Give a <code>title</code> when the icon stands alone, and give icon-only buttons an <code>aria-label</code>.</p>

          <h2 id="contributing">Contributing</h2>
          <p>Each icon is one line in <code>src/catalog.py</code>: its name, glyph, category, hue and search tags.</p>
          <pre><code>{`npm install
npm run icons:extract
npm run build`}</code></pre>
          <p>Then open a pull request on <a className="link" href={SITE.repo} target="_blank" rel="noopener">GitHub</a>. Or browse the <Link className="link" href="/icons/">full set</Link> first to check it isn&apos;t there already.</p>
        </article>
      </div>
    </div>
  );
}
