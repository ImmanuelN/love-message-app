import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWgdEE_Gjret2ccSG7y00yVuvfkH5keWo",
  authDomain: "mail-app-5c3ec.firebaseapp.com",
  projectId: "mail-app-5c3ec",
  storageBucket: "mail-app-5c3ec.firebasestorage.app",
  messagingSenderId: "233168265902",
  appId: "1:233168265902:web:26c7f697b58ed50ba8433f",
  measurementId: "G-D1Y52DL2M0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDoc, doc };