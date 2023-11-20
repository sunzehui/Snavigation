// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd5TANY7_IkU5fvGRlAWyvsi79ozAOE44",
  authDomain: "hnav-48535.firebaseapp.com",
  projectId: "hnav-48535",
  storageBucket: "hnav-48535.appspot.com",
  messagingSenderId: "716706124566",
  appId: "1:716706124566:web:e6b365253d8ed6badf3637",
  measurementId: "G-888DFJPHT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app)
