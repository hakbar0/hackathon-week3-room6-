# Tasks: things to crib from the Warm Homes: Local Grant page

Source: https://www.gov.uk/apply-warm-homes-local-grant

Tick these off while building. Quick wins first — if all you do is the **Start page** and **Result page** sections below, the prototype will already look credible.

---

## Start page (`StartPage.jsx`)

Clone the section order and most of the wording. Swap scheme name only.

- [ ] H1: **"Apply for the Green Home Grant to improve your home"** (`govuk-heading-xl`)
- [ ] Lede paragraph (`govuk-body-l`), copy almost verbatim:
  > "You could get free energy saving improvements made to your home if you're on a low income, getting certain benefits or living in a certain postcode area."
- [ ] Section heading: **"What you can get"** (`govuk-heading-m`) — bulleted list (`govuk-list govuk-list--bullet`):
  - wall, loft and underfloor insulation
  - air source heat pumps
  - smart controls
  - solar panels
- [ ] Section heading: **"Eligibility"** — bullets:
  - be in England
  - be privately owned (either by you or your landlord)
  - have an Energy Performance Certificate (EPC) of D, E, F or G
  - household income must usually be £36,000 a year or less
- [ ] Section heading: **"Check your eligibility and apply"** — green **Start now** button (`govuk-button govuk-button--start`) linking to `/country` (first question)
- [ ] Section heading: **"What happens next"** — short paragraph:
  > "Your local council will usually contact you within 10 working days to get more information and arrange a home survey."
- [ ] Section heading: **"Get help to use the online service"** — placeholder helpline block:
  - Telephone: 0800 000 0000
  - Monday to Friday, 8am to 6pm

---

## Question pages (all `*Page.jsx` under `src/pages/`)

Borrow the GOV.UK question-page pattern, not specific wording (the real form is behind a login).

- [ ] **Back link** at the top of every question page (`govuk-back-link`, before the H1) → `navigate(-1)`
- [ ] **Question as H1**, phrased as a human would say it:
  - "Where is your home?" — not "Country"
  - "Do you own your home?" — not "Ownership status"
  - "What is your home's Energy Performance Certificate (EPC) rating?" — not "EPC rating"
  - "What is your household income?" — not "Income band"
- [ ] **Hint text** under each label (`govuk-hint`) for anything non-obvious. Example for EPC: "Find your EPC rating on the EPC register" with a link out.
- [ ] **Continue** button label (not "Next", not "Submit") (`govuk-button`)
- [ ] **One question per page** — resist combining even when it feels excessive

---

## Result page (`ResultPage.jsx`) — three outcomes, one template

Mirror the "What happens next" shape for each branch. Always offer a next step, never a dead end.

- [ ] **Eligible** outcome → "What happens next":
  > "Your local council will contact you within 10 working days to get more information and arrange a home survey."
- [ ] **Partial / via override** outcome:
  > "You may still be eligible. A council officer will check whether you qualify under the [postcode area / benefits] pathway."
- [ ] **Not eligible** outcome:
  > "Based on your answers you do not qualify for this grant. You may be eligible for other support schemes. To discuss your options, call 0800 000 0000."
- [ ] Outcome rendered in a `govuk-panel govuk-panel--confirmation` (for eligible) or a `govuk-notification-banner` (for partial / not-eligible)

---

## Service furniture (starter already provides components for these)

- [ ] **Phase banner** — `<PhaseBanner phase="alpha" feedbackHref="#" />` mounted in `App.jsx`:
  > "This is a new service – your feedback will help us improve it."
- [ ] **GOV.UK footer** mounted in `App.jsx`, with accessibility-statement link wired to `/accessibility-statement`
- [ ] **Cookies banner** (optional, ~10 min add) — single dismissable banner at top above the phase banner
- [ ] **Helpline placeholder** at the bottom of the start page and the not-eligible result

---

## Tone of voice (apply across all pages)

- [ ] Imperative + second person: "be in England" not "applicants must be located in England"
- [ ] "You could get…" not "Applicants may be entitled to…"
- [ ] Short sentences — aim for the lede's ~28-word feel
- [ ] No marketing words: no "innovative", "exciting", "comprehensive", "seamless"
- [ ] Plain English — read every sentence out loud; if you wouldn't say it, rewrite

---

## What NOT to copy

- [ ] Scheme name stays **"Green Home Grant"** (fictional) — do not use "Warm Homes: Local Grant"
- [ ] Helpline number stays a placeholder (`0800 000 0000`) — never the real `0800 098 7950`
- [ ] No real council names — "your local council" is the right level of generic
- [ ] Note in `AI_LOG.md` that the design mirrors a real gov.uk service for fidelity, but the prototype is fictional

---

## Done definition

If every checkbox above is ticked, the start page and result page will look indistinguishable from a real gov.uk service at a glance — which is what the rubric's "GOV.UK visual compliance — Excellent" column is asking for.
