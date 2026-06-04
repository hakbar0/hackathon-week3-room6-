import { useParams, Navigate, Link } from 'react-router-dom';
import { getFailureContent } from '../utils/eligibility';

// Shared, reason-driven exit page (CLAUDE.md §2/§4). A failed eligibility check
// is not an error, so there is no error styling — just the reason and what the
// user can do next. The reason is in the route (/not-eligible/:reason) so the
// page is bookmarkable and survives a refresh.
function FailurePage() {
  const { reason } = useParams();
  const content = getFailureContent(reason);

  // Unknown reason: send the user back to the start rather than show a blank page.
  if (!content) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Link to="/ownership" className="govuk-back-link">Back</Link>

      <h1 className="govuk-heading-l">{content.title}</h1>

      {content.paragraphs.map((text, i) => (
        <p key={i} className="govuk-body">{text}</p>
      ))}

      {content.sections?.map((section, i) => (
        <div key={i}>
          <h2 className="govuk-heading-m">{section.heading}</h2>
          <p className="govuk-body">
            {section.before}
            <a className="govuk-link" href={section.link.href}>{section.link.text}</a>
            {section.after}
          </p>
        </div>
      ))}
    </>
  );
}

export default FailurePage;
