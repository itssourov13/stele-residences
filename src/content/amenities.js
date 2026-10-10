export const AMENITIES = {
  plate: '06',
  label: { pl: 'Program koncepcyjny', en: 'Concept programme' },
  title: { pl: 'Możliwe rytuały codzienności.', en: 'Possible rituals of daily life.' },
  groups: [
    { id: 'water', title: { pl: 'Woda i ruch', en: 'Water and movement' },
      lede: { pl: 'Przykładowe studium strefy aktywności, pokazujące relację wody, kamienia i światła.', en: 'An illustrative study of an active-use zone exploring water, stone and light.' },
      asset: 'amenities.pool', asset2: 'amenities.fitness',
      items: [{ t: { pl: 'Strefa wodna', en: 'Water zone' }, d: { pl: 'motyw przestrzenny, nie zatwierdzony program', en: 'spatial concept, not an approved programme' } }, { t: { pl: 'Przestrzeń ruchu', en: 'Movement space' }, d: { pl: 'elastyczny układ funkcjonalny', en: 'a flexible functional layout' } }] },
    { id: 'green', title: { pl: 'Cisza i zieleń', en: 'Quiet and green' },
      lede: { pl: 'Koncepcyjny dziedziniec i wspólna przestrzeń wysoko nad miastem.', en: 'A conceptual courtyard and shared space above the city.' },
      asset: 'amenities.courtyard', asset2: 'amenities.lounge',
      items: [{ t: { pl: 'Zielony dziedziniec', en: 'Green courtyard' }, d: { pl: 'idea krajobrazowa do dalszego opracowania', en: 'landscape idea for further development' } }, { t: { pl: 'Przestrzeń wspólna', en: 'Shared space' }, d: { pl: 'propozycja programu, nie istniejąca usługa', en: 'a programme proposal, not an existing service' } }] },
    { id: 'service', title: { pl: 'Próg i obsługa', en: 'Threshold and service' },
      lede: { pl: 'Sekwencja wejścia, prywatności i dostępu w architektonicznym studium.', en: 'An architectural study of arrival, privacy and access.' },
      asset: 'amenities.concierge', asset2: 'amenities.garage',
      items: [{ t: { pl: 'Sekwencja wejścia', en: 'Arrival sequence' }, d: { pl: 'koncepcja lobby, bez aktywnego concierge', en: 'lobby concept, no live concierge' } }, { t: { pl: 'Zaplecze budynku', en: 'Building support' }, d: { pl: 'elementy schematyczne, nie projekt techniczny', en: 'schematic elements, not an engineering design' } }] }
  ]
};
