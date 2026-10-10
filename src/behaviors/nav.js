import { $, $$, RM } from '../core/env.js';
import { lockScroll, unlockScroll } from '../motion/scroll.js';

/** Header: scrolled state, hide-on-scroll-down, active-section indicator; mobile menu with focus trap, Escape, scroll lock and `inert`. */
export function initNav() {
  const header = $('#siteHeader'), burger = $('#burger'), menu = $('#mobileMenu');
  if (!header) return;
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY, dy = y - lastY;
      header.classList.toggle('is-scrolled', y > 40);
      if (y > 500 && dy > 8) header.classList.add('is-hidden'); else if (dy < -8 || y < 500) header.classList.remove('is-hidden');
      lastY = y; ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const links = $$('#siteNav a[href^="#"]');
  const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const a = map.get(e.target.id); if (!a || !e.isIntersecting) return;
    links.forEach((l) => l.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true');
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); s && io.observe(s); });

  if (!burger || !menu) return;
  const items = $$('.mobile-menu__nav a', menu);
  items.forEach((a, i) => a.style.setProperty('--i', i));
  const focusables = () => [burger, ...items, ...$$('.mobile-menu__foot a, .mobile-menu__foot button', menu)];
  const setOpen = (open) => {
    menu.classList.toggle('is-open', open); menu.inert = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    open ? lockScroll() : unlockScroll();
    if (open) setTimeout(() => items[0] && items[0].focus({ preventScroll: true }), RM ? 0 : 350);
  };
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setOpen(false); burger.focus(); return; }
    if (e.key === 'Tab') {
      const f = focusables(), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  matchMedia('(min-width:1101px)').addEventListener('change', (m) => { if (m.matches && menu.classList.contains('is-open')) setOpen(false); });
}
