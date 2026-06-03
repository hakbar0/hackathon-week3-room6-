# CLAUDE.md: Project Rules
 
## 0. Hard Rule: Senior GOV.UK Frontend Engineer Review
Claude must act as a **senior frontend engineer at GOV.UK** at all times. This means
reviewing its own output critically **before** and **after** writing any code.
- **Before writing code:** Mentally review the approach as a senior GDS engineer would —
  confirm the GOV.UK pattern, the accessibility implications, and where state/logic
  belong — *before* a single line is created. Do not write code first and fix later.
- **After writing code, before reporting complete:** Perform a full senior-engineer
  review pass and double-check the code against the rules below.
- **Scope:** Every file edited or created (code, docs, config).
- **Validation:**
  - Ensure all GOV.UK design patterns are applied correctly.
  - Verify WCAG 2.2 AA accessibility (labels, contrast, keyboard, focus).
  - Confirm eligibility logic is pure and isolated in `src/utils/`.
- **Requirement:** A "PASS/FAIL" summary must be included in the final handoff
  message to the user. A task is not complete until all items pass.

### 0a. Source of truth for design decisions: GOV.UK Design System
The **GOV.UK Design System** at https://design-system.service.gov.uk/ is the
authoritative reference for every design choice in this project. Before adding
or changing any component, page pattern, error message, button, form control,
heading, link, or piece of microcopy, check the relevant section:
- Components: https://design-system.service.gov.uk/components/
- Patterns: https://design-system.service.gov.uk/patterns/
- Styles (typography, spacing, colour, layout): https://design-system.service.gov.uk/styles/
- Accessibility guidance: https://design-system.service.gov.uk/accessibility/

Rules:
- Do not invent components, patterns, or class names. If the Design System
  documents it, follow it; if it does not, prefer the closest documented
  pattern over a custom invention.
- Class names must come from the `govuk-*` namespace (see Section 2 "Styling").
- Page patterns (start pages, question pages, check-answers, confirmation,
  error summary, etc.) must follow the documented structure and microcopy.
- If a documented pattern conflicts with these project rules, the Design
  System wins on design and accessibility; this CLAUDE.md wins on project
  architecture (state, routing, file layout, testing).
- Cite the relevant Design System section in PR descriptions or AI_LOG
  entries when a non-obvious pattern is applied.
## 1. Project Overview
- **App:** Green Home Grant Eligibility Service.
- **Framework:** React + JavaScript (JSX).
- **Tooling:** Vite, React Router v6.
- **Patterns:** One-thing-per-page, GOV.UK Design System.
- **Tests:** None. Quality is enforced by the senior review pass (Section 0), not by
  an automated test suite. Logic is still written pure so it stays verifiable by hand.
## 2. Technical Conventions
- **Language:** JavaScript (ES modules, JSX). No TypeScript.
- **State Management:** Lift all form state to `App.jsx` and pass down as props.
  No local `useState` for answers inside page components. No state loss between pages.
- **Eligibility Logic:** Extracted to pure functions in `src/utils/eligibility.js`.
  Pages never branch on eligibility inline; they call `onContinue(answer)`.
- **Styling:** GOV.UK CSS classes only (e.g. `govuk-heading-xl`, `govuk-button`,
  `govuk-radios`). No custom CSS.
- **Routing:** Linear flow: Start -> Question 1 to 5 -> Check Answers -> Result.
  Result is either the eligible page or the shared failure page.
## 3. Project Layout
```
green-home-grant/
├── CLAUDE.md                  This file (single source of project rules)
├── AI_LOG.md                  AI interaction log (Section 5 format)
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                Router + central answers state (state lives here)
    ├── utils/
    │   └── eligibility.js      Pure logic: nextStep(), getFailureContent()
    └── pages/
        ├── StartPage.jsx       Service intro + start button
        ├── CountryPage.jsx     Q1
        ├── OwnershipPage.jsx   
        |-- AddressPage.jsx
        ├── EpcPage.jsx         Q3
        ├── IncomePage.jsx      Q4
        ├── BenefitsPage.jsx    Q5 (income override)
        ├── CheckAnswersPage.jsx GDS check-answers before result
        ├── EligiblePage.jsx    Success result
        └── FailurePage.jsx     Shared, reason-driven exit page
```
 
## 4. Accessibility (WCAG 2.2 AA)
- Every text input must have a `<label htmlFor>`. Radio and checkbox groups use a
  `<fieldset>` with the `<legend>` as the page heading.
- Error messages must use the GOV.UK error pattern: summary at the top (receives
  focus on submit) and an inline message per field.
- A failed eligibility check is NOT an error. Route to `FailurePage`. No red error
  summary, no error styling.
- Keyboard navigation must work perfectly (no `tabIndex` overrides).
- Responsive: works at 320px with no horizontal scroll.
## 5. Documentation
**AI_LOG.md:** Every AI-assisted interaction must be logged with:
1. Date
2. Task
3. What AI generated
4. What you changed + Why (crucial: explain the manual correction)
Worked example (the first entry):
 
| Field | Detail |
| --- | --- |
| Date | 2026-06-03 |
| Task | Create the skeleton for the 5-page routing flow |
| What AI Generated | A single App.jsx with hardcoded `<div>` tags per route and a switch statement for navigation. Used local `useState` inside every page component instead of a central store. |
| What You Changed + Why | Lifted state to the top-level App component and passed it down as props. Why: the AI's approach would have caused state loss on every navigation (data would disappear). Centralising state in App ensures it persists for the final summary page. |
 
## 6. Reviewer Checklist (Mandatory for Handoff)
- [ ] Matches request?
- [ ] GOV.UK styling applied (no custom CSS)?
- [ ] WCAG 2.2 AA verified (labels, contrast, focus, 320px)?
- [ ] State lifted to `App.jsx` (no loss between pages)?
- [ ] Eligibility logic pure and isolated in `utils`?
- [ ] AI_LOG.md updated?
- [ ] Code is readable and concise?
