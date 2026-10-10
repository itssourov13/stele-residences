import { $, RM, FINE_POINTER } from '../core/env.js';

/** Small dot + lagging ring on fine pointers; ring grows over interactive elements. */
export function initCursor() {
  const dot = $('.cursor__dot'), ring = $('.cursor__ring');
  if (!dot || !ring || !FINE_POINTER || RM) return;
  let cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy;
  addEventListener('mousemove', (e) => { cx = e.clientX; cy = e.clientY; dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; }, { passive: true });
  (function loop() { rx += (cx - rx) * 0.16; ry += (cy - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', (e) => ring.classList.toggle('is-active', !!e.target.closest('a,button,.gallery__item,.ucard,.fbtn,input,select,textarea,summary,.note,.loc-card')));
}
