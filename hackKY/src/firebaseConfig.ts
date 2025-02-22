// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBzcjFFu40YJ1X0_S4-6ZvxfKZGkYrjMwk',
  authDomain: 'harmonify-7ed94.firebaseapp.com',
  projectId: 'harmonify-7ed94',
  storageBucket: 'harmonify-7ed94.appspot.com', // Corrected storage bucket URL
  messagingSenderId: '719234140025',
  appId: '1:719234140025:web:f0c66188cd2952624611a8',
  measurementId: 'G-G42L1N74NE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Initialize analytics only if running in a browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}
