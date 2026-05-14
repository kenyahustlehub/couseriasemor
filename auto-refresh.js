(function () {
  function reloadIfNeeded(event) {
    if (event.persisted) {
      window.location.reload();
    }
  }

  window.addEventListener('pageshow', reloadIfNeeded);

  if ('performance' in window && performance.getEntriesByType) {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'back_forward') {
      window.location.reload();
    }
  }
})();
