/* =========================================================
   CÍRCULO GOLD · CAPA V4 «LA LUZ DEL JOYERO»
   - Cabecera: se vuelve vidrio al hacer scroll y muestra su única
     acción cuando el botón del héroe sale de la vista.
   - CTA fijo en móvil: aparece tras el héroe y se oculta cuando hay
     otro botón de compra a la vista (una sola acción en pantalla).
   - Destinos de compra: checkout si existe en curso-config.js;
     si no, lleva a la oferta (#precio-gold). Nunca queda roto.
   - Aurora esmeralda: arranca al verse (las cortinas entran desde el lateral)
     y se pausa cuando su sección no está a la vista.
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

  // Aurora esmeralda: sus texturas se piden al acercarse (.is-near) y las cortinas
  // solo ondulan mientras la sección está a la vista (.is-paused fuera de ella)
  function initAuroras() {
    const auroras = [...document.querySelectorAll('#page-root .v4-aurora')];
    if (!auroras.length) return;
    if (!hasIntersectionObserver) {
      auroras.forEach(aurora => aurora.classList.add('is-near', 'is-live'));
      return;
    }
    const near = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-near');
        near.unobserve(entry.target);
      });
    }, { rootMargin: '60% 0px' });
    // La primera vez que la sección se ve, las cortinas empiezan a entrar desde el lateral
    // (.is-live); después solo se pausan y se reanudan.
    const visible = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-live');
        entry.target.classList.toggle('is-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '10% 0px' });
    auroras.forEach(aurora => {
      near.observe(aurora);
      visible.observe(aurora);
    });
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
    initAuroras();
    initRevealSafetyNet();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}());
