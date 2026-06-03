// GOV.UK two-thirds content column — the standard width for question and
// summary page content. Wrap a page's main content in this for consistent
// line length. The back link is normally placed outside (above) this.
function TwoThirdsColumn({ children }) {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        {children}
      </div>
    </div>
  );
}

export default TwoThirdsColumn;
