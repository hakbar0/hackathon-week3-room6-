# AI Assistance Log

Record every instance where you use AI to generate, refactor, or debug code. Four fields per entry: what you asked for, what the AI produced, what you changed, and why you changed it.

Document **3+ entries** in your AI_LOG covering **3-5 distinct patterns** from this list -- planning, multi-agent critique, plan-mode scaffolding, refactor, test generation. Aim for variety: an entry that just says "asked Claude to write X" three times doesn't demonstrate AI as a real engineering tool.

## Instance 1: Eligibility logic for married couple's allowance edge case

| Field | Detail |
|-------|--------|
| **Date** | YYYY-MM-DD |
| **Task** | Scaffolded eligibility check for married couple's allowance |
| **What AI Generated** | if/else chain covering 5 scenarios: single owner, joint owner, private renter, housing association renter, and council tenant. Used hardcoded age threshold of 65 for pension-credit eligibility. Did not include civil-partnership status. Error message on ineligible path was generic ("You are not eligible"). |
| **What You Changed + Why** | Removed hardcoded age threshold (was 65, should be state-pension-age variable) -- hardcoded age breaks if policy changes. Added missing civil-partnership case alongside married status -- civil partnership is a legal requirement since 2004. Changed error message from generic to specific ("You are not eligible because your household income exceeds the threshold") -- generic errors do not help users correct their input. |

## Instance 2: GOV.UK start page for the eligibility checker

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-03 |
| **Task** | Build the StartPage component as a GOV.UK-pattern start page. Brief was to follow `CLAUDE.md` (lifted state, govuk-* classes only, no custom CSS) and `PLAN.md` (Warm Homes: Local Grant criteria — England-only, EPC D-G, income ≤ £36k, postcode/benefits override). |
| **What AI Generated** | Full `src/pages/StartPage.jsx`. Used `useNavigate` to send the user to `/country` on Start now click. Structure mirrors the live https://www.gov.uk/apply-warm-homes-local-grant page: H1, lede paragraph (`govuk-body-l`), "What you can get" + bulleted list, "Eligibility" + bulleted list with £36k income threshold and override note, "Check your eligibility" + `GovukButton variant="start"`, "What happens next" mirroring the council 10-working-day wording, "Get help to use the online service" with placeholder 0800 number. Used `govuk-heading-xl` for H1, `govuk-heading-m` for sections, `govuk-list govuk-list--bullet` for lists (the `--bullet` modifier isn't in App.css yet — relies on default `<ul>` disc bullets). Linked Start now to `/country`, which does **not** exist as a route in `App.jsx` yet — clicking it will currently 404. |
| **What You Changed + Why** | _(Fill in after review: what did you change in the AI output before committing, and why?)_ |

## Instance 3: review-epc page (Q3) reading the address from central state

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-03 |
| **Task** | Build `src/pages/EpcPage.jsx` for the `/review-epc` step, modelled on the Warm Homes: Local Grant `questionnaire/review-epc` page. Must take the property address from the Address page (Q2) and follow `CLAUDE.md`: state lifted to `App.jsx`, `govuk-*` classes only, WCAG 2.2 AA. Reference URL could not be scraped (the live service returns a session-timeout page when fetched unauthenticated), so the layout follows the GOV.UK Design System check/confirm + question-page patterns. |
| **What AI Generated** | `EpcPage.jsx` plus wiring in `App.jsx`: a central `formData` `useState` (address, epcRating, epcValidUntil, epcConfirmed) with an `updateField` setter, and a `/review-epc` route passing both as props. The page renders a back link, a `govuk-summary-list` of the address + energy rating + valid-until (with a "Change" action linking to `/address`), then a `Yes / No` radio question "Is this the correct property?". Empty submit triggers the GOV.UK error pattern: an `error-summary` that takes focus, plus an inline `error-message`. "Yes" navigates to `/income`, "No" back to `/address`. A guard renders a "We could not find your property" fallback when `formData.address` is absent. |
| **What You Changed + Why** | (1) Kept the address in `App.jsx` state rather than `EpcPage` local state — CLAUDE.md §2 forbids per-page answer state and the address must survive navigation back to the Address page. (2) Seeded a placeholder address/EPC in `App.jsx` with a comment that the Address page (Q2) populates them — `AddressPage.jsx` does **not** exist yet (the earlier "Add AddressPage" commit only touched docs/config), so `/address` is an unbuilt dependency: the back link, "Change" link and "No" path all point at a route that 404s until AddressPage is built. (3) Used a plain `dl/dt/dd` summary list with only classes defined in `App.css`; the EPC band is shown as text, not the coloured GDS band graphic, because no such component/class exists in this hand-rolled stylesheet. |

