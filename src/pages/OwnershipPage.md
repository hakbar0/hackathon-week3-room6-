# OwnershipPage

Question page (`/ownership`) asking **"Do you own your property?"** Follows the
Country/EPC page conventions: central state via `{ formData, updateField }`
props (no local answer state — `onChange` writes straight to `formData`),
`legend--l` + `govuk-fieldset__heading` for the page `<h1>`, the shared
`ErrorSummary` component (`key={submitCount}` so it remounts and re-takes focus),
and a plain `govuk-button`.

## Options → stored value (`formData.ownership`)

| Option | Value |
| --- | --- |
| Yes, I own my property and live in it | `owner-occupier` |
| Yes, I own my property but lease my property to one or more tenants | `owner-landlord` |
| No, I am a tenant or social housing tenant | `tenant` |
| I live in a shared ownership property | `shared-ownership` |

## Eligibility (CLAUDE.md §2 — no inline branching)

The page never decides eligibility itself. On a valid Continue it calls
`onContinue(formData.ownership)`. `App.jsx` routes via
`src/utils/eligibility.js`:

- `ownershipNextStep('owner-occupier')` → `/income`
- any other answer → `/not-eligible/not-homeowner` (the shared `FailurePage`,
  reason-driven via `getFailureContent('not-homeowner')`)

A failed check is **not** an error — `FailurePage` shows guidance (Local
Authority, Energy Company Obligation scheme) with no error styling, and a Back
link to the question.

> NOTE: shared-ownership is currently treated as **not eligible**; confirm
> against the published Warm Homes: Local Grant rules (see `eligibility.js`).

## Flow

- **Back** → `/property-type`.
- **No selection + Continue** → error summary (takes focus) + inline error.
- **Valid Continue** → `onContinue(answer)`; App routes to `/income` or the
  failure page.

## Tests

- `src/utils/eligibility.test.js` — the pure branching logic.
- `src/pages/OwnershipPage.test.jsx` — render, validation, and `onContinue`.
