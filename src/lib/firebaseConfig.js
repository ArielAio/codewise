// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Para Firestore
// ou
// import { getDatabase } from 'firebase/database'; // Para Realtime Database

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBIby5Hp_R2G-SmDapoAfv5D_w5PU9V0f4",
    authDomain: "codewise-138f7.firebaseapp.com",
    projectId: "codewise-138f7",
    storageBucket: "codewise-138f7.appspot.com",
    messagingSenderId: "532370021019",
    appId: "1:532370021019:web:5f0204d60874fb150c843e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app); // Para Firestore
// ou
// const db = getDatabase(app); // Para Realtime Database

export { db };

