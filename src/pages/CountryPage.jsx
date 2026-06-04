import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorSummary from '../components/ErrorSummary';

// Q1 — country. Markup mirrors the live Warm Homes: Local Grant
// questionnaire/country page exactly (fieldset > legend--l > h1, hint, radios).
// The grant is England-only, so this is the first eligibility gate. The answer
// is held in central state in App.jsx (passed via props); this page owns no
// answer state of its own, only transient validation UI.
const COUNTRIES = [
  { value: 'england', label: 'England' },
  { value: 'wales', label: 'Wales' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'northern-ireland', label: 'Northern Ireland' },
];

function CountryPage({ formData, updateField }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // Bumped on every failed submit so the error summary remounts and re-takes
  // focus — a second consecutive Continue with no selection must move focus
  // back to the summary, not leave it on the button.
  const [submitCount, setSubmitCount] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.country) {
      setError('Select which country your property is located in');
      setSubmitCount((count) => count + 1);
      return;
    }
    setError('');
    // Linear flow (CLAUDE.md §2): continue to the next question. England-only
    // eligibility gating belongs in src/utils/eligibility.js once that and the
    // shared failure page exist — it is not branched on inline here.
    navigate('/property-type');
  }

  const describedBy = `country-hint${error ? ' country-error' : ''}`;

  return (
    <>
      <Link to="/" className="govuk-back-link">Back</Link>

      {error && (
        <ErrorSummary key={submitCount} errors={[{ message: error, href: '#country' }]} />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">
              Which country is your property located in?
            </h1>
          </legend>

          <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
            <div className="govuk-hint" id="country-hint">
              This service is only available for those who live in England.
            </div>

            {error && (
              <p id="country-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> {error}
              </p>
            )}

            <div className="govuk-radios" data-module="govuk-radios">
              {COUNTRIES.map(({ value, label }, index) => {
                const id = index === 0 ? 'country' : `country-${index + 1}`;
                return (
                  <div className="govuk-radios__item" key={value}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name="country"
                      type="radio"
                      value={value}
                      checked={formData.country === value}
                      onChange={() => updateField('country', value)}
                    />
                    <label className="govuk-label govuk-radios__label" htmlFor={id}>
                      {label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </fieldset>

        <button type="submit" className="govuk-button" data-module="govuk-button">
          Continue
        </button>
      </form>
    </>
  );
}

export default CountryPage;
