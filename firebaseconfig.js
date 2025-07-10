
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "NO API",
  authDomain: "NO API",
  projectId: "NO API",
  storageBucket: "NO API",
  messagingSenderId: "NO API",
  appId: "NO API",
  measurementId: "NO API"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };