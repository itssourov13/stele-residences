import { $, $$ } from '../core/env.js';
import { lockScroll, unlockScroll } from '../motion/scroll.js';

/** Gallery lightbox on <dialog>: focus trap + Escape from showModal(), arrow keys, View Transitions for swaps where supported, focus returns to the opener. */
export function initLightbox() {
  const lb = $('#lightbox'), img = $('#lbImg'), cap = $('#lbCap');
  const items = $$('#gallery .gallery__item');
  if (!lb || !items.length) return;
  let idx = 0, opener = null;
  const show = (i) => {
    idx = (i + items.length) % items.length;
    const im = items[idx].querySelector('img');
    const swap = () => { img.src = im.currentSrc || im.src; img.alt = im.alt; cap.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`; };
    if (document.startViewTransition && lb.open) document.startViewTransition(swap); else swap();
    if (!lb.open) { lb.showModal(); lockScroll(); }
  };
  items.forEach((b, i) => b.addEventListener('click', () => { opener = b; show(i); }));
  $('#lbClose').onclick = () => lb.close();
  $('#lbPrev').onclick = () => show(idx - 1);
  $('#lbNext').onclick = () => show(idx + 1);
  lb.addEventListener('close', () => { unlockScroll(); opener && opener.focus({ preventScroll: true }); });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  addEventListener('keydown', (e) => { if (!lb.open) return; if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
  // touch: swipe
  let sx = null; lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
}
