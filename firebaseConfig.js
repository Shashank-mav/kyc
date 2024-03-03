import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSqu2UDl_T57Lmirbuwj5OVsDddV3f3Tk",
  authDomain: "kycapp-b1831.firebaseapp.com",
  projectId: "kycapp-b1831",
  storageBucket: "kycapp-b1831.appspot.com",
  messagingSenderId: "1012598941672",
  appId: "1:1012598941672:web:07209e05a39e086740665d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, storage, firestore };
