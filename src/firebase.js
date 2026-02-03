import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore,
  enableIndexedDbPersistence
} from "firebase/firestore";

// 🔥 Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhGRdLQmKryLvUJ4u4-kFi1Qv3hjDCIaQ",
  authDomain: "mvp-tracker-dbf39.firebaseapp.com",
  projectId: "mvp-tracker-dbf39",
  storageBucket: "mvp-tracker-dbf39.firebasestorage.app",
  messagingSenderId: "111270423345",
  appId: "1:111270423345:web:485af3641e2e4e73fe1e10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 📦 Firestore Database
export const db = getFirestore(app);

// ⚡ Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.log("Offline persistence error:", err.code);
});

export default app;
