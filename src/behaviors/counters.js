import { $$, RM } from '../core/env.js';
import { getLang } from '../i18n/index.js';

/** Count-up for [data-count] at ~60% visibility; static under reduced motion. */
export function initCounters() {
  const fmt = (n) => Math.round(n).toLocaleString(getLang() === 'pl' ? 'pl-PL' : 'en-GB');
  const run = (el) => {
    const target = parseFloat(el.dataset.count), t0 = performance.now(), dur = 1600;
    (function step(now) { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(target * e); if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target); })(t0);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => { if (RM) el.textContent = fmt(+el.dataset.count); else io.observe(el); });
}
