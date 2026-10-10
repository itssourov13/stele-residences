import { $, $$ } from '../core/env.js';
import { ENQUIRY as C } from '../content/enquiry.js';
import { BRAND } from '../content/brand.js';
import { SITE } from '../config/site.js';
import { pick, getLang } from '../i18n/index.js';

/**
 * Enquiry form: real validation + a swappable transport.
 *   mode 'mailto'   (default, no backend)  opens the mail client with a prefilled message
 *   mode 'endpoint' (VITE_ENQUIRY_ENDPOINT) POSTs JSON {name,email,phone,interest,message,lang}; expects 2xx.
 * To change the integration, edit only send() below.
 */
export function initEnquiryForm() {
  const form = $('#enquiryForm'); if (!form) return;
  const done = $('#enDone'), submit = $('#enSubmit');
  const setErr = (input, msg) => {
    const f = input.closest('.field'), out = $('#' + input.id + '-err');
    f.classList.toggle('has-error', !!msg); out.textContent = msg || '';
    msg ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
  };
  async function send(data) {
    if (SITE.enquiryMode !== 'endpoint' || !SITE.enquiryEndpoint) return;
    const r = await fetch(SITE.enquiryEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#enName'), mail = $('#enMail'), consent = $('#enConsent');
    const okN = name.value.trim().length > 1, okM = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim()), okC = consent.checked;
    setErr(name, okN ? '' : pick(C.errors.name)); setErr(mail, okM ? '' : pick(C.errors.email)); setErr(consent, okC ? '' : pick(C.errors.consent));
    if (!okN || !okM || !okC) { (!okN ? name : !okM ? mail : consent).focus(); return; }
    submit.disabled = true;
    try {
      await send({ name: name.value.trim(), email: mail.value.trim(), phone: $('#enPhone').value.trim(), interest: $('#enType').value, message: $('#enMsg').value.trim(), lang: getLang() });
      window.stelePulse && window.stelePulse('enquiry', {});
      form.hidden = true; done.hidden = false; done.focus && done.setAttribute('tabindex', '-1'); done.focus();
    } catch (err) { submit.disabled = false; $('#enNote').textContent = getLang() === 'en' ? 'The configured endpoint failed. No confirmation was sent.' : 'Skonfigurowany endpoint nie zadziałał. Nie wysłano potwierdzenia.'; }
  });
  $$('#enquiryForm input, #enquiryForm textarea').forEach((i) => i.addEventListener('input', () => setErr(i, '')));
}
