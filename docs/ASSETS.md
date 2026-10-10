# Assets

The live image registry is src/config/assets.js. Each image slot has an actual local asset and bilingual alt text. Photographs are locally hosted WebP derivatives and are reference imagery, not depictions of a real STELE property. Exact image-CDN IDs and download endpoint URLs are recorded in IMAGE_CREDITS.md; photographer/profile identity is not claimed as independently verified.

## Site image registry

| Group | Registered local files | Intended use |
|---|---|---|
| Hero | hero/hero-main.webp | Architectural reference for opening image |
| Architecture | architecture/facade-detail.webp, architecture/crown.webp | Facade / material references |
| Collections | residences/ashlar.webp, residences/terrazzo.webp, residences/monolith.webp | Typology mood references |
| Concept plans | floorplans/ashlar.svg, floorplans/terrazzo.svg, floorplans/monolith.svg | Original illustrative UI diagrams; not dimensioned |
| Interiors | interiors/living.webp, interiors/kitchen.webp, interiors/bath.webp, interiors/terrace.webp | Interior references |
| Material swatches | interiors/material-oak.webp, material-travertine.webp, material-glass.webp, material-bronze.webp | Procedurally generated texture studies |
| Programme | amenities/pool.webp, fitness.webp, courtyard.webp, sky-lounge.webp, concierge.webp, garage.webp | Reference-only images; they do not certify that amenities exist |
| Daily rhythm | lifestyle/morning.webp, noon.webp, evening.webp, night.webp | Light, landscape and city mood |
| Place context | location/map.webp, map-poster.webp, backdrop.webp | Wrocław / river reference, not a route map or property pin |

The central registry resolves local paths through ASSETS_ROOT. Avoid hardcoded alternative image URLs inside components. MediaFrame shows the local image and retains a placeholder if a future image is missing.

## 3D, sound and lab assets

| Path group | Contents |
|---|---|
| 3d/tower/tower.glb | Custom procedural tower concept geometry |
| 3d/env/city-environment.glb, city-backdrop.glb | Lightweight contextual massing model |
| 3d/env/sky-2k.hdr, sky-512.hdr, water-normals.jpg, people-1..4.png | Generated lighting, water and scale-cue assets |
| 3d/lobby/lobby-pano.jpg | Generated panoramic-style concept lobby illustration |
| 3d/lobby/ines-portrait.svg | Custom illustrated concierge persona |
| audio/city-ambience.wav | Generated low-level ambience loop |
| labs/drone/* | Generated sky / terrain / rock / carbon / nebula / planet materials for the isolated drone experiment |

The 3D geometry is designed for presentation and interaction, not engineering review. The GLBs do not reproduce a surveyed site or approved building model. The SVG plans are unscaled concept diagrams.

## Image delivery notes

- Raster images are WebP or JPEG, sized for their layout slots; source photos are hosted locally to avoid runtime image-CDN dependencies.
- The hero is 1800×2200. Other slots use crop dimensions selected for their aspect ratios. Exact image-CDN source endpoints are in IMAGE_CREDITS.md; verify original photo pages and attribution before commercial use.
- Photos are compressed for the page, and image slots lazy-load by default. The hero opts into eager / high-priority loading where requested.
- All photography is labelled as reference imagery in the content and alt text. Do not remove the fictional-concept disclaimer or re-label a reference as an actual STELE render.
- No remote photo is required for rendering after the local build. Network is still needed if dependencies are reinstalled or updated.

## Commercial handoff

Before using STELE as a client-facing property site, replace generated concept geometry and illustrative SVG plans with owner-approved architectural deliverables; replace reference photography with approved original renders/photos; and have the owner/architect verify all technical, legal and location claims.
