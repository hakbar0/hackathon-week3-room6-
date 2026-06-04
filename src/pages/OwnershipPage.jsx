import { useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorSummary from '../components/ErrorSummary';

// Q — property ownership. Markup mirrors the Country and EPC pages: central
// state held in App.jsx (passed via props), this page owns only transient
// validation UI. The page never branches on eligibility itself (CLAUDE.md §2):
// on a valid Continue it calls onContinue(answer); App routes via
// src/utils/eligibility.js, sending ineligible answers to the FailurePage.
const OPTIONS = [
  { value: 'owner-occupier', label: 'Yes, I own my property and live in it' },
  {
    value: 'owner-landlord',
    label: 'Yes, I own my property but lease my property to one or more tenants',
  },
  { value: 'tenant', label: 'No, I am a tenant or social housing tenant' },
  { value: 'shared-ownership', label: 'I live in a shared ownership property' },
];

function OwnershipPage({ formData, updateField, onContinue }) {
  const [error, setError] = useState('');
  // Bumped on every failed submit so the error summary remounts and re-takes
  // focus on a second consecutive Continue with no selection.
  const [submitCount, setSubmitCount] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.ownership) {
      setError('Select whether you own your property');
      setSubmitCount((count) => count + 1);
      return;
    }
    setError('');
    onContinue(formData.ownership);
  }

  const describedBy = `ownership-hint${error ? ' ownership-error' : ''}`;

  return (
    <>
      <Link to="/country" className="govuk-back-link">Back</Link>

      {error && (
        <ErrorSummary key={submitCount} errors={[{ message: error, href: '#ownership' }]} />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">
              Do you own your property?
            </h1>
          </legend>

          <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
            <div className="govuk-hint" id="ownership-hint">
              This helps us work out which Green Home Grant improvements you could
              be eligible for.
            </div>

            {error && (
              <p id="ownership-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> {error}
              </p>
            )}

            <div className="govuk-radios" data-module="govuk-radios">
              {OPTIONS.map(({ value, label }, index) => {
                const id = index === 0 ? 'ownership' : `ownership-${index + 1}`;
                return (
                  <div className="govuk-radios__item" key={value}>
                    <input
                      className="govuk-radios__input"
                      id={id}
                      name="ownership"
                      type="radio"
                      value={value}
                      checked={formData.ownership === value}
                      onChange={() => updateField('ownership', value)}
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

export default OwnershipPage;

 