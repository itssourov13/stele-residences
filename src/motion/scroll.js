import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RM, $, $$ } from '../core/env.js';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
export let lenis = null;

/** One clock: GSAP ticker drives Lenis, Lenis feeds ScrollTrigger. Also wires in-page anchor links. */
export function initScroll() {
  if (!RM) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const href = a.getAttribute('href'); if (href.length < 2) return;
    const t = $(href); if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: 0, duration: 1.4 }); else t.scrollIntoView();
    history.replaceState(null, '', href);
  });
}
export const lockScroll = () => { document.body.classList.add('is-locked'); lenis && lenis.stop(); };
export const unlockScroll = () => { document.body.classList.remove('is-locked'); lenis && lenis.start(); };
