
import api from './api';
import { toast } from 'sonner';

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    metadata: any;
  };
}

export const initializePayment = async (
  email: string,
  amount: number,
  metadata: any
): Promise<PaymentResponse> => {
  try {
    const response = await api.post('/payment/initialize', {
      email,
      amount,
      metadata
    });
    
    return response.data;
  } catch (error) {
    console.error('Payment initialization error:', error);
    toast.error('Failed to initialize payment. Please try again.');
    throw error;
  }
};

export const verifyPayment = async (reference: string): Promise<VerifyResponse> => {
  try {
    const response = await api.get(`/payment/verify/${reference}`);
    
    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    toast.error('Failed to verify payment. Please contact support.');
    throw error;
  }
};

export const processQuestionPackPurchase = async (
  packId: string,
  packTitle: string,
  amount: number
) => {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    
    const paymentResponse = await initializePayment(user.email, amount, {
      service: 'question_pack',
      packId,
      packTitle
    });
    
    // Redirect to Paystack payment page
    window.location.href = paymentResponse.data.authorization_url;
    
    return paymentResponse;
  } catch (error) {
    console.error('Error processing question pack purchase:', error);
    toast.error('Failed to process payment. Please try again.');
    throw error;
  }
};
