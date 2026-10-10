/** Tiny template helpers. Components are pure functions: (props) => HTML string. No DOM access, so they could be pre-rendered later. */
export const cls = (...a) => a.flat().filter(Boolean).join(' ');
export const attrs = (o = {}) => Object.entries(o).filter(([, v]) => v !== false && v != null).map(([k, v]) => (v === true ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`)).join(' ');
export const html = (s, ...v) => s.reduce((o, x, i) => o + x + (v[i] ?? ''), '');
