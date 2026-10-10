export const RM = matchMedia('(prefers-reduced-motion:reduce)').matches;
export const FINE_POINTER = matchMedia('(hover:hover) and (pointer:fine)').matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const isEN = () => document.documentElement.lang === 'en';
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
