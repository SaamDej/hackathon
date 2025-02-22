import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';

// Login Page Component
function LoginPage({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().musicGenres && docSnap.data().movieGenres) {
          alert('Logged in successfully!');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      alert('invalid Credentials');
    }
  };

  return (
    <div className="card slide-in-left">
      <h2>Login</h2>
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          className="auth-input large-input transparent-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          className="auth-input large-input transparent-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="generate-button" onClick={handleLogin}>
        Login
      </button>
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        firstName,
        lastName,
        email,
      });

      alert('User registered successfully!');
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Sign-Up Error:', error);
      alert('Failed to sign up. ' + error.message);
    }
  };

  return (
    <div className="card slide-in-right">
      <h2>Sign Up</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="First Name"
          className="auth-input large-input transparent-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          placeholder="Last Name"
          className="auth-input large-input transparent-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          className="auth-input large-input transparent-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          className="auth-input large-input transparent-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Confirm Password"
          className="auth-input large-input transparent-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button className="generate-button" onClick={handleSignUp}>
        Sign Up
      </button>
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
