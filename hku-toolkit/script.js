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
const SESSION_STORAGE_KEY = "hkuProjectToolSessionV1";
const WELCOME_STORAGE_KEY = "hkuProjectToolWelcomeSeenV1";
const PROJECT_PRESETS_STORAGE_KEY = "hkuProjectToolProjectPresetsV1";
const VERSION_HISTORY_STORAGE_KEY = "hkuProjectToolVersionHistoryV1";
const VERSION_HISTORY_LIMIT = 20;
const AUTO_HISTORY_INTERVAL_MS = 3 * 60 * 1000;
const EVIDENCE_DB_NAME = "hkuToolkitEvidenceV1";
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
const historyCloseIcon = document.getElementById("historyCloseIcon");
const historyList = document.getElementById("historyList");
const presetPickerModal = document.getElementById("presetPickerModal");
const presetPickerClose = document.getElementById("presetPickerClose");
const presetPickerCloseIcon = document.getElementById("presetPickerCloseIcon");
const presetPickerList = document.getElementById("presetPickerList");
const editorMenu = document.querySelector(".editor-menu");

let projects = [];
let activeProjectId = "";
let draggingProjectId = "";
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
        "--item-strong": "#3f3f3f",
        "--item-muted": "#555555",
        "--item-line-soft": "#cfcfcf",
        "--item-line-soft-2": "#e2e2e2",
        "--item-surface-soft-2": "#f7f7f7"
    },
    print: {
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
    try {
        seen = localStorage.getItem(WELCOME_STORAGE_KEY) || "";
    } catch (error) {
        seen = "";
    }

    const dismiss = () => {
        welcomeModal.classList.add("is-hidden");
        try {
            localStorage.setItem(WELCOME_STORAGE_KEY, "1");
        } catch (error) {}
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

function inferFromCourseCode(codeRaw) {
    const code = (codeRaw || "").trim().toUpperCase();
    const prefix = code.slice(0, 4);
    const matched = PREFIX_MAP[prefix];

    if (matched) {
        byId("faculty").value = matched.faculty;
        byId("department").value = matched.department;
        byId("faculty").classList.remove("not-inferred");
        byId("department").classList.remove("not-inferred");
        inferenceNote.classList.remove("warn");
        inferenceNote.textContent = "HKU inference found from course prefix " + prefix + ".";
        return;
    }

    byId("faculty").value = "Not inferred";
    byId("department").value = "Not inferred";
    byId("faculty").classList.add("not-inferred");
    byId("department").classList.add("not-inferred");
    inferenceNote.classList.add("warn");
    inferenceNote.textContent = prefix ? "No local mapping for prefix " + prefix + ". You can still continue." : "";
}

function buildEvidenceCaptionsUI(files) {
    if (!files || !files.length) {
        evidenceCaptionsSection.style.display = "none";
        evidenceCaptions.innerHTML = "";
        return;
    }
    
    const captions = activeProjectId ? currentEvidenceCaptions : draftEvidenceCaptions;
    const items = Array.from(files)
        .filter(file => isImageFile(file))
        .map(file => {
            const caption = captions[file.name] || "";
            return (
                "<div class=\"caption-input-group\">" +
                "<label style=\"font-size: 0.9em; margin-bottom: 0.3rem; display: block; font-weight: 500;\">" +
                sanitize(file.name) +
                "</label>" +
                "<input type=\"text\" class=\"caption-input\" data-filename=\"" + sanitize(file.name) + "\"" +
                " placeholder=\"e.g., 'Final UI mockup' or 'Test results screenshot'\" value=\"" + sanitize(caption) + "\" />" +
                "</div>"
            );
        })
        .join("");
    
    evidenceCaptions.innerHTML = items;
    evidenceCaptionsSection.style.display = items ? "block" : "none";
    
    // Wire up caption updates
    document.querySelectorAll(".caption-input").forEach(input => {
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

function listEvidenceNames() {
    evidenceList.innerHTML = "";
    const files = Array.from(evidenceInput.files || []);
    files.forEach((file) => {
        const li = document.createElement("li");
        li.textContent = file.name + " (" + Math.round(file.size / 1024) + " KB)";
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
    const files = Array.from(evidenceInput.files || []).map((f) => f.name);
    const captions = activeProjectId ? currentEvidenceCaptions : draftEvidenceCaptions;
    
    return files.map(filename => ({
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
    const skillCounts = {};
    
    allProjects.forEach(projectRecord => {
        const skills = extractSkillsFromProject(projectRecord.data);
        Object.entries(skills).forEach(([category, keywords]) => {
            if (!skillCounts[category]) skillCounts[category] = {};
            keywords.forEach(skill => {
                skillCounts[category][skill] = (skillCounts[category][skill] || 0) + 1;
            });
        });
    });
    
    if (Object.keys(skillCounts).length === 0) return "";
    
    const sections = Object.entries(skillCounts).map(([category, skills]) => {
        const items = Object.entries(skills)
            .sort((a, b) => b[1] - a[1])
            .map(([skill, count]) => {
                const badge = count > 1 ? "<span class=\"skill-badge\" title=\"Used in " + count + " project(s)\">" + count + "</span>" : "";
                return "<li>" + sanitize(skill) + badge + "</li>";
            })
            .join("");
        return "<h4>" + sanitize(category) + "</h4><ul class=\"skills-list\">" + items + "</ul>";
    }).join("");
    
    return section("Skills Summary", sections, true);
}

function normalizeItemTheme(themeName) {
    const normalized = String(themeName || "").trim().toLowerCase();
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
        const raw = localStorage.getItem(key);
        if (!raw) {
            return fallbackValue;
        }
        return JSON.parse(raw);
    } catch (error) {
        return fallbackValue;
    }
}

function formatDateTimeLabel(isoString) {
    const date = new Date(isoString || Date.now());
    if (Number.isNaN(date.getTime())) {
        return "Unknown time";
    }
    return date.toLocaleString();
}

function persistProjectPresets() {
    localStorage.setItem(PROJECT_PRESETS_STORAGE_KEY, JSON.stringify(projectPresets));
}

function loadProjectPresets() {
    const parsed = safeParseLocalStorage(PROJECT_PRESETS_STORAGE_KEY, []);
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

function saveProjectAsPreset(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
        showError("Could not find this project to save as preset.");
        return;
    }

    const suggestedName = project.data.identity.projectTitle || project.data.identity.courseCode || "Project preset";
    const providedName = window.prompt("Preset name", suggestedName);
    if (providedName === null) {
        return;
    }

    const name = String(providedName).trim();
    if (!name) {
        showError("Preset name cannot be empty.");
        return;
    }

    const fields = createNonEmptyPatch(project.data) || {};
    if (!Object.keys(fields).length) {
        showError("This project has no non-empty fields to save.");
        return;
    }

    const existing = projectPresets.find((preset) => preset.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        if (!window.confirm("Preset name exists. Overwrite it?")) {
            return;
        }
        existing.fields = fields;
        existing.updatedAt = new Date().toISOString();
        persistProjectPresets();
        renderPresetPickerList();
        clearError();
        showStatus("Updated preset: " + existing.name + ".");
        return;
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
}

function applyPresetToCurrentProject() {
    if (!editorOpen) {
        showError("Open a project editor first to apply a preset.");
        return;
    }

    openPresetPickerModal();
}

function persistVersionHistory() {
    localStorage.setItem(VERSION_HISTORY_STORAGE_KEY, JSON.stringify(versionHistory));
}

function loadVersionHistory() {
    const parsed = safeParseLocalStorage(VERSION_HISTORY_STORAGE_KEY, []);
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
                "<button type=\"button\" data-history-action=\"delete\" data-id=\"" + sanitize(entry.id) + "\">Delete</button>" +
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

    if (!window.confirm("Restore this autosave snapshot? Current unsaved state will be replaced.")) {
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

function deleteHistorySnapshotById(snapshotId) {
    const entry = versionHistory.find((item) => item.id === snapshotId);
    if (!entry) {
        showError("Snapshot not found.");
        return;
    }

    if (!window.confirm("Delete this autosave snapshot?")) {
        return;
    }

    versionHistory = versionHistory.filter((item) => item.id !== snapshotId);
    persistVersionHistory();
    renderHistoryList();
    clearError();
    showStatus("Deleted autosave snapshot.");
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
        const urls = entries
            .map((entry) => {
                if (!entry || !(entry.blob instanceof Blob)) {
                    return "";
                }
                return URL.createObjectURL(entry.blob);
            })
            .filter(Boolean);
        replaceEvidencePreviewUrlsForProject(projectId, urls);
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

function buildProjectRecord(data, existingId = "") {
    return {
        id: existingId || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
        updatedAt: new Date().toISOString(),
        data
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
    
    inferFromCourseCode(byId("courseCode").value);
    updateTeamFieldVisibility();
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
    byId("faculty").classList.remove("not-inferred");
    byId("department").classList.remove("not-inferred");
    inferenceNote.classList.remove("warn");
    inferenceNote.textContent = "";
    evidenceList.innerHTML = "";
    evidenceCaptionsSection.style.display = "none";
    evidenceCaptions.innerHTML = "";
    currentEvidenceCaptions = {};
    draftEvidenceCaptions = {};
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
        "<button type=\"button\" class=\"drag-handle\" aria-label=\"Drag project to reorder\" title=\"Drag project to reorder\">drag</button>" +
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
        "<br>Order: " +
        sanitize(String(index + 1)) +
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
        "<button type=\"button\" data-action=\"move-up\">Move up</button>" +
        "<button type=\"button\" data-action=\"move-down\">Move down</button>" +
        "<button type=\"button\" data-action=\"delete\">Delete</button>" +
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

    return section("Evidence Images", "<div class=\"evidence-image-grid\">" + imageItems + "</div>", true);
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
        sectionFromFields(
            "HKU Context",
            [
                formatField("Faculty", data.hkuContext.faculty),
                formatField("Department", data.hkuContext.department)
            ],
            false
        ),
        sectionFromFields(
            "Project Overview",
            [
                formatField("Problem statement", data.narrative.problemStatement),
                formatField("Objectives", data.narrative.objectives),
                formatField("Deliverables", data.narrative.deliverables)
            ],
            true
        ),
        sectionFromFields(
            "Personal Contribution",
            [
                formatField("Role", data.team.role),
                formatField("Team size", data.team.teamSize),
                formatField("Responsibilities", data.contribution.responsibilities)
            ],
            true
        ),
        sectionFromFields(
            "Technical Implementation",
            [
                formatField("Tools and stack", data.technical.tools),
                formatField("Methods used", data.technical.methods)
            ],
            true
        ),
        sectionFromFields(
            "Challenges and Outcomes",
            [
                formatField("Challenges faced", data.narrative.challenges),
                formatField("Mitigation", data.narrative.mitigation),
                formatField("Result summary", data.narrative.results)
            ],
            true
        ),
        sectionFromFields(
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
        blocks.push(evidenceImagesSection);
    }

    const leftColumnBlocks = [];
    const rightColumnBlocks = [];
    blocks.forEach((block, blockIndex) => {
        if (blockIndex % 2 === 0) {
            leftColumnBlocks.push(block);
        } else {
            rightColumnBlocks.push(block);
        }
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
        "[PROJECT OVERVIEW]",
        "Problem Statement:",
        data.narrative.problemStatement,
        "",
        "Objectives:",
        data.narrative.objectives,
        "",
        "Deliverables:",
        data.narrative.deliverables,
        "",
        "[PERSONAL CONTRIBUTION]",
        "Role: " + data.team.role,
        "Team Size: " + data.team.teamSize,
        "Responsibilities:",
        data.contribution.responsibilities,
        "",
        "[TECHNICAL DETAILS]",
        "Tools and Stack: " + data.technical.tools,
        "Methods Used:",
        data.technical.methods,
        "",
        "[CHALLENGES AND OUTCOMES]",
        "Challenges:",
        data.narrative.challenges,
        "",
        "Mitigation:",
        data.narrative.mitigation,
        "",
        "Results:",
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
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
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
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
        if (includeSkillsToggle) {
            includeSkillsSummary = includeSkillsToggle.checked;
        }
        return;
    }

    try {
        const parsed = JSON.parse(raw);
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
        localStorage.removeItem(SESSION_STORAGE_KEY);
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
        showStatus("Project added to collection.");
    }

    evidenceSelectionTouched = false;
    setEditorOpen(false);
    clearFormFields();
    activeProjectId = "";
    applySortMode(sortMode, false);
    schedulePersistSessionState();
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

function deleteProjectById(projectId) {
    const target = projects.find((project) => project.id === projectId);
    const label = target ? (target.data.identity.projectTitle || target.data.identity.courseCode || "this project") : "this project";
    if (!window.confirm("Delete " + label + "?")) {
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
    renderPreview();
    schedulePersistSessionState();
}

function moveProject(draggedId, targetId) {
    if (!draggedId || !targetId || draggedId === targetId) {
        return;
    }

    const fromIndex = projects.findIndex((project) => project.id === draggedId);
    const toIndex = projects.findIndex((project) => project.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
        return;
    }

    if (sortMode !== "manual") {
        setSortMode("manual");
    }

    const [moved] = projects.splice(fromIndex, 1);
    projects.splice(toIndex, 0, moved);
    renderProjectList();
    renderPreview();
    clearError();
    showStatus("Project order updated.");
    schedulePersistSessionState();
}

byId("courseCode").addEventListener("input", (event) => {
    inferFromCourseCode(event.target.value);
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

    const item = event.target.closest(".project-item");
    if (!item) {
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

    if (event.target.closest("#presetPickerModal") || event.target.closest("#historyModal")) {
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

    if (presetPickerModal && !presetPickerModal.classList.contains("is-hidden")) {
        closePresetPickerModal();
        return;
    }

    if (historyModal && !historyModal.classList.contains("is-hidden")) {
        closeHistoryModal();
        return;
    }

    document.querySelectorAll(".item-menu[open]").forEach((detailsEl) => {
        detailsEl.removeAttribute("open");
    });
});

projectList.addEventListener("dragstart", (event) => {
    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }
    draggingProjectId = item.getAttribute("data-id") || "";
    item.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
});

projectList.addEventListener("dragover", (event) => {
    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
});

projectList.addEventListener("drop", (event) => {
    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }
    event.preventDefault();
    const targetId = item.getAttribute("data-id") || "";
    moveProject(draggingProjectId, targetId);
});

projectList.addEventListener("dragend", () => {
    draggingProjectId = "";
    projectList.querySelectorAll(".project-item.dragging").forEach((item) => {
        item.classList.remove("dragging");
    });
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

        if (projects.length && !window.confirm("This will overwrite your current projects. Continue?")) {
            importZipInput.value = "";
            return;
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
