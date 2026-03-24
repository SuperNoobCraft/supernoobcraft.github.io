const PREFIX_MAP = {
    COMP: { faculty: "Engineering", department: "Computer Science" },
    BSIM: { faculty: "Business and Economics", department: "Information Systems" },
    LAWS: { faculty: "Law", department: "School of Law" },
    ECON: { faculty: "Business and Economics", department: "Economics" },
    ELEC: { faculty: "Engineering", department: "Electrical and Electronic Engineering" },
    ENGG: { faculty: "Engineering", department: "Faculty-level course" }
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

const form = document.getElementById("project-form");
const previewEl = document.getElementById("preview");
const errorSummary = document.getElementById("errorSummary");
const evidenceInput = document.getElementById("evidence");
const evidenceList = document.getElementById("evidenceList");
const inferenceNote = document.getElementById("inferenceNote");
const printFitHint = document.getElementById("printFitHint");
const projectList = document.getElementById("projectList");
const noProjectsState = document.getElementById("noProjectsState");
const editorModeHint = document.getElementById("editorModeHint");
const editorCard = document.getElementById("editorCard");
const importTxtInput = document.getElementById("importTxtInput");
const undoDeleteBtn = document.getElementById("undoDelete");
const teamFields = document.getElementById("teamFields");
const splitPagesToggle = document.getElementById("splitPagesToggle");
const sortProjectsSelect = document.getElementById("sortProjects");
const profileNameInput = document.getElementById("profileName");
const profileEmailInput = document.getElementById("profileEmail");
const profilePhoneInput = document.getElementById("profilePhone");
const profileLinkInput = document.getElementById("profileLink");
const profileDisplayModeInput = document.getElementById("profileDisplayMode");
const profileDisplayToggle = document.getElementById("profileDisplayToggle");
const profileModeEach = document.getElementById("profileModeEach");
const profileModeTop = document.getElementById("profileModeTop");
const autosaveHint = document.getElementById("autosaveHint");
const statusMessage = document.getElementById("statusMessage");
const themeToggle = document.getElementById("themeToggle");
const topbar = document.querySelector(".topbar");
const welcomeModal = document.getElementById("welcomeModal");
const welcomeClose = document.getElementById("welcomeClose");

let projects = [];
let activeProjectId = "";
let draggingProjectId = "";
let editorOpen = false;
let profile = { name: "", email: "", phone: "", link: "", displayMode: "per-project" };
let persistTimer = null;
let projectAutoSaveTimer = null;
let autosaveTicker = null;
let sortMode = "manual";
let lastSavedAt = 0;
let lastDeletedProjectSnapshot = null;

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
    themeToggle.textContent = themeName === "dark" ? "Light mode" : "Dark mode";
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
        identity: { courseCode: "", courseName: "", academicYear: "2025-26", term: "", projectType: "", projectTitle: "" },
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

function listEvidenceNames() {
    evidenceList.innerHTML = "";
    const files = Array.from(evidenceInput.files || []);
    files.forEach((file) => {
        const li = document.createElement("li");
        li.textContent = file.name + " (" + Math.round(file.size / 1024) + " KB)";
        evidenceList.appendChild(li);
    });
}

function collectData() {
    return {
        identity: {
            courseCode: value("courseCode").toUpperCase(),
            courseName: value("courseName"),
            academicYear: value("academicYear"),
            term: value("term"),
            projectType: value("projectType"),
            projectTitle: value("projectTitle")
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
        evidence: Array.from(evidenceInput.files || []).map((f) => f.name),
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
    byId("courseCode").value = data.identity.courseCode || "";
    byId("courseName").value = data.identity.courseName || "";
    byId("academicYear").value = data.identity.academicYear || "2025-26";
    byId("term").value = data.identity.term || "";
    byId("projectType").value = data.identity.projectType || "";
    byId("projectTitle").value = data.identity.projectTitle || "";

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
    form.reset();
    byId("faculty").value = "";
    byId("department").value = "";
    byId("faculty").classList.remove("not-inferred");
    byId("department").classList.remove("not-inferred");
    inferenceNote.classList.remove("warn");
    inferenceNote.textContent = "";
    evidenceList.innerHTML = "";
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
        displayMode: (profileDisplayModeInput && profileDisplayModeInput.value) || "per-project"
    };
}

function setProfileFields(profileData) {
    const safe = profileData || {};
    profileNameInput.value = safe.name || "";
    profileEmailInput.value = safe.email || "";
    profilePhoneInput.value = safe.phone || "";
    profileLinkInput.value = safe.link || "";
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

    return "<header class=\"portfolio-header\">" + lines.join("") + "</header>";
}

function buildPortfolioPreviewHtml(projectDataList) {
    const list = projectDataList || [];
    const header = portfolioHeaderHtml(profile);
    const sheets = list.map((projectData, index) => buildProjectSheetHtml(projectData, index + 1)).join("");
    return header + sheets;
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

    return (
        "<li class=\"project-item" +
        activeClass +
        "\" data-id=\"" +
        sanitize(project.id) +
        "\" draggable=\"true\" tabindex=\"0\" role=\"button\" aria-label=\"Preview project " +
        sanitize(String(index + 1)) +
        "\">" +
        "<button type=\"button\" class=\"drag-handle\" aria-label=\"Drag to reorder\">drag</button>" +
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
        "<details class=\"item-menu\"><summary>...</summary>" +
        "<div class=\"item-menu-panel\">" +
        "<button type=\"button\" data-action=\"edit\">Edit</button>" +
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
        "</h3><p>" +
        body +
        "</p></section>"
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

function buildProjectSheetHtml(data, index) {
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

    if (data.evidence.length) {
        blocks.push(section("Evidence", sanitize(data.evidence.join(", ")), true));
    }

    const likelyOnePage = estimateContentLength(data) <= 2600;
    const profileCorner = profileHtml(profile, index);

    return (
        "<article class=\"project-sheet" +
        (likelyOnePage ? "" : " compact-print") +
        "\"><header class=\"summary-header\"><div class=\"summary-top\"><div><h3>" +
        sanitize(data.identity.projectTitle || "Untitled Project") +
        "</h3><p class=\"preview-meta\">" +
        (identityMeta || "Fill in project identity fields") +
        "</p></div>" +
        profileCorner +
        "</div></header><div class=\"print-grid\">" +
        blocks.join("") +
        "</div></article>"
    );
}

function renderPreview() {
    const selectedProject = projects.find((project) => project.id === activeProjectId);

    if (selectedProject) {
        previewEl.innerHTML = buildPortfolioPreviewHtml([selectedProject.data]);
        printFitHint.textContent = "Previewing selected project. PDF export includes all saved projects in list order.";
        return;
    }

    if (editorOpen) {
        previewEl.innerHTML = buildPortfolioPreviewHtml([collectData()]);
        printFitHint.textContent = "Previewing current draft project. Save it to include in exports.";
        return;
    }

    if (projects.length) {
        previewEl.innerHTML = buildPortfolioPreviewHtml(projects.map((project) => project.data));
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
    previewEl.innerHTML = buildPortfolioPreviewHtml(projects.map((project) => project.data));
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

function parseImportedProjectsFromJson(txt) {
    const start = txt.indexOf(JSON_START);
    const end = txt.indexOf(JSON_END);
    if (start < 0 || end < 0 || end <= start) {
        return null;
    }

    const rawJson = txt.slice(start + JSON_START.length, end).trim();
    const parsed = JSON.parse(rawJson);
    if (!parsed || !Array.isArray(parsed.projects)) {
        return null;
    }

    const importedProjects = parsed.projects
        .map((project) => {
            const safeData = project && project.data ? project.data : createEmptyData();
            return buildProjectRecord(safeData, project.id || "");
        })
        .filter(Boolean);

    return {
        profile: parsed.profile || { name: "", email: "", phone: "", link: "" },
        projects: importedProjects
    };
}

function parseLegacyTxtProjects(txt) {
    const chunks = txt
        .split(/=+\s*\nPROJECT\s+\d+\s*\n=+\s*\n/g)
        .map((chunk) => chunk.trim())
        .filter(Boolean);

    if (!chunks.length) {
        return [];
    }

    return chunks.map((chunk) => {
        const data = createEmptyData();
        const lines = chunk.split(/\r?\n/);
        const lineByPrefix = (prefix) => {
            const line = lines.find((item) => item.startsWith(prefix));
            return line ? line.slice(prefix.length).trim() : "";
        };

        data.identity.courseCode = lineByPrefix("Course Code:");
        data.identity.courseName = lineByPrefix("Course Name:");
        data.identity.academicYear = lineByPrefix("Academic Year:");
        data.identity.term = lineByPrefix("Term:");
        if (!data.identity.academicYear) {
            const legacySemester = lineByPrefix("Semester:");
            const match = legacySemester.match(/^(\d{4}-\d{2})\s+(Sem\s*1|Sem\s*2|Summer)$/i);
            if (match) {
                data.identity.academicYear = match[1];
                data.identity.term = match[2].replace(/\s+/, " ");
            }
        }
        data.identity.projectType = lineByPrefix("Project Type:");
        data.identity.projectTitle = lineByPrefix("Project Title:");
        data.hkuContext.faculty = lineByPrefix("Faculty:");
        data.hkuContext.department = lineByPrefix("Department:");
        data.team.role = lineByPrefix("Role:");
        data.team.teamSize = lineByPrefix("Team Size:");
        data.technical.tools = lineByPrefix("Tools and Stack:");
        data.meta.generatedAt = lineByPrefix("Generated:") || new Date().toLocaleString();

        return buildProjectRecord(data);
    });
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
        profile: collectProfile(),
        draft: editorOpen ? collectData() : createEmptyData()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
    lastSavedAt = Date.now();
    updateAutosaveHint();
}

function schedulePersistSessionState() {
    if (persistTimer) {
        clearTimeout(persistTimer);
    }
    persistTimer = setTimeout(() => {
        persistSessionState();
    }, 180);
}

function autosaveActiveProjectEdit() {
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
    renderProjectList();
    renderPreview();
    schedulePersistSessionState();
}

function scheduleAutosaveActiveProjectEdit() {
    if (projectAutoSaveTimer) {
        clearTimeout(projectAutoSaveTimer);
    }

    projectAutoSaveTimer = setTimeout(() => {
        autosaveActiveProjectEdit();
    }, 320);
}

function restoreSessionState() {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
        return;
    }

    try {
        const parsed = JSON.parse(raw);
        projects = Array.isArray(parsed.projects) ? parsed.projects : [];
        activeProjectId = parsed.activeProjectId || "";
        setSortMode(parsed.sortMode || "manual");
        splitPagesToggle.checked = Boolean(parsed.splitPages);
        setProfileFields(parsed.profile || { name: "", email: "", phone: "", link: "" });

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
        renderPreview();
        clearError();
        showStatus("Recovered previous session automatically.");
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

function saveOrUpdateProject() {
    const outcome = runValidationOrShowErrors();
    if (!outcome.valid) {
        return;
    }

    const existingIndex = projects.findIndex((project) => project.id === activeProjectId);
    if (existingIndex >= 0) {
        projects[existingIndex] = buildProjectRecord(outcome.data, activeProjectId);
        showStatus("Project updated in collection.");
    } else {
        const created = buildProjectRecord(outcome.data);
        projects.push(created);
        activeProjectId = created.id;
        showStatus("Project added to collection.");
    }

    setEditorOpen(false);
    clearFormFields();
    activeProjectId = "";
    applySortMode(sortMode, false);
    schedulePersistSessionState();
}

function duplicateProjectById(projectId) {
    const source = projects.find((project) => project.id === projectId);
    if (!source) {
        return;
    }

    const cloneData = JSON.parse(JSON.stringify(source.data));
    cloneData.identity.projectTitle = (cloneData.identity.projectTitle || "Untitled Project") + " (Copy)";
    const duplicated = buildProjectRecord(cloneData);
    projects.push(duplicated);
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
        wasActive: activeProjectId === projectId
    };
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
    setFormData(project.data);
    setEditorOpen(true, "Editing selected project.");
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
    listEvidenceNames();
    if (editorOpen) {
        renderPreview();
        scheduleAutosaveActiveProjectEdit();
    }
    schedulePersistSessionState();
});

byId("newProject").addEventListener("click", startNewProject);
byId("saveProject").addEventListener("click", saveOrUpdateProject);
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

[profileNameInput, profileEmailInput, profilePhoneInput, profileLinkInput].forEach((input) => {
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

splitPagesToggle.addEventListener("change", schedulePersistSessionState);

if (sortProjectsSelect) {
    sortProjectsSelect.addEventListener("change", () => {
        applySortMode(sortProjectsSelect.value);
        schedulePersistSessionState();
    });
}

byId("importProjects").addEventListener("click", () => {
    importTxtInput.value = "";
    importTxtInput.click();
});

importTxtInput.addEventListener("change", () => {
    const file = importTxtInput.files && importTxtInput.files[0];
    if (!file) {
        return;
    }

    if (projects.length && !window.confirm("This will overwrite your current projects. Continue?")) {
        importTxtInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        try {
            const txt = String(reader.result || "");
            let importedCollection = parseImportedProjectsFromJson(txt);
            let importedProjects = [];

            if (importedCollection && importedCollection.projects && importedCollection.projects.length) {
                importedProjects = importedCollection.projects;
                setProfileFields(importedCollection.profile);
            } else {
                importedProjects = parseLegacyTxtProjects(txt);
            }

            if (!importedProjects.length) {
                showError("Could not find importable projects in this TXT file.");
                return;
            }

            projects = importedProjects;
            activeProjectId = "";
            clearFormFields();
            setEditorOpen(false);
            applySortMode(sortMode, false);
            clearError();
            showStatus("Imported " + importedProjects.length + " project(s) from TXT.");
            schedulePersistSessionState();
        } catch (error) {
            showError("Import failed: invalid TXT format.");
        }
    };
    reader.readAsText(file);
});

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
        if (menuButton.getAttribute("data-action") === "delete") {
            deleteProjectById(projectId);
        }
        if (menuButton.getAttribute("data-action") === "duplicate") {
            duplicateProjectById(projectId);
            clearError();
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

byId("exportTxt").addEventListener("click", () => {
    if (!projects.length) {
        showError("No saved projects to export. Create and save at least one project first.");
        return;
    }

    const hasNonTextEvidence = projects.some((project) => Array.isArray(project.data.evidence) && project.data.evidence.length);
    if (hasNonTextEvidence) {
        const proceed = window.confirm(
            "TXT export includes text and evidence file names only. Uploaded images/files themselves are not included. Continue?"
        );
        if (!proceed) {
            showStatus("TXT export canceled.");
            return;
        }
    }

    const txtAll = toTxtAll(projects);
    download("hku-project-collection.txt", txtAll, "text/plain;charset=utf-8");
    clearError();
    showStatus("Exported TXT for all saved projects.");
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

window.addEventListener("beforeunload", persistSessionState);

window.addEventListener("resize", updateHeaderOffset);

setEditorOpen(false);
setProfileFields({ name: "", email: "", phone: "", link: "" });
updateTeamFieldVisibility();
initializeTheme();
setupAutoHideTopbar();
restoreSessionState();
if (!projects.length && !editorOpen) {
    renderProjectList();
    renderPreview();
}
renderUndoDeleteState();
startAutosaveTicker();
setupWelcomeModal();
updateHeaderOffset();
