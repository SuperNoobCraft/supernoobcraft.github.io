const PREFIX_MAP = {
    // School of Computing & Data Science
    COMP: { faculty: "School of Computing & Data Science", department: "Computer Science" },

    // Business & Economics
    ECON: { faculty: "Business & Economics Faculty", department: "Economics" },
    FINA: { faculty: "Business & Economics Faculty", department: "Finance" },
    ACCT: { faculty: "Business & Economics Faculty", department: "Accounting" },

    // Engineering
    ENGG: { faculty: "Engineering Faculty", department: "Engineering" },
    MECH: { faculty: "Engineering Faculty", department: "Mechanical Engineering" },
    CIVL: { faculty: "Engineering Faculty", department: "Civil Engineering" },

    // Education & Information
    BSIM: { faculty: "Education Faculty", department: "Information Management" },
    EDUC: { faculty: "Education Faculty", department: "Education" },

    // Law
    LLAW: { faculty: "Law Faculty", department: "Law" },

    // Social Sciences
    PSYC: { faculty: "Social Sciences Faculty", department: "Psychology" },
    SOCI: { faculty: "Social Sciences Faculty", department: "Sociology" },
    POLI: { faculty: "Social Sciences Faculty", department: "Politics and Public Administration" },
    SOWK: { faculty: "Social Sciences Faculty", department: "Social Work and Social Administration" },
    GEOG: { faculty: "Social Sciences Faculty", department: "Geography" },

    // Science
    MATH: { faculty: "Science Faculty", department: "Mathematics" },
    CHEM: { faculty: "Science Faculty", department: "Chemistry" },
    PHYS: { faculty: "Science Faculty", department: "Physics" },
    BIOL: { faculty: "Science Faculty", department: "Biological Sciences" },

    // Arts
    ENGL: { faculty: "Arts Faculty", department: "English" },
    CHIN: { faculty: "Arts Faculty", department: "Chinese" },
    HIST: { faculty: "Arts Faculty", department: "History" },
    PHIL: { faculty: "Arts Faculty", department: "Philosophy" },
    HUDT: { faculty: "Arts Faculty", department: "Humanities and Digital Technologies" },
    CAES: { faculty: "Arts Faculty", department: "Centre for Applied English Studies" }
};

const REQUIRED_FIELDS = [
    { id: "courseCode", label: "Course code" },
    { id: "courseName", label: "Course name" },
    { id: "academicYear", label: "Academic year" },
    { id: "term", label: "Term" },
    { id: "projectType", label: "Project type" },
    { id: "projectTitle", label: "Project title" }
];

const JSON_START = "--- HKU_PROJECT_COLLECTION_JSON_START ---";
const JSON_END = "--- HKU_PROJECT_COLLECTION_JSON_END ---";
const LEGACY_SESSION_STORAGE_KEY = "hkuProjectToolSessionV1";
const LEGACY_WELCOME_STORAGE_KEY = "hkuProjectToolWelcomeSeenV1";
const LEGACY_PROJECT_PRESETS_STORAGE_KEY = "hkuProjectToolProjectPresetsV1";
const LEGACY_VERSION_HISTORY_STORAGE_KEY = "hkuProjectToolVersionHistoryV1";

function deriveStorageScope() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const scopeSeed = segments.length ? segments[0] : "root";
    return scopeSeed.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
}

function scopedStorageKey(baseKey) {
    return baseKey + "::" + STORAGE_SCOPE;
}

const STORAGE_SCOPE = deriveStorageScope();
const SESSION_STORAGE_KEY = scopedStorageKey(LEGACY_SESSION_STORAGE_KEY);
const WELCOME_STORAGE_KEY = scopedStorageKey(LEGACY_WELCOME_STORAGE_KEY);
const PROJECT_PRESETS_STORAGE_KEY = scopedStorageKey(LEGACY_PROJECT_PRESETS_STORAGE_KEY);
const VERSION_HISTORY_STORAGE_KEY = scopedStorageKey(LEGACY_VERSION_HISTORY_STORAGE_KEY);
const VERSION_HISTORY_LIMIT = 20;
const AUTO_HISTORY_INTERVAL_MS = 3 * 60 * 1000;
const LEGACY_EVIDENCE_DB_NAME = "hkuToolkitEvidenceV1";
const EVIDENCE_DB_NAME = scopedStorageKey(LEGACY_EVIDENCE_DB_NAME);
const EVIDENCE_DB_VERSION = 1;
const EVIDENCE_STORE_NAME = "projectEvidence";
const DRAFT_EVIDENCE_KEY = "__draft__";

const form = document.getElementById("project-form");
const previewEl = document.getElementById("preview");
const errorSummary = document.getElementById("errorSummary");
const evidenceInput = document.getElementById("evidence");
const evidenceList = document.getElementById("evidenceList");
const evidenceCaptionsSection = document.getElementById("evidenceCaptionsSection");
const evidenceCaptions = document.getElementById("evidenceCaptions");
const inferenceNote = document.getElementById("inferenceNote");
const printFitHint = document.getElementById("printFitHint");
const projectList = document.getElementById("projectList");
const noProjectsState = document.getElementById("noProjectsState");
const editorModeHint = document.getElementById("editorModeHint");
const editorCard = document.getElementById("editorCard");
const importZipInput = document.getElementById("importZipInput");
const undoDeleteBtn = document.getElementById("undoDelete");
const importBundleZipBtn = document.getElementById("importBundleZip");
const exportBundleZipBtn = document.getElementById("exportBundleZip");
const teamFields = document.getElementById("teamFields");
const splitPagesToggle = document.getElementById("splitPagesToggle");
const includeSkillsToggle = document.getElementById("includeSkillsToggle");
const sortProjectsSelect = document.getElementById("sortProjects");
const profileNameInput = document.getElementById("profileName");
const profileEmailInput = document.getElementById("profileEmail");
const profilePhoneInput = document.getElementById("profilePhone");
const profileLinkInput = document.getElementById("profileLink");
const profileThemeSelect = document.getElementById("profileTheme");
const profileDisplayModeInput = document.getElementById("profileDisplayMode");
const profileDisplayToggle = document.getElementById("profileDisplayToggle");
const profileModeEach = document.getElementById("profileModeEach");
const profileModeTop = document.getElementById("profileModeTop");
const autosaveHint = document.getElementById("autosaveHint");
const statusMessage = document.getElementById("statusMessage");
const themeToggle = document.getElementById("themeToggle");
const historyToggle = document.getElementById("historyToggle");
const topbar = document.querySelector(".topbar");
const welcomeModal = document.getElementById("welcomeModal");
const welcomeClose = document.getElementById("welcomeClose");
const historyModal = document.getElementById("historyModal");
const historyClose = document.getElementById("historyClose");
const historyDeleteAll = document.getElementById("historyDeleteAll");
const historyCloseIcon = document.getElementById("historyCloseIcon");
const historyList = document.getElementById("historyList");
const presetPickerModal = document.getElementById("presetPickerModal");
const presetPickerClose = document.getElementById("presetPickerClose");
const presetPickerCloseIcon = document.getElementById("presetPickerCloseIcon");
const presetPickerList = document.getElementById("presetPickerList");
const presetSaveModal = document.getElementById("presetSaveModal");
const presetSaveForm = document.getElementById("presetSaveForm");
const presetSaveNameInput = document.getElementById("presetSaveName");
const presetSaveWarning = document.getElementById("presetSaveWarning");
const presetSaveConfirm = document.getElementById("presetSaveConfirm");
const presetSaveCancel = document.getElementById("presetSaveCancel");
const presetSaveCloseIcon = document.getElementById("presetSaveCloseIcon");
const confirmModal = document.getElementById("confirmModal");
const confirmModalTitle = document.getElementById("confirmModalTitle");
const confirmModalMessage = document.getElementById("confirmModalMessage");
const confirmModalConfirm = document.getElementById("confirmModalConfirm");
const confirmModalCancel = document.getElementById("confirmModalCancel");
const confirmModalCloseIcon = document.getElementById("confirmModalCloseIcon");
const editorMenu = document.querySelector(".editor-menu");

let projects = [];
let activeProjectId = "";
let draggingProjectId = "";
let dragHandleProjectId = "";
let dragOrderDirty = false;
let editorOpen = false;
let profile = { name: "", email: "", phone: "", link: "", displayMode: "per-project", theme: "academic" };
let persistTimer = null;
let projectAutoSaveTimer = null;
let autosaveTicker = null;
let sortMode = "manual";
let lastSavedAt = 0;
let lastDeletedProjectSnapshot = null;
const evidencePreviewUrlsByProjectId = new Map();
let draftEvidencePreviewUrls = [];
let draftEvidenceCaptions = {};
let currentEvidenceCaptions = {};
let evidenceDbPromise = null;
let evidenceSelectionTouched = false;
let projectPresets = [];
let versionHistory = [];
let lastAutoHistoryAt = 0;
let lastAutoHistorySignature = "";
let pendingPresetProjectId = "";
let pendingPresetOverwriteId = "";
let confirmModalResolver = null;

const SKILL_CATEGORIES = {
    "Programming Languages": ["python", "javascript", "typescript", "java", "c++", "c#", "react", "vue", "angular", "nodejs", "node.js", "rust", "kotlin", "swift", "perl", "php", "ruby", "matlab"],
    "Web & Frontend": ["html", "css", "tailwind", "bootstrap", "webpack", "babel", "next", "next.js", "vite", "svelte", "react", "vue", "angular", "graphql", "fetch"],
    "Backend & Databases": ["sql", "mongodb", "postgresql", "mysql", "firebase", "dynamodb", "redis", "elasticsearch", "docker", "kubernetes", "aws", "azure", "gcp", "git", "github"],
    "Data & AI": ["machine learning", "deep learning", "tensorflow", "pytorch", "keras", "pandas", "numpy", "scikit-learn", "nlp", "computer vision", "data analysis", "big data", "spark", "hadoop"],
    "Tools & Methods": ["agile", "scrum", "kanban", "jira", "linear", "figma", "sketch", "adobe", "photoshop", "illustrator", "blender", "unity", "unreal", "ci/cd", "devops"]
};

const ITEM_THEMES = {
    academic: {
        "--item-surface": "#fdfbf7",
        "--item-strong": "#8b4513",
        "--item-muted": "#5c4a3a",
        "--item-line-soft": "#dbcdbd",
        "--item-line-soft-2": "#e8dccf",
        "--item-surface-soft-2": "#f5ede4"
    },
    tech: {
        "--item-surface": "#f7fbff",
        "--item-strong": "#0066cc",
        "--item-muted": "#43576c",
        "--item-line-soft": "#c5dbef",
        "--item-line-soft-2": "#dbe9f5",
        "--item-surface-soft-2": "#ecf5ff"
    },
    artistic: {
        "--item-surface": "#fff9f6",
        "--item-strong": "#c45b3c",
        "--item-muted": "#6e4a3f",
        "--item-line-soft": "#e9c8be",
        "--item-line-soft-2": "#f1ddd7",
        "--item-surface-soft-2": "#fff0ea"
    },
    science: {
        "--item-surface": "#f5fbf7",
        "--item-strong": "#2f7a49",
        "--item-muted": "#3f6250",
        "--item-line-soft": "#bddcc8",
        "--item-line-soft-2": "#d6ebdd",
        "--item-surface-soft-2": "#eaf7ee"
    },
    outdoor: {
        "--item-surface": "#f8f7ef",
        "--item-strong": "#6a7a2f",
        "--item-muted": "#5e6345",
        "--item-line-soft": "#d0d1ba",
        "--item-line-soft-2": "#e3e2d1",
        "--item-surface-soft-2": "#efefe2"
    },
    minimalist: {
        "--item-surface": "#ffffff",
        "--item-strong": "#222222",
        "--item-muted": "#333333",
        "--item-line-soft": "#8d8d8d",
        "--item-line-soft-2": "#adadad",
        "--item-surface-soft-2": "#ffffff"
    }
};

let includeSkillsSummary = true;

function showStatus(message, isError = false) {
    const messageText = document.getElementById("statusMessageText");
    const closeBtn = document.getElementById("statusMessageClose");
    if (messageText) {
        messageText.textContent = message || "";
    }
    statusMessage.classList.toggle("is-visible", Boolean(message));
    statusMessage.classList.toggle("error", Boolean(message) && isError);
    if (closeBtn) {
        closeBtn.style.display = Boolean(message) ? "flex" : "none";
    }
}

function showError(message) {
    errorSummary.textContent = message;
    showStatus(message, true);
}

function clearError() {
    errorSummary.textContent = "";
}

function resolveConfirmModal(value) {
    if (confirmModalResolver) {
        confirmModalResolver(Boolean(value));
        confirmModalResolver = null;
    }
}

function closeConfirmModal(result = false) {
    if (!confirmModal) {
        resolveConfirmModal(result);
        return;
    }
    confirmModal.classList.add("is-hidden");
    resolveConfirmModal(result);
}

function openConfirmModal(options = {}) {
    if (!confirmModal || !confirmModalTitle || !confirmModalMessage || !confirmModalConfirm) {
        return Promise.resolve(false);
    }

    if (confirmModalResolver) {
        resolveConfirmModal(false);
    }

    confirmModalTitle.textContent = options.title || "Please confirm";
    confirmModalMessage.textContent = options.message || "Are you sure?";
    confirmModalConfirm.textContent = options.confirmText || "Confirm";
    confirmModalConfirm.classList.toggle("primary", !options.destructive);
    confirmModalConfirm.classList.toggle("delete-action", Boolean(options.destructive));
    confirmModal.classList.remove("is-hidden");

    return new Promise((resolve) => {
        confirmModalResolver = resolve;
    });
}

function setSortMode(nextMode) {
    sortMode = nextMode || "manual";
    if (sortProjectsSelect && sortProjectsSelect.value !== sortMode) {
        sortProjectsSelect.value = sortMode;
    }
}

function syncProfileDisplayToggle() {
    if (!profileDisplayModeInput || !profileModeEach || !profileModeTop) {
        return;
    }

    const isTopOnce = profileDisplayModeInput.value === "top-once";
    profileModeEach.classList.toggle("is-active", !isTopOnce);
    profileModeEach.setAttribute("aria-pressed", !isTopOnce ? "true" : "false");
    profileModeTop.classList.toggle("is-active", isTopOnce);
    profileModeTop.setAttribute("aria-pressed", isTopOnce ? "true" : "false");
}

function termRank(termValue) {
    const normalized = (termValue || "").trim().toLowerCase();
    if (normalized === "sem 1") {
        return 1;
    }
    if (normalized === "sem 2") {
        return 2;
    }
    if (normalized === "summer") {
        return 3;
    }
    if (normalized === "full year") {
        return 0;
    }
    return 99;
}

