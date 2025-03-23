
const express = require('express');
const router = express.Router();
const paystack = require('../config/paystack');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://mincssuyfzyrtuwooeyo.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      // Save transaction to Supabase
      const { data: transactionData, error: transactionError } = await supabase
        .from('purchases')
        .insert({
          user_id: response.data.metadata.userId,
          material_id: response.data.metadata.materialId || response.data.metadata.packId,
          amount: response.data.amount / 100, // Convert back to naira
          transaction_ref: response.data.reference
        });
      
      if (transactionError) {
        console.error('Error saving transaction:', transactionError);
      }
      
      // If it's a question pack purchase, update user's purchases if needed
      if (response.data.metadata.service === 'question_pack' || response.data.metadata.packId) {
        // In a more complex implementation, we might need additional logic here
        // to grant access to the purchased content
      }
    }
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
