# Project context — STELE Residences

## What this is

STELE Residences is a fictional architectural study and interactive website concept. Its art direction is based on a standing stone monolith: mineral surfaces, a vertical slab silhouette, smoked glass, warm bronze details, editorial typography and plate-numbered sections. It is not an actual Wrocław property, does not indicate a real plot, and has no developer, sales office or live inventory.

Brand line: “Stone, raised into light.” / “Kamień wzniesiony w światło.”

Design intent: show how a calm, premium architecture story can combine imagery, material studies, a concept tower and accessible navigation without implying that a fictional building is available for sale.

## Visual language

- Palette: graphite, smoked glass, warm ivory, mineral stone and a muted pewter / bronze accent.
- Typography: Newsreader for display, Instrument Sans for body, IBM Plex Mono for labels and plate numbers.
- Motifs: slab silhouette, horizontal strata, measured annotations and numbered plates.
- Voice: calm, precise, editorial; avoid sales superlatives and fabricated operational claims.
- Languages: Polish (pl) and English (en), with in-place switching.

## Reality boundary

The following items are illustrative demo data, not verified property facts: floor count and geometry; sample layouts and areas; time rings and landmark distances; amenities; interior specifications; generated architectural drawings; sample inventory concepts; timeline; location context. The UI no longer shows generated selling prices or live availability. Do not publish the design as a sales offer.

The 3D tower / city GLBs are custom procedural presentation geometry, not a BIM model, survey or approved design. SVG floorplans are not to scale and not for construction. Photos from Unsplash are mood references, not actual STELE visuals. A custom SVG portrait represents a fictional guide called Ines; no real employee or agent exists.

## Technical boundaries

- Vite multi-page static build, vanilla ES modules.
- GSAP / ScrollTrigger and Lenis for motion / scroll.
- three.js WebGPU renderer with the existing WebGL2 fallback path; the 3D chunk is lazy-loaded.
- Content is split into src/content/, presentation into src/components/ and src/sections/, interactions into src/behaviors/ and src/features/.
- src/config/assets.js is the single media registry.
- By default, the enquiry form validates locally, chat is a demo response, and neither transmits data. Configuring a live endpoint requires an approved implementation and actual data-handling policy.
- Main page carries noindex,nofollow while it is a fictional concept with no approved production domain.

## What is deliberately not supplied

No production-domain canonical URL, real contact details, privacy/legal approval, property title / plot information, client-approved photography / renders, actual unit inventory/prices/statuses, construction programme, certified dimensions, concierge/chat backend or enquiry CRM is included. These are client/owner inputs, not things to invent in code.
