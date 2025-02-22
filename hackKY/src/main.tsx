import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import AuthPages from './AuthPages.tsx';
import NavigationBar from './NavigationBar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
    <NavigationBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<AuthPages />} />
      </Routes>
    </Router>
  </StrictMode>
);
