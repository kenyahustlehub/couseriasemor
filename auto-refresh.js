(function () {
  const RELOAD_FLAG = 'couseriasemor_auto_refresh_reloaded';

  function reloadOnce() {
    if (!sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, 'true');
      window.location.reload();
    }
  }

  function reloadIfNeeded(event) {
    if (event.persisted) {
      reloadOnce();
    }
  }

  window.addEventListener('pageshow', reloadIfNeeded);

  if ('performance' in window && performance.getEntriesByType) {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && (nav.type === 'back_forward' || nav.type === 'reload')) {
      reloadOnce();
    }
  }

  if (document.readyState === 'complete') {
    reloadOnce();
  } else {
    window.addEventListener('load', reloadOnce);
  }
})();
