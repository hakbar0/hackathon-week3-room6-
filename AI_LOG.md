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

## Instance 3

| Field | Detail |
|-------|--------|
| **Date** | |
| **Task** | |
| **What AI Generated** | |
| **What You Changed + Why** | |
