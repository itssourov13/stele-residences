import { T } from '../i18n/index.js';
import { cls } from './util.js';

/** Copy block with up to two actions (already rendered Buttons). */
export function CtaBlock({ title, text, actions = [], className } = {}) {
  return `<div class="${cls('cta', className)}">${title ? `<h3 class="cta__title">${T(title)}</h3>` : ''}${text ? `<p class="cta__text">${T(text)}</p>` : ''}<div class="cta__actions">${actions.join('')}</div></div>`;
}

/** Two-column editorial split. `media` and `body` are rendered strings. */
export function SplitContent({ media, body, reverse = false, className, ratio = '1.1fr 1fr' } = {}) {
  return `<div class="${cls('split', reverse && 'split--reverse', className)}" style="--split:${ratio}"><div class="split__media">${media}</div><div class="split__body">${body}</div></div>`;
}
