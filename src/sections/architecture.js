import { ARCHITECTURE as C } from '../content/architecture.js';
import { SectionIntro } from '../components/section-intro.js';
import { MediaFrame } from '../components/media-frame.js';
import { StatBlock } from '../components/stat-block.js';
import { FacadeDrawing } from '../components/facade-drawing.js';
import { T } from '../i18n/index.js';
import { $, $$, RM } from '../core/env.js';
import { gsap } from '../motion/scroll.js';

export function render() {
  return `<section class="arch section section--ivory" id="architecture" aria-labelledby="archTitle">
  <div class="wrap">
    ${SectionIntro({ plate: C.plate, label: C.label, title: C.title, lede: C.lede, headingId: 'archTitle' })}
    <div class="arch__grid">
      <figure class="arch__drawing">${FacadeDrawing()}<figcaption class="mono">${T({ pl: 'Elewacja · skala umowna', en: 'Elevation · not to scale' })}</figcaption></figure>
      <ol class="arch__notes" id="archNotes">${C.annotations.map((a) => `<li><button type="button" class="note" data-zone="${a.zone}"><span class="note__no mono">${a.id}</span><span class="note__t">${T(a.title)}</span><span class="note__d">${T(a.text)}</span></button></li>`).join('')}</ol>
      <div class="arch__media">
        ${MediaFrame('architecture.facade', { ratio: '4/5', reveal: true, parallax: 6, className: 'arch__facade' })}
        ${MediaFrame('architecture.crown', { ratio: '16/10', reveal: true, className: 'arch__crown' })}
      </div>
    </div>
    <div class="arch__specs">${C.specs.map((s) => StatBlock({ text: s.value, label: s.label })).join('')}</div>
    <ul class="ledger">${C.materials.map((m) => `<li><span>${T(m.name)}</span><span>${T(m.use)}</span></li>`).join('')}</ul>
  </div>
</section>`;
}

/** Facade drawing "draws" itself with scroll; hovering/focusing an annotation highlights its zone. */
export function init() {
  const svg = $('#facadeDrawing'), notes = $$('#archNotes .note');
  if (!svg) return;
  const set = (z) => { svg.dataset.active = z || ''; notes.forEach((n) => n.classList.toggle('is-on', n.dataset.zone === z)); };
  notes.forEach((n) => { ['mouseenter', 'focus', 'click'].forEach((e) => n.addEventListener(e, () => set(n.dataset.zone))); n.addEventListener('mouseleave', () => set('')); n.addEventListener('blur', () => set('')); });
  if (RM) return;
  const lines = $$('.fd-line', svg);
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.to(lines, { strokeDashoffset: 0, ease: 'none', stagger: { amount: 0.8 }, scrollTrigger: { trigger: svg, start: 'top 85%', end: 'bottom 45%', scrub: 0.8 } });
}
