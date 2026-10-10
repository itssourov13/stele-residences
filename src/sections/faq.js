import { FAQ as C } from '../content/faq.js';
import { BRAND } from '../content/brand.js';
import { T } from '../i18n/index.js';
import { Button } from '../components/button.js';
import { SectionIntro } from '../components/section-intro.js';

export function render() {
  return `<section class="faq section section--graphite" id="faq" aria-labelledby="faqTitle">
  <div class="wrap faq__grid">
    <div class="faq__side">${SectionIntro({ plate: '09', label: C.label, title: C.title, lede: C.lede, headingId: 'faqTitle' })}${Button({ label: BRAND.cta.askConcierge, id: 'faqAsk', variant: 'line' })}</div>
    <div class="faq__list">${C.items.map((it) => `<details><summary>${T(it.q)}</summary><div class="faq__a">${T(it.a)}</div></details>`).join('')}</div>
  </div>
</section>`;
}
