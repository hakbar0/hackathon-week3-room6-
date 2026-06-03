import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';

const OPTIONS = [
  { value: 'under-25000', label: 'Less than £25,000' },
  { value: '25000-49999', label: '£25,000 to £49,999' },
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
  const errorSummaryRef = useRef(null);

  // Move focus to the error summary when validation fails (GOV.UK pattern).
  useEffect(() => {
    if (showError && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [showError]);

  const handleContinue = () => {
    if (!selected) {
      setShowError(true);
      return;
    }
    updateField('incomeBand', selected);
    navigate('/insulation');
  };

  const handleBack = (event) => {
    event.preventDefault();
    // Keep the in-progress selection so it survives leaving the page.
    if (selected) {
      updateField('incomeBand', selected);
    }
    navigate('/ownership');
  };

  const describedBy = `income-hint${showError ? ' income-error' : ''}`;

  return (
    <>
      <a href="/ownership" className="govuk-back-link" onClick={handleBack}>
        Back
      </a>

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

      <div className={`govuk-form-group${showError ? ' govuk-form-group--error' : ''}`}>
        <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
          <legend className="govuk-fieldset__legend">
            <h1 className="govuk-heading-l">What is your total household income?</h1>
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

          <div className="govuk-radios">
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
                  <label className="govuk-radios__label" htmlFor={id}>
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>

      <GovukButton onClick={handleContinue}>Continue</GovukButton>
    </>
  );
}

export default IncomePage;
