/**
 * CENTRAL ASSET REGISTRY.
 * Every image, video, model and audio file the site can show is declared here, once.
 * Files live in /public/assets/<category>/... (convention in docs/ASSETS.md). Components never hardcode URLs: they receive a
 * registry key ("hero.main") and MediaFrame resolves it. Missing files are fine: the slot renders an architectural placeholder.
 *
 * Image entry fields
 *   src       fallback file, path relative to /assets/ (required)
 *   formats   optional modern formats served through <picture>, e.g. ['avif','webp'] -> hero/main.avif, hero/main.webp
 *   widths    optional responsive widths; files are then named <base>-<w>.<ext> (hero/main-640.jpg ...)
 *   ratio     CSS aspect-ratio of the slot ("4/5")      focal   object-position ("55% 40%")
 *   video     optional looping clip (mp4)               poster  optional poster (defaults to src)
 *   alt       { pl, en }  (empty alt = decorative)      slot    human label shown on the placeholder
 */
export const ASSETS_ROOT = (import.meta.env.BASE_URL || '/') + 'assets/';
export const url = (p) => ASSETS_ROOT + p;

const img = (src, o = {}) => ({ type: 'image', src, ratio: '4/3', focal: '50% 50%', ...o });
const alt = (pl, en) => ({ pl, en });

export const ASSETS = {
  hero: {
    main: img('hero/hero-main.webp', { ratio: '3/4', focal: '58% 50%', slot: 'Hero · tower at first light',
      alt: alt('Referencyjne zdjęcie architektury dla koncepcji wieży STELE', 'Residential facade reference for the fictional STELE tower concept') })
  },
  architecture: {
    facade: img('architecture/facade-detail.webp', { ratio: '4/5', focal: '50% 30%', slot: 'Architecture · facade detail',
      alt: alt('Referencyjny detal fasady', 'Reference image for facade materials') }),
    crown: img('architecture/crown.webp', { ratio: '16/10', slot: 'Architecture · crown',
      alt: alt('Referencyjna nowoczesna fasada — nie jest koroną wieży STELE', 'Reference modern facade — not the crown of a STELE tower') })
  },
  residences: {
    ashlar: img('residences/ashlar.webp', { ratio: '4/5', slot: 'Residence · Ashlar Studio', alt: alt('Referencyjne wnętrze kolekcji Ashlar', 'Illustrative interior reference for the Ashlar collection') }),
    terrazzo: img('residences/terrazzo.webp', { ratio: '4/5', slot: 'Residence · Terrazzo', alt: alt('Referencyjny salon kolekcji Terrazzo', 'Illustrative living-room reference for Terrazzo') }),
    monolith: img('residences/monolith.webp', { ratio: '4/5', slot: 'Residence · Monolith Penthouse', alt: alt('Referencyjny penthouse kolekcji Monolith', 'Illustrative penthouse reference for Monolith') })
  },
  floorplans: {
    ashlar: img('floorplans/ashlar.svg', { ratio: '4/3', slot: 'Floorplan · Ashlar', alt: alt('Rzut Studia Ashlar', 'Ashlar Studio floorplan') }),
    terrazzo: img('floorplans/terrazzo.svg', { ratio: '4/3', slot: 'Floorplan · Terrazzo', alt: alt('Rzut rezydencji Terrazzo', 'Terrazzo Residence floorplan') }),
    monolith: img('floorplans/monolith.svg', { ratio: '4/3', slot: 'Floorplan · Monolith', alt: alt('Rzut penthouse Monolith', 'Monolith Penthouse floorplan') })
  },
  interiors: {
    living: img('interiors/living.webp', { ratio: '16/11', slot: 'Interior · living', alt: alt('Referencyjna aranżacja salonu z drewnem i kamieniem', 'Living-room reference with wood and stone') }),
    kitchen: img('interiors/kitchen.webp', { ratio: '16/11', slot: 'Interior · kitchen', alt: alt('Referencyjny salon z otwartą kuchnią — bez specyfikacji STELE', 'Open-kitchen reference — not a STELE specification') }),
    bath: img('interiors/bath.webp', { ratio: '16/11', slot: 'Interior · bathroom', alt: alt('Referencyjna aranżacja łazienki z kamieniem i drewnem', 'Bathroom reference with stone and wood') }),
    terrace: img('interiors/terrace.webp', { ratio: '16/11', slot: 'Interior · terrace', alt: alt('Referencyjny budynek mieszkalny z balkonami', 'Residential-building reference with balconies') }),
    oak: img('interiors/material-oak.webp', { ratio: '1/1', slot: 'Material · smoked oak', alt: alt('Dąb wędzony, zbliżenie', 'Smoked oak, close-up') }),
    travertine: img('interiors/material-travertine.webp', { ratio: '1/1', slot: 'Material · travertine', alt: alt('Trawertyn, zbliżenie', 'Travertine, close-up') }),
    glass: img('interiors/material-glass.webp', { ratio: '1/1', slot: 'Material · smoked glass', alt: alt('Szkło dymione, zbliżenie', 'Smoked glass, close-up') }),
    bronze: img('interiors/material-bronze.webp', { ratio: '1/1', slot: 'Material · brushed bronze', alt: alt('Szczotkowany brąz, zbliżenie', 'Brushed bronze, close-up') })
  },
  amenities: {
    pool: img('amenities/pool.webp', { ratio: '4/5', slot: 'Amenity · pool', alt: alt('Referencyjne zdjęcie basenu — nie jest udogodnieniem STELE', 'Pool reference — not a STELE amenity') }),
    fitness: img('amenities/fitness.webp', { ratio: '16/10', slot: 'Amenity · fitness', alt: alt('Referencyjne wnętrze siłowni', 'Fitness interior reference') }),
    courtyard: img('amenities/courtyard.webp', { ratio: '4/5', slot: 'Amenity · courtyard', alt: alt('Referencyjny zielony dziedziniec', 'Green courtyard reference') }),
    lounge: img('amenities/sky-lounge.webp', { ratio: '16/10', slot: 'Amenity · sky lounge', alt: alt('Referencyjne wnętrze lobby i strefy wypoczynku', 'Lobby and lounge interior reference') }),
    concierge: img('amenities/concierge.webp', { ratio: '4/5', slot: 'Amenity · lobby', alt: alt('Referencyjne lobby z recepcją', 'Reception-lobby reference') }),
    garage: img('amenities/garage.webp', { ratio: '16/10', slot: 'Amenity · garage', alt: alt('Referencyjna fasada miejska — garaż nie jest przedstawiony', 'Urban facade reference — no garage is depicted') })
  },
  lifestyle: {
    morning: img('lifestyle/morning.webp', { ratio: '4/5', slot: 'Lifestyle · 06:30', alt: alt('Zieleń jako inspiracja dla sekwencji porannej', 'Green canopy used as a morning lifestyle mood reference') }),
    noon: img('lifestyle/noon.webp', { ratio: '4/5', slot: 'Lifestyle · 12:30', alt: alt('Krajobraz jako inspiracja dla sekwencji dziennej', 'Landscape used as a daytime lifestyle mood reference') }),
    evening: img('lifestyle/evening.webp', { ratio: '4/5', slot: 'Lifestyle · 19:00', alt: alt('Referencyjna architektura dla sekwencji wieczornej', 'Architectural mood reference for the evening sequence') }),
    night: img('lifestyle/night.webp', { ratio: '4/5', slot: 'Lifestyle · 23:00', alt: alt('Referencyjny pejzaż miejski nocą', 'Night-time cityscape reference') })
  },
  location: {
    map: img('location/map.webp', { ratio: '1/1', poster: 'location/map-poster.webp', slot: 'Location · map / aerial',
      alt: alt('Panorama Wrocławia jako inspiracja lokalizacyjna', 'Wrocław river and city panorama used as a location mood reference') }),
    backdrop: img('location/backdrop.webp', { ratio: '16/9', slot: 'Location · backdrop', alt: alt('', '') })
  },
  gallery: [
    { asset: 'hero.main', span: 'tall' }, { asset: 'interiors.living', span: 'wide' }, { asset: 'amenities.pool', span: 'tall' },
    { asset: 'architecture.crown', span: 'wide' }, { asset: 'interiors.terrace', span: 'wide' }, { asset: 'amenities.courtyard', span: 'tall' },
    { asset: 'lifestyle.evening', span: 'tall' }, { asset: 'interiors.bath', span: 'wide' }
  ]
};

