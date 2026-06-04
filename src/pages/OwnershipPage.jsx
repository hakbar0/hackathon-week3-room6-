import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorSummary from '../components/ErrorSummary';

// Q — property ownership. Markup mirrors the Country and EPC pages: central
// state held in App.jsx (passed via props), this page owns only transient
// validation UI. The grant is for owner-occupiers, so this is an eligibility
// gate: any other answer is shown guidance about other routes to funding and
// cannot continue.
const OPTIONS = [
  { value: 'owner-occupier', label: 'Yes, I own my property and live in it' },
  {
    value: 'owner-landlord',
    label: 'Yes, I own my property but lease my property to one or more tenants',
  },
  { value: 'tenant', label: 'No, I am a tenant or social housing tenant' },
  { value: 'shared-ownership', label: 'I live in a shared ownership property' },
];

const ELIGIBLE_VALUE = 'owner-occupier';

function OwnershipPage({ formData, updateField }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // Bumped on every failed submit so the error summary remounts and re-takes
  // focus on a second consecutive Continue with no selection.
  const [submitCount, setSubmitCount] = useState(0);
  const [showGuidance, setShowGuidance] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.ownership) {
      setError('Select whether you own your property');
      setSubmitCount((count) => count + 1);
      return;
    }
    setError('');
    // Owner-occupiers continue; every other answer cannot use this service.
    if (formData.ownership !== ELIGIBLE_VALUE) {
      setShowGuidance(true);
      return;
    }
    navigate('/income');
  }

  // Not eligible: show guidance about other routes to funding, with only a Back
  // link returning to the question (mirrors the EpcPage "cannot proceed" view).
  if (showGuidance) {
    return (
      <>
        <a
          href="#"
          className="govuk-back-link"
          onClick={(event) => {
            event.preventDefault();
            setShowGuidance(false);
          }}
        >
          Back
        </a>

        <h1 className="govuk-heading-l">This service is currently for homeowners</h1>

        <p className="govuk-body">
          However, privately rented homes can still be eligible for Warm Homes:
          Local Grant funding.
        </p>
        <p className="govuk-body">
          Please contact your Local Authority directly if you are a tenant in a
          privately rented home and your landlord supports your application for
          Warm Homes: Local Grant.
        </p>
        <p className="govuk-body">
          Please also contact your Local Authority directly if you are a private
          landlord and support an application for the Warm Homes: Local Grant for
          your rented property.
        </p>

        <h2 className="govuk-heading-m">
          You might be able to get help from your energy supplier
        </h2>
        <p className="govuk-body">
          Check if you are eligible for the{' '}
          <a className="govuk-link" href="https://www.gov.uk/energy-company-obligation">
            Energy Company Obligation scheme
          </a>.
        </p>

        <h2 className="govuk-heading-m">Contact your Local Authority</h2>
        <p className="govuk-body">
          Your local council might have additional grants or supports available.
          Contact them to find out more or{' '}
          <a className="govuk-link" href="https://www.gov.uk/find-local-council">
            visit their website
          </a>.
        </p>
      </>
    );
  }

  const describedBy = `ownership-hint${error ? ' ownership-error' : ''}`;

  return (
    <>
      <Link to="/property-type" className="govuk-back-link">Back</Link>

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
