// GOV.UK back link. Pass `href` for normal navigation, or `onClick` to handle
// "back" in-page (e.g. returning from a guidance view to the question). When
// `onClick` is given the default navigation is prevented but `href` is kept as
// a no-JS fallback.
function BackLink({ href = '/', onClick, children = 'Back' }) {
  return (
    <a
      href={href}
      className="govuk-back-link"
      onClick={onClick ? (e) => { e.preventDefault(); onClick(); } : undefined}
    >
      {children}
    </a>
  );
}

export default BackLink;
