import { Link } from 'react-router-dom';
// TODO: Also import useNavigate for the Continue button

function PropertyTypePage() {
  // TODO: Read current value from form state (passed via props)
  // TODO: Add validation and error handling
  // TODO: On "Continue", save answer to state and navigate to /ownership

  return (
    <>
      <Link to="/" className="govuk-back-link">Back</Link>
      <h1 className="govuk-heading-l">What type of property do you live in?</h1>
      {/* TODO: Add radio buttons for: Detached house, Semi-detached house, Terraced house, Flat/apartment, Bungalow */}
      {/* TODO: Add a Continue button */}
    </>
  );
}

export default PropertyTypePage;
