'use client';

import { useEffect, useState } from 'react';
import { DEFAULTS, INK, RADII, WHITE, component, glyphOf, shades, shadowOf, toSvg, type Hue, type Icon } from '@/lib/icons';
import { copyText, downloadBlob, svgToPng, toast } from '@/lib/client';
import { Tile } from './Tile';
import { HuePicker } from './Controls';
import { CodeTabs } from './CodeTabs';
import { Seg } from './Seg';
import { Slider } from './Slider';

type Ground = 'light' | 'dark';

/** One-click palettes for multi-colour glyphs. Applied to every slot after the outline, in turn. */
const PRESETS: { name: string; colors: string[] }[] = [
  { name: 'Sunset', colors: ['#ff6b4a', '#ffb347', '#ffd166', '#ff8fab'] },
  { name: 'Ocean', colors: ['#1e6fd9', '#4cc9f0', '#a9e6f5', '#0b3d91'] },
  { name: 'Forest', colors: ['#2d6a4f', '#52b788', '#b7e4c7', '#ffd166'] },
  { name: 'Berry', colors: ['#9d4edd', '#e0aaff', '#ff6fb5', '#5a189a'] },
  { name: 'Candy', colors: ['#ff6f9e', '#ffaecb', '#7fd3a8', '#ffc21a'] },
];
const slotName = (i: number) => (i === 0 ? 'Outline' : `Colour ${i}`);
const pct = (v: number) => `${Math.round(v * 100)}%`;

