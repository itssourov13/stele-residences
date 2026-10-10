# Changelog

## 1.1.0 — Concept completion and media pass (2026-10-10)

### Art direction and content
- Confirmed STELE as a fictional architectural concept; rewrote hero, place context, architecture, residence typologies, interiors, amenities, lifestyle, FAQ, legal and enquiry copy in Polish and English.
- Removed false construction dates, completion promises, live sales contact details and claims about real apartment availability.
- Made the UI mark unit records and residence collections as illustrative. Generated prices and sold/reserved/available labels are no longer presented.
- Replaced the FAQ with clear explanations of concept geometry, illustrative plans and reference photography.

### Assets
- Added a locally hosted, optimized WebP image library with exact image-CDN source IDs and licence notes in IMAGE_CREDITS.md. Original photo-page / photographer identity remains a manual verification item.
- Added original SVG concept floorplans and material texture swatches.
- Added a generated GLB concept tower, contextual city blocks, HDR environment maps, water normals and decorative scale cues.
- Added a generated lobby panorama, illustrated concierge portrait and low-level WAV ambience. Legacy missing concierge videos are no longer requested as DOM video sources.
- Fixed registry paths to match actual image extensions and removed corrupt placeholder SVG remnants.

### Lab experiments
- Drone-flight fallback now uses a local image rather than the absent hero-loop video; completing the race grants only a local demo achievement and no booking priority.
- Sales-cockpit experiment now labels all synthetic events and scores as demo data; dashboard buttons only show local feedback and do not contact a CRM.

### Product / integration safety
- Removed the fabricated address, phone, email and production-domain metadata.
- Default enquiry and concierge paths are local demo interactions; an owner-configured service is required for transmission.
- Removed ApartmentComplex structured data for a fictional development; the page retains FAQ structured data only.
- Main document is noindex,nofollow until a real domain and final content are approved.

### Documentation
- Updated README and asset / project context guidance.
- Added a photo source and licence record for local image derivatives.
- Updated phase checklist, handoff and current verification record.

## 1.0.0 — T3 prototype re-identified as STELE

- New brand, design tokens, content/component structure, central media registry, animations, bilingual content, interactive tower and isolated labs.
- This version had placeholder-only media and unverified property-like sample copy; see the 1.1.0 completion pass for the current fictional-concept boundary.
