import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import AuthPages from './AuthPages.tsx';
import OnboardingPage from './onBoardingPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
