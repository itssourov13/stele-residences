import { BRAND } from '../content/brand.js';
import { SECTIONS, labLinks } from '../content/navigation.js';
import { LEGAL } from '../content/legal.js';
import { T, A } from '../i18n/index.js';
import { BrandMark } from './brand-mark.js';
import { Button } from './button.js';

const LangSwitch = () => `<div class="lang" role="group"${A({ 'aria-label': { pl: 'Język', en: 'Language' } })}><button type="button" data-lang="pl" aria-pressed="true" class="is-active">PL</button><button type="button" data-lang="en" aria-pressed="false">EN</button></div>`;

export function Preloader() {
  return `<div id="preloader" aria-hidden="true"><div class="pl-a"></div><div class="pl-b"></div><div class="pl-c">${BrandMark({ variant: 'glyph' })}<div class="pl-num" id="plNum">00</div></div></div>`;
}

/** Fixed header: wordmark, section links (active state set by behaviors/nav.js), language, CTA, burger. */
export function Header() {
  const links = SECTIONS.filter((s) => s.nav).map((s) => `<a href="#${s.id}">${T(s.label)}</a>`).join('');
  return `<header class="site-header" id="siteHeader">
  ${BrandMark({ variant: 'inline' })}
  <nav class="site-nav" id="siteNav"${A({ 'aria-label': { pl: 'Główna nawigacja', en: 'Primary navigation' } })}>${links}</nav>
  <div class="site-header__tools">
    ${LangSwitch()}
    ${Button({ label: BRAND.cta.viewing, href: '#enquiry', variant: 'line', className: 'site-header__cta' })}
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="mobileMenu"${A({ 'aria-label': { pl: 'Menu', en: 'Menu' } })}><span></span><span></span></button>
  </div>
</header>`;
}

export function MobileMenu() {
  const items = SECTIONS.filter((s) => s.menu).map((s) => `<a href="#${s.id}">${T(s.label)}</a>`).join('');
  return `<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true"${A({ 'aria-label': { pl: 'Menu', en: 'Menu' } })} inert>
  <nav class="mobile-menu__nav"${A({ 'aria-label': { pl: 'Menu mobilne', en: 'Mobile menu' } })}>${items}</nav>
  <div class="mobile-menu__foot">${LangSwitch()}<span class="mobile-menu__demo">${T({ pl: 'Projekt koncepcyjny · brak kontaktu sprzedażowego', en: 'Concept project · no sales contact' })}</span>${labLinks.map((l) => `<a href="${l.href}">${T(l.label)}</a>`).join('')}</div>
</div>`;
}

export function FloorRail() {
  return `<aside class="floor-rail" id="floorRail" aria-hidden="true"><b id="railNum">01</b><i id="railTicks"></i><span>${T({ pl: 'piętro', en: 'floor' })}</span></aside>`;
}

export function Footer() {
  const col = SECTIONS.filter((s) => s.menu).map((s) => `<li><a href="#${s.id}">${T(s.label)}</a></li>`).join('');
  return `<footer class="site-footer">
  <div class="site-footer__top">
    <div class="site-footer__brand">${BrandMark({ variant: 'stacked' })}<p class="site-footer__tag">${T(BRAND.tagline)}</p></div>
    <nav class="site-footer__col"${A({ 'aria-label': { pl: 'Mapa strony', en: 'Site map' } })}><ul>${col}</ul></nav>
    <div class="site-footer__col"><p class="mono">${T({ pl: 'Nota projektu', en: 'Project note' })}</p><p>${T({ pl: 'Fikcyjne studium architektoniczne. Brak rzeczywistej oferty lub punktu sprzedaży.', en: 'Fictional architectural study. No live offering or sales office.' })}</p><p><a href="#manifesto">${T({ pl: 'Przeczytaj założenia', en: 'Read the design intent' })}</a></p></div>
    <div class="site-footer__col"><p class="mono">Labs</p><ul>${labLinks.map((l) => `<li><a href="${l.href}">${T(l.label)}</a></li>`).join('')}</ul></div>
  </div>
  <div class="site-footer__word" aria-hidden="true">${BRAND.name}</div>
  <div class="site-footer__legal"><p>${T(BRAND.disclaimer)}</p><p id="${LEGAL.privacyId}">${T(LEGAL.privacy)}</p><p class="mono">© ${new Date().getFullYear()} ${BRAND.legalName}</p></div>
</footer>`;
}

export function ConsentBanner() {
  return `<div id="consent" role="region"${A({ 'aria-label': { pl: 'Informacja o prywatności', en: 'Privacy notice' } })}><p>${T(LEGAL.consent.text)}</p>${Button({ label: LEGAL.consent.ok, id: 'consentOk', variant: 'solid' })}</div>`;
}