function closeEditorKeepSelection(announce = false) {
    if (!editorOpen) {
        return;
    }

    setEditorOpen(false);
    activeProjectId = "";
    clearError();
    renderProjectList();
    renderPreview();
    if (announce) {
        showStatus("Editor closed.");
    }
    schedulePersistSessionState();
}

function academicTimeKey(project) {
    const yearRaw = (project.data.identity.academicYear || "").trim();
    const startYear = Number((yearRaw.split("-")[0] || "0").trim()) || 0;
    return startYear * 10 + termRank(project.data.identity.term);
}

function applySortMode(mode, announce = true) {
    setSortMode(mode);
    if (!projects.length || sortMode === "manual") {
        renderProjectList();
        renderPreview();
        return;
    }

    const byCode = (a, b) => (a.data.identity.courseCode || "").localeCompare(b.data.identity.courseCode || "");
    const byUpdated = (a, b) => new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
    const byAcademic = (a, b) => academicTimeKey(a) - academicTimeKey(b);

    if (sortMode === "course-asc") {
        projects.sort(byCode);
    } else if (sortMode === "course-desc") {
        projects.sort((a, b) => byCode(b, a));
    } else if (sortMode === "updated-newest") {
        projects.sort((a, b) => byUpdated(b, a));
    } else if (sortMode === "updated-oldest") {
        projects.sort(byUpdated);
    } else if (sortMode === "time-newest") {
        projects.sort((a, b) => byAcademic(b, a));
    } else if (sortMode === "time-oldest") {
        projects.sort(byAcademic);
    }

    renderProjectList();
    renderPreview();
    if (announce) {
        showStatus("Sorted project list by " + sortMode.replace("-", " ") + ".");
    }
}

function updateAutosaveHint() {
    if (!autosaveHint) {
        return;
    }

    if (!lastSavedAt) {
        autosaveHint.textContent = "Autosave active.";
        return;
    }

    const seconds = Math.max(0, Math.floor((Date.now() - lastSavedAt) / 1000));
    if (seconds < 2) {
        autosaveHint.textContent = "Autosaved just now.";
        return;
    }

    if (seconds < 60) {
        autosaveHint.textContent = "Autosaved " + seconds + "s ago.";
        return;
    }

    const minutes = Math.floor(seconds / 60);
    autosaveHint.textContent = "Autosaved " + minutes + "m ago.";
}

function startAutosaveTicker() {
    if (autosaveTicker) {
        clearInterval(autosaveTicker);
    }
    autosaveTicker = setInterval(updateAutosaveHint, 5000);
    updateAutosaveHint();
}

function setupWelcomeModal() {
    if (!welcomeModal || !welcomeClose) {
        return;
    }

    let seen = "";
    seen = safeGetLocalStorageItem(WELCOME_STORAGE_KEY) || safeGetLocalStorageItem(LEGACY_WELCOME_STORAGE_KEY) || "";

    const dismiss = () => {
        welcomeModal.classList.add("is-hidden");
        safeSetLocalStorageItem(WELCOME_STORAGE_KEY, "1");
    };

    window.dismissWelcomeModal = dismiss;

    if (!seen) {
        welcomeModal.classList.remove("is-hidden");
    }

    welcomeClose.addEventListener("click", dismiss);

    welcomeModal.addEventListener("click", (event) => {
        if (event.target.closest("#welcomeClose")) {
            dismiss();
            return;
        }

        if (event.target === welcomeModal) {
            dismiss();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !welcomeModal.classList.contains("is-hidden")) {
            dismiss();
        }
    });
}

function applyTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    document.documentElement.style.colorScheme = themeName;
    if (themeToggle) {
        const isDark = themeName === "dark";
        themeToggle.innerHTML = isDark
            ? '<i class="fas fa-sun" aria-hidden="true"></i>'
            : '<i class="fas fa-moon" aria-hidden="true"></i>';
        const nextLabel = isDark ? "Switch to light mode" : "Switch to dark mode";
        themeToggle.setAttribute("aria-label", nextLabel);
        themeToggle.setAttribute("title", nextLabel);
    }
}

