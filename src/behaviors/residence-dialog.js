import { $, $$ } from '../core/env.js';
import { RESIDENCES } from '../content/residences.js';
import { BRAND } from '../content/brand.js';
import { T } from '../i18n/index.js';
import { MediaFrame } from '../components/media-frame.js';
import { Button } from '../components/button.js';
import { initMedia } from './media.js';
import { lockScroll, unlockScroll } from '../motion/scroll.js';

/** Detail sheet for a residence collection: media, highlights, specs, floorplan slot. Content comes from content/residences.js. */
export function initResidenceDialog() {
  const dlg = $('#residenceDialog'), body = $('#resDialogBody'); if (!dlg) return;
  const fill = (r) => {
    body.innerHTML = `<div class="sheet__grid">
      <div class="sheet__media">${MediaFrame(r.asset, { ratio: '4/5' })}${MediaFrame(r.plan, { ratio: '4/3', className: 'sheet__plan' })}</div>
      <div class="sheet__text">
        <p class="mono">${T(r.kind)} · ${T(r.floorsLabel)}</p>
        <h2 id="resDialogTitle">${r.name}</h2>
        <p>${T(r.summary)}</p>
        <dl class="specs specs--table">
          <div><dt>${T({ pl: 'Metraż', en: 'Area' })}</dt><dd>${r.areaLabel}</dd></div>
          <div><dt>${T({ pl: 'Układ', en: 'Layout' })}</dt><dd>${T(r.roomsLabel)}</dd></div>
          <div><dt>${T({ pl: 'Ekspozycja', en: 'Orientation' })}</dt><dd>${T(r.orientation)}</dd></div>
          <div><dt>${T(r.outdoor.label)}</dt><dd>${r.outdoor.value}</dd></div>
          <div><dt>${T({ pl: 'Status danych', en: 'Data status' })}</dt><dd>${T(r.priceFrom)}</dd></div>
        </dl>
        <ul class="sheet__hl">${r.highlights.map((h) => `<li>${T(h)}</li>`).join('')}</ul>
        <div class="sheet__actions">${Button({ label: BRAND.cta.askConcierge, variant: 'solid', className: 'ask-type', data: { type: `${r.name} ${r.kind.pl}`, close: 'dialog' } })}${Button({ label: { pl: 'Zobacz w wieży', en: 'Find in the tower' }, href: '#tower', variant: 'line', data: { close: 'dialog' } })}</div>
      </div></div>`;
    initMedia(body);
  };
  let opener = null;
  $$('[data-open-residence]').forEach((b) => b.addEventListener('click', () => { opener = b; fill(RESIDENCES.find((r) => r.id === b.dataset.openResidence)); dlg.showModal(); lockScroll(); }));
  $('#resDialogClose').onclick = () => dlg.close();
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); const c = e.target.closest('[data-close="dialog"]'); if (c) dlg.close(); });
  dlg.addEventListener('close', () => { unlockScroll(); opener && opener.focus({ preventScroll: true }); });
}
