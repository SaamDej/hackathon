import { useState } from "react";
import { Link } from "react-router-dom";
import  Logo from "./assets/Logo-2.png";

import "./app.css";

export default function App() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="app-container">
        <img src={Logo} alt="App Logo" className="logo" />
        <h2>Generate a Spotify Playlist from Your Face</h2>
        <Link to="/test">
          <button className="login-button">Demo</button>
        </Link>
    </div>
  );
}
