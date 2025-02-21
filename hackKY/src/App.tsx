import { useState } from "react";

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
      <nav className="navbar">
        <h1>EmotionaList</h1>
      </nav>
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
      </div>
    </div>
  );
}
