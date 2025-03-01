// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW_psY6jTAyilJTtfhhv-jJHRI82bomc0",
  authDomain: "personal-finance-tracker-2ebee.firebaseapp.com",
  projectId: "personal-finance-tracker-2ebee",
  storageBucket: "personal-finance-tracker-2ebee.firebasestorage.app",
  messagingSenderId: "794016887246",
  appId: "1:794016887246:web:5677145fc810d7ceb5fb9f",
  measurementId: "G-XPS0T9DVEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { auth };