export const INTERIORS = {
  plate: '05',
  label: { pl: 'Wnętrza', en: 'Interiors' },
  title: { pl: 'Cztery materiały. Żadnej ozdoby.', en: 'Four materials. No decoration.' },
  lede: { pl: 'Koncepcyjne wnętrza rozwijają paletę architektury. Fotografie są referencjami, a nie dokumentacją wnętrz STELE.', en: 'Concept interiors extend the architectural palette. Photographs are references, not documentation of STELE interiors.' },
  rooms: [
    { id: 'living', title: { pl: 'Salon', en: 'Living' }, text: { pl: 'Studium relacji pomiędzy dębem, mineralną powierzchnią i pełną wysokością okna.', en: 'A study of smoked oak, mineral surfaces and full-height glazing.' }, asset: 'interiors.living' },
    { id: 'kitchen', title: { pl: 'Kuchnia', en: 'Kitchen' }, text: { pl: 'Koncepcyjny blok kuchenny z dominantą kamienia i dyskretnymi metalowymi detalami.', en: 'A concept kitchen block led by stone, with restrained metal detailing.' }, asset: 'interiors.kitchen' },
    { id: 'bath', title: { pl: 'Łazienka', en: 'Bathroom' }, text: { pl: 'Kontrast matowego minerału, odbicia i miękkiego światła.', en: 'A contrast of matte mineral surfaces, reflections and soft light.' }, asset: 'interiors.bath' },
    { id: 'terrace', title: { pl: 'Taras', en: 'Terrace' }, text: { pl: 'Granica wnętrza i zewnętrza rozważana jako część tej samej kompozycji.', en: 'The indoor–outdoor threshold considered as part of one composition.' }, asset: 'interiors.terrace' }
  ],
  materials: [
    { id: 'oak', name: { pl: 'Dąb wędzony', en: 'Smoked oak' }, spec: { pl: 'kierunek materiałowy · bez specyfikacji wykonawczej', en: 'material direction · no construction specification' }, asset: 'interiors.oak' },
    { id: 'travertine', name: { pl: 'Trawertyn', en: 'Travertine' }, spec: { pl: 'faktura referencyjna', en: 'reference texture' }, asset: 'interiors.travertine' },
    { id: 'glass', name: { pl: 'Szkło dymione', en: 'Smoked glass' }, spec: { pl: 'kierunek wizualny, bez parametrów technicznych', en: 'visual direction, no technical performance data' }, asset: 'interiors.glass' },
    { id: 'bronze', name: { pl: 'Brąz szczotkowany', en: 'Brushed bronze' }, spec: { pl: 'motyw wykończenia', en: 'finish motif' }, asset: 'interiors.bronze' }
  ],
  gallery: { label: { pl: 'Plansze', en: 'Plates' }, hint: { pl: 'Kliknij, aby powiększyć', en: 'Select to enlarge' } }
};
