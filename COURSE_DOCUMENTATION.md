# HKU Course Project Documentation Tool: Course Submission Documentation

**Last Updated:** April 21, 2026  
**Accessible Website Link:** https://supernoobcraft.github.io/hku-toolkit/

**Browser Compatibility:** The website is designed for common desktop browsers including Google Chrome, Microsoft Edge, and Safari. Mobile layouts are responsive and usable for viewing and editing workflows. ZIP import/export requires modern Blob and JSZip support, and local evidence persistence depends on IndexedDB availability.

---

## Introduction

### HKU-Related Theme and Purpose

The HKU Course Project Documentation Tool addresses fragmented project evidence: HKU students produce substantial coursework (code, reports, prototypes) scattered across platforms (learning management systems, personal storage, team chats). When preparing internship/scholarship applications or capstone reflections, students must reconstruct work rather than presenting clear evidence.

**Theme:** Academic project portfolio construction for HKU students, consolidating fragmented outputs into coherent, portable format for professional communication.

### Goals and Objectives

1. **Structured Documentation:** Consistent format supporting academic rigor and professional communication
2. **Cognitive Load Reduction:** Minimize repeated effort during portfolio preparation
3. **Flexible Field Structure:** Required fields (completeness) + optional fields (depth)
4. **Portability & Continuity:** Local persistence + ZIP/PDF export workflows
5. **Accessible Design:** Usable interface aligned with web principles (Nielsen, 1994; WCAG 2.2)

---

## Target Users and User Needs Assessment

### User Profile and Characteristics

Primary users: HKU undergraduates/postgraduates summarizing coursework for external audiences. Key characteristics: (1) deadline-driven (application cycles, exam periods), (2) mixed technical confidence (non-programming to engineering students), (3) narrative fluidity (reorder for audiences), (4) data-loss anxiety (draft work concerns), (5) low-friction preference (minimize steps/decisions). Secondary users (mentors, employers, admission officers) informed design for clear English, concise labels, print-ready format.

### Assessment Methods and Rationale

Mixed methods: structured survey (N=6 HKU Year 2 students, all consented) + task walkthroughs (project entry, reordering, export) + iterative friction analysis. Survey quantified priorities; walkthroughs checked whether features actually helped; observation showed where stated preferences and real behavior diverged.

**Sample:** N=6 (Year 2): Arts (2), Engineering (2), Business (1), Education (1). Project volume: 4/6 with 3–5 projects/semester; 2/6 with 1–2 projects/semester.

### Assessment Results and Design Implications

**Key Findings:**
- File fragmentation (4.17/5): Led to ZIP/IndexedDB persistence features
- Data-loss anxiety (5 mentions): Implemented 3-minute autosave, history snapshots, recovery-on-load
- Narrative flexibility needs: Drag reordering + sort dropdown + directional buttons (↑/↓)
- Low-friction preference (4 mentions): 6 required fields (course code, name, year, term, type, title) + progressive disclosure
- Post-graduation access (4.00/5): Dual export (ZIP backup, PDF submission)

**Design Principle Integration:**
These findings directly shaped implementation through a Human-Centered Design approach, Nielsen's (1994) usability heuristics (user control/freedom via undo and history; visibility via autosave indicator), and web authoring principles (less is more, keep your promises). Preset templates support reuse; manual + sorted organization supports user choice.

**Critical Reflection:** Survey (N=6, all Year 2) yields directional rather than representative findings. Convenience sampling may skew toward digitally-engaged students. Results may not generalize to postgraduate or non-technical faculties. Consistent signal strength (3.17–4.17/5 means) justified prioritizing reliability and export-first approaches.

---

## Website Creation Methods and Tools

### Development Methodology

Iterative feature-driven approach: (1) stable, extensible data model for projects, (2) form capture + validation, (3) live preview for feedback, (4) persistence + recovery mechanisms, (5) portability (ZIP/PDF), (6) usability/accessibility refinement.

### Technology Stack and Rationale

**Technologies:** HTML (semantic structure: fieldset, legend, labels) | CSS (responsive two-column layout, themes, print styling) | JavaScript (state management, autosave, history, sorting, import/export) | JSZip (in-browser ZIP without server) | GitHub Pages (static deployment, version control)

