// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDUxJYaBEWYdEAiPeGrGi_e9ocDXjz3lCI",
    authDomain: "handwrittenreco.firebaseapp.com",
    projectId: "handwrittenreco",
    storageBucket: "handwrittenreco.firebasestorage.app",
    messagingSenderId: "393608435269",
    appId: "1:393608435269:web:75018fc8396a8a4e84b52c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { auth, db };
