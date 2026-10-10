/**
 * Site-wide configuration. STELE is a fictional architectural concept, not an active development.
 * Configure real services only after owner approval; the default form/chat are local demo states.
 */
export const SITE = {
  url: import.meta.env.VITE_SITE_URL || '',
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  phone: import.meta.env.VITE_CONTACT_PHONE || '',
  social: [],
  storage: { lang: 'stele-lang', consent: 'stele-consent', pulse: 'stele_pulse' },
  chatEndpoint: import.meta.env.VITE_CHAT_ENDPOINT || '',
  enquiryMode: import.meta.env.VITE_ENQUIRY_ENDPOINT ? 'endpoint' : 'demo',
  enquiryEndpoint: import.meta.env.VITE_ENQUIRY_ENDPOINT || ''
};
