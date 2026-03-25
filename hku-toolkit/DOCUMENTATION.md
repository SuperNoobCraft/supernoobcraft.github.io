# HKU Course Project Documentation Tool: Process Documentation (Draft)

Website link: https://supernoobcraft.github.io/hku-project-tool/

Browser compatibility statement: This website is designed to run on major desktop browsers, including Google Chrome, Microsoft Edge, and Safari. Mobile layouts are responsive and functional for viewing and light editing tasks.

## Introduction

This project is an HKU-related, user-centered web tool that helps students document academic projects in a structured and exportable way. The main theme is academic and professional portfolio building in a university context. Many students complete substantial coursework and project-based assignments, but their evidence is often scattered across notebooks, slide decks, chat threads, and old files. This creates a practical problem when they need to prepare internship applications, exchange applications, capstone reflections, or portfolio summaries in a short time.

The website aims to solve this by offering a lightweight documentation workflow that does not depend on account registration or a backend system. Users can create multiple project entries, edit them over time, reorder them, and export the full collection as a ZIP bundle (for backup and transfer) or PDF (for submission and review).

The goals of the website are:

1. Help HKU students capture project information in a consistent, professional format.
2. Reduce the time needed to prepare portfolio-ready summaries.
3. Support both quick entry and detailed reflection through required and optional fields.
4. Ensure data portability through export/import features.
5. Improve usability and accessibility through clear structure, keyboard support, and theme options.

The website is intentionally scoped for coursework constraints and practical use: client-side only, no server infrastructure, and no personal account dependency.

Screenshot placeholder (annotated):
- Figure 1. Homepage layout showing left project collection panel and right live preview.
- Suggested annotation points: top navigation, New Project button, card list, preview panel, per-item theme controls.
- Insert image path here after capture: [Figure 1 image link]

## Target Users and User Needs Assessment

### Target users

The primary target users are HKU undergraduate and postgraduate students who need to present their academic project experience in structured form for professional or academic purposes. Their characteristics include:

1. Time-constrained and deadline-driven behavior.
2. Mixed levels of technical confidence, from non-programmers to computing students.
3. Need for fast editing, revision, and export.
4. Need to preserve work across sessions without complicated setup.
5. Preference for clear, low-friction interfaces with minimal unnecessary fields.

Secondary users include course instructors or external reviewers who may inspect outputs. For this reason, the content and output format are designed to be mostly in English and easy to read.

### Planned user needs assessment method

This documentation is a temporary draft before final data collection. The planned user-needs assessment will use convenience sampling and snowball sampling with 5-10 participants from classmates and peers. A mixed qualitative approach is recommended:

1. Short open-ended questionnaire for breadth.
2. Semi-structured interviews for depth.

This approach is suitable because the sample size is small and the project emphasizes actionable design insight rather than statistical generalization.

### Ethical procedure for data collection

Before questionnaire or interview participation, each participant should review and consent to an informed consent statement. The form should describe:

1. Purpose of data collection.
2. Voluntary participation and right to withdraw.
3. What data will be recorded.
4. How data will be stored and used in coursework documentation.
5. Whether quotations may be used in anonymized form.

### Survey and interview instrument design (ready-to-use)

Proposed open-ended questionnaire items:

1. When you prepare a portfolio or internship application, what project details are hardest to organize?
2. What information do you think must be included in a good project summary?
3. What makes a project documentation website frustrating or difficult for you?
4. If you could remove one step from a documentation workflow, what would it be?
5. How important are import/export options for your workflow? Why?
6. In what situations would dark mode or light mode matter to you?
7. What accessibility issues have you faced when using academic websites?
8. What privacy concerns do you have when entering project content online?

Proposed semi-structured interview prompts:

1. Walk me through your current process for documenting course projects.
2. Show where delays or repeated effort happen in your current process.
3. Which fields feel essential, and which feel unnecessary?
4. How do you decide project ordering in a portfolio?
5. How do you prefer to review and edit text before final export?
6. What would make you trust a client-side tool for sensitive academic content?
7. What would make the tool feel inclusive for different users and contexts?

### Results section template (to fill later)

Leave this section empty until real data is collected.

Planned reporting structure:

1. Participant profile summary (N, role, study year).
2. Top recurring needs (at least 5 themes).
3. Pain points ranked by frequency and severity.
4. Evidence quotes (anonymized).
5. Design implications linked to implementation decisions.

Placeholder table:

