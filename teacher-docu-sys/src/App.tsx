import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SecureSimple from './components/SecureSimple';
import SubmissionForm from './components/SubmissionForm';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Submissions from './pages/Submissions';
import Documents from './pages/Documents';

function LandingPage() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <SecureSimple />
      <SubmissionForm />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/submissions" element={<Submissions />} />
        <Route path="/admin/documents" element={<Documents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
