
import api from './api';

// Bill payment types
export interface BillPayment {
  id: string;
  serviceType: 'airtime' | 'data' | 'tv' | 'electricity' | 'education' | 'event';
  provider: string;
  accountNumber: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  serviceType: string;
  logo?: string;
}

// API functions
export const getServiceProviders = async (serviceType: string): Promise<ServiceProvider[]> => {
  try {
    const response = await api.get(`/bills/providers/${serviceType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${serviceType} providers:`, error);
    return [];
  }
};

export const payBill = async (
  serviceType: 'airtime' | 'data' | 'tv' | 'electricity' | 'education' | 'event',
  provider: string,
  accountNumber: string,
  amount: number
): Promise<BillPayment> => {
  try {
    const userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;
    
    const response = await api.post('/bills/pay', {
      userId,
      serviceType,
      provider,
      accountNumber,
      amount
    });
    
    return response.data;
  } catch (error) {
    console.error('Error paying bill:', error);
    throw error;
  }
};

export const getBillHistory = async (): Promise<BillPayment[]> => {
  try {
    const userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;
    
    const response = await api.get(`/bills/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bill history:', error);
    return [];
  }
};