| Finding ID | User need / pain point | Evidence quote | Priority | Design response |
| --- | --- | --- | --- | --- |
| F1 | [To be filled] | [To be filled] | [H/M/L] | [To be filled] |
| F2 | [To be filled] | [To be filled] | [H/M/L] | [To be filled] |
| F3 | [To be filled] | [To be filled] | [H/M/L] | [To be filled] |

## Website Creation Methods and Tools

The website was built with standard frontend web technologies: HTML, CSS, and JavaScript.

Method and tool choices:

1. HTML for semantic page structure and form architecture.
2. CSS for responsive layout, visual hierarchy, print styling, and dark/light theming.
3. JavaScript for data model handling, list interactions, import/export workflows, autosave logic, and dynamic preview updates.
4. GitHub Pages for static deployment and public accessibility.

Justification:

1. The assignment allows flexible tool selection; this stack provides full transparency and control over usability and accessibility decisions.
2. Client-side architecture minimizes operational complexity and suits a coursework timeline.
3. Static hosting is cost-effective and easy for external inspection.

### AI-supported tools usage

AI tools were used only to assist implementation and iteration speed, including code drafting, UI troubleshooting, and wording refinements. AI was not used as an autonomous source of unverified claims. All generated suggestions were manually reviewed, edited, and validated against assignment requirements and actual website behavior.

Practical contributions from AI assistance:

1. Faster prototyping of layout and component structures.
2. Debugging support for interaction issues.
3. Drafting and revising helper content for subpages.

Human oversight was maintained for scope control, requirement alignment, and final quality assurance.

Screenshot placeholder (annotated):
- Figure 2. Project editor with required and optional sections.
- Suggested annotation points: required markers, optional text areas, conditional team fields, save actions.
- Insert image path here after capture: [Figure 2 image link]

## Web Usability

Usability decisions were guided by common web usability principles such as visibility of system status, consistency, match to user goals, error prevention, and low cognitive load.

### Major usability decisions

1. Two-column layout for workflow continuity.
	The left panel supports collection management and editing actions, while the right panel provides immediate preview feedback. This reduces context switching and supports iterative writing.

2. Progressive disclosure in the editor.
	The editor stays hidden until New Project or Edit is selected. This avoids overwhelming users at first load and keeps entry conditions clear.

3. Required vs optional content balance.
	Core fields are required for structural completeness, while narrative and reflection fields are optional to support different user effort levels.

4. Collection-level actions with clear labels.
	Import/Export controls use explicit button names to reduce ambiguity and avoid accidental misuse.

5. Reordering via drag interactions.
	Drag-and-drop ordering aligns with common list organization behavior and supports portfolio storytelling needs.

6. Per-item visual theming for clearer exports.
	Users can assign a theme to the portfolio header and each project item independently, helping related projects stand out while preserving a cohesive final document.

7. Autosave and session recovery.
	Local persistence reduces frustration caused by accidental refresh or tab closure.

8. Status feedback and error messages.
	A live status area and inline error summaries provide direct feedback after user actions.

### How user needs informed these decisions

Expected user needs include fast input, low friction, and confidence in output quality. Therefore:

1. Quick-entry users can complete only essential fields.
2. Detail-oriented users can add optional narrative depth.
3. Users preparing deadlines can rely on immediate preview and export readiness.

Future survey data will validate whether these assumptions match real user behavior.

Screenshot placeholder (annotated):
- Figure 3. Project list card actions and drag reorder state.
- Suggested annotation points: drag handle, 3-dot menu, active card state, status message.
- Insert image path here after capture: [Figure 3 image link]

## Web Accessibility

Accessibility was considered as a first-order requirement rather than a post-hoc add-on. Design and implementation decisions were made to improve perceivability, operability, and readability.

### Accessibility-oriented decisions

1. Keyboard-supportive structure.
	Interactive controls are implemented with native HTML elements where possible.

2. Skip link for faster navigation.
	A skip-to-main-content link helps keyboard and assistive technology users bypass repeated navigation.

3. Focus visibility.
	Inputs and buttons use visible focus outlines for keyboard navigation clarity.

4. Semantic grouping.
	Fieldsets and legends are used to structure long forms into meaningful chunks.

5. Live region messaging.
	Status and error messaging uses live regions for immediate non-visual feedback.

6. Color-theme flexibility.
	Light and dark modes support app-level viewing comfort, while preview/export uses item-level theme styling with a light-default baseline for print consistency.

7. Responsive behavior.
	The layout adapts to narrow viewports to preserve readability and interaction targets.

### Standards-informed rationale

