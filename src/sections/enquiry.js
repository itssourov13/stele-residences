import { ENQUIRY as C } from '../content/enquiry.js';
import { BRAND } from '../content/brand.js';
import { RESIDENCES } from '../content/residences.js';
import { SITE } from '../config/site.js';
import { T } from '../i18n/index.js';
import { SectionIntro } from '../components/section-intro.js';
import { CtaBlock } from '../components/cta-block.js';
import { Button } from '../components/button.js';
import { FormField } from '../components/form-field.js';

export function render() {
  const opts = [...RESIDENCES.map((r) => ({ value: `${r.name} ${r.kind.pl}`, label: `${r.name} · ${r.kind.pl}` })), { value: '', label: C.fields.any }];
  return `<section class="enquiry section" id="enquiry" aria-labelledby="enqTitle">
  <div class="wrap enquiry__grid">
    <div class="enquiry__copy">
      ${SectionIntro({ plate: C.plate, label: C.label, title: C.title, lede: C.lede, headingId: 'enqTitle' })}
      ${CtaBlock({ actions: [
        Button({ label: { pl: `Porozmawiaj z ${BRAND.concierge.name}`, en: `Talk to ${BRAND.concierge.name}` }, id: 'cChat', variant: 'solid', magnetic: true }),
        Button({ label: { pl: 'Przeczytaj założenia', en: 'Read the design intent' }, href: '#manifesto', variant: 'line', magnetic: true })
      ] })}
      <ul class="trust">${C.trust.map((t) => `<li>${T(t)}</li>`).join('')}</ul>
    </div>
    <div class="enquiry__panel">
      <form class="form" id="enquiryForm" novalidate>
        ${FormField({ id: 'enName', name: 'name', label: C.fields.name, required: true, autocomplete: 'name' })}
        ${FormField({ id: 'enMail', name: 'email', label: C.fields.email, type: 'email', required: true, autocomplete: 'email' })}
        ${FormField({ id: 'enPhone', name: 'phone', label: C.fields.phone, type: 'tel', autocomplete: 'tel' })}
        ${FormField({ id: 'enType', name: 'interest', label: C.fields.interest, type: 'select', options: opts })}
        ${FormField({ id: 'enMsg', name: 'message', label: C.fields.message, type: 'textarea', maxlength: 600 })}
        ${FormField({ id: 'enConsent', name: 'consent', label: C.fields.consent, type: 'checkbox', required: true })}
        <p class="form__note" id="enNote">${SITE.enquiryMode === 'endpoint' ? '' : T(C.demoNote)}</p>
        ${Button({ label: C.send, variant: 'solid', type: 'submit', id: 'enSubmit' })}
      </form>
      <div class="form__done" id="enDone" role="status" aria-live="polite" hidden><h3>${T(C.success.title)}</h3><p>${T(C.success.text)}</p></div>
    </div>
  </div>
</section>`;
}
