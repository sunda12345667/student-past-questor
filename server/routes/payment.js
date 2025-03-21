
const express = require('express');
const router = express.Router();
const paystack = require('../config/paystack');
const { adminDB } = require('../config/firebase');

// Initialize payment
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      metadata: {
        ...metadata,
        custom_fields: [
          {
            display_name: 'Payment For',
            variable_name: 'payment_for',
            value: metadata.service || 'Study Materials',
          },
        ],
      },
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const reference = req.params.reference;
    
    const response = await paystack.transaction.verify(reference);
    
    if (response.data.status === 'success') {
      // Save transaction to Firebase
      await adminDB.collection('transactions').add({
        reference: response.data.reference,
        amount: response.data.amount / 100, // Convert back to naira
        email: response.data.customer.email,
        metadata: response.data.metadata,
        status: response.data.status,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      
      // If it's a question pack purchase, update user's purchases
      if (response.data.metadata.service === 'question_pack') {
        await adminDB.collection('users')
          .where('email', '==', response.data.customer.email)
          .get()
          .then(async (snapshot) => {
            if (!snapshot.empty) {
              const userId = snapshot.docs[0].id;
              await adminDB.collection('users').doc(userId).update({
                purchasedPacks: admin.firestore.FieldValue.arrayUnion(response.data.metadata.packId)
              });
            }
          });
      }
    }
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
