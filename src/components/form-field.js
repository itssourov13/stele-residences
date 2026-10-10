import { T, A } from '../i18n/index.js';
import { attrs, cls } from './util.js';

/** Labelled form control with an error slot wired through aria-describedby. type: text | email | tel | textarea | select | checkbox */
export function FormField({ id, name, label, type = 'text', required = false, options = [], rows = 3, autocomplete, maxlength, className } = {}) {
  const base = { id, name: name || id, required: required || undefined, autocomplete, maxlength, 'aria-describedby': `${id}-err` };
  let control;
  if (type === 'textarea') control = `<textarea ${attrs({ ...base, rows })}></textarea>`;
  else if (type === 'select') control = `<select ${attrs(base)}>${options.map((o) => `<option value="${o.value}">${typeof o.label === 'string' ? o.label : T(o.label)}</option>`).join('')}</select>`;
  else if (type === 'checkbox') return `<div class="${cls('field field--check', className)}"><input ${attrs({ ...base, type: 'checkbox' })}><label for="${id}">${T(label)}</label><p class="field__err" id="${id}-err" role="alert"></p></div>`;
  else control = `<input ${attrs({ ...base, type, inputmode: type === 'email' ? 'email' : type === 'tel' ? 'tel' : undefined })}>`;
  return `<div class="${cls('field', className)}"><label for="${id}">${T(label)}${required ? '' : ''}</label>${control}<p class="field__err" id="${id}-err" role="alert"></p></div>`;
}
