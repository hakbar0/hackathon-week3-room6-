import { useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';

function StartPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="govuk-heading-xl">
        Check if you can get a Green Home Grant
      </h1>

      <p className="govuk-body-l">
        You could get free energy saving improvements made to your home if you&rsquo;re on a low income, getting certain benefits or living in a certain postcode area.
      </p>

      <p className="govuk-body">
        Use this service to find out if you qualify for help with insulation, a heat pump or other energy improvements.
      </p>

      <h2 className="govuk-heading-m">What you can get</h2>
      <p className="govuk-body">If you&rsquo;re eligible, the grant could pay for:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>wall, loft and underfloor insulation</li>
        <li>air source heat pumps</li>
        <li>smart controls</li>
        <li>solar panels</li>
      </ul>

      <h2 className="govuk-heading-m">Eligibility</h2>
      <p className="govuk-body">To get the grant, your home must:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>be in England</li>
        <li>be privately owned (either by you or your landlord)</li>
        <li>have an Energy Performance Certificate (EPC) of D, E, F or G</li>
      </ul>
      <p className="govuk-body">
        Your household income must usually be &pound;36,000 a year or less. You may still be eligible if you live in a certain postcode area or someone in your household gets certain benefits.
      </p>

      <h2 className="govuk-heading-m">Check your eligibility</h2>
      <p className="govuk-body">It takes around 5 minutes.</p>
      <GovukButton variant="start" onClick={() => navigate('/ownership')}>
        Start now
      </GovukButton>

      <h2 className="govuk-heading-m">What happens next</h2>
      <p className="govuk-body">
        If you&rsquo;re eligible, your local council will usually contact you within 10 working days to get more information and arrange a home survey.
      </p>

      <h2 className="govuk-heading-m">Get help to use the online service</h2>
      <p className="govuk-body">
        Telephone: <a href="tel:+448000000000">0800 000 0000</a><br />
        Monday to Friday, 8am to 6pm<br />
        Saturday, 9am to 12pm<br />
        Closed on bank holidays
      </p>
    </>
  );
}

export default StartPage;
