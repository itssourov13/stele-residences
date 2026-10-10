import { T } from '../i18n/index.js';
import { BRAND } from '../content/brand.js';
import { MediaFrame } from './media-frame.js';
import { Button } from './button.js';

/** Residence collection card. `res` comes from content/residences.js (numbers are computed from the inventory). */
export function ResidenceCard(res, { index = 0 } = {}) {
  const free = { pl: 'dane demonstracyjne · brak oferty', en: 'illustrative data · not an offer' };
  return `<article class="res-card" data-res="${res.id}" aria-labelledby="res-${res.id}-t">
  ${MediaFrame(res.asset, { ratio: '4/5', className: 'res-card__media', parallax: 5 })}
  <div class="res-card__body">
    <p class="mono res-card__kind"><span>0${index + 1}</span> ${T(res.kind)} · ${T(res.floorsLabel)}</p>
    <h3 id="res-${res.id}-t" class="res-card__name">${res.name}</h3>
    <p class="res-card__sum">${T(res.summary)}</p>
    <dl class="specs">
      <div><dd>${res.areaLabel}</dd><dt>${T({ pl: 'metraż', en: 'area' })}</dt></div>
      <div><dd>${T(res.roomsLabel)}</dd><dt>${T({ pl: 'układ', en: 'layout' })}</dt></div>
      <div><dd>${res.outdoor.value}</dd><dt>${T(res.outdoor.label)}</dt></div>
    </dl>
    <p class="res-card__price"><b>${T(res.priceFrom)}</b><small>${T(free)}</small></p>
    <div class="res-card__actions">
      ${Button({ label: BRAND.cta.seePlan, variant: 'line', data: { 'open-residence': res.id } })}
      ${Button({ label: BRAND.cta.askConcierge, variant: 'text', className: 'ask-type', data: { type: `${res.name} ${res.kind.pl}` } })}
    </div>
  </div>
</article>`;
}

/** Landmark row for the location section; hovering it highlights the matching marker on the rings. */
export function LocationCard(l, i) {
  return `<li class="loc-card" data-landmark="${l.id}" tabindex="0"><span class="mono loc-card__min">${String(l.minutes).padStart(2, '0')}<small>min</small></span><span class="loc-card__name">${T(l.name)}</span><span class="loc-card__meta">${T(l.mode)} · ${T(l.note)}</span></li>`;
}
