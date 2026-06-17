// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBm-whygga0ngDfbusXU6qY-pHasVi5BYY",
  authDomain: "parcelpro-240.firebaseapp.com",
  projectId: "parcelpro-240",
  storageBucket: "parcelpro-240.firebasestorage.app",
  messagingSenderId: "433028766527",
  appId: "1:433028766527:web:26655485b14d23093fd18a",
  measurementId: "G-FNPDWER90V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
