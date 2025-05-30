import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyChi4RK2bphEVRwJ_Ma_GNmr2sljXEXeJM",
  authDomain: "halalexpress-86dbb.firebaseapp.com",
  projectId: "halalexpress-86dbb",
  storageBucket: "halalexpress-86dbb.firebasestorage.app",
  messagingSenderId: "239431572065",
  appId: "1:239431572065:web:d9ec84ad5922158044a820",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const auth = getAuth(app);
export const database = getFirestore(app);
