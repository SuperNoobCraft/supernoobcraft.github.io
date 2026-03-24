const PREFIX_MAP = {
    COMP: { faculty: "Engineering", department: "Computer Science" },
    BSIM: { faculty: "Business and Economics", department: "Information Systems" },
    LAWS: { faculty: "Law", department: "School of Law" },
    ECON: { faculty: "Business and Economics", department: "Economics" },
    ELEC: { faculty: "Engineering", department: "Electrical and Electronic Engineering" },
    ENGG: { faculty: "Engineering", department: "Faculty-level course" }
};

const SAMPLE_COURSES = {
    COMP2119: { courseCode: "COMP2119", courseName: "Object-Oriented Programming and Java", projectType: "Group Project" },
    COMP2396: { courseCode: "COMP2396", courseName: "Object-Oriented Programming and Java", projectType: "Individual Assignment" },
    BSIM3003: { courseCode: "BSIM3003", courseName: "Digital Business Strategy", projectType: "Group Project" },
    LAWS2002: { courseCode: "LAWS2002", courseName: "Legal Research and Writing", projectType: "Research Project" }
};

const REQUIRED_FIELDS = [
    { id: "courseCode", label: "Course code" },
    { id: "courseName", label: "Course name" },
    { id: "semester", label: "Semester" },
    { id: "projectType", label: "Project type" },
    { id: "projectTitle", label: "Project title" },
    { id: "role", label: "Role in team" },
    { id: "responsibilities", label: "Responsibilities" },
    { id: "tools", label: "Tools and tech stack" },
    { id: "problemStatement", label: "Problem statement" },
    { id: "objectives", label: "Objectives" },
    { id: "deliverables", label: "Deliverables" },
    { id: "results", label: "Result summary" }
];

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

const WORKSPACE_KEY = "hkuProjectWorkspaceV2";
let projects = [];
let activeProjectId = "";
let draggingProjectId = "";

function byId(id) {
    return document.getElementById(id);
}

