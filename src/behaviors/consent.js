import { $ } from '../core/env.js';
import { SITE } from '../config/site.js';

export function initConsent() {
  try { if (localStorage.getItem(SITE.storage.consent) === '1') return; } catch (e) {}
  const c = $('#consent'); if (!c) return;
  c.classList.add('is-visible');
  $('#consentOk').onclick = () => { try { localStorage.setItem(SITE.storage.consent, '1'); } catch (e) {} c.classList.remove('is-visible'); };
}
