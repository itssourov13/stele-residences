import { TOWER } from '../content/tower.js';
import { SectionIntro } from '../components/section-intro.js';
import { TowerStage } from '../components/tower-stage.js';
import { $, RM } from '../core/env.js';
import { isEN } from '../i18n/index.js';
import { ScrollTrigger } from '../motion/scroll.js';
import { initApartmentFinder } from '../features/apartment-finder.js';

export function render() {
  return `<div class="flightzone" id="flightzone"><div class="flightsticky">
<section class="tower" id="tower" aria-labelledby="towerTitle">
  <div class="head">${SectionIntro({ plate: TOWER.plate, label: TOWER.label, title: TOWER.title, lede: TOWER.lede, headingId: 'towerTitle' })}</div>
  ${TowerStage()}
</section>
</div></div>`;
}

/**
 * 1) finder UI (always)  2) scroll-scrubbed camera flight (desktop pointer, motion allowed) via window.steleFlight published by the scene
 * 3) lazy-load the WebGPU chunk when the zone nears the viewport; localized fallback if it cannot load.
 */
export function init() {
  initApartmentFinder();
  const fz = $('#flightzone'); if (!fz) return;
  const FLIGHT = matchMedia('(hover:hover)').matches && innerWidth > 980 && !RM;
  if (!FLIGHT) { fz.classList.add('settled'); window.__flightLastP = 1; }
  else {
    const caps = [$('#fcap1'), $('#fcap2'), $('#fcap3')], win = [[0.05, 0.27], [0.34, 0.57], [0.64, 0.82]];
    ScrollTrigger.create({
      trigger: fz, start: 'top top', end: 'bottom bottom', scrub: 0.4,
      onUpdate: (s) => {
        const p = s.progress; window.__flightLastP = p;
        window.steleFlight && window.steleFlight(p);
        fz.classList.toggle('settled', p > 0.86);
        caps.forEach((c, i) => { if (!c) return; const v = p > win[i][0] && p < win[i][1]; c.classList.toggle('is-on', v); });
      }
    });
  }
  new IntersectionObserver((es) => document.body.classList.toggle('in-tower', es[0].isIntersecting), { threshold: 0 }).observe(fz);

  const load = () => import('../webgl/tower-scene.js').then((m) => m.initTowerScene()).catch((e) => { console.warn('3D unavailable', e); fallback(); });
  const lazy = new IntersectionObserver((es) => { if (es[0].isIntersecting) { lazy.disconnect(); load(); } }, { rootMargin: '120% 0px' });
  lazy.observe(fz);
}

function fallback() {
  const c = $('#tower3d'), tlo = $('#tlo'); if (!c || !tlo) return;
  c.style.display = 'none'; tlo.classList.remove('off');
  tlo.innerHTML = `<span class="tmark">${document.querySelector('.brand__word')?.textContent || ''}</span><span class="tlo__msg">${isEN() ? '3D preview is unavailable on this device' : 'Podgląd 3D niedostępny na tym urządzeniu'}</span>`;
  $('#flightzone')?.classList.add('settled');
}
