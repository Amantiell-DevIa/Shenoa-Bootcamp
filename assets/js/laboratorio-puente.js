/* =========================================================
   CÍRCULO GOLD · Puente con laboratorio.html
   Antes vivía en línea al final de index.html y activaba el modo
   vista previa siempre, también en producción. Ahora solo lo hace
   dentro del iframe del laboratorio o con ?preview=1.
   ========================================================= */
(() => {
  const isEmbeddedInLab = (() => {
    try {
      return window.parent !== window && window.parent.location.origin === location.origin;
    } catch (error) {
      return false;
    }
  })();
  const isPreview = isEmbeddedInLab || new URLSearchParams(location.search).get('preview') === '1';

  if (isPreview) {
    document.documentElement.classList.add('cg-preview-mode');
    window.CIRCULO_GOLD_PREVIEW = true;
  }

  const sections = [
    ['inicio', '01 · Curiosidad'],
    ['dudas', '02 · Objeciones'],
    ['seguridad', '03 · Seguridad'],
    ['posibilidad', '04 · Posibilidad'],
    ['circulo-gold', '05 · Presentación Gold'],
    ['comunidad', '06 · Comunidad'],
    ['incluye-gold', '07 · Todo lo que incluye'],
    ['testimonios', '08 · Prueba'],
    ['transformacion', '09 · Future pacing'],
    ['precio-gold', '10 · Precio Gold'],
    ['empezar-hoy', '11 · Decisión'],
    ['circulo-acero', '12 · Oferta Acero'],
    ['preguntas-frecuentes', 'FAQ · Últimas dudas'],
    ['cierre', '13 · Cierre Gold']
  ];

  function headerOffset() {
    const header = document.querySelector('[data-v4-header]');
    return header && getComputedStyle(header).display !== 'none' ? header.offsetHeight : 0;
  }

  function scrollToPreviewSection(section, behavior = 'smooth') {
    const host = document.querySelector(`[data-preview-section="${section}"]`);
    const target = host?.querySelector('section, footer') || host?.firstElementChild || host;
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
    window.scrollTo({ top, left: 0, behavior });
  }

  function applyAppearance(state) {
    const html = document.documentElement;
    html.dataset.theme = state.theme;
    html.dataset.density = state.density;
    html.dataset.hideImages = String(state.hideImages);
    document.querySelector('#live-overrides').textContent = `
      .bootcamp-event-page {
        --gold: ${state.accent} !important;
        --gold2: color-mix(in srgb, ${state.accent} 64%, white) !important;
        --border: color-mix(in srgb, ${state.accent} 34%, transparent) !important;
      }
      .bootcamp-event-page .bo-btn {
        border-color: color-mix(in srgb, ${state.accent} 62%, white) !important;
        background: linear-gradient(135deg, color-mix(in srgb, ${state.accent} 62%, white), ${state.accent}) !important;
      }
    `;
  }

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent) return;
    if (event.data?.source !== 'curso-lab') return;
    if (event.data.type === 'appearance') applyAppearance(event.data.state);
    if (event.data.type === 'scroll') scrollToPreviewSection(event.data.section);
  });

  function boot() {
    const initialSection = new URLSearchParams(location.search).get('section');
    if (initialSection) {
      requestAnimationFrame(() => scrollToPreviewSection(initialSection, 'auto'));
    }

    if (!isEmbeddedInLab) return;

    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    const duplicatedIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const brokenAriaControls = [...document.querySelectorAll('[aria-controls]')]
      .filter(element => !document.getElementById(element.getAttribute('aria-controls')))
      .length;
    const diagnostics = {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      duplicatedIds,
      brokenAriaControls,
      pendingContent: document.querySelectorAll('[data-cg-pending], .is-pending').length,
      pendingCtas: document.querySelectorAll('[data-cg-plan].is-disabled').length
    };

    window.parent.postMessage({
      source: 'curso-preview',
      type: 'ready',
      sections: sections.map(([value, label]) => ({ value, label })),
      diagnostics
    }, location.origin);
  }

  // Se carga al final del <body>; los checkouts se resuelven en script.js (defer),
  // así que el diagnóstico espera a que termine de cargar la página.
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
