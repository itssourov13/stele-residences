import { $, $$ } from '../core/env.js';
import { getLang } from '../i18n/index.js';

/** Exclusive accordion on native <details> + "ask the concierge" shortcut. */
export function initFaq() {
  const all = $$('.faq__list details');
  all.forEach((d) => d.addEventListener('toggle', () => { if (d.open) all.forEach((o) => { if (o !== d && o.open) o.open = false; }); }));
  const ask = $('#faqAsk');
  if (ask) ask.addEventListener('click', () => window.steleMeet && window.steleMeet(getLang() === 'en' ? 'I have a question about STELE. ' : 'Mam pytanie o STELE. '));
}
