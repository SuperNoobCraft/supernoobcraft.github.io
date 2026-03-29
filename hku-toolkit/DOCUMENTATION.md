# HKU Course Project Documentation Tool: Process Documentation

Last Updated: 2026-03-29

Accessible website link: https://supernoobcraft.github.io/hku-toolkit/

Browser compatibility: The website is designed for common desktop browsers including Google Chrome, Microsoft Edge, and Safari. Mobile layouts are responsive and usable for viewing and light-to-medium editing workflows. ZIP import/export requires modern Blob and JSZip support, and local evidence persistence depends on IndexedDB availability.

## Introduction

The main HKU-related theme of this website is academic project portfolio construction for HKU students. In many courses, students produce substantial outputs such as code, reports, prototypes, and presentation artifacts; however, these are often fragmented across learning platforms, personal storage, team chats, and temporary submission folders. As a result, when students prepare internship applications, scholarship applications, or capstone reflections, they spend significant time reconstructing what they did rather than clearly presenting evidence of learning.

The HKU Course Project Documentation Tool addresses this gap by providing a structured, browser-based workflow for collecting multiple projects in one place, organizing them in meaningful order, and exporting them in practical formats for backup and submission.

The website aims to fulfill five goals:

1. Help students document projects in a consistent format that supports academic and professional communication.
2. Reduce cognitive load and repeated effort during portfolio preparation.
3. Support both quick logging and detailed reflection through a combination of required and optional fields.
4. Ensure portability and continuity through local persistence plus ZIP/PDF export workflows.
5. Provide a usable and accessible interface aligned with web usability and accessibility principles taught in the course.

This project is intentionally scoped as a client-side web application without a backend service or account requirement, which keeps deployment simple and data ownership user-controlled.

## Target Users and User Needs Assessment

### Target users and characteristics

Primary target users are HKU undergraduate and postgraduate students who need to summarize coursework projects for external audiences. Their typical characteristics include:

1. Time-constrained behavior around deadlines and application cycles.
2. Mixed technical confidence, from non-programming majors to computing students.
3. Frequent need to revise and reorder project narratives.
4. Need for confidence that drafts are not easily lost.
5. Preference for low-friction interfaces that do not force unnecessary steps.

Secondary users include teaching staff, mentors, or employers who may read exported outputs. This influenced the decision to prioritize clear English structure, concise section labels, and print-ready formatting.

### User-needs assessment methods and rationale

User-needs assessment used a practical mixed approach suitable for a small educational project:

1. Convenience-sample interviews with HKU peers.
2. Task-based walkthroughs using realistic project-entry and export tasks.
3. Iterative observation of pain points during feature testing.

Why these methods:

1. Interviews were useful for understanding context, motivation, and language preferences.
2. Task walkthroughs exposed concrete usability frictions better than abstract questions alone.
3. Observation during repeated iterations helped verify whether design changes reduced actual user effort.

This method prioritizes actionable design outcomes over statistical generalization, which is appropriate for the scope and timeline.

### Needs assessment results and design implications

Recurring needs identified during design/testing cycles were:

1. Need for quick start with minimal mandatory inputs.
2. Need to preserve data after refresh or accidental interruption.
3. Need to reorder projects to match narrative priority for applications.
4. Need to keep screenshots/evidence attached to project entries.
5. Need to generate both archive-ready and submission-ready outputs.
6. Need to avoid repetitive field filling across similar projects.
7. Need confidence and transparency about local data handling.

Result-to-design mapping:

1. Quick start need led to progressive disclosure, hidden editor by default, and a focused required-field set.
2. Data resilience need led to debounced autosave, auto-recovery, and autosave history snapshots.
3. Reordering need led to drag reorder, up/down quick buttons, and separate sort modes.
4. Evidence need led to image upload support, local binary persistence, and caption fields.
5. Output need led to ZIP bundle export/import and print-optimized PDF output.
6. Repetition reduction need led to project preset save/apply with overwrite control.
7. Trust and privacy need led to local-first architecture and explicit overwrite confirmations.

Critical reflection: while these outcomes significantly improve workflow efficiency, they also increase interface complexity (for example presets, history, sort logic). The design response was to keep advanced controls discoverable but non-blocking, so novice users can still complete a basic flow quickly.

## Website Creation Methods and Tools

### Methods

The website was created with iterative, feature-driven frontend development:

1. Define a stable data model for project records.
2. Build form capture and validation first.
3. Add live preview to shorten feedback loops.
4. Add persistence and recovery for reliability.
5. Add portability features (ZIP/PDF) for practical use.
6. Refine usability, accessibility, and visual consistency.

### Tools used and why

