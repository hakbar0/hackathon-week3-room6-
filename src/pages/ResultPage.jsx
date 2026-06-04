import { Link } from 'react-router-dom';
import { checkEligibility } from '../utils/eligibility';

// Eligibility result (confirmation page). The decision is computed by the pure
// checkEligibility() over the central formData — this page only renders the
// outcome. A failed check is NOT an error (CLAUDE.md §4): no red styling. A
// positive outcome uses the GOV.UK green confirmation panel; a negative one
// uses a plain heading (GOV.UK does not panel negative results), so no custom
// CSS class is needed beyond what govuk-frontend ships.

const TITLES = {
  eligible: 'You may be eligible for a Green Home Grant',
  partial: 'You may be eligible for partial funding',
  'not-eligible': 'You are not eligible for a Green Home Grant',
};

function ResultPage({ formData = {} }) {
  const { outcome, reasons, measures } = checkEligibility(formData);
  const isPositive = outcome === 'eligible' || outcome === 'partial';

  return (
    <>
      {isPositive ? (
        <div className="govuk-panel govuk-panel--confirmation">
          <h1 className="govuk-panel__title">{TITLES[outcome]}</h1>
        </div>
      ) : (
        <h1 className="govuk-heading-xl">{TITLES[outcome]}</h1>
      )}

      {isPositive && (
        <>
          <p className="govuk-body">
            Based on your answers, you may be able to get funding towards making
            your home more energy efficient.
          </p>

          {outcome === 'partial' && reasons.length > 0 && (
            <p className="govuk-body">{reasons[0]}</p>
          )}

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

      {!isPositive && (
        <>
          <h2 className="govuk-heading-m">Why you are not eligible</h2>
          <ul className="govuk-list govuk-list--bullet">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>

          <h2 className="govuk-heading-m">Other help that may be available</h2>
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

      <p className="govuk-body">
        <Link to="/check-answers" className="govuk-link">Review your answers</Link>
      </p>
    </>
  );
}

export default ResultPage;
