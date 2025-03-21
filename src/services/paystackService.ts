
import api from '@/services/api';

/**
 * Initiates the Paystack payment process for purchasing a question pack
 * 
 * @param packId - The ID of the question pack being purchased
 * @param packDescription - Description of the question pack
 * @param amount - The amount to charge in Naira
 * @returns A Promise that resolves when the payment process is initiated
 */
export const processQuestionPackPurchase = async (
  packId: string,
  packDescription: string,
  amount: number
): Promise<void> => {
  try {
    // The backend will handle redirecting to Paystack checkout
    const response = await api.post('/payment/initialize', {
      packId,
      packDescription,
      amount, // This is in Naira, server will convert to kobo if needed
    });

    if (response.data && response.data.authorization_url) {
      // Redirect to Paystack checkout page
      window.location.href = response.data.authorization_url;
    } else {
      console.error('Invalid response from payment initialization:', response);
      throw new Error('Failed to initialize payment. Please try again.');
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
};

/**
 * Verify a Paystack payment transaction
 * 
 * @param reference - The transaction reference returned by Paystack
 * @returns A Promise that resolves with the transaction verification result
 */
export const verifyPaystackTransaction = async (reference: string): Promise<any> => {
  try {
    const response = await api.get(`/payment/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Transaction verification error:', error);
    throw error;
  }
};
