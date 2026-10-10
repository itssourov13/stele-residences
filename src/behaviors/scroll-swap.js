import { $$ } from '../core/env.js';

/** Scroll-linked image swap: the sticky stage shows the frame matching the text item nearest the viewport centre. */
export function initScrollSwap() {
  $$('[data-swap]').forEach((host) => {
    const items = $$('[data-swap-item]', host), frames = $$('[data-swap-frame]', host);
    const set = (id) => { items.forEach((i) => i.classList.toggle('is-active', i.dataset.swapItem === id)); frames.forEach((f) => f.classList.toggle('is-active', f.dataset.swapFrame === id)); };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) set(e.target.dataset.swapItem); }), { rootMargin: '-45% 0px -45% 0px' });
    items.forEach((i) => io.observe(i));
  });
}
