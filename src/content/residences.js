import { collectionStats } from './units.js';

const range = (a, b) => (a === b ? `${a}` : `${a}-${b}`);

/** Concept typologies. Sample areas/floors derive from units.js; there is no live inventory or sale-price data. */
function build(def) {
  const s = collectionStats(def.id);
  return {
    ...def, stats: s,
    floorsLabel: { pl: `piętra ${range(...s.floors)}`, en: `floors ${range(...s.floors)}` },
    areaLabel: `${range(...s.area)} m²`,
    roomsLabel: { pl: `${range(...s.rooms)} ${s.rooms[1] > 1 ? 'pokoje' : 'pokój'}`, en: `${range(...s.rooms)} ${s.rooms[1] > 1 ? 'rooms' : 'room'}` },
    priceFrom: { pl: 'Wartości wyłącznie przykładowe', en: 'Illustrative values only' }
  };
}

export const RESIDENCES_INTRO = {
  plate: '04',
  label: { pl: 'Rezydencje', en: 'Residences' },
  title: { pl: 'Trzy typologie. Jedna materia.', en: 'Three typologies. One material.' },
  lede: { pl: 'Od kompaktowego studium po cofniętą koronę. Trzy przykładowe układy badają tę samą paletę kamienia, dębu i szkła.', en: 'From a compact study to a set-back crown. Three illustrative layouts explore the same palette of stone, oak and glass.' }
};

export const RESIDENCES = [
  build({
    id: 'ashlar', name: 'Ashlar', kind: { pl: 'Studio', en: 'Studio' }, asset: 'residences.ashlar', plan: 'floorplans.ashlar',
    outdoor: { value: '5,2 m²', label: { pl: 'balkon', en: 'balcony' } }, orientation: { pl: 'Wschód · rzeka', en: 'East · river' },
    summary: { pl: 'Skondensowana forma: jedno pomieszczenie, pełna wysokość okna, widok na bulwar.', en: 'A condensed form: one room, full-height glazing, a view of the boulevard.' },
    highlights: [
      { pl: 'Okno od podłogi do sufitu na całej szerokości', en: 'Floor-to-ceiling glazing across the full width' },
      { pl: 'Zabudowa kuchenna w kamieniu', en: 'Stone kitchen block' },
      { pl: 'Szafa i garderoba w jednej bryle', en: 'Wardrobe and dressing in one volume' }
    ]
  }),
  build({
    id: 'terrazzo', name: 'Terrazzo', kind: { pl: 'Rezydencja', en: 'Residence' }, asset: 'residences.terrazzo', plan: 'floorplans.terrazzo',
    outdoor: { value: '9,8 m²', label: { pl: 'loggia', en: 'loggia' } }, orientation: { pl: 'Południe i zachód', en: 'South and west' },
    summary: { pl: 'Salon z jadalnią, sypialnie od strony ciszy. Loggia, która jest drugim pokojem od wiosny do jesieni.', en: 'Living and dining room, bedrooms on the quiet side. A loggia that is a second room from spring to autumn.' },
    highlights: [
      { pl: 'Loggia z dębową podłogą', en: 'Loggia with an oak floor' },
      { pl: 'Podłoga z terrazzo w strefie dziennej', en: 'Terrazzo floor in the day zone' },
      { pl: 'Oddzielna garderoba przy sypialni', en: 'Separate dressing room off the bedroom' }
    ]
  }),
  build({
    id: 'monolith', name: 'Monolith', kind: { pl: 'Penthouse', en: 'Penthouse' }, asset: 'residences.monolith', plan: 'floorplans.monolith',
    outdoor: { value: '46 m²', label: { pl: 'taras', en: 'terrace' } }, orientation: { pl: '360° · rzeka i miasto', en: '360° · river and city' },
    summary: { pl: 'Dwa poziomy na koronie. Taras dookoła, schody w kamieniu, szkło na wszystkie strony świata.', en: 'Two levels on the crown. A terrace all round, a stone staircase, glass on every side.' },
    highlights: [
      { pl: 'Taras dookoła na obu poziomach', en: 'Terrace all round on both levels' },
      { pl: 'Rozwiązania techniczne do dalszego opracowania', en: 'Technical systems for further design' },
      { pl: 'Prywatna winda i dwa miejsca garażowe', en: 'Private lift and two garage spaces' }
    ]
  })
];
