/**
 * Unit inventory used by the apartment finder, the residence cards and the 3D tower.
 * DEMONSTRATION DATA ONLY: deterministic synthetic records; never present prices or statuses as real availability. Replace only after an owner supplies approved data:
 * { id, floor, rooms, m2, price, status: 'free' | 'res' | 'sold', label }
 */
export const FLOORS = 18;
export const UNITS = [];
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const M2 = { 1: 38, 2: 52, 3: 68, 4: 96 };
for (let f = 3; f <= FLOORS; f++) {
  const per = f >= 17 ? 3 : 6;
  for (let u = 0; u < per; u++) {
    let rooms, m2, label = '';
    if (f >= 17) { rooms = 4; m2 = 120 + u * 11; label = 'Monolith'; }
    else { rooms = [1, 2, 2, 3, 3, 4][u]; m2 = M2[rooms] + ((f + u) % 3) * 2; }
    const r = rnd();
    UNITS.push({ id: 'S' + f + '.' + String(u + 1).padStart(2, '0'), floor: f, rooms, m2, status: 'sample', label });
  }
}
window.STELE_UNITS = UNITS;

/** Which residence collection a unit belongs to. */
export const collectionOf = (u) => (u.floor >= 17 ? 'monolith' : u.rooms === 1 ? 'ashlar' : 'terrazzo');

/** Aggregates per collection, computed from the inventory so cards never drift from the finder. */
export function collectionStats(id) {
  const us = UNITS.filter((u) => collectionOf(u) === id);
  const min = (k) => Math.min(...us.map((u) => u[k])), max = (k) => Math.max(...us.map((u) => u[k]));
  return { count: us.length, free: 0, floors: [min('floor'), max('floor')], area: [min('m2'), max('m2')], rooms: [min('rooms'), max('rooms')] };
}
