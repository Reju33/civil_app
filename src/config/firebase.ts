import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtJNHql2XRTCOjcxzG4xLUdHrO5sLCKCQ",
  authDomain: "civil-app-d2e1d.firebaseapp.com",
  projectId: "civil-app-d2e1d",
  storageBucket: "civil-app-d2e1d.appspot.com",
  messagingSenderId: "405526714012",
  appId: "1:405526714012:web:1111111111111111111111",
  databaseURL: "https://civil-app-d2e1d-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
let app: any;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Configurar autenticación
const auth = getAuth(app);

// Funciones de autenticación
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email || ''
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email || ''
      }
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// Exportar servicios
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
export { auth };