function sanitize(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function inferFromCourseCode(codeRaw) {
    const code = (codeRaw || "").trim().toUpperCase();
    const prefix = code.slice(0, 4);
    const matched = PREFIX_MAP[prefix];

    if (matched) {
        byId("faculty").value = matched.faculty;
        byId("department").value = matched.department;
        inferenceNote.textContent = "HKU inference found from course prefix " + prefix + ".";
        return;
    }

    byId("faculty").value = "Not inferred";
    byId("department").value = "Not inferred";
    inferenceNote.textContent = prefix ? "No local mapping for prefix " + prefix + ". You can still continue." : "";
}

function value(id) {
    return byId(id).value.trim();
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
            semester: value("semester"),
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
    byId("semester").value = data.identity.semester || "";
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
        "\" draggable=\"true\">" +
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

function textOrPlaceholder(text) {
    return text ? sanitize(text).replaceAll("\n", "<br>") : "<em>Not provided</em>";
}

function hasText(text) {
    return Boolean((text || "").trim());
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

function renderPreview() {
    const draftData = collectData();
    const selectedProject = projects.find((project) => project.id === activeProjectId);
    const dataSet = selectedProject ? [selectedProject.data] : projects.length ? [projects[0].data] : [draftData];

    const sheets = dataSet.map((data, index) => {
        const identityMeta = [
            data.identity.courseCode,
            data.identity.courseName,
            data.identity.semester,
            data.identity.projectType
        ]
            .filter(Boolean)
            .map((item) => sanitize(item))
            .join(" | ");

        const blocks = [
            section(
                "HKU Context",
                "Faculty: " + textOrPlaceholder(data.hkuContext.faculty) + "<br>Department: " + textOrPlaceholder(data.hkuContext.department)
            ),
            section(
                "Project Overview",
                "Problem statement:<br>" +
                    textOrPlaceholder(data.narrative.problemStatement) +
                    "<br><br>Objectives:<br>" +
                    textOrPlaceholder(data.narrative.objectives) +
                    "<br><br>Deliverables:<br>" +
                    textOrPlaceholder(data.narrative.deliverables)
            ),
            section(
                "Personal Contribution",
                "Role: " +
                    textOrPlaceholder(data.team.role) +
                    "<br>Team size: " +
                    textOrPlaceholder(data.team.teamSize) +
                    "<br><br>Responsibilities:<br>" +
                    textOrPlaceholder(data.contribution.responsibilities)
            ),
            section(
                "Technical Implementation",
                "Tools and stack: " +
                    textOrPlaceholder(data.technical.tools) +
                    "<br><br>Methods used:<br>" +
                    textOrPlaceholder(data.technical.methods),
                true
            ),
            section(
                "Challenges and Outcomes",
                "Challenges faced:<br>" +
                    textOrPlaceholder(data.narrative.challenges) +
                    "<br><br>Mitigation:<br>" +
                    textOrPlaceholder(data.narrative.mitigation) +
                    "<br><br>Result summary:<br>" +
                    textOrPlaceholder(data.narrative.results),
                true
            )
        ];

        if (hasText(data.reflection.lessons) || hasText(data.reflection.futureImprovements)) {
            blocks.push(
                section(
                    "Reflection",
                    "Lessons learned:<br>" +
                        textOrPlaceholder(data.reflection.lessons) +
                        "<br><br>Future improvements:<br>" +
                        textOrPlaceholder(data.reflection.futureImprovements),
                    true
                )
            );
        }

        if (data.evidence.length) {
            blocks.push(section("Evidence", sanitize(data.evidence.join(", ")), true));
        }

        const estimatedLength = estimateContentLength(data);
        const likelyOnePage = estimatedLength <= 2600;

        return (
            "<article class=\"project-sheet" +
            (likelyOnePage ? "" : " compact-print") +
            "\"><header class=\"summary-header\"><h3>" +
            sanitize(data.identity.projectTitle || "Untitled Project") +
            "</h3><p class=\"preview-meta\">" +
            (identityMeta || "Fill in project identity fields") +
            "</p></header><div class=\"print-grid\">" +
            blocks.join("") +
            "</div><p class=\"preview-meta\">Project " +
            sanitize(String(index + 1)) +
            " generated: " +
            sanitize(data.meta.generatedAt || new Date().toLocaleString()) +
            "</p></article>"
        );
    });

    previewEl.innerHTML = sheets.join("");

    if (selectedProject) {
        printFitHint.textContent = "Previewing selected project. PDF export includes all saved projects in list order.";
    } else if (projects.length) {
        printFitHint.textContent = "Previewing first saved project. Select a card on the left to preview another.";
    } else {
        printFitHint.textContent = "No saved projects yet. Preview is showing the current draft.";
    }
}

function renderAllProjectsForPrint() {
    if (!projects.length) {
        return;
    }

    const snapshot = {
        html: previewEl.innerHTML,
        hint: printFitHint.textContent
    };

    const allSheetsHtml = projects
        .map((project, index) => {
            const data = project.data;
            const identityMeta = [
                data.identity.courseCode,
                data.identity.courseName,
                data.identity.semester,
                data.identity.projectType
            ]
                .filter(Boolean)
                .map((item) => sanitize(item))
                .join(" | ");

            const blocks = [
                section(
                    "HKU Context",
                    "Faculty: " + textOrPlaceholder(data.hkuContext.faculty) + "<br>Department: " + textOrPlaceholder(data.hkuContext.department)
                ),
                section(
                    "Project Overview",
                    "Problem statement:<br>" +
                        textOrPlaceholder(data.narrative.problemStatement) +
                        "<br><br>Objectives:<br>" +
                        textOrPlaceholder(data.narrative.objectives) +
                        "<br><br>Deliverables:<br>" +
                        textOrPlaceholder(data.narrative.deliverables)
                ),
                section(
                    "Personal Contribution",
                    "Role: " +
                        textOrPlaceholder(data.team.role) +
                        "<br>Team size: " +
                        textOrPlaceholder(data.team.teamSize) +
                        "<br><br>Responsibilities:<br>" +
                        textOrPlaceholder(data.contribution.responsibilities)
                ),
                section(
                    "Technical Implementation",
                    "Tools and stack: " +
                        textOrPlaceholder(data.technical.tools) +
                        "<br><br>Methods used:<br>" +
                        textOrPlaceholder(data.technical.methods),
                    true
                ),
                section(
                    "Challenges and Outcomes",
                    "Challenges faced:<br>" +
                        textOrPlaceholder(data.narrative.challenges) +
                        "<br><br>Mitigation:<br>" +
                        textOrPlaceholder(data.narrative.mitigation) +
                        "<br><br>Result summary:<br>" +
                        textOrPlaceholder(data.narrative.results),
                    true
                )
            ];

            if (hasText(data.reflection.lessons) || hasText(data.reflection.futureImprovements)) {
                blocks.push(
                    section(
                        "Reflection",
                        "Lessons learned:<br>" +
                            textOrPlaceholder(data.reflection.lessons) +
                            "<br><br>Future improvements:<br>" +
                            textOrPlaceholder(data.reflection.futureImprovements),
                        true
                    )
                );
            }

            if (data.evidence.length) {
                blocks.push(section("Evidence", sanitize(data.evidence.join(", ")), true));
            }

            const estimatedLength = estimateContentLength(data);
            const likelyOnePage = estimatedLength <= 2600;

            return (
                "<article class=\"project-sheet" +
                (likelyOnePage ? "" : " compact-print") +
                "\"><header class=\"summary-header\"><h3>" +
                sanitize(data.identity.projectTitle || "Untitled Project") +
                "</h3><p class=\"preview-meta\">" +
                (identityMeta || "Fill in project identity fields") +
                "</p></header><div class=\"print-grid\">" +
                blocks.join("") +
                "</div><p class=\"preview-meta\">Project " +
                sanitize(String(index + 1)) +
                " generated: " +
                sanitize(data.meta.generatedAt || new Date().toLocaleString()) +
                "</p></article>"
            );
        })
        .join("");

    previewEl.innerHTML = allSheetsHtml;
    printFitHint.textContent = "Preparing multi-page print preview for " + projects.length + " project(s).";
    window.print();
    previewEl.innerHTML = snapshot.html;
    printFitHint.textContent = snapshot.hint;
}

function toTxt(data) {
    return [
        "HKU COURSE PROJECT SUMMARY",
        "Generated: " + data.meta.generatedAt,
        "",
        "[PROJECT IDENTITY]",
        "Course Code: " + data.identity.courseCode,
        "Course Name: " + data.identity.courseName,
        "Semester: " + data.identity.semester,
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
    return projectRecords
        .map((project, index) => {
            return [
                "==============================",
                "PROJECT " + (index + 1),
                "==============================",
                toTxt(project.data)
            ].join("\n");
        })
        .join("\n\n");
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

function runValidationOrShowErrors() {
    const data = collectData();
    const issues = validate(data);

    if (!issues.length) {
        errorSummary.textContent = "";
        return { valid: true, data };
    }

    errorSummary.textContent = "Please fix: " + issues.join("; ");
    return { valid: false, data };
}

function saveDraft() {
    const payload = {
        projects,
        activeProjectId,
        workingDraft: collectData()
    };
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(payload));
    errorSummary.textContent = "Workspace saved locally.";
}

function loadDraft() {
    const raw = localStorage.getItem(WORKSPACE_KEY);
    if (!raw) {
        errorSummary.textContent = "No saved workspace found.";
        return;
    }

    try {
        const payload = JSON.parse(raw);
        projects = Array.isArray(payload.projects) ? payload.projects : [];
        activeProjectId = payload.activeProjectId || "";

        const activeProject = projects.find((project) => project.id === activeProjectId);
        if (activeProject) {
            setFormData(activeProject.data);
            editorModeHint.textContent = "Editing selected project.";
        } else if (payload.workingDraft) {
            setFormData(payload.workingDraft);
            activeProjectId = "";
            editorModeHint.textContent = "Editing working draft.";
        } else {
            resetForm();
        }

        renderProjectList();
        listEvidenceNames();
        renderPreview();
        errorSummary.textContent = "Workspace loaded. Evidence files cannot be restored for security reasons.";
    } catch (err) {
        errorSummary.textContent = "Could not read workspace data.";
    }
}

function resetForm() {
    form.reset();
    activeProjectId = "";
    byId("faculty").value = "";
    byId("department").value = "";
    inferenceNote.textContent = "";
    errorSummary.textContent = "";
    evidenceList.innerHTML = "";
    editorModeHint.textContent = "Editing working draft.";
    renderProjectList();
    renderPreview();
}

function saveOrUpdateProject() {
    const outcome = runValidationOrShowErrors();
    if (!outcome.valid) {
        return;
    }

    const existingIndex = projects.findIndex((project) => project.id === activeProjectId);
    if (existingIndex >= 0) {
        projects[existingIndex] = buildProjectRecord(outcome.data, activeProjectId);
        errorSummary.textContent = "Project updated in collection.";
    } else {
        const created = buildProjectRecord(outcome.data);
        projects.push(created);
        activeProjectId = created.id;
        errorSummary.textContent = "Project added to collection.";
    }

    renderProjectList();
    renderPreview();
}

function startNewProject() {
    activeProjectId = "";
    form.reset();
    byId("faculty").value = "";
    byId("department").value = "";
    inferenceNote.textContent = "";
    evidenceList.innerHTML = "";
    editorModeHint.textContent = "Creating a new project.";
    renderProjectList();
    renderPreview();
    errorSummary.textContent = "Started a new project draft.";
}

function deleteSelectedProject() {
    if (!activeProjectId) {
        errorSummary.textContent = "Select a saved project to delete.";
        return;
    }

    projects = projects.filter((project) => project.id !== activeProjectId);
    activeProjectId = "";
    form.reset();
    byId("faculty").value = "";
    byId("department").value = "";
    inferenceNote.textContent = "";
    evidenceList.innerHTML = "";
    editorModeHint.textContent = "Creating a new project.";
    renderProjectList();
    renderPreview();
    errorSummary.textContent = "Project deleted from collection.";
}

function selectProjectById(projectId) {
    const project = projects.find((item) => item.id === projectId);
    if (!project) {
        activeProjectId = "";
        return;
    }

    activeProjectId = projectId;
    setFormData(project.data);
    editorModeHint.textContent = "Editing selected project.";
    renderProjectList();
    renderPreview();
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

    const [moved] = projects.splice(fromIndex, 1);
    projects.splice(toIndex, 0, moved);
    renderProjectList();
    renderPreview();
    errorSummary.textContent = "Project order updated.";
}

function applySample() {
    const selected = byId("sampleCourse").value;
    if (!selected || !SAMPLE_COURSES[selected]) {
        return;
    }

    const preset = SAMPLE_COURSES[selected];
    byId("courseCode").value = preset.courseCode;
    byId("courseName").value = preset.courseName;
    byId("projectType").value = preset.projectType;
    inferFromCourseCode(preset.courseCode);
    renderPreview();
}

byId("courseCode").addEventListener("input", (event) => {
    inferFromCourseCode(event.target.value);
    renderPreview();
});

form.addEventListener("input", renderPreview);
evidenceInput.addEventListener("change", () => {
    listEvidenceNames();
    renderPreview();
});

byId("applySample").addEventListener("click", applySample);
byId("newProject").addEventListener("click", startNewProject);
byId("saveProject").addEventListener("click", saveOrUpdateProject);
byId("cancelEdit").addEventListener("click", startNewProject);

projectList.addEventListener("click", (event) => {
    const menuButton = event.target.closest("[data-action]");
    if (menuButton) {
        const item = menuButton.closest(".project-item");
        if (!item) {
            return;
        }
        const projectId = item.getAttribute("data-id");
        if (menuButton.getAttribute("data-action") === "edit") {
            selectProjectById(projectId);
            errorSummary.textContent = "Loaded project for editing.";
        }
        if (menuButton.getAttribute("data-action") === "delete") {
            activeProjectId = projectId;
            deleteSelectedProject();
        }
        const parentDetails = menuButton.closest("details");
        if (parentDetails) {
            parentDetails.removeAttribute("open");
        }
        event.stopPropagation();
        return;
    }

    const item = event.target.closest(".project-item");
    if (!item) {
        return;
    }
    const projectId = item.getAttribute("data-id");
    selectProjectById(projectId);
    errorSummary.textContent = "Loaded saved project into editor.";
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

byId("saveWorkspace").addEventListener("click", saveDraft);
byId("loadWorkspace").addEventListener("click", loadDraft);
byId("resetForm").addEventListener("click", resetForm);

byId("exportTxt").addEventListener("click", () => {
    if (projects.length) {
        const txtAll = toTxtAll(projects);
        download("hku-project-collection.txt", txtAll, "text/plain;charset=utf-8");
        errorSummary.textContent = "Exported TXT for all saved projects.";
        return;
    }

    const outcome = runValidationOrShowErrors();
    if (!outcome.valid) {
        return;
    }

    const txt = toTxt(outcome.data);
    const codePart = outcome.data.identity.courseCode || "HKU";
    download(codePart + "-project-summary.txt", txt, "text/plain;charset=utf-8");
    errorSummary.textContent = "Exported TXT for current draft project.";
});

byId("exportPdf").addEventListener("click", () => {
    if (projects.length) {
        errorSummary.textContent = "Opening print dialog for all saved projects...";
        renderAllProjectsForPrint();
        return;
    }

    if (!projects.length) {
        const outcome = runValidationOrShowErrors();
        if (!outcome.valid) {
            return;
        }
    }
    errorSummary.textContent = "Opening print dialog for PDF export...";
    window.print();
});

renderProjectList();
resetForm();
