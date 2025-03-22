
const admin = require('firebase-admin');
const firebase = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// Initialize Firebase Admin (for server-side operations)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "student-babb5",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // You still need to add this to your .env file
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // You still need to add this to your .env file
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://student-babb5.firebaseio.com",
  });
}

// Initialize Firebase Client with provided credentials
const firebaseConfig = {
  apiKey: "AIzaSyDVXNzlAFZO6gFllb2qv48vfNoEG4tFATY",
  authDomain: "student-babb5.firebaseapp.com",
  projectId: "student-babb5",
  storageBucket: "student-babb5.firebasestorage.app",
  messagingSenderId: "992139414648",
  appId: "1:992139414648:web:31465cdcb39ac55210f18d",
  measurementId: "G-3WEM53ZL06"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = getFirestore();
const auth = getAuth();
const adminDB = admin.firestore();
const adminAuth = admin.auth();

module.exports = {
  db,
  auth,
  adminDB,
  adminAuth,
  admin,
  firebase,
};
