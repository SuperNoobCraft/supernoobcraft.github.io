(function () {
    const THEME_KEY = "hkuProjectToolThemeV1";
    const THEME_COOKIE = "hkuProjectToolTheme";
    const VALID_THEMES = new Set(["light", "dark"]);

    function isValidTheme(value) {
        return VALID_THEMES.has(value);
    }

    function readThemeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const fromUrl = params.get("theme");
        return isValidTheme(fromUrl) ? fromUrl : "";
    }

    function readThemeFromLocalStorage() {
        try {
            const saved = localStorage.getItem(THEME_KEY);
            return isValidTheme(saved) ? saved : "";
        } catch (error) {
            return "";
        }
    }

    function readThemeFromCookie() {
        const cookieParts = document.cookie.split(";").map((part) => part.trim());
        const pair = cookieParts.find((item) => item.startsWith(THEME_COOKIE + "="));
        if (!pair) {
            return "";
        }
        const value = decodeURIComponent(pair.slice((THEME_COOKIE + "=").length));
        return isValidTheme(value) ? value : "";
    }

    function getPreferredTheme() {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    }

    function applyTheme(themeName) {
        const safeTheme = isValidTheme(themeName) ? themeName : "light";
        document.documentElement.setAttribute("data-theme", safeTheme);
        document.documentElement.style.colorScheme = safeTheme;
    }

    function persistTheme(themeName) {
        const safeTheme = isValidTheme(themeName) ? themeName : "light";
        try {
            localStorage.setItem(THEME_KEY, safeTheme);
        } catch (error) {}

        const oneYear = 60 * 60 * 24 * 365;
        document.cookie = THEME_COOKIE + "=" + encodeURIComponent(safeTheme) + "; path=/; max-age=" + oneYear + "; SameSite=Lax";
    }

    function getCurrentTheme() {
        const current = document.documentElement.getAttribute("data-theme");
        if (isValidTheme(current)) {
            return current;
        }
        return "light";
    }

    function resolveInitialTheme() {
        return readThemeFromUrl() || readThemeFromLocalStorage() || readThemeFromCookie() || getPreferredTheme();
    }

    function updateToggleLabel(button) {
        if (!button) {
            return;
        }
        button.textContent = getCurrentTheme() === "dark" ? "Light mode" : "Dark mode";
    }

    function initThemeToggle(button) {
        if (!button) {
            return;
        }

        updateToggleLabel(button);

        button.addEventListener("click", () => {
            const next = getCurrentTheme() === "dark" ? "light" : "dark";
            applyTheme(next);
            persistTheme(next);
            updateToggleLabel(button);
        });

        window.addEventListener("storage", (event) => {
            if (event.key === THEME_KEY && isValidTheme(event.newValue)) {
                applyTheme(event.newValue);
                updateToggleLabel(button);
            }
        });
    }

    function navigateWithTheme(event) {
        const link = event.target.closest(".top-links a[href], .site-switcher-menu a[href]");
        if (!link) {
            return;
        }

        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        if (link.target && link.target !== "_self") {
            return;
        }

        const destination = new URL(link.href, window.location.href);
        if (destination.origin !== window.location.origin) {
            return;
        }

        if (!destination.pathname.endsWith(".html")) {
            return;
        }

        destination.searchParams.set("theme", getCurrentTheme());
        event.preventDefault();
        window.location.href = destination.toString();
    }

    function closeAllSiteSwitchers(exceptElement) {
        document.querySelectorAll(".site-switcher[open]").forEach((detailsEl) => {
            if (exceptElement && detailsEl === exceptElement) {
                return;
            }
            detailsEl.removeAttribute("open");
        });
    }

    function setupSiteSwitcherAutoClose() {
        document.addEventListener("click", (event) => {
            const summary = event.target.closest(".site-switcher > summary");
            if (summary) {
                const current = summary.closest(".site-switcher");
                closeAllSiteSwitchers(current);
                return;
            }

            const inside = event.target.closest(".site-switcher");
            if (!inside) {
                closeAllSiteSwitchers();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeAllSiteSwitchers();
            }
        });
    }

    const initialTheme = resolveInitialTheme();
    applyTheme(initialTheme);
    persistTheme(initialTheme);

    document.addEventListener("click", navigateWithTheme);
    setupSiteSwitcherAutoClose();

    window.HKUTheme = {
        initThemeToggle,
        applyTheme,
        persistTheme,
        getCurrentTheme,
        THEME_KEY
    };
})();
