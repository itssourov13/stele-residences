import { $$ } from '../core/env.js';

/**
 * Media lifecycle: marks frames .is-loaded / .is-missing (placeholder stays visible when a file is absent) and runs slot videos
 * lazily: source is attached on first visibility, playback pauses off-screen and when the tab is hidden.
 */
export function initMedia(root = document) {
  $$('.media', root).forEach((m) => {
    const img = m.querySelector('img');
    if (img) {
      const ok = () => m.classList.add('is-loaded'), bad = () => m.classList.add('is-missing');
      if (img.complete) (img.naturalWidth ? ok() : (img.getAttribute('src') && bad())); else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', bad, { once: true }); }
    }
    const v = m.querySelector('video[data-src]'); if (!v) return;
    let attached = false;
    const play = () => { if (!attached) { v.src = v.dataset.src; attached = true; v.addEventListener('error', () => v.remove(), { once: true }); v.addEventListener('playing', () => m.classList.add('has-video'), { once: true }); } v.play().catch(() => {}); };
    new IntersectionObserver((es) => (es[0].isIntersecting ? play() : v.pause()), { threshold: 0.15 }).observe(m);
    document.addEventListener('visibilitychange', () => { if (document.hidden) v.pause(); });
  });
}
