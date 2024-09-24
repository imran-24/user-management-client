// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const apiKey = import.meta.env.VITE_REACT_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_REACT_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_REACT_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_REACT_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env
  .VITE_REACT_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_REACT_FIREBASE_APP_ID;
const measurementId = import.meta.env.VITE_REACT_FIREBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
// const collections = {
//   folders: collection(db, "folders"),
//   files: collection(db, "files"),
//   formatedDoc: (doc:any) => ({
//     id: doc.id,
//     ...doc.data(),
//   }),
// };
const auth = getAuth(app);
export { app, storage, db, auth };
