// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe3ywgZ524Z4oitwxSNAD30g0j6MiP0HQ",
  authDomain: "tikita-76085.firebaseapp.com",
  projectId: "tikita-76085",
  storageBucket: "tikita-76085.appspot.com",
  messagingSenderId: "1036872786088",
  appId: "1:1036872786088:web:4b3efbe53e85c4f509629d",
  measurementId: "G-VQP79DTMSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, db, storage};