/** 3D, lobby and audio files used by webgl/tower-scene.js (kept apart: they are not <img> slots). Loaded lazily. */
export const M3D = {
  tower: url('3d/tower/tower.glb'),
  cityEnv: url('3d/env/city-environment.glb'),
  cityBackdrop: url('3d/env/city-backdrop.glb'),
  sky: url('3d/env/sky-2k.hdr'),
  skyLow: url('3d/env/sky-512.hdr'),
  waterNormals: url('3d/env/water-normals.jpg'),
  people: (n) => url(`3d/env/people-${n}.png`),
  lobbyPano: url('3d/lobby/lobby-pano.jpg'),
  inesPortrait: url('3d/lobby/ines-portrait.svg'),
  ambience: url('audio/city-ambience.wav')
};

/** Files for the drone-flight lab only. */
export const LAB = {
  sky: url('labs/drone/sky-dusk-512.hdr'), nebula: url('labs/drone/nebula.jpg'), terrain: url('labs/drone/terrain.jpg'), rock: url('labs/drone/rock.jpg'),
  milkyway: url('labs/drone/milkyway.jpg'), planet: url('labs/drone/planet.png'), gate: url('labs/drone/gate-ornament.jpg'), carbon: url('labs/drone/carbon.jpg'),
  tower: M3D.tower
};

/** Resolve "group.name" (or "group.name" inside arrays of gallery entries) to an entry. Returns null if unknown. */
export function getAsset(key) {
  return key.split('.').reduce((o, k) => (o ? o[k] : null), ASSETS) || null;
}
