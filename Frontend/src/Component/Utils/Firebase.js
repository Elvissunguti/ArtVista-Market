// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApgRb2WxF2oMxo-RP4HCkh6LgSCNKzdeE",
  authDomain: "artvista-market.firebaseapp.com",
  projectId: "artvista-market",
  storageBucket: "artvista-market.appspot.com",
  messagingSenderId: "284723127081",
  appId: "1:284723127081:web:530e4cea08d1e426f8cd38"
};

// Initialize Firebase app only if no apps have been initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
