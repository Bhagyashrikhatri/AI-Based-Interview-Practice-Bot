import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZilzQb0Uxn4UfwMXida_acPkC0Rn3T4U",
  authDomain: "aibasedinterviewpracticebot.firebaseapp.com",
  projectId: "aibasedinterviewpracticebot",
  storageBucket: "aibasedinterviewpracticebot.firebasestorage.app",
  messagingSenderId: "460183443536",
  appId: "1:460183443536:web:b71c7dac47fec098281955",
  measurementId: "G-RMDDTF34R6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();