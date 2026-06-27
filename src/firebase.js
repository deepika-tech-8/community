import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyClS7_2XiWQ-_66hE613EUhBsUdJi1AqP4",
  authDomain: "community-hero-e6ee3.firebaseapp.com",
  projectId: "community-hero-e6ee3",
  storageBucket: "community-hero-e6ee3.firebasestorage.app",
  messagingSenderId: "668636306554",
  appId: "1:668636306554:web:d4d596834db3ceadb4afc3",
  measurementId: "G-55W5WXHRDG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);