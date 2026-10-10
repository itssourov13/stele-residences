import { TOWER } from '../content/tower.js';
import { BRAND } from '../content/brand.js';
import { M3D } from '../config/assets.js';
import { T, A } from '../i18n/index.js';
import { Button } from './button.js';

const P = (pl, en) => ({ pl, en });

/**
 * 3D stage + apartment finder panel. The ids below are the DOM contract of webgl/tower-scene.js and
 * features/apartment-finder.js (renaming one means renaming it there). The stage works without WebGL: the finder list stays usable.
 */
export function TowerStage() {
  const caps = TOWER.captions.map((c, i) => `<div class="fcap c${i + 1}" id="fcap${i + 1}"><b>${T(c.h)}</b><span>${T(c.s)}</span></div>`).join('');
  return `<div class="twrap">
  <div class="tstage">
    <canvas id="tower3d" role="img"${A({ 'aria-label': P('Interaktywny model 3D wieży. Lista rezydencji obok działa bez 3D.', 'Interactive 3D model of the tower. The residence list beside it works without 3D.') })}></canvas>
    <div class="tlo" id="tlo"><i></i><span class="tmark">${BRAND.name}</span></div>
    <div class="thint">${T(TOWER.hint)}</div>
    <div class="webgpu-chip" id="gpuChip" hidden>WebGPU</div>
    <div class="tbadge" id="tbadge"><span>${T(P('Piętro', 'Floor'))}</span><b id="tbFloor">-</b></div>
    <div class="daynight">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>
      <input type="range" id="dayNight" min="0" max="1" step="0.001" value="0.75"${A({ 'aria-label': P('Pora dnia', 'Time of day') })}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>
    </div>
    <button class="lobby-enter" id="lobbyBtn" type="button" hidden>
      <span class="le-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21V5.1a1 1 0 0 1 .8-.98l6-1.2A1 1 0 0 1 17 3.9V21"/><path d="M6 21h13"/><path d="M13.3 12v.9"/></svg></span>
      <span class="le-body"><small class="le-eyebrow">${T(P('Zapraszamy · parter', 'Welcome · ground floor'))}</small><span class="le-txt">${T(P('Wejdź do recepcji', 'Step into reception'))}</span></span>
      <span class="le-arr" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
    </button>
    <button class="lobby-exit" id="lobbyExit" type="button">${T(P('✕ Wyjdź na zewnątrz', '✕ Step outside'))}</button>
    <button class="snd-btn" id="sndBtn" type="button" aria-pressed="true"${A({ 'aria-label': P('Dźwięk', 'Sound') })}>🔊</button>
    <div class="con-bubble" id="conBubble" hidden>
      <div class="ab-name"><img class="con-avatar" src="${M3D.inesPortrait}" alt="" width="32" height="42" loading="lazy" /> <span class="con-avatar__name">${BRAND.concierge.name.toUpperCase()} <span>· ${T(BRAND.concierge.role)}</span></span></div>
      <p id="abText"></p>
      <button class="btn btn--solid" id="abMeet" type="button"><span class="btn__label">${T(P('Poznaj założenia koncepcji', 'Explore the concept'))}</span></button>
    </div>
    <div class="lobby-fade" id="lobbyFade" aria-hidden="true"></div>
    ${caps}
  </div>
  <aside class="tpanel"${A({ 'aria-label': P('Wyszukiwarka rezydencji', 'Residence finder') })}>
    <div class="tp-head"><small>${T(P('Układy przykładowe', 'Illustrative layouts'))}</small><div class="cnt"><b id="uCount">0</b> ${T(P('z', 'of'))} <span id="uTotal">90</span></div></div>
    <div class="tfilters" id="tfilters">
      <button type="button" class="fbtn act" data-rooms="all">${T(P('Wszystkie', 'All'))}</button>
      <button type="button" class="fbtn" data-rooms="1">${T(P('1 pokój', '1 room'))}</button>
      <button type="button" class="fbtn" data-rooms="2">${T(P('2 pokoje', '2 rooms'))}</button>
      <button type="button" class="fbtn" data-rooms="3">${T(P('3 pokoje', '3 rooms'))}</button>
      <button type="button" class="fbtn" data-rooms="4">${T(P('4+ / penthouse', '4+ / penthouse'))}</button>
      <button type="button" class="fbtn" id="fFloor" hidden></button>
    </div>
    <div class="ulist" id="ulist" aria-live="polite"></div>
    <div class="tp-foot">
      <div class="legend"><span><i style="background:#7fb08a"></i>${T(P('Wszystkie dane są przykładowe', 'All data is illustrative'))}</span></div>
      ${Button({ label: BRAND.cta.askConcierge, id: 'askBtn', variant: 'solid' })}
    </div>
  </aside>
</div>`;
}
