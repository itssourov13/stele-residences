import { BRAND } from '../content/brand.js';
import { T, A } from '../i18n/index.js';

/** Wordmark: the slab glyph (a tall stone with strata courses) + tracked name. variant: 'inline' | 'stacked' | 'glyph' */
export function BrandMark({ variant = 'inline', href = '#hero' } = {}) {
  const glyph = `<svg class="brand__slab" viewBox="0 0 14 40" aria-hidden="true" focusable="false"><rect x=".5" y=".5" width="13" height="39" rx="1" fill="none" stroke="currentColor"/><path d="M1 8.5h12M1 16.5h12M1 24.5h12M1 32.5h12" stroke="currentColor" stroke-opacity=".45"/></svg>`;
  if (variant === 'glyph') return glyph;
  const inner = `${glyph}<span class="brand__text"><span class="brand__word">${BRAND.name}</span>${variant === 'stacked' ? `<span class="brand__sub">${T(BRAND.descriptor)}</span>` : ''}</span>`;
  return `<a class="brand brand--${variant}" href="${href}"${A({ 'aria-label': { pl: `${BRAND.name} - początek strony`, en: `${BRAND.name} - top of page` } })}>${inner}</a>`;
}
