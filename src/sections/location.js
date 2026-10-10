import { LOCATION as C } from '../content/location.js';
import { SectionIntro } from '../components/section-intro.js';
import { MediaFrame } from '../components/media-frame.js';
import { LocationCard } from '../components/cards.js';
import { LocationRings } from '../components/location-rings.js';
import { T } from '../i18n/index.js';
import { $, $$, RM } from '../core/env.js';
import { gsap } from '../motion/scroll.js';

export function render() {
  return `<section class="loc section" id="location" aria-labelledby="locTitle">
  <div class="loc__bg" aria-hidden="true">${MediaFrame('location.map', { ratio: '1/1', className: 'loc__map' })}</div>
  <div class="wrap loc__grid">
    <div class="loc__copy">${SectionIntro({ plate: C.plate, label: C.label, title: C.title, lede: C.lede, headingId: 'locTitle' })}
      <ol class="loc__list" id="locList">${C.landmarks.map((l, i) => LocationCard(l, i)).join('')}</ol></div>
    <figure class="loc__rings">${LocationRings()}<figcaption class="mono">${T(C.mapCaption)}</figcaption></figure>
  </div>
</section>`;
}

/** Rings draw in once; hovering/focusing a landmark row lights its marker. Map clip (if provided) plays once when visible. */
export function init() {
  const rings = $('.rings'); if (!rings) return;
  const pts = $$('.lr-pt', rings), rows = $$('#locList .loc-card');
  const set = (id) => pts.forEach((p) => p.classList.toggle('is-on', p.dataset.landmark === id));
  rows.forEach((r) => { ['mouseenter', 'focus'].forEach((e) => r.addEventListener(e, () => set(r.dataset.landmark))); ['mouseleave', 'blur'].forEach((e) => r.addEventListener(e, () => set(null))); });
  pts.forEach((p) => p.addEventListener('mouseenter', () => set(p.dataset.landmark)));
  if (RM) return;
  const rs = $$('.lr-ring', rings);
  gsap.set(rs, { strokeDasharray: 1, strokeDashoffset: 1 }); gsap.set(pts, { opacity: 0, scale: 0.4, transformOrigin: 'center' });
  gsap.timeline({ scrollTrigger: { trigger: rings, start: 'top 75%', once: true } })
    .to(rs, { strokeDashoffset: 0, duration: 1.6, ease: 'power3.out', stagger: 0.2 })
    .to(pts, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.12 }, 0.6);
}
