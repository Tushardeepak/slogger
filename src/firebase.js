import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDLix4AWyDnRRqvbXxnZ0Hont6bwjU3rsU",
  authDomain: "withslogger.firebaseapp.com",
  projectId: "withslogger",
  storageBucket: "withslogger.appspot.com",
  messagingSenderId: "1094798545180",
  appId: "1:1094798545180:web:e859abeb81b60e65fa6ad9",
  measurementId: "G-ESX9RB4NQG",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
