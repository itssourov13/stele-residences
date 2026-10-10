import { getAsset, url } from '../config/assets.js';
import { A, T } from '../i18n/index.js';
import { cls } from './util.js';

/**
 * Media slot. Resolves an asset-registry key ("hero.main") and renders:
 *   placeholder (architectural strata surface + slot label)  <  responsive <picture>  <  optional looping <video>
 * The image fades in over the placeholder when it loads (behaviors/media.js adds .is-loaded); if the file is missing the
 * placeholder simply stays, so unfinished media never looks broken. Videos load lazily and play only while visible.
 *
 * opts: ratio, focal (override registry), eager, parallax (number, +-8), reveal (mask reveal on scroll), caption (pair), sizes, className, video (bool, default true when registered)
 */
export function MediaFrame(key, o = {}) {
  const a = typeof key === 'string' ? getAsset(key) : key;
  if (!a) return `<figure class="media media--empty" data-asset="${key}"></figure>`;
  const ratio = o.ratio || a.ratio || '4/3', focal = o.focal || a.focal || '50% 50%';
  const base = a.src.replace(/\.[a-z0-9]+$/i, ''), ext = (a.src.match(/\.([a-z0-9]+)$/i) || [, 'jpg'])[1];
  const set = (fmt) => (a.widths ? a.widths.map((w) => `${url(`${base}-${w}.${fmt}`)} ${w}w`).join(', ') : url(`${base}.${fmt}`));
  const sources = (a.formats || []).map((f) => `<source type="image/${f}" srcset="${set(f)}" sizes="${o.sizes || '100vw'}">`).join('');
  const srcset = a.widths ? ` srcset="${set(ext)}" sizes="${o.sizes || '100vw'}"` : '';
  const isSvg = ext === 'svg';
  const video = a.video && o.video !== false
    ? `<video class="media__video" muted loop playsinline preload="none" aria-hidden="true" data-src="${url(a.video)}"${a.poster ? ` poster="${url(a.poster)}"` : ''}${o.eager ? ' data-autoplay="eager"' : ''}></video>` : '';
  const alt = a.alt && (a.alt.pl || a.alt.en) ? A({ alt: a.alt }) : ' alt=""';
  return `<figure class="${cls('media', isSvg && 'media--drawing', o.className)}" style="--ratio:${ratio};--focal:${focal}" data-media data-asset="${key}"${o.parallax ? ` data-parallax="${o.parallax}"` : ''}${o.reveal ? ' data-motion="mask"' : ''}>
  <div class="media__ph" aria-hidden="true"><span class="media__slot">${a.slot || key}</span><span class="media__ratio">${ratio.replace('/', ' : ')}</span></div>
  <picture class="media__pic">${sources}<img src="${url(a.src)}"${srcset}${alt} loading="${o.eager ? 'eager' : 'lazy'}" decoding="async"${o.eager ? ' fetchpriority="high"' : ''}></picture>
  ${video}${o.caption ? `<figcaption class="media__cap">${T(o.caption)}</figcaption>` : ''}
</figure>`;
}
