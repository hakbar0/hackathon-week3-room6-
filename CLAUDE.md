# CLAUDE.md: Project Rules
 
## 0. Hard Rule: Senior Engineer Review
Before reporting any task complete, Claude must perform a senior-engineer review pass.
- **Scope:** Every file edited or created (code, docs, config).
- **Validation:**
  - Ensure all GOV.UK design patterns are applied correctly.
  - Verify WCAG 2.2 AA accessibility (labels, contrast, keyboard, focus).
  - Confirm eligibility logic is pure and isolated in `src/utils/`.
- **Requirement:** A "PASS/FAIL" summary must be included in the final handoff
  message to the user. A task is not complete until all items pass.
## 1. Project Overview
- **App:** Green Home Grant Eligibility Service.
- **Framework:** React + TypeScript.
- **Tooling:** Vite, React Router v6.
- **Patterns:** One-thing-per-page, GOV.UK Design System.
- **Tests:** None. Quality is enforced by the senior review pass (Section 0), not by
  an automated test suite. Logic is still written pure so it stays verifiable by hand.
## 2. Technical Conventions
- **Language:** TypeScript (strict mode, no `any`).
- **State Management:** Lift all form state to `App.tsx` and pass down as props.
  No local `useState` for answers inside page components. No state loss between pages.
- **Eligibility Logic:** Extracted to pure functions in `src/utils/eligibility.ts`.
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
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx                Router + central answers state (state lives here)
    ├── types.ts               Answers, Country, Ownership, Epc, FailureReason
    ├── utils/
    │   └── eligibility.ts      Pure logic: nextStep(), getFailureContent()
    └── pages/
        ├── StartPage.tsx       Service intro + start button
        ├── CountryPage.tsx     Q1
        ├── OwnershipPage.tsx   Q2
        ├── EpcPage.tsx         Q3
        ├── IncomePage.tsx      Q4
        ├── BenefitsPage.tsx    Q5 (income override)
        ├── CheckAnswersPage.tsx GDS check-answers before result
        ├── EligiblePage.tsx    Success result
        └── FailurePage.tsx     Shared, reason-driven exit page
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
- [ ] State lifted to `App.tsx` (no loss between pages)?
- [ ] Eligibility logic pure and isolated in `utils`?
- [ ] AI_LOG.md updated?
- [ ] Code is readable and concise?
