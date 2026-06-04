import { Link } from 'react-router-dom';
// TODO: Also import useNavigate for the Continue button

function InsulationPage() {
  // TODO: Read current value from form state
  // TODO: Add validation and error handling
  // TODO: On "Continue", save answer and navigate to /heating

  return (
    <>
      <Link to="/income" className="govuk-back-link">Back</Link>
      <h1 className="govuk-heading-l">Does your property have wall or loft insulation?</h1>
      {/* TODO: Add radio buttons for: Yes - both wall and loft, Yes - wall only, Yes - loft only, No insulation, I do not know */}
      {/* TODO: Add a Continue button */}
    </>
  );
}

export default InsulationPage;
