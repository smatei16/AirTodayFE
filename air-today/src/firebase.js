// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArJ5s_9PRtjshvDjz3f8QaLE-8A_nIjV0",
  authDomain: "air-today-9691e.firebaseapp.com",
  projectId: "air-today-9691e",
  storageBucket: "air-today-9691e.appspot.com",
  messagingSenderId: "938194279614",
  appId: "1:938194279614:web:b8e7689fbe7ce40e8fd2ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);