**Rationale:** Prioritizes transparency and maintainability for coursework review; eliminates server dependencies (reduces operational risk); supports incremental development and debugging (Fielding & Taylor, 2002).

### AI-Supported Development Tools

AI-supported tools were used as **development assistance**, not autonomous authority. Practical contributions included:

1. **Code Drafting:** Assistance with repetitive JavaScript UI patterns and event-handling logic
2. **Debugging Support:** Collaborative problem-solving during state-synchronization and event-flow issues
3. **Wording Refinement:** Content optimization for user-facing text, helper content, and error messages
4. **Implementation Comparison:** Rapid evaluation of alternative approaches before manual final review

**Critical Approach:** All AI-assisted outputs underwent human validation for correctness, scope alignment, and behavioral consistency.

---

## Web Usability

### Core Usability Principles Applied

**Nielsen's (1994) Heuristics Implemented:**
1. Visibility of system status: Autosave indicator, status bar messages, confirmation dialogs
2. Match with real world: Student vocabulary (course code, problem statement, narrative) vs. technical jargon
3. User control/freedom: Undo, manual drag reordering, cancel buttons, explicit confirmations
4. Consistency: Uniform form layouts, button placement, validation patterns
5. Error prevention: Dropdown selectors, field validation, disabled submit when required fields empty
6. Flexibility: Directional buttons, sort modes, preset templates reduce re-entry
7. Aesthetic minimalism: Essential UI visible; advanced features in menus

**Web Authoring Principles Applied:** Know users (needs assessment informed priorities) ✓ | Prepare sitemap (main tool, about, help) ✓ | Draw wireframe (split-pane layout) ✓ | Plan content (project lifecycle flow) ✓ | Learn from good sites (Notion, Trello patterns) ✓ | Inform vs. impress (clarity over decoration) ✓ | Less is more (6 required fields, optional narrative) ✓ | Keep promises (ZIP/PDF export delivered as advertised) ✓

### Design Decisions and Features

**Split-Pane Layout:** Left (project management/editing) + right (live preview) reduces cognitive load by maintaining workflow continuity (Norman, 2013).

**Progressive Disclosure:** Editor hidden until needed, reducing initial complexity and supporting bounded decision-making (Shneiderman, 2010).

**Balanced Required/Optional Fields:** 6 required identity fields (course code, name, year, term, type, title) ensure context capture; optional sections (narrative, technical, reflection) enable depth without forcing overhead. Addresses need for complete yet flexible workflows.

**Rich List Organization:** Drag reordering + sort dropdown (7 modes) + directional buttons (↑/↓) support diverse preferences from task walkthroughs.

**Immediate Feedback:** Status bar, autosave indicator, inline errors implement Nielsen's visibility principle.

**Reversibility:** Undo, history snapshots (up to 20), confirmation dialogs reduce anxiety around irreversible loss (primary concern: 5 mentions in survey).

### Usability-Informed Design Decisions

Key design decisions traced to assessed needs: Progressive disclosure (editor hidden until selected) reduces overwhelm for time-constrained users; 6 required identity fields balance consistency with focus; preset templates support application-focused reordering; 3-minute autosave + history support data-loss anxious users; drag + sort + directional buttons accommodate diverse organizational preferences; responsive layout enables mobile entry during lectures.

**Trade-offs:** Requiring 6 identity fields ensures completeness but increases entry effort; optional narrative fields relieve this but depend on user motivation. Progressive disclosure improves initial usability but may hide features from less-experienced users—mitigated by help page and in-app guidance.

---

## Web Accessibility

Accessibility integrated throughout (not deferred), aligned with WCAG 2.2 principles: **Perceivable** (users perceive interface), **Operable** (keyboard/mouse control), **Understandable** (clear, predictable), **Robust** (assistive tech compatible).

### Implementation by WCAG Principle

**Perceivable:** Color contrast WCAG AA (4.5:1 normal, 3:1 large); descriptive alt text on icons; readable 16px base font with zoom support; clear headings (h1–h3) and whitespace.

**Operable:** Full keyboard access (Tab, Enter/Space, arrow keys in selects, Escape to close); focus-visible outlines exceeding AA standards; no time limits on forms; logical tab order with focus containment in modals; skip link to main content.

