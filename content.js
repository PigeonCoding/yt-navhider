'use strict';

(() => {
  const HIDE_DELAY_MS = 5000;
  const MOUSE_AWAY_DELAY_MS = 250;
  const HOVER_ZONE = 50;
  const MARKER_CLASS = 'ytnh';
  const HIDDEN_CLASS = 'ytnh-hidden';

  let delayTimer = null;
  let isFullscreen = false;
  let isLeavingFullscreen = false;
  let wantsHidden = false;
  let enabled = true;

  const getApp = () => document.querySelector('ytd-app');

  function setActive(active) {
    const app = getApp();
    if (!app) return;
    app.classList.toggle(MARKER_CLASS, active);
    if (!active) {
      wantsHidden = false;
      app.classList.remove(HIDDEN_CLASS);
    }
  }

  function hideTop() {
    wantsHidden = true;
    const app = getApp();
    if (app) app.classList.add(HIDDEN_CLASS);
  }

  function showTop() {
    wantsHidden = false;
    const app = getApp();
    if (app) app.classList.remove(HIDDEN_CLASS);
  }

  function checkFullscreen() {
    isFullscreen = !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
    if (isFullscreen || isLeavingFullscreen) {
      hideTop();
      isLeavingFullscreen = false;
    }
  }

  function onMouseMove(event) {
    if (!enabled || isFullscreen) return;
    const target = event.target;
    if (target && target.closest && target.closest('#masthead-container #search')) {
      return;
    }
    if (event.clientY <= HOVER_ZONE) {
      clearTimeout(delayTimer);
      showTop();
    } else {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(hideTop, MOUSE_AWAY_DELAY_MS);
    }
  }

  function onMouseOut(event) {
    if (enabled && !isFullscreen && !event.relatedTarget) {
      hideTop();
    }
  }

  function init() {
    setActive(enabled);

    setTimeout(() => {
      if (!enabled) return;
      hideTop();
      checkFullscreen();
    }, HIDE_DELAY_MS);

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });

    window.addEventListener('resize', checkFullscreen);
    [
      'fullscreenchange',
      'mozfullscreenchange',
      'webkitfullscreenchange',
      'msfullscreenchange',
    ].forEach((type) => document.addEventListener(type, checkFullscreen));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' || event.key === 'F' || event.detail === 2) {
        isLeavingFullscreen = true;
        setTimeout(checkFullscreen, 0);
      }
    });

    const observer = new MutationObserver(() => {
      const app = getApp();
      if (wantsHidden && app && !app.classList.contains(HIDDEN_CLASS)) {
        app.classList.add(HIDDEN_CLASS);
      }
    });
    const app = getApp();
    if (app) {
      observer.observe(app, { attributes: true, attributeFilter: ['class'] });
    }

    browser.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.enabled) {
        enabled = !!changes.enabled.newValue;
        setActive(enabled);
        if (enabled) {
          hideTop();
          checkFullscreen();
        }
      }
    });
  }

  browser.storage.local.get('enabled').then((res) => {
    enabled = res.enabled !== undefined ? !!res.enabled : true;
    init();
  });
})();
