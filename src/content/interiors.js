export const INTERIORS = {
  plate: '05',
  label: { pl: 'Wnętrza', en: 'Interiors' },
  title: { pl: 'Materia. Światło. Spokój.', en: 'Material. Light. Restraint.' },
  lede: {
    pl: 'Koncepcyjne wnętrza rozwijają tę samą paletę: drewno, kamień, szkło i szczotkowany metal. Zdjęcia są referencjami, nie dokumentacją STELE.',
    en: 'Concept interiors carry the same palette—timber, stone, glass and brushed metal. All photographs are references, not documentation of STELE interiors.'
  },
  rooms: [
    {
      id: 'living',
      title: { pl: 'Salon', en: 'Living' },
      text: {
        pl: 'Drewno, mineralne powierzchnie i przeszklenia od podłogi do sufitu tworzą spójną, spokojną kompozycję.',
        en: 'Timber, mineral surfaces and full-height glazing form one quiet, continuous composition.'
      },
      asset: 'interiors.living'
    },
    {
      id: 'kitchen',
      title: { pl: 'Kuchnia', en: 'Kitchen' },
      text: {
        pl: 'Otwarta kuchnia, w której kamienna wyspa równoważy oszczędną stolarkę z drewna.',
        en: 'An open kitchen anchored by a stone island and restrained timber joinery.'
      },
      asset: 'interiors.kitchen'
    },
    {
      id: 'bath',
      title: { pl: 'Łazienka', en: 'Bathroom' },
      text: {
        pl: 'Matowy kamień, ciemny metal i jedno źródło miękko odbitego światła.',
        en: 'Matte stone, dark metal and a single source of softly reflected light.'
      },
      asset: 'interiors.bath'
    },
    {
      id: 'terrace',
      title: { pl: 'Panoramiczne przeszklenie', en: 'Panoramic glazing' },
      text: {
        pl: 'Próg między spokojem wnętrza a zmiennym światłem na zewnątrz.',
        en: 'A threshold between interior calm and the changing light outdoors.'
      },
      asset: 'interiors.terrace'
    }
  ],
  materials: [
    { id: 'oak', name: { pl: 'Dąb wędzony', en: 'Smoked oak' }, spec: { pl: 'kierunek materiałowy · bez specyfikacji wykonawczej', en: 'material direction · no construction specification' }, asset: 'interiors.oak' },
    { id: 'travertine', name: { pl: 'Trawertyn', en: 'Travertine' }, spec: { pl: 'faktura referencyjna', en: 'reference texture' }, asset: 'interiors.travertine' },
    { id: 'glass', name: { pl: 'Szkło dymione', en: 'Smoked glass' }, spec: { pl: 'kierunek wizualny, bez parametrów technicznych', en: 'visual direction, no technical performance data' }, asset: 'interiors.glass' },
    { id: 'bronze', name: { pl: 'Brąz szczotkowany', en: 'Brushed bronze' }, spec: { pl: 'motyw wykończenia', en: 'finish motif' }, asset: 'interiors.bronze' }
  ],
  gallery: {
    label: { pl: 'Wnętrza i materiały', en: 'Interiors & materials' },
    hint: { pl: 'Wybierz kadr, aby przyjrzeć się detalom', en: 'Select a frame to inspect the details' }
  }
};
