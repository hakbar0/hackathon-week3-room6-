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
