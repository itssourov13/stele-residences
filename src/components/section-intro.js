import { T } from '../i18n/index.js';
import { cls } from './util.js';

/** Plate label + heading + lede. The plate line ("N° 02 ── Architecture") is the brand's section-label language. */
export function SectionIntro({ plate, label, title, lede, headingId, align = 'left', className, level = 2 } = {}) {
  return `<header class="${cls('intro', `intro--${align}`, className)}">
  <p class="plate"><span class="plate__no">N°&nbsp;${plate}</span><span class="plate__rule" aria-hidden="true"></span><span class="plate__label">${T(label)}</span></p>
  <h${level} class="intro__title" ${headingId ? `id="${headingId}"` : ''} data-motion="wipe">${T(title)}</h${level}>
  ${lede ? `<p class="intro__lede">${T(lede)}</p>` : ''}
</header>`;
}
