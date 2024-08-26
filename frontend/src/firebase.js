// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "prof-dev-80ef8.firebaseapp.com",
  projectId: "prof-dev-80ef8",
  storageBucket: "prof-dev-80ef8.appspot.com",
  messagingSenderId: "322749763572",
  appId: "1:322749763572:web:6011373f405c1f59a0b3a1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);