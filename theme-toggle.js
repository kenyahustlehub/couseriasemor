(function () {
    const toggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('themeMode');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

    function applyTheme(mode) {
        const isLight = mode === 'light';
        document.documentElement.classList.toggle('light-theme', isLight);
        document.documentElement.classList.toggle('dark-theme', !isLight);
        localStorage.setItem('themeMode', mode);

        if (toggle) {
            toggle.textContent = isLight ? 'Dark' : 'Light';
            toggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
        }
    }

    function initialize() {
        applyTheme(initialTheme);

        if (!toggle) {
            return;
        }

        toggle.addEventListener('click', function () {
            const nextTheme = document.documentElement.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }

    initialize();
})();
