/* =========================================================
   CÍRCULO GOLD · CAPA FLOW «EL ORO FLUYE» (fase 1, prototipo)
   - Desplazamiento con inercia (Lenis) con ratón o trackpad; en táctil
     se respeta el scroll nativo del teléfono.
   - Héroe: al bajar, fondo, Shenoa y titular se separan en profundidad.
   - #posibilidad: la sección se fija y oro, joyas y esmeraldas pasan
     en horizontal con el scroll vertical; la luz toma el color de la gema.
   - #seguridad, #comunidad y el cierre (terciopelo esmeralda): la aurora se desplaza con el scroll.
   - #transformacion: la sección se fija y el scroll funde el oro
     (56 fotogramas sin rótulos de escena/1zip); «Antes» cede el sitio
     a «Ahora con Gold».
   - Aro de marca de Círculo Gold: el scroll suma giro al giro lento de CSS.
   - Se activa con class="flow" en <html>. Sin GSAP o con movimiento
     reducido no hace nada y queda la V4 estática.
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  if (!root.classList.contains('v4') || !root.classList.contains('flow')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  root.classList.add('flow-on');

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Con Lenis el scroll ya llega suavizado; en táctil, medio segundo de arrastre suaviza el dedo.
  const scrub = finePointer ? true : 0.5;

  // Lo que mueve GSAP deja de usar las apariciones de script.js (no pueden mandar los dos).
  function release(elements) {
    elements.forEach(el => {
      if (!el) return;
      el.removeAttribute('data-cg-anim');
      el.removeAttribute('data-cg-delay');
      el.classList.add('is-visible');
    });
  }

  // 1 · Desplazamiento con inercia
  function initSmoothScroll() {
    if (!finePointer || root.classList.contains('cg-preview-mode') || typeof window.Lenis !== 'function') return;

    const header = document.querySelector('[data-v4-header]');
    const lenis = new window.Lenis({
      lerp: 0.085,
      anchors: { offset: -((header ? header.offsetHeight : 0) + 8) }
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    root.classList.add('flow-smooth');
  }

  // 2 · Héroe: la escena se abre en profundidad (fondo lento, Shenoa media, texto rápido)
  function initHero() {
    const hero = document.querySelector('#inicio');
    if (!hero) return;

    const vh = () => window.innerHeight;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub, invalidateOnRefresh: true }
    });

    const bg = hero.querySelector('.cg-hero__bg');
    const protas = hero.querySelector('.cg-hero__protas-box');
    const badge = hero.querySelector('.cg-hero__live-badge');
    const content = hero.querySelector('.cg-hero__center-content');

    if (bg) tl.fromTo(bg, { yPercent: 0, scale: 1, opacity: 1 }, { yPercent: 18, scale: 1.1, opacity: .35 }, 0);
    if (protas) tl.fromTo(protas, { y: 0, scale: 1 }, { y: () => -vh() * .08, scale: 1.08 }, 0);
    if (badge) tl.fromTo(badge, { y: 0, opacity: 1 }, { y: () => -vh() * .06, opacity: 0, duration: .6 }, 0);
    if (content) tl.fromTo(content, { y: 0, opacity: 1 }, { y: () => -vh() * .14, opacity: 0, ease: 'power1.in' }, 0);
  }

  // 3 · Mercados en horizontal: el scroll vertical desliza los tres mundos
  function initMarkets() {
    const section = document.querySelector('#posibilidad');
    const track = section ? section.querySelector('.cg-v2-market-cards') : null;
    const cards = track ? [...track.querySelectorAll('.cg-market-card')] : [];
    if (!section || cards.length < 2) return;

    release([...cards, section.querySelector('.cg-v2-possibility__closing')]);
    section.classList.add('flow-gallery');

    const progress = document.createElement('div');
    progress.className = 'flow-gallery__progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    track.after(progress);
    const fill = progress.firstElementChild;

    const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const slide = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + Math.round(distance() * 1.25),
        pin: true,
        scrub,
        invalidateOnRefresh: true,
        onUpdate: self => gsap.set(fill, { scaleX: self.progress })
      }
    });

    // La luz de la galería toma el color de la gema encendida (oro, joyas, esmeraldas)
    const gemLight = document.createElement('div');
    gemLight.className = 'flow-gem-light';
    gemLight.setAttribute('aria-hidden', 'true');
    section.prepend(gemLight);
    const gemOf = card => {
      const bg = card.querySelector('[class*="cg-market-card__bg--"]');
      const match = bg ? bg.className.match(/cg-market-card__bg--([a-z]+)/) : null;
      return match ? match[1] : 'oro';
    };

    // Siempre hay una sola tarjeta encendida: la última que cruzó el centro de la pantalla
    const light = card => {
      cards.forEach(other => other.classList.toggle('is-lit', other === card));
      section.dataset.gem = gemOf(card);
    };
    light(cards[0]);

    cards.forEach(card => {
      ScrollTrigger.create({
        trigger: card,
        containerAnimation: slide,
        start: 'left-=12 center',
        end: 'right+=12 center',
        onToggle: self => { if (self.isActive) light(card); }
      });

      // La foto se desliza dentro de su marco mientras la tarjeta pasa
      const bg = card.querySelector('.cg-market-card__bg');
      if (bg) {
        gsap.fromTo(bg, { xPercent: -5 }, {
          xPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: slide, start: 'left right', end: 'right left', scrub: true }
        });
      }
    });
  }

  // 4 · El oro se funde: el scroll avanza la secuencia y cuenta el antes y el ahora
  function initMelt() {
    const section = document.querySelector('#transformacion');
    if (!section) return;

    const heading = section.querySelector('.cg-v2-heading');
    const before = section.querySelector('.cg-future-card--before');
    const after = section.querySelector('.cg-future-card--after');
    const arrow = section.querySelector('.cg-future-arrow-wrapper');
    if (!before || !after) return;
    release([heading, before, after, arrow]);

    const FRAMES = 56;
    const stage = document.createElement('div');
    stage.className = 'flow-melt';
    stage.setAttribute('aria-hidden', 'true');
    stage.innerHTML = '<canvas class="flow-melt__canvas"></canvas><div class="flow-melt__veil"></div>';
    section.prepend(stage);
    section.classList.add('flow-melt-on');

    const canvas = stage.querySelector('canvas');
    const veil = stage.querySelector('.flow-melt__veil');
    const ctx = canvas.getContext('2d');

    // Pantallas verticales: fotogramas 9:16 de 540 px (~0,9 MB); el resto, 16:9 de 1280 px (~2,4 MB)
    const portrait = window.matchMedia('(max-aspect-ratio: 4/5)');
    const frames = { 540: [], 1280: [] };
    let size = portrait.matches ? 540 : 1280;
    let wanted = false;
    let current = 0;

    const ready = img => img && img.complete && img.naturalWidth > 0;

    function nearest(index) {
      const list = frames[size];
      for (let d = 0; d < FRAMES; d++) {
        if (ready(list[index - d])) return list[index - d];
        if (ready(list[index + d])) return list[index + d];
      }
      return null;
    }

    function draw() {
      const img = nearest(current);
      if (!img) return;
      const w = canvas.width;
      const h = canvas.height;
      const ratio = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * ratio;
      const dh = img.naturalHeight * ratio;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }

    function load(s) {
      if (frames[s].length) return;
      for (let i = 0; i < FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { if (s === size) draw(); };
        img.src = `assets/img/flow/oro-${s}-${String(i).padStart(2, '0')}.webp`;
        frames[s].push(img);
      }
    }

    function fit() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(stage.clientWidth * dpr);
      canvas.height = Math.round(stage.clientHeight * dpr);
      ctx.imageSmoothingQuality = 'high';
      const next = portrait.matches ? 540 : 1280;
      if (next !== size) {
        size = next;
        if (wanted) load(size);
      }
      draw();
    }

    // Los fotogramas se piden cuando la sección está a menos de pantalla y media
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        wanted = true;
        load(size);
        io.disconnect();
      }, { rootMargin: '150% 0px' });
      io.observe(section);
    } else {
      wanted = true;
      load(size);
    }
    fit();
    ScrollTrigger.addEventListener('refresh', fit);

    const state = { frame: 0 };
    const render = () => {
      const f = Math.round(state.frame);
      if (f === current) return;
      current = f;
      draw();
    };

    // El titular sube con la escena mientras la sección llega
    if (heading) {
      gsap.fromTo(heading, { y: 48, opacity: 0 }, {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 20%', scrub }
      });
    }

    const glowOff = '0 24px 48px rgba(0, 0, 0, .4), 0 0 0 rgba(226, 184, 79, 0)';
    const glowOn = '0 24px 48px rgba(0, 0, 0, .4), 0 0 72px rgba(226, 184, 79, .28)';

    gsap.matchMedia().add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, context => {
      const { wide } = context.conditions;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + Math.round(window.innerHeight * (wide ? 2.4 : 2.2)),
          pin: true,
          scrub,
          invalidateOnRefresh: true
        }
      });

      // El oro: de mineral en bruto a metal fundido que se vierte
      tl.to(state, { frame: FRAMES - 1, duration: 1, onUpdate: render }, 0)
        .fromTo(veil, { opacity: 1 }, { opacity: .82, duration: .3 }, .3)
        .to(veil, { opacity: 1, duration: .25 }, .75);

      tl.fromTo(before, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: .14, ease: 'power2.out' }, .03);

      if (wide) {
        // Escritorio: las dos tarjetas frente a frente; «Antes» se apaga y «Ahora» se enciende
        tl.fromTo(arrow, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .1, ease: 'power2.out' }, .4)
          .to(before, { opacity: .45, scale: .97, duration: .2 }, .44)
          .fromTo(after, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: .18, ease: 'power2.out' }, .5);
      } else {
        // Móvil: la misma tarjeta se transforma en su sitio
        tl.to(before, { opacity: 0, y: -24, duration: .14, ease: 'power1.in' }, .44)
          .fromTo(after, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .18, ease: 'power2.out' }, .52);
      }
      tl.fromTo(after, { boxShadow: glowOff }, { boxShadow: glowOn, duration: .25 }, .62);
    });
  }

  // 3b · Aurora esmeralda: sus cortinas ondulan solas (CSS); con el scroll, el cielo entero
  // se desplaza un poco (parallax) dentro de la máscara de la sección, sin costuras.
  function initEmeraldAura() {
    document.querySelectorAll('#page-root .v4-aurora__sky').forEach(sky => {
      gsap.fromTo(sky, { yPercent: -8 }, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: sky.closest('section'), start: 'top bottom', end: 'bottom top', scrub }
      });
    });
  }

  // 5 · Aro de marca: el scroll empuja el giro del aro de Círculo Gold (el giro lento sigue en CSS)
  function initRings() {
    document.querySelectorAll('#page-root .cg-ring').forEach(ring => {
      gsap.fromTo(ring, { rotation: -90 }, {
        rotation: 90,
        ease: 'none',
        scrollTrigger: { trigger: ring.closest('section') || ring, start: 'top bottom', end: 'bottom top', scrub }
      });
    });
  }

  // En orden de página: lo que va debajo de una sección fijada debe crearse después de ella
  initSmoothScroll();
  initHero();
  initMarkets();
  initEmeraldAura();
  initMelt();
  initRings();
  ScrollTrigger.sort();

  // Fuentes e imágenes cambian alturas: recalcular posiciones cuando todo cargó
  if (document.readyState === 'complete') ScrollTrigger.refresh();
  else window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}());
