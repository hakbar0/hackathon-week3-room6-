# OwnershipPage

Question page (`/ownership`) asking **"Do you own your property?"** Follows the
same markup pattern as `CountryPage.jsx` / `EpcPage.jsx`: central state via
`{ formData, updateField }` props (the page owns no answer state of its own —
`onChange` writes straight to `formData`), `legend--l` + `govuk-fieldset__heading`
for the page `<h1>`, the shared `ErrorSummary` component (`key={submitCount}` so
it remounts and re-takes focus), and a plain `govuk-button`.

## Options → stored value (`formData.ownership`)

| Option | Value |
| --- | --- |
| Yes, I own my property and live in it | `owner-occupier` |
| Yes, I own my property but lease my property to one or more tenants | `owner-landlord` |
| No, I am a tenant or social housing tenant | `tenant` |
| I live in a shared ownership property | `shared-ownership` |

## Flow

- **Back** → `/property-type`.
- **No selection + Continue** → error summary (takes focus) + inline error.
- **`owner-occupier` + Continue** → navigates to `/income`.
- **Any other answer + Continue** → **replaces the question** with a guidance
  view (`<h1>` + `govuk-body`, mirroring the EpcPage "cannot proceed" layout):
  "This service is currently for homeowners", pointing to Warm Homes: Local Grant
  (Local Authority), the Energy Company Obligation scheme and the local council.
  Only **Back** is shown, returning to the question. The single eligible value is
  `ELIGIBLE_VALUE` in `OwnershipPage.jsx`.
