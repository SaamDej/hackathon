import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import AuthPages from "./AuthPages.tsx";
import OnboardingPage from "./onBoardingPage.tsx";
import UploadImagePage from "./UploadImagePage.tsx";
import { FirebaseUserProvider } from "./FirebaseUserContext.tsx";
import PlaybackPage from "./PlaybackPage.tsx";
import SongPlayerPage from "./SongPlayerPage.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FirebaseUserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPages />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/uploadImagePage" element={<UploadImagePage />} />
          <Route path="/song-player" element={<SongPlayerPage />}/>
        </Routes>
      </Router>
    </FirebaseUserProvider>
  </React.StrictMode>
);
