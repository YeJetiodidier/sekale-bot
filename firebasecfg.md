// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyClq1QxiYkPjGvzupbcKZ7OLSiB5RpDIUs",
authDomain: "sekale-bot.firebaseapp.com",
projectId: "sekale-bot",
storageBucket: "sekale-bot.firebasestorage.app",
messagingSenderId: "305651116997",
appId: "1:305651116997:web:307414d1d89b87a258b9ac",
measurementId: "G-N2SG16RGFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
