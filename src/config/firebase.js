import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCeWNlxW39j4LQ2K19P9h-nmyYS2jdEf1I",
  authDomain: "chris1-dd8f6.firebaseapp.com",
  projectId: "chris1-dd8f6",
  storageBucket: "chris1-dd8f6.appspot.com",
  messagingSenderId: "791316357556",
  appId: "1:791316357556:web:c7c015e3ce8324339512e1",
  measurementId: "G-0VSE0WSPDE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
