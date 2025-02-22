import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import AuthPages from './AuthPages.tsx';
import MoodPlaylist from './MoodPlaylist.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<MoodPlaylist />} />
      </Routes>
    </Router>
  </StrictMode>
);
