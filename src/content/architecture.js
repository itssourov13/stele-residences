export const ARCHITECTURE = {
  plate: '02',
  label: { pl: 'Architektura', en: 'Architecture' },
  title: { pl: 'Jeden trzon. Trzy warstwy.', en: 'One shaft. Three strata.' },
  lede: {
    pl: 'Koncepcyjny cokół z trawertynu, trzon z pionowych żeber i dymionego szkła, korona cofnięta ku niebu. Każda warstwa ma własną proporcję i własne światło.',
    en: 'A conceptual travertine base, a shaft of vertical ribs and smoked glass, a crown set back toward the sky. Each stratum has its own proportion and its own light.'
  },
  drawing: { floors: 18, bays: 7, zones: { base: [1, 2], body: [3, 16], crown: [17, 18] } },
  annotations: [
    { id: '01', zone: 'base', title: { pl: 'Cokół', en: 'Base' }, text: { pl: 'Dwie kondygnacje trawertynu: lobby, basen i recepcja na poziomie bulwaru.', en: 'Two storeys of travertine: lobby, pool and reception at boulevard level.' } },
    { id: '02', zone: 'body', title: { pl: 'Trzon', en: 'Shaft' }, text: { pl: 'Czternaście kondygnacji o 2,8 m w świetle. Pionowe żebra z szarego kamienia rytmizują siedem osi.', en: 'Fourteen storeys at 2.8 m clear height. Vertical ribs of grey stone set the rhythm of seven bays.' } },
    { id: '03', zone: 'skin', title: { pl: 'Skóra', en: 'Skin' }, text: { pl: 'Szkło dymione od podłogi do sufitu, ramy z brązu. Rano chłodne, o zmierzchu głębokie.', en: 'Floor-to-ceiling smoked glass in bronze frames. Cool in the morning, deep at dusk.' } },
    { id: '04', zone: 'crown', title: { pl: 'Korona', en: 'Crown' }, text: { pl: 'Dwa poziomy penthouse z tarasami dookoła i przeszkleniem na 360°.', en: 'Two penthouse levels with wrap-around terraces and 360° glazing.' } }
  ],
  specs: [
    { value: '18', label: { pl: 'pięter w koncepcji', en: 'concept storeys' } },
    { value: '≈ 62 m', label: { pl: 'wysokość koncepcyjna', en: 'concept height' } },
    { value: '≈ 2,8 m', label: { pl: 'założenie wysokości', en: 'height assumption' } },
    { value: '7', label: { pl: 'osi w szkicu', en: 'diagram bays' } }
  ],
  materials: [
    { name: { pl: 'Trawertyn', en: 'Travertine' }, use: { pl: 'cokół, lobby', en: 'base, lobby' } },
    { name: { pl: 'Kamień szary', en: 'Grey stone' }, use: { pl: 'żebra fasady', en: 'facade ribs' } },
    { name: { pl: 'Szkło dymione', en: 'Smoked glass' }, use: { pl: 'przeszklenia', en: 'glazing' } },
    { name: { pl: 'Brąz szczotkowany', en: 'Brushed bronze' }, use: { pl: 'ramy, balustrady', en: 'frames, balustrades' } }
  ]
};
