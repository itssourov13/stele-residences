import { Preloader, Header, MobileMenu, FloorRail, Footer, ConsentBanner } from '../components/chrome.js';
import { Lightbox, ResidenceDialog, ConciergeWidget } from '../components/overlays.js';
import * as hero from '../sections/hero.js';
import * as manifesto from '../sections/manifesto.js';
import * as architecture from '../sections/architecture.js';
import * as tower from '../sections/tower.js';
import * as residences from '../sections/residences.js';
import * as interiors from '../sections/interiors.js';
import * as amenities from '../sections/amenities.js';
import * as lifestyle from '../sections/lifestyle.js';
import * as location from '../sections/location.js';
import * as figures from '../sections/figures.js';
import * as faq from '../sections/faq.js';
import * as enquiry from '../sections/enquiry.js';

/** Page composition = narrative order. Add, remove or reorder sections here (and in content/navigation.js for the nav). */
export const SECTION_MODULES = [hero, manifesto, architecture, tower, residences, interiors, amenities, lifestyle, location, figures, faq, enquiry];

export function renderPage() {
  return [
    Preloader(),
    '<div class="cursor__dot" aria-hidden="true"></div><div class="cursor__ring" aria-hidden="true"></div>',
    Header(), MobileMenu(), FloorRail(),
    `<main id="main">${SECTION_MODULES.map((m) => m.render()).join('')}</main>`,
    Footer(), Lightbox(), ResidenceDialog(), ConciergeWidget(), ConsentBanner()
  ].join('\n');
}
