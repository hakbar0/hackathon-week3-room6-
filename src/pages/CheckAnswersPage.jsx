import { useNavigate, Link } from 'react-router-dom';
import { buildSummaryRows } from '../utils/answerLabels';

// GOV.UK "Check answers" pattern: a summary list of every answer with a Change
// link per row, then a submit that moves to the result. Answers are read from
// the central formData (CLAUDE.md §2) — this page stores nothing of its own.

function CheckAnswersPage({ formData = {} }) {
  const navigate = useNavigate();

  const rows = buildSummaryRows(formData);

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/result');
  }

  return (
    <>
      <Link to="/income" className="govuk-back-link">Back</Link>

      <h1 className="govuk-heading-l">Check your answers before sending your application</h1>

      <dl className="govuk-summary-list">
        {rows.map((row) => (
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
            <dd className="govuk-summary-list__actions">
              <Link to={row.href}>
                Change<span className="govuk-visually-hidden"> {row.key.toLowerCase()}</span>
              </Link>
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="govuk-heading-m">Now send your application</h2>
      <p className="govuk-body">
        By submitting this application you are confirming that, to the best of your
        knowledge, the details you are providing are correct.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <button type="submit" className="govuk-button" data-module="govuk-button">
          Accept and send
        </button>
      </form>
    </>
  );
}

export default CheckAnswersPage;