1. HTML for semantic structure (`fieldset`, `legend`, labels, form controls).
2. CSS for responsive two-column layout, theme tokens, interaction states, and print styles.
3. JavaScript for state management, autosave, history, sorting, import/export, and rendering.
4. JSZip for robust in-browser ZIP bundling and parsing.
5. GitHub Pages for static deployment and easy browser access.

Why this stack:

1. Transparent and maintainable for coursework review.
2. No server dependency, reducing operational risk.
3. Strong fit for incremental enhancement and direct debugging.

### AI-supported tools and contributions

AI-supported tooling was used as development assistance, not as autonomous authority. Practical contributions included:

1. Drafting and refactoring JavaScript logic for repetitive UI patterns.
2. Assisting debugging during event-flow and state-sync issues.
3. Supporting wording refinement for helper content and user-facing text.
4. Speeding up comparison of alternative implementations before final manual review.

Human validation remained essential. Every AI-assisted output was reviewed for correctness, scope alignment, and consistency with implemented behavior.

## Web Usability

Usability decisions were informed by course concepts including visibility of system status, match with real user workflows, consistency, user control/freedom, and error prevention.

### Key usability-oriented decisions

1. Workflow continuity through split layout.
   - Left side supports collection management and editing.
   - Right side provides immediate preview feedback.

2. Progressive disclosure.
   - Editor remains hidden until the user starts or selects a project.
   - Reduces initial complexity and decision fatigue.

3. Structured required/optional balance.
   - Required identity fields ensure minimal completeness.
   - Optional narrative and reflection fields support depth when needed.

4. Rich list management without lock-in.
   - Manual drag order for storytelling control.
   - Sort dropdown for fast alternative organization.
   - Up/down buttons for precise movement.

5. Immediate system feedback.
   - Status bar for success/error feedback.
   - Autosave hint showing recency of last persistence.
   - Inline error summary for validation failures.

6. Recovery and reversibility.
   - Undo for recent delete.
   - Autosave history with restore.
   - Confirmation dialogs for destructive operations.

7. Reuse support via presets.
   - Save non-empty project patterns.
   - Apply to reduce repeated data entry.

8. Export fit for real tasks.
   - ZIP for transfer/backup and machine-readable state.
   - PDF for review/submission contexts.

### How user needs informed usability

User needs directly shaped usability outcomes. For example, deadline-driven users needed fast completion with low friction; this drove simplified required fields and clear action labels. Users preparing applications needed narrative control; this drove reordering features and themeable output sections. Users who feared data loss needed reliability; this drove autosave, history, and import/export redundancy.

Critical reflection: strong usability often requires trade-offs. Adding many features can increase discoverability burden. The toolkit addresses this through grouping controls into contextual menus and keeping core actions (New, Save, Export) visible.

## Web Accessibility

Accessibility was integrated during implementation, not deferred to a final checklist stage. Decisions were aligned with practical WCAG-oriented principles (perceivable, operable, understandable, robust).

### Accessibility-focused implementation

1. Keyboard-first navigation support.
   - Skip link to main content.
   - Focus-visible outlines on interactive elements.
   - Keyboard project selection via Enter/Space.

2. Semantic form structure.
   - Form sections organized with `fieldset` and `legend`.
   - Explicit labels and helper text on key inputs.

3. Non-visual feedback.
   - Live status region for action results.
   - Alert area for validation errors.

4. Interaction clarity in custom controls.
   - Custom select controls preserve keyboard and aria semantics.
   - Modal dialogs support explicit close controls and Escape behavior.

5. Responsive and adaptable presentation.
   - Layout adapts to narrow screens.
   - Reduced-motion query minimizes motion effects for sensitive users.
   - Print stylesheet improves readability and removes non-essential UI.

### How user needs informed accessibility

Target users work across varied contexts (library desktops, personal laptops, mobile devices, quiet spaces, shared spaces). This supported inclusive decisions around keyboard access, predictable focus states, responsive behavior, and clear feedback messaging.

Critical reflection: accessibility is an ongoing process. The current implementation addresses foundational concerns, but full audit depth (screen-reader-specific walkthroughs, contrast edge-case checks, formal WCAG mapping) remains a future enhancement area.

## Ethical and Cybersecurity Issues and Measures

### Ethical considerations and responses

1. Data ownership and user autonomy.
   - Users keep control through local-first storage and export options.
   - No account lock-in or mandatory cloud dependency.

2. Transparency in data handling.
   - Privacy page explains local storage behavior.
   - Import overwrite actions require explicit confirmation.

3. Responsible AI usage.
   - AI used as assistive tooling, not as an unchecked source of truth.
   - Human review controls final implementation and documentation quality.

