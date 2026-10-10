import { INTERIORS as C } from '../content/interiors.js';
import { ASSETS } from '../config/assets.js';
import { SectionIntro } from '../components/section-intro.js';
import { MediaFrame } from '../components/media-frame.js';
import { Gallery } from '../components/gallery.js';
import { T } from '../i18n/index.js';

export function render() {
  const frames = C.rooms.map((r, i) => `<div class="swap__frame${i ? '' : ' is-active'}" data-swap-frame="${r.id}">${MediaFrame(r.asset, { ratio: '16/11', className: 'swap__media' })}</div>`).join('');
  const items = C.rooms.map((r, i) => `<article class="swap__item${i ? '' : ' is-active'}" data-swap-item="${r.id}">
    <div class="swap__mobile-media">${MediaFrame(r.asset, { ratio: '16/11', className: 'swap__mobile-frame' })}</div>
    <p class="mono swap__no">0${i + 1} / 0${C.rooms.length}</p>
    <h3>${T(r.title)}</h3>
    <p>${T(r.text)}</p>
  </article>`).join('');
  const mats = C.materials.map((m, i) => `<figure class="material material--${i % 2 ? 'b' : 'a'}">${MediaFrame(m.asset, { ratio: '1/1', parallax: i % 2 ? 5 : -5 })}<figcaption><b>${T(m.name)}</b><span class="mono">${T(m.spec)}</span></figcaption></figure>`).join('');
  return `<section class="interiors section section--mineral" id="interiors" aria-labelledby="intTitle">
  <div class="wrap">${SectionIntro({ plate: C.plate, label: C.label, title: C.title, lede: C.lede, headingId: 'intTitle' })}</div>
  <div class="swap interiors__swap wrap" data-swap><div class="swap__stage"><div class="swap__frames">${frames}</div></div><div class="swap__list">${items}</div></div>
  <div class="wrap"><div class="materials">${mats}</div>
    <div class="gallery-head"><p class="plate"><span class="plate__rule" aria-hidden="true"></span><span class="plate__label">${T(C.gallery.label)}</span></p><p class="mono">${T(C.gallery.hint)}</p></div>
    ${Gallery(ASSETS.gallery)}
  </div>
</section>`;
}
