// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC__QV2BVNsZhJT4FLFNf4ryPsJRFMj3M",
  authDomain: "inventory-management-by-saad.firebaseapp.com",
  projectId: "inventory-management-by-saad",
  storageBucket: "inventory-management-by-saad.appspot.com",
  messagingSenderId: "691477175773",
  appId: "1:691477175773:web:bef896a29701b8b8146a34",
  measurementId: "G-261ZYWKY4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}