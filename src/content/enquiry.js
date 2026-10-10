export const ENQUIRY = {
  plate: '10',
  label: { pl: 'Projekt koncepcyjny', en: 'Concept project' },
  title: { pl: 'Zajrzyj za kulisy koncepcji.', en: 'Explore the concept behind the project.' },
  lede: {
    pl: 'Ten formularz demonstruje interakcję i walidację. Bez skonfigurowanej integracji nic nie zostanie wysłane ani zapisane — STELE nie jest aktywną inwestycją.',
    en: 'This form demonstrates interaction and validation. Without a configured integration, nothing is sent or saved — STELE is not an active development.'
  },
  trust: [
    { pl: 'Dane i oferta mają charakter demonstracyjny', en: 'Content and offering are illustrative' },
    { pl: 'Brak rezerwacji i kontaktu sprzedażowego', en: 'No booking or sales contact' },
    { pl: 'Rzuty koncepcyjne, nie dokumentacja wykonawcza', en: 'Concept plans, not construction documents' }
  ],
  fields: {
    name: { pl: 'Imię (demo)', en: 'Name (demo)' }, email: { pl: 'E-mail (demo)', en: 'E-mail (demo)' }, phone: { pl: 'Telefon (opcjonalnie)', en: 'Phone (optional)' },
    interest: { pl: 'Co chcesz obejrzeć?', en: 'What would you like to explore?' }, any: { pl: 'Całą koncepcję', en: 'The full concept' },
    message: { pl: 'Notatka (opcjonalnie)', en: 'Note (optional)' },
    consent: { pl: 'Rozumiem, że to demonstracja — dane nie będą wysłane.', en: 'I understand this is a demo; my details will not be sent.' }
  },
  errors: {
    name: { pl: 'Wpisz co najmniej dwa znaki.', en: 'Enter at least two characters.' },
    email: { pl: 'Wpisz poprawny adres e-mail.', en: 'Enter a valid e-mail address.' },
    consent: { pl: 'Potwierdź, że rozumiesz charakter demonstracyjny formularza.', en: 'Confirm that you understand this is a demonstration form.' }
  },
  send: { pl: 'Sprawdź interakcję formularza', en: 'Test the form interaction' },
  sending: { pl: 'Przetwarzanie…', en: 'Processing…' },
  success: {
    title: { pl: 'Demo zakończone.', en: 'Demo complete.' },
    text: { pl: 'Walidacja działa. Ta wersja demonstracyjna nie wysłała ani nie zapisała Twoich danych.', en: 'Validation passed. This demo did not send or store your details.' }
  },
  demoNote: { pl: 'Tryb demonstracyjny: nic nie jest wysyłane. Integrację dodaj dopiero po uzyskaniu prawdziwych danych kontaktowych i polityki prywatności.', en: 'Demo mode: nothing is transmitted. Add an integration only after real contact details and a privacy policy are approved.' },
  mailtoNote: { pl: 'Otworzy się Twój program pocztowy z gotową wiadomością.', en: 'Your mail app will open with the message ready.' }
};
