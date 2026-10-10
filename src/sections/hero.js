import { HERO } from '../content/hero.js';
import { BRAND } from '../content/brand.js';
import { T, A } from '../i18n/index.js';
import { MediaFrame } from '../components/media-frame.js';
import { Button } from '../components/button.js';
import { $, $$, RM } from '../core/env.js';
import { gsap } from '../motion/scroll.js';
import { EASE, DUR } from '../motion/tokens.js';

export function render() {
  return `<section class="hero" id="hero" aria-labelledby="heroTitle">
  <div class="hero__sticky">
    <div class="hero__media" id="heroMedia">${MediaFrame('hero.main', { eager: true, ratio: '3/4', className: 'hero__frame' })}<div class="hero__scrim"></div></div>
    <div class="hero__strata" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="hero__grid" id="heroCopy">
      <p class="hero__eyebrow mono" data-hero="in"><span class="brand-slab-mini" aria-hidden="true"></span>${T(HERO.eyebrow)}</p>
      <h1 class="hero__title" id="heroTitle" data-hero="title">${T(HERO.headline)}</h1>
      <p class="hero__lede" data-hero="in">${T(HERO.lede)}</p>
      <div class="hero__actions" data-hero="in">
        ${Button({ label: BRAND.cta.chooseFloor, href: '#tower', variant: 'solid', magnetic: true })}
        ${Button({ label: BRAND.cta.architecture, href: '#architecture', variant: 'text' })}
      </div>
      <dl class="hero__facts" data-hero="in">${HERO.facts.map((f) => `<div><dt>${T(f.label)}</dt><dd>${f.value}</dd></div>`).join('')}</dl>
      <p class="hero__caption mono" data-hero="in">${T(HERO.caption)}</p>
    </div>
    <a class="hero__cue" href="#manifesto"${A({ 'aria-label': { pl: 'Przewiń w dół', en: 'Scroll down' } })}><span>${T(HERO.scroll)}</span><i></i></a>
  </div>
</section>`;
}

/** Entrance after the preloader, then "the slab expands": on desktop the framed media widens to full bleed while the copy lifts away. */
export function init(ready) {
  const hero = $('#hero'); if (!hero) return;
  const media = $('#heroMedia'), copy = $('#heroCopy');
  if (RM) return;
  const wide = matchMedia('(min-width:1000px)');

  gsap.set($$('[data-hero="in"]', hero), { opacity: 0, y: 22 });
  gsap.set($('[data-hero="title"]', hero), { clipPath: 'inset(0 0 100% 0)', y: 40 });
  gsap.set($$('.hero__strata i', hero), { scaleY: 0 });
  ready.then(() => {
    gsap.timeline({ defaults: { ease: EASE.out } })
      .to($$('.hero__strata i', hero), { scaleY: 1, duration: DUR.slow * 1.4, stagger: 0.1 }, 0)
      .to($('[data-hero="title"]', hero), { clipPath: 'inset(0 0 0% 0)', y: 0, duration: DUR.slow * 1.2 }, 0.2)
      .to($$('[data-hero="in"]', hero), { opacity: 1, y: 0, duration: DUR.base, stagger: 0.08 }, 0.75);
  });

  gsap.matchMedia().add('(min-width:1000px)', () => {
    hero.classList.add('hero--scroll');
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.to(media, { '--l': '0%', '--t': '0vh', '--r': '0px', duration: 0.7 }, 0)
      .to(copy, { yPercent: -10, opacity: 0, duration: 0.5 }, 0.25)
      .to('.hero__strata', { opacity: 0, duration: 0.4 }, 0.1)
      .to('.hero__cue', { opacity: 0, duration: 0.2 }, 0);
    return () => hero.classList.remove('hero--scroll');
  });
  // mobile / tablet: gentle push-in only
  gsap.matchMedia().add('(max-width:999px)', () => {
    gsap.to(media, { scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
  });
}
