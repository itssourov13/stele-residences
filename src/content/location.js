export const LOCATION = {
  plate: '08',
  label: { pl: 'Kontekst miejsca', en: 'Place context' },
  title: { pl: 'Miasto jako kontekst. Rzeka jako motyw.', en: 'The city as context. The river as a motif.' },
  lede: {
    pl: 'To studium lokalizacyjne inspirowane Wrocławiem i Odrą, a nie wskazanie rzeczywistej działki. Pierścienie czasu, odległości i lista punktów są ilustracyjne — nie służą do planowania podróży.',
    en: 'This place study takes inspiration from Wrocław and the Odra; it does not identify a real plot. The time rings, distances and landmarks are illustrative, not for journey planning.'
  },
  rings: [5, 12, 20],
  landmarks: [
    { id: 'boulevard', name: { pl: 'Brzeg Odry', en: 'Odra riverbank' }, minutes: 3, mode: { pl: 'motyw przestrzenny', en: 'spatial motif' }, angle: 20, note: { pl: 'kontekst', en: 'context' } },
    { id: 'park', name: { pl: 'Zieleń miejska', en: 'Urban green space' }, minutes: 5, mode: { pl: 'referencja', en: 'reference' }, angle: 300, note: { pl: 'ilustracyjne', en: 'illustrative' } },
    { id: 'school', name: { pl: 'Codzienne udogodnienia', en: 'Everyday amenities' }, minutes: 6, mode: { pl: 'referencja', en: 'reference' }, angle: 120, note: { pl: 'ilustracyjne', en: 'illustrative' } },
    { id: 'market', name: { pl: 'Historyczne centrum', en: 'Historic centre' }, minutes: 12, mode: { pl: 'referencja miejska', en: 'city reference' }, angle: 235, note: { pl: 'Wrocław', en: 'Wrocław' } },
    { id: 'station', name: { pl: 'Transport publiczny', en: 'Public transport' }, minutes: 18, mode: { pl: 'referencja', en: 'reference' }, angle: 170, note: { pl: 'ilustracyjne', en: 'illustrative' } }
  ],
  mapCaption: { pl: 'Schemat koncepcyjny — nie jest mapą dojazdu', en: 'Concept diagram — not a route map' }
};
