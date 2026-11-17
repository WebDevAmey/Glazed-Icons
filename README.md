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
<HeartIcon size={48} color="#ff2d55" gloss={0.9} glyph={18} />
```

Every option works as a React prop and as a `glaze()` option:

| Option | Values | Default |
| --- | --- | --- |
| `size` | px | 32 |
| `hue` | one of the 18 hues below | the icon's own |
| `color` | any hex; light and dark shades are derived from it | none |
| `radius` | `sharp`, `soft`, `round`, `circle`, or 0 to 16 | `soft` (8) |
| `glyph` | glyph size on the 32 grid, 8 to 26 | 17 |
| `gloss` | top light, 0 to 1 | 0.6 |
| `rim` | glass line inside the edge, 0 to 1 | 0.7 |
| `shadow` | glyph shadow, 0 to 1 | 0.6 |
| `stroke` | line weight for outline glyphs, 1 to 3 | 2 |
| `title` | accessible name; without it the icon is decorative | none |

Hues: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose and ink, using the Tailwind CSS v4 palette.

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
| Gloss | white light from the top edge, gone by the middle |
| Edge | hairline of black at 10% |
| Rim | 1px glass line just inside the edge, brightest at the top |
| Glyph | white, 17 of 32 units, short soft shadow |
| Shadow (CSS) | `drop-shadow(0 6px 10px rgb(0 0 0/.12))` |

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
