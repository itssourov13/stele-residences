/**
 * STELE: brand definition. Change the name, tagline, voice and vocabulary here; components read from this file.
 *
 * Concept: a stele is a standing stone slab. The tower is one monolith, built in layers (strata) of stone and smoked glass.
 * Recurring motif: THE SLAB (tall 1:3 rectangle) and STRATA (fine horizontal course lines). Plates are numbered like architectural drawings.
 * Voice: calm, exact, declarative. Short sentences. Material and measurement instead of superlatives. No exclamation marks.
 */
export const BRAND = {
  name: 'STELE',
  legalName: 'STELE Residences',
  descriptor: { pl: 'Koncepcja architektury mieszkaniowej nad Odrą', en: 'Residential architecture concept by the Odra' },
  tagline: { pl: 'Kamień wzniesiony w światło.', en: 'Stone, raised into light.' },
  concierge: { name: 'Ines', role: { pl: 'przewodniczka po koncepcji', en: 'concept guide' } },
  vocabulary: {
    plate: { pl: 'Plansza', en: 'Plate' },
    stratum: { pl: 'Warstwa', en: 'Stratum' },
    storey: { pl: 'kondygnacja', en: 'storey' }
  },
  /** CTA language: verbs of looking and arriving, never of "buying". */
  cta: {
    chooseFloor: { pl: 'Wybierz piętro', en: 'Choose a floor' },
    architecture: { pl: 'Poznaj architekturę', en: 'Read the architecture' },
    viewing: { pl: 'Poznaj koncepcję', en: 'Explore the concept' },
    askConcierge: { pl: 'Zapytaj Ines', en: 'Ask Ines' },
    seePlan: { pl: 'Zobacz rzut i szczegóły', en: 'View plan and details' }
  },
  disclaimer: {
    pl: '<b>Projekt koncepcyjny.</b> STELE Residences jest fikcyjnym studium architektonicznym. Wizualizacje i zdjęcia to materiały referencyjne, a rzuty, metraże, ceny, dostępność, terminy i lokalizacja są wyłącznie ilustracyjne. To nie jest oferta sprzedaży.',
    en: '<b>Architectural concept.</b> STELE Residences is a fictional design study. Renderings and photographs are reference imagery; plans, areas, prices, availability, dates and location are illustrative only. This is not a property offer.'
  }
};
