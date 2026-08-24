// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "the-estate-stage.firebaseapp.com",
  projectId: "the-estate-stage",
  storageBucket: "the-estate-stage.firebasestorage.app",
  messagingSenderId: "869380618492",
  appId: "1:869380618492:web:7964f1c133e6459b717f79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);