## Instance 4: Income Page (one-question-per-page) with GOV.UK validation

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-03 |
| **Task** | Plan-mode scaffolding + implementation of `IncomePage.jsx` ("What is your total household income?") wired into the shared `formData` state and existing routing. |
| **What AI Generated** | A full `IncomePage` using a `fieldset`/`legend` with the `<h1>` as the question, hint text linked via `aria-describedby`, 5 radio options, required-field validation showing a GOV.UK error summary + inline error message, focus moved to the error summary on failure, and `useNavigate` for Back (`/ownership`) and Continue (`/insulation`). Also added a single `formData` `useState` + `updateField(field, value)` helper to `App.jsx`, an additive `.govuk-hint` CSS rule, and props on the `/income` route only. Initial draft stored the selected radio directly into shared `formData` on every change and used the boilerplate plain `<a href>` back link. |
| **What You Changed + Why** | (1) Changed the radio to a local `useState` that is committed to shared `formData` only on a valid Continue (or on Back) — writing global state on every keystroke is noisy and makes "preserve on return" harder to reason about. (2) Replaced the plain `<a href>` Back link with `useNavigate` + `preventDefault` — the boilerplate anchor triggers a full page reload that wipes the in-memory `formData`, breaking value preservation; client-side navigation keeps state. (3) Added a single shared `updateField` helper rather than passing raw `setFormData` everywhere, so each field write can't clobber sibling answers. (4) Limited the `App.jsx` prop wiring to the `/income` route only, leaving all teammate routes/pages untouched, to keep the change isolated. |
## Instance 4: country page (Q1) — England-only eligibility gate

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Build `src/pages/CountryPage.jsx` for the `/country` step (the route `StartPage`'s "Start now" already links to), replicating the live Warm Homes: Local Grant `questionnaire/country` page. Must follow `CLAUDE.md`: state lifted to `App.jsx`, `govuk-*` classes only, WCAG 2.2 AA, and model the established `EpcPage` pattern. Reference URL fetched successfully: heading "Which country is your property located in?", guidance "This service is only available for those who live in England", radios England / Wales / Scotland / Northern Ireland, "Continue" button. |
| **What AI Generated** | `CountryPage.jsx` plus wiring in `App.jsx`: a new `country: ''` field in central `formData`, and a `/country` route passing `formData` + `updateField` as props. The page renders a `Back` link to `/`, the question as the page `<h1>` inside the `<legend>` (GDS single-question pattern), the England-only guidance as a `govuk-hint` linked via `aria-describedby`, the four country radios driven from a `COUNTRIES` array, and a `Continue` button. Empty submit triggers the GOV.UK error pattern: a focus-grabbing `ErrorSummary` plus an inline `govuk-error-message`, with `aria-describedby` extended to the error id. Continue navigates linearly to `/property-type`. |
| **What You Changed + Why** | (1) Used the legend-as-`h1` question-page pattern (`govuk-fieldset__legend--l` + `govuk-fieldset__heading`) rather than the separate-`h1`-plus-`h2`-legend shape `EpcPage` uses — here the question *is* the page title, which is the canonical GDS layout and avoids a redundant heading. (2) Held the answer in `App.jsx` state (no per-page `useState` for the answer) per CLAUDE.md §2 so it survives Back/Forward. (3) Kept navigation linear to `/property-type` and did **not** branch on England-vs-not inline: CLAUDE.md §2/§4 require eligibility logic to live in `src/utils/eligibility.js` and route failures to a shared failure page — neither exists yet, so the England-only gate is left as a flagged follow-up rather than hard-coded into the page. |

## Instance 5: Debugging the broken header after switching to govuk-frontend CSS

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Diagnose why the site header rendered broken once the GOV.UK Design System (`govuk-frontend`) was added and `main.jsx` switched from the hand-rolled `./App.css` to `govuk-frontend/dist/govuk/govuk-frontend.min.css`, then fix it. |
| **What AI Generated** | Diagnosis + fix. Root cause: `GovukHeader.jsx` held a simplified, non-canonical header (a plain-text `GOV.UK` `<a>` inside `govuk-header__container`) that the old App.css happened to style; the real govuk-frontend v6 stylesheet styles a different structure, so the same markup rendered unstyled/misaligned — the CSS swap exposed pre-existing wrong markup rather than corrupting anything. Rewrote `GovukHeader.jsx` to the canonical v6 markup taken from the installed package (`components/header/template-default.html`): `<header class="govuk-template__header">` (banner landmark) → `govuk-header` → `govuk-header__container govuk-width-container` → `govuk-header__logo` → `govuk-header__homepage-link` wrapping the combined crown+GOV.UK `govuk-header__logotype` SVG. |
| **What You Changed + Why** | (1) Sourced the markup from the pinned v6 package on disk, not memory — v6 renamed `govuk-header__link--homepage` (v5) to `govuk-header__homepage-link` and replaced the separate crown image + text with one combined logotype SVG, so guessing would have reproduced the breakage. (2) Converted the SVG to valid JSX (`class`→`className`, self-closed `circle`/`path`) and kept `<title>GOV.UK</title>` + `aria-label="GOV.UK"` for the accessible name. (3) Set the homepage link to `/` (service root) rather than the package default `//gov.uk`, preserving the prior in-app behaviour. (4) Verified with `vite build` (70 modules, success) since the project has no test suite. |

## Instance 6: Mounting the phase banner and footer

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Action the two outstanding `App.jsx` TODOs — mount `PhaseBanner` and `GovukFooter` — following the GOV.UK Design System. |
| **What AI Generated** | Imported both existing components into `App.jsx`, placed `<PhaseBanner phase="Alpha" feedbackHref="#" />` inside `govuk-width-container` immediately before `<main>` (the canonical beforeContent position), and `<GovukFooter />` after the container. Expanded `GovukFooter.jsx` from a single accessibility-statement link to the full "footer with meta" pattern (support-links list + Open Government Licence v3.0 statement with licence SVG + © Crown copyright), and aligned `PhaseBanner` microcopy to GDS wording ("…help us to improve it"). |
| **What You Changed + Why** | (1) Placed the phase banner *inside* `govuk-width-container` rather than between the header and the container as the original TODO suggested — the component uses the plain `govuk-phase-banner` class (no `govuk-width-container` modifier), so it must sit inside the container to align with page content; placing it outside would have left it edge-to-edge with no gutters. (2) Passed `phase="Alpha"` (capitalised) — the `govuk-tag` CSS does not transform case, and GDS renders the tag capitalised. (3) Added the OGL licence + Crown copyright to the footer: these are mandatory on GOV.UK services and the prior minimal footer omitted them; kept the accessibility-statement link (it routes to the existing `AccessibilityStatementPage`) and added a visually-hidden `<h2>Support links</h2>` so the footer nav has an accessible heading. (4) Verified with `vite build` (72 modules, success) as the project has no test suite. |

## Instance 7: Skip to main content link

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Add the GOV.UK "Skip to main content" link. |
| **What AI Generated** | Added `<a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>` as the first child of the `App` fragment (before `GovukHeader`), and gave the existing `<main>` `id="main-content"` so the link targets it. |
| **What You Changed + Why** | (1) Placed the link as the very first focusable element on the page — it must precede the header so it is the first thing keyboard/screen-reader users reach (WCAG 2.4.1 Bypass Blocks). (2) Relied on the existing `initAll()` call in `main.jsx` rather than adding bespoke focus handling — the `data-module="govuk-skip-link"` JS already moves focus (and applies `tabindex="-1"`) to `#main-content` on activation, so no manual `tabindex` override is needed (CLAUDE.md §4). (3) Inlined the one-line static element in `App.jsx` instead of a separate component, since it is page-layout chrome with no props or logic. Verified with `vite build` (success). |

## Instance 8: Service navigation with service name (shown after the start page)

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Add a GOV.UK service navigation bar showing "Check if you can get a Green Home Grant", positioned above the phase banner, appearing only once the user has left the first (start) page. |
| **What AI Generated** | New `src/components/ServiceNavigation.jsx` using the v6 service-name variant (`<section aria-label="Service information" class="govuk-service-navigation" data-module="govuk-service-navigation">` → own `govuk-width-container` → `govuk-service-navigation__service-name` linking the name to `/`). Wired into `App.jsx`: imported `useLocation`, derived `showServiceNav = pathname !== '/'`, and rendered `{showServiceNav && <ServiceNavigation />}` between `GovukHeader` and the `govuk-width-container` that holds the phase banner. |
| **What You Changed + Why** | (1) Placed the component as a sibling *outside* the page `govuk-width-container` rather than inside it — the service-navigation component supplies its own width-container, so nesting it would double the gutters; this also puts it correctly above the phase banner. (2) Gated it on `pathname !== '/'` via `useLocation` rather than a prop threaded through every page — the start page follows the GOV.UK start-page pattern (no service nav), and route-based gating keeps the logic in one place and survives Back/Forward. (3) Used the service-name markup taken from the pinned package (`template-with-service-link.html`) and a plain `<a href="/">` to match the existing header logo link and canonical markup. (4) Verified with `vite build` (success). |

## Instance 9: Check-answers + result pages and pure eligibility logic

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Close the two Minimum Viable Submission pages that existed only as skeletons: the GOV.UK check-answers summary (item 2) and the eligibility confirmation/result page (item 3), plus the pure eligibility logic (CLAUDE.md §2) and unit tests (MVS item 9, ≥5). No pages removed — Country/Address/EPC kept as agreed. |
| **What AI Generated** | `src/utils/eligibility.js` — a pure `checkEligibility(formData)` returning `{ outcome, reasons, measures }` with hard gates (England, owner-occupier, EPC band D–G, income < £36,000). `src/utils/eligibility.test.js` with vitest cases. `CheckAnswersPage.jsx` — a `govuk-summary-list` driven by a row config, value→label maps, a Change `<Link>` per row, and a submit to `/result`. `ResultPage.jsx` — reads `formData`, calls `checkEligibility`, renders the green `govuk-panel--confirmation` for eligible and a plain heading + reasons for not-eligible. Wired `formData` into the `/check-answers` and `/result` routes in `App.jsx`. |
| **What You Changed + Why** | (1) Dropped a custom `govuk-panel--not-eligible` grey-panel class I first reached for — it isn't in `govuk-frontend` (the old `App.css` was removed) and GOV.UK does not panel negative outcomes anyway; a plain `govuk-heading-xl` needs no custom CSS and matches the real pattern. (2) Turned country / ownership / income into hard gates that route straight to `/result` and made income £36,000+ not-eligible (the brief's threshold), guarding each gate on a *truthy* answer so an unanswered question doesn't fail early. (3) Kept the eligibility decision entirely in `utils/` and out of the pages (CLAUDE.md §2): both pages only read state and render. (4) Used `<Link>` for Back and every Change action rather than `<a href>` so client-side navigation preserves the in-memory `formData`. |

## Instance 10: Ownership page (Q) with homeowner-only eligibility gate

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Build the `/ownership` question page ("Do you own your property?" — 4 options) on top of the latest `main`. Only owner-occupiers may continue; every other answer must be shown guidance (Warm Homes: Local Grant via the Local Authority, the Energy Company Obligation scheme) and cannot progress. Must follow the existing page conventions — use the Country and EPC pages as the template. |
| **What AI Generated** | `OwnershipPage.jsx` first built in a different style (local working-copy state, inline error-summary block, `govuk-heading-l` legend, a custom notification-banner for the ineligible path) plus a set of bespoke reusable components (RadioField, NotificationBanner, BackLink, etc.) and hand-rolled `App.css` additions. Wired `/ownership` into `App.jsx` with `formData`/`updateField` props and added `ownership` to the central store. |
| **What You Changed + Why** | (1) Rebased onto the updated `main` (now on the real `govuk-frontend` package + vitest) and **preferred main everywhere** — deleted my bespoke components and dead `App.css`/`vite.config` edits, since main owns those patterns and I only wanted ownership to fit in. (2) Rewrote the page to **mirror `CountryPage`/`EpcPage` exactly**: answer held in central state (no local copy), shared `ErrorSummary` component with `key={submitCount}` for focus, `legend--l` + `govuk-fieldset__heading` for the `<h1>`, `govuk-label govuk-radios__label`, plain `govuk-button`. (3) Replaced the custom notification-banner ineligible view with the **EpcPage "cannot proceed" layout** (`<h1>` + `govuk-body`), so the text style matches the rest of the service. (4) Aligned `IncomePage`'s heading to the same `legend--l`/`fieldset__heading` pattern for consistency. (5) Dropped accidental `package-lock.json` churn before pushing so the diff stays scoped to the feature. |

