# Glaze Icons

282 glossy app-tile icons. Every icon is a coloured tile with a soft gradient,
an inset highlight ring and a white glyph, the look of a polished app dock, ready to drop
into buttons, feature lists, docs and landing pages.

- 282 icons in 18 categories, 19 hues
- The Abstract collection: 40 original geometric glyphs in dark ink
- The Blossom collection: 48 original multi-colour flowers
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
| `hue` | one of the 19 hues below | the icon's own |
| `color` | any hex; light and dark shades are derived from it | none |
| `ink` | glyph colour as a hex | white; near-black for Abstract |
| `colors` | Blossom only: new glyph colours, as an array in palette order or a map from old hex to new | the flower's own |
| `radius` | `sharp`, `soft`, `round`, `circle`, or 0 to 16 | `soft` (8) |
| `glyph` | glyph size on the 32 grid, 8 to 26 | 17; 20 for Abstract |
| `gloss` | top light, 0 to 1 | 0.6 |
| `rim` | glass line inside the edge, 0 to 1 | 0.7 |
| `shadow` | glyph shadow, 0 to 1 | 0.6; 0 for dark ink |
| `stroke` | line weight for outline glyphs, 1 to 3 | 2 |
| `title` | accessible name; without it the icon is decorative | none |

Hues: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, cream and ink. All but cream come from the Tailwind CSS v4 palette.

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

## The Abstract collection

A collection exploring abstract geometry, spatial forms, organic patterns, movement and
unconventional silhouettes: fans, arches, crescents, petals, waves, orbits and stairs. The 40
glyphs are drawn for Glazed in `scripts/abstract.py` from exact circles, rings, sectors and
curves, and sit in dark ink on bright and cream tiles.

```jsx
import { OrbitIcon, BloomIcon } from 'glaze-icons/react';

<OrbitIcon size={48} />
<BloomIcon size={48} hue="cream" />
```

## The Blossom collection

48 flowers drawn in layers, each with a cream outline, coloured petals and a bright centre:
lotuses, dahlias, marigolds, pinwheels, rangoli and kolam patterns. They paint their own
colours, so `ink` does not apply; `hue` changes the tile behind them, which is dark by default.
The glyphs are built in `scripts/blossom.py`.

```jsx
import { KamalIcon, MarigoldIcon } from 'glaze-icons/react';

<KamalIcon size={48} />
<MarigoldIcon size={48} hue="cream" />
```

Every flower lists its colours in `palette` (in `icons.json`), outline first. Recolour any of
them with `colors`, slot by slot (`null` keeps a slot) or by hex:

```jsx
<KamalIcon colors={[null, '#ff2d55', '#ffb3c7']} />
<KamalIcon colors={{ '#ffc21a': '#ff2d55' }} />
```

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
- Abstract: 40
- Blossom: 48

## Contributing

Icons are listed in `src/catalog.py`, one line each: name, glyph source, category, hue and search tags.

```bash
npm install
python3 scripts/abstract.py   # draws the Abstract glyphs into src/glyphs/abstract
python3 scripts/blossom.py    # draws the Blossom flowers into src/glyphs/blossom
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
