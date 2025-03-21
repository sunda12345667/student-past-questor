
const express = require('express');
const router = express.Router();
const { admin, adminAuth, adminDB } = require('../config/firebase');

// Create a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });
    
    // Create user document in Firestore
    await adminDB.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      purchasedPacks: [],
    });
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // We'll handle actual authentication in the client
    // This is just to fetch user data if needed
    const userRecord = await adminAuth.getUserByEmail(email);
    
    // Get additional user data from Firestore
    const userDoc = await adminDB.collection('users').doc(userRecord.uid).get();
    
    if (userDoc.exists) {
      res.status(200).json({ 
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        ...userDoc.data() 
      });
    } else {
      res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
