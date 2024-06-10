// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA56QGYJMV_GDppM1V1dW1peq9EQyzJIVI",
  authDomain: "trimelcas.firebaseapp.com",
  projectId: "trimelcas",
  storageBucket: "trimelcas.appspot.com",
  messagingSenderId: "329121527778",
  appId: "1:329121527778:web:9589e3460175d1a432ebbb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;