The implementation is aligned with practical interpretations of WCAG-oriented principles, especially around keyboard access, clear labels, visible focus, and robust contrast intent. A future formal accessibility check can include structured testing against WCAG 2.2 AA success criteria.

### How user needs inform accessibility decisions

Students use the tool in different contexts, including library spaces, dorm environments, laptops, and phones. This supports decisions for theme options, responsive layout, and reduced interaction complexity.

Screenshot placeholder (annotated):
- Figure 4. Keyboard focus ring and skip link behavior.
- Suggested annotation points: focus outline, skip link target, logical reading order.
- Insert image path here after capture: [Figure 4 image link]

## Ethical and Cybersecurity Issues and Measures

### Ethical considerations

1. Transparency of AI assistance.
	AI usage is explicitly acknowledged as implementation support only, with human review and control.

2. Data minimization.
	The tool does not require account creation or unnecessary personal identifiers for core functionality.

3. User autonomy.
	Users can export their own data and are not locked into a proprietary platform format.

4. Clarity of data handling.
	Privacy information states local-storage behavior and limitations around browser-managed file inputs.

### Cybersecurity considerations

1. Local-first architecture.
	Since data processing occurs in-browser with no backend API, server-side breach surface is minimized.

2. Input handling and rendering safety.
	User-entered text is sanitized before preview rendering to reduce injection risk in dynamic HTML contexts.

3. Storage risk awareness.
	Local storage can still be read by anyone with local device access, so users are informed to clear site data when needed.

4. Export handling boundaries.
	Imported files are parsed as text with expected structure checks; invalid import formats trigger error handling.

5. Residual risk note.
	Client-side tools cannot guarantee security against compromised devices or malicious browser extensions.

## Limitations and Future Improvement

### Current limitations

1. User-needs evidence is not yet finalized.
	Survey and interview data are pending collection.

2. Accessibility testing is practical but not yet fully audited.
	A full checklist-based WCAG validation and screen-reader walkthrough should be added.

3. Data persistence is browser-local.
	Users may lose data if site storage is cleared unintentionally.

4. Export customization is basic.
	Users can choose per-item themes, but advanced user-defined presets and versioned style profiles are not yet available.

5. Evidence file handling has browser constraints.
	File input binaries are not persistable across refresh in standard browser security models.

### Future improvement directions

1. Add survey-driven design iteration cycles and document evidence-to-change mapping.
2. Add optional non-drag reorder controls for enhanced keyboard accessibility.
3. Add richer print templates for different use cases, such as internship-focused and research-focused output.
4. Add optional local backup reminders and integrity checks.
5. Add multilingual support guidance while maintaining English as the main content language.

## Word Count

Approximate word count (main sections only, excluding Appendix and References): 1,950-2,050 words depending on final survey-result insertion.

## References (APA Style)

Nielsen, J. (1994). 10 usability heuristics for user interface design. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/

World Wide Web Consortium. (2023). Web content accessibility guidelines (WCAG) 2.2. W3C. https://www.w3.org/TR/WCAG22/

OWASP Foundation. (2021). OWASP top 10: The ten most critical web application security risks. https://owasp.org/Top10/

Norman, D. A. (2013). The design of everyday things (Revised and expanded ed.). Basic Books.

International Organization for Standardization. (2019). ISO 9241-11:2018 ergonomics of human-system interaction - Part 11: Usability: Definitions and concepts. https://www.iso.org/standard/63500.html

## Appendix

### Appendix A. Screenshot checklist (to complete)

1. Figure 1: Homepage layout overview.
2. Figure 2: Editor structure and required/optional fields.
3. Figure 3: Project list actions and reorder flow.
4. Figure 4: Accessibility indicators (skip link/focus states).
5. Figure 5: Export flow and print preview.

For each figure, include:

1. Screenshot file name.
2. Valid link/path to image.
3. 2-4 annotation labels.
4. 1-2 sentence caption explaining why the design matters.

### Appendix B. User-needs assessment package checklist

1. Adapted informed consent form.
2. Signed consents or form response records.
3. Raw questionnaire responses.
4. Raw interview notes/transcripts.
5. Anonymization note and data handling statement.

### Appendix C. Survey/interview implementation template

Participant metadata template:

| Participant ID | User group | Year of study | Collection method | Consent received |
| --- | --- | --- | --- | --- |
| P01 | [To be filled] | [To be filled] | [Survey/Interview] | [Yes/No] |

Design-change log template:

| Change ID | Source finding | Implemented change | Why this change helps | Date |
| --- | --- | --- | --- | --- |
| C01 | [To be filled] | [To be filled] | [To be filled] | [To be filled] |
