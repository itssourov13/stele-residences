import { $$, RM, clamp } from '../core/env.js';
import { gsap } from './scroll.js';
import { EASE, DUR } from './tokens.js';

/**
 * Declarative motion presets, driven by data-motion attributes emitted by components:
 *   data-motion="wipe"   heading wipe (clip-path + rise)       data-motion="rise"  fade + rise
 *   data-motion="mask"   image mask reveal                     data-parallax="n"   (on .media) vertical drift, n clamped to +-8
 * One place to change the site's reveal language. Everything is a no-op under prefers-reduced-motion.
 */
export function initMotion(root = document) {
  if (RM) return;
  $$('[data-motion="wipe"]', root).forEach((el) => {
    if (el.closest('.flightzone')) return;
    gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)', y: 30 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: DUR.slow, ease: EASE.out, clearProps: 'clipPath,transform', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('[data-motion="rise"]', root).forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, clearProps: 'opacity,transform', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  $$('[data-motion="mask"]', root).forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: DUR.slow * 1.1, ease: EASE.inOut, clearProps: 'clipPath', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });
  $$('.media[data-parallax]', root).forEach((m) => {
    const pic = m.querySelector('.media__pic'); if (!pic) return;
    const v = clamp(parseFloat(m.dataset.parallax) || 0, -8, 8);
    gsap.fromTo(pic, { yPercent: -v }, { yPercent: v, ease: EASE.none, scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
