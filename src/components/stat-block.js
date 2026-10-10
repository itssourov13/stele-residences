import { T } from '../i18n/index.js';

/** Figure + label. Numeric `value` count-ups; string `text` renders as is (e.g. "2,8 m"). */
export function StatBlock({ value, text, unit, label, className = '' } = {}) {
  const v = text != null ? `<span>${text}</span>` : `<span data-count="${value}">0</span>`;
  return `<div class="stat ${className}"><p class="stat__value">${v}${unit ? `<span class="stat__unit">${unit}</span>` : ''}</p><p class="stat__label">${T(label)}</p></div>`;
}