## Instance 10: PR #7 review fixes — extract eligibility, route the failure page

| Field | Detail |
|-------|--------|
| **Date** | 2026-06-04 |
| **Task** | Address reviewer feedback on the ownership PR: (1) eligibility logic hard-coded inline should move to pure functions in `src/utils/eligibility.js`; (2) the ineligible "guidance" used local `showGuidance` state instead of a route, so it was not bookmarkable and lost on refresh; (3) a fake `<a href="#">` back link; (4) service-name inconsistency; (5) no tests for the branching logic. |
| **What AI Generated** | New `src/utils/eligibility.js` (`isOwnershipEligible`, `ownershipNextStep`, `getFailureContent` + reason-keyed content) and `src/pages/FailurePage.jsx` (reason-driven via `/not-eligible/:reason`, no error styling, real `<Link>`). Rewrote `OwnershipPage` to drop the inline branch/`showGuidance` and instead call `onContinue(answer)`; wired `App.jsx` to route via `ownershipNextStep`. Added `eligibility.test.js` and `OwnershipPage.test.jsx`. |
| **What You Changed + Why** | (1) Moved the homeowner check into pure `eligibility.js` per CLAUDE.md §2 (pages never branch inline; logic stays unit-testable). (2) Replaced the local-state guidance with a routed, reason-driven `FailurePage` so the outcome is bookmarkable and survives refresh, and a failed check is treated as an outcome not an error (CLAUDE.md §4). (3) Removed the fake `href="#"` — Back is now a real `<Link>`. (4) Standardised the copy on "Green Home Grant" to match the header/service name. (5) Left shared-ownership as not-eligible but flagged it in code + docs as needing confirmation against the published rules. 15 tests pass; `vite build` succeeds. |
