# AddressPage

A single-question page in the Green Home Grant eligibility journey that asks the
user about the ownership status of their property.

## Question

> **Do you own your property?**

| Option label | Stored value |
| --- | --- |
| Yes, I own my property and live in it | `owner-occupier` |
| Yes, I own my property but lease my property to one or more tenants | `owner-landlord` |
| No, I am a tenant or social housing tenant | `tenant` |
| I live in a shared ownership property | `shared-ownership` |

The user picks **one** option (radio buttons) and presses **Continue**.

## GOV.UK Design System standards followed

This page follows the [GOV.UK Design System](https://design-system.service.gov.uk/)
patterns for a "question page":

- **Radios component** (`govuk-radios`) for a single-choice question.
- The question is the page `<h1>`, wrapped in a `<fieldset>` / `<legend>` so
  screen readers announce it as the group label.
- **Validation** uses the standard error pattern:
  - An **error summary** (`govuk-error-summary`) appears at the top of the page
    and links to the field.
  - An **inline error message** (`govuk-error-message`) appears against the
    radios, and the form group gets the `govuk-form-group--error` modifier.
  - The error wording — *"Select whether you own your property"* — follows the
    GOV.UK error message guidance ("Select…" for radios).
  - On error, **focus moves to the error summary** (via a ref + `useEffect`).
- A **section caption** (`govuk-caption-l`, "About your property") and **hint
  text** (`govuk-hint`) give the question context. The hint is linked to the
  fieldset via `aria-describedby`.
- **Back link** (`govuk-back-link`) and two-thirds column width for readability.

## Behaviour / flow

This service is currently **only for owner-occupiers**. Only the first option
(`owner-occupier` — "Yes, I own my property and live in it") can progress.

- **Back** → `/` (home).
- **Continue with no selection** → shows the validation error, no navigation.
- **Continue as an owner-occupier** → currently navigates to `/` (home), as the
  downstream question pages have not been built yet. Update this target once the
  next step exists.
- **Continue as any other option** (landlord, tenant, shared ownership) → does
  **not** progress. The question (radios and Continue button) is **replaced** by
  a GOV.UK notification banner explaining that the service is for homeowners and
  pointing to other routes to funding (Warm Homes: Local Grant via the Local
  Authority, the Energy Company Obligation scheme, and contacting the local
  council). In this state only a **Back** link is shown; focus moves to the
  banner. Selecting **Back** returns to the question so the user can change their
  answer.

The single eligible answer (`ELIGIBLE_VALUE`) and the banner copy live in
`AddressPage.jsx`; update them there if the policy changes.

## State (current vs. intended)

Right now the selected value is held in local component state (`useState`). The
wider app is intended to lift answers into shared form state in `App.jsx` and
pass them down via props (see the `TODO`s there). When that wiring is added,
`AddressPage` should read/write the `ownership` answer from that shared state,
and the Continue target should be pointed at the next question once it exists.

## Reusable components

This page is built from shared, reusable components in `src/components/` so any
future page (including a summary / check-answers page) can reuse them:

- `BackLink` — GOV.UK back link (supports `href` or an in-page `onClick`).
- `ErrorSummary` — the shared error summary box (from `main`); takes
  `errors: [{ message, href }]` and takes focus on mount.
- `RadioField` — a full single-choice question (legend-as-heading, caption,
  hint, inline error, radios) driven by an `options` array.
- `NotificationBanner` — focusable GOV.UK notification banner; body via children.
- `TwoThirdsColumn` — the standard two-thirds content column wrapper.
- `SummaryList` — key/value rows with optional "Change" actions, ready for a
  summary / check-answers page (not yet used by a page).
- `GovukButton` — existing button component, used here as the Continue submit.

## Files

- `AddressPage.jsx` — the page component (composed from the components above).
- `AddressPage.md` — this document.
