//import { initializeApp } from 'firebase-admin/app';
import * as data from './serviceAccountKey.json';
const serviceAccount = require("./serviceAccountKey.json");

console.log(data);

const firebaseConfig = {
    apiKey: "AIzaSyBENQ02JSi4Lbhq9ZynrAzJfeP5isWF-MM",
    authDomain: "robotic-tiger-332407.firebaseapp.com",
    projectId: "robotic-tiger-332407",
    storageBucket: "robotic-tiger-332407.appspot.com",
    messagingSenderId: "644598304950",
    appId: "1:644598304950:web:c1bf36b2ad740fd9e05617"
};

const app = initializeApp(firebaseConfig);