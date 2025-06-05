
import { supabase } from '@/integrations/supabase/client';

interface PaymentInitData {
  email: string;
  amount: number;
  metadata: {
    userId: string;
    materialId?: string;
    service?: string;
  };
}

interface PaymentResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface VerifyResponse {
  status: string;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    metadata: any;
  };
}

export const paystackService = {
  async initializePayment(paymentData: PaymentInitData): Promise<PaymentResponse> {
    try {
      console.log('Initializing payment:', paymentData);
      
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status) {
        return data;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw new Error('Failed to initialize payment. Please try again.');
    }
  },

  async verifyPayment(reference: string): Promise<VerifyResponse> {
    try {
      console.log('Verifying payment:', reference);
      
      const response = await fetch(`/api/payment/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Failed to verify payment. Please contact support.');
    }
  },

  async recordPurchase(userId: string, materialId: string, amount: number, reference: string) {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          material_id: materialId,
          amount,
          transaction_ref: reference,
        });

      if (error) {
        console.error('Error recording purchase:', error);
        throw error;
      }

      console.log('Purchase recorded successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to record purchase:', error);
      throw error;
    }
  },

  async updateUserRewards(userId: string, amount: number) {
    try {
      // Check if user rewards record exists
      const { data: existingRewards } = await supabase
        .from('user_rewards')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingRewards) {
        // Update existing record
        const { error } = await supabase
          .from('user_rewards')
          .update({
            cash_balance: (existingRewards.cash_balance || 0) + Math.floor(amount * 0.1), // 10% cashback
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_rewards')
          .insert({
            user_id: userId,
            cash_balance: Math.floor(amount * 0.1),
            coins: 0,
            study_streak: 0,
          });

        if (error) throw error;
      }

      console.log('User rewards updated successfully');
    } catch (error) {
      console.error('Failed to update user rewards:', error);
      throw error;
    }
  },
};