/** The interactive half of an icon's page: preview, every knob, code and downloads. */
export function IconStudio({ icon }: { icon: Icon }) {
  const ownInk = icon.ink || WHITE;
  const fresh = { hue: icon.hue as Hue, color: null as string | null, ink: ownInk, colors: {} as Record<string, string>, size: 64, radius: RADII.soft, glyph: glyphOf(icon), gloss: DEFAULTS.gloss, rim: DEFAULTS.rim, shadow: shadowOf(icon), stroke: DEFAULTS.stroke };
  const [s, setS] = useState(fresh);
  const [ground, setGround] = useState<Ground>('light');
  useEffect(() => { if (document.documentElement.dataset.theme === 'dark') setGround('dark'); }, []);
  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => setS((p) => ({ ...p, [k]: v }));

  const opts = { hue: s.hue, color: s.color ?? undefined, ink: s.ink, colors: Object.keys(s.colors).length ? s.colors : undefined, radius: s.radius, glyph: s.glyph, gloss: s.gloss, rim: s.rim, shadow: s.shadow, stroke: s.stroke };
  const svg = (px: number) => toSvg(icon, { ...opts, size: px });
  const dirty = JSON.stringify(s) !== JSON.stringify(fresh);
  const colourName = s.color ? s.color : s.hue === 'ink' ? 'a dark tile' : s.hue;

  return (
    <div className="studio">
      <div className="studio-stage" data-ground={ground} style={{ ['--glow' as string]: shades(icon, opts)[1] }}>
        <div className="studio-ground" aria-hidden="true" />
        <Seg label="Preview background" className="stage-seg" value={ground} onChange={setGround} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
        <div className="studio-tile">
          <Tile icon={icon} {...opts} size={176} />
        </div>
        <p className="studio-size" aria-live="polite">{s.size} × {s.size} px</p>
      </div>

      <div className="studio-side">
        <header>
          <h1 className="display">{icon.name}</h1>
          <p className="body" style={{ marginTop: 10 }}>
            A glossy {icon.name.replace(/-/g, ' ')} icon in {colourName}. Import it as <code>{`<${component(icon.name)} />`}</code> or download it.
          </p>
          <div className="meta" style={{ marginTop: 14 }}>
            <span>{icon.category}</span>
            {icon.tags.map((t) => <span key={t}>{t}</span>)}
          </div>
        </header>

        <section className="panel customise" aria-labelledby="cust-title">
          <div className="customise-head">
            <h2 id="cust-title" className="h3">Customise</h2>
            <button type="button" className="text-btn" onClick={() => setS(fresh)} disabled={!dirty}>Reset</button>
          </div>

          <div>
            <span className="control-label">Colour</span>
            <HuePicker
              value={s.color ? null : s.hue}
              allowOwn={false}
              onChange={(h) => setS((p) => ({ ...p, hue: h ?? icon.hue, color: null }))}
              custom={s.color}
              onCustom={(hex) => set('color', hex)}
            />
          </div>

          {icon.multi && icon.palette && (
            <div className="paint">
              <div className="paint-head">
                <span className="control-label" style={{ margin: 0 }}>Glyph colours</span>
                <button type="button" className="text-btn" onClick={() => set('colors', {})} disabled={!Object.keys(s.colors).length}>Original</button>
              </div>
              <div className="paint-slots">
                {icon.palette.map((c, i) => {
                  const now = s.colors[c] ?? c;
                  return (
                    <label key={c} className="paint-slot" title={`${slotName(i)}: ${now}`}>
                      <span className="paint-chip" style={{ background: now }} />
                      <input type="color" value={now.length === 4 ? `#${now.slice(1).split('').map((x) => x + x).join('')}` : now} onChange={(e) => setS((p) => ({ ...p, colors: { ...p.colors, [c]: e.target.value } }))} aria-label={`${slotName(i)} colour`} />
                      <span className="paint-name">{slotName(i)}</span>
                    </label>
                  );
                })}
              </div>
              <div className="paint-presets" role="group" aria-label="Colour presets">
                {PRESETS.map((pr) => (
                  <button
                    key={pr.name}
                    type="button"
                    className="chip"
                    onClick={() => set('colors', Object.fromEntries(icon.palette!.slice(1).map((c, i) => [c, pr.colors[i % pr.colors.length]])))}
                  >
                    <span className="preset-dots" aria-hidden="true">{pr.colors.map((c) => <i key={c} style={{ background: c }} />)}</span>
                    {pr.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!icon.multi && <div>
            <span className="control-label">Glyph colour</span>
            <Seg
              label="Glyph colour"
              value={s.ink === WHITE ? 'white' : 'ink'}
              onChange={(v) => setS((p) => {
                const ink = v === 'white' ? WHITE : INK;
                const shadowWasDefault = p.shadow === shadowOf(icon, { ink: p.ink });
                return { ...p, ink, shadow: shadowWasDefault ? shadowOf(icon, { ink }) : p.shadow };
              })}
              options={[{ value: 'white', label: 'White' }, { value: 'ink', label: 'Ink' }]}
            />
          </div>}

          <div className="sliders">
            <Slider label="Size" value={s.size} min={16} max={256} step={4} onChange={(v) => set('size', v)} format={(v) => `${v}px`} />
            <Slider label="Corners" value={s.radius} min={0} max={16} step={0.5} onChange={(v) => set('radius', v)} format={(v) => (v >= 16 ? 'Circle' : `${v}`)} />
            <Slider label="Glyph" value={s.glyph} min={10} max={26} step={0.5} onChange={(v) => set('glyph', v)} format={(v) => `${Math.round((v / 32) * 100)}%`} />
            <Slider label="Gloss" value={s.gloss} min={0} max={1} step={0.01} onChange={(v) => set('gloss', v)} format={pct} />
            <Slider label="Rim" value={s.rim} min={0} max={1} step={0.01} onChange={(v) => set('rim', v)} format={pct} />
            <Slider label="Shadow" value={s.shadow} min={0} max={1} step={0.01} onChange={(v) => set('shadow', v)} format={pct} />
            {icon.style === 'stroke' && (
              <Slider label="Line weight" value={s.stroke} min={1} max={3} step={0.25} onChange={(v) => set('stroke', v)} format={(v) => `${v}`} />
            )}
          </div>
        </section>

        <CodeTabs icon={icon} opts={opts} size={s.size} showOutput={false} />

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => { downloadBlob(`${icon.name}.svg`, new Blob([svg(s.size)], { type: 'image/svg+xml' })); toast('SVG downloaded', icon.name, s.hue); }}>Download SVG</button>
          <button type="button" className="btn btn-quiet" onClick={async () => { downloadBlob(`${icon.name}-${Math.max(512, s.size)}.png`, await svgToPng(svg(32), Math.max(512, s.size))); toast('PNG downloaded', icon.name, s.hue); }}>Download PNG</button>
          <button type="button" className="btn btn-quiet" onClick={() => copyText(svg(s.size), 'SVG copied', icon.name, s.hue)}>Copy SVG</button>
        </div>
      </div>
    </div>
  );
}
