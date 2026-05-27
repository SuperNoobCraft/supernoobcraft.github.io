(function () {
    const topbar = document.querySelector(".topbar");
    const toggleButton = document.getElementById("themeToggle");
    const printButton = document.getElementById("printBtn");

    function updateHeaderOffset() {
        if (!topbar) {
            return;
        }
        const offset = Math.ceil(topbar.getBoundingClientRect().height) + 10;
        document.documentElement.style.setProperty("--header-offset", offset + "px");
    }

    function setupAutoHideTopbar() {
        if (!topbar) {
            return;
        }

        let previousY = window.scrollY;
        window.addEventListener(
            "scroll",
            function () {
                const currentY = window.scrollY;
                const movingDown = currentY > previousY + 6;
                const movingUp = currentY < previousY - 6;

                if (currentY < 16 || movingUp) {
                    topbar.classList.remove("is-hidden");
                } else if (movingDown && currentY > topbar.offsetHeight + 24) {
                    topbar.classList.add("is-hidden");
                }

                previousY = currentY;
            },
            { passive: true }
        );
    }

    function deriveStorageScope() {
        const segments = window.location.pathname.split("/").filter(Boolean);
        const scopeSeed = segments.length ? segments[0] : "root";
        return scopeSeed.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    }

    const STORAGE_SCOPE = deriveStorageScope();
    const LEGACY_THEME_KEY = "hkuProjectToolThemeV1";
    const THEME_KEY = "supernoobThemeV1::" + STORAGE_SCOPE;
    let currentTheme = "light";
    let themeTransitionTimer = null;

    function startThemeTransition() {
        document.documentElement.classList.add("theme-transition");
        if (themeTransitionTimer) {
            window.clearTimeout(themeTransitionTimer);
        }
        themeTransitionTimer = window.setTimeout(() => {
            document.documentElement.classList.remove("theme-transition");
            themeTransitionTimer = null;
        }, 220);
    }

    function updateThemeToggleButton(theme) {
        if (!toggleButton) {
            return;
        }
        const isDark = theme === "dark";
        toggleButton.innerHTML = isDark
            ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
            : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        toggleButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        toggleButton.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    const getTheme = () => {
        try {
            const scoped = localStorage.getItem(THEME_KEY);
            if (scoped === "dark" || scoped === "light") {
                return scoped;
            }
            const legacy = localStorage.getItem(LEGACY_THEME_KEY);
            return legacy === "dark" || legacy === "light" ? legacy : "light";
        } catch {
            return "light";
        }
    };

    const setTheme = (theme, animate = false) => {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {}
        if (animate) {
            startThemeTransition();
        }
        currentTheme = theme;
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.style.colorScheme = theme;
        updateThemeToggleButton(theme);
    };

    function initThemeToggle() {
        // Try HKUTheme first
        if (window.HKUTheme && window.HKUTheme.initThemeToggle) {
            window.HKUTheme.initThemeToggle(toggleButton);
            return;
        }

        // Fallback: apply saved theme and set up toggle
        currentTheme = getTheme();
        document.documentElement.setAttribute("data-theme", currentTheme);
        document.documentElement.style.colorScheme = currentTheme;
        if (toggleButton) {
            updateThemeToggleButton(currentTheme);
            toggleButton.addEventListener("click", function () {
                const newTheme = getTheme() === "dark" ? "light" : "dark";
                setTheme(newTheme, true);
            });
        }

        // Listen for theme changes from other tabs/windows
        window.addEventListener("storage", function (event) {
            if ((event.key === THEME_KEY || event.key === LEGACY_THEME_KEY) && event.newValue) {
                setTheme(event.newValue, true);
            }
        });
    }

    // Preserve theme when navigating via site switcher or internal links
    document.addEventListener("click", function (event) {
        const link = event.target.closest(".site-switcher-menu a[href], .top-links a[href]");
        if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        if (link.target && link.target !== "_self") {
            return;
        }

        try {
            const destination = new URL(link.href, window.location.href);
            if (destination.origin !== window.location.origin) {
                return;
            }
            if (!destination.pathname.endsWith(".html")) {
                return;
            }

            destination.searchParams.set("theme", currentTheme);
            event.preventDefault();
            window.location.href = destination.toString();
        } catch (e) {
            // Ignore URL parsing errors
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        document.querySelectorAll(".site-switcher[open]").forEach(function (detailsEl) {
            detailsEl.removeAttribute("open");
            const summary = detailsEl.querySelector("summary");
            if (summary && typeof summary.focus === "function") {
                summary.focus();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        const switcher = event.target.closest(".site-switcher");
        if (!switcher) {
            document.querySelectorAll(".site-switcher[open]").forEach(function (detailsEl) {
                detailsEl.removeAttribute("open");
            });
        }
    });

    if (printButton) {
        printButton.addEventListener("click", function () {
            const currentPath = window.location.pathname.toLowerCase();
            const isPortfolioPage = currentPath.endsWith("/games.html") || currentPath.endsWith("/projects.html");
            if (!isPortfolioPage) {
                window.open("JimTzeLau_CV.pdf", "_blank", "noopener");
                return;
            }
            window.print();
        });
    }

    updateHeaderOffset();
    setupAutoHideTopbar();
    
    // Check for theme in URL params (set by navigation from other pages)
    const params = new URLSearchParams(window.location.search);
    const themeFromUrl = params.get("theme");
    if (themeFromUrl === "dark" || themeFromUrl === "light") {
        try {
            localStorage.setItem(THEME_KEY, themeFromUrl);
        } catch {}
    }
    
    initThemeToggle();
    window.addEventListener("resize", updateHeaderOffset, { passive: true });
    window.addEventListener("orientationchange", updateHeaderOffset, { passive: true });
})();
