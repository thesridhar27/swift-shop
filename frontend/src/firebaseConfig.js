// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // 1. Added the Auth SDK import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCHBs3xtyK5UnmlPadV8aC7RWKqNAhkIU",
  authDomain: "swiftshop-58d03.firebaseapp.com",
  projectId: "swiftshop-58d03",
  storageBucket: "swiftshop-58d03.firebasestorage.app",
  messagingSenderId: "4589259797",
  appId: "1:4589259797:web:8c2b01fdd228dd9cadd21c",
  measurementId: "G-E0ZPM2EQTW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Initialize and EXPORT the Auth tool so LoginScreen can read it
export const auth = getAuth(app);