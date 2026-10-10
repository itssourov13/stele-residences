/** Section order = page order = nav order. `nav: true` shows the link in the desktop bar; all appear in the mobile menu. */
export const SECTIONS = [
  { id: 'hero', label: { pl: 'Początek', en: 'Top' }, nav: false, menu: false },
  { id: 'manifesto', label: { pl: 'Manifest', en: 'Manifesto' }, nav: false, menu: true },
  { id: 'architecture', label: { pl: 'Architektura', en: 'Architecture' }, nav: true, menu: true },
  { id: 'tower', label: { pl: 'Wieża', en: 'Tower' }, nav: true, menu: true },
  { id: 'residences', label: { pl: 'Rezydencje', en: 'Residences' }, nav: true, menu: true },
  { id: 'interiors', label: { pl: 'Wnętrza', en: 'Interiors' }, nav: true, menu: true },
  { id: 'amenities', label: { pl: 'Udogodnienia', en: 'Amenities' }, nav: true, menu: true },
  { id: 'lifestyle', label: { pl: 'Życie', en: 'Living' }, nav: false, menu: true },
  { id: 'location', label: { pl: 'Lokalizacja', en: 'Location' }, nav: true, menu: true },
  { id: 'enquiry', label: { pl: 'Kontakt', en: 'Enquiry' }, nav: false, menu: true }
];
export const labLinks = [
  { href: '/labs/drone-flight/', label: { pl: 'Lab: lot dronem', en: 'Lab: drone flight' } },
  { href: '/labs/sales-cockpit/', label: { pl: 'Lab: cockpit sprzedaży', en: 'Lab: sales cockpit' } }
];
