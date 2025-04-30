// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChg0v26obvjJ242FDoBfB12b5IxSrupG8",
  authDomain: "sample1-7e26a.firebaseapp.com",
  projectId: "sample1-7e26a",
  storageBucket: "sample1-7e26a.firebasestorage.app",
  messagingSenderId: "662507369647",
  appId: "1:662507369647:web:ba27fc0dea5e6c8657105a",
  measurementId: "G-416HT2ZV3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;