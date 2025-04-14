
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCmWsdzD4h_3sGy53QJO2cmlUViluug6aQ",
    authDomain: "yogasync-63f04.firebaseapp.com",
    projectId: "yogasync-63f04",
    storageBucket: "yogasync-63f04.firebasestorage.app",
    messagingSenderId: "501681031919",
    appId: "1:501681031919:web:930a4c708117161531691a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;