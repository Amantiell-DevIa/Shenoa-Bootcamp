/* =========================================================
   CÍRCULO GOLD · CAPA V4 «LA LUZ DEL JOYERO»
   - Cabecera: se vuelve vidrio al hacer scroll y muestra su única
     acción cuando el botón del héroe sale de la vista.
   - CTA fijo en móvil: aparece tras el héroe y se oculta cuando hay
     otro botón de compra a la vista (una sola acción en pantalla).
   - Destinos de compra: checkout si existe en curso-config.js;
     si no, lleva a la oferta (#precio-gold). Nunca queda roto.
   - Escena de #transformacion: cambia de capítulo con el scroll.
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  if (!root.classList.contains('v4') || window.__CIRCULO_GOLD_V4__) return;
  window.__CIRCULO_GOLD_V4__ = true;

  const config = window.CIRCULO_GOLD_CONFIG || {};
  const hasIntersectionObserver = 'IntersectionObserver' in window;

  function isSecurePublicUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return false;
    try {
      return new URL(value, window.location.href).protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  function resolvePlanLinks() {
    const checkoutUrls = {
      gold: config.goldCheckoutUrl,
      steel: config.steelCheckoutUrl
    };

    document.querySelectorAll('[data-v4-plan]').forEach(link => {
      const checkoutUrl = checkoutUrls[link.dataset.v4Plan];
      if (!isSecurePublicUrl(checkoutUrl)) return;
      link.href = checkoutUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  function initShell() {
    const header = document.querySelector('[data-v4-header]');
    const headerCta = header?.querySelector('.v4-header__cta');
    const sticky = document.querySelector('[data-v4-sticky]');
    const heroCta = document.querySelector('#inicio .cg-hero__cta');
    const buyCtas = [...document.querySelectorAll('#page-root a[data-cg-plan]')];
    const visibleBuyCtas = new Set();
    let pastHero = false;

    function render() {
      if (header && headerCta) {
        header.classList.toggle('has-cta', pastHero);
        headerCta.tabIndex = pastHero ? 0 : -1;
        headerCta.setAttribute('aria-hidden', String(!pastHero));
      }

      if (sticky) {
        const showSticky = pastHero && visibleBuyCtas.size === 0;
        sticky.classList.toggle('is-visible', showSticky);
        sticky.inert = !showSticky;
      }
    }

    let scrollFrame = 0;
    function onScroll() {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        header?.classList.toggle('is-scrolled', window.scrollY > 8);
        if (!hasIntersectionObserver && heroCta) {
          pastHero = heroCta.getBoundingClientRect().bottom < 0;
          render();
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!hasIntersectionObserver) return;

    if (heroCta) {
      new IntersectionObserver(([entry]) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        render();
      }).observe(heroCta);
    }

    const buyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleBuyCtas.add(entry.target);
        else visibleBuyCtas.delete(entry.target);
      });
      render();
    });
    buyCtas.forEach(cta => buyObserver.observe(cta));
  }

  function initEscena() {
    const escena = document.querySelector('[data-v4-escena]');
    const section = escena?.closest('section');
    if (!escena || !section) return;

    const frames = [...escena.querySelectorAll('[data-v4-frame]')];
    const dots = [...escena.querySelectorAll('[data-v4-dot]')];
    const steps = [...section.querySelectorAll('[data-v4-step]')]
      .map(step => ({ element: step, chapter: Number(step.dataset.v4Step) }))
      .filter(step => step.chapter > 0);
    if (!frames.length || !steps.length) return;

    let current = 0;
    function setChapter(chapter) {
      if (chapter === current) return;
      current = chapter;
      frames.forEach(frame => frame.classList.toggle('is-active', Number(frame.dataset.v4Frame) === chapter));
      dots.forEach(dot => dot.classList.toggle('is-active', Number(dot.dataset.v4Dot) <= chapter));
      escena.dataset.chapter = String(chapter);
    }

    // El capítulo es el del último paso que cruzó el 60 % de la pantalla.
    let frame = 0;
    function update() {
      frame = 0;
      const line = window.innerHeight * 0.6;
      let chapter = 1;
      steps.forEach(step => {
        if (step.element.getBoundingClientRect().top < line) chapter = Math.max(chapter, step.chapter);
      });
      setChapter(chapter);
    }

    function requestUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    setChapter(1);

    if (!hasIntersectionObserver) {
      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate, { passive: true });
      return;
    }

    // Solo escucha el scroll mientras la escena está cerca de la vista.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate, { passive: true });
        requestUpdate();
      } else {
        window.removeEventListener('scroll', requestUpdate);
        window.removeEventListener('resize', requestUpdate);
      }
    }, { rootMargin: '25% 0px' }).observe(section);
  }

  // Red de seguridad de las apariciones: al detenerse el scroll, nada que ya
  // esté por encima del borde inferior de la pantalla se queda invisible
  // (un desplazamiento rápido podía saltarse el IntersectionObserver).
  function initRevealSafetyNet() {
    if (!hasIntersectionObserver) return;
    const targets = [...document.querySelectorAll('#page-root [data-cg-anim], #page-root .cg-stagger-items')];
    let timer = 0;

    function settle() {
      const bottom = window.innerHeight;
      targets.forEach(target => {
        if (target.classList.contains('is-visible')) return;
        if (target.getBoundingClientRect().top < bottom) target.classList.add('is-visible');
      });
    }

    window.addEventListener('scroll', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 180);
    }, { passive: true });
  }

  function boot() {
    resolvePlanLinks();
    initShell();
    initEscena();
    initRevealSafetyNet();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}());
