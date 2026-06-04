import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import GovukButton from '../components/GovukButton';

function AddressPage({ address, setAddress, onContinue }) {
  const [errors, setErrors] = useState({});
  const errorSummaryRef = useRef(null);

  const updateField = (field) => (event) => {
    setAddress({ ...address, [field]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!address.line1?.trim()) nextErrors.line1 = 'Enter address line 1, typically the building and street';
    if (!address.town?.trim()) nextErrors.town = 'Enter a town or city';
    if (!address.postcode?.trim()) nextErrors.postcode = 'Enter a postcode';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setTimeout(() => errorSummaryRef.current?.focus(), 0);
      return;
    }

    setErrors({});
    onContinue(address);
  };

  const hasErrors = Object.keys(errors).length > 0;
  const errorClass = (field) => (errors[field] ? 'govuk-form-group--error' : '');
  const inputErrorClass = (field) => (errors[field] ? 'govuk-input--error' : '');

  return (
    <>
      <Link to="/ownership" className="govuk-back-link">Back</Link>

      {hasErrors && (
        <div
          ref={errorSummaryRef}
          className="govuk-error-summary"
          aria-labelledby="error-summary-title"
          role="alert"
          tabIndex={-1}
        >
          <h2 id="error-summary-title" className="govuk-error-summary__title">
            There is a problem
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-error-summary__list">
              {errors.line1 && (
                <li><a href="#line1">{errors.line1}</a></li>
              )}
              {errors.town && (
                <li><a href="#town">{errors.town}</a></li>
              )}
              {errors.postcode && (
                <li><a href="#postcode">{errors.postcode}</a></li>
              )}
            </ul>
          </div>
        </div>
      )}

      <h1 className="govuk-heading-xl">What is your address?</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className={`govuk-form-group ${errorClass('line1')}`}>
          <label className="govuk-label" htmlFor="line1">
            Address line 1
          </label>
          {errors.line1 && (
            <p id="line1-error" className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {errors.line1}
            </p>
          )}
          <input
            className={`govuk-input ${inputErrorClass('line1')}`}
            id="line1"
            name="line1"
            type="text"
            autoComplete="address-line1"
            value={address.line1 || ''}
            onChange={updateField('line1')}
            aria-describedby={errors.line1 ? 'line1-error' : undefined}
          />
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="line2">
            Address line 2 (optional)
          </label>
          <input
            className="govuk-input"
            id="line2"
            name="line2"
            type="text"
            autoComplete="address-line2"
            value={address.line2 || ''}
            onChange={updateField('line2')}
          />
        </div>

        <div className={`govuk-form-group ${errorClass('town')}`}>
          <label className="govuk-label" htmlFor="town">
            Town or city
          </label>
          {errors.town && (
            <p id="town-error" className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {errors.town}
            </p>
          )}
          <input
            className={`govuk-input govuk-input--width-20 ${inputErrorClass('town')}`}
            id="town"
            name="town"
            type="text"
            autoComplete="address-level2"
            value={address.town || ''}
            onChange={updateField('town')}
            aria-describedby={errors.town ? 'town-error' : undefined}
          />
        </div>

        <div className={`govuk-form-group ${errorClass('postcode')}`}>
          <label className="govuk-label" htmlFor="postcode">
            Postcode
          </label>
          {errors.postcode && (
            <p id="postcode-error" className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {errors.postcode}
            </p>
          )}
          <input
            className={`govuk-input govuk-input--width-10 ${inputErrorClass('postcode')}`}
            id="postcode"
            name="postcode"
            type="text"
            autoComplete="postal-code"
            value={address.postcode || ''}
            onChange={updateField('postcode')}
            aria-describedby={errors.postcode ? 'postcode-error' : undefined}
          />
        </div>

        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}

export default AddressPage;
