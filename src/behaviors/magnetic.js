import { $$, RM, FINE_POINTER } from '../core/env.js';
import { gsap } from '../motion/scroll.js';

/** Restrained pull (max 5 px) on .magnetic buttons; pointer-fine only. */
export function initMagnetic() {
  if (RM || !FINE_POINTER) return;
  $$('.magnetic').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }), y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); x(((e.clientX - r.left) / r.width - 0.5) * 10); y(((e.clientY - r.top) / r.height - 0.5) * 10); });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}
