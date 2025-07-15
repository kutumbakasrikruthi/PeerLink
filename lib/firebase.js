// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-NRRdf4UJGhFS9zPfywhaZUezGpfUFW0",
  authDomain: "peerlink-3c684.firebaseapp.com",
  projectId: "peerlink-3c684",
  storageBucket: "peerlink-3c684.firebasestorage.app",
  messagingSenderId: "44872376325",
  appId: "1:44872376325:web:5eefdf387f4a76e213fc6c",
  measurementId: "G-YGJ7264R87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };