
const admin = require('firebase-admin');
const firebase = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// Initialize Firebase Admin (for server-side operations)
// REPLACE: You need to create a service account in Firebase console > Project settings > Service accounts
// Download the JSON file and extract the information below
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,        // REPLACE: Your Firebase project ID
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,    // REPLACE: Service account email from downloaded JSON
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // REPLACE: Service account private key
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,     // REPLACE: Only needed if using Realtime Database
  });
}

// Initialize Firebase Client (for client-side operations)
// REPLACE: These should match the values in your frontend Firebase config (AuthContext.tsx)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,           // REPLACE: Your Firebase API key
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,   // REPLACE: Format: your-project-id.firebaseapp.com
  projectId: process.env.FIREBASE_PROJECT_ID,     // REPLACE: Your Firebase project ID
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // REPLACE: Format: your-project-id.appspot.com
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID, // REPLACE: Messaging sender ID
  appId: process.env.FIREBASE_APP_ID,            // REPLACE: Firebase app ID
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
