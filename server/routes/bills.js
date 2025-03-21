
const express = require('express');
const router = express.Router();
const { adminDB } = require('../config/firebase');
const paystack = require('../config/paystack');

// Pay a bill (airtime, data, etc.)
router.post('/pay', async (req, res) => {
  try {
    const { userId, serviceType, provider, accountNumber, amount } = req.body;
    
    // In a real application, you would integrate with the service provider's API
    // For now, we'll simulate a successful bill payment
    
    // Create a transaction record
    const transactionRef = await adminDB.collection('billPayments').add({
      userId,
      serviceType,
      provider,
      accountNumber,
      amount,
      status: 'completed',
      date: admin.firestore.FieldValue.serverTimestamp(),
      reference: `${serviceType.toUpperCase().substring(0, 3)}${accountNumber}`,
    });
    
    res.status(200).json({ 
      id: transactionRef.id,
      status: 'completed',
      message: `Your ${serviceType} payment was successful`
    });
  } catch (error) {
    console.error('Bill payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get bill payment history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const snapshot = await adminDB.collection('billPayments')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    
    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date ? doc.data().date.toDate().toISOString() : null
    }));
    
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching bill history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get service providers
router.get('/providers/:serviceType', async (req, res) => {
  try {
    const serviceType = req.params.serviceType;
    
    const snapshot = await adminDB.collection('serviceProviders')
      .where('serviceType', '==', serviceType)
      .get();
    
    const providers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(providers);
  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
