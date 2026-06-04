import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import GovukHeader from './components/GovukHeader';
import ServiceNavigation from './components/ServiceNavigation';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import CountryPage from './pages/CountryPage';
import OwnershipPage from './pages/OwnershipPage';
import AddressPage from './pages/AddressPage';
import IncomePage from './pages/IncomePage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import EpcPage from './pages/EpcPage';
import { ELIGIBLE_OWNERSHIP } from './utils/eligibility';

// Per-route page titles (WCAG 2.4.2 Page Titled). Each route gets a unique,
// descriptive title; the suffix matches the GOV.UK service name.
const ROUTE_TITLES = {
  '/': 'Check if you can get a Green Home Grant',
  '/country': 'Which country is your property located in?',
  '/ownership': 'Do you own your property?',
  '/address': 'What is your address?',
  '/review-epc': "Check your property's energy rating",
  '/income': 'What is your total household income?',
  '/check-answers': 'Check your answers',
  '/result': 'Your eligibility result',
  '/accessibility-statement': 'Accessibility statement',
};
const TITLE_SUFFIX = 'Check if you can get a Green Home Grant – GOV.UK';

function App() {
  // Central answer store (CLAUDE.md §2): all form state lives here and is
  // passed to pages as props so nothing is lost between routes.
  // address + epcRating are populated by the Address page (Q2); the EpcPage
  // (Q3, /review-epc) reads them to show the certificate found for that address.
  // incomeBand is populated by the Income page.
  const [formData, setFormData] = useState({
    country: '',
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

  // On every client-side navigation: set the page title (2.4.2) and move focus
  // to the new page's heading (2.4.3) so keyboard and screen-reader users are
  // told they have moved and start reading from the top of the page.
  const mainRef = useRef(null);
  useEffect(() => {
    const pageTitle = ROUTE_TITLES[pathname];
    document.title = pageTitle ? `${pageTitle} – ${TITLE_SUFFIX}` : TITLE_SUFFIX;

    const heading = mainRef.current?.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }, [pathname]);

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
        <main className="govuk-main-wrapper" id="main-content" role="main" ref={mainRef}>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route
              path="/country"
              element={<CountryPage formData={formData} updateField={updateField} />}
            />
            <Route
              path="/ownership"
              element={
                <OwnershipPage
                  formData={formData}
                  updateField={updateField}
                  onContinue={(value) =>
                    navigate(value === ELIGIBLE_OWNERSHIP ? '/address' : '/result')
                  }
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
            <Route path="/check-answers" element={<CheckAnswersPage formData={formData} />} />
            <Route path="/result" element={<ResultPage formData={formData} />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;
