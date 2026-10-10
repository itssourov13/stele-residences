# Architecture

## Flow (`src/main.js`)
1. `detectLang()` → `setInitialLang()` (render reads the language).
2. `renderPage()` (`app/page.js`) concatenates component output built from content files into `#app`.
3. `applyLang()` syncs switcher state; JSON-LD is injected from content.
4. Behaviours initialise in an order that matters: nav before scroll (menu links must unlock Lenis before an anchor scroll), preloader promise `ready` passed to sections, section `init()`s, then shared motion presets.

## Layers
| Layer | Folder | Rule |
|---|---|---|
| Content | `content/` | data and copy only, `{pl,en}` pairs, no markup |
| Config | `config/` | `assets.js` registry, `site.js` integrations |
| Components | `components/` | pure `(props) => string`; no DOM access; reuse before duplicating |
| Sections | `sections/` | `render()` composes components; `init()` owns that section's behaviour |
| Behaviours | `behaviors/` | DOM wiring that is not section-specific |
| Motion | `motion/` | tokens, one scroll clock, declarative presets |
| Features | `features/`, `webgl/` | ported complex modules with explicit DOM contracts |
| Styles | `styles/` | tokens → base → components → sections |

## Components
BrandMark, Button, SectionIntro, MediaFrame (+ placeholder), StatBlock, Marquee, ResidenceCard, LocationCard, FormField, CtaBlock, SplitContent, Gallery, FacadeDrawing, LocationRings, TowerStage, Header/Navigation, MobileMenu, FloorRail, Footer, Lightbox, ResidenceDialog, ConciergeWidget, ConsentBanner, Preloader.
Change a component once and every section using it changes.

## Content architecture
Each content file exports plain objects. `content/units.js` is the inventory; `content/residences.js` derives area, floors, price-from and availability from it so cards, dialog and 3D never disagree. `content/navigation.js` defines section order and nav visibility; `app/page.js` defines page order.

## i18n
`T(pair)` renders `<span data-i18n="tN">` and registers the pair; `A({attr: pair})` does the same for attributes. `applyLang()` swaps text in place, so GSAP triggers and the WebGL canvas survive a language change. Pairs missing `en` warn once in dev.

## Asset architecture
`config/assets.js` is the only place that names media files. `MediaFrame('hero.main')` resolves a key, renders placeholder + `<picture>` (+ optional lazy video). `M3D` and `LAB` hold non-`<img>` files. Conventions in `ASSETS.md`.

## Animation architecture
GSAP ticker → Lenis → ScrollTrigger (`motion/scroll.js`). Components emit `data-motion="wipe|rise|mask"` and `data-parallax`; `motion/presets.js` implements them once. Section-specific scenes: hero slab expansion (matchMedia ≥1000px), manifesto word ignition, facade line drawing, pinned horizontal residences (matchMedia ≥1025px, hover), location ring draw, tower camera flight (desktop pointer). `scroll-swap.js` drives the interiors and lifestyle stage swaps with IntersectionObserver.

## WebGL
`sections/tower.js` lazy-imports `webgl/tower-scene.js` when the zone is within 120% of the viewport. `vendor3d.js` re-exports three (`three/webgpu`, `three/tsl`, addons). The scene (ported) handles WebGPU→WebGL2, GLB tower, city environment, floor picking, day/night, 360° lobby with chroma-keyed concierge video. It publishes `window.steleFlight`, `selectFloor`, `highlightFloor`, and reads `setFloorFilter`. Sizing follows a ResizeObserver on the canvas. File names come from `M3D` in `config/assets.js`. Failure → localized fallback message; finder stays usable.

## Window bridge (inherited, documented)
`stelePulse`, `steleAsk`, `steleMeet`, `steleRenderUnits`, `setFloorFilter`, `selectFloor`, `highlightFloor`, `steleFlight`, DOM event `stele:lang`.

## Responsive strategy
Fluid type and spacing tokens; desktop-only effects gated by `(hover:hover)`/width; mobile has a dedicated overlay menu, stacked editorial layouts, sticky-top image stage for swaps, 2-column collage; floor rail hidden <900px; hero uses push-in instead of slab expansion <1000px.

## Labs
`labs/*` HTML + `src/labs/*` hold the drone game and sales cockpit. They share config and the three entry but nothing in the main bundle imports them.
