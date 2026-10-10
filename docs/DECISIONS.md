# Decisions

1. **Rebrand to STELE (stone slab).** The previous identity (gold + serif, "A" monogram) was replaced, not renamed: new name, tagline, palette, type, motifs, CTA vocabulary, concierge name and unit names. Gold avoided on purpose.
2. **Vanilla modules, no framework.** One long scripted page; components are pure string functions so a framework or prerenderer can adopt them later.
3. **Content separated from presentation.** Copy and data in `src/content`, bilingual by construction (`{pl,en}`), so missing translations are impossible to miss and replacing content never touches components.
4. **Client-side rendering from content (known trade-off).** Keeps one source of truth and allows in-place language switching. Cost: no static HTML for crawlers beyond the head and JSON-LD. Mitigation path: components have no DOM dependency, so a Vite prerender/SSG step can render `renderPage()` at build time.
5. **In-place language switching** instead of re-rendering, to preserve GSAP and WebGL state.
6. **Central asset registry + MediaFrame placeholders.** Real media will arrive later; missing files must look intentional. Alt text lives with the asset.
7. **Ported, not rewritten: 3D scene, apartment finder, concierge chat, lab pages.** They encode many tuned behaviours and cannot be re-verified here. Edits were mechanical: names, imports, asset paths via registry, lifecycle, tokens.
8. **npm `three` replaces the missing self-hosted bundle** via a single `webgl/vendor3d.js`.
9. **Unit data in one file** and card statistics derived from it, so cards, dialog, finder and 3D agree.
10. **Residences horizontal scene retained on desktop only**, with a detail dialog (plan slot, highlights, orientation) for depth; mobile gets stacked cards.
11. **Facade drawing and location rings are generated from data** (SVG), so architecture content literally shapes the interface and works without any photography.
12. **Light tones for rhythm** (ivory architecture/FAQ, stone interiors) against graphite sections; accent re-mapped per tone for contrast.
13. **Labs isolated under `/labs/`**, noindex, own entries, excluded from main navigation (linked from the footer).
14. **Enquiry transport is swappable** (`mailto` default, endpoint via env) and isolated in one function.
15. **Removed:** reload watchdog, grain/vignette overlays, debug globals, social rail, cache-buster query strings.
