// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApgRb2WxF2oMxo-RP4HCkh6LgSCNKzdeE",
  authDomain: "artvista-market.firebaseapp.com",
  projectId: "artvista-market",
  storageBucket: "artvista-market.appspot.com",
  messagingSenderId: "284723127081",
  appId: "1:284723127081:web:530e4cea08d1e426f8cd38"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
