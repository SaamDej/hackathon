import { Link } from "react-router-dom";
import Logo from "./assets/Logo-2.png";
import "./app.css";

export default function App() {

  return (
    <div className="app-container">
        <img src={Logo} alt="App Logo" className="logo" />
        <h2>Generate a Spotify Playlist from Your Face</h2>

        <Link to="/auth">
          <button className="login-button">Demo</button>
        </Link>
        
    </div>
  );
}
