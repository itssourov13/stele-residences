import { LIFESTYLE as C } from '../content/lifestyle.js';
import { SectionIntro } from '../components/section-intro.js';
import { MediaFrame } from '../components/media-frame.js';
import { T } from '../i18n/index.js';

export function render() {
  const frames = C.moments.map((m, i) => `<div class="swap__frame${i ? '' : ' is-active'}" data-swap-frame="m${i}">${MediaFrame(m.asset, { ratio: '4/5', className: 'swap__media' })}</div>`).join('');
  const items = C.moments.map((m, i) => `<article class="swap__item life__item${i ? '' : ' is-active'}" data-swap-item="m${i}"><p class="life__time" aria-hidden="true">${m.time}</p><h3><span class="sr-only">${m.time} · </span>${T(m.title)}</h3><p>${T(m.text)}</p></article>`).join('');
  return `<section class="life section" id="lifestyle" aria-labelledby="lifeTitle" data-tone="dusk">
  <div class="wrap">${SectionIntro({ plate: C.plate, label: C.label, title: C.title, headingId: 'lifeTitle' })}</div>
  <div class="swap swap--reverse wrap" data-swap><div class="swap__stage"><div class="swap__frames">${frames}</div></div><div class="swap__list">${items}</div></div>
</section>`;
}
