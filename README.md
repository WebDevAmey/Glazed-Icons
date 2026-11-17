# Glaze Icons

194 glossy app-tile icons. Every icon is a coloured tile with a soft gradient,
an inset highlight ring and a white glyph, the look of a polished app dock, ready to drop
into buttons, feature lists, docs and landing pages.

- 194 icons in 16 categories, 18 hues
- Plain SVG, framework-free JS, and tree-shakable React components
- Recolour any icon to any hue, four corner radii, any size
- Typed names and options
- MIT licensed, free for commercial use

## Install

```bash
npm i glaze-icons
```

## React

```jsx
import { RocketIcon, SparklesIcon } from 'glaze-icons/react';

<RocketIcon size={40} />
<SparklesIcon size={40} hue="pink" radius="round" title="New" />
```

Props: `size` (px, default 32), `hue` (red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, ink),
`radius` (`sharp` | `soft` | `round` | `circle` | number on a 32 grid), `title`
(gives the icon an accessible name; without it the icon is decorative).

## Plain JS

```js
import { glaze } from 'glaze-icons';
el.innerHTML = glaze('database', { size: 48, hue: 'orange' });
```

## SVG files

Every icon ships as `svg/<name>.svg` in its default colour. Use it as an `<img>`,
a CSS background, or paste it into Figma.

## The tile recipe

| Layer | Value |
| --- | --- |
| Fill | vertical gradient, hue 400 to 600 |
| Edge | 2px band of hue 500 |
| Highlight | 1px white at 20%, inset 2px |
| Glyph | white, 50% of the tile, drop shadow 0 1px 1.6px black/35% |
| Shadow (CSS) | `drop-shadow(0 6px 8px rgb(0 0 0/.12))` |

## Categories

- Development: 16
- Cloud & Data: 11
- AI & Magic: 10
- Security: 9
- Communication: 12
- Time & Alerts: 13
- Analytics: 12
- Media: 12
- Files: 13
- Design: 13
- Navigation: 14
- Interface: 16
- Commerce: 13
- Nature: 12
- People: 7
- Devices: 11

## Contributing

Icons are listed in `src/catalog.py`, one line each: name, glyph source, category, hue and search tags.

```bash
npm install
npm run icons:extract   # catalog -> src/data.json
npm run build           # data -> svg/, dist/, icons.json
```

Add a line, run both steps, open a pull request. `src/core.mjs` holds the tile recipe.

## Website

The site in `site/` is a Next.js app exported as static HTML: a landing page, a browser
for every icon, a page per icon, docs, a sitemap and share images.

```bash
cd site
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in site/out
```

To deploy on Vercel, import the repo and set the root directory to `site`. Set
`NEXT_PUBLIC_SITE_URL` to your domain so canonical links and the sitemap point at it.

## Credits

Glyphs come from [Tabler Icons](https://tabler.io/icons) (MIT). See `NOTICE`.
