import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCH4AxyOpQCNyPFcux9lfgr-TeYUx2VMFU",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "academic-771ec"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "academic-771ec",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "academic-771ec"}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "577614362103",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:577614362103:web:b398dcdd2047f3f393aaf2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4QD9R9J80Y"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
