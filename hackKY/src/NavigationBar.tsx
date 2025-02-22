import { Link } from 'react-router-dom';
import "./NavigationBar.css";
import { FC } from "react";

const NavigationBar: FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">Harmonify</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/auth">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
