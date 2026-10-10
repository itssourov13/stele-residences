import { FAQ } from '../content/faq.js';

/** Only the FAQ is structured data: STELE is a concept, not an existing apartment complex. */
export function injectStructuredData() {
  const data = [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.items.map((i) => ({
      '@type': 'Question',
      name: i.q.pl,
      acceptedAnswer: { '@type': 'Answer', text: i.a.pl }
    }))
  }];
  data.forEach((d) => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(d);
    document.head.appendChild(s);
  });
}
