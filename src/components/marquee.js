import { T } from '../i18n/index.js';

/** Slow horizontal word band. Second copy is aria-hidden; animation is CSS only and stops under reduced motion. */
export function Marquee({ items, speed = 60, label } = {}) {
  const row = (hidden) => `<ul class="marquee__row"${hidden ? ' aria-hidden="true"' : ''}>${items.map((w) => `<li>${T(w)}</li>`).join('')}</ul>`;
  return `<div class="marquee" style="--marquee-speed:${speed}s" role="group"${label ? ` aria-label="${label}"` : ''}><div class="marquee__track">${row(false)}${row(true)}</div></div>`;
}
