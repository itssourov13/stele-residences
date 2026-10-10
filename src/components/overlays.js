import { BRAND } from '../content/brand.js';
import { T, A } from '../i18n/index.js';
import { BrandMark } from './brand-mark.js';

export function Lightbox() {
  return `<dialog class="lightbox" id="lightbox"${A({ 'aria-label': { pl: 'Podgląd zdjęcia', en: 'Photo viewer' } })}>
  <button class="lightbox__close" id="lbClose" type="button"${A({ 'aria-label': { pl: 'Zamknij', en: 'Close' } })}>×</button>
  <button class="lightbox__nav lightbox__prev" id="lbPrev" type="button"${A({ 'aria-label': { pl: 'Poprzednie', en: 'Previous' } })}>‹</button>
  <img id="lbImg" alt="">
  <button class="lightbox__nav lightbox__next" id="lbNext" type="button"${A({ 'aria-label': { pl: 'Następne', en: 'Next' } })}>›</button>
  <p class="lightbox__cap mono" id="lbCap"></p>
</dialog>`;
}

/** Shell for the residence detail sheet; content is filled by behaviors/residence-dialog.js from content/residences.js. */
export function ResidenceDialog() {
  return `<dialog class="sheet" id="residenceDialog" aria-labelledby="resDialogTitle">
  <button class="sheet__close" id="resDialogClose" type="button"${A({ 'aria-label': { pl: 'Zamknij', en: 'Close' } })}>×</button>
  <div class="sheet__body" id="resDialogBody"></div>
</dialog>`;
}

/** Concierge chat (behaviour: features/concierge-chat.js; ids are its contract). */
export function ConciergeWidget() {
  const name = BRAND.concierge.name;
  return `<button class="fab" type="button" id="fab"${A({ 'aria-label': { pl: `Porozmawiaj z ${name} - przewodniczka po koncepcji ${BRAND.name}`, en: `Talk to ${name} - ${BRAND.name} concept guide` } })}>
  <span class="fdot"></span>
  <span class="fic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 1 4.5 7.8L3 21l1.2-4.5A8.96 8.96 0 0 1 3 12Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></svg></span>
  <span class="flbl">${T(BRAND.cta.viewing)}</span>
</button>
<div class="chat" id="chat" role="dialog"${A({ 'aria-label': { pl: `Czat z ${name}`, en: `Chat with ${name}` } })}>
  <div class="chead">
    <div class="cav" aria-hidden="true">${BrandMark({ variant: 'glyph' })}</div>
    <div class="ctit"><b>${name} · ${BRAND.name}</b><small>${T({ pl: 'wersja demonstracyjna · bez backendu', en: 'demo mode · no backend' })}</small></div>
    <button class="cclose" type="button" id="cclose"${A({ 'aria-label': { pl: 'Zamknij', en: 'Close' } })}>×</button>
  </div>
  <div class="cbody" id="cbody" aria-live="polite"></div>
  <div class="cchips" id="cchips"></div>
  <div class="cfoot">
    <div class="cinput">
      <textarea id="cinput" rows="1" maxlength="500"${A({ placeholder: { pl: 'Napisz wiadomość…', en: 'Write a message…' }, 'aria-label': { pl: 'Wiadomość do concierge', en: 'Message to the concierge' } })}></textarea>
      <button class="csend" id="csend" type="button"${A({ 'aria-label': { pl: 'Wyślij', en: 'Send' } })}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>
    </div>
    <div class="cmeta"><span>${T({ pl: `Agent AI · ${BRAND.name}`, en: `AI agent · ${BRAND.name}` })}</span><span class="clim" id="climit"></span></div>
    <div class="cdone" id="cdone"><a class="btn btn--solid" href="#enquiry">${T({ pl: 'Wróć do formularza demo', en: 'Return to demo form' })}</a></div>
  </div>
</div>`;
}
