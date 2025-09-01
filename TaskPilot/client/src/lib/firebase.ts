import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCH4AxyOpQCNyPFcux9lfgr-TeYUx2VMFU",
  authDomain: "academic-771ec.firebaseapp.com",
  projectId: "academic-771ec",
  storageBucket: "academic-771ec.firebasestorage.app",
  messagingSenderId: "577614362103",
  appId: "1:577614362103:web:b398dcdd2047f3f393aaf2",
  measurementId: "G-4QD9R9J80Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
