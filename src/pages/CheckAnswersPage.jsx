import { useNavigate, Link } from 'react-router-dom';

// GOV.UK "Check answers" pattern: a summary list of every answer with a Change
// link per row, then a submit that moves to the result. Answers are read from
// the central formData (CLAUDE.md §2) — this page stores nothing of its own.

// value -> human label maps for the answers captured as coded values.
const COUNTRY_LABELS = {
  england: 'England',
  wales: 'Wales',
  scotland: 'Scotland',
  'northern-ireland': 'Northern Ireland',
};

const INCOME_LABELS = {
  'under-25000': 'Less than £25,000',
  '25000-35999': '£25,000 to £35,999',
  '36000-49999': '£36,000 to £49,999',
  '50000-74999': '£50,000 to £74,999',
  '75000-plus': '£75,000 or more',
};

const OWNERSHIP_LABELS = {
  'owner-occupier': 'Yes, I own my property and live in it',
  'owner-landlord': 'I own it but lease it to tenants',
  tenant: 'No, I am a tenant',
  'shared-ownership': 'Shared ownership',
};

const EPC_CONFIRMED_LABELS = { yes: 'Yes', no: 'No' };

const NOT_ANSWERED = 'Not answered';

function labelFor(map, value) {
  if (!value) return NOT_ANSWERED;
  return map[value] || value;
}

function formatAddress(address) {
  if (!address) return NOT_ANSWERED;
  const lines = [address.line1, address.line2, address.town, address.postcode].filter(Boolean);
  return lines.length ? lines : NOT_ANSWERED;
}

function CheckAnswersPage({ formData = {} }) {
  const navigate = useNavigate();

  const rows = [
    { key: 'Country', value: labelFor(COUNTRY_LABELS, formData.country), href: '/country' },
    { key: 'Address', value: formatAddress(formData.address), href: '/address' },
    { key: 'Energy rating', value: formData.epcRating || NOT_ANSWERED, href: '/review-epc' },
    {
      key: 'Property details correct',
      value: labelFor(EPC_CONFIRMED_LABELS, formData.epcConfirmed),
      href: '/review-epc',
    },
    { key: 'Ownership', value: labelFor(OWNERSHIP_LABELS, formData.ownership), href: '/ownership' },
    { key: 'Household income', value: labelFor(INCOME_LABELS, formData.incomeBand), href: '/income' },
  ];

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