function initializeTheme() {
    if (window.HKUTheme) {
        window.HKUTheme.initThemeToggle(themeToggle);
        return;
    }
    applyTheme("light");
}

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
        () => {
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

function byId(id) {
    return document.getElementById(id);
}

function syncCustomSelectUiForSelect(selectEl) {
    if (!selectEl) {
        return;
    }

    const wrapper = selectEl.closest(".custom-select");
    if (!wrapper) {
        return;
    }

    const labelSpan = wrapper.querySelector(".custom-select-trigger span");
    const selectedOption = selectEl.options[selectEl.selectedIndex];
    if (labelSpan) {
        labelSpan.textContent = selectedOption ? selectedOption.textContent || "" : "";
    }

    Array.from(wrapper.querySelectorAll(".custom-select-option")).forEach((node) => {
        const isSelected = node.getAttribute("data-value") === selectEl.value;
        node.classList.toggle("is-selected", isSelected);
        node.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
}

function syncAllCustomSelectUi() {
    document.querySelectorAll("select.custom-select-native").forEach((selectEl) => {
        syncCustomSelectUiForSelect(selectEl);
    });
}

function setupCustomSelects() {
    const selectElements = Array.from(document.querySelectorAll("select"));
    if (!selectElements.length) {
        return;
    }

    const wrappers = [];

    function closeAllCustomSelects(exceptWrapper = null) {
        wrappers.forEach((wrapper) => {
            if (wrapper === exceptWrapper) {
                return;
            }
            wrapper.classList.remove("is-open");
            const trigger = wrapper.querySelector(".custom-select-trigger");
            if (trigger) {
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    }

    function triggerSyntheticEvents(selectEl) {
        selectEl.dispatchEvent(new Event("input", { bubbles: true }));
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function focusOptionAtIndex(wrapper, index) {
        const options = Array.from(wrapper.querySelectorAll(".custom-select-option:not(.is-disabled)"));
        if (!options.length) {
            return;
        }
        const safeIndex = Math.max(0, Math.min(index, options.length - 1));
        const target = options[safeIndex];
        try {
            target.focus({ preventScroll: true });
        } catch (error) {
            target.focus();
        }
    }

    selectElements.forEach((selectEl, selectIndex) => {
        if (selectEl.classList.contains("custom-select-native")) {
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "custom-select";
        wrapper.dataset.customSelectId = "custom-select-" + selectIndex;

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "custom-select-trigger";
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");

        const list = document.createElement("ul");
        list.className = "custom-select-list";
        list.setAttribute("role", "listbox");

        const labelSpan = document.createElement("span");
        trigger.appendChild(labelSpan);

        function syncFromSelect() {
            const selectedText = selectEl.options[selectEl.selectedIndex]
                ? selectEl.options[selectEl.selectedIndex].textContent || ""
                : "";
            labelSpan.textContent = selectedText;

            Array.from(list.querySelectorAll(".custom-select-option")).forEach((node) => {
                const isSelected = node.getAttribute("data-value") === selectEl.value;
                node.classList.toggle("is-selected", isSelected);
                node.setAttribute("aria-selected", isSelected ? "true" : "false");
            });
        }

        Array.from(selectEl.options).forEach((option) => {
            const optionNode = document.createElement("li");
            optionNode.className = "custom-select-option";
            optionNode.setAttribute("role", "option");
            optionNode.setAttribute("tabindex", "-1");
            optionNode.setAttribute("data-value", option.value);
            optionNode.textContent = option.textContent || "";

            if (option.disabled) {
                optionNode.classList.add("is-disabled");
                optionNode.setAttribute("aria-disabled", "true");
            }

            optionNode.addEventListener("click", () => {
                if (option.disabled) {
                    return;
                }
                selectEl.value = option.value;
                syncFromSelect();
                triggerSyntheticEvents(selectEl);
                wrapper.classList.remove("is-open");
                trigger.setAttribute("aria-expanded", "false");
                trigger.focus();
            });

            optionNode.addEventListener("keydown", (event) => {
                const activeOptions = Array.from(list.querySelectorAll(".custom-select-option:not(.is-disabled)"));
                const activeIndex = activeOptions.indexOf(optionNode);

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusOptionAtIndex(wrapper, activeIndex + 1);
                    return;
                }
                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusOptionAtIndex(wrapper, activeIndex - 1);
                    return;
                }
                if (event.key === "Home") {
                    event.preventDefault();
                    focusOptionAtIndex(wrapper, 0);
                    return;
                }
                if (event.key === "End") {
                    event.preventDefault();
                    focusOptionAtIndex(wrapper, activeOptions.length - 1);
                    return;
                }
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    optionNode.click();
                    return;
                }
                if (event.key === "Escape") {
                    event.preventDefault();
                    wrapper.classList.remove("is-open");
                    trigger.setAttribute("aria-expanded", "false");
                    trigger.focus();
                }
            });

            list.appendChild(optionNode);
        });

        trigger.addEventListener("click", () => {
            const opening = !wrapper.classList.contains("is-open");
            closeAllCustomSelects(opening ? wrapper : null);
            wrapper.classList.toggle("is-open", opening);
            trigger.setAttribute("aria-expanded", opening ? "true" : "false");

            if (opening) {
                const selectedNode = list.querySelector(".custom-select-option.is-selected") || list.querySelector(".custom-select-option");
                if (selectedNode) {
                    try {
                        selectedNode.focus({ preventScroll: true });
                    } catch (error) {
                        selectedNode.focus();
                    }
                }
            }
        });

        trigger.addEventListener("keydown", (event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                if (!wrapper.classList.contains("is-open")) {
                    closeAllCustomSelects(wrapper);
                    wrapper.classList.add("is-open");
                    trigger.setAttribute("aria-expanded", "true");
                }
                const activeOptions = Array.from(list.querySelectorAll(".custom-select-option:not(.is-disabled)"));
                const selectedNode = list.querySelector(".custom-select-option.is-selected");
                const selectedIndex = Math.max(0, activeOptions.indexOf(selectedNode));
                const nextIndex = event.key === "ArrowDown" ? selectedIndex + 1 : selectedIndex - 1;
                focusOptionAtIndex(wrapper, nextIndex);
                return;
            }

            if (event.key === "Escape" && wrapper.classList.contains("is-open")) {
                event.preventDefault();
                wrapper.classList.remove("is-open");
                trigger.setAttribute("aria-expanded", "false");
            }
        });

        selectEl.addEventListener("change", syncFromSelect);

        selectEl.parentNode.insertBefore(wrapper, selectEl);
        selectEl.classList.add("custom-select-native");
        wrapper.appendChild(selectEl);
        wrapper.appendChild(trigger);
        wrapper.appendChild(list);

        syncFromSelect();
        wrappers.push(wrapper);
    });

    document.addEventListener("click", (event) => {
        const wrapper = event.target.closest(".custom-select");
        closeAllCustomSelects(wrapper || null);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }
        closeAllCustomSelects(null);
    });

    window.addEventListener("resize", () => closeAllCustomSelects(null), { passive: true });
}

function sanitize(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function createEmptyData() {
    return {
        identity: {
            courseCode: "",
            courseName: "",
            academicYear: "2025-26",
            term: "",
            projectType: "",
            projectTitle: "",
            projectTheme: "tech"
        },
        hkuContext: { faculty: "", department: "" },
        team: { role: "", teamSize: "" },
        contribution: { responsibilities: "" },
        technical: { tools: "", methods: "" },
        narrative: { problemStatement: "", objectives: "", deliverables: "", challenges: "", mitigation: "", results: "" },
        reflection: { lessons: "", futureImprovements: "" },
        evidence: [],
        meta: { generatedAt: new Date().toLocaleString() }
    };
}

function value(id) {
    return byId(id).value.trim();
}

const HKU_CONTEXT_FALLBACK_PLACEHOLDER = "Not inferred from course code. Enter manually.";

function markHkuContextFieldManual(fieldEl) {
    if (!fieldEl) {
        return;
    }

    fieldEl.dataset.inferenceSource = "manual";
    fieldEl.classList.remove("not-inferred");
}

function updateInferenceNoteFromCourseCode(codeRaw) {
    const code = (codeRaw || "").trim().toUpperCase();
    const prefix = code.slice(0, 4);
    const matched = PREFIX_MAP[prefix];
    const hasFaculty = Boolean((byId("faculty").value || "").trim());
    const hasDepartment = Boolean((byId("department").value || "").trim());

    if (matched) {
        inferenceNote.classList.remove("warn");
        inferenceNote.textContent = "HKU inference found from course prefix " + prefix + ".";
        return;
    }

    if (prefix && hasFaculty && hasDepartment) {
        inferenceNote.classList.remove("warn");
        inferenceNote.textContent = "";
        return;
    }

    inferenceNote.classList.toggle("warn", Boolean(prefix));
    inferenceNote.textContent = prefix ? "No local mapping for prefix " + prefix + ". You can still continue." : "";
}

function inferFromCourseCode(codeRaw) {
    const facultyEl = byId("faculty");
    const departmentEl = byId("department");
    const code = (codeRaw || "").trim().toUpperCase();
    const prefix = code.slice(0, 4);
    const matched = PREFIX_MAP[prefix];

    if (matched) {
        if (!facultyEl.value.trim()) {
            facultyEl.value = matched.faculty;
            facultyEl.dataset.inferenceSource = "inferred";
        }
        if (!departmentEl.value.trim()) {
            departmentEl.value = matched.department;
            departmentEl.dataset.inferenceSource = "inferred";
        }
        facultyEl.classList.toggle("not-inferred", !facultyEl.value.trim());
        departmentEl.classList.toggle("not-inferred", !departmentEl.value.trim());
        facultyEl.placeholder = "Auto-detected from course code, or type manually";
        departmentEl.placeholder = "Auto-detected from course code, or type manually";
        updateInferenceNoteFromCourseCode(codeRaw);
        return;
    }

    if (!facultyEl.value.trim()) {
        facultyEl.dataset.inferenceSource = "";
    }
    if (!departmentEl.value.trim()) {
        departmentEl.dataset.inferenceSource = "";
    }
    facultyEl.placeholder = HKU_CONTEXT_FALLBACK_PLACEHOLDER;
    departmentEl.placeholder = HKU_CONTEXT_FALLBACK_PLACEHOLDER;
    facultyEl.classList.toggle("not-inferred", !facultyEl.value.trim());
    departmentEl.classList.toggle("not-inferred", !departmentEl.value.trim());
    updateInferenceNoteFromCourseCode(codeRaw);
}

function buildEvidenceCaptionsUI(files) {
    if (!files || !files.length) {
        evidenceCaptionsSection.style.display = "none";
        evidenceCaptions.innerHTML = "";
        return;
    }
    
    const captions = activeProjectId ? currentEvidenceCaptions : draftEvidenceCaptions;
    const items = Array.from(files)
        .filter((file) => {
            if (file && typeof file.type === "string") {
                return file.type.startsWith("image/");
            }
            // Persisted entries may not always carry type metadata in legacy states.
            return Boolean(file && file.name);
        })
        .map((file) => {
            const fileName = file.name || "image";
            const caption = captions[fileName] || "";
            return (
                "<div class=\"caption-input-group\">" +
                "<label style=\"font-size: 0.9em; margin-bottom: 0.3rem; display: block; font-weight: 500;\">" +
                sanitize(fileName) +
                "</label>" +
                "<input type=\"text\" class=\"caption-input\" data-filename=\"" + sanitize(fileName) + "\"" +
                " placeholder=\"e.g., 'Final UI mockup' or 'Test results screenshot'\" value=\"" + sanitize(caption) + "\" />" +
                "</div>"
            );
        })
        .join("");
    
    evidenceCaptions.innerHTML = items;
    evidenceCaptionsSection.style.display = items ? "block" : "none";
    
    // Wire up caption updates
    document.querySelectorAll(".caption-input").forEach((input) => {
        input.addEventListener("input", () => {
            const filename = input.getAttribute("data-filename");
            if (activeProjectId) {
                currentEvidenceCaptions[filename] = input.value;
            } else {
                draftEvidenceCaptions[filename] = input.value;
            }
            if (editorOpen) {
                scheduleAutosaveActiveProjectEdit();
            }
        });
    });
}

function normalizeEvidenceItem(item) {
    if (!item) {
        return null;
    }

    if (typeof item === "string") {
        return { name: item, type: "image/*" };
    }

    if (typeof item === "object" && item.name) {
        return {
            name: String(item.name),
            type: typeof item.type === "string" ? item.type : "image/*",
            caption: typeof item.caption === "string" ? item.caption : "",
            size: Number(item.size) || 0
        };
    }

    return null;
}

function currentEvidenceItemsFromContext() {
    if (evidenceSelectionTouched) {
        return Array.from(evidenceInput.files || []);
    }

    if (!activeProjectId) {
        return [];
    }

    const activeProject = projects.find((project) => project.id === activeProjectId);
    const storedEvidence = activeProject && activeProject.data && Array.isArray(activeProject.data.evidence)
        ? activeProject.data.evidence
        : [];

    return storedEvidence.map((item) => normalizeEvidenceItem(item)).filter(Boolean);
}

function listEvidenceNames() {
    evidenceList.innerHTML = "";
    const files = currentEvidenceItemsFromContext();
    files.forEach((file) => {
        const li = document.createElement("li");
        const hasSize = Number(file.size) > 0;
        li.textContent = hasSize
            ? file.name + " (" + Math.round(file.size / 1024) + " KB)"
            : file.name + " (saved image)";
        evidenceList.appendChild(li);
    });
    
    // Update captions UI
    buildEvidenceCaptionsUI(files);
}

function isImageFile(file) {
    return Boolean(file && typeof file.type === "string" && file.type.startsWith("image/"));
}

function buildEvidencePreviewUrls(files) {
    return Array.from(files || [])
        .filter((file) => isImageFile(file))
        .map((file) => URL.createObjectURL(file));
}

function revokeEvidencePreviewUrls(urls) {
    (urls || []).forEach((url) => {
        try {
            URL.revokeObjectURL(url);
        } catch (error) {}
    });
}

function replaceEvidencePreviewUrlsForProject(projectId, nextUrls) {
    if (!projectId) {
        return;
    }

    const previous = evidencePreviewUrlsByProjectId.get(projectId) || [];
    revokeEvidencePreviewUrls(previous);

    if (nextUrls.length) {
        evidencePreviewUrlsByProjectId.set(projectId, nextUrls);
        return;
    }

    evidencePreviewUrlsByProjectId.delete(projectId);
}

function setDraftEvidencePreviewUrls(nextUrls) {
    revokeEvidencePreviewUrls(draftEvidencePreviewUrls);
    draftEvidencePreviewUrls = nextUrls;
}

function clearAllEvidencePreviewUrls() {
    evidencePreviewUrlsByProjectId.forEach((urls) => revokeEvidencePreviewUrls(urls));
    evidencePreviewUrlsByProjectId.clear();
    setDraftEvidencePreviewUrls([]);
}

function currentEvidenceNamesFromContext() {
    const selectedNames = Array.from(evidenceInput.files || []).map((f) => f.name);
    if (evidenceSelectionTouched) {
        return selectedNames;
    }

    if (!activeProjectId) {
        return selectedNames;
    }

    const activeProject = projects.find((project) => project.id === activeProjectId);
    if (!activeProject || !activeProject.data || !Array.isArray(activeProject.data.evidence)) {
        return selectedNames;
    }

    return activeProject.data.evidence.slice();
}

function getCurrentEvidenceWithCaptions() {
    let files = [];
    if (evidenceSelectionTouched) {
        files = Array.from(evidenceInput.files || []).map((f) => f.name);
    } else if (activeProjectId) {
        const activeProject = projects.find((project) => project.id === activeProjectId);
        const currentEvidence = activeProject && activeProject.data && Array.isArray(activeProject.data.evidence)
            ? activeProject.data.evidence
            : [];
        files = currentEvidence
            .map((item) => normalizeEvidenceItem(item))
            .filter(Boolean)
            .map((item) => item.name);
    }

    const captions = activeProjectId ? currentEvidenceCaptions : draftEvidenceCaptions;
    
    return files.map((filename) => ({
        name: filename,
        caption: captions[filename] || ""
    }));
}

function supportsIndexedDb() {
    return typeof indexedDB !== "undefined";
}

function openEvidenceDb() {
    if (!supportsIndexedDb()) {
        return Promise.resolve(null);
    }

    if (evidenceDbPromise) {
        return evidenceDbPromise;
    }

    evidenceDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(EVIDENCE_DB_NAME, EVIDENCE_DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(EVIDENCE_STORE_NAME)) {
                db.createObjectStore(EVIDENCE_STORE_NAME, { keyPath: "projectId" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Failed to open evidence database."));
    });

    return evidenceDbPromise;
}

// Skill Extraction & Theme Functions

function extractSkillsFromProject(data) {
    if (!data) {
        return {};
    }

    // Restrict extraction to explicit technical fields to avoid narrative false positives.
    const text = [data.technical.tools || "", data.technical.methods || ""]
        .join(" ")
        .toLowerCase();

    const foundSkills = {};
    Object.entries(SKILL_CATEGORIES).forEach(([category, keywords]) => {
        const matched = keywords.filter((keyword) => {
            const normalizedKeyword = keyword.toLowerCase();
            const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const pattern = "(^|[^a-z0-9+#.-])" + escaped + "([^a-z0-9+#.-]|$)";
            return new RegExp(pattern, "i").test(text);
        });

        if (matched.length > 0) {
            foundSkills[category] = [...new Set(matched)];
        }
    });

    return foundSkills;
}

function buildSkillsSummaryHtml(allProjects) {
    const skillSets = {};

    allProjects.forEach((projectRecord) => {
        const skills = extractSkillsFromProject(projectRecord.data);
        Object.entries(skills).forEach(([category, keywords]) => {
            if (!skillSets[category]) {
                skillSets[category] = new Set();
            }
            keywords.forEach((skill) => {
                skillSets[category].add(skill);
            });
        });
    });

    if (Object.keys(skillSets).length === 0) {
        return "";
    }

    const sections = Object.entries(skillSets)
        .map(([category, skills]) => {
            const items = Array.from(skills)
                .sort((a, b) => a.localeCompare(b))
                .map((skill) => "<li>" + sanitize(skill) + "</li>")
                .join("");
            return "<h4>" + sanitize(category) + "</h4><ul class=\"skills-list\">" + items + "</ul>";
            })
        .join("");

    return section("Skills Summary", sections, true);
}

function normalizeItemTheme(themeName) {
    const normalized = String(themeName || "").trim().toLowerCase();
    if (normalized === "print") {
        return "minimalist";
    }
    return ITEM_THEMES[normalized] ? normalized : "tech";
}

function itemThemeStyle(themeName) {
    const normalized = normalizeItemTheme(themeName);
    const theme = ITEM_THEMES[normalized];
    return Object.entries(theme)
        .map(([varName, value]) => varName + ": " + value)
        .join("; ");
}

function safeParseLocalStorage(key, fallbackValue) {
    try {
        const raw = safeGetLocalStorageItem(key);
        if (!raw) {
            return fallbackValue;
        }
        return JSON.parse(raw);
    } catch (error) {
        return fallbackValue;
    }
}

function safeParseRawJson(raw, fallbackValue) {
    try {
        if (!raw) {
            return fallbackValue;
        }
        return JSON.parse(raw);
    } catch (error) {
        return fallbackValue;
    }
}

function safeGetLocalStorageItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return "";
    }
}

function safeSetLocalStorageItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {}
}

function safeRemoveLocalStorageItem(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {}
}

function formatDateTimeLabel(isoString) {
    const date = new Date(isoString || Date.now());
    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }
    return date.toLocaleString();
}

function persistProjectPresets() {
    safeSetLocalStorageItem(PROJECT_PRESETS_STORAGE_KEY, JSON.stringify(projectPresets));
}

function loadProjectPresets() {
    const raw = safeGetLocalStorageItem(PROJECT_PRESETS_STORAGE_KEY) || safeGetLocalStorageItem(LEGACY_PROJECT_PRESETS_STORAGE_KEY);
    const parsed = safeParseRawJson(raw, []);
    if (raw && !safeGetLocalStorageItem(PROJECT_PRESETS_STORAGE_KEY)) {
        safeSetLocalStorageItem(PROJECT_PRESETS_STORAGE_KEY, raw);
    }
    projectPresets = Array.isArray(parsed)
        ? parsed
              .filter((preset) => preset && preset.id && preset.name && preset.fields)
              .map((preset) => ({
                  id: String(preset.id),
                  name: String(preset.name).trim() || "Untitled preset",
                  fields: preset.fields,
                  createdAt: preset.createdAt || new Date().toISOString(),
                  updatedAt: preset.updatedAt || new Date().toISOString()
              }))
        : [];
}

function isMeaningfulValue(value) {
    if (typeof value === "string") {
        return value.trim() !== "";
    }
    if (Array.isArray(value)) {
        return value.length > 0;
    }
    if (value && typeof value === "object") {
        return Object.keys(value).length > 0;
    }
    return value !== null && value !== undefined;
}

function createNonEmptyPatch(source, path = "") {
    if (source === null || source === undefined) {
        return undefined;
    }

    if (typeof source !== "object") {
        return isMeaningfulValue(source) ? source : undefined;
    }

    if (Array.isArray(source)) {
        if (!source.length) {
            return undefined;
        }
        return JSON.parse(JSON.stringify(source));
    }

    const skippedTopLevel = path === "" ? { evidence: true, meta: true } : null;
    const next = {};
    Object.entries(source).forEach(([key, value]) => {
        if (skippedTopLevel && skippedTopLevel[key]) {
            return;
        }

        const childPath = path ? path + "." + key : key;
        const child = createNonEmptyPatch(value, childPath);
        if (child !== undefined) {
            next[key] = child;
        }
    });

    return Object.keys(next).length ? next : undefined;
}

function mergePresetFieldsIntoData(target, patch) {
    if (!patch || typeof patch !== "object") {
        return target;
    }

    if (Array.isArray(patch)) {
        return JSON.parse(JSON.stringify(patch));
    }

    const result = { ...(target || {}) };
    Object.entries(patch).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
            result[key] = mergePresetFieldsIntoData(result[key] || {}, value);
            return;
        }
        result[key] = value;
    });
    return result;
}

function renderPresetPickerList() {
    if (!presetPickerList) {
        return;
    }

    if (!projectPresets.length) {
        presetPickerList.innerHTML =
            "<li class=\"preset-item\"><p class=\"preset-item-meta\">No presets yet. Save one from a project card menu first.</p></li>";
        return;
    }

    presetPickerList.innerHTML = projectPresets
        .map((preset) => {
            const updated = formatDateTimeLabel(preset.updatedAt || preset.createdAt);
            return (
                "<li class=\"preset-item\">" +
                "<button type=\"button\" data-preset-action=\"apply\" data-id=\"" +
                sanitize(preset.id) +
                "\">" +
                sanitize(preset.name) +
                "</button>" +
                "<p class=\"preset-item-meta\">Updated: " +
                sanitize(updated) +
                "</p></li>"
            );
        })
        .join("");
}

function openPresetPickerModal() {
    if (!presetPickerModal) {
        return;
    }
    renderPresetPickerList();
    presetPickerModal.classList.remove("is-hidden");
}

function closePresetPickerModal() {
    if (!presetPickerModal) {
        return;
    }
    presetPickerModal.classList.add("is-hidden");
}

function applyPresetByIdToCurrentProject(presetId) {
    const preset = projectPresets.find((item) => item.id === presetId);
    if (!preset) {
        showError("Preset not found.");
        return;
    }

    const current = collectData();
    const merged = mergePresetFieldsIntoData(current, preset.fields || {});
    setFormData(merged);
    updateTeamFieldVisibility();
    renderPreview();
    scheduleAutosaveActiveProjectEdit();
    schedulePersistSessionState();
    clearError();
    showStatus("Applied preset: " + preset.name + ".");
}

function closePresetSaveModal() {
    if (!presetSaveModal) {
        return;
    }
    presetSaveModal.classList.add("is-hidden");
    pendingPresetProjectId = "";
    pendingPresetOverwriteId = "";
    if (presetSaveWarning) {
        presetSaveWarning.textContent = "";
        presetSaveWarning.classList.add("is-hidden");
    }
    if (presetSaveConfirm) {
        presetSaveConfirm.textContent = "Save preset";
    }
}

function savePresetByName(projectId, name, allowOverwrite = false) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
        showError("Could not find this project to save as preset.");
        return { status: "error" };
    }

    const fields = createNonEmptyPatch(project.data) || {};
    if (!Object.keys(fields).length) {
        showError("This project has no non-empty fields to save.");
        return { status: "error" };
    }

    const existing = projectPresets.find((preset) => preset.name.toLowerCase() === name.toLowerCase());
    if (existing && !allowOverwrite) {
        return { status: "needs-overwrite", existingId: existing.id, existingName: existing.name };
    }

    if (existing) {
        existing.fields = fields;
        existing.updatedAt = new Date().toISOString();
        persistProjectPresets();
        renderPresetPickerList();
        clearError();
        showStatus("Updated preset: " + existing.name + ".");
        return { status: "updated" };
    }

    projectPresets.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name,
        fields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    persistProjectPresets();
    renderPresetPickerList();
    clearError();
    showStatus("Saved preset from project: " + name + ".");
    return { status: "created" };
}

