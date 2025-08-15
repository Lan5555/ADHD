// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: "clarity-tasks-4f3f7",
  storageBucket: "clarity-tasks-4f3f7.firebasestorage.app",
  messagingSenderId: "461323402393",
  appId: "1:461323402393:web:5d959398eb93063c604c08",
  measurementId: "G-68SGG11TTB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

