
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcTIPYzH-9Dyxb0mxIADT9xnYjnuB3BF4",
  authDomain: "denario-261e3.firebaseapp.com",
  projectId: "denario-261e3",
  storageBucket: "denario-261e3.firebasestorage.app",
  messagingSenderId: "980279623360",
  appId: "1:980279623360:web:a69a71fc4a221b33ba7725",
  measurementId: "G-2QF0ZG3TDJ"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };