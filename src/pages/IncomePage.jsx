import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import { FULL_FUNDING_INCOME_BANDS } from '../utils/eligibility';

// Bands are split at the £36,000 Warm Homes eligibility threshold (see StartPage)
// so each band maps unambiguously to eligible / not eligible — no band straddles
// the cut-off, which lets the eligibility logic derive a clean pass/fail.
const OPTIONS = [
  { value: 'under-25000', label: 'Less than £25,000' },
  { value: '25000-35999', label: '£25,000 to £35,999' },
  { value: '36000-49999', label: '£36,000 to £49,999' },
  { value: '50000-74999', label: '£50,000 to £74,999' },
  { value: '75000-plus', label: '£75,000 or more' },
];

const ERROR_MESSAGE = 'Select your total household income';
const FIRST_OPTION_ID = 'income-band';

function IncomePage({ formData, updateField }) {
  const navigate = useNavigate();
  // Local working copy; committed to shared state only on a valid Continue.
  // Initialised from shared state so the value is preserved on return visits.
  const [selected, setSelected] = useState(formData.incomeBand || '');
  const [showError, setShowError] = useState(false);
  // Bumped on every failed submit so the focus effect re-runs even when
  // showError is already true — a second consecutive Continue with no
  // selection must move focus back to the error summary.
  const [submitCount, setSubmitCount] = useState(0);
  const errorSummaryRef = useRef(null);

  // Move focus to the error summary when validation fails (GOV.UK pattern).
  useEffect(() => {
    if (showError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [showError, submitCount]);

  const handleContinue = (event) => {
    event.preventDefault();
    if (!selected) {
      setShowError(true);
      setSubmitCount((count) => count + 1);
      return;
    }
    updateField('incomeBand', selected);
    // Income at or below £36,000 continues the flow; £36,000 or more goes
    // straight to the result, where checkEligibility() reports not eligible
    // with the postcode / benefits override guidance.
    navigate(FULL_FUNDING_INCOME_BANDS.includes(selected) ? '/check-answers' : '/result');
  };

  // Keep the in-progress selection so it survives leaving the page via Back.
  const commitSelection = () => {
    if (selected) updateField('incomeBand', selected);
  };

  const describedBy = `income-hint${showError ? ' income-error' : ''}`;

  return (
    <>
      <Link to="/review-epc" className="govuk-back-link" onClick={commitSelection}>
        Back
      </Link>

      {showError && (
        <div
          className="govuk-error-summary"
          aria-labelledby="error-summary-title"
          role="alert"
          tabIndex={-1}
          ref={errorSummaryRef}
        >
          <h2 className="govuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-error-summary__list">
              <li>
                <a href={`#${FIRST_OPTION_ID}`}>{ERROR_MESSAGE}</a>
              </li>
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleContinue} noValidate>
        <div className={`govuk-form-group${showError ? ' govuk-form-group--error' : ''}`}>
          <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
              <h1 className="govuk-fieldset__heading">What is your total household income?</h1>
            </legend>

            <div id="income-hint" className="govuk-hint">
              Include income from employment, benefits, pensions and any other regular
              household income before tax.
            </div>

            {showError && (
              <p id="income-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> {ERROR_MESSAGE}
              </p>
            )}

            <div className="govuk-radios" data-module="govuk-radios">
              {OPTIONS.map((option, index) => {
                const id = index === 0 ? FIRST_OPTION_ID : `income-band-${index + 1}`;
                return (
                  <div className="govuk-radios__item" key={option.value}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name="incomeBand"
                      type="radio"
                      value={option.value}
                      checked={selected === option.value}
                      onChange={(event) => {
                        setSelected(event.target.value);
                        setShowError(false);
                      }}
                    />
                    <label className="govuk-label govuk-radios__label" htmlFor={id}>
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        </div>

        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}

export default IncomePage;
