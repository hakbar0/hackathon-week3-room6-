import { useEffect, useRef } from 'react';

// Reusable GOV.UK error summary. Render it only when there are errors; it
// takes focus on mount so keyboard and screen-reader users are moved to the
// list of problems, then each link jumps to the field via its in-page anchor.
// errors: array of { message, href } where href is a "#field-id" fragment.
function ErrorSummary({ errors }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  if (!errors || errors.length === 0) return null;

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      ref={ref}
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          {errors.map((error, i) => (
            <li key={i}><a href={error.href}>{error.message}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ErrorSummary;