function openPresetSaveModal(projectId) {
    if (!presetSaveModal || !presetSaveNameInput || !presetSaveWarning || !presetSaveConfirm) {
        showError("Preset save dialog is unavailable.");
        return;
    }

    const project = projects.find((item) => item.id === projectId);
    if (!project) {
        showError("Could not find this project to save as preset.");
        return;
    }

    pendingPresetProjectId = projectId;
    pendingPresetOverwriteId = "";
    const suggestedName = project.data.identity.projectTitle || project.data.identity.courseCode || "Project preset";
    presetSaveNameInput.value = suggestedName;
    presetSaveWarning.textContent = "";
    presetSaveWarning.classList.add("is-hidden");
    presetSaveConfirm.textContent = "Save preset";

    presetSaveModal.classList.remove("is-hidden");
    setTimeout(() => {
        presetSaveNameInput.focus();
        presetSaveNameInput.select();
    }, 0);
}

function saveProjectAsPreset(projectId) {
    openPresetSaveModal(projectId);
}

function applyPresetToCurrentProject() {
    if (!editorOpen) {
        showError("Open a project editor first to apply a preset.");
        return;
    }

    openPresetPickerModal();
}

function persistVersionHistory() {
    safeSetLocalStorageItem(VERSION_HISTORY_STORAGE_KEY, JSON.stringify(versionHistory));
}

function loadVersionHistory() {
    const raw = safeGetLocalStorageItem(VERSION_HISTORY_STORAGE_KEY) || safeGetLocalStorageItem(LEGACY_VERSION_HISTORY_STORAGE_KEY);
    const parsed = safeParseRawJson(raw, []);
    if (raw && !safeGetLocalStorageItem(VERSION_HISTORY_STORAGE_KEY)) {
        safeSetLocalStorageItem(VERSION_HISTORY_STORAGE_KEY, raw);
    }
    versionHistory = Array.isArray(parsed)
        ? parsed
              .filter((entry) => entry && entry.id && entry.state)
              .map((entry) => ({
                  id: String(entry.id),
                  savedAt: entry.savedAt || new Date().toISOString(),
                  label: String(entry.label || "Autosave"),
                  mode: entry.mode === "manual" ? "manual" : "auto",
                  state: entry.state
              }))
              .slice(0, VERSION_HISTORY_LIMIT)
        : [];
}

function buildHistorySnapshotLabel(mode, savedAt, count) {
    const prefix = mode === "manual" ? "Manual" : "Auto";
    return prefix + " - " + count + " project" + (count === 1 ? "" : "s") + " - " + formatDateTimeLabel(savedAt);
}

function buildCurrentHistoryState() {
    return {
        projects: JSON.parse(JSON.stringify(projects)),
        profile: collectProfile(),
        sortMode,
        splitPages: Boolean(splitPagesToggle && splitPagesToggle.checked),
        includeSkillsSummary: Boolean(includeSkillsSummary)
    };
}

function historyStateSignature() {
    return JSON.stringify({
        projects,
        profile: collectProfile(),
        sortMode,
        splitPages: Boolean(splitPagesToggle && splitPagesToggle.checked),
        includeSkillsSummary: Boolean(includeSkillsSummary)
    });
}

function addHistorySnapshot(mode = "auto") {
    const savedAt = new Date().toISOString();
    const state = buildCurrentHistoryState();
    const record = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        savedAt,
        mode,
        label: buildHistorySnapshotLabel(mode, savedAt, projects.length),
        state
    };

    versionHistory.unshift(record);
    if (versionHistory.length > VERSION_HISTORY_LIMIT) {
        versionHistory = versionHistory.slice(0, VERSION_HISTORY_LIMIT);
    }
    persistVersionHistory();
    renderHistoryList();
    lastAutoHistoryAt = Date.now();
    lastAutoHistorySignature = historyStateSignature();
}

function maybeCaptureAutoHistory() {
    const signature = historyStateSignature();
    if (signature === lastAutoHistorySignature) {
        return;
    }

    if (Date.now() - lastAutoHistoryAt < AUTO_HISTORY_INTERVAL_MS) {
        return;
    }

    addHistorySnapshot("auto");
}

function renderHistoryList() {
    if (!historyList) {
        return;
    }

    if (!versionHistory.length) {
        historyList.innerHTML = "<li class=\"history-item\"><p class=\"history-item-meta\">No autosave snapshots yet.</p></li>";
        return;
    }

    historyList.innerHTML = versionHistory
        .map((entry) => {
            return (
                "<li class=\"history-item\">" +
                "<strong>" + sanitize(entry.label) + "</strong>" +
                "<p class=\"history-item-meta\">Saved at: " + sanitize(formatDateTimeLabel(entry.savedAt)) + "</p>" +
                "<div class=\"history-item-actions\">" +
                "<button type=\"button\" data-history-action=\"restore\" data-id=\"" + sanitize(entry.id) + "\">Restore</button>" +
                "<button type=\"button\" data-history-action=\"delete\" data-id=\"" + sanitize(entry.id) + "\" class=\"delete-action\">Delete</button>" +
                "</div></li>"
            );
        })
        .join("");
}

async function restoreHistorySnapshotById(snapshotId) {
    const entry = versionHistory.find((item) => item.id === snapshotId);
    if (!entry) {
        showError("Snapshot not found.");
        return;
    }

    const shouldRestore = await openConfirmModal({
        title: "Restore Snapshot",
        message: "Restore this autosave snapshot? Current unsaved state will be replaced.",
        confirmText: "Restore"
    });
    if (!shouldRestore) {
        return;
    }

    const parsedProjects = coerceImportedProjectRecords(entry.state.projects);
    projects = parsedProjects;
    activeProjectId = "";
    clearAllEvidencePreviewUrls();
    clearFormFields();
    setEditorOpen(false);

    setProfileFields(entry.state.profile || { name: "", email: "", phone: "", link: "", displayMode: "per-project", theme: "academic" });
    setSortMode(entry.state.sortMode || "manual");
    if (splitPagesToggle) {
        splitPagesToggle.checked = Boolean(entry.state.splitPages);
    }
    includeSkillsSummary = Boolean(entry.state.includeSkillsSummary);
    if (includeSkillsToggle) {
        includeSkillsToggle.checked = includeSkillsSummary;
    }

    await preloadEvidencePreviewUrlsForProjects(projects.map((project) => project.id));
    applySortMode(sortMode, false);
    renderProjectList();
    renderPreview();
    clearError();
    showStatus("Restored snapshot.");
    schedulePersistSessionState();
    lastAutoHistorySignature = historyStateSignature();
}

async function deleteHistorySnapshotById(snapshotId) {
    const entry = versionHistory.find((item) => item.id === snapshotId);
    if (!entry) {
        showError("Snapshot not found.");
        return;
    }

    const shouldDelete = await openConfirmModal({
        title: "Delete Snapshot",
        message: "Delete this autosave snapshot?",
        confirmText: "Delete",
        destructive: true
    });
    if (!shouldDelete) {
        return;
    }

    versionHistory = versionHistory.filter((item) => item.id !== snapshotId);
    persistVersionHistory();
    renderHistoryList();
    clearError();
    showStatus("Deleted autosave snapshot.");
}

async function deleteAllHistorySnapshots() {
    if (!versionHistory.length) {
        showStatus("No autosave history snapshots to delete.");
        return;
    }

    const shouldDelete = await openConfirmModal({
        title: "Delete All History",
        message: "Delete all autosave history snapshots? This action is irreversible.",
        confirmText: "Delete history",
        destructive: true
    });
    if (!shouldDelete) {
        return;
    }

    versionHistory = [];
    persistVersionHistory();
    renderHistoryList();
    clearError();
    showStatus("Deleted all autosave history snapshots.");

    // Allow fresh snapshots to be captured again without waiting for old timing/signature state.
    lastAutoHistoryAt = 0;
    lastAutoHistorySignature = "";
}

function openHistoryModal() {
    if (!historyModal) {
        return;
    }
    renderHistoryList();
    historyModal.classList.remove("is-hidden");
}

function closeHistoryModal() {
    if (!historyModal) {
        return;
    }
    historyModal.classList.add("is-hidden");
}

function withEvidenceStore(mode, operation) {
    return openEvidenceDb().then((db) => {
        if (!db) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(EVIDENCE_STORE_NAME, mode);
            const store = transaction.objectStore(EVIDENCE_STORE_NAME);

            let operationResult;
            try {
                operationResult = operation(store);
            } catch (error) {
                reject(error);
                return;
            }

            transaction.oncomplete = () => resolve(operationResult);
            transaction.onerror = () => reject(transaction.error || new Error("Evidence store transaction failed."));
            transaction.onabort = () => reject(transaction.error || new Error("Evidence store transaction aborted."));
        });
    });
}

function readProjectEvidenceEntries(projectId) {
    if (!projectId) {
        return Promise.resolve([]);
    }

    return withEvidenceStore("readonly", (store) => {
        return new Promise((resolve, reject) => {
            const request = store.get(projectId);
            request.onsuccess = () => {
                const record = request.result;
                resolve(record && Array.isArray(record.entries) ? record.entries : []);
            };
            request.onerror = () => reject(request.error || new Error("Failed to read project evidence."));
        });
    }).then((result) => result || []);
}

function writeProjectEvidenceEntries(projectId, entries) {
    if (!projectId) {
        return Promise.resolve();
    }

    const safeEntries = Array.isArray(entries)
        ? entries
              .filter((entry) => entry && entry.blob instanceof Blob)
              .map((entry) => ({
                  name: entry.name || "image",
                  type: entry.type || entry.blob.type || "",
                  lastModified: Number(entry.lastModified) || Date.now(),
                  blob: entry.blob
              }))
        : [];

    if (!safeEntries.length) {
        return deleteProjectEvidenceEntries(projectId);
    }

    return withEvidenceStore("readwrite", (store) => {
        store.put({
            projectId,
            updatedAt: new Date().toISOString(),
            entries: safeEntries
        });
        return true;
    }).then(() => {});
}

function deleteProjectEvidenceEntries(projectId) {
    if (!projectId) {
        return Promise.resolve();
    }

    return withEvidenceStore("readwrite", (store) => {
        store.delete(projectId);
        return true;
    }).then(() => {});
}

function saveEvidenceFilesForProject(projectId, fileList) {
    const entries = Array.from(fileList || [])
        .filter((file) => isImageFile(file))
        .map((file) => ({
            name: file.name || "image",
            type: file.type || "",
            lastModified: Number(file.lastModified) || Date.now(),
            blob: file
        }));

    return writeProjectEvidenceEntries(projectId, entries);
}

function moveProjectEvidenceEntries(sourceProjectId, targetProjectId) {
    if (!sourceProjectId || !targetProjectId || sourceProjectId === targetProjectId) {
        return Promise.resolve();
    }

    return readProjectEvidenceEntries(sourceProjectId).then((entries) => {
        if (!entries.length) {
            return deleteProjectEvidenceEntries(targetProjectId);
        }

        return writeProjectEvidenceEntries(targetProjectId, entries).then(() => deleteProjectEvidenceEntries(sourceProjectId));
    });
}

function copyProjectEvidenceEntries(sourceProjectId, targetProjectId) {
    if (!sourceProjectId || !targetProjectId || sourceProjectId === targetProjectId) {
        return Promise.resolve();
    }

    return readProjectEvidenceEntries(sourceProjectId).then((entries) => {
        if (!entries.length) {
            return deleteProjectEvidenceEntries(targetProjectId);
        }
        return writeProjectEvidenceEntries(targetProjectId, entries);
    });
}

function loadEvidencePreviewUrlsForProject(projectId) {
    if (!projectId) {
        return Promise.resolve([]);
    }

    return readProjectEvidenceEntries(projectId).then((entries) => {
        const projectIndex = projects.findIndex((project) => project.id === projectId);
        if (projectIndex >= 0) {
            const existingEvidence = Array.isArray(projects[projectIndex].data.evidence)
                ? projects[projectIndex].data.evidence
                : [];
            if (!existingEvidence.length && entries.length) {
                projects[projectIndex].data.evidence = entries.map((entry) => ({
                    name: entry.name || "image",
                    caption: ""
                }));
            }
        }

        const urls = entries
            .map((entry) => {
                if (!entry || !(entry.blob instanceof Blob)) {
                    return "";
                }
                return URL.createObjectURL(entry.blob);
            })
            .filter(Boolean);
        replaceEvidencePreviewUrlsForProject(projectId, urls);

        if (activeProjectId === projectId && !evidenceSelectionTouched) {
            listEvidenceNames();
        }

        return urls;
    });
}

function loadDraftEvidencePreviewUrls() {
    return readProjectEvidenceEntries(DRAFT_EVIDENCE_KEY).then((entries) => {
        const urls = entries
            .map((entry) => {
                if (!entry || !(entry.blob instanceof Blob)) {
                    return "";
                }
                return URL.createObjectURL(entry.blob);
            })
            .filter(Boolean);
        setDraftEvidencePreviewUrls(urls);
        return urls;
    });
}

function preloadEvidencePreviewUrlsForProjects(projectIds) {
    const uniqueIds = Array.from(new Set((projectIds || []).filter(Boolean)));
    if (!uniqueIds.length) {
        return Promise.resolve();
    }

    return Promise.all(uniqueIds.map((projectId) => loadEvidencePreviewUrlsForProject(projectId))).then(() => {});
}

function deleteEvidenceForProjectIds(projectIds) {
    const uniqueIds = Array.from(new Set((projectIds || []).filter(Boolean)));
    if (!uniqueIds.length) {
        return Promise.resolve();
    }

    return Promise.all(uniqueIds.map((projectId) => deleteProjectEvidenceEntries(projectId))).then(() => {});
}

function collectData() {
    return {
        identity: {
            courseCode: value("courseCode").toUpperCase(),
            courseName: value("courseName"),
            academicYear: value("academicYear"),
            term: value("term"),
            projectType: value("projectType"),
            projectTitle: value("projectTitle"),
            projectTheme: value("projectTheme") || "tech"
        },
        hkuContext: {
            faculty: value("faculty"),
            department: value("department")
        },
        team: {
            role: value("role"),
            teamSize: value("teamSize")
        },
        contribution: {
            responsibilities: value("responsibilities")
        },
        technical: {
            tools: value("tools"),
            methods: value("methods")
        },
        narrative: {
            problemStatement: value("problemStatement"),
            objectives: value("objectives"),
            deliverables: value("deliverables"),
            challenges: value("challenges"),
            mitigation: value("mitigation"),
            results: value("results")
        },
        reflection: {
            lessons: value("lessons"),
            futureImprovements: value("futureImprovements")
        },
        evidence: getCurrentEvidenceWithCaptions(),
        meta: {
            generatedAt: new Date().toLocaleString()
        }
    };
}

