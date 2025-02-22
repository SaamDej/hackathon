import { useState } from 'react';
import './app.css';

// Login Page Component
function LoginPage({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  return (
    <div className="card slide-in-left">
      <h2>Login</h2>
      <div className="input-group">
        <input type="email" placeholder="Email" className="auth-input large-input transparent-input" />
      </div>
      <div className="input-group">
        <input type="password" placeholder="Password" className="auth-input large-input transparent-input" />
      </div>
      <button className="generate-button">Login</button>
      <p>
        Don't have an account?{' '}
        <button onClick={onSwitchToSignUp} className="text-button">
          Sign Up
        </button>
      </p>
    </div>
  );
}

// Sign-Up Page Component
function SignUpPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  return (
    <div className="card slide-in-right">
      <h2>Sign Up</h2>
      <div className="input-group">
        <input type="text" placeholder="First Name" className="auth-input large-input transparent-input" />
      </div>
      <div className="input-group">
        <input type="text" placeholder="Last Name" className="auth-input large-input transparent-input" />
      </div>
      <div className="input-group">
        <input type="email" placeholder="Email" className="auth-input large-input transparent-input" />
      </div>
      <div className="input-group">
        <input type="password" placeholder="Password" className="auth-input large-input transparent-input" />
      </div>
      <div className="input-group">
        <input type="password" placeholder="Confirm Password" className="auth-input large-input transparent-input" />
      </div>
      <button className="generate-button">Sign Up</button>
      <p>
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-button">
          Login
        </button>
      </p>
    </div>
  );
}

// Main Authentication Component
export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignUp = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  return (
    <div className="app-container">
      {isLogin ? (
        <LoginPage onSwitchToSignUp={handleSwitchToSignUp} />
      ) : (
        <SignUpPage onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
}