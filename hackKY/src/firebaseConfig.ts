// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: `${process.env.FIREBASE_API_KEY}`,
  authDomain: "harmonify-7ed94.firebaseapp.com",
  projectId: "harmonify-7ed94",
  storageBucket: "harmonify-7ed94.firebasestorage.app",
  messagingSenderId: "719234140025",
  appId: "1:719234140025:web:f0c66188cd2952624611a8",
  measurementId: "G-G42L1N74NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);