// GOV.UK summary list — key/value pairs with an optional "Change" action per
// row. Ready for a check-answers / summary page.
//
// `rows` is an array of:
//   { key, value, action?: { text, href, onClick?, visuallyHiddenText? } }
function SummaryList({ rows = [] }) {
  return (
    <dl className="govuk-summary-list">
      {rows.map((row) => (
        <div className="govuk-summary-list__row" key={row.key}>
          <dt className="govuk-summary-list__key">{row.key}</dt>
          <dd className="govuk-summary-list__value">{row.value}</dd>
          {row.action && (
            <dd className="govuk-summary-list__actions">
              <a
                className="govuk-link"
                href={row.action.href || '#'}
                onClick={
                  row.action.onClick
                    ? (e) => { e.preventDefault(); row.action.onClick(); }
                    : undefined
                }
              >
                {row.action.text}
                {row.action.visuallyHiddenText && (
                  <span className="govuk-visually-hidden">
                    {' '}{row.action.visuallyHiddenText}
                  </span>
                )}
              </a>
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

export default SummaryList;
