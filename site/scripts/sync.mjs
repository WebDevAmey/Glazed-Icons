// Copies the icon data and the tile recipe from the library into the site,
// so the site always renders exactly what the package ships.
import fs from 'node:fs';
import path from 'node:path';

const site = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(site, '..', 'src');
const lib = path.join(site, 'lib', 'generated');
fs.mkdirSync(lib, { recursive: true });

const data = JSON.parse(fs.readFileSync(path.join(src, 'data.json'), 'utf8'));
data.icons = data.icons.map(({ name, category, hue, tags, style, body, ink, glyph, multi, shadow, palette }) => ({ name, category, hue, tags, style, body, ...(ink && { ink }), ...(glyph && { glyph }), ...(multi && { multi }), ...(shadow !== undefined && { shadow }), ...(palette && { palette }) }));
fs.writeFileSync(path.join(lib, 'data.json'), JSON.stringify(data));
fs.copyFileSync(path.join(src, 'core.mjs'), path.join(lib, 'core.mjs'));
console.log(`synced ${data.icons.length} icons`);

// 3D icons: copy the manifest and the files exactly as the package ships them.
const repo = path.join(site, '..');
const set3d = JSON.parse(fs.readFileSync(path.join(repo, '3d.json'), 'utf8'));
fs.writeFileSync(path.join(lib, '3d.json'), JSON.stringify(set3d));
for (const c of set3d.collections) {
  const dest = path.join(site, 'public', '3d', c.id);
  fs.mkdirSync(dest, { recursive: true });
  for (const it of c.items) for (const f of [it.png, it.webp]) fs.copyFileSync(path.join(repo, f), path.join(dest, path.basename(f)));
  console.log(`synced ${c.items.length} 3D icons (${c.id})`);
}
