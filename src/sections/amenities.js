import { AMENITIES as C } from '../content/amenities.js';
import { SectionIntro } from '../components/section-intro.js';
import { MediaFrame } from '../components/media-frame.js';
import { SplitContent } from '../components/cta-block.js';
import { T } from '../i18n/index.js';

export function render() {
  const groups = C.groups.map((g, i) => SplitContent({
    reverse: i % 2 === 1, className: `amen amen--${g.id}`,
    media: `<div class="amen__layers">${MediaFrame(g.asset, { ratio: '4/5', reveal: true, parallax: 5, className: 'amen__main' })}${MediaFrame(g.asset2, { ratio: '4/3', reveal: true, parallax: -6, className: 'amen__inset' })}</div>`,
    body: `<p class="mono amen__no">0${i + 1}</p><h3 class="amen__title">${T(g.title)}</h3><p class="amen__lede">${T(g.lede)}</p><ul class="amen__items">${g.items.map((it) => `<li><b>${T(it.t)}</b><span>${T(it.d)}</span></li>`).join('')}</ul>`
  })).join('');
  return `<section class="amenities section" id="amenities" aria-labelledby="amenTitle"><div class="wrap">${SectionIntro({ plate: C.plate, label: C.label, title: C.title, headingId: 'amenTitle' })}<div class="amen__groups">${groups}</div></div></section>`;
}
