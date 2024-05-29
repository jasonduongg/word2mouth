import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyC9e3a9gfLbCICkgqdkomCW_GdOE5FSP8E",
  authDomain: "word2mouth-e9feb.firebaseapp.com",
  databaseURL: "https://word2mouth-e9feb-default-rtdb.firebaseio.com",
  projectId: "word2mouth-e9feb",
  storageBucket: "word2mouth-e9feb.appspot.com",
  messagingSenderId: "234312128612",
  appId: "1:234312128612:web:12599d02e3d5da12b2e771",
  measurementId: "G-ZYGRCG91S6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);