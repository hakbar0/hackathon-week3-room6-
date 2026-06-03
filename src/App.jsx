import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GovukHeader from './components/GovukHeader';
// TODO: Mount PhaseBanner below GovukHeader — import PhaseBanner from './components/PhaseBanner';
// TODO: Mount GovukFooter after the closing </main> — import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import IncomePage from './pages/IncomePage';
import InsulationPage from './pages/InsulationPage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import EpcPage from './pages/EpcPage';

function App() {
  // Central answer store (CLAUDE.md §2): all form state lives here and is
  // passed to pages as props so nothing is lost between routes.
  // address + epcRating are populated by the Address page (Q2); the EpcPage
  // (Q3, /review-epc) reads them to show the certificate found for that address.
  const [formData, setFormData] = useState({
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

  return (
    <>
      <GovukHeader />
      {/* TODO: Add <PhaseBanner phase="alpha" feedbackHref="#" /> here */}
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" role="main">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/property-type" element={<PropertyTypePage />} />
            <Route path="/ownership" element={<OwnershipPage />} />
            <Route
              path="/review-epc"
              element={<EpcPage formData={formData} updateField={updateField} />}
            />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/insulation" element={<InsulationPage />} />
            <Route path="/heating" element={<HeatingPage />} />
            <Route path="/check-answers" element={<CheckAnswersPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      {/* TODO: Add <GovukFooter /> here */}
    </>
  );
}

export default App;