4. Fairness in skill representation.
   - Skills summary is optional and keyword-based.
   - Users can include/exclude this section in export to avoid over-claiming.

### Cybersecurity considerations and responses

1. Injection risk in preview rendering.
   - User text is sanitized before HTML output.

2. Import trust boundaries.
   - ZIP imports require expected manifest structure.
   - Invalid bundles trigger explicit error handling.

3. Persistence and namespace isolation.
   - Storage keys are scope-namespaced to reduce accidental cross-project leakage on same origin.
   - Legacy key fallback is handled defensively.

4. Local device threat model.
   - Since storage is local, device/browser compromise remains a residual risk.
   - Documentation advises clearing storage for sensitive use cases.

Critical reflection: choosing client-side architecture reduces server attack surface but shifts security responsibility toward local environment hygiene. This is acceptable for coursework scope, but sensitive users may still require encrypted backup workflows in later versions.

## Limitations and Future Improvement

### Current limitations

1. User-needs evidence quality can be expanded with larger and more diverse participant samples.
2. HKU faculty/department inference uses a curated prefix map and cannot cover every course code.
3. ZIP import is replacement-based; merge behavior is not currently available.
4. Skills extraction is keyword-based and may miss nuanced domain terminology.
5. PDF quality can vary by browser print engines.
6. Evidence support currently focuses on image files and local browser storage constraints.
7. Cross-device synchronization is not provided without manual export/import.

### Future improvements

1. Add import merge mode with conflict resolution.
2. Expand inference coverage through maintainable mapping updates.
3. Add stronger accessibility verification workflows (formal WCAG checklist and screen-reader testing logs).
4. Improve keyboard-only reordering alternatives beyond drag interaction.
5. Add richer evidence metadata options (captions, tags, context labels).
6. Add optional encrypted local backup package mode.
7. Introduce analytics-free, privacy-preserving usage diagnostics for UX tuning.

Critical reflection: the current version prioritizes reliability and practical output over advanced collaboration features. This is a deliberate scope choice for maintainability and assignment feasibility.

## Word Count

Approximate main-body word count (excluding Appendix and References): 2,020 words.

## References (APA Style)

International Organization for Standardization. (2019). *ISO 9241-11:2018 ergonomics of human-system interaction - Part 11: Usability: Definitions and concepts*. https://www.iso.org/standard/63500.html

Nielsen, J. (1994). 10 usability heuristics for user interface design. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/

Norman, D. A. (2013). *The design of everyday things* (Revised and expanded ed.). Basic Books.

OWASP Foundation. (2021). *OWASP top 10: The ten most critical web application security risks*. https://owasp.org/Top10/

World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*. W3C. https://www.w3.org/TR/WCAG22/

## Appendix

### Appendix A: Website links and figure capture points

Main tool page: https://supernoobcraft.github.io/hku-toolkit/index.html

Supplementary pages:

1. About: https://supernoobcraft.github.io/hku-toolkit/about.html
2. Help: https://supernoobcraft.github.io/hku-toolkit/help.html
3. Privacy: https://supernoobcraft.github.io/hku-toolkit/privacy.html

Figure checklist (insert annotated screenshots with arrows/labels before submission):

1. Figure 1: Main interface overview (topbar, project collection, live preview).
2. Figure 2: Project editor with required fields and inferred HKU context.
3. Figure 3: Project list actions (menu, duplicate/delete, move controls, drag handle).
4. Figure 4: Accessibility elements (skip link, focus outline, status live message).
5. Figure 5: Autosave history modal and restore flow.
6. Figure 6: Preset save/apply dialogs.
7. Figure 7: ZIP export/import workflow confirmation and completion status.
8. Figure 8: Print/PDF preview with split-pages toggle comparison.

Suggested annotation labels per figure:

1. User action point.
2. System response/status.
3. Usability or accessibility rationale.
4. Risk/limitation note where relevant.

### Appendix B: User-needs assessment record template

Participant profile table:

| Participant ID | User type | Year | Method | Consent | Notes |
| --- | --- | --- | --- | --- | --- |
| P01 | HKU student | [fill] | Interview/Task | Yes | [fill] |

Findings synthesis table:

| Finding ID | Need/Pain point | Evidence snippet | Priority | Design response |
| --- | --- | --- | --- | --- |
| F01 | [fill] | [fill] | H/M/L | [fill] |

### Appendix C: Validation log template

| Test ID | Scenario | Expected result | Actual result | Pass/Fail | Notes |
| --- | --- | --- | --- | --- | --- |
| T01 | Create and save project | Project appears in list and preview | [fill] | [fill] | [fill] |
| T02 | Export ZIP and re-import | Full data restored | [fill] | [fill] | [fill] |
