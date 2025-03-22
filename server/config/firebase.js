
const admin = require('firebase-admin');
const firebase = require('firebase/app');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// Initialize Firebase Admin (for server-side operations)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "student-babb5",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "student@student-453512.iam.gserviceaccount.com",
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCunsFEjogd9lOG\nS2CiL3Th9W25JI0XtU4bwlAjRxvlMlel+09yeusryD18Fj4y9L3E0f73WptQv3Wp\n9Avo1dBW+XOU6ryGn+6enCghJIPqrEJDJQ3xFcurfqHm2jrnpSzgo/QyNSW3B+cF\nE6geRxbRd/Qmfd0CoIgkmDzSFTrJw8ob/EgOUiG/vKuRT+DkCAGoORdI7HFnnD0Y\nCjsVOQGqlogAB5QIYm6kmO+32SuVYU8bnbQtzR++jWN9rapd9S7RST7FAoafckaD\nnO7h+L7dN0CPOYHM+2RwQpJciXE4xs1ABt0BwlBLUkg2pV0VCmzFKGl3VPDeHGML\npRw0+Ik7AgMBAAECggEALtWanZIi9PJP1ama6fUTgtVKUAl7JDw3Dl/wEX4tf6wg\ncP62AMzyDWSgBQuMNCuLSGJQYbR2CtLHMsWnehP61JEETJEm7m6v1++nHbiG/yaj\ngRHLqvk/DqigsOOgP+f/4OJoiRzTGEOw1R5ADZrghl8HZ1mDsQQwb6w7R9d01I9R\n+079gvuVyg71F0echDh9JHp9toilTYrdzKr1xmcsOGgyK7ytruIDCp6RxawyUpWq\nmRLvpQoLcT+kKOcPmlMDIAlRrUMOsKqnZdSjeyX6wWMKPWRVPh/4eUGK2omTZH2E\nGk91ceebB04O+9G6s4DVbeS7e0yzAgHvwyDek2IA8QKBgQDvJrVs7S1w0UMrcOqt\nE2Tehzg/OYT/Xfo8hp1my7tdKVsSD5ILUNxAMzRQtcllNgSsT3QuZ0zwJRkI8Qq4\nb0WdEDP8jdHTwpM50v+Z1KXbhi3lbCkpnWQKG6YHkZK0zQrJBdeg41cyoolobTT6\nfl6fQv0x8+/1gs/yv18PwQoBiwKBgQC67Cy1c92ofzG4IvLIYNYIiu0E/W8fg80T\n6J3PHmsWD0qdDVWninXGreXbZPs0BXU/HhPMDCLWeGZuibS2kEeiMkS/vf3r9xp8\nD8S3WvkDuaNn2Fld5Ug/JLPmve/xYdMt56gCz6mW5FfaTiapVmKAtXQvRt0QwWpX\nkTQWkjstEQKBgCMat37pwcXRsd5qkMgfFKtlhegh9VfW36iKyggQ18vxCiE4j+OB\nVxNFcOR4CrwEleMFNrSpDS4jA+3AFCbGjp1jh34HA0nmQd43DrXx9PaoV4xZuCEX\nrVuee1yZDcPkZTTk2qYPOPmBylG91gz/B7yxBKGUgSC0tvmXBck2ONXJAoGAWVO6\nPfCkEfzO7tdMvLOCNUzm3gabDy12WLhGig9YT495MbqIn2tMw2ihOwpz/bVKBaLD\nBTUbhPC+yr5mLQSgJwPs1NDfwt8wue7zLEh+TehuDZdXhcankv1gN7m3K9x7Bin5\noXZJ7kErNrk4Qp50rluIrXso8/PqdPSANvUk8HECgYA8vPIgXoZ9r0+4rmbSFQb0\nmrbnVmTK1gj8c0baWv1T9uvwkaDcXBxCa86xt5sGuizpW3Fjgud3oLiJvHIz9HcI\n4jKCVOmZTDXhNbTYElyEIZhqEqKXfdO5ysq9QuMMczKgySmyJ2sg/xtVrZXReDSU\nDZfqDGFEr1QFzhb30pSqZg==\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL || "https://student-babb5.firebaseio.com",
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
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

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase Client SDK initialized successfully");
  }
} catch (error) {
  console.error("Error initializing Firebase Client SDK:", error);
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