function cloneProjectData(data) {
    if (typeof structuredClone === "function") {
        try {
            return structuredClone(data);
        } catch (error) {}
    }

    return JSON.parse(JSON.stringify(data || createEmptyData()));
}

function buildProjectRecord(data, existingId = "") {
    return {
        id: existingId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
        updatedAt: new Date().toISOString(),
        data: cloneProjectData(data)
    };
}

function setFormData(data) {
    evidenceSelectionTouched = false;
    byId("courseCode").value = data.identity.courseCode || "";
    byId("courseName").value = data.identity.courseName || "";
    byId("academicYear").value = data.identity.academicYear || "2025-26";
    byId("term").value = data.identity.term || "";
    byId("projectType").value = data.identity.projectType || "";
    byId("projectTitle").value = data.identity.projectTitle || "";
    byId("projectTheme").value = normalizeItemTheme(data.identity.projectTheme || "tech");

    byId("role").value = data.team.role || "";
    byId("teamSize").value = data.team.teamSize || "";
    byId("responsibilities").value = data.contribution.responsibilities || "";
    byId("tools").value = data.technical.tools || "";
    byId("methods").value = data.technical.methods || "";

    byId("problemStatement").value = data.narrative.problemStatement || "";
    byId("objectives").value = data.narrative.objectives || "";
    byId("deliverables").value = data.narrative.deliverables || "";
    byId("challenges").value = data.narrative.challenges || "";
    byId("mitigation").value = data.narrative.mitigation || "";
    byId("results").value = data.narrative.results || "";

    byId("lessons").value = data.reflection.lessons || "";
    byId("futureImprovements").value = data.reflection.futureImprovements || "";
    byId("faculty").value = data.hkuContext.faculty || "";
    byId("department").value = data.hkuContext.department || "";
    byId("faculty").dataset.inferenceSource = data.hkuContext.faculty ? "manual" : "";
    byId("department").dataset.inferenceSource = data.hkuContext.department ? "manual" : "";
    byId("faculty").classList.toggle("not-inferred", !byId("faculty").value.trim());
    byId("department").classList.toggle("not-inferred", !byId("department").value.trim());
    byId("faculty").placeholder = byId("faculty").value.trim()
        ? "Auto-detected from course code, or type manually"
        : HKU_CONTEXT_FALLBACK_PLACEHOLDER;
    byId("department").placeholder = byId("department").value.trim()
        ? "Auto-detected from course code, or type manually"
        : HKU_CONTEXT_FALLBACK_PLACEHOLDER;
    
    // Restore evidence captions
    currentEvidenceCaptions = {};
    if (Array.isArray(data.evidence)) {
        data.evidence.forEach(item => {
            if (typeof item === "object" && item.name) {
                currentEvidenceCaptions[item.name] = item.caption || "";
            } else if (typeof item === "string") {
                // Backwards compatibility: old format with just filenames
                currentEvidenceCaptions[item] = "";
            }
        });
    }
    
    updateInferenceNoteFromCourseCode(byId("courseCode").value);
    updateTeamFieldVisibility();
    syncAllCustomSelectUi();
    listEvidenceNames();
}

function updateTeamFieldVisibility() {
    const isGroup = value("projectType") === "Group Project";
    teamFields.classList.toggle("is-hidden", !isGroup);
    if (!isGroup) {
        byId("role").value = "";
        byId("teamSize").value = "";
    }
}

function clearFormFields() {
    evidenceSelectionTouched = false;
    form.reset();
    byId("faculty").value = "";
    byId("department").value = "";
    byId("faculty").dataset.inferenceSource = "";
    byId("department").dataset.inferenceSource = "";
    byId("faculty").placeholder = "Auto-detected from course code, or type manually";
    byId("department").placeholder = "Auto-detected from course code, or type manually";
    byId("faculty").classList.remove("not-inferred");
    byId("department").classList.remove("not-inferred");
    inferenceNote.classList.remove("warn");
    inferenceNote.textContent = "";
    evidenceList.innerHTML = "";
    evidenceCaptionsSection.style.display = "none";
    evidenceCaptions.innerHTML = "";
    currentEvidenceCaptions = {};
    draftEvidenceCaptions = {};
    syncAllCustomSelectUi();
    setDraftEvidencePreviewUrls([]);
    deleteProjectEvidenceEntries(DRAFT_EVIDENCE_KEY).catch(() => {});
}

function renderUndoDeleteState() {
    if (!undoDeleteBtn) {
        return;
    }

    const hasUndo = Boolean(lastDeletedProjectSnapshot && lastDeletedProjectSnapshot.project);
    undoDeleteBtn.classList.toggle("is-hidden", !hasUndo);
    undoDeleteBtn.setAttribute("aria-disabled", hasUndo ? "false" : "true");
}

function clearUndoDeleteState() {
    lastDeletedProjectSnapshot = null;
    renderUndoDeleteState();
}

function collectProfile() {
    return {
        name: (profileNameInput.value || "").trim(),
        email: (profileEmailInput.value || "").trim(),
        phone: (profilePhoneInput.value || "").trim(),
        link: (profileLinkInput.value || "").trim(),
        displayMode: (profileDisplayModeInput && profileDisplayModeInput.value) || "per-project",
        theme: (profileThemeSelect && profileThemeSelect.value) || "academic"
    };
}

function setProfileFields(profileData) {
    const safe = profileData || {};
    profileNameInput.value = safe.name || "";
    profileEmailInput.value = safe.email || "";
    profilePhoneInput.value = safe.phone || "";
    profileLinkInput.value = safe.link || "";
    if (profileThemeSelect) {
        profileThemeSelect.value = normalizeItemTheme(safe.theme || "academic");
    }
    if (profileDisplayModeInput) {
        profileDisplayModeInput.value = safe.displayMode || "per-project";
    }
    syncCustomSelectUiForSelect(profileThemeSelect);
    syncProfileDisplayToggle();
    profile = collectProfile();
}

function profileHtml(profileData, projectIndex = 1) {
    if (profileData.displayMode !== "per-project") {
        return "";
    }

    const parts = [];
    if (profileData.name) {
        parts.push("<strong>" + sanitize(profileData.name) + "</strong>");
    }
    if (profileData.email) {
        parts.push(sanitize(profileData.email));
    }
    if (profileData.phone) {
        parts.push(sanitize(profileData.phone));
    }
    if (profileData.link) {
        parts.push(sanitize(profileData.link));
    }

    if (!parts.length) {
        return "";
    }

    return "<aside class=\"profile-corner\">" + parts.join("<br>") + "</aside>";
}

function portfolioHeaderHtml(profileData) {
    if (!profileData || profileData.displayMode !== "top-once") {
        return "";
    }

    const lines = [];
    if (profileData.name) {
        lines.push("<p class=\"portfolio-header-name\">" + sanitize(profileData.name) + "</p>");
    }

    const details = [profileData.email, profileData.phone, profileData.link].filter(Boolean).map((item) => sanitize(item));
    if (details.length) {
        lines.push("<p class=\"portfolio-header-meta\">" + details.join(" | ") + "</p>");
    }

    if (!lines.length) {
        return "";
    }

    const headerTheme = normalizeItemTheme(profileData.theme || "academic");
    return (
        "<header class=\"portfolio-header\" data-item-theme=\"" +
        sanitize(headerTheme) +
        "\" style=\"" +
        sanitize(itemThemeStyle(headerTheme)) +
        "\">" +
        lines.join("") +
        "</header>"
    );
}

function buildPortfolioPreviewHtml(projectDataList) {
    const list = projectDataList || [];
    const header = portfolioHeaderHtml(profile);
    const skillsSummary = includeSkillsSummary ? buildSkillsSummaryHtml(list) : "";
    const sheets = list
        .map((projectRecord, index) => {
            const previewUrls = evidencePreviewUrlsByProjectId.get(projectRecord.id) || [];
            const evidenceData = Array.isArray(projectRecord.data.evidence) ? projectRecord.data.evidence : [];
            return buildProjectSheetHtml(projectRecord.data, index + 1, previewUrls, evidenceData);
        })
        .join("");
    return header + skillsSummary + sheets;
}

function setEditorOpen(open, modeHint = "") {
    editorOpen = open;
    editorCard.classList.toggle("is-hidden", !open);
    if (modeHint) {
        editorModeHint.textContent = modeHint;
    }
}

function projectCardTemplate(project, index) {
    const title = sanitize(project.data.identity.projectTitle || "Untitled Project");
    const code = sanitize(project.data.identity.courseCode || "NO-CODE");
    const name = sanitize(project.data.identity.courseName || "No course name");
    const updated = sanitize(new Date(project.updatedAt || Date.now()).toLocaleString());
    const activeClass = project.id === activeProjectId ? " active" : "";
    const menuLabel = sanitize("Open actions for " + (project.data.identity.projectTitle || project.data.identity.courseCode || "this project"));

    return (
        "<li class=\"project-item" +
        activeClass +
        "\" data-id=\"" +
        sanitize(project.id) +
        "\" draggable=\"true\" tabindex=\"0\" role=\"button\" aria-label=\"Preview project " +
        sanitize(String(index + 1)) +
        "\">" +
        "<div class=\"project-item-left\">" +
        "<span class=\"project-order-indicator\" aria-label=\"Order position\">" +
        sanitize(String(index + 1)) +
        "</span>" +
        "<div class=\"project-item-controls\">" +
        "<button type=\"button\" class=\"project-step-btn\" data-action=\"move-up\" aria-label=\"Move project up one position\" title=\"Move up\">&#9650;</button>" +
        "<button type=\"button\" class=\"drag-handle\" aria-label=\"Drag project to reorder\" title=\"Drag project to reorder\">" +
        "<span class=\"drag-bars\" aria-hidden=\"true\"><span></span><span></span><span></span></span>" +
        "</button>" +
        "<button type=\"button\" class=\"project-step-btn\" data-action=\"move-down\" aria-label=\"Move project down one position\" title=\"Move down\">&#9660;</button>" +
        "</div>" +
        "</div>" +
        "<div class=\"project-item-main\">" +
        "<p class=\"project-item-title\">" +
        code +
        " | " +
        title +
        "</p>" +
        "<p class=\"project-item-meta\">" +
        name +
        "<br>Updated: " +
        updated +
        "</p></div>" +
        "<details class=\"item-menu\"><summary aria-label=\"" +
        menuLabel +
        "\" title=\"" +
        menuLabel +
        "\">...</summary>" +
        "<div class=\"item-menu-panel\">" +
        "<button type=\"button\" data-action=\"edit\">Edit</button>" +
        "<button type=\"button\" data-action=\"save-preset\">Save as preset</button>" +
        "<button type=\"button\" data-action=\"duplicate\">Duplicate</button>" +
        "<button type=\"button\" data-action=\"delete\" class=\"delete-action\">Delete</button>" +
        "</div></details></li>"
    );
}

function renderProjectList() {
    noProjectsState.style.display = projects.length ? "none" : "block";
    projectList.innerHTML = projects.map((project, index) => projectCardTemplate(project, index)).join("");
}

function validate(data) {
    const missing = [];

    REQUIRED_FIELDS.forEach((field) => {
        if (!value(field.id)) {
            missing.push(field.label);
        }
    });

    if (data.identity.courseCode && !/^[A-Z]{4}[0-9]{4}$/.test(data.identity.courseCode)) {
        missing.push("Course code format must be 4 letters plus 4 digits");
    }

    if (Array.from(evidenceInput.files || []).some((file) => file.size > 5 * 1024 * 1024)) {
        missing.push("Each evidence file must be 5MB or below");
    }

    return missing;
}

function section(title, body, optional = false) {
    return (
        "<section class=\"summary-section" +
        (optional ? " optional" : "") +
        "\"><h3>" +
        sanitize(title) +
        "</h3><div class=\"summary-body\">" +
        body +
        "</div></section>"
    );
}

function hasText(text) {
    return Boolean((text || "").trim());
}

function formatMultiline(text) {
    return sanitize(text).replaceAll("\n", "<br>");
}

function formatField(label, text) {
    if (!hasText(text)) {
        return "";
    }
    return sanitize(label) + ":<br>" + formatMultiline(text);
}

function sectionFromFields(title, fields, optional = true) {
    const filled = fields.filter(Boolean);
    if (!filled.length) {
        return "";
    }
    return section(title, filled.join("<br><br>"), optional);
}

function evidenceImagesHtml(previewUrls, evidenceData = []) {
    if (!previewUrls || !previewUrls.length) {
        return "";
    }

    const gridClass = previewUrls.length === 1 ? "evidence-image-grid single-image" : "evidence-image-grid";

    const imageItems = previewUrls
        .map((url, index) => {
            const evidence = evidenceData && evidenceData[index];
            const caption = evidence && evidence.caption ? sanitize(evidence.caption) : "";
            const captionHtml = caption ? ("<figcaption class=\"evidence-caption\">" + caption + "</figcaption>") : "";
            return (
                "<figure class=\"evidence-figure\">" +
                "<img src=\"" +
                sanitize(url) +
                "\" alt=\"Evidence image " +
                sanitize(String(index + 1)) +
                (caption ? ": " + caption : "") +
                "\" loading=\"lazy\">" +
                captionHtml +
                "</figure>"
            );
        })
        .join("");

    return section("Evidence Images", "<div class=\"" + gridClass + "\">" + imageItems + "</div>", true);
}

function estimateContentLength(data) {
    return [
        data.narrative.problemStatement,
        data.narrative.objectives,
        data.narrative.deliverables,
        data.contribution.responsibilities,
        data.technical.tools,
        data.technical.methods,
        data.narrative.challenges,
        data.narrative.mitigation,
        data.narrative.results,
        data.reflection.lessons,
        data.reflection.futureImprovements
    ]
        .join(" ")
        .trim().length;
}

function estimateFieldWeight(text) {
    return hasText(text) ? text.replace(/\s+/g, " ").trim().length : 0;
}

function sectionBlock(title, fields, optional = true) {
    const html = sectionFromFields(title, fields, optional);
    if (!html) {
        return null;
    }

    const fieldWeight = fields.reduce((sum, text) => sum + estimateFieldWeight(text), 0);
    return {
        html,
        weight: estimateFieldWeight(title) * 2 + fieldWeight + (optional ? 10 : 0)
    };
}

function evidenceSectionWeight(previewUrls = [], evidenceData = []) {
    const captionWeight = evidenceData.reduce((sum, evidence) => sum + estimateFieldWeight(evidence && evidence.caption), 0);
    return 240 + previewUrls.length * 120 + captionWeight;
}

