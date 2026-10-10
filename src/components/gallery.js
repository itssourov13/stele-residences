import { A } from '../i18n/index.js';
import { getAsset } from '../config/assets.js';
import { MediaFrame } from './media-frame.js';

/**
 * Asymmetric gallery grid. `items` = [{ asset: 'registry.key', span: 'tall' | 'wide' }]. Each item is a button that opens the lightbox
 * (behaviors/lightbox.js reads the <img> inside). Works with any number of items; add real media in config/assets.js.
 */
export function Gallery(items) {
  return `<div class="gallery" id="gallery" role="list">${items.map((it, i) => {
    const a = getAsset(it.asset);
    return `<button class="gallery__item gallery__item--${it.span || 'wide'}" type="button" role="listitem" data-gallery-index="${i}"${a ? A({ 'aria-label': a.alt }) : ''}>${MediaFrame(it.asset, { ratio: it.span === 'tall' ? '3/4' : '4/3', parallax: i % 2 ? 4 : -4, className: 'gallery__media' })}</button>`;
  }).join('')}</div>`;
}