**Understandable:** Semantic HTML (fieldset, legend, explicit labels); consistent navigation/layout across pages; helper text with examples ("e.g., 'Students lack study management'"); validation errors explain problem + solution; plain language avoids jargon.

**Robust:** ARIA landmarks (main, nav, aside) for screen readers; live regions (role="status" for messages, role="alert" for errors); custom selects preserve keyboard behavior and ARIA semantics; explicit form labeling with aria-required="true".

### User Contexts Informing Accessibility

Diverse contexts justified inclusive design: Library desktops, laptops, shared labs, mobile devices → keyboard access (gloves, trackpads, hands-free) + responsive layout. Mixed technical confidence → progressive disclosure hides advanced features. Students with disabilities (dyslexia, motor impairments, visual impairments, ADD) → screen reader compatibility, keyboard-only operation, reduced-motion support, scannable text.

**Accessibility check note:** WAVE was used for a preliminary scan (AIM Score: 9.6 out of 10).

**Limitation:** Despite the strong preliminary score, no full third-party audit (Axe + screen-reader user testing) has been completed yet. Edge cases in drag-reorder and vestibular-disorder testing remain future work.

---

## Ethical and Cybersecurity Considerations

### Ethical Considerations

**1. Data Ownership and User Autonomy:** Client-side architecture (no cloud storage, no accounts) ensures users retain control via local IndexedDB + explicit exports. Reflects informational autonomy principles; reduces barriers for socioeconomically diverse students (Floridi & Taddeo, 2016).

**2. Transparency in Data Handling:** Privacy policy explicitly explains local storage, no server transmission, export/import workflows. Import overwrite requires confirmation, preventing accidental loss (Peppet, 2014).

**3. Responsible AI Usage:** AI helped with code patterns, debugging, and wording. The final decisions and quality checks stayed with the author, and the About page notes that clearly.

**4. Fairness in Skill Representation:** Optional skills summary uses keyword extraction (not AI inference). Users control inclusion/exclusion. Protects against algorithmic misrepresentation in hiring/scholarship contexts (Introna & Nissenbaum, 2000).

**5. Accessibility as Ethical Obligation:** WCAG alignment reflects commitment to equal access, not compliance checkbox.

### Cybersecurity Awareness

**1. Injection Prevention:** Text sanitized via `.textContent`/`.appendChild()` (not `innerHTML`), preventing XSS in shared portfolios (OWASP Foundation, 2021).

**2. Import Trust Boundaries:** ZIP imports validate manifest structure, reject malformed bundles with clear error messages.

**3. Data Minimization:** No collection of email/profile beyond user-entered project descriptions = no breach surface (McGraw, 2006).

**4. Storage Isolation:** IndexedDB keys scope-namespaced by course/project identifiers, reducing cross-project leakage on shared origins.

**5. Local Device Risk (Transparent):** Storage exclusively local = device compromise remains residual risk. Privacy page advises clearing storage on shared computers. Honesty about limitations aligns with threat modeling principles (McGraw, 2006).

**Trade-off Reflection:** Production systems would add CSP headers, rate limiting, audit logging. For educational client-side tool, above measures balance security awareness with feasible implementation. Transparency about limitations is itself responsible practice.

---

## Limitations and Future Improvements

### Current Limitations

1. **User Research Scope (N=6, all Year 2):** Convenience sample via single platform likely skewed toward digitally-engaged students. Postgraduate/low-tech-confidence learners underrepresented. Results directional only.

2. **Faculty Inference:** Course-code prefix mapping (e.g., "COMP" → Engineering) cannot accommodate all course variations or interdisciplinary offerings. Fallback to manual input creates friction.

3. **Accessibility Testing:** Designed per WCAG principles but no formal third-party audit (WAVE, Axe) or testing with real assistive-technology users completed. Drag-reorder and vestibular-disorder edge cases remain untested.

4. **Import Merge:** ZIP import is replacement-only; conflict resolution unavailable. Multi-device portfolio updates require manual reconciliation.

5. **Skills Extraction:** Keyword-based matching misses domain terminology not in predefined list (e.g., "reinforced concrete beam" → "beam" not recognized as civil engineering skill).

6. **PDF Rendering:** Output quality varies across browsers/platforms; desktop printing remains superior for professional documents.

