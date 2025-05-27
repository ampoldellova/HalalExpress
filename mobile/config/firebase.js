import { getApps, initializeApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

import Constants from "expo-constants";

const { firebase } = Constants.expoConfig.extra;

const firebaseConfig = {
    apiKey: "AIzaSyChi4RK2bphEVRwJ_Ma_GNmr2sljXEXeJM",
    authDomain: "halalexpress-86dbb.firebaseapp.com",
    projectId: "halalexpress-86dbb",
    storageBucket: "halalexpress-86dbb.firebasestorage.app",
    messagingSenderId: "239431572065",
    appId: "1:239431572065:web:d9ec84ad5922158044a820",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore();
