import { MANIFESTO } from '../content/manifesto.js';
import { T } from '../i18n/index.js';
import { Marquee } from '../components/marquee.js';
import { $, RM } from '../core/env.js';
import { gsap } from '../motion/scroll.js';

export function render() {
  return `<section class="manifesto section" id="manifesto" aria-labelledby="manifestoTitle">
  <div class="wrap">
    <p class="plate"><span class="plate__no">N°&nbsp;${MANIFESTO.plate}</span><span class="plate__rule" aria-hidden="true"></span><span class="plate__label">${T(MANIFESTO.label)}</span></p>
    <h2 class="manifesto__text" id="manifestoTitle">${T(MANIFESTO.statement)}</h2>
    <div class="manifesto__cols">${MANIFESTO.paragraphs.map((p) => `<p>${T(p)}</p>`).join('')}</div>
  </div>
  ${Marquee({ items: MANIFESTO.words, speed: 48 })}
</section>`;
}

/** Word-by-word ignition tied to scroll. Rebuilt on language change because the text node is replaced. */
export function init() {
  const h = $('.manifesto__text'); if (!h || RM) return;
  let tween = null;
  const build = () => {
    if (tween) { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); }
    const host = h.querySelector('[data-i18n]') || h;
    const words = host.textContent.trim().split(/\s+/);
    host.textContent = '';
    const els = words.map((w, i) => { const s = document.createElement('span'); s.className = 'w'; s.textContent = w; host.appendChild(s); if (i < words.length - 1) host.appendChild(document.createTextNode(' ')); return s; });
    tween = gsap.fromTo(els, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: h, start: 'top 82%', end: 'bottom 50%', scrub: 0.5 } });
  };
  build();
  document.addEventListener('stele:lang', () => requestAnimationFrame(build));
}
