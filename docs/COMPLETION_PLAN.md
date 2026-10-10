# STELE Residences — completion plan and TODO

Updated: 2026-10-10. Scope is a complete fictional architectural concept website, not a production sales site for a real property.

## Phase 0 — Workspace and baseline

- [x] Confirmed the working directory and the separate parent-level stele-residences.zip backup.
- [x] Preserved the ZIP without modification.
- [x] Confirmed the workspace has no .git directory; no repository was initialized and no commits were created.
- [x] Inspected the existing code, media registry, package configuration and prototype-state documentation.

## Phase 1 — Public research and art direction

- [x] Reviewed the official Unsplash License and personal/commercial-use FAQ.
- [x] Reviewed Unsplash attribution guidance and third-party rights notes.
- [x] Kept the architectural editorial direction: mineral palette, Newsreader / Instrument Sans / IBM Plex Mono, restrained motion, Polish and English.
- [x] Curated photo references and recorded exact image-CDN request IDs / URLs in IMAGE_CREDITS.md; original photo-page / photographer attribution is explicitly left for verification because source-page requests were blocked.
- [x] Explicitly separated reference photography and concept-made assets from actual STELE project imagery.

## Phase 2 — Media and content

- [x] Rebuilt a consistent locally hosted WebP library for hero, architecture, collection typologies, interiors, programme mood, lifestyle and location context.
- [x] Corrected media-registry paths to actual extensions and verified registered files exist.
- [x] Replaced corrupt 6-byte SVG placeholders with three valid illustrative floorplan SVGs.
- [x] Added generated material swatches, an internally generated HDR set, decorative textures, an ambience WAV, a concept lobby panorama and an illustrated concierge persona.
- [x] Added small custom GLB tower and city massing models for the interactive scene.
- [x] Reworked hero, architecture, collections, interiors, programme, lifestyle, place context, FAQ, legal, form and concierge copy in both languages.
- [x] Removed fake contact details, production domain, construction completion statements, fabricated selling prices and live availability wording from the displayed UI.
- [x] Made concept inventory / plan / amenity status visible as illustrative.

## Phase 3 — Product, UX and resilience

- [x] Made the enquiry form validate locally in demo mode; it reports local completion and sends no data unless an endpoint is deliberately configured.
- [x] Made the default concierge response explicitly identify the interface as a demo; removed fabricated booking / priority claims.
- [x] Removed ApartmentComplex structured data for a fictional property.
- [x] Added noindex,nofollow and removed placeholder canonical / social-image URLs pending an approved deployment domain.
- [x] Preserved image placeholder resilience, reduced-motion support and existing keyboard / overlay behaviours.
- [x] Ran headless interaction checks for field errors, local form success, language switch and residence dialog / plan.
- [ ] Manual keyboard-only and real-device accessibility review by the project owner remains recommended.
- [ ] Real WebGPU / WebGL rendering and performance must be checked on target devices; headless Chromium had GPU disabled.

## Phase 4 — Technical verification

- [x] All JavaScript files under src/ and labs/ passed node --check.
- [x] Production build passed with Vite 7.3.7 (100 modules).
- [x] Checked 51 literal media paths in the central registry; all files exist.
- [x] Pillow decoded all local raster assets; all SVG files parsed as XML.
- [x] Three GLBs passed container/header, JSON chunk and binary-buffer checks.
- [x] Three HDR files parsed through the actual Three.js RGBELoader (2048×1024 and 512×256 maps).
- [x] WAV opened correctly as stereo PCM, 22050 Hz.
- [x] Preview HTTP smoke tests returned 200 for the home page, both labs, favicon and representative WebP / SVG / GLB / HDR / WAV assets.
- [x] Headless Chromium rendered 12 main sections at 390×844 and 1440×900, then lazy-loaded the tower section and opened the concept lobby without runtime exceptions.
- [x] Mobile and desktop DOM metrics showed no horizontal overflow.
- [x] No runtime console exceptions or HTTP error responses were reported after the SITE import fix.
- [x] Hero source image decoded at 1800 px intrinsic width.
- [x] Screenshot review confirmed the main hero / navigation / consent UI renders.

## Phase 5 — Documentation and handoff

- [x] Updated README, ASSETS, PROJECT_CONTEXT, IMAGE_CREDITS, CHANGELOG, HANDOFF, CURRENT_STATE, TASK_STATE and this plan.
- [x] Documented what is concept-generated, what is third-party reference imagery, and where images came from.
- [x] Recorded verification evidence and the boundary between a completed prototype and a real commercial launch.

## Exit decision

**Concept showcase completion: PASS.** Build, static asset integrity, route smoke tests, main-page rendering and the tested demo interactions pass.

**Commercial property launch: NOT READY by design.** It must not be represented as a real development. A legitimate client-facing property launch requires owner-provided plot / building facts, architect-approved plans and geometry, real price/inventory source data, real contact details, legal and privacy approval, an approved production domain, and backend integrations.