7. **Cross-Device Access:** Manual export/import required; no automatic synchronization (intentional for privacy). Creates friction for iterative work.

### Future Improvements

1. **Merge Mode:** Conflict-resolution dialogs for non-destructive multi-device portfolio updates
2. **Expanded Research:** N=15–20 participants across year levels and faculties
3. **WCAG Verification:** Formal audits + user testing with assistive-technology users
4. **Keyboard Reordering:** Cut/paste alternatives to support non-mouse workflows
5. **Rich Metadata:** Caption, tagging, and semantic-schema support (JSON-LD)
6. **Encrypted Backup:** Password-protected local packages for additional security assurance
7. **Privacy-Preserving Analytics:** Opt-in usage diagnostics without identifying data
8. **Course-Code API Integration:** Community-maintained mapping or HKU public catalog connection

**Trade-off:** Current version prioritizes reliability and export robustness; future iterations should expand accessibility verification (highest user impact) and research depth.

---

## Image Placement Guidance

**[INSERT IMAGE 1 - Line after "Introduction" subsection]:** Screenshot of main interface overview showing topbar, project collection panel on left, and live preview panel on right. Make HKU context obvious by showing real-looking entries such as "COMP2113 Software Engineering" or "CHIN1001 Chinese Language". Annotate project list, add project button, preview pane, and autosave status indicator.

**[INSERT IMAGE 2 - After "User Profile and Characteristics" subsection]:** Annotated screenshot of the project editor form showing required fields (course code, course name, academic year, term, project type, project title) and optional sections (HKU Context, Narrative, Reflection, Evidence). Use a clearly HKU-style sample (e.g., course code "ENGG1330", term "Semester 1", project title tied to HKU coursework).

**[INSERT IMAGE 3 - After "Design Decisions and Features" subsection]:** Screenshot of project list showing: (a) drag handle in center, (b) move-up (↑) and move-down (↓) directional buttons for keyboard/mouse control, (c) sort dropdown with options, and (d) 3-dot menu with Edit/Delete/Duplicate actions. Ensure at least two visible HKU-labelled projects so the local context is immediately clear.

**[INSERT IMAGE 4 - After "Keyboard Navigation" bullet]:** Screenshot demonstrating keyboard-visible focus outline on form inputs and skip-to-content link. Include annotation explaining WCAG AA contrast compliance.

**[INSERT IMAGE 5 - After "Responsive and Adaptable Layout" bullet]:** Side-by-side responsive layout comparison—two-column desktop view (≥768px) and single-column mobile view (<768px). Include viewport labels and annotation of reflow behavior.

**[INSERT IMAGE 6 - After "Future Improvement Pathways" subsection]:** Wireframe or mockup sketch of proposed merge-import dialog showing conflict-resolution option selection and data preview. Label the decision points.

---

## Word Count

**Main body (excluding references): Approximately 2,050 words**

---

## References

Fielding, R. T., & Taylor, R. N. (2002). Architectural styles and the design of network-based software architectures. *University of California, Irvine*, Doctoral dissertation.

Floridi, L., & Taddeo, M. (2016). What is data ethics? *Philosophical & Technology*, 29(2), 133–144.

Introna, L. D., & Nissenbaum, H. (2000). Shaping the web: Why the politics of search engines matters. *The Information Society*, 16(3), 169–185.

McGraw, G. (2006). *Software security: Building security in*. Addison-Wesley Professional.

Nielsen, J. (1994). 10 usability heuristics for user interface design. Retrieved from https://www.nngroup.com/articles/ten-usability-heuristics/

Norman, D. A. (2013). *The design of everyday things* (Revised and expanded ed.). Basic Books.

OWASP Foundation. (2021). *OWASP top 10: The ten most critical web application security risks*. Retrieved from https://owasp.org/Top10/

Peppet, S. R. (2014). Regulating the Internet of Things: First steps toward managing discrimination, privacy, security, and consent. *Texas Law Review*, 93, 85–176.

Rubin, J., & Chisnell, D. (2008). *Handbook of usability testing: How to plan, design, and conduct effective tests* (2nd ed.). Wiley.

Shneiderman, B. (2010). *Designing the user interface: Strategies for effective human-computer interaction* (5th ed.). Pearson.

World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*. Retrieved from https://www.w3.org/TR/WCAG22/
