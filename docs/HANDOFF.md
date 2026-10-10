# Handoff

## First commands

From the project directory:

1. npm install (only if dependencies are absent).
2. npm run dev — inspect at http://localhost:5173.
3. npm run build — ensure the production build completes.
4. npm run preview — inspect the generated dist/ output.

## What to inspect manually

A scripted build and headless-browser pass cannot prove visual quality on every device/GPU. Do a real browser/device pass at approximately 360 px, 768 px and 1440 px widths.

- Header navigation, language switch and mobile menu focus / Escape behavior.
- Hero media and the scroll transition between the hero slab and full-bleed composition.
- Architecture drawing and annotations.
- Concept tower: wait for the lazy-loaded model, drag to rotate, select a floor, test room filters, and move the day/night slider. Sample layout records have no real prices or availability.
- Residence cards: open each details dialog; verify SVG plans render and close restores focus.
- Interiors / daily rhythm sections: scroll-stage transitions and mobile sticky behavior.
- Gallery lightbox: keyboard open / close, Escape and focus return.
- Enquiry form: invalid data shows errors, valid demo data reports local validation only and is not transmitted.
- Concierge chat: default response states that it is a demo. No sales booking/contact is available.
- Reduced-motion preference and keyboard navigation.
- Browser console and network: check for rejected imports, WebGL/WebGPU fallback, and any missing local assets.

## Configuration points

- Brand and disclaimer: src/content/brand.js.
- Bilingual copy/data: src/content/*.js.
- Media path registry: src/config/assets.js.
- Concept inventory/layout generator: src/content/units.js.
- Design tokens and motion: src/styles/tokens.css and src/motion/.
- 3D scene / lifecycle: src/webgl/tower-scene.js and src/sections/tower.js.
- Demo chat and form: src/features/concierge-chat.js and src/behaviors/enquiry-form.js.
- Domain and integration values: .env.example and src/config/site.js.

## Before any real commercial launch

Do not merely change the brand name. A property owner/client must provide and approve: production domain, actual project address and rights, source-of-truth unit inventory/prices/statuses, architect-verified dimensions, programme/timeline, amenity specifications, real contact details, privacy/terms text, server-side enquiry/chat integrations, approved photography/renders and review of all image/third-party rights. Replace the demo layouts and procedural GLBs with proper architectural assets. Then remove noindex only after launch review and establish correct canonical / social image metadata.
