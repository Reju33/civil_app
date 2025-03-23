import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  // Aquí irán tus credenciales de Firebase
    apiKey: "AIzaSyDtJNHql2XRTCOjcxzG4xLUdHrO5sLCKCQ",
    authDomain: "civil-app-d2e1d.firebaseapp.com",
    projectId: "civil-app-d2e1d",
    storageBucket: "civil-app-d2e1d.appspot.com",
    messagingSenderId: "405526714012",
    appId: "1:405526714012:web:1111111111111111111111",
    databaseURL: "https://civil-app-d2e1d-default-rtdb.firebaseio.com"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const signIn = signInWithEmailAndPassword;
export const signUp = createUserWithEmailAndPassword;
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);