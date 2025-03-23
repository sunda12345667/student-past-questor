
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
    
    // Validate inputs
    if (!email || !amount || !metadata || !metadata.userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
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
      callback_url: `${req.headers.origin}/payment-callback`,
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
    
    if (!reference) {
      return res.status(400).json({ error: 'Reference is required' });
    }
    
    const response = await paystack.transaction.verify(reference);
    
    if (response.data.status === 'success') {
      // Extract the relevant data from the response
      const { metadata, amount, customer } = response.data;
      const userId = metadata.userId;
      const materialId = metadata.materialId || metadata.packId;
      
      if (userId && materialId) {
        // Check if purchase already exists
        const { data: existingPurchase } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', userId)
          .eq('material_id', materialId)
          .maybeSingle();

        if (!existingPurchase) {
          // Save transaction to Supabase
          const { data: transactionData, error: transactionError } = await supabase
            .from('purchases')
            .insert({
              user_id: userId,
              material_id: materialId,
              amount: amount / 100, // Convert back to naira
              transaction_ref: reference
            });
          
          if (transactionError) {
            console.error('Error saving transaction:', transactionError);
          }
          
          // Update material download count
          const { error: updateError } = await supabase
            .from('study_materials')
            .update({ downloads: supabase.rpc('increment', { count: 1 }) })
            .eq('id', materialId);
          
          if (updateError) {
            console.error('Error updating download count:', updateError);
          }
          
          // If user has a referral, update it
          const { data: referral, error: referralError } = await supabase
            .from('referrals')
            .select('*')
            .eq('referred_id', userId)
            .eq('status', 'pending')
            .maybeSingle();
          
          if (referral && !referralError) {
            // Calculate reward (e.g., 10% of the transaction amount)
            const rewardAmount = Math.floor(amount / 1000); // 10% converted to whole units
            
            // Update referral status and reward
            await supabase
              .from('referrals')
              .update({
                status: 'completed',
                reward_amount: rewardAmount,
                completed_at: new Date().toISOString()
              })
              .eq('id', referral.id);
            
            // Add reward to referrer's balance
            await supabase
              .from('user_rewards')
              .update({
                cash_balance: supabase.rpc('increment', { count: rewardAmount })
              })
              .eq('user_id', referral.referrer_id);
          }
        }
      }
    }
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
