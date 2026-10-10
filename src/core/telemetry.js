import { $, $$ } from './env.js';
import { SITE } from '../config/site.js';

/** STELE Pulse: anonymous, local-only interaction log (never leaves the browser). Read by pages/pulse.js. */
export function initTelemetry() {
  const pulse = (type, data) => {
    try {
      const k = SITE.storage.pulse;
      const arr = JSON.parse(localStorage.getItem(k) || '[]');
      arr.push(Object.assign({ t: Date.now(), type }, data || {}));
      while (arr.length > 400) arr.shift();
      localStorage.setItem(k, JSON.stringify(arr));
    } catch (e) { /* storage unavailable */ }
  };
  window.stelePulse = pulse;
  pulse('visit', {});

  const tb = $('#tbFloor');
  const c3d = $('#tower3d');
  if (c3d) c3d.addEventListener('click', () => pulse('tower_click', { floor: tb ? tb.textContent : '-' }));
  const ul = $('#ulist');
  if (ul) ul.addEventListener('click', (e) => { const c = e.target.closest('.ucard'); if (c) { const u = c.querySelector('.uid'); pulse('unit', { id: u ? u.textContent : '?' }); } });
  const tf = $('#tfilters');
  if (tf) tf.addEventListener('click', (e) => { const b = e.target.closest('.fbtn'); if (b) pulse('filter', { f: b.textContent.trim().slice(0, 20) }); });
  const dn = $('#dayNight');
  if (dn) dn.addEventListener('change', () => pulse('daynight', { v: Math.round(parseFloat(dn.value) * 100) / 100 }));
  $$('a[href^="/labs/drone-flight"]').forEach((a) => a.addEventListener('click', () => pulse('game_open', {})));
  const fab = $('#fab');
  if (fab) fab.addEventListener('click', () => pulse('chat_open', {}));
  $$('.faq__list details').forEach((d, i) => d.addEventListener('toggle', () => { if (d.open) pulse('faq', { q: i + 1 }); }));
  const gl = $('#gallery');
  if (gl) gl.addEventListener('click', (e) => { const f = e.target.closest('.gallery__item'); if (f) pulse('gallery', { g: f.dataset.galleryIndex }); });
}
