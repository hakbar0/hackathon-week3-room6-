import { Link } from 'react-router-dom';
// TODO: Also import useNavigate for the Continue button

function OwnershipPage() {
  const navigate = useNavigate();
  const [ownership, setOwnership] = useState('');
  const [error, setError] = useState('');
  const [showGuidance, setShowGuidance] = useState(false);
  const guidanceRef = useRef(null);

  // Move focus to the guidance when it replaces the question.
  // (ErrorSummary handles its own focus on mount.)
  useEffect(() => {
    if (showGuidance) guidanceRef.current?.focus();
  }, [showGuidance]);

  function handleBackToQuestion() {
    setShowGuidance(false);
    setError('');
  }

  function handleContinue() {
    if (!ownership) {
      setError(ERROR_MESSAGE);
      return;
    }
    setError('');

    if (ownership !== ELIGIBLE_VALUE) {
      setShowGuidance(true);
      return;
    }

    // TODO: save `ownership` to shared form state.
    navigate('/income');
  }

  // Not eligible: replace the question with guidance and offer only a Back link.
  if (showGuidance) {
    return (
      <>
        <BackLink href="/property-type" onClick={handleBackToQuestion} />
        <TwoThirdsColumn>
          <NotificationBanner ref={guidanceRef} titleId="guidance-banner-title">
            <h3 className="govuk-notification-banner__heading">
              This service is currently for homeowners
            </h3>
            <p className="govuk-body">
              However, privately rented homes can still be eligible for Warm
              Homes: Local Grant funding.
            </p>
            <p className="govuk-body">
              Please contact your Local Authority directly if you are a tenant in
              a privately rented home and your landlord supports your application
              for Warm Homes: Local Grant.
            </p>
            <p className="govuk-body">
              Please also contact your Local Authority directly if you are a
              private landlord and support an application for the Warm Homes:
              Local Grant for your rented property.
            </p>

            <h3 className="govuk-heading-s">
              You might be able to get help from your energy supplier
            </h3>
            <p className="govuk-body">
              Check if you are eligible for the{' '}
              <a className="govuk-link" href="https://www.gov.uk/energy-company-obligation">
                Energy Company Obligation scheme
              </a>.
            </p>

            <h3 className="govuk-heading-s">Contact your Local Authority</h3>
            <p className="govuk-body">
              Your local council might have additional grants or supports
              available. Contact them to find out more or{' '}
              <a className="govuk-link" href="https://www.gov.uk/find-local-council">
                visit their website
              </a>.
            </p>
          </NotificationBanner>
        </TwoThirdsColumn>
      </>
    );
  }

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
