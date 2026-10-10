# STELE Residences — architectural concept study

STELE is a fictional residential-architecture concept built around mineral materials, a vertical stone monolith, smoked glass, warm bronze details and restrained editorial motion. It is a portfolio-style interactive study, **not an actual Wrocław development or a sales offer**. All property data, sample layouts, floorplans, timelines and amenities are illustrative. Unsplash photographs are reference imagery, not images of a STELE building.

Brand line: “Stone, raised into light.” / “Kamień wzniesiony w światło.”

## Experience

- Bilingual Polish / English content with an in-place language switch.
- Editorial storytelling sections for architecture, concept typologies, interiors, landscape references and place context.
- Custom procedural 3D tower and contextual city massing model with floor-level interaction and lighting controls.
- Locally hosted architectural photography references, generated material swatches, unscaled SVG concept plans and an illustrated concierge persona.
- Isolated experiments under the two /labs routes.

## Stack

Vite 7 · vanilla ES modules · GSAP / ScrollTrigger · Lenis · three.js WebGPU with existing fallback handling · Fontsource fonts. Media paths and bilingual alt text live in the central asset registry at src/config/assets.js.

## Run locally

Node 20.19+ is expected (see .nvmrc). From the project directory:

1. Run npm install if dependencies are not already installed.
2. Run npm run dev and open http://localhost:5173.
3. Run npm run build to generate dist/.
4. Run npm run preview to inspect the production build.

The site is a Vite multi-page build. Main page entry: index.html. Experiment entries: labs/drone-flight/index.html and labs/sales-cockpit/index.html.

## Deploy to Vercel

Import this repository into Vercel and keep the project root at the repository root. The included `vercel.json` configures `npm ci`, `npm run build`, and `dist` as the static output directory. Vercel can serve the main page and both `/labs/*` pages as built HTML entries, so no catch-all SPA rewrite or environment variables are required for the current demo.

The site is still a fictional concept study: deployment does not add live property inventory, lead delivery, a real concierge service, or a backend. Review the integration notes below before presenting it as anything other than a demo.

## Project structure

- src/content/ — Polish / English brand copy, narrative, FAQs and illustrative data.
- src/config/ — site integration defaults and centralized media paths.
- src/components/ and src/sections/ — reusable HTML templates and page modules.
- src/behaviors/ and src/features/ — navigation, media, forms, residence finder and demo chat.
- src/webgl/ — the custom concept tower/city scene and three.js setup.
- src/styles/ — design tokens, base styles and component/section styles.
- public/assets/ — locally hosted photos, concept SVGs, generated materials, GLBs, HDRs and audio.
- docs/ — completion plan, handoff, asset provenance, architecture and verification record.

## Editing content and assets

Copy and language pairs are in src/content/*.js. The unit finder uses deterministic sample layout records only; no generated prices or availability claims are displayed. Do not turn the sample data into live stock without owner-supplied inventory and approval.

Use src/config/assets.js to point components at local files. Exact downloaded image-CDN IDs and licence notes are in docs/IMAGE_CREDITS.md. Original photographer/profile attribution could not be independently confirmed in this environment; verify it before a commercial handoff. Media conventions are in docs/ASSETS.md.

## Integrations and data

By default, the enquiry form validates locally and the concierge chat shows a demo response. They do not send data. The app has no real sales email, phone, address, domain, live inventory or serverless backend. An owner must supply approved contact details, a working endpoint, terms and privacy information before enabling live submission.

The main page is marked noindex,nofollow and intentionally has no placeholder canonical URL while no approved production domain exists. Do not deploy this concept as an actual property offer.

## Verification

See docs/CURRENT_STATE.md for evidence from the latest syntax, build, asset integrity, HTTP and browser smoke tests, plus any checks that remain outside automated verification.

## License

Project source code is released under the MIT License; see [LICENSE](LICENSE). Third-party fonts, photographs, models, audio, libraries, and other assets are not relicensed by this project license and remain subject to their own terms. Review `docs/IMAGE_CREDITS.md` and the relevant asset documentation before reusing or commercially distributing any media.
