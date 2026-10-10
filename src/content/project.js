export const PROJECT = {
  figures: [
    { value: 18, label: { pl: 'pięter w koncepcji', en: 'concept storeys' } },
    { value: 3, label: { pl: 'kolekcje rezydencji', en: 'residence collections' } },
    { value: 4, label: { pl: 'rodziny materiałów', en: 'material families' } },
    { value: 1, label: { pl: 'język architektury', en: 'architectural language' } }
  ],
  schedule: {
    label: { pl: 'Etapy koncepcji', en: 'Concept stages' },
    steps: [
      { when: '01 / FORM', done: true, title: { pl: 'Sylwetka wieży i podstawowa geometria', en: 'Tower silhouette and primary geometry' }, status: { pl: 'Etap koncepcyjny', en: 'Concept study' } },
      { when: '02 / MATERIAL', done: true, title: { pl: 'Paleta kamienia, szkła i metalu', en: 'Stone, glass and metal palette' }, status: { pl: 'Etap koncepcyjny', en: 'Concept study' } },
      { when: '03 / EXPERIENCE', done: false, title: { pl: 'Interaktywna prezentacja i dalsze dopracowanie', en: 'Interactive presentation and further refinement' }, status: { pl: 'Możliwy kolejny etap', en: 'Possible next stage' } }
    ]
  }
};