function buildProjectSheetHtml(data, index, evidencePreviewUrls = [], evidenceData = []) {
    const termLabel = [data.identity.academicYear, data.identity.term].filter(Boolean).join(" ");
    const identityMeta = [
        data.identity.courseCode,
        data.identity.courseName,
        termLabel,
        data.identity.projectType
    ]
        .filter(Boolean)
        .map((item) => sanitize(item))
        .join(" | ");

    const blocks = [
        sectionBlock(
            "HKU Context",
            [
                formatField("Faculty", data.hkuContext.faculty),
                formatField("Department", data.hkuContext.department)
            ],
            false
        ),
        sectionBlock(
            "Project Narrative",
            [
                formatField("Problem statement", data.narrative.problemStatement),
                formatField("Objectives", data.narrative.objectives),
                formatField("Deliverables", data.narrative.deliverables)
            ],
            true
        ),
        sectionBlock(
            "Personal Contribution",
            [
                formatField("Role in team", data.team.role),
                formatField("Team size", data.team.teamSize),
                formatField("Responsibilities", data.contribution.responsibilities)
            ],
            true
        ),
        sectionBlock(
            "Technical Implementation",
            [
                formatField("Tools and tech stack", data.technical.tools),
                formatField("Methods used", data.technical.methods)
            ],
            true
        ),
        sectionBlock(
            "Challenges and Outcomes",
            [
                formatField("Challenges faced", data.narrative.challenges),
                formatField("Mitigation strategy", data.narrative.mitigation),
                formatField("Result summary", data.narrative.results)
            ],
            true
        ),
        sectionBlock(
            "Reflection",
            [
                formatField("Lessons learned", data.reflection.lessons),
                formatField("Future improvements", data.reflection.futureImprovements)
            ],
            true
        )
    ].filter(Boolean);

    const evidenceImagesSection = evidenceImagesHtml(evidencePreviewUrls, evidenceData);
    if (evidenceImagesSection) {
        blocks.push({ html: evidenceImagesSection, weight: evidenceSectionWeight(evidencePreviewUrls, evidenceData) });
    }

    const leftColumnBlocks = [];
    const rightColumnBlocks = [];
    let leftColumnWeight = 0;
    let rightColumnWeight = 0;
    blocks.forEach((block) => {
        if (leftColumnWeight <= rightColumnWeight) {
            leftColumnBlocks.push(block.html);
            leftColumnWeight += block.weight;
            return;
        }

        rightColumnBlocks.push(block.html);
        rightColumnWeight += block.weight;
    });

    const likelyOnePage = estimateContentLength(data) <= 2600;
    const profileCorner = profileHtml(profile, index);
    const projectTheme = normalizeItemTheme(data.identity.projectTheme || "tech");

    return (
        "<article class=\"project-sheet" +
        (likelyOnePage ? "" : " compact-print") +
        "\" data-item-theme=\"" +
        sanitize(projectTheme) +
        "\" style=\"" +
        sanitize(itemThemeStyle(projectTheme)) +
        "\"><header class=\"summary-header\"><div class=\"summary-top\"><div><h3>" +
        sanitize(data.identity.projectTitle || "Untitled Project") +
        "</h3><p class=\"preview-meta\">" +
        (identityMeta || "Fill in project identity fields") +
        "</p></div>" +
        profileCorner +
        "</div></header><div class=\"print-grid\"><div class=\"print-col\">" +
        leftColumnBlocks.join("") +
        "</div><div class=\"print-col\">" +
        rightColumnBlocks.join("") +
        "</div></div></article>"
    );
}

function renderPreview() {
    const selectedProject = projects.find((project) => project.id === activeProjectId);

    if (selectedProject) {
        previewEl.innerHTML = buildPortfolioPreviewHtml([selectedProject]);
        printFitHint.textContent = "Previewing selected project. PDF export includes all saved projects in list order.";
        return;
    }

    if (editorOpen) {
        const draftRecord = { id: "__draft__", data: collectData() };
        const draftEvidenceData = Array.isArray(draftRecord.data.evidence) ? draftRecord.data.evidence : [];
        previewEl.innerHTML =
            portfolioHeaderHtml(profile) + buildProjectSheetHtml(draftRecord.data, 1, draftEvidencePreviewUrls, draftEvidenceData);
        printFitHint.textContent = "Previewing current draft project. Save it to include in exports.";
        return;
    }

    if (projects.length) {
        previewEl.innerHTML = buildPortfolioPreviewHtml(projects);
        printFitHint.textContent = "Showing all saved projects. Click a project card to edit that item.";
        return;
    }

    previewEl.innerHTML = "<p class=\"preview-meta\">No project selected. Click New Project to begin.</p>";
    printFitHint.textContent = "No projects yet.";
}

function renderAllProjectsForPrint() {
    if (!projects.length) {
        return;
    }

    const snapshot = {
        html: previewEl.innerHTML,
        hint: printFitHint.textContent
    };

    previewEl.classList.toggle("split-pages", splitPagesToggle.checked);
    previewEl.innerHTML = buildPortfolioPreviewHtml(projects);
    printFitHint.textContent = "Preparing multi-page print preview for " + projects.length + " project(s).";
    window.print();
    previewEl.innerHTML = snapshot.html;
    previewEl.classList.remove("split-pages");
    printFitHint.textContent = snapshot.hint;
}

function toTxt(data, profileData) {
    const headerLines = [
        "HKU COURSE PROJECT SUMMARY",
        "Generated: " + data.meta.generatedAt,
        "",
        "[PORTFOLIO HEADER - OPTIONAL]",
        "Name: " + (profileData.name || ""),
        "Email: " + (profileData.email || ""),
        "Phone: " + (profileData.phone || ""),
        "Contact Link: " + (profileData.link || ""),
        ""
    ];

    return [
        ...headerLines,
        "[PROJECT IDENTITY]",
        "Course Code: " + data.identity.courseCode,
        "Course Name: " + data.identity.courseName,
        "Academic Year: " + data.identity.academicYear,
        "Term: " + data.identity.term,
        "Project Type: " + data.identity.projectType,
        "Project Title: " + data.identity.projectTitle,
        "",
        "[HKU CONTEXT]",
        "Faculty: " + data.hkuContext.faculty,
        "Department: " + data.hkuContext.department,
        "",
        "[PROJECT NARRATIVE]",
        "Problem statement:",
        data.narrative.problemStatement,
        "",
        "Objectives:",
        data.narrative.objectives,
        "",
        "Deliverables:",
        data.narrative.deliverables,
        "",
        "[PERSONAL CONTRIBUTION]",
        "Role in team: " + data.team.role,
        "Team size: " + data.team.teamSize,
        "Responsibilities:",
        data.contribution.responsibilities,
        "",
        "[TECHNICAL DETAILS]",
        "Tools and tech stack: " + data.technical.tools,
        "Methods used:",
        data.technical.methods,
        "",
        "[CHALLENGES AND OUTCOMES]",
        "Challenges faced:",
        data.narrative.challenges,
        "",
        "Mitigation strategy:",
        data.narrative.mitigation,
        "",
        "Result summary:",
        data.narrative.results,
        "",
        "[REFLECTION - OPTIONAL]",
        "Lessons Learned:",
        data.reflection.lessons,
        "",
        "Future Improvements:",
        data.reflection.futureImprovements,
        "",
        "[EVIDENCE]",
        "Files: " + (data.evidence.length ? data.evidence.join(", ") : "No files selected")
    ].join("\n");
}

function toTxtAll(projectRecords) {
    const readable = projectRecords
        .map((project, index) => {
            return [
                "==============================",
                "PROJECT " + (index + 1),
                "==============================",
                toTxt(project.data, profile)
            ].join("\n");
        })
        .join("\n\n");

    const machine = JSON.stringify({ version: 1, profile, projects: projectRecords }, null, 2);
    return readable + "\n\n" + JSON_START + "\n" + machine + "\n" + JSON_END + "\n";
}

