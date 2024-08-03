// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

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
const storage = getStorage(app);
const firestore = getFirestore(app);


export { firestore,storage, analytics };
