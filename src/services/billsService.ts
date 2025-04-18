
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

// Educational pin types for WAEC, JAMB, NECO, etc.
export interface EducationalPin {
  pinType: 'waec' | 'jamb' | 'neco' | 'gce';
  quantity: number;
  email: string;
  phone: string;
}

// AI Question Solving types
export interface AcademicQuestion {
  id: string;
  question: string;
  subject: string;
  level: 'primary' | 'secondary' | 'university';
  response?: string;
  createdAt: string;
  userId: string;
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

export const purchaseEducationalPin = async (
  pinType: 'waec' | 'jamb' | 'neco' | 'gce',
  quantity: number,
  email: string,
  phone: string
): Promise<BillPayment> => {
  try {
    const userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;
    
    const response = await api.post('/bills/education-pin', {
      userId,
      pinType,
      quantity,
      email,
      phone,
      amount: getPinPrice(pinType) * quantity
    });
    
    return response.data;
  } catch (error) {
    console.error('Error purchasing educational pin:', error);
    throw error;
  }
};

// Helper function to get the price of different educational pins
export const getPinPrice = (pinType: 'waec' | 'jamb' | 'neco' | 'gce'): number => {
  switch (pinType) {
    case 'waec':
      return 7500; // WAEC PIN price in Naira
    case 'jamb':
      return 5700; // JAMB PIN price in Naira
    case 'neco':
      return 6500; // NECO PIN price in Naira
    case 'gce':
      return 8500; // GCE PIN price in Naira
    default:
      return 0;
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

// New AI question solving functions
export const submitAcademicQuestion = async (
  question: string,
  subject: string,
  level: 'primary' | 'secondary' | 'university'
): Promise<AcademicQuestion> => {
  try {
    const userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;
    
    const response = await api.post('/ai/solve-question', {
      userId,
      question,
      subject,
      level
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting academic question:', error);
    throw error;
  }
};

export const getQuestionHistory = async (): Promise<AcademicQuestion[]> => {
  try {
    const userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;
    
    const response = await api.get(`/ai/question-history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question history:', error);
    return [];
  }
};