function safeZipPathPart(text, fallback = "item") {
    return String(text || fallback)
        .trim()
        .replace(/[\\/:*?"<>|]/g, "_")
        .replace(/\s+/g, "-")
        .slice(0, 90) || fallback;
}

async function exportZipBundle() {
    if (!window.JSZip) {
        throw new Error("ZIP support is unavailable in this browser session.");
    }

    const zip = new window.JSZip();
    const evidenceIndex = {};

    for (const project of projects) {
        const entries = await readProjectEvidenceEntries(project.id);
        if (!entries.length) {
            continue;
        }

        evidenceIndex[project.id] = [];
        const projectFolder = "evidence/" + safeZipPathPart(project.id, "project");

        entries.forEach((entry, index) => {
            if (!(entry.blob instanceof Blob)) {
                return;
            }

            const baseName = safeZipPathPart(entry.name || "image-" + String(index + 1), "image");
            const prefixedName = String(index + 1).padStart(2, "0") + "-" + baseName;
            const filePath = projectFolder + "/" + prefixedName;

            zip.file(filePath, entry.blob);
            evidenceIndex[project.id].push({
                path: filePath,
                name: entry.name || baseName,
                type: entry.type || entry.blob.type || "",
                lastModified: Number(entry.lastModified) || Date.now()
            });
        });
    }

    const manifest = {
        version: 2,
        exportedAt: new Date().toISOString(),
        profile,
        projects,
        sortMode,
        splitPages: Boolean(splitPagesToggle && splitPagesToggle.checked),
        evidenceIndex
    };

    zip.file("manifest.json", JSON.stringify(manifest, null, 2));
    zip.file("projects.txt", toTxtAll(projects));

    const blob = await zip.generateAsync({ type: "blob" });
    download("hku-project-collection.zip", blob, "application/zip");
}

function coerceImportedProjectRecords(rawProjects) {
    return (Array.isArray(rawProjects) ? rawProjects : [])
        .map((project) => {
            const safeData = project && project.data ? project.data : createEmptyData();
            return buildProjectRecord(safeData, project.id || "");
        })
        .filter(Boolean);
}

async function applyImportedZipBundle(zipFile) {
    if (!window.JSZip) {
        throw new Error("ZIP support is unavailable in this browser session.");
    }

    const zipData = await zipFile.arrayBuffer();
    const zip = await window.JSZip.loadAsync(zipData);
    const manifestFile = zip.file("manifest.json");
    if (!manifestFile) {
        throw new Error("Missing manifest.json in ZIP bundle.");
    }

    const manifestText = await manifestFile.async("string");
    const manifest = JSON.parse(manifestText || "{}");
    const importedProjects = coerceImportedProjectRecords(manifest.projects);
    if (!importedProjects.length) {
        throw new Error("No projects found in ZIP bundle.");
    }

    const priorProjectIds = projects.map((project) => project.id);
    await deleteEvidenceForProjectIds(priorProjectIds.concat([DRAFT_EVIDENCE_KEY]));

    const evidenceIndex = manifest && manifest.evidenceIndex ? manifest.evidenceIndex : {};
    for (const projectRecord of importedProjects) {
        const manifestEntries = Array.isArray(evidenceIndex[projectRecord.id]) ? evidenceIndex[projectRecord.id] : [];
        const entries = [];

        for (const manifestEntry of manifestEntries) {
            if (!manifestEntry || !manifestEntry.path) {
                continue;
            }

            const zipEvidenceFile = zip.file(manifestEntry.path);
            if (!zipEvidenceFile) {
                continue;
            }

            const blob = await zipEvidenceFile.async("blob");
            entries.push({
                name: manifestEntry.name || "image",
                type: manifestEntry.type || blob.type || "",
                lastModified: Number(manifestEntry.lastModified) || Date.now(),
                blob
            });
        }

        await writeProjectEvidenceEntries(projectRecord.id, entries);
    }

    projects = importedProjects;
    activeProjectId = "";
    clearAllEvidencePreviewUrls();
    clearFormFields();
    setEditorOpen(false);

    if (manifest.profile) {
        setProfileFields(manifest.profile);
    } else {
        setProfileFields({ name: "", email: "", phone: "", link: "", displayMode: "per-project", theme: "academic" });
    }

    setSortMode(manifest.sortMode || sortMode || "manual");
    if (splitPagesToggle) {
        splitPagesToggle.checked = Boolean(manifest.splitPages);
    }

    await preloadEvidencePreviewUrlsForProjects(projects.map((project) => project.id));

    applySortMode(sortMode, false);
    clearError();
    showStatus("Imported " + importedProjects.length + " project(s) from ZIP bundle.");
    schedulePersistSessionState();
}

function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function persistSessionState() {
    const snapshot = {
        version: 1,
        projects,
        activeProjectId,
        editorOpen,
        sortMode,
        splitPages: splitPagesToggle.checked,
        includeSkillsSummary,
        profile: collectProfile(),
        draft: editorOpen ? collectData() : createEmptyData()
    };
    safeSetLocalStorageItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
    lastSavedAt = Date.now();
    updateAutosaveHint();
    maybeCaptureAutoHistory();
}

function schedulePersistSessionState() {
    if (persistTimer) {
        clearTimeout(persistTimer);
    }
    persistTimer = setTimeout(() => {
        persistSessionState();
    }, 180);
}

async function autosaveActiveProjectEdit() {
    if (!editorOpen) {
        return;
    }

    if (!activeProjectId) {
        const draftData = collectData();
        const shouldCreateDraft =
            hasText(draftData.identity.courseCode) ||
            hasText(draftData.identity.projectTitle) ||
            hasText(draftData.identity.courseName);

        if (!shouldCreateDraft) {
            return;
        }

        const created = buildProjectRecord(draftData);
        projects.push(created);
        if (draftEvidencePreviewUrls.length) {
            replaceEvidencePreviewUrlsForProject(created.id, draftEvidencePreviewUrls);
            draftEvidencePreviewUrls = [];
        }
        await moveProjectEvidenceEntries(DRAFT_EVIDENCE_KEY, created.id);
        activeProjectId = created.id;
        applySortMode(sortMode, false);
        schedulePersistSessionState();
        return;
    }

    const projectIndex = projects.findIndex((project) => project.id === activeProjectId);
    if (projectIndex < 0) {
        return;
    }

    projects[projectIndex] = buildProjectRecord(collectData(), activeProjectId);
    if (evidenceSelectionTouched) {
        await saveEvidenceFilesForProject(activeProjectId, evidenceInput.files || []);
    }
    renderProjectList();
    renderPreview();
    schedulePersistSessionState();
}

function scheduleAutosaveActiveProjectEdit() {
    if (projectAutoSaveTimer) {
        clearTimeout(projectAutoSaveTimer);
    }

    projectAutoSaveTimer = setTimeout(() => {
        autosaveActiveProjectEdit().catch(() => {});
    }, 320);
}

function restoreSessionState() {
    const scopedRaw = safeGetLocalStorageItem(SESSION_STORAGE_KEY);
    const raw = scopedRaw || safeGetLocalStorageItem(LEGACY_SESSION_STORAGE_KEY);
    if (!raw) {
        if (includeSkillsToggle) {
            includeSkillsSummary = includeSkillsToggle.checked;
        }
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        if (!scopedRaw) {
            safeSetLocalStorageItem(SESSION_STORAGE_KEY, raw);
        }
        clearAllEvidencePreviewUrls();
        projects = Array.isArray(parsed.projects) ? parsed.projects : [];
        activeProjectId = parsed.activeProjectId || "";
        setSortMode(parsed.sortMode || "manual");
        splitPagesToggle.checked = Boolean(parsed.splitPages);
        includeSkillsSummary =
            typeof parsed.includeSkillsSummary === "boolean"
                ? parsed.includeSkillsSummary
                : includeSkillsToggle
                  ? includeSkillsToggle.checked
                  : true;
        if (includeSkillsToggle) {
            includeSkillsToggle.checked = includeSkillsSummary;
        }
        setProfileFields(parsed.profile || { name: "", email: "", phone: "", link: "", theme: "academic" });

        const activeProject = projects.find((project) => project.id === activeProjectId);
        if (activeProject) {
            setFormData(activeProject.data);
            setEditorOpen(Boolean(parsed.editorOpen), "Editing selected project.");
        } else if (parsed.editorOpen && parsed.draft) {
            setFormData(parsed.draft);
            setEditorOpen(true, "Restored unsaved draft after refresh.");
            activeProjectId = "";
        } else {
            clearFormFields();
            setEditorOpen(false);
            activeProjectId = "";
        }

        renderProjectList();
        applySortMode(sortMode, false);
        Promise.all([
            preloadEvidencePreviewUrlsForProjects(projects.map((project) => project.id)),
            loadDraftEvidencePreviewUrls()
        ])
            .then(() => {
                renderPreview();
                clearError();
                showStatus("Recovered previous session automatically.");
                lastAutoHistorySignature = historyStateSignature();
            })
            .catch(() => {
                renderPreview();
                clearError();
                showStatus("Recovered previous session automatically.");
                lastAutoHistorySignature = historyStateSignature();
            });
    } catch (error) {
        safeRemoveLocalStorageItem(SESSION_STORAGE_KEY);
        safeRemoveLocalStorageItem(LEGACY_SESSION_STORAGE_KEY);
    }
}

function runValidationOrShowErrors() {
    const data = collectData();
    const issues = validate(data);

    if (!issues.length) {
        clearError();
        return { valid: true, data };
    }

    showError("Please fix: " + issues.join("; "));
    return { valid: false, data };
}

function resetForm() {
    clearFormFields();
    activeProjectId = "";
    setEditorOpen(false);
    clearError();
    showStatus("Editor closed.");
    renderProjectList();
    renderPreview();
    schedulePersistSessionState();
}

async function saveOrUpdateProject() {
    const outcome = runValidationOrShowErrors();
    if (!outcome.valid) {
        return;
    }

    const existingIndex = projects.findIndex((project) => project.id === activeProjectId);
    if (existingIndex >= 0) {
        projects[existingIndex] = buildProjectRecord(outcome.data, activeProjectId);
        if (evidenceSelectionTouched) {
            await saveEvidenceFilesForProject(activeProjectId, evidenceInput.files || []);
        }
        setFormData(projects[existingIndex].data);
        setEditorOpen(true, "Editing selected project.");
        showStatus("Project updated in collection.");
    } else {
        const created = buildProjectRecord(outcome.data);
        projects.push(created);
        if (draftEvidencePreviewUrls.length) {
            replaceEvidencePreviewUrlsForProject(created.id, draftEvidencePreviewUrls);
            draftEvidencePreviewUrls = [];
        }
        await moveProjectEvidenceEntries(DRAFT_EVIDENCE_KEY, created.id);
        activeProjectId = created.id;
        setFormData(created.data);
        setEditorOpen(true, "Editing selected project.");
        showStatus("Project added to collection.");
    }

    evidenceSelectionTouched = false;
    setEditorOpen(false, "Create a new project or edit a selected one.");
    applySortMode(sortMode, false);
    schedulePersistSessionState();
}

async function persistActiveProjectBeforeSwitch(nextProjectId = "") {
    if (!editorOpen || !activeProjectId || activeProjectId === nextProjectId) {
        return;
    }

    const projectIndex = projects.findIndex((project) => project.id === activeProjectId);
    if (projectIndex < 0) {
        return;
    }

    projects[projectIndex] = buildProjectRecord(collectData(), activeProjectId);
    if (evidenceSelectionTouched) {
        await saveEvidenceFilesForProject(activeProjectId, evidenceInput.files || []);
    }
    evidenceSelectionTouched = false;
}

async function duplicateProjectById(projectId) {
    const source = projects.find((project) => project.id === projectId);
    if (!source) {
        return;
    }

    const cloneData = JSON.parse(JSON.stringify(source.data));
    cloneData.identity.projectTitle = (cloneData.identity.projectTitle || "Untitled Project") + " (Copy)";
    const duplicated = buildProjectRecord(cloneData);
    projects.push(duplicated);
    await copyProjectEvidenceEntries(projectId, duplicated.id);
    await loadEvidencePreviewUrlsForProject(duplicated.id);
    activeProjectId = duplicated.id;
    setFormData(duplicated.data);
    setEditorOpen(true, "Editing duplicated project.");
    applySortMode(sortMode, false);
    showStatus("Duplicated project. You can rename it before saving changes.");
    schedulePersistSessionState();
}

function moveProjectByStep(projectId, step) {
    const fromIndex = projects.findIndex((project) => project.id === projectId);
    if (fromIndex < 0) {
        return;
    }

    const toIndex = fromIndex + step;
    if (toIndex < 0 || toIndex >= projects.length) {
        showStatus("Cannot move further in that direction.");
        return;
    }

    if (sortMode !== "manual") {
        setSortMode("manual");
    }

    const [moved] = projects.splice(fromIndex, 1);
    projects.splice(toIndex, 0, moved);
    renderProjectList();
    renderPreview();
    showStatus(step < 0 ? "Project moved up." : "Project moved down.");
    schedulePersistSessionState();
}

function startNewProject() {
    activeProjectId = "";
    clearFormFields();
    setEditorOpen(true, "Creating a new project.");
    renderProjectList();
    renderPreview();
    clearError();
    showStatus("Started a new project draft.");
    schedulePersistSessionState();
    byId("courseCode").focus();
}

async function deleteDraftProject() {
    const shouldDelete = await openConfirmModal({
        title: "Delete Draft",
        message: "Delete this unsaved draft project?",
        confirmText: "Delete",
        destructive: true
    });
    if (!shouldDelete) {
        return;
    }

    clearFormFields();
    activeProjectId = "";
    setEditorOpen(false);
    renderProjectList();
    renderPreview();
    clearError();
    showStatus("Draft project deleted.");
    schedulePersistSessionState();
}

async function deleteProjectById(projectId) {
    const target = projects.find((project) => project.id === projectId);
    const label = target ? (target.data.identity.projectTitle || target.data.identity.courseCode || "this project") : "this project";
    const shouldDelete = await openConfirmModal({
        title: "Delete Project",
        message: "Delete " + label + "?",
        confirmText: "Delete",
        destructive: true
    });
    if (!shouldDelete) {
        return;
    }

    const deleteIndex = projects.findIndex((project) => project.id === projectId);
    if (deleteIndex < 0) {
        return;
    }

    lastDeletedProjectSnapshot = {
        project: projects[deleteIndex],
        index: deleteIndex,
        wasActive: activeProjectId === projectId,
        evidencePreviewUrls: (evidencePreviewUrlsByProjectId.get(projectId) || []).slice()
    };
    evidencePreviewUrlsByProjectId.delete(projectId);
    readProjectEvidenceEntries(projectId)
        .then((entries) => {
            if (lastDeletedProjectSnapshot && lastDeletedProjectSnapshot.project && lastDeletedProjectSnapshot.project.id === projectId) {
                lastDeletedProjectSnapshot.evidenceEntries = entries;
            }
        })
        .catch(() => {});
    renderUndoDeleteState();

    projects = projects.filter((project) => project.id !== projectId);
    if (activeProjectId === projectId) {
        activeProjectId = "";
        clearFormFields();
        setEditorOpen(false);
    }
    renderProjectList();
    renderPreview();
    clearError();
    showStatus("Project deleted from collection. You can undo this.");
    schedulePersistSessionState();
}

function undoDeleteProject() {
    if (!lastDeletedProjectSnapshot || !lastDeletedProjectSnapshot.project) {
        return;
    }

    const insertAt = Math.max(0, Math.min(lastDeletedProjectSnapshot.index, projects.length));
    projects.splice(insertAt, 0, lastDeletedProjectSnapshot.project);

    if (lastDeletedProjectSnapshot.wasActive) {
        activeProjectId = lastDeletedProjectSnapshot.project.id;
        setFormData(lastDeletedProjectSnapshot.project.data);
        setEditorOpen(true, "Editing restored project.");
    }

    if (lastDeletedProjectSnapshot.evidencePreviewUrls && lastDeletedProjectSnapshot.evidencePreviewUrls.length) {
        evidencePreviewUrlsByProjectId.set(
            lastDeletedProjectSnapshot.project.id,
            lastDeletedProjectSnapshot.evidencePreviewUrls.slice()
        );
    }

    if (Array.isArray(lastDeletedProjectSnapshot.evidenceEntries)) {
        writeProjectEvidenceEntries(lastDeletedProjectSnapshot.project.id, lastDeletedProjectSnapshot.evidenceEntries).catch(() => {});
    }

    clearUndoDeleteState();
    renderProjectList();
    renderPreview();
    showStatus("Delete undone.");
    schedulePersistSessionState();
}

function selectProjectById(projectId) {
    const focusProjectItem = () => {
        const targetItem = projectList.querySelector('.project-item[data-id="' + projectId + '"]');
        if (targetItem && typeof targetItem.focus === "function") {
            try {
                targetItem.focus({ preventScroll: true });
            } catch (error) {
                targetItem.focus();
            }
        }
    };

    const activateSelectedProject = () => {
        const project = projects.find((item) => item.id === projectId);
        if (!project) {
            return;
        }

        activeProjectId = projectId;
        evidenceSelectionTouched = false;
        setDraftEvidencePreviewUrls([]);
        setFormData(project.data);
        setEditorOpen(true, "Editing selected project.");
        loadEvidencePreviewUrlsForProject(projectId)
            .then(() => {
                if (activeProjectId === projectId) {
                    renderPreview();
                }
            })
            .catch(() => {});
        renderProjectList();
        focusProjectItem();
        renderPreview();
        schedulePersistSessionState();
    };

    persistActiveProjectBeforeSwitch(projectId)
        .then(activateSelectedProject)
        .catch(activateSelectedProject);
}

function moveProject(draggedId, targetId, placeAfter = false, announce = true, persist = true) {

    if (!draggedId || !targetId || draggedId === targetId) {
        return false;
    }

    const fromIndex = projects.findIndex((project) => project.id === draggedId);
    const toIndex = projects.findIndex((project) => project.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
        return false;
    }

    if (sortMode !== "manual") {
        setSortMode("manual");
    }

    let insertIndex = toIndex;
    if (fromIndex < toIndex) {
        insertIndex -= 1;
    }
    if (placeAfter) {
        insertIndex += 1;
    }
    insertIndex = Math.max(0, Math.min(insertIndex, projects.length - 1));

    if (insertIndex === fromIndex) {
        return false;
    }

    const [moved] = projects.splice(fromIndex, 1);
    projects.splice(insertIndex, 0, moved);
    renderProjectList();
    renderPreview();
    clearError();
    if (announce) {
        showStatus("Project order updated.");
    }
    if (persist) {
        schedulePersistSessionState();
    }
    return true;
}

byId("courseCode").addEventListener("input", (event) => {
    inferFromCourseCode(event.target.value);
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

byId("faculty").addEventListener("input", (event) => {
    markHkuContextFieldManual(event.target);
    updateInferenceNoteFromCourseCode(byId("courseCode").value);
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

byId("department").addEventListener("input", (event) => {
    markHkuContextFieldManual(event.target);
    updateInferenceNoteFromCourseCode(byId("courseCode").value);
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

byId("projectType").addEventListener("change", () => {
    updateTeamFieldVisibility();
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

form.addEventListener("input", () => {
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

evidenceInput.addEventListener("change", () => {
    evidenceSelectionTouched = true;
    listEvidenceNames();
    const nextPreviewUrls = buildEvidencePreviewUrls(evidenceInput.files || []);
    if (activeProjectId) {
        replaceEvidencePreviewUrlsForProject(activeProjectId, nextPreviewUrls);
        saveEvidenceFilesForProject(activeProjectId, evidenceInput.files || []).catch(() => {});
    } else {
        setDraftEvidencePreviewUrls(nextPreviewUrls);
        saveEvidenceFilesForProject(DRAFT_EVIDENCE_KEY, evidenceInput.files || []).catch(() => {});
    }
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

byId("newProject").addEventListener("click", startNewProject);
byId("saveProject").addEventListener("click", () => {
    saveOrUpdateProject().catch(() => {
        showError("Could not save project right now. Please try again.");
    });
});
byId("cancelEdit").addEventListener("click", resetForm);
if (undoDeleteBtn) {
    undoDeleteBtn.addEventListener("click", undoDeleteProject);
}
byId("resetForm").addEventListener("click", () => {
    clearFormFields();
    if (editorOpen) {
        renderPreview();
    }
    showStatus("Editor fields reset.");
    schedulePersistSessionState();
});

[profileNameInput, profileEmailInput, profilePhoneInput, profileLinkInput, profileThemeSelect].forEach((input) => {
    input.addEventListener("input", () => {
        profile = collectProfile();
        renderPreview();
        schedulePersistSessionState();
    });
});

if (profileDisplayToggle && profileDisplayModeInput) {
    profileDisplayToggle.addEventListener("click", (event) => {
        const modeButton = event.target.closest(".mode-segment-btn");
        if (!modeButton) {
            return;
        }

        const nextMode = modeButton.getAttribute("data-mode");
        if (!nextMode || profileDisplayModeInput.value === nextMode) {
            return;
        }

        profileDisplayModeInput.value = nextMode;
        syncProfileDisplayToggle();
        profile = collectProfile();
        renderPreview();
        schedulePersistSessionState();
    });
}

const statusMessageClose = document.getElementById("statusMessageClose");
if (statusMessageClose) {
    statusMessageClose.addEventListener("click", () => {
        showStatus("");
    });
}

if (historyToggle) {
    historyToggle.addEventListener("click", openHistoryModal);
}

if (historyClose) {
    historyClose.addEventListener("click", closeHistoryModal);
}

if (historyDeleteAll) {
    historyDeleteAll.addEventListener("click", () => {
        deleteAllHistorySnapshots().catch(() => {
            showError("Could not delete autosave history right now.");
        });
    });
}

if (historyCloseIcon) {
    historyCloseIcon.addEventListener("click", closeHistoryModal);
}

if (historyModal) {
    historyModal.addEventListener("click", (event) => {
        event.stopPropagation();
        if (event.target === historyModal) {
            closeHistoryModal();
            return;
        }

        const actionBtn = event.target.closest("[data-history-action]");
        if (!actionBtn) {
            return;
        }

        const snapshotId = actionBtn.getAttribute("data-id") || "";
        const action = actionBtn.getAttribute("data-history-action") || "";
        if (action === "restore") {
            restoreHistorySnapshotById(snapshotId).catch(() => {
                showError("Could not restore that snapshot right now.");
            });
            return;
        }

        if (action === "delete") {
            deleteHistorySnapshotById(snapshotId);
        }
    });
}

if (presetPickerClose) {
    presetPickerClose.addEventListener("click", closePresetPickerModal);
}

if (presetPickerCloseIcon) {
    presetPickerCloseIcon.addEventListener("click", closePresetPickerModal);
}

if (presetPickerModal) {
    presetPickerModal.addEventListener("click", (event) => {
        event.stopPropagation();
        if (event.target === presetPickerModal) {
            closePresetPickerModal();
            return;
        }

        const actionBtn = event.target.closest("[data-preset-action]");
        if (!actionBtn) {
            return;
        }

        const presetId = actionBtn.getAttribute("data-id") || "";
        const action = actionBtn.getAttribute("data-preset-action") || "";
        if (action === "apply") {
            applyPresetByIdToCurrentProject(presetId);
            closePresetPickerModal();
        }
    });
}

if (presetSaveCancel) {
    presetSaveCancel.addEventListener("click", closePresetSaveModal);
}

if (presetSaveCloseIcon) {
    presetSaveCloseIcon.addEventListener("click", closePresetSaveModal);
}

if (presetSaveModal) {
    presetSaveModal.addEventListener("click", (event) => {
        event.stopPropagation();
        if (event.target === presetSaveModal) {
            closePresetSaveModal();
        }
    });
}

if (confirmModalCancel) {
    confirmModalCancel.addEventListener("click", () => {
        closeConfirmModal(false);
    });
}

if (confirmModalCloseIcon) {
    confirmModalCloseIcon.addEventListener("click", () => {
        closeConfirmModal(false);
    });
}

if (confirmModalConfirm) {
    confirmModalConfirm.addEventListener("click", () => {
        closeConfirmModal(true);
    });
}

if (confirmModal) {
    confirmModal.addEventListener("click", (event) => {
        event.stopPropagation();
        if (event.target === confirmModal) {
            closeConfirmModal(false);
        }
    });
}

if (presetSaveNameInput) {
    presetSaveNameInput.addEventListener("input", () => {
        pendingPresetOverwriteId = "";
        if (presetSaveWarning) {
            presetSaveWarning.textContent = "";
            presetSaveWarning.classList.add("is-hidden");
        }
        if (presetSaveConfirm) {
            presetSaveConfirm.textContent = "Save preset";
        }
    });
}

if (presetSaveForm) {
    presetSaveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = String((presetSaveNameInput && presetSaveNameInput.value) || "").trim();
        if (!name) {
            if (presetSaveWarning) {
                presetSaveWarning.textContent = "Preset name cannot be empty.";
                presetSaveWarning.classList.remove("is-hidden");
            }
            if (presetSaveNameInput) {
                presetSaveNameInput.focus();
            }
            return;
        }

        const saveResult = savePresetByName(
            pendingPresetProjectId,
            name,
            Boolean(pendingPresetOverwriteId)
        );

        if (saveResult.status === "needs-overwrite") {
            pendingPresetOverwriteId = saveResult.existingId || "";
            if (presetSaveWarning) {
                presetSaveWarning.textContent = "Preset name exists. Submit again to overwrite it.";
                presetSaveWarning.classList.remove("is-hidden");
            }
            if (presetSaveConfirm) {
                presetSaveConfirm.textContent = "Overwrite preset";
            }
            return;
        }

        if (saveResult.status === "error") {
            return;
        }

        closePresetSaveModal();
    });
}

if (editorMenu) {
    editorMenu.addEventListener("click", (event) => {
        const actionBtn = event.target.closest("[data-editor-action]");
        if (!actionBtn) {
            return;
        }

        const action = actionBtn.getAttribute("data-editor-action");
        if (action === "apply-preset") {
            applyPresetToCurrentProject();
        }
        if (action === "save-preset") {
            if (!activeProjectId) {
                showError("Select a project first before saving a preset.");
            } else {
                saveProjectAsPreset(activeProjectId);
            }
        }
        if (action === "duplicate") {
            if (!activeProjectId) {
                showError("Select a project first before duplicating.");
            } else {
                duplicateProjectById(activeProjectId)
                    .then(() => {
                        clearError();
                    })
                    .catch(() => {
                        showError("Could not duplicate project.");
                    });
            }
        }
        if (action === "delete-project") {
            if (!activeProjectId) {
                if (editorOpen) {
                    deleteDraftProject().catch(() => {
                        showError("Could not delete draft project.");
                    });
                } else {
                    showError("Select a project first before deleting.");
                }
            } else {
                deleteProjectById(activeProjectId);
            }
        }

        editorMenu.removeAttribute("open");
    });
}

splitPagesToggle.addEventListener("change", schedulePersistSessionState);

if (includeSkillsToggle) {
    includeSkillsToggle.addEventListener("change", () => {
        includeSkillsSummary = includeSkillsToggle.checked;
        renderPreview();
        schedulePersistSessionState();
    });
}

if (sortProjectsSelect) {
    sortProjectsSelect.addEventListener("change", () => {
        applySortMode(sortProjectsSelect.value);
        schedulePersistSessionState();
    });
}

if (importBundleZipBtn && importZipInput) {
    importBundleZipBtn.addEventListener("click", () => {
        importZipInput.value = "";
        importZipInput.click();
    });
}

projectList.addEventListener("click", (event) => {
    event.stopPropagation();

    if (event.target.closest(".drag-handle")) {
        return;
    }

    const menuButton = event.target.closest("[data-action]");
    if (menuButton) {
        const item = menuButton.closest(".project-item");
        if (!item) {
            return;
        }
        const projectId = item.getAttribute("data-id");
        if (menuButton.getAttribute("data-action") === "edit") {
            selectProjectById(projectId);
            clearError();
            showStatus("Loaded project for editing.");
        }
        if (menuButton.getAttribute("data-action") === "save-preset") {
            saveProjectAsPreset(projectId);
        }
        if (menuButton.getAttribute("data-action") === "delete") {
            deleteProjectById(projectId);
        }
        if (menuButton.getAttribute("data-action") === "duplicate") {
            duplicateProjectById(projectId)
                .then(() => {
                    clearError();
                })
                .catch(() => {
                    showError("Could not duplicate project.");
                });
        }
        if (menuButton.getAttribute("data-action") === "move-up") {
            moveProjectByStep(projectId, -1);
            clearError();
        }
        if (menuButton.getAttribute("data-action") === "move-down") {
            moveProjectByStep(projectId, 1);
            clearError();
        }
        const parentDetails = menuButton.closest("details");
        if (parentDetails) {
            parentDetails.removeAttribute("open");
        }
        event.stopPropagation();
        return;
    }

    const menuArea = event.target.closest(".item-menu");
    if (menuArea) {
        // Keep card selection logic from rerendering while user is opening/using the 3-dot menu.
        event.stopPropagation();
        return;
    }

    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }
    const projectId = item.getAttribute("data-id");
    if (projectId === activeProjectId && editorOpen) {
        closeEditorKeepSelection(true);
        return;
    }
    selectProjectById(projectId);
    clearError();
    showStatus("Loaded project for editing.");
});

projectList.addEventListener("keydown", (event) => {
    event.stopPropagation();

    if (event.target.closest("button, summary, a, input, select, textarea")) {
        return;
    }

    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const items = Array.from(projectList.querySelectorAll(".project-item"));
        const currentIndex = items.indexOf(item);
        if (currentIndex < 0) {
            return;
        }

        const nextIndex = event.key === "ArrowDown" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < items.length) {
            event.preventDefault();
            const nextItem = items[nextIndex];
            if (nextItem && typeof nextItem.focus === "function") {
                nextItem.focus();
            }
        }
        // At boundaries, do not prevent default so normal page scrolling still works.
        return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
        return;
    }

    event.preventDefault();
    const projectId = item.getAttribute("data-id");
    if (projectId === activeProjectId && editorOpen) {
        closeEditorKeepSelection(true);
        return;
    }
    selectProjectById(projectId);
    clearError();
    showStatus("Loaded project for editing.");
});

document.addEventListener("click", (event) => {
    if (!editorOpen) {
        return;
    }

    if (event.target.closest("#presetPickerModal") || event.target.closest("#historyModal") || event.target.closest("#presetSaveModal") || event.target.closest("#confirmModal")) {
        return;
    }

    if (event.target.closest("#editorCard")) {
        return;
    }

    if (event.target.closest("#projectList")) {
        return;
    }

    if (event.target.closest("#newProject")) {
        return;
    }

    closeEditorKeepSelection(true);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    if (presetSaveModal && !presetSaveModal.classList.contains("is-hidden")) {
        closePresetSaveModal();
        return;
    }

    if (confirmModal && !confirmModal.classList.contains("is-hidden")) {
        closeConfirmModal(false);
        return;
    }

    if (presetPickerModal && !presetPickerModal.classList.contains("is-hidden")) {
        closePresetPickerModal();
        return;
    }

    if (historyModal && !historyModal.classList.contains("is-hidden")) {
        closeHistoryModal();
        return;
    }

    document.querySelectorAll(".item-menu[open], .site-switcher[open]").forEach((detailsEl) => {
        detailsEl.removeAttribute("open");
        const summary = detailsEl.querySelector("summary");
        if (summary && typeof summary.focus === "function") {
            summary.focus();
        }
    });
});

projectList.addEventListener("dragstart", (event) => {
    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }

    const projectId = item.getAttribute("data-id") || "";
    if (!projectId || dragHandleProjectId !== projectId) {
        event.preventDefault();
        return;
    }

    draggingProjectId = item.getAttribute("data-id") || "";
    dragOrderDirty = false;
    item.classList.add("dragging");
    item.setAttribute("aria-grabbed", "true");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggingProjectId);
});

function clearProjectDragState() {
    draggingProjectId = "";
    dragHandleProjectId = "";
    dragOrderDirty = false;
    projectList.querySelectorAll(".project-item.dragging").forEach((item) => {
        item.classList.remove("dragging");
        item.removeAttribute("aria-grabbed");
    });
}

projectList.addEventListener("dragover", (event) => {
    const item = event.target.closest(".project-item");
    if (!item || !draggingProjectId) {
        return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const targetId = item.getAttribute("data-id") || "";
    if (!targetId || targetId === draggingProjectId) {
        return;
    }

    const rect = item.getBoundingClientRect();
    const placeAfter = event.clientY > rect.top + rect.height / 2;
    const didMove = moveProject(draggingProjectId, targetId, placeAfter, false, false);

    if (didMove) {
        dragOrderDirty = true;
        const draggedItem = projectList.querySelector('.project-item[data-id="' + draggingProjectId + '"]');
        if (draggedItem) {
            draggedItem.classList.add("dragging");
            draggedItem.setAttribute("aria-grabbed", "true");
        }
    }
});

projectList.addEventListener("drop", (event) => {
    const item = event.target.closest(".project-item");
    if (!item || !draggingProjectId) {
        clearProjectDragState();
        return;
    }
    event.preventDefault();
    if (dragOrderDirty) {
        showStatus("Project order updated.");
        schedulePersistSessionState();
    }
    clearProjectDragState();
});

projectList.addEventListener("dragend", () => {
    clearProjectDragState();
});

document.addEventListener("drop", () => {
    if (draggingProjectId) {
        clearProjectDragState();
    }
});

document.addEventListener("dragend", () => {
    if (draggingProjectId) {
        clearProjectDragState();
    }
});

projectList.addEventListener("mousedown", (event) => {
    const handle = event.target.closest(".drag-handle");
    if (!handle) {
        return;
    }
    const item = handle.closest(".project-item");
    dragHandleProjectId = item ? (item.getAttribute("data-id") || "") : "";
});

projectList.addEventListener("mouseup", () => {
    if (!draggingProjectId) {
        dragHandleProjectId = "";
    }
});

byId("exportPdf").addEventListener("click", () => {
    if (!projects.length) {
        showError("No saved projects to export. Create and save at least one project first.");
        return;
    }

    clearError();
    showStatus("Opening print dialog for all saved projects...");
    renderAllProjectsForPrint();
});

if (exportBundleZipBtn) {
    exportBundleZipBtn.addEventListener("click", async () => {
        if (!projects.length) {
            showError("No saved projects to export. Create and save at least one project first.");
            return;
        }

        clearError();
        showStatus("Preparing ZIP bundle...");
        try {
            await exportZipBundle();
            showStatus("Exported ZIP bundle with projects and evidence images.");
        } catch (error) {
            showError("ZIP export failed. " + (error && error.message ? error.message : ""));
        }
    });
}

if (importZipInput) {
    importZipInput.addEventListener("change", async () => {
        const file = importZipInput.files && importZipInput.files[0];
        if (!file) {
            return;
        }

        if (projects.length) {
            const shouldOverwrite = await openConfirmModal({
                title: "Import Bundle",
                message: "This will overwrite your current projects. Continue?",
                confirmText: "Import and overwrite"
            });
            if (!shouldOverwrite) {
                importZipInput.value = "";
                return;
            }
        }

        clearError();
        showStatus("Importing ZIP bundle...");
        try {
            await applyImportedZipBundle(file);
        } catch (error) {
            showError("ZIP import failed. " + (error && error.message ? error.message : "Invalid ZIP format."));
        }
    });
}

window.addEventListener("beforeunload", persistSessionState);

window.addEventListener("resize", updateHeaderOffset);

setEditorOpen(false);
setupCustomSelects();
setProfileFields({ name: "", email: "", phone: "", link: "", theme: "academic" });
updateTeamFieldVisibility();
initializeTheme();
setupAutoHideTopbar();
loadProjectPresets();
loadVersionHistory();
renderHistoryList();
restoreSessionState();
if (!projects.length && !editorOpen) {
    renderProjectList();
    renderPreview();
}
renderUndoDeleteState();
startAutosaveTicker();
setupWelcomeModal();
updateHeaderOffset();
