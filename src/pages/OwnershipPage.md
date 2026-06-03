# OwnershipPage

A single-question page in the Green Home Grant eligibility journey that asks the
user about the ownership status of their property. Served at `/ownership`.

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
- **Validation**: an error summary (`govuk-error-summary`) that links to the
  field, an inline error message, and `govuk-form-group--error` on the group.
  The error wording follows the GOV.UK guidance ("Select…" for radios).
- A **section caption** ("About your property") and **hint text** give context.
- **Back link** and two-thirds column width for readability.

## Behaviour / flow

This service is currently **only for owner-occupiers**. Only the first option
(`owner-occupier` — "Yes, I own my property and live in it") can progress.

- **Back** → `/property-type`.
- **Continue with no selection** → shows the validation error, no navigation.
- **Continue as an owner-occupier** → navigates to `/income`.
- **Continue as any other option** (landlord, tenant, shared ownership) → does
  **not** progress. The question (radios and Continue button) is **replaced** by
  a GOV.UK notification banner explaining that the service is for homeowners and
  pointing to other routes to funding (Warm Homes: Local Grant via the Local
  Authority, the Energy Company Obligation scheme, and contacting the local
  council). In this state only a **Back** link is shown; focus moves to the
  banner. Selecting **Back** returns to the question so the user can change their
  answer.

The single eligible answer (`ELIGIBLE_VALUE`) and the banner copy live in
`OwnershipPage.jsx`; update them there if the policy changes.

## Reusable components

This page is built from shared components in `src/components/` so other pages
(including a summary / check-answers page) can reuse them:

- `BackLink` — GOV.UK back link (supports `href` or an in-page `onClick`).
- `ErrorSummary` — the shared error summary box (from `main`); takes
  `errors: [{ message, href }]` and takes focus on mount.
- `RadioField` — a full single-choice question (legend-as-heading, caption,
  hint, inline error, radios) driven by an `options` array.
- `NotificationBanner` — focusable GOV.UK notification banner; body via children.
- `TwoThirdsColumn` — the standard two-thirds content column wrapper.
- `SummaryList` — key/value rows with optional "Change" actions (not yet used).
- `GovukButton` — existing button component, used here as the Continue submit.

## State (current vs. intended)

The selected value is held in local component state (`useState`). The wider app
uses a central `formData` store in `App.jsx` passed to pages as props
(CLAUDE.md §2). A follow-up should lift the `ownership` answer into that store.

## Files

- `OwnershipPage.jsx` — the page component (composed from the components above).
- `OwnershipPage.md` — this document.
