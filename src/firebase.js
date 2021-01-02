import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAo47d4MnP9ZS9v7EoXXp1aTjyUibnN1Ss",
  authDomain: "slogger-d224d.firebaseapp.com",
  projectId: "slogger-d224d",
  storageBucket: "slogger-d224d.appspot.com",
  messagingSenderId: "86643683538",
  appId: "1:86643683538:web:205331e73bdd290a55fd0b",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
