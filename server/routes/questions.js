
const express = require('express');
const router = express.Router();
const { adminDB } = require('../config/firebase');

// Get all question packs
router.get('/packs', async (req, res) => {
  try {
    const snapshot = await adminDB.collection('questionPacks').get();
    const packs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(packs);
  } catch (error) {
    console.error('Error fetching question packs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific question pack with questions
router.get('/packs/:packId', async (req, res) => {
  try {
    const packId = req.params.packId;
    
    // Get the pack details
    const packDoc = await adminDB.collection('questionPacks').doc(packId).get();
    
    if (!packDoc.exists) {
      return res.status(404).json({ error: 'Question pack not found' });
    }
    
    // Get the questions in the pack
    const questionsSnapshot = await adminDB.collection('questions')
      .where('packId', '==', packId)
      .get();
    
    const questions = questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json({
      pack: {
        id: packDoc.id,
        ...packDoc.data()
      },
      questions
    });
  } catch (error) {
    console.error('Error fetching question pack:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if a user has purchased a pack
router.get('/user/:userId/hasPurchased/:packId', async (req, res) => {
  try {
    const { userId, packId } = req.params;
    
    const userDoc = await adminDB.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    const hasPurchased = userData.purchasedPacks && userData.purchasedPacks.includes(packId);
    
    res.status(200).json({ hasPurchased });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
