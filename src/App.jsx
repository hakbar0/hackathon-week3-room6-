import { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import GovukHeader from './components/GovukHeader';
import ServiceNavigation from './components/ServiceNavigation';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import CountryPage from './pages/CountryPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import AddressPage from './pages/AddressPage';
import IncomePage from './pages/IncomePage';
import InsulationPage from './pages/InsulationPage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import EpcPage from './pages/EpcPage';
import FailurePage from './pages/FailurePage';
import { ownershipNextStep } from './utils/eligibility';

function App() {
  // Central answer store (CLAUDE.md §2): all form state lives here and is
  // passed to pages as props so nothing is lost between routes.
  // address + epcRating are populated by the Address page (Q2); the EpcPage
  // (Q3, /review-epc) reads them to show the certificate found for that address.
  // incomeBand is populated by the Income page; ownership by the Ownership page.
  const [formData, setFormData] = useState({
    country: '',
    ownership: '',
    address: {
      line1: '10 Downing Street',
      line2: '',
      town: 'London',
      postcode: 'SW1A 2AA',
    },
    epcRating: 'D',
    epcValidUntil: '6 March 2032',
    epcConfirmed: '',
  });

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const navigate = useNavigate();
  // Service navigation shows once the user has left the start page (CLAUDE.md
  // §2 linear flow: Start -> questions -> result), matching GOV.UK start-page
  // pattern where the start page itself carries no service navigation.
  const { pathname } = useLocation();
  const showServiceNav = pathname !== '/';

  return (
    <>
      {/* Skip link must be the first focusable element; initAll() (main.jsx)
          wires the govuk-skip-link JS to focus #main-content on activation. */}
      <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">
        Skip to main content
      </a>
      <GovukHeader />
      {showServiceNav && <ServiceNavigation />}
      <div className="govuk-width-container">
        <PhaseBanner phase="Alpha" feedbackHref="#" />
        <main className="govuk-main-wrapper" id="main-content" role="main">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route
              path="/country"
              element={<CountryPage formData={formData} updateField={updateField} />}
            />
            <Route path="/property-type" element={<PropertyTypePage />} />
            <Route
              path="/ownership"
              element={
                <OwnershipPage
                  formData={formData}
                  updateField={updateField}
                  onContinue={(ownership) => navigate(ownershipNextStep(ownership))}
                />
              }
            />
            <Route
              path="/review-epc"
              element={<EpcPage formData={formData} updateField={updateField} />}
            />
            <Route
              path="/address"
              element={
                <AddressPage
                  address={formData.address}
                  setAddress={(a) => updateField('address', a)}
                  onContinue={() => navigate('/review-epc')}
                />
              }
            />
            <Route
              path="/income"
              element={<IncomePage formData={formData} updateField={updateField} />}
            />
            <Route path="/insulation" element={<InsulationPage />} />
            <Route path="/heating" element={<HeatingPage />} />
            <Route path="/check-answers" element={<CheckAnswersPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/not-eligible/:reason" element={<FailurePage />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
