import '@fontsource-variable/newsreader';
import '@fontsource-variable/instrument-sans';
import '@fontsource/ibm-plex-mono/400.css';
import './styles/main.css';

import { detectLang, setInitialLang, applyLang, bindLangSwitch } from './i18n/index.js';
import { renderPage, SECTION_MODULES } from './app/page.js';
import { injectStructuredData } from './app/structured-data.js';
import { initScroll, ScrollTrigger } from './motion/scroll.js';
import { initMotion } from './motion/presets.js';
import { runPreloader } from './core/preloader.js';
import { initTelemetry } from './core/telemetry.js';
import { initNav } from './behaviors/nav.js';
import { initCursor } from './behaviors/cursor.js';
import { initMagnetic } from './behaviors/magnetic.js';
import { initMedia } from './behaviors/media.js';
import { initScrollSwap } from './behaviors/scroll-swap.js';
import { initLightbox } from './behaviors/lightbox.js';
import { initResidenceDialog } from './behaviors/residence-dialog.js';
import { initConsent } from './behaviors/consent.js';
import { initFaq } from './behaviors/faq.js';
import { initCounters } from './behaviors/counters.js';
import { initEnquiryForm } from './behaviors/enquiry-form.js';
import { initFloorRail } from './behaviors/floor-rail.js';
import { initConciergeChat } from './features/concierge-chat.js';

// 1. language first (render reads it), 2. markup from content + components, 3. behaviours
const lang = detectLang();
setInitialLang(lang);
document.getElementById('app').innerHTML = renderPage();
document.documentElement.classList.add('js');
bindLangSwitch();
applyLang(lang);                 // syncs switcher state; strings are already in the right language
injectStructuredData();

initNav();                       // before scroll: menu links must unlock Lenis before the anchor scroll runs
initScroll();
const ready = runPreloader();
initTelemetry();
initMedia();
initCursor();
SECTION_MODULES.forEach((m) => m.init && m.init(ready));   // each section owns its behaviour
initMotion();
initScrollSwap();
initLightbox();
initResidenceDialog();
initCounters();
initFaq();
initEnquiryForm();
initConciergeChat();
initConsent();
initMagnetic();
initFloorRail();

addEventListener('load', () => ScrollTrigger.refresh());
document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
