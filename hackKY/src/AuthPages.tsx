import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Login Page Component
function LoginPage({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().musicGenres && docSnap.data().movieGenres) {
          navigate('/uploadImagePage');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (error: any) {
      setErrorMessage('Failed to log in. ' + error.message);
    }
  };

  return (
    <div className="card slide-in-left">
      <h2 className='auth-heading'>Login</h2>
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="auth-input large-input transparent-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-required="true"
          autoFocus
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="auth-input large-input transparent-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-required="true"
        />
        
        {errorMessage && <p className="error-message" aria-live="polite">{errorMessage}</p>}
        <div style={{marginTop: '0.5rem'}}>
          <button className="login-button" onClick={handleLogin} aria-label="Login to your account">
            Login
          </button>
        </div>

        <p>
          Don't have an account? 
          <button onClick={onSwitchToSignUp} className="text-button" aria-label="Switch to sign up">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

// Sign-Up Page Component
function SignUpPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
      });
      navigate('/onboarding');
    } catch (error: any) {
      setErrorMessage('Failed to sign up. ' + error.message);
    }
  };

  return (
    <div className="card slide-in-right">
      <h2 className='auth-heading'>Sign Up</h2>
      <div className="input-group">
        <label htmlFor="first-name">First Name</label>
        <input
          id="first-name"
          type="text"
          placeholder="First Name"
          className="auth-input large-input transparent-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          aria-required="true"
        />

        <label htmlFor="last-name">Last Name</label>
        <input
          id="last-name"
          type="text"
          placeholder="Last Name"
          className="auth-input large-input transparent-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          aria-required="true"
        />

        <label htmlFor="sign-up-email">Email</label>
        <input
          id="sign-up-email"
          type="email"
          placeholder="Email"
          className="auth-input large-input transparent-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-required="true"
        />

        <label htmlFor="sign-up-password">Password</label>
        <input
          id="sign-up-password"
          type="password"
          placeholder="Password"
          className="auth-input large-input transparent-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-required="true"
        />

        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          placeholder="Confirm Password"
          className="auth-input large-input transparent-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-required="true"
        />

        {errorMessage && <p className="error-message" aria-live="polite">{errorMessage}</p>}
        <div style={{marginTop: '0.5rem'}}>
          <button className="login-button" onClick={handleSignUp} aria-label="Create a new account">
            Sign Up
          </button>
        </div>
        <p>
          Already have an account? 
          <button onClick={onSwitchToLogin} className="text-button" aria-label="Switch to login">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// Main Authentication Component
export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="app-container">
      {isLogin ? (
        <LoginPage onSwitchToSignUp={() => setIsLogin(false)} />
      ) : (
        <SignUpPage onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}
