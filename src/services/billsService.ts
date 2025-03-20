
import { toast } from 'sonner';

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

// Sample providers
const networkProviders: ServiceProvider[] = [
  { id: 'mtn', name: 'MTN', serviceType: 'airtime' },
  { id: 'airtel', name: 'Airtel', serviceType: 'airtime' },
  { id: 'glo', name: 'Glo', serviceType: 'airtime' },
  { id: '9mobile', name: '9Mobile', serviceType: 'airtime' }
];

const dataProviders: ServiceProvider[] = [
  { id: 'mtn-data', name: 'MTN', serviceType: 'data' },
  { id: 'airtel-data', name: 'Airtel', serviceType: 'data' },
  { id: 'glo-data', name: 'Glo', serviceType: 'data' },
  { id: '9mobile-data', name: '9Mobile', serviceType: 'data' }
];

const tvProviders: ServiceProvider[] = [
  { id: 'dstv', name: 'DSTV', serviceType: 'tv' },
  { id: 'gotv', name: 'GoTV', serviceType: 'tv' },
  { id: 'startimes', name: 'StarTimes', serviceType: 'tv' }
];

const electricityProviders: ServiceProvider[] = [
  { id: 'ikeja', name: 'Ikeja Electric', serviceType: 'electricity' },
  { id: 'eko', name: 'Eko Electric', serviceType: 'electricity' },
  { id: 'abuja', name: 'Abuja Electric', serviceType: 'electricity' },
  { id: 'ibadan', name: 'Ibadan Electric', serviceType: 'electricity' }
];

// Sample transactions
const sampleTransactions: BillPayment[] = [
  {
    id: '1',
    serviceType: 'airtime',
    provider: 'MTN',
    accountNumber: '08012345678',
    amount: 1000,
    status: 'completed',
    date: '2023-09-15',
    reference: 'AIR08012345678'
  },
  {
    id: '2',
    serviceType: 'tv',
    provider: 'DSTV',
    accountNumber: '1234567890',
    amount: 5000,
    status: 'completed',
    date: '2023-09-10',
    reference: 'TV1234567890'
  },
  {
    id: '3',
    serviceType: 'electricity',
    provider: 'Ikeja Electric',
    accountNumber: '45678901234',
    amount: 10000,
    status: 'pending',
    date: '2023-09-18',
    reference: 'ELE45678901234'
  }
];

// API functions
export const getServiceProviders = async (serviceType: string): Promise<ServiceProvider[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (serviceType) {
    case 'airtime':
      return networkProviders;
    case 'data':
      return dataProviders;
    case 'tv':
      return tvProviders;
    case 'electricity':
      return electricityProviders;
    default:
      return [];
  }
};

export const payBill = async (
  serviceType: 'airtime' | 'data' | 'tv' | 'electricity' | 'education' | 'event',
  provider: string,
  accountNumber: string,
  amount: number
): Promise<BillPayment> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a random transaction ID
  const transactionId = Math.random().toString(36).substring(2, 15);
  
  // Create the payment record
  const payment: BillPayment = {
    id: transactionId,
    serviceType,
    provider,
    accountNumber,
    amount,
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
    reference: `${serviceType.toUpperCase().substring(0, 3)}${accountNumber}`
  };
  
  toast.success(`Your ${serviceType} payment was successful`);
  return payment;
};

export const getBillHistory = async (): Promise<BillPayment[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  return [...sampleTransactions];
};
