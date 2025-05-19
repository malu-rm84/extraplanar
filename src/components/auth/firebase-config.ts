import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCsJfhToQi0Rfzuiv8EaEqHZoFNgJAToDI",
  authDomain: "extraplanar-7a4e6.firebaseapp.com",
  projectId: "extraplanar-7a4e6",
  storageBucket: "extraplanar-7a4e6.appspot.com",
  messagingSenderId: "444109466666",
  appId: "1:444109466666:web:ac4159d4aab3f32d30e753"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

googleProvider.setCustomParameters({
  prompt: 'select_account'
});