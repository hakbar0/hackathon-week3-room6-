import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Q3 — review-epc. Confirms the Energy Performance Certificate found for the
// address the user chose on the Address page. The address and EPC details are
// read from central state in App.jsx (passed via props); this page owns no
// answer state of its own, only transient validation UI.
function EpcPage({ formData, updateField }) {
  const navigate = useNavigate();
  const { address, epcRating, epcValidUntil } = formData;
  const [error, setError] = useState('');
  const errorSummaryRef = useRef(null);

  // GOV.UK error pattern: the error summary takes focus when it appears.
  useEffect(() => {
    if (error) errorSummaryRef.current?.focus();
  }, [error]);

  // No address means the user has not completed the Address page yet. Send
  // them back rather than showing an empty certificate.
  if (!address) {
    return (
      <>
        <a href="/address" className="govuk-back-link">Back</a>
        <h1 className="govuk-heading-l">We could not find your property</h1>
        <p className="govuk-body">
          You need to enter your address before we can check its energy rating.
        </p>
        <a href="/address" className="govuk-button" role="button" data-module="govuk-button">
          Enter your address
        </a>
      </>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const choice = formData.epcConfirmed;
    if (!choice) {
      setError('Select whether this is the correct property');
      return;
    }
    setError('');
    // "No" sends the user back to correct the address; "Yes" continues the flow.
    navigate(choice === 'yes' ? '/income' : '/address');
  }

  const addressLines = [address.line1, address.line2, address.town, address.postcode]
    .filter(Boolean);

  return (
    <>
      <a href="/address" className="govuk-back-link">Back</a>

      {error && (
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
            <ul className="govuk-list govuk-error-summary__list">
              <li><a href="#epc-confirmed">{error}</a></li>
            </ul>
          </div>
        </div>
      )}

      <h1 className="govuk-heading-l">Check your property&rsquo;s energy rating</h1>

      <p className="govuk-body">
        This is the most recent Energy Performance Certificate (EPC) we found for
        your address. Check the details are correct before you continue.
      </p>

      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Address</dt>
          <dd className="govuk-summary-list__value">
            {addressLines.map((line, i) => (
              <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>
            ))}
          </dd>
          <dd className="govuk-summary-list__actions">
            <a href="/address">
              Change<span className="govuk-visually-hidden"> address</span>
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Energy rating</dt>
          <dd className="govuk-summary-list__value">{epcRating || 'Not found'}</dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
        {epcValidUntil && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Valid until</dt>
            <dd className="govuk-summary-list__value">{epcValidUntil}</dd>
            <dd className="govuk-summary-list__actions"></dd>
          </div>
        )}
      </dl>

      <form onSubmit={handleSubmit} noValidate>
        <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
          <fieldset className="govuk-fieldset" aria-describedby={error ? 'epc-confirmed-error' : undefined}>
            <legend className="govuk-fieldset__legend">
              <h2 className="govuk-heading-m">Is this the correct property?</h2>
            </legend>

            {error && (
              <p id="epc-confirmed-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> {error}
              </p>
            )}

            <div className="govuk-radios" data-module="govuk-radios">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="epc-confirmed"
                  name="epcConfirmed"
                  type="radio"
                  value="yes"
                  checked={formData.epcConfirmed === 'yes'}
                  onChange={() => updateField('epcConfirmed', 'yes')}
                />
                <label className="govuk-radios__label" htmlFor="epc-confirmed">
                  Yes, this is my property
                </label>
              </div>
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="epc-confirmed-no"
                  name="epcConfirmed"
                  type="radio"
                  value="no"
                  checked={formData.epcConfirmed === 'no'}
                  onChange={() => updateField('epcConfirmed', 'no')}
                />
                <label className="govuk-radios__label" htmlFor="epc-confirmed-no">
                  No, I need to change the address
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <button type="submit" className="govuk-button" data-module="govuk-button">
          Continue
        </button>
      </form>
    </>
  );
}

export default EpcPage;
