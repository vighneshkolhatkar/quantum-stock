// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {
    apiKey: "AIzaSyB-bXlLViLC_2exbcj0Hi-LQYoUmiIRVFU",
    authDomain: "quantum-stock-63803.firebaseapp.com",
    projectId: "quantum-stock-63803",
    storageBucket: "quantum-stock-63803.appspot.com",
    messagingSenderId: "678493814629",
    appId: "1:678493814629:web:c4fac7de88d2c2a0e02b8c",
    measurementId: "G-E3Y1FBRSNM"
  };
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);