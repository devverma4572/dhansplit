// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMyAoj4FEbrvZgid13kcuRWpVsBZstOEo",
  authDomain: "dhansplit-83a0e.firebaseapp.com",
  projectId: "dhansplit-83a0e",
  storageBucket: "dhansplit-83a0e.firebasestorage.app",
  messagingSenderId: "241599097746",
  appId: "1:241599097746:web:1a1a5e6663f051f098af4b",
  measurementId: "G-RWL1QP4R1W"
};
  
// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let firebaseAuth;

try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  firebaseAuth = getAuth(app);
}

export const auth = firebaseAuth;    
export const firestore = getFirestore(app);
export const storage  = getStorage(app);

