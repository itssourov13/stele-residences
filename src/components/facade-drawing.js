import { ARCHITECTURE } from '../content/architecture.js';

/**
 * Facade elevation drawn from content/architecture.js (floors, bays, zones) so the geometry follows the data.
 * Lines carry pathLength=1 so behaviors can "draw" them with stroke-dashoffset; [data-zone]/[data-skin] drive the annotation highlight.
 */
export function FacadeDrawing() {
  const { floors, bays, zones } = ARCHITECTURE.drawing;
  const H = 24, G = 480, X = { base: [40, 200], body: [60, 180], crown: [74, 166] };
  const y = (f) => G - f * H;
  const L = (x1, y1, x2, y2, zone, extra = '') => `<line class="fd-line" data-zone="${zone}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1" ${extra}/>`;
  const out = [];
  const band = (zone, [f1, f2], [x1, x2]) => {
    for (let f = f1 - 1; f <= f2; f++) out.push(L(x1, y(f), x2, y(f), zone));           // storey courses (strata)
    const n = zone === 'base' ? 4 : bays;
    for (let i = 0; i <= n; i++) { const x = x1 + ((x2 - x1) * i) / n; out.push(L(x, y(f1 - 1), x, y(f2), zone, zone !== 'base' ? 'data-skin' : '')); }   // ribs / columns
    out.push(`<rect class="fd-glass" data-skin x="${x1}" y="${y(f2)}" width="${x2 - x1}" height="${(f2 - f1 + 1) * H}"/>`);
  };
  band('base', zones.base, X.base); band('body', zones.body, X.body); band('crown', zones.crown, X.crown);
  const marks = [1, 6, 12, floors].map((f) => `<text class="fd-no" x="18" y="${y(f) - 8}">${String(f).padStart(2, '0')}</text><line class="fd-tick" x1="26" y1="${y(f - 1)}" x2="34" y2="${y(f - 1)}"/>`).join('');
  return `<svg class="facade" id="facadeDrawing" viewBox="0 0 240 500" role="img" aria-label="Facade elevation" data-active="">
  <line class="fd-ground" x1="0" y1="${G}" x2="240" y2="${G}"/>${marks}${out.join('')}
</svg>`;
}
