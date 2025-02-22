import { useState } from "react";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="landing-content">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Music size={45} />
          <h1>Harmonify</h1>
        </div>
        <h2>Generate a Spotify Playlist from Your Face</h2>
        <div className="card">
          <label className="upload-label">
            <span>Upload an image of your face</span>
            <input
              type="file"
              accept="image/*"
              className="hidden-input"
              onChange={handleImageUpload}
            />
          </label>
          {image && <img src={image} alt="Uploaded preview" className="preview-image" />}
          <button className="generate-button">Generate Playlist</button>
        </div>
        <Link to="/auth">
          <button className="login-button">Login</button>
        </Link>
      </div>
    </div>
  );
}
