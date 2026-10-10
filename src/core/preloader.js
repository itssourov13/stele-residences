import { $, RM } from './env.js';
import { lockScroll, unlockScroll } from '../motion/scroll.js';

/** Brass counter + two-shutter curtain. Resolves when the curtain starts opening. */
export function runPreloader() {
  const pl = $('#preloader');
  if (!pl || RM) { pl && pl.remove(); return Promise.resolve(); }
  return new Promise((resolve) => {
    const num = $('#plNum');
    lockScroll();
    let p = 0, fin = false;
    const t0 = performance.now();
    const iv = setInterval(() => { p = Math.min(99, p + 2 + Math.random() * 13); num.textContent = String(Math.floor(p)).padStart(2, '0'); }, 90);
    const done = () => {
      if (fin) return; fin = true; clearInterval(iv);
      num.textContent = '100';
      pl.classList.add('done'); unlockScroll(); resolve();
      setTimeout(() => pl.remove(), 1200);
    };
    if (document.readyState === 'complete') setTimeout(done, 700);
    else addEventListener('load', () => setTimeout(done, Math.max(250, 1100 - (performance.now() - t0))));
    setTimeout(done, 2800);
  });
}
