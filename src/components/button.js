import { T } from '../i18n/index.js';
import { cls, attrs } from './util.js';

const ARROW = '<svg class="btn__arrow" viewBox="0 0 20 10" aria-hidden="true" focusable="false"><path d="M0 5h18M14 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';

/** Button / link button. variant: solid | line | text. Renders <a> when href is set, else <button>. */
export function Button({ label, href, variant = 'solid', magnetic = false, arrow = false, type = 'button', id, className, data = {}, aria } = {}) {
  const common = {
    id, class: cls('btn', `btn--${variant}`, magnetic && 'magnetic', className), ...Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v])), ...aria
  };
  const inner = `<span class="btn__label">${T(label)}</span>${arrow || variant === 'text' ? ARROW : ''}`;
  return href ? `<a ${attrs({ ...common, href })}>${inner}</a>` : `<button ${attrs({ ...common, type })}>${inner}</button>`;
}
