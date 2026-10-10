import { RESIDENCES, RESIDENCES_INTRO as C } from '../content/residences.js';
import { SectionIntro } from '../components/section-intro.js';
import { ResidenceCard } from '../components/cards.js';
import { $ } from '../core/env.js';
import { gsap } from '../motion/scroll.js';

export function render() {
  return `<section class="res section" id="residences" aria-labelledby="resTitle">
  <div class="res__pin">
    <div class="res__track" id="resTrack">
      <div class="res__intro">${SectionIntro({ plate: C.plate, label: C.label, title: C.title, lede: C.lede, headingId: 'resTitle' })}</div>
      ${RESIDENCES.map((r, i) => ResidenceCard(r, { index: i })).join('')}
    </div>
  </div>
</section>`;
}

/** Desktop: pinned horizontal scene (created and removed by matchMedia). Elsewhere: stacked editorial layout from CSS. */
export function init() {
  const sec = $('#residences'), track = $('#resTrack'); if (!sec || !track) return;
  gsap.matchMedia().add('(min-width:1025px) and (hover:hover) and (prefers-reduced-motion:no-preference)', () => {
    sec.classList.add('res--h');
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true } });
    return () => sec.classList.remove('res--h');
  });
}
