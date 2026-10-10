import { LOCATION } from '../content/location.js';

/** Travel-time rings with numbered landmark markers (numbers match the LocationCard list). */
export function LocationRings() {
  const R = (m) => 18 + m * 3.9;
  const rings = LOCATION.rings.map((m, i) => `<circle class="lr-ring" cx="0" cy="0" r="${R(m)}" pathLength="1"/><text class="lr-min" x="${R(m) * 0.707 + 2}" y="${-R(m) * 0.707 - 2}">${m}′</text>`).join('');
  const pts = LOCATION.landmarks.map((l, i) => {
    const r = R(l.minutes), a = (l.angle * Math.PI) / 180, x = (r * Math.sin(a)).toFixed(1), yv = (-r * Math.cos(a)).toFixed(1);
    return `<g class="lr-pt" data-landmark="${l.id}" transform="translate(${x} ${yv})"><circle r="5.2"/><text y="2.2">${i + 1}</text></g>`;
  }).join('');
  return `<svg class="rings" viewBox="-110 -110 220 220" role="img" aria-label="Travel-time rings">${rings}<rect class="lr-slab" x="-3" y="-9" width="6" height="18" rx=".6"/>${pts}</svg>`;
}
