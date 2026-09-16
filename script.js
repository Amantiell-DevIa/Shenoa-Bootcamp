(function () {
  'use strict';

  document.documentElement.classList.add('js');

  if (window.__CIRCULO_GOLD_SCRIPT_LOADED__) return;
  window.__CIRCULO_GOLD_SCRIPT_LOADED__ = true;

  const config = window.CIRCULO_GOLD_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function isSecurePublicUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return false;

    try {
      return new URL(value, window.location.href).protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  function hydratePlanCtas() {
    const checkoutUrls = {
      gold: config.goldCheckoutUrl,
      steel: config.steelCheckoutUrl
    };

    document.querySelectorAll('[data-cg-plan]').forEach(link => {
      const checkoutUrl = checkoutUrls[link.dataset.cgPlan];

      if (isSecurePublicUrl(checkoutUrl)) {
        link.href = checkoutUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.removeAttribute('aria-disabled');
        link.removeAttribute('tabindex');
        link.classList.remove('is-disabled');
        return;
      }

      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.classList.add('is-disabled');
    });
  }

  function revealConfiguredCopy(selector, value) {
    if (typeof value !== 'string' || !value.trim()) return;

    document.querySelectorAll(selector).forEach(component => {
      const copy = component.querySelector('[data-cg-pending-copy]');
      if (copy) copy.textContent = value.trim();
      component.hidden = false;
      component.removeAttribute('data-cg-pending');
    });
  }

  function hydratePendingContent() {
    revealConfiguredCopy('[data-cg-support="gold"]', config.support?.gold);
    revealConfiguredCopy('[data-cg-support="steel"]', config.support?.steel);
    revealConfiguredCopy('[data-cg-access]', config.accessDuration);
  }

  function appendDefinition(list, label, value) {
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    list.append(term, description);
  }

  function hydrateTestimonials() {
    const testimonials = Array.isArray(config.testimonials)
      ? config.testimonials.filter(item => (
        item &&
        typeof item.name === 'string' && item.name.trim() &&
        typeof item.before === 'string' && item.before.trim() &&
        typeof item.learned === 'string' && item.learned.trim() &&
        typeof item.changed === 'string' && item.changed.trim()
      ))
      : [];

    if (!testimonials.length) return;

    document.querySelectorAll('[data-cg-testimonials]').forEach(grid => {
      grid.replaceChildren();

      testimonials.slice(0, 5).forEach(item => {
        const card = document.createElement('article');
        const name = document.createElement('strong');
        const details = document.createElement('dl');
        card.className = 'cg-testimonial';
        name.className = 'cg-testimonial__name';
        name.textContent = item.name.trim();
        appendDefinition(details, 'Antes', item.before.trim());
        appendDefinition(details, 'Lo que aprendió', item.learned.trim());
        appendDefinition(details, 'Qué cambió', item.changed.trim());
        card.append(name, details);
        grid.append(card);
      });
    });

    document.querySelectorAll('[data-cg-feature="testimonials"]').forEach(section => {
      section.hidden = false;
      section.classList.add('is-ready');
    });

    document.querySelectorAll('[data-cg-testimonial-placeholder]').forEach(placeholder => {
      placeholder.hidden = true;
    });
  }

  function activateFaqItem(item, items) {
    items.forEach(candidate => {
      const isCurrent = candidate === item;
      const trigger = candidate.querySelector('[data-cg-faq-trigger]');
      candidate.classList.toggle('is-open', isCurrent);
      trigger?.setAttribute('aria-expanded', String(isCurrent));
    });
  }

  function initFaq() {
    document.querySelectorAll('[data-cg-faq]').forEach(faq => {
      const items = [...faq.querySelectorAll('.bo-faq-item:not([hidden])')];
      const triggers = items
        .map(item => item.querySelector('[data-cg-faq-trigger]'))
        .filter(Boolean);

      if (!items.length) return;

      const initiallyOpen = items.find(item => item.classList.contains('is-open')) || items[0];
      activateFaqItem(initiallyOpen, items);

      faq.addEventListener('click', event => {
        const trigger = event.target.closest('[data-cg-faq-trigger]');
        if (!trigger || !faq.contains(trigger)) return;
        const item = trigger.closest('.bo-faq-item');
        if (item) activateFaqItem(item, items);
      });

      faq.addEventListener('keydown', event => {
        const trigger = event.target.closest('[data-cg-faq-trigger]');
        if (!trigger) return;

        const index = triggers.indexOf(trigger);
        if (index < 0) return;

        let nextIndex = null;
        if (event.key === 'ArrowDown') nextIndex = (index + 1) % triggers.length;
        if (event.key === 'ArrowUp') nextIndex = (index - 1 + triggers.length) % triggers.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = triggers.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        triggers[nextIndex].focus();
      });
    });
  }

  function initObjections() {
    const stack = document.querySelector('[data-cg-objections]');
    const section = stack?.closest('.cg-objections');
    const items = stack ? [...stack.querySelectorAll('[data-cg-objection]')] : [];
    const triggers = items
      .map(item => item.querySelector('.cg-objection-item__trigger'))
      .filter(Boolean);

    if (!stack || !section || items.length !== 3 || triggers.length !== items.length) return;

    const desktopViewport = window.matchMedia('(min-width: 981px)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const autoplayDelay = 5200;
    const interactionDelay = 8000;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;

    function restartProgress(duration) {
      stack.style.setProperty('--cg-objection-duration', `${duration}ms`);
      const fill = items[activeIndex]?.querySelector('.cg-objection-item__progress > span');
      if (!fill || reducedMotion.matches || !desktopViewport.matches) return;

      fill.style.animation = 'none';
      void fill.offsetWidth;
      fill.style.animation = '';
    }

    function setActiveObjection(index, progressDuration = autoplayDelay) {
      activeIndex = ((index % items.length) + items.length) % items.length;

      items.forEach((item, itemIndex) => {
        const isActive = itemIndex === activeIndex;
        const trigger = triggers[itemIndex];
        const panel = item.querySelector('.cg-objection-item__panel');
        item.classList.toggle('is-active', isActive);
        trigger.setAttribute('aria-expanded', String(isActive));
        panel?.setAttribute('aria-hidden', String(!isActive));
      });

      restartProgress(progressDuration);
    }

    function canAutoplay() {
      return (
        desktopViewport.matches &&
        !reducedMotion.matches &&
        sectionIsVisible &&
        !document.hidden
      );
    }

    function stopObjectionAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      stack.classList.add('is-autoplay-paused');
    }

    function startObjectionAutoplay(delay = autoplayDelay) {
      stopObjectionAutoplay();
      if (!canAutoplay()) return;

      stack.classList.remove('is-autoplay-paused');
      restartProgress(delay);
      autoplayTimer = window.setTimeout(() => {
        if (!canAutoplay()) return;
        setActiveObjection(activeIndex + 1, autoplayDelay);
        startObjectionAutoplay(autoplayDelay);
      }, delay);
    }

    function pauseAfterInteraction(index) {
      setActiveObjection(index, interactionDelay);
      startObjectionAutoplay(interactionDelay);
    }

    stack.addEventListener('click', event => {
      const trigger = event.target.closest('.cg-objection-item__trigger');
      if (!trigger || !stack.contains(trigger)) return;
      const index = triggers.indexOf(trigger);
      if (index >= 0) pauseAfterInteraction(index);
    });

    stack.addEventListener('keydown', event => {
      const trigger = event.target.closest('.cg-objection-item__trigger');
      if (!trigger) return;

      const index = triggers.indexOf(trigger);
      if (index < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % triggers.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + triggers.length) % triggers.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = triggers.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      triggers[nextIndex].focus();
    });

    stack.addEventListener('pointermove', event => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const item = event.target.closest('.cg-objection-item.is-active');
      if (!item || !stack.contains(item)) return;
      const bounds = item.getBoundingClientRect();
      item.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
      item.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
    });

    stack.addEventListener('pointerleave', () => {
      items.forEach(item => {
        item.style.setProperty('--mouse-x', '50%');
        item.style.setProperty('--mouse-y', '50%');
      });
    });

    function reconcileObjectionMotion() {
      if (reducedMotion.matches || !desktopViewport.matches) {
        stopObjectionAutoplay();
        setActiveObjection(0);
        return;
      }

      if (!canAutoplay()) {
        stopObjectionAutoplay();
        return;
      }

      startObjectionAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);

        if (!sectionIsVisible) {
          stopObjectionAutoplay();
          return;
        }

        if (!wasVisible) reconcileObjectionMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopObjectionAutoplay();
        return;
      }
      if (sectionIsVisible) startObjectionAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileObjectionMotion);
    reducedMotion.addEventListener?.('change', reconcileObjectionMotion);

    setActiveObjection(0);
    if (sectionIsVisible) reconcileObjectionMotion();
  }

  function initSecurityRail() {
    const section = document.querySelector('[data-cg-security]');
    const rail = section?.querySelector('[data-cg-security-rail]');
    const tabs = rail ? [...rail.querySelectorAll('[data-cg-security-tab]')] : [];
    const panels = section ? [...section.querySelectorAll('[data-cg-security-panel]')] : [];

    if (!section || !rail || tabs.length !== 3 || panels.length !== tabs.length) return;

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    const autoplayDelay = 5600;
    const interactionDelay = 8000;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let transitionTimer = 0;
    let decisionTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;

    function clearSecurityTimers() {
      window.clearTimeout(autoplayTimer);
      window.clearTimeout(transitionTimer);
      window.clearTimeout(decisionTimer);
      autoplayTimer = 0;
      transitionTimer = 0;
      decisionTimer = 0;
    }

    function updateSecurityTabs(index) {
      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.classList.toggle('is-active', isActive);
        tab.classList.remove('is-decided');
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });
    }

    function settleSecurityPoint(index) {
      window.clearTimeout(decisionTimer);
      if (reducedMotion.matches) return;

      decisionTimer = window.setTimeout(() => {
        tabs[index]?.classList.add('is-decided');
      }, 450);
    }

    function showSecurityPanel(index, immediate = false) {
      const currentPanel = panels.find(panel => !panel.hidden);
      const nextPanel = panels[index];

      if (!nextPanel) return;

      if (currentPanel === nextPanel) {
        panels.forEach((panel, panelIndex) => {
          panel.hidden = panelIndex !== index;
          panel.classList.toggle('is-active', panelIndex === index);
        });
        settleSecurityPoint(index);
        return;
      }

      const revealNext = () => {
        panels.forEach((panel, panelIndex) => {
          const isActive = panelIndex === index;
          panel.hidden = !isActive;
          panel.classList.toggle('is-active', isActive);
          panel.classList.remove('is-leaving', 'is-entering');
        });

        if (immediate || reducedMotion.matches) {
          settleSecurityPoint(index);
          return;
        }

        nextPanel.classList.add('is-entering');
        void nextPanel.offsetWidth;
        window.requestAnimationFrame(() => nextPanel.classList.remove('is-entering'));
        settleSecurityPoint(index);
      };

      if (!currentPanel || immediate || reducedMotion.matches) {
        revealNext();
        return;
      }

      currentPanel.classList.add('is-leaving');
      transitionTimer = window.setTimeout(revealNext, 130);
    }

    function setSecurityState(index, immediate = false) {
      window.clearTimeout(transitionTimer);
      window.clearTimeout(decisionTimer);
      activeIndex = ((index % tabs.length) + tabs.length) % tabs.length;
      updateSecurityTabs(activeIndex);
      showSecurityPanel(activeIndex, immediate);
    }

    function canSecurityAutoplay() {
      return (
        desktopViewport.matches &&
        !reducedMotion.matches &&
        sectionIsVisible &&
        !document.hidden
      );
    }

    function stopSecurityAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      rail.classList.add('is-paused');
    }

    function scheduleSecurityNext(delay = autoplayDelay) {
      stopSecurityAutoplay();
      if (!canSecurityAutoplay()) return;

      rail.classList.remove('is-paused');
      autoplayTimer = window.setTimeout(() => {
        if (!canSecurityAutoplay()) return;
        setSecurityState(activeIndex + 1);
        scheduleSecurityNext(autoplayDelay);
      }, delay);
    }

    function startSecurityAutoplay(delay = autoplayDelay) {
      scheduleSecurityNext(delay);
    }

    function pauseSecurityAfterInteraction(index) {
      setSecurityState(index);
      startSecurityAutoplay(interactionDelay);
    }

    rail.addEventListener('click', event => {
      const tab = event.target.closest('[data-cg-security-tab]');
      if (!tab || !rail.contains(tab)) return;
      const index = tabs.indexOf(tab);
      if (index >= 0) pauseSecurityAfterInteraction(index);
    });

    rail.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-cg-security-tab]');
      if (!tab) return;

      const index = tabs.indexOf(tab);
      if (index < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      tabs[nextIndex].focus();
      pauseSecurityAfterInteraction(nextIndex);
    });

    function reconcileSecurityMotion() {
      if (reducedMotion.matches) {
        clearSecurityTimers();
        setSecurityState(0, true);
        rail.classList.add('is-paused');
        return;
      }

      if (!canSecurityAutoplay()) {
        stopSecurityAutoplay();
        return;
      }

      startSecurityAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);
        section.classList.toggle('is-visible', sectionIsVisible);

        if (!sectionIsVisible) {
          stopSecurityAutoplay();
          return;
        }

        if (!wasVisible) reconcileSecurityMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    } else {
      section.classList.add('is-visible');
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopSecurityAutoplay();
        return;
      }
      if (sectionIsVisible) startSecurityAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileSecurityMotion);
    reducedMotion.addEventListener?.('change', reconcileSecurityMotion);

    setSecurityState(0, true);
    if (sectionIsVisible) reconcileSecurityMotion();
  }

  function initMarketDoors() {
    const section = document.querySelector('[data-cg-market-section]');
    const doorsRoot = section?.querySelector('[data-cg-market-doors]');
    const doors = doorsRoot ? [...doorsRoot.querySelectorAll('[data-cg-market-door]')] : [];
    const panels = doors.map(door => door.querySelector('.cg-market-door__content'));

    if (!section || !doorsRoot || doors.length !== 4 || panels.some(panel => !panel)) return;

    const desktopViewport = window.matchMedia('(min-width: 921px)');
    const autoplayDelay = 5500;
    const interactionDelay = 8000;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let transitionTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;

    function stopMarketAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      doorsRoot.classList.add('is-paused');
    }

    function canMarketAutoplay() {
      return (
        desktopViewport.matches &&
        !reducedMotion.matches &&
        sectionIsVisible &&
        !document.hidden
      );
    }

    function commitMarketCategory(index) {
      activeIndex = ((index % doors.length) + doors.length) % doors.length;

      doors.forEach((door, doorIndex) => {
        const isActive = doorIndex === activeIndex;
        door.classList.toggle('is-active', isActive);
        door.classList.remove('is-closing');
        door.setAttribute('aria-selected', String(isActive));
        door.tabIndex = isActive ? 0 : -1;
        panels[doorIndex].setAttribute('aria-hidden', String(!isActive));
      });
    }

    function setMarketCategory(index, immediate = false) {
      const nextIndex = ((index % doors.length) + doors.length) % doors.length;
      const currentDoor = doors[activeIndex];

      window.clearTimeout(transitionTimer);
      doors.forEach(door => door.classList.remove('is-closing'));

      if (immediate || reducedMotion.matches || nextIndex === activeIndex) {
        commitMarketCategory(nextIndex);
        return;
      }

      currentDoor?.classList.add('is-closing');
      transitionTimer = window.setTimeout(() => commitMarketCategory(nextIndex), 120);
    }

    function scheduleNextMarket(delay = autoplayDelay) {
      stopMarketAutoplay();
      if (!canMarketAutoplay()) return;

      doorsRoot.classList.remove('is-paused');
      autoplayTimer = window.setTimeout(() => {
        if (!canMarketAutoplay()) return;
        setMarketCategory(activeIndex + 1);
        scheduleNextMarket(autoplayDelay);
      }, delay);
    }

    function startMarketAutoplay(delay = autoplayDelay) {
      scheduleNextMarket(delay);
    }

    function pauseMarketAfterInteraction(index) {
      setMarketCategory(index);
      startMarketAutoplay(interactionDelay);
    }

    doorsRoot.addEventListener('click', event => {
      const door = event.target.closest('[data-cg-market-door]');
      if (!door || !doorsRoot.contains(door)) return;

      const index = doors.indexOf(door);
      if (index >= 0) pauseMarketAfterInteraction(index);
    });

    doorsRoot.addEventListener('keydown', event => {
      const door = event.target.closest('[data-cg-market-door]');
      if (!door) return;

      const index = doors.indexOf(door);
      if (index < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % doors.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + doors.length) % doors.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = doors.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      doors[nextIndex].focus();
      pauseMarketAfterInteraction(nextIndex);
    });

    function reconcileMarketMotion() {
      if (reducedMotion.matches) {
        stopMarketAutoplay();
        window.clearTimeout(transitionTimer);
        commitMarketCategory(0);
        return;
      }

      if (!canMarketAutoplay()) {
        stopMarketAutoplay();
        return;
      }

      startMarketAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);
        section.classList.toggle('is-visible', sectionIsVisible);

        if (!sectionIsVisible) {
          stopMarketAutoplay();
          return;
        }

        if (!wasVisible) reconcileMarketMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    } else {
      section.classList.add('is-visible');
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopMarketAutoplay();
        return;
      }
      if (sectionIsVisible) startMarketAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileMarketMotion);
    reducedMotion.addEventListener?.('change', reconcileMarketMotion);

    commitMarketCategory(0);
    if (sectionIsVisible) reconcileMarketMotion();
  }

  function initGoldStack() {
    const section = document.querySelector('[data-cg-gold-section]');
    const stack = section?.querySelector('[data-cg-gold-stack]');
    const tabs = stack ? [...stack.querySelectorAll('[data-cg-gold-tab]')] : [];
    const layers = stack ? [...stack.querySelectorAll('[data-cg-gold-layer]')] : [];
    const indicators = stack ? [...stack.querySelectorAll('.cg-gold-stack__position span')] : [];

    if (!section || !stack || tabs.length !== 4 || layers.length !== tabs.length || indicators.length !== tabs.length) return;

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    const autoplayDelay = 6000;
    const interactionDelay = 9000;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let transitionTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;

    function stopGoldAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      stack.classList.add('is-paused');
    }

    function canGoldAutoplay() {
      return (
        desktopViewport.matches &&
        !reducedMotion.matches &&
        sectionIsVisible &&
        !document.hidden
      );
    }

    function reorderGoldStack(index) {
      activeIndex = ((index % layers.length) + layers.length) % layers.length;

      layers.forEach((layer, layerIndex) => {
        const depth = (layerIndex - activeIndex + layers.length) % layers.length;
        const isActive = depth === 0;
        layer.dataset.depth = String(depth);
        layer.classList.toggle('is-active', isActive);
        layer.classList.remove('is-leaving');
        layer.setAttribute('aria-hidden', String(!isActive));
      });

      tabs.forEach((tab, tabIndex) => {
        const depth = (tabIndex - activeIndex + tabs.length) % tabs.length;
        const isActive = depth === 0;
        tab.dataset.depth = String(depth);
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      indicators.forEach((indicator, indicatorIndex) => {
        indicator.classList.toggle('is-active', indicatorIndex === activeIndex);
      });
    }

    function setGoldLayer(index, immediate = false) {
      const nextIndex = ((index % layers.length) + layers.length) % layers.length;
      const currentLayer = layers[activeIndex];

      window.clearTimeout(transitionTimer);
      layers.forEach(layer => layer.classList.remove('is-leaving'));

      if (immediate || reducedMotion.matches || nextIndex === activeIndex) {
        reorderGoldStack(nextIndex);
        return;
      }

      currentLayer?.classList.add('is-leaving');
      transitionTimer = window.setTimeout(() => reorderGoldStack(nextIndex), 130);
    }

    function scheduleNextGoldLayer(delay = autoplayDelay) {
      stopGoldAutoplay();
      if (!canGoldAutoplay()) return;

      stack.classList.remove('is-paused');
      autoplayTimer = window.setTimeout(() => {
        if (!canGoldAutoplay()) return;
        setGoldLayer(activeIndex + 1);
        scheduleNextGoldLayer(autoplayDelay);
      }, delay);
    }

    function startGoldAutoplay(delay = autoplayDelay) {
      scheduleNextGoldLayer(delay);
    }

    function pauseGoldAfterInteraction(index) {
      setGoldLayer(index);
      startGoldAutoplay(interactionDelay);
    }

    stack.addEventListener('click', event => {
      const tab = event.target.closest('[data-cg-gold-tab]');
      if (!tab || !stack.contains(tab)) return;

      const index = tabs.indexOf(tab);
      if (index >= 0) pauseGoldAfterInteraction(index);
    });

    stack.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-cg-gold-tab]');
      if (!tab) return;

      const index = tabs.indexOf(tab);
      if (index < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      tabs[nextIndex].focus();
      pauseGoldAfterInteraction(nextIndex);
    });

    function reconcileGoldMotion() {
      if (reducedMotion.matches) {
        stopGoldAutoplay();
        window.clearTimeout(transitionTimer);
        reorderGoldStack(0);
        return;
      }

      if (!canGoldAutoplay()) {
        stopGoldAutoplay();
        return;
      }

      startGoldAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);
        section.classList.toggle('is-visible', sectionIsVisible);

        if (!sectionIsVisible) {
          stopGoldAutoplay();
          return;
        }

        if (!wasVisible) reconcileGoldMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    } else {
      section.classList.add('is-visible');
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopGoldAutoplay();
        return;
      }
      if (sectionIsVisible) startGoldAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileGoldMotion);
    reducedMotion.addEventListener?.('change', reconcileGoldMotion);

    reorderGoldStack(0);
    if (sectionIsVisible) reconcileGoldMotion();
  }

  function initMentorshipFeed() {
    const section = document.querySelector('[data-cg-mentorship-section]');
    const feed = section?.querySelector('[data-cg-mentorship-feed]');
    const liveRegion = feed?.querySelector('[data-cg-mentorship-live]');
    const questions = feed ? [...feed.querySelectorAll('[data-cg-mentorship-question]')] : [];
    const summary = feed?.querySelector('[data-cg-mentorship-summary]');
    const indexes = feed ? [...feed.querySelectorAll('[data-cg-mentorship-index]')] : [];
    const nextButton = feed?.querySelector('[data-cg-mentorship-next]');

    if (!section || !feed || !liveRegion || questions.length !== 3 || indexes.length !== questions.length || !summary || !nextButton) return;

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    const autoplayDelay = 7600;
    const interactionDelay = 10000;
    const summaryDelay = 2500;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let transitionTimer = 0;
    let liveRegionTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;
    let summaryIsVisible = false;

    function clearMentorshipTimers() {
      window.clearTimeout(autoplayTimer);
      window.clearTimeout(transitionTimer);
      window.clearTimeout(liveRegionTimer);
      autoplayTimer = 0;
      transitionTimer = 0;
      liveRegionTimer = 0;
    }

    function stopMentorshipAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      feed.classList.add('is-paused');
    }

    function canMentorshipAutoplay() {
      return (
        desktopViewport.matches &&
        !reducedMotion.matches &&
        sectionIsVisible &&
        !document.hidden
      );
    }

    function updateMentorshipIndexes(index) {
      indexes.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === index;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.tabIndex = isActive ? 0 : -1;
      });
    }

    function transitionMentorshipView(target, immediate = false) {
      const states = [...questions, summary];
      const current = states.find(state => !state.hidden && state.classList.contains('is-active'));

      window.clearTimeout(transitionTimer);
      states.forEach(state => state.classList.remove('is-leaving'));

      const reveal = () => {
        states.forEach(state => {
          const isTarget = state === target;
          state.hidden = !isTarget;
          state.classList.toggle('is-active', isTarget);
          state.classList.remove('is-leaving');
        });
      };

      if (!current || current === target || immediate || reducedMotion.matches) {
        reveal();
        return;
      }

      current.classList.add('is-leaving');
      transitionTimer = window.setTimeout(reveal, 140);
    }

    function announceManualMentorshipChange() {
      window.clearTimeout(liveRegionTimer);
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegionTimer = window.setTimeout(() => {
        liveRegion.setAttribute('aria-live', 'off');
      }, 1400);
    }

    function setMentorshipQuestion(index, options = {}) {
      const { immediate = false, manual = false } = options;
      activeIndex = ((index % questions.length) + questions.length) % questions.length;
      summaryIsVisible = false;
      feed.classList.remove('is-summary');
      updateMentorshipIndexes(activeIndex);
      transitionMentorshipView(questions[activeIndex], immediate);
      if (manual) announceManualMentorshipChange();
    }

    function showMentorshipSummary() {
      if (!canMentorshipAutoplay()) return;
      summaryIsVisible = true;
      feed.classList.add('is-summary');
      liveRegion.setAttribute('aria-live', 'off');
      transitionMentorshipView(summary);
    }

    function scheduleNextMentorshipQuestion(delay = autoplayDelay) {
      stopMentorshipAutoplay();
      if (!canMentorshipAutoplay()) return;

      feed.classList.remove('is-paused');
      autoplayTimer = window.setTimeout(() => {
        if (!canMentorshipAutoplay()) return;

        if (activeIndex === questions.length - 1 && !summaryIsVisible) {
          showMentorshipSummary();
          autoplayTimer = window.setTimeout(() => {
            if (!canMentorshipAutoplay()) return;
            setMentorshipQuestion(0);
            scheduleNextMentorshipQuestion(autoplayDelay);
          }, summaryDelay);
          return;
        }

        setMentorshipQuestion(activeIndex + 1);
        scheduleNextMentorshipQuestion(autoplayDelay);
      }, delay);
    }

    function startMentorshipAutoplay(delay = autoplayDelay) {
      scheduleNextMentorshipQuestion(delay);
    }

    function pauseMentorshipAfterInteraction(index) {
      stopMentorshipAutoplay();
      window.clearTimeout(transitionTimer);
      setMentorshipQuestion(index, { manual: true });
      startMentorshipAutoplay(interactionDelay);
    }

    nextButton.addEventListener('click', () => {
      pauseMentorshipAfterInteraction(summaryIsVisible ? 0 : activeIndex + 1);
    });

    indexes.forEach((button, index) => {
      button.addEventListener('click', () => pauseMentorshipAfterInteraction(index));
    });

    feed.addEventListener('keydown', event => {
      if (!event.target.closest('button')) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (activeIndex + 1) % questions.length;
      if (event.key === 'ArrowLeft') nextIndex = (activeIndex - 1 + questions.length) % questions.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = questions.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      indexes[nextIndex].focus();
      pauseMentorshipAfterInteraction(nextIndex);
    });

    function reconcileMentorshipMotion() {
      if (reducedMotion.matches) {
        clearMentorshipTimers();
        setMentorshipQuestion(0, { immediate: true });
        feed.classList.add('is-paused');
        return;
      }

      if (!canMentorshipAutoplay()) {
        stopMentorshipAutoplay();
        return;
      }

      startMentorshipAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);
        section.classList.toggle('is-visible', sectionIsVisible);

        if (!sectionIsVisible) {
          stopMentorshipAutoplay();
          return;
        }

        if (!wasVisible) reconcileMentorshipMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    } else {
      section.classList.add('is-visible');
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopMentorshipAutoplay();
        return;
      }
      if (sectionIsVisible) startMentorshipAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileMentorshipMotion);
    reducedMotion.addEventListener?.('change', reconcileMentorshipMotion);

    setMentorshipQuestion(0, { immediate: true });
    if (sectionIsVisible) reconcileMentorshipMotion();
  }

  function initGoldResourceIndex() {
    const section = document.querySelector('[data-cg-resource-section]');
    const index = section?.querySelector('[data-cg-resource-index]');
    const detail = section?.querySelector('[data-cg-resource-detail]');
    const detailContent = detail?.querySelector('[data-cg-resource-detail-content]');
    const resourceButtons = index ? [...index.querySelectorAll('[data-cg-resource-button]')] : [];
    const categoryButtons = section ? [...section.querySelectorAll('[data-cg-resource-category]')] : [];
    const previousButton = section?.querySelector('[data-cg-resource-previous]');
    const nextButton = section?.querySelector('[data-cg-resource-next]');
    const indexToggle = section?.querySelector('[data-cg-resource-index-toggle]');
    const indexToggleLabel = indexToggle?.querySelector('[data-cg-resource-index-toggle-label]');
    const categoryLabel = detail?.querySelector('[data-cg-resource-category-label]');
    const counter = detail?.querySelector('[data-cg-resource-counter]');
    const title = detail?.querySelector('[data-cg-resource-title]');
    const headline = detail?.querySelector('[data-cg-resource-headline]');
    const body = detail?.querySelector('[data-cg-resource-body]');
    const footnote = detail?.querySelector('[data-cg-resource-footnote]');
    const decorativeNumber = detail?.querySelector('[data-cg-resource-decorative]');

    const goldResources = [
      {
        category: 'APRENDER',
        title: 'RUTA PARA TU PRIMERA INVERSIÓN EN 60 DÍAS',
        headline: 'NO TIENES QUE EMPEZAR\nSIN SABER QUÉ VIENE DESPUÉS.',
        body: ['Tienes una dirección para organizar tus primeros movimientos y dejar de consumir información sin saber por dónde seguir.'],
        micro: 'Menos vueltas.\nMás claridad sobre el siguiente movimiento.'
      },
      {
        category: 'APRENDER',
        title: '6 MÓDULOS GRABADOS',
        headline: 'NO TIENES QUE ENTENDERLO TODO\nA LA PRIMERA.',
        body: ['La formación queda disponible para que puedas volver a una idea cuando necesites repasarla.'],
        micro: 'Aprendes a tu ritmo.\nVuelves cuando lo necesites.'
      },
      {
        category: 'ACOMPAÑAMIENTO',
        title: '1 MENTORÍA CADA SEMANA',
        headline: 'TRAES LA DUDA.\nLA PONES SOBRE LA MESA.',
        body: ['Cada semana tienes un espacio para llevar preguntas, revisar situaciones y seguir avanzando con más claridad.'],
        micro: 'No tienes que quedarte\ndándole vueltas solo.'
      },
      {
        category: 'ACOMPAÑAMIENTO',
        title: 'SOPORTE',
        headline: 'CUANDO APARECE UNA DUDA,\nTIENES DÓNDE LLEVARLA.',
        body: ['Tienes un canal de apoyo para consultar dudas durante tu recorrido.'],
        micro: 'La duda no tiene que quedarse\ndando vueltas en tu cabeza.'
      },
      {
        category: 'ACCESO',
        title: 'ACCESO PRIORITARIO A DROPS',
        headline: 'HAY COSAS QUE ES MÁS FÁCIL\nAPRENDER CUANDO LAS TIENES DELANTE.',
        body: ['Te acercas a nuevas piezas, productos y oportunidades cuando aparecen.'],
        micro: 'Más cosas reales que observar.\nMenos teoría flotando sola.'
      },
      {
        category: 'ACCESO',
        title: 'CATÁLOGO EXCLUSIVO ELEGIDO POR EL EQUIPO',
        headline: 'NO TIENES QUE EMPEZAR\nCADA BÚSQUEDA DESDE CERO.',
        body: ['Tienes productos concretos seleccionados por el equipo para observar, comparar y analizar.'],
        micro: 'Menos búsqueda.\nMás referencias delante.'
      },
      {
        category: 'VENDER',
        title: 'CATÁLOGO + POSIBLE REVENTA',
        headline: 'EMPIEZAS A MIRAR\nTAMBIÉN LA SALIDA.',
        body: [
          'Los productos dejan de verse solamente desde el lado de la compra.',
          'También empiezas a pensar quién podría quererlos y qué margen podría existir.'
        ],
        disclaimer: 'El margen depende de cada operación, precio de compra, mercado y capacidad de venta. No existe una cifra garantizada.'
      },
      {
        category: 'VENDER',
        title: 'ESTRATEGIA DE VENTA DIRECTA',
        headline: 'ENCONTRAR UNA PIEZA\nES SOLO UNA PARTE.',
        body: ['También empiezas a pensar cómo presentarla, cómo ofrecerla y cómo acercarla a un posible comprador.'],
        micro: 'Comprar es una parte.\nSaber qué hacer después es la otra.'
      },
      {
        category: 'VENDER',
        title: 'CÓMO MONTAR TU TIENDA DE JOYAS ONLINE',
        headline: 'TU PROPIO ESCAPARATE.',
        body: ['Aprendes una vía para presentar tus productos y construir un espacio propio de venta online.'],
        micro: 'De mirar productos\na empezar a mostrar los tuyos.'
      },
      {
        category: 'EXPANDIR',
        title: 'PIEDRAS PRECIOSAS Y JOYAS',
        headline: 'CUANDO AMPLÍAS LO QUE ENTIENDES,\nEMPIEZAS A VER MÁS.',
        body: ['Abres la mirada hacia piedras preciosas y otras joyas como nuevas categorías que observar.'],
        micro: 'Más categorías.\nMás cosas que aprender a leer.'
      },
      {
        category: 'EXPANDIR',
        title: 'COMPRA Y VENTA DE RELOJES DE LUJO',
        headline: 'EL MAPA NO TERMINA EN EL ORO.',
        body: ['Te acercas también al mundo de los relojes de lujo: referencias, demanda, compradores, vendedores y movimiento.'],
        micro: 'Otra categoría.\nOtra forma de mirar oportunidades.'
      }
    ];

    if (
      !section || !index || !detail || !detailContent ||
      resourceButtons.length !== goldResources.length || categoryButtons.length !== 5 ||
      !previousButton || !nextButton || !indexToggle || !indexToggleLabel ||
      !categoryLabel || !counter || !title || !headline || !body || !footnote || !decorativeNumber
    ) return;

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    const autoplayDelay = 6200;
    const interactionDelay = 10000;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let transitionTimer = 0;
    let categoryHighlightTimer = 0;
    let liveRegionTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;

    function stopGoldResourceAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      section.classList.add('is-paused');
    }

    function canGoldResourceAutoplay() {
      return desktopViewport.matches && !reducedMotion.matches && sectionIsVisible && !document.hidden;
    }

    function updateResourceButtons(resourceIndex) {
      resourceButtons.forEach((button, buttonIndex) => {
        const isActive = buttonIndex === resourceIndex;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', String(isActive));
        button.tabIndex = isActive ? 0 : -1;
      });

      const currentCategory = goldResources[resourceIndex].category;
      categoryButtons.forEach(button => {
        const isActive = button.dataset.cgResourceCategory === currentCategory;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    }

    function updateResourceContent(resourceIndex) {
      const resource = goldResources[resourceIndex];
      const formattedIndex = String(resourceIndex + 1).padStart(2, '0');

      categoryLabel.textContent = resource.category;
      counter.textContent = `${formattedIndex} / ${goldResources.length}`;
      title.textContent = resource.title;
      headline.textContent = resource.headline;
      body.replaceChildren(...resource.body.map(paragraphCopy => {
        const paragraph = document.createElement('p');
        paragraph.textContent = paragraphCopy;
        return paragraph;
      }));
      footnote.textContent = resource.disclaimer || resource.micro || '';
      footnote.hidden = !footnote.textContent;
      footnote.classList.toggle('is-disclaimer', Boolean(resource.disclaimer));
      decorativeNumber.textContent = formattedIndex;
      detail.setAttribute('aria-labelledby', resourceButtons[resourceIndex].id);
    }

    function renderGoldResource(resourceIndex, options = {}) {
      const { immediate = false, categoryChanged = false } = options;
      window.clearTimeout(transitionTimer);
      window.clearTimeout(categoryHighlightTimer);
      detail.classList.remove('is-leaving', 'is-entering', 'is-category-change');

      if (categoryChanged) {
        detail.classList.add('is-category-change');
        categoryHighlightTimer = window.setTimeout(() => detail.classList.remove('is-category-change'), 520);
      }

      if (immediate || reducedMotion.matches) {
        updateResourceContent(resourceIndex);
        return;
      }

      detail.classList.add('is-leaving');
      transitionTimer = window.setTimeout(() => {
        updateResourceContent(resourceIndex);
        detail.classList.remove('is-leaving');
        detail.classList.add('is-entering');
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => detail.classList.remove('is-entering'));
        });
      }, 140);
    }

    function announceManualResourceChange() {
      window.clearTimeout(liveRegionTimer);
      detail.setAttribute('aria-live', 'polite');
      liveRegionTimer = window.setTimeout(() => detail.setAttribute('aria-live', 'off'), 1500);
    }

    function setGoldResource(resourceIndex, options = {}) {
      const { immediate = false, manual = false, returnToDetail = false } = options;
      const normalizedIndex = ((resourceIndex % goldResources.length) + goldResources.length) % goldResources.length;
      const previousCategory = goldResources[activeIndex]?.category;
      activeIndex = normalizedIndex;
      updateResourceButtons(activeIndex);
      renderGoldResource(activeIndex, {
        immediate,
        categoryChanged: previousCategory !== goldResources[activeIndex].category
      });

      if (manual) announceManualResourceChange();

      if (returnToDetail && !desktopViewport.matches) {
        index.classList.remove('is-expanded');
        indexToggle.setAttribute('aria-expanded', 'false');
        indexToggleLabel.textContent = 'VER LOS 11 RECURSOS';
        detail.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
      }
    }

    function scheduleNextGoldResource(delay = autoplayDelay) {
      stopGoldResourceAutoplay();
      if (!canGoldResourceAutoplay()) return;
      section.classList.remove('is-paused');
      autoplayTimer = window.setTimeout(() => {
        if (!canGoldResourceAutoplay()) return;
        setGoldResource(activeIndex + 1);
        scheduleNextGoldResource(autoplayDelay);
      }, delay);
    }

    function startGoldResourceAutoplay(delay = autoplayDelay) {
      scheduleNextGoldResource(delay);
    }

    function pauseGoldResourceAfterInteraction(resourceIndex, options = {}) {
      stopGoldResourceAutoplay();
      setGoldResource(resourceIndex, { ...options, manual: true });
      startGoldResourceAutoplay(interactionDelay);
    }

    resourceButtons.forEach((button, buttonIndex) => {
      button.addEventListener('click', () => {
        pauseGoldResourceAfterInteraction(buttonIndex, { returnToDetail: index.classList.contains('is-expanded') });
      });
    });

    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const resourceIndex = goldResources.findIndex(resource => resource.category === button.dataset.cgResourceCategory);
        if (resourceIndex >= 0) pauseGoldResourceAfterInteraction(resourceIndex);
      });
    });

    previousButton.addEventListener('click', () => pauseGoldResourceAfterInteraction(activeIndex - 1));
    nextButton.addEventListener('click', () => pauseGoldResourceAfterInteraction(activeIndex + 1));

    indexToggle.addEventListener('click', () => {
      const isExpanded = !index.classList.contains('is-expanded');
      stopGoldResourceAutoplay();
      index.classList.toggle('is-expanded', isExpanded);
      indexToggle.setAttribute('aria-expanded', String(isExpanded));
      indexToggleLabel.textContent = isExpanded ? 'OCULTAR LOS 11 RECURSOS' : 'VER LOS 11 RECURSOS';
      startGoldResourceAutoplay(interactionDelay);
    });

    index.addEventListener('keydown', event => {
      const currentButton = event.target.closest('[data-cg-resource-button]');
      if (!currentButton) return;

      const currentIndex = resourceButtons.indexOf(currentButton);
      let nextIndex = null;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % goldResources.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + goldResources.length) % goldResources.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = goldResources.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      resourceButtons[nextIndex].focus();
      pauseGoldResourceAfterInteraction(nextIndex);
    });

    function reconcileGoldResourceMotion() {
      if (reducedMotion.matches) {
        stopGoldResourceAutoplay();
        window.clearTimeout(transitionTimer);
        setGoldResource(0, { immediate: true });
        return;
      }

      if (!canGoldResourceAutoplay()) {
        stopGoldResourceAutoplay();
        return;
      }

      startGoldResourceAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);

        if (!sectionIsVisible) {
          stopGoldResourceAutoplay();
          return;
        }

        if (!wasVisible) reconcileGoldResourceMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopGoldResourceAutoplay();
        return;
      }
      if (sectionIsVisible) startGoldResourceAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileGoldResourceMotion);
    reducedMotion.addEventListener?.('change', reconcileGoldResourceMotion);

    setGoldResource(0, { immediate: true });
    if (sectionIsVisible) reconcileGoldResourceMotion();
  }

  function initPageCursorGlow() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const glow = document.querySelector('.cg-page-cursor-glow') || document.createElement('div');
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    glow.className = 'cg-page-cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    if (!glow.isConnected) document.body.append(glow);

    function renderGlow() {
      frame = 0;
      glow.style.setProperty('--cg-page-pointer-x', `${pointerX}px`);
      glow.style.setProperty('--cg-page-pointer-y', `${pointerY}px`);
    }

    document.addEventListener('pointermove', event => {
      const isOverLanding = Boolean(event.target.closest?.('.circle-gold-page'));
      const suppressesCursorGlow = Boolean(event.target.closest?.('[data-cg-security], [data-cg-market-section], [data-cg-gold-section]'));
      if (!isOverLanding || suppressesCursorGlow || reducedMotion.matches) {
        glow.classList.remove('is-visible');
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      glow.classList.add('is-visible');
      if (!frame) frame = window.requestAnimationFrame(renderGlow);
    }, { passive: true });

    document.addEventListener('pointerout', event => {
      if (!event.relatedTarget) glow.classList.remove('is-visible');
    });

    reducedMotion.addEventListener?.('change', () => {
      if (reducedMotion.matches) glow.classList.remove('is-visible');
    });
  }

  function initInsights() {
    const player = document.querySelector('[data-cg-insight-player]');
    const section = player?.closest('.cg-clarity');
    const tabs = player ? [...player.querySelectorAll('[data-cg-insight-tab]')] : [];
    const panels = player ? [...player.querySelectorAll('[data-cg-insight-panel]')] : [];
    const conclusion = player?.querySelector('[data-cg-insight-conclusion]');
    const showConclusionButton = player?.querySelector('[data-cg-insight-show-conclusion]');
    const resetButton = player?.querySelector('[data-cg-insight-reset]');

    if (!player || !section || tabs.length !== 4 || panels.length !== 4 || !conclusion) return;

    const desktopViewport = window.matchMedia('(min-width: 981px)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const autoplayDelay = 4100;
    const interactionDelay = 7000;
    const conclusionDelay = 2500;
    const returnDelay = 3000;
    let activeIndex = 0;
    let autoplayTimer = 0;
    let transitionTimer = 0;
    let breathTimer = 0;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let hasEnteredViewport = false;
    let conclusionIsVisible = false;

    function clearPlayerTimers() {
      window.clearTimeout(autoplayTimer);
      window.clearTimeout(transitionTimer);
      window.clearTimeout(breathTimer);
      autoplayTimer = 0;
      transitionTimer = 0;
      breathTimer = 0;
    }

    function resetInsightProgress(duration) {
      player.style.setProperty('--progress-duration', `${duration}ms`);
      player.classList.remove('is-progressing');
      void player.offsetWidth;
      if (!reducedMotion.matches && desktopViewport.matches && !conclusionIsVisible) {
        player.classList.add('is-progressing');
      }
    }

    function breathe() {
      window.clearTimeout(breathTimer);
      player.classList.remove('is-breathing');
      void player.offsetWidth;
      if (!reducedMotion.matches) player.classList.add('is-breathing');
      breathTimer = window.setTimeout(() => player.classList.remove('is-breathing'), 760);
    }

    function transitionTo(target, immediate = false) {
      window.clearTimeout(transitionTimer);
      const candidates = [...panels, conclusion];
      const outgoing = candidates.find(candidate => !candidate.hidden && candidate.classList.contains('is-active'));

      candidates.forEach(candidate => candidate.classList.remove('is-leaving'));
      if (!outgoing || outgoing === target || immediate || reducedMotion.matches) {
        candidates.forEach(candidate => {
          const isTarget = candidate === target;
          candidate.hidden = !isTarget;
          candidate.classList.toggle('is-active', isTarget);
        });
        player.classList.remove('is-transitioning');
        return;
      }

      player.classList.add('is-transitioning');
      outgoing.classList.add('is-leaving');
      transitionTimer = window.setTimeout(() => {
        candidates.forEach(candidate => {
          candidate.hidden = candidate !== target;
          candidate.classList.remove('is-active', 'is-leaving');
        });
        target.hidden = false;
        void target.offsetWidth;
        target.classList.add('is-active');
        player.classList.remove('is-transitioning');
      }, 170);
    }

    function updateTabs(index) {
      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    }

    function setInsightState(index, immediate = false) {
      activeIndex = ((index % panels.length) + panels.length) % panels.length;
      conclusionIsVisible = false;
      player.classList.remove('is-conclusion');
      updateTabs(activeIndex);
      transitionTo(panels[activeIndex], immediate);
      breathe();
    }

    function showInsightConclusion(automatic = false) {
      stopInsightAutoplay();
      conclusionIsVisible = true;
      player.classList.add('is-conclusion');
      player.classList.remove('is-progressing');
      transitionTo(conclusion);
      breathe();

      if (automatic && canInsightAutoplay()) {
        autoplayTimer = window.setTimeout(() => {
          setInsightState(0);
          startInsightAutoplay(autoplayDelay);
        }, conclusionDelay);
      }
    }

    function canInsightAutoplay() {
      return (
        desktopViewport.matches &&
        !reducedMotion.matches &&
        sectionIsVisible &&
        !document.hidden
      );
    }

    function stopInsightAutoplay() {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = 0;
      player.classList.add('is-paused');
      player.classList.remove('is-progressing');
    }

    function scheduleNextInsight(delay = autoplayDelay) {
      window.clearTimeout(autoplayTimer);
      if (!canInsightAutoplay()) return;

      player.classList.remove('is-paused');
      if (conclusionIsVisible) {
        autoplayTimer = window.setTimeout(() => {
          setInsightState(0);
          startInsightAutoplay(autoplayDelay);
        }, delay);
        return;
      }

      resetInsightProgress(delay);
      autoplayTimer = window.setTimeout(() => {
        if (!canInsightAutoplay()) return;
        if (activeIndex === panels.length - 1) {
          showInsightConclusion(true);
          return;
        }
        setInsightState(activeIndex + 1);
        scheduleNextInsight(autoplayDelay);
      }, delay);
    }

    function startInsightAutoplay(delay = autoplayDelay) {
      stopInsightAutoplay();
      if (!canInsightAutoplay()) return;
      scheduleNextInsight(delay);
    }

    function pauseInsightAfterInteraction(index) {
      stopInsightAutoplay();
      setInsightState(index);
      startInsightAutoplay(interactionDelay);
    }

    player.addEventListener('click', event => {
      const tab = event.target.closest('[data-cg-insight-tab]');
      if (tab && player.contains(tab)) {
        const index = tabs.indexOf(tab);
        if (index >= 0) pauseInsightAfterInteraction(index);
        return;
      }

      if (event.target.closest('[data-cg-insight-show-conclusion]')) {
        showInsightConclusion(false);
        return;
      }

      if (event.target.closest('[data-cg-insight-reset]')) {
        stopInsightAutoplay();
        setInsightState(0);
        tabs[0].focus();
      }
    });

    player.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-cg-insight-tab]');
      if (!tab) return;
      const index = tabs.indexOf(tab);
      if (index < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      tabs.forEach(candidate => candidate.setAttribute('tabindex', '-1'));
      tabs[nextIndex].setAttribute('tabindex', '0');
      tabs[nextIndex].focus();
    });

    player.addEventListener('pointermove', event => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const bounds = player.getBoundingClientRect();
      player.style.setProperty('--mouse-x', `${event.clientX - bounds.left}px`);
      player.style.setProperty('--mouse-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });

    player.addEventListener('pointerleave', () => {
      player.style.setProperty('--mouse-x', '72%');
      player.style.setProperty('--mouse-y', '52%');
    });

    function reconcileInsightMotion() {
      if (reducedMotion.matches || !desktopViewport.matches) {
        clearPlayerTimers();
        stopInsightAutoplay();
        setInsightState(0, true);
        return;
      }

      if (!canInsightAutoplay()) {
        stopInsightAutoplay();
        return;
      }

      startInsightAutoplay(hasEnteredViewport ? returnDelay : autoplayDelay);
      hasEnteredViewport = true;
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        const wasVisible = sectionIsVisible;
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .35);

        if (!sectionIsVisible) {
          stopInsightAutoplay();
          return;
        }
        if (!wasVisible) reconcileInsightMotion();
      }, { threshold: [.35] });
      observer.observe(section);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopInsightAutoplay();
        return;
      }
      if (sectionIsVisible) startInsightAutoplay(returnDelay);
    });

    desktopViewport.addEventListener?.('change', reconcileInsightMotion);
    reducedMotion.addEventListener?.('change', reconcileInsightMotion);

    setInsightState(0, true);
    if (sectionIsVisible) reconcileInsightMotion();
  }

  function initPerspectiveLens() {
    const section = document.querySelector('[data-cg-perspective]');
    if (!section) return;

    const tabs = [...section.querySelectorAll('[data-cg-perspective-tab]')];
    const panel = section.querySelector('[data-cg-perspective-panel]');
    const before = section.querySelector('[data-cg-perspective-before]');
    const body = section.querySelector('[data-cg-perspective-body]');
    const after = section.querySelector('[data-cg-perspective-after]');
    const micro = section.querySelector('[data-cg-perspective-micro]');
    if (tabs.length !== 4 || !panel || !before || !body || !after || !micro) return;

    const perspectiveStates = [
      {
        id: 1,
        label: 'PIEZA',
        before: 'SE VE BIEN.',
        after: '¿QUÉ TENGO REALMENTE DELANTE?',
        body: [
          'Dejas de mirar solamente si una pieza te gusta.',
          'Empiezas a preguntarte qué es, qué deberías revisar y qué puede influir en su valor.'
        ],
        micro: 'Misma pieza. Mejores preguntas.'
      },
      {
        id: 2,
        label: 'PRECIO',
        before: 'ESO ES LO QUE CUESTA.',
        after: '¿CON QUÉ PUEDO COMPARARLO?',
        body: [
          'Un precio deja de ser simplemente un número que alguien te dijo.',
          'Empiezas a buscar referencias antes de asumir que tiene sentido.'
        ],
        micro: 'Mismo precio. Más información alrededor.'
      },
      {
        id: 3,
        label: 'OPORTUNIDAD',
        before: 'SUENA INTERESANTE.',
        after: '¿DE VERDAD MERECE UNA SEGUNDA MIRADA?',
        body: [
          'La emoción deja de ser la única razón para avanzar.',
          'Puedes parar, comparar y entender mejor qué tienes delante.'
        ],
        micro: 'Menos impulso. Más claridad para decidir.'
      },
      {
        id: 4,
        label: 'SALIDA',
        before: '¿LO COMPRO?',
        after: '¿QUIÉN PODRÍA QUERERLO DESPUÉS?',
        body: [
          'Empiezas a pensar más allá de encontrar algo interesante.',
          'También miras qué posible salida podría tener antes de mover tu plata.'
        ],
        micro: 'Comprar es una parte. Pensar qué viene después es la otra.'
      }
    ];

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    let activeIndex = 0;
    let transitionTimer = 0;
    let tutorialTimer = 0;
    let hasPerspectiveIntroPlayed = false;
    let tutorialCancelled = false;
    let sectionIsVisible = false;

    function clearPerspectiveTimers() {
      window.clearTimeout(transitionTimer);
      window.clearTimeout(tutorialTimer);
      transitionTimer = 0;
      tutorialTimer = 0;
    }

    function renderPerspectiveState(index) {
      const state = perspectiveStates[index];
      if (!state) return;

      activeIndex = index;
      before.textContent = state.before;
      after.textContent = state.after;
      micro.textContent = state.micro;
      body.replaceChildren(...state.body.map(copy => {
        const paragraph = document.createElement('p');
        paragraph.textContent = copy;
        return paragraph;
      }));

      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      panel.setAttribute('aria-labelledby', tabs[index].id);
    }

    function setPerspectiveState(index, options = {}) {
      const normalizedIndex = Math.max(0, Math.min(perspectiveStates.length - 1, index));
      const { animate = true, announce = false } = options;
      window.clearTimeout(transitionTimer);
      panel.setAttribute('aria-live', announce ? 'polite' : 'off');

      if (!animate || reducedMotion.matches || normalizedIndex === activeIndex) {
        renderPerspectiveState(normalizedIndex);
        panel.classList.add('is-visible');
        return;
      }

      panel.classList.remove('is-visible');
      transitionTimer = window.setTimeout(() => {
        renderPerspectiveState(normalizedIndex);
        window.requestAnimationFrame(() => panel.classList.add('is-visible'));
      }, 130);
    }

    function cancelPerspectiveTutorial() {
      window.clearTimeout(tutorialTimer);
      tutorialTimer = 0;
      tutorialCancelled = true;
      hasPerspectiveIntroPlayed = true;
      section.classList.remove('is-tutorial');
    }

    function startPerspectiveTutorial() {
      if (
        hasPerspectiveIntroPlayed ||
        tutorialCancelled ||
        reducedMotion.matches ||
        !desktopViewport.matches ||
        !sectionIsVisible ||
        document.hidden
      ) return;

      hasPerspectiveIntroPlayed = true;
      section.classList.add('is-tutorial');
      const steps = [
        { index: 0, delay: 700 },
        { index: 1, delay: 2700 },
        { index: 2, delay: 2700 },
        { index: 3, delay: 2700 },
        { index: 0, delay: 1250 }
      ];
      let stepIndex = 0;

      function runNextStep() {
        if (tutorialCancelled || document.hidden || !sectionIsVisible) {
          cancelPerspectiveTutorial();
          return;
        }

        const step = steps[stepIndex];
        tutorialTimer = window.setTimeout(() => {
          if (tutorialCancelled || document.hidden || !sectionIsVisible) {
            cancelPerspectiveTutorial();
            return;
          }

          setPerspectiveState(step.index, { animate: stepIndex > 0 });
          stepIndex += 1;
          if (stepIndex < steps.length) {
            runNextStep();
          } else {
            section.classList.remove('is-tutorial');
            tutorialTimer = 0;
          }
        }, step.delay);
      }

      runNextStep();
    }

    function selectPerspectiveState(index, focusTab = false) {
      cancelPerspectiveTutorial();
      setPerspectiveState(index, { announce: true });
      if (focusTab) tabs[index].focus();
    }

    section.addEventListener('click', event => {
      const tab = event.target.closest('[data-cg-perspective-tab]');
      if (!tab || !section.contains(tab)) return;
      const index = tabs.indexOf(tab);
      if (index >= 0) selectPerspectiveState(index);
    });

    section.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-cg-perspective-tab]');
      if (!tab) return;
      const currentIndex = tabs.indexOf(tab);
      if (currentIndex < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      selectPerspectiveState(nextIndex, true);
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .4);
        if (sectionIsVisible) {
          startPerspectiveTutorial();
        } else if (tutorialTimer) {
          cancelPerspectiveTutorial();
        }
      }, { threshold: [.4] });
      observer.observe(section);
    } else {
      sectionIsVisible = true;
      startPerspectiveTutorial();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && tutorialTimer) cancelPerspectiveTutorial();
    });

    desktopViewport.addEventListener?.('change', () => {
      if (!desktopViewport.matches && tutorialTimer) cancelPerspectiveTutorial();
    });

    reducedMotion.addEventListener?.('change', () => {
      if (reducedMotion.matches) {
        cancelPerspectiveTutorial();
        setPerspectiveState(0, { animate: false });
      }
    });

    renderPerspectiveState(0);
    panel.classList.add('is-visible');
  }

  function initGoldValueReceipt() {
    const section = document.querySelector('[data-cg-gold-value]');
    if (!section) return;

    const tabs = [...section.querySelectorAll('[data-cg-gold-value-tab]')];
    const panel = section.querySelector('[data-cg-gold-value-panel]');
    const label = section.querySelector('[data-cg-gold-value-label]');
    const headline = section.querySelector('[data-cg-gold-value-headline]');
    const body = section.querySelector('[data-cg-gold-value-body]');
    const includes = section.querySelector('[data-cg-gold-value-includes]');
    const microcopy = section.querySelector('[data-cg-gold-value-micro]');
    const cta = section.querySelector('.cg-gold-value__cta');

    if (
      tabs.length !== 4 ||
      !panel || !label || !headline || !body || !includes || !microcopy
    ) return;

    const states = [
      {
        label: '01 · APRENDER',
        headline: 'NO EMPIEZAS SIN SABER POR DÓNDE SEGUIR.',
        body: [
          'Tienes una ruta y formación a la que puedes volver cuando necesites entender mejor algo.'
        ],
        includes: 'Ruta de 60 días · 6 módulos grabados',
        microcopy: 'Aprendes a tu ritmo. Vuelves cuando lo necesites.'
      },
      {
        label: '02 · ACOMPAÑAMIENTO',
        headline: 'CUANDO APARECE UNA DUDA, TIENES DÓNDE LLEVARLA.',
        body: [
          'No tienes que quedarte varios días dándole vueltas solo.',
          'Hay espacios para preguntar, revisar y seguir avanzando.'
        ],
        includes: 'Mentoría semanal · Soporte',
        microcopy: 'La duda aparece. Tienes dónde ponerla sobre la mesa.'
      },
      {
        label: '03 · ACCESO',
        headline: 'NO TIENES QUE BUSCAR TODO DESDE CERO.',
        body: [
          'Empiezas a tener productos, referencias y oportunidades concretas que puedes observar y analizar.'
        ],
        includes: 'Drops prioritarios · Catálogo seleccionado',
        microcopy: 'Menos búsqueda. Más cosas reales que mirar.'
      },
      {
        label: '04 · VENDER',
        headline: 'NO TODO TERMINA CUANDO COMPRAS.',
        body: [
          'También empiezas a pensar cómo presentar, ofrecer y buscar una posible salida para lo que tienes delante.'
        ],
        includes: 'Venta directa · Tienda online',
        microcopy: 'Comprar es una parte. Pensar qué viene después es la otra.'
      }
    ];

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    let activeIndex = 0;
    let transitionTimer = 0;
    let tutorialTimer = 0;
    let hoverTimer = 0;
    let tutorialHasPlayed = false;
    let tutorialCancelled = false;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let shimmerHasPlayed = false;

    function clearTransitionTimer() {
      window.clearTimeout(transitionTimer);
      transitionTimer = 0;
    }

    function renderGoldValue(index) {
      const state = states[index];
      activeIndex = index;
      label.textContent = state.label;
      headline.textContent = state.headline;
      body.replaceChildren(...state.body.map(copy => {
        const paragraph = document.createElement('p');
        paragraph.textContent = copy;
        return paragraph;
      }));
      includes.textContent = state.includes;
      microcopy.textContent = state.microcopy;

      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      panel.setAttribute('aria-labelledby', tabs[index].id);
    }

    function setGoldValue(index, options = {}) {
      const nextIndex = Math.max(0, Math.min(states.length - 1, index));
      const shouldAnimate = options.animate !== false && !reducedMotion.matches;
      panel.setAttribute('aria-live', options.announce ? 'polite' : 'off');
      clearTransitionTimer();

      if (!shouldAnimate || nextIndex === activeIndex) {
        renderGoldValue(nextIndex);
        panel.classList.add('is-visible');
        return;
      }

      panel.classList.remove('is-visible');
      transitionTimer = window.setTimeout(() => {
        renderGoldValue(nextIndex);
        window.requestAnimationFrame(() => panel.classList.add('is-visible'));
        transitionTimer = 0;
      }, 130);
    }

    function stopGoldOfferTutorial(cancel = false) {
      window.clearTimeout(tutorialTimer);
      tutorialTimer = 0;
      section.classList.remove('is-tutorial');
      if (cancel) tutorialCancelled = true;
    }

    function cancelGoldOfferTutorial() {
      stopGoldOfferTutorial(true);
    }

    function startGoldOfferTutorial() {
      if (
        tutorialHasPlayed || tutorialCancelled || !desktopViewport.matches ||
        reducedMotion.matches || document.hidden || !sectionIsVisible
      ) return;

      tutorialHasPlayed = true;
      section.classList.add('is-tutorial');
      const steps = [
        { index: 0, delay: 800 },
        { index: 1, delay: 2600 },
        { index: 2, delay: 2600 },
        { index: 3, delay: 2600 },
        { index: 0, delay: 1250 }
      ];
      let stepIndex = 0;

      function runNextStep() {
        if (tutorialCancelled || document.hidden || !sectionIsVisible) {
          cancelGoldOfferTutorial();
          return;
        }

        const step = steps[stepIndex];
        tutorialTimer = window.setTimeout(() => {
          if (tutorialCancelled || document.hidden || !sectionIsVisible) {
            cancelGoldOfferTutorial();
            return;
          }

          setGoldValue(step.index, { animate: stepIndex > 0 });
          stepIndex += 1;
          if (stepIndex < steps.length) {
            runNextStep();
          } else {
            stopGoldOfferTutorial();
          }
        }, step.delay);
      }

      runNextStep();
    }

    function playCtaShimmer() {
      if (shimmerHasPlayed || reducedMotion.matches || !cta) return;
      shimmerHasPlayed = true;
      cta.classList.add('is-shimmering');
      window.setTimeout(() => cta.classList.remove('is-shimmering'), 960);
    }

    function selectGoldValue(index, focusTab = false) {
      cancelGoldOfferTutorial();
      setGoldValue(index, { announce: true });
      if (focusTab) tabs[index].focus();
    }

    section.addEventListener('click', event => {
      const tab = event.target.closest('[data-cg-gold-value-tab]');
      if (!tab || !section.contains(tab)) return;
      const index = tabs.indexOf(tab);
      if (index >= 0) selectGoldValue(index);
    });

    section.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-cg-gold-value-tab]');
      if (!tab) return;
      const currentIndex = tabs.indexOf(tab);
      if (currentIndex < 0) return;

      let nextIndex = null;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      selectGoldValue(nextIndex, true);
    });

    tabs.forEach(tab => {
      tab.addEventListener('pointerenter', () => {
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(cancelGoldOfferTutorial, 700);
      });
      tab.addEventListener('pointerleave', () => {
        window.clearTimeout(hoverTimer);
        hoverTimer = 0;
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .4);
        if (sectionIsVisible) {
          playCtaShimmer();
          startGoldOfferTutorial();
        } else if (tutorialTimer) {
          cancelGoldOfferTutorial();
        }
      }, { threshold: [.4] });
      observer.observe(section);
    } else {
      playCtaShimmer();
      startGoldOfferTutorial();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && tutorialTimer) cancelGoldOfferTutorial();
    });

    desktopViewport.addEventListener?.('change', () => {
      if (!desktopViewport.matches && tutorialTimer) cancelGoldOfferTutorial();
    });

    reducedMotion.addEventListener?.('change', () => {
      if (!reducedMotion.matches) return;
      cancelGoldOfferTutorial();
      setGoldValue(0, { animate: false });
    });

    renderGoldValue(0);
    panel.classList.add('is-visible');
  }

  function initDecisionSwitch() {
    const section = document.querySelector('[data-cg-decision-switch]');
    if (!section) return;

    const panel = section.querySelector('[data-cg-decision-panel]');
    const stage = section.querySelector('[data-cg-decision-stage]');
    const tabs = [...section.querySelectorAll('[data-cg-decision-tab]')];
    const label = section.querySelector('[data-cg-decision-label]');
    const word = section.querySelector('[data-cg-decision-word]');
    const headline = section.querySelector('[data-cg-decision-headline]');
    const body = section.querySelector('[data-cg-decision-body]');
    const microcopy = section.querySelector('[data-cg-decision-micro]');
    const cta = section.querySelector('.cg-decision__cta');

    if (
      !panel || !stage || tabs.length !== 2 ||
      !label || !word || !headline || !body || !microcopy
    ) return;

    const states = {
      waiting: {
        label: '01 · SEGUIR ESPERANDO',
        word: 'ALGÚN DÍA',
        headline: '“CUANDO TENGA MÁS TIEMPO.”',
        body: [
          'Sigues viendo piezas. Precios. Negocios. Gente comprando. Gente vendiendo. Y la idea sigue ahí: “Después aprendo.”'
        ],
        microcopy: 'No pasa nada hoy. El problema aparece cuando “después” se convierte en otros seis meses.'
      },
      today: {
        label: '02 · EMPEZAR',
        word: 'HOY',
        headline: 'NO NECESITAS HACERLO TODO.',
        body: [
          'No tienes que comprar una pieza mañana. No tienes que meter toda tu plata. No tienes que volverte experto en una semana. Puedes empezar por algo mucho más pequeño: aprender a mirar mejor lo que tienes delante.'
        ],
        microcopy: 'Un movimiento pequeño hoy puede evitar otros meses mirando desde fuera.'
      }
    };

    const desktopViewport = window.matchMedia('(min-width: 961px)');
    let activeState = 'today';
    let transitionTimer = 0;
    let introTimer = 0;
    let shimmerTimer = 0;
    let hasDecisionTransitionPlayed = false;
    let decisionIntroCancelled = false;
    let sectionIsVisible = !('IntersectionObserver' in window);
    let shimmerHasPlayed = false;

    function clearDecisionTimers() {
      window.clearTimeout(transitionTimer);
      window.clearTimeout(introTimer);
      transitionTimer = 0;
      introTimer = 0;
    }

    function renderDecisionState(stateName) {
      const state = states[stateName];
      activeState = stateName;
      label.textContent = state.label;
      word.textContent = state.word;
      headline.textContent = state.headline;
      body.replaceChildren(...state.body.map(copy => {
        const paragraph = document.createElement('p');
        paragraph.textContent = copy;
        return paragraph;
      }));
      microcopy.textContent = state.microcopy;

      panel.classList.toggle('is-waiting', stateName === 'waiting');
      panel.classList.toggle('is-today', stateName === 'today');

      tabs.forEach(tab => {
        const isActive = tab.dataset.cgDecisionTab === stateName;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });

      const activeTab = tabs.find(tab => tab.dataset.cgDecisionTab === stateName);
      if (activeTab) stage.setAttribute('aria-labelledby', activeTab.id);
    }

    function setDecisionState(stateName, options = {}) {
      if (!states[stateName]) return;
      const shouldAnimate = options.animate !== false && !reducedMotion.matches;
      stage.setAttribute('aria-live', options.announce ? 'polite' : 'off');
      window.clearTimeout(transitionTimer);

      if (!shouldAnimate || stateName === activeState) {
        renderDecisionState(stateName);
        stage.classList.add('is-visible');
        return;
      }

      stage.classList.remove('is-visible');
      transitionTimer = window.setTimeout(() => {
        renderDecisionState(stateName);
        window.requestAnimationFrame(() => stage.classList.add('is-visible'));
        transitionTimer = 0;
      }, 130);
    }

    function cancelDecisionIntro() {
      window.clearTimeout(introTimer);
      introTimer = 0;
      decisionIntroCancelled = true;
      hasDecisionTransitionPlayed = true;
    }

    function playDecisionCtaShimmer() {
      if (shimmerHasPlayed || reducedMotion.matches || !cta) return;
      shimmerHasPlayed = true;
      cta.classList.add('is-shimmering');
      window.clearTimeout(shimmerTimer);
      shimmerTimer = window.setTimeout(() => cta.classList.remove('is-shimmering'), 900);
    }

    function startDecisionIntro() {
      if (
        hasDecisionTransitionPlayed || decisionIntroCancelled ||
        !desktopViewport.matches || reducedMotion.matches ||
        document.hidden || !sectionIsVisible
      ) return;

      hasDecisionTransitionPlayed = true;
      introTimer = window.setTimeout(() => {
        if (decisionIntroCancelled || document.hidden || !sectionIsVisible) {
          cancelDecisionIntro();
          return;
        }

        setDecisionState('today', { animate: true });
        panel.classList.add('has-intro-played');
        introTimer = window.setTimeout(() => {
          playDecisionCtaShimmer();
          introTimer = 0;
        }, 650);
      }, 1000);
    }

    function selectDecisionState(stateName, focusTab = false) {
      cancelDecisionIntro();
      setDecisionState(stateName, { announce: true });
      if (focusTab) {
        tabs.find(tab => tab.dataset.cgDecisionTab === stateName)?.focus();
      }
    }

    section.addEventListener('click', event => {
      const tab = event.target.closest('[data-cg-decision-tab]');
      if (!tab || !section.contains(tab)) return;
      selectDecisionState(tab.dataset.cgDecisionTab);
    });

    section.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-cg-decision-tab]');
      if (!tab) return;

      let nextState = null;
      if (event.key === 'ArrowRight' || event.key === 'End') nextState = 'today';
      if (event.key === 'ArrowLeft' || event.key === 'Home') nextState = 'waiting';
      if (nextState === null) return;

      event.preventDefault();
      selectDecisionState(nextState, true);
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        sectionIsVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .4);
        if (sectionIsVisible) {
          startDecisionIntro();
        } else if (introTimer) {
          cancelDecisionIntro();
        }
      }, { threshold: [.4] });
      observer.observe(section);
    } else {
      startDecisionIntro();
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && introTimer) cancelDecisionIntro();
    });

    desktopViewport.addEventListener?.('change', () => {
      if (!desktopViewport.matches) {
        cancelDecisionIntro();
        setDecisionState('today', { animate: false });
      }
    });

    reducedMotion.addEventListener?.('change', () => {
      if (!reducedMotion.matches) return;
      cancelDecisionIntro();
      setDecisionState('today', { animate: false });
    });

    const initialState = desktopViewport.matches && !reducedMotion.matches
      ? 'waiting'
      : 'today';
    renderDecisionState(initialState);
    stage.classList.add('is-visible');
  }

  function initReveal() {
    const targets = [
      ...document.querySelectorAll('.cg-reveal, [data-cg-anim], .cg-stagger-items')
    ];
    if (!targets.length) return;

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const isMobile = window.innerWidth <= 768;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add('is-visible');
        
        target.querySelectorAll?.('[data-cg-anim]').forEach(child => {
          child.classList.add('is-visible');
        });

        observer.unobserve(target);
      });
    }, {
      threshold: 0.1,
      rootMargin: isMobile ? '0px 0px -4% 0px' : '0px 0px -10% 0px'
    });

    targets.forEach(el => observer.observe(el));

    let lastScrollY = window.scrollY;
    let scrollTimeout = 0;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const isDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;
      
      document.body.dataset.scrollDirection = isDown ? 'down' : 'up';
      document.body.classList.add('is-scrolling');
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    }, { passive: true });
  }

  function initHeroRail() {
    const visual = document.querySelector('[data-cg-jewel-visual]');
    const railStates = visual
      ? [...visual.querySelectorAll('[data-cg-rail-state]')]
      : [];
    if (!visual || railStates.length !== 4) return;

    const sequence = ['value', 'demand', 'opportunity', 'margin'];
    let activeIndex = 0;
    let stepTimer = 0;
    let sweepTimer = 0;
    let isInView = !('IntersectionObserver' in window);

    function clearTimers() {
      window.clearTimeout(stepTimer);
      window.clearTimeout(sweepTimer);
      stepTimer = 0;
      sweepTimer = 0;
    }

    function setState(state) {
      activeIndex = Math.max(0, sequence.indexOf(state));
      railStates.forEach(item => {
        item.classList.toggle('is-active', item.dataset.cgRailState === state);
      });
    }

    function canAnimate() {
      return !reducedMotion.matches && !document.hidden && isInView;
    }

    function scheduleNext(delay = 1100) {
      window.clearTimeout(stepTimer);
      if (!canAnimate()) return;

      stepTimer = window.setTimeout(() => {
        if (activeIndex < sequence.length - 1) {
          setState(sequence[activeIndex + 1]);
          scheduleNext();
          return;
        }

        stepTimer = window.setTimeout(() => {
          if (!canAnimate()) return;
          visual.classList.add('is-sweeping');
          sweepTimer = window.setTimeout(() => {
            visual.classList.remove('is-sweeping');
            if (!canAnimate()) return;
            setState(sequence[0]);
            scheduleNext();
          }, 800);
        }, 600);
      }, delay);
    }

    function reconcileMotion() {
      if (reducedMotion.matches) {
        clearTimers();
        visual.classList.remove('is-sweeping');
        setState('opportunity');
        return;
      }

      if (!canAnimate()) {
        clearTimers();
        visual.classList.remove('is-sweeping');
        return;
      }

      scheduleNext();
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        isInView = Boolean(entries[0]?.isIntersecting);
        reconcileMotion();
      }, { threshold: .2 });
      observer.observe(visual);
    }

    document.addEventListener('visibilitychange', reconcileMotion);
    reducedMotion.addEventListener?.('change', reconcileMotion);

    setState(reducedMotion.matches ? 'opportunity' : 'value');
    reconcileMotion();
  }

  function initHeroShimmer() {
    const button = document.querySelector('.cg-hero__cta');
    if (!button || reducedMotion.matches) return;

    let timer = 0;
    let isInView = false;

    function clearTimer() {
      window.clearTimeout(timer);
      timer = 0;
    }

    function schedule() {
      clearTimer();
      if (!isInView || document.hidden || reducedMotion.matches) return;
      timer = window.setTimeout(() => {
        button.classList.add('is-shimmering');
        window.setTimeout(() => button.classList.remove('is-shimmering'), 850);
        schedule();
      }, 7000 + Math.random() * 1000);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        isInView = Boolean(entries[0]?.isIntersecting);
        schedule();
      }, { threshold: .35 });
      observer.observe(button);
    } else {
      isInView = true;
      schedule();
    }

    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener?.('change', schedule);
  }

  function setCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('[data-cg-current-year]').forEach(element => {
      element.textContent = year;
    });
  }

  hydratePlanCtas();
  hydratePendingContent();
  hydrateTestimonials();
  function initMagneticParallax() {
    if (reducedMotion.matches) return;
    
    document.querySelectorAll('.cg-magnetic-stage').forEach(stage => {
      const items = stage.querySelectorAll('.cg-magnetic-item');
      if (!items.length) return;
      
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        items.forEach(item => {
          const strength = parseFloat(item.dataset.magneticStrength || 20);
          const moveX = (x / rect.width) * strength;
          const moveY = (y / rect.height) * strength;
          
          item.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate3d(${moveY}, ${-moveX}, 0, ${strength / 5}deg)`;
        });
      });
      
      stage.addEventListener('mouseleave', () => {
        items.forEach(item => {
          item.style.transform = `translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg)`;
        });
      });
    });
  }

  function initMarketCardsScrollColor() {
    const cardsContainer = document.querySelector('.cg-v2-market-cards');
    if (!cardsContainer) return;

    const cards = [...cardsContainer.querySelectorAll('.cg-market-card')];
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (window.innerWidth >= 768) {
          cards.forEach(c => c.classList.remove('is-active'));
          card.classList.add('is-active');
        }
      });
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && window.innerWidth < 768) {
            cards.forEach(c => c.classList.remove('is-active'));
            entry.target.classList.add('is-active');
          }
        });
      }, {
        threshold: 0.4,
        rootMargin: '-15% 0px -15% 0px'
      });

      cards.forEach(card => observer.observe(card));
    }
  }

  function initDesktopScrollTrack() {
    if (window.innerWidth < 1024) return;

    const sectionIds = [
      'inicio', 'dudas', 'seguridad', 'posibilidad', 'circulo-gold',
      'comunidad', 'incluye-gold', 'testimonios', 'transformacion',
      'precio-gold', 'empezar-hoy', 'circulo-acero', 'preguntas-frecuentes', 'cierre'
    ];

    const labels = {
      'inicio': 'Inicio',
      'dudas': 'Objeciones',
      'seguridad': 'Seguridad',
      'posibilidad': 'Posibilidad',
      'circulo-gold': 'Círculo Gold',
      'comunidad': 'Comunidad',
      'incluye-gold': 'Todo lo que incluye',
      'testimonios': 'Testimonios',
      'transformacion': 'Transformación',
      'precio-gold': 'Precio Gold',
      'empezar-hoy': 'Decisión',
      'circulo-acero': 'Círculo Acero',
      'preguntas-frecuentes': 'FAQ',
      'cierre': 'Cierre Gold'
    };

    const sections = sectionIds
      .map(id => document.getElementById(id) || document.querySelector(`[data-preview-section="${id}"]`))
      .filter(Boolean);

    if (!sections.length) return;

    let track = document.querySelector('.cg-desktop-scroll-track');
    if (!track) {
      track = document.createElement('nav');
      track.className = 'cg-desktop-scroll-track';
      track.setAttribute('aria-label', 'Progreso de página');
      track.innerHTML = `
        <div class="cg-desktop-scroll-track__line-bg">
          <div class="cg-desktop-scroll-track__line-fill"></div>
        </div>
        <div class="cg-desktop-scroll-track__points"></div>
      `;
      document.body.appendChild(track);
    }

    const lineFill = track.querySelector('.cg-desktop-scroll-track__line-fill');
    const pointsContainer = track.querySelector('.cg-desktop-scroll-track__points');
    pointsContainer.innerHTML = '';

    const pointElements = [];

    sections.forEach((sec, idx) => {
      const id = sec.id || sec.dataset.previewSection || `sec-${idx}`;
      const labelText = labels[id] || `Sección ${idx + 1}`;

      const btn = document.createElement('button');
      btn.className = 'cg-desktop-scroll-track__point';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', `Ir a ${labelText}`);
      btn.dataset.targetId = id;

      btn.innerHTML = `
        <span class="cg-desktop-scroll-track__pulse-ring"></span>
        <span class="cg-desktop-scroll-track__dot"></span>
        <span class="cg-desktop-scroll-track__tooltip">${labelText}</span>
      `;

      btn.addEventListener('click', () => {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      pointsContainer.appendChild(btn);
      pointElements.push({ element: btn, section: sec, id });
    });

    function updateScrollProgress() {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, (scrollY / totalScroll) * 100));

      if (lineFill) {
        lineFill.style.height = `${progress}%`;
      }

      const viewportMiddle = scrollY + window.innerHeight * 0.35;
      let currentActiveIndex = 0;

      sections.forEach((sec, idx) => {
        const top = sec.offsetTop;
        if (viewportMiddle >= top - 80) {
          currentActiveIndex = idx;
        }
      });

      pointElements.forEach((pt, idx) => {
        pt.element.classList.toggle('is-active', idx === currentActiveIndex);
      });
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();
  }

  function initTopScrollProgress() {
    let progressBar = document.querySelector('.cg-top-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'cg-top-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      progressBar.innerHTML = '<div class="cg-top-progress-bar__fill"></div>';
      document.body.prepend(progressBar);
    }
    const fill = progressBar.querySelector('.cg-top-progress-bar__fill');
    if (!fill) return;

    function update() {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(100, Math.max(0, (scrollY / totalScroll) * 100));
      fill.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  initTopScrollProgress();
  initMagneticParallax();
  initMarketCardsScrollColor();
  initFaq();
  initObjections();
  initSecurityRail();
  initMarketDoors();
  initGoldStack();
  initMentorshipFeed();
  initGoldResourceIndex();
  initPerspectiveLens();
  initGoldValueReceipt();
  initDecisionSwitch();
  initPageCursorGlow();
  initInsights();
  initHeroRail();
  initHeroShimmer();
  initReveal();
  initDesktopScrollTrack();
  setCurrentYear();

  document.dispatchEvent(new CustomEvent('circulo-gold:ready'));
}());
