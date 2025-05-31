import { initializeApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzpO8QU2Zclz4EScAvfK6ESbeaW02qbE0",
  authDomain: "halalexpress-86dbb.firebaseapp.com",
  projectId: "halalexpress-86dbb",
  storageBucket: "halalexpress-86dbb.firebasestorage.app",
  messagingSenderId: "239431572065",
  appId: "1:239431572065:web:5601e9c976e9fdb544a820",
  measurementId: "G-9XQW4WS7TG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore();
