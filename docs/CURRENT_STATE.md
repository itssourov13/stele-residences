# Current state and verification report

Verification date: 2026-10-10.

## Result

The local project now works as a self-contained, fictional architectural concept website. The production build succeeds, its registry-backed media exists, the main route and two lab routes serve successfully, and a headless Chromium smoke pass rendered the page on mobile and desktop viewport sizes.

This is **not** a real property sales site. The assets, layouts and property-like data are concept/demo material; production sales content was intentionally not fabricated.

## Checks performed

| Check | Result | Evidence |
|---|---|---|
| JavaScript syntax | PASS | node --check on all JS files in src/ and labs/ |
| Production build | PASS | npm run build; Vite 7.3.7, 100 modules, exit code 0 |
| Central media registry | PASS | 51 literal path references checked; all files present |
| Raster assets | PASS | All local PNG/JPG/WebP opened and verified with Pillow |
| SVG assets | PASS | All SVG XML parsed; all three concept floorplans are substantive files |
| GLB assets | PASS | Three files have valid glTF 2.0 headers, JSON chunk, binary chunk and buffer sizes |
| HDR assets | PASS | Three.js RGBELoader parsed 2048×1024 and 512×256 RGBE files |
| Audio | PASS | WAV opens as stereo PCM at 22050 Hz |
| HTTP routes | PASS | /, /labs/drone-flight/, /labs/sales-cockpit/, /favicon.svg and representative WebP/SVG/GLB/HDR/WAV assets returned HTTP 200 |
| Main document rendering | PASS | Headless Chromium rendered 12 section IDs on the production preview |
| Responsive width | PASS | At 390×844 and 1440×900, document width did not exceed viewport width |
| Hero media | PASS | Local WebP decoded; intrinsic width reported as 1800 px |
| Demo interactions | PASS | Required-field errors, local demo-form completion, PL/EN switch, residence dialog and plan image |
| Runtime exceptions | PASS | No JavaScript console exceptions / failed HTTP responses after the render fix |
| Git metadata | UNAVAILABLE | Workspace contains no .git directory; no new repository was initialized |

## Key implementation repairs

- Fixed an unhandled SITE reference in the enquiry section that stopped the entire initial render. Rebuilt and re-tested after the fix.
- Corrected image references from nonexistent JPG paths to actual local WebP paths and added the missing local source assets.
- Replaced invalid tiny SVG placeholders with actual vector concept plans and generated swatches.
- Added custom concept tower/city GLBs and generated HDR environment maps; validated through Three.js's own HDR loader.
- Removed fake sales contact details, completion milestones, fabricated pricing/availability presentation, and the false ApartmentComplex structured-data record.
- Made default form / concierge experiences clearly local demo interactions.

## Limits of this verification

- Chromium was headless; GPU rendering was disabled for the smoke pass. The headless browser has GPU disabled, so actual WebGPU / WebGL frame quality, frame rate, phone heat and physical touch behavior are not certified by this check.
- This pass does not replace owner/client review of architectural plans, dimensions, rights, legal/terms copy, real location facts, or live integrations.
- Exact Unsplash image-CDN source IDs and request URLs are recorded in IMAGE_CREDITS.md. The environment blocked photo-page / metadata requests, so photographer identity is not claimed as verified; confirm original pages and third-party rights before commercial use. Reference photos do not prove the existence of a STELE property.

## Local commands

1. npm run dev — development server.
2. npm run build — production build.
3. npm run preview — serve dist/ for final inspection.

The preview process used for this QA pass has been stopped by its smoke-test script. No Git push, commit or repository initialization was performed.
