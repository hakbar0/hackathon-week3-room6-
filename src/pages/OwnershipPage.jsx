import { Link } from 'react-router-dom';
// TODO: Also import useNavigate for the Continue button

function OwnershipPage() {
  // TODO: Read current value from form state
  // TODO: Add validation and error handling
  // TODO: On "Continue", save answer and navigate to /income

  return (
    <>
      <Link to="/property-type" className="govuk-back-link">Back</Link>
      <h1 className="govuk-heading-l">Do you own or rent your property?</h1>
      {/* TODO: Add radio buttons for: Own (with or without mortgage), Rent from a private landlord, Rent from a housing association, Rent from the council */}
      {/* TODO: Add a Continue button */}
    </>
  );
}

export default OwnershipPage;
