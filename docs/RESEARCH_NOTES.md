# UI / media research notes

Research pass: 2026-10-10

Scope: visual consistency, interiors media pairing, and reference-image provenance for the fictional STELE Residences concept.

## Design observations applied

- Keep the primary editorial experience on one coherent graphite / mineral-dark palette. A full-width pale section interrupts the dark canvas and changes inherited text, border, accent, and media-placeholder colors; use small tonal changes between dark surfaces instead.
- Let room photography and its corresponding short copy read as one pair. The desktop version can use a sticky image with scroll-linked text, but the image-to-copy gap should be controlled by content rhythm rather than oversized viewport units. At mobile widths, use one image directly in each room card and its matching copy rather than forcing the desktop sticky pattern.
- A detail gallery should stay within the section's subject. Mixing the hero tower, a pool, and a city image into the interiors gallery makes the captions and media feel unrelated; the updated gallery focuses on the four interior references and four material studies.
- Use local optimized WebP derivatives in the app. The browser should not have to fetch the original image CDN at runtime, and missing upstream image hosts should not break the layout.
- Preserve readable warm-ivory text and subdued secondary copy on the dark surfaces. WCAG 2.2 AA's baseline contrast requirement is 4.5:1 for normal text and 3:1 for large text. Validate actual pairs when changing tokens; don't assume an attractive color combination automatically passes.

## Public design references

- [ARQEN Residences — L30 Creatives](https://www.l30creatives.com/work/arqen-residences): residential presentation reference for image-led editorial hierarchy and restrained typography.
- [Monument House concept — The Arising](https://www.thearising.co/work/monument-house-concept): reference for close-range architectural/material imagery used as a visual story.
- [W3C WCAG 2.2 — Understanding contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum): authoritative contrast thresholds used as the accessibility baseline.

These are visual references only; STELE's design and fictitious project data are not represented as belonging to any real development.

## Photography reviewed and added

| Local file | Source / contributor | Use in STELE |
|---|---|---|
| `public/assets/interiors/living.webp` | [Brian Zajac — Unsplash photo 0Etkz8lNLTM](https://unsplash.com/photos/0Etkz8lNLTM) | High-ceiling living room with natural light; replaced the earlier small domestic living-room image. |
| `public/assets/interiors/kitchen.webp` | [GoodLifeConstruction — Unsplash photo Jl5BfxX089Q](https://unsplash.com/photos/Jl5BfxX089Q) | Light timber kitchen and island; replaced an unrelated rustic living-room scene. |
| `public/assets/interiors/terrace.webp` | [Studio Archifiction — Unsplash photo lla3HZ5Sgm8](https://unsplash.com/photos/lla3HZ5Sgm8) | Panoramic glazing and greenery; the displayed room label is now “Panoramic glazing”, so the copy matches what the image depicts. |

The assets were downloaded from their public Unsplash photo pages, resized/cropped to 1440×990, re-encoded as WebP, and kept locally. The exact CDN endpoints and general licence/third-party-rights notes are in [IMAGE_CREDITS.md](IMAGE_CREDITS.md). New images are reference photography, not actual STELE interiors. Unsplash's licence is subject to its conditions, and depiction of identifiable people, brands, artwork or private property may raise separate rights questions; review such details before any commercial property use.

## Implementation notes

- Main story sections now use the root graphite tokens, with a subtle surface-2 shift for Interiors rather than an ivory/stone light-theme block.
- The facade drawing's strokes and labels now use the light-on-dark palette so the architecture section remains legible after its theme change.
- The interiors layout uses a less aggressive column gap, bounded text-column spacing, a smaller responsive text rhythm, matching mobile room media, and an interiors-only gallery.
- No external inspiration component or runtime image dependency was added. Existing Vite, GSAP, Lenis and three.js architecture was preserved.

## Remaining manual review

- Check real-device GPU / WebGL performance and touch interactions; headless rendering cannot certify physical-device frame rate or heat.
- Before representing a real property, replace references with owner-approved photographs/renders and verify the underlying project facts. This repository remains a fictional concept showcase.
