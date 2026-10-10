/**
 * Bilingual strings are plain objects { pl, en }. Components render them through T() (element text) and A() (attributes);
 * each call registers the pair so switching language only swaps text in place (no re-render, GSAP/WebGL state survives).
 * Missing English is reported once in dev, so "no missing translations" is checkable from the console.
 */
import { SITE } from '../config/site.js';

const REG = new Map();
const warned = new Set();
let seq = 0;
let LANG = 'pl';

export const getLang = () => LANG;
export const isEN = () => LANG === 'en';
export const plain = (s) => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const attrEsc = (s) => plain(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function pick(p, lang = LANG) {
  if (p == null) return '';
  if (typeof p === 'string') return p;
  const v = p[lang];
  if (v == null && import.meta.env.DEV && !warned.has(p.pl)) { warned.add(p.pl); console.warn('[i18n] missing', lang, 'for:', p.pl); }
  return v != null ? v : p.pl;
}

/** Element text. Returns <span data-i18n="id">text</span>; <br> and <b> are allowed in strings. */
export function T(p) {
  if (p == null || p === '') return '';
  if (typeof p === 'string') return p;
  const id = 't' + seq++;
  REG.set(id, p);
  return `<span data-i18n="${id}">${pick(p)}</span>`;
}

/** Translated attributes: A({ 'aria-label': pair, alt: pair }) -> ` aria-label="..." data-i18n-attrs="aria-label:t1;alt:t2"` */
export function A(map) {
  const parts = [], out = [];
  for (const [name, p] of Object.entries(map)) {
    if (p == null) continue;
    if (typeof p === 'string') { out.push(`${name}="${attrEsc(p)}"`); continue; }
    const id = 't' + seq++; REG.set(id, p);
    out.push(`${name}="${attrEsc(pick(p))}"`); parts.push(`${name}:${id}`);
  }
  return ' ' + out.join(' ') + (parts.length ? ` data-i18n-attrs="${parts.join(';')}"` : '');
}

export function detectLang() {
  const q = new URLSearchParams(location.search).get('lang');
  let saved = null; try { saved = localStorage.getItem(SITE.storage.lang); } catch (e) {}
  const navPL = (navigator.languages || [navigator.language || '']).some((l) => /^pl\b/i.test(l));
  const bot = /bot|crawl|spider|slurp|lighthouse|headless|inspection/i.test(navigator.userAgent);
  return q === 'en' || q === 'pl' ? q : (saved || (bot || navPL ? 'pl' : 'en'));
}
export function setInitialLang(l) { LANG = l; document.documentElement.lang = l; }

export function applyLang(l, manual) {
  LANG = l;
  if (manual) { try { localStorage.setItem(SITE.storage.lang, l); } catch (e) {} }
  document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach((el) => { const p = REG.get(el.dataset.i18n); if (p) el.innerHTML = pick(p); });
  document.querySelectorAll('[data-i18n-attrs]').forEach((el) => el.dataset.i18nAttrs.split(';').forEach((pair) => {
    const [name, id] = pair.split(':'); const p = REG.get(id); if (p) el.setAttribute(name, attrEsc(pick(p)));
  }));
  document.querySelectorAll('.lang button').forEach((b) => { const on = b.dataset.lang === l; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
  if (window.steleRenderUnits) window.steleRenderUnits();
  document.dispatchEvent(new CustomEvent('stele:lang', { detail: l }));
}

/** Language switcher buttons live in the header and mobile menu. */
export function bindLangSwitch() {
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang, true)));
}
