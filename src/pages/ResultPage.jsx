import { Link } from 'react-router-dom';
import {
  checkEligibility,
  ELIGIBLE_COUNTRY,
  ELIGIBLE_OWNERSHIP,
  FULL_FUNDING_INCOME_BANDS,
} from '../utils/eligibility';
import { buildSummaryRows } from '../utils/answerLabels';

// Guidance shown when the applicant is not an owner-occupier (tenant, landlord
// or shared ownership) — privately rented homes can still be funded via the
// Local Authority.
const HOMEOWNER_GUIDANCE = [
  'This service is currently for homeowners.',
  'However, privately rented homes can still be eligible for Warm Homes: Local Grant funding.',
  'Please contact your Local Authority directly if you are a tenant in a privately rented home and your landlord supports your application for Warm Homes: Local Grant.',
  'Please also contact your Local Authority directly if you are a private landlord and support an application for the Warm Homes: Local Grant for your rented property.',
];

// Eligibility result (confirmation page). The decision is computed by the pure
// checkEligibility() over the central formData — this page only renders the
// outcome. A failed check is NOT an error (CLAUDE.md §4): no red styling. A
// positive outcome uses the GOV.UK green confirmation panel; a negative one
// uses a plain heading (GOV.UK does not panel negative results), so no custom
// CSS class is needed beyond what govuk-frontend ships.

const TITLES = {
  eligible: 'You may be eligible for a Green Home Grant',
  'not-eligible': 'You are not eligible for a Green Home Grant',
};

function ResultPage({ formData = {} }) {
  const { outcome, reasons, measures } = checkEligibility(formData);
  const isEligible = outcome === 'eligible';
  const incomeAboveThreshold =
    formData.incomeBand && !FULL_FUNDING_INCOME_BANDS.includes(formData.incomeBand);
  const answerRows = buildSummaryRows(formData);

  return (
    <>
      {isEligible ? (
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">{TITLES[outcome]}</h1>
        </div>
      ) : (
        <h1 className="govuk-heading-xl">{TITLES[outcome]}</h1>
      )}

      {isEligible && (
        <>
          <p className="govuk-body">
            Based on your answers, you may be able to get funding towards making
            your home more energy efficient.
          </p>

          <h2 className="govuk-heading-m">What you could get help with</h2>
          <ul className="govuk-list govuk-list--bullet">
            {measures.map((measure) => (
              <li key={measure}>{measure}</li>
            ))}
          </ul>

          <h2 className="govuk-heading-m">What happens next</h2>
          <p className="govuk-body">
            Your local council will review your application and contact you within
            10 working days to arrange a home assessment.
          </p>
        </>
      )}

      {!isEligible && (
        <>
          <h2 className="govuk-heading-m">Why you are not eligible</h2>
          <ul className="govuk-list govuk-list--bullet">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>

          {incomeAboveThreshold && (
            <>
              <p className="govuk-body">
                Your household income must usually be £36,000 a year or less. If you
                earn more than that, you might still be eligible if either:
              </p>
              <ul className="govuk-list govuk-list--bullet">
                <li>you live in a certain postcode area</li>
                <li>someone in your household is getting certain benefits</li>
              </ul>
            </>
          )}

          {formData.ownership && formData.ownership !== ELIGIBLE_OWNERSHIP && (
            <>
              {HOMEOWNER_GUIDANCE.map((paragraph) => (
                <p className="govuk-body" key={paragraph}>{paragraph}</p>
              ))}
            </>
          )}

          <h2 className="govuk-heading-m">Other help that may be available</h2>
          {formData.country && formData.country !== ELIGIBLE_COUNTRY && (
            <p className="govuk-body">
              You might be able to get funding from a different scheme if you live
              in Scotland, live in Wales or live in Northern Ireland.
            </p>
          )}
          <p className="govuk-body">
            You may still be able to get help with energy costs through the{' '}
            <a className="govuk-link" href="https://www.gov.uk/energy-company-obligation">
              Energy Company Obligation scheme
            </a>{' '}
            or by contacting your{' '}
            <a className="govuk-link" href="https://www.gov.uk/find-local-council">
              local council
            </a>
            .
          </p>
        </>
      )}

      <h2 className="govuk-heading-m">Your answers</h2>
      <dl className="govuk-summary-list">
        {answerRows.map((row) => (
          <div className="govuk-summary-list__row" key={row.key}>
            <dt className="govuk-summary-list__key">{row.key}</dt>
            <dd className="govuk-summary-list__value">
              {Array.isArray(row.value)
                ? row.value.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < row.value.length - 1 && <br />}
                    </span>
                  ))
                : row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Print-to-PDF: the browser print engine produces a tagged, accessible
          PDF from this semantic content. The button and the on-screen-only
          navigation link are hidden in print via the app-no-print class. */}
      <div className="app-no-print">
        <button
          type="button"
          className="govuk-button govuk-button--secondary"
          data-module="govuk-button"
          onClick={() => window.print()}
        >
          Save your result as a PDF
        </button>

        <p className="govuk-body">
          <Link to="/check-answers" className="govuk-link">Review your answers</Link>
        </p>
      </div>
    </>
  );
}

export default ResultPage;
