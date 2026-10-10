import { $ } from '../core/env.js';
import { ScrollTrigger } from '../motion/scroll.js';
import { FLOORS } from '../content/units.js';

/** The page is the tower: scroll progress shown as a storey number on a fixed rail. */
export function initFloorRail() {
  const ticks = $('#railTicks'), num = $('#railNum'); if (!ticks) return;
  ticks.innerHTML = '<i></i>'.repeat(FLOORS);
  const els = [...ticks.children]; let cur = -1;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => {
    const f = 1 + Math.round(s.progress * (FLOORS - 1)); if (f === cur) return; cur = f;
    num.textContent = String(f).padStart(2, '0'); els.forEach((t, i) => t.classList.toggle('on', i === f - 1));
  } });
}
