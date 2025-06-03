
import { toast } from 'sonner';

interface WalletData {
  userId: string;
  balance: number;
  history: Transaction[];
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const WALLET_STORAGE_KEY = 'irapid_wallets';

// Initialize wallet data in localStorage
const initializeWallets = (): Record<string, WalletData> => {
  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  if (!stored) {
    const defaultWallets = {};
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(defaultWallets));
    return defaultWallets;
  }
  return JSON.parse(stored);
};

// Get user wallet
export const getUserWallet = (userId: string): WalletData => {
  const wallets = initializeWallets();
  
  if (!wallets[userId]) {
    wallets[userId] = {
      userId,
      balance: 5000, // Default balance for demo
      history: [
        {
          id: 'welcome-bonus',
          type: 'credit',
          amount: 5000,
          description: 'Welcome bonus',
          date: new Date().toISOString(),
          status: 'completed'
        }
      ]
    };
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  }
  
  return wallets[userId];
};

// Credit wallet
export const creditWallet = (userId: string, amount: number, description: string): boolean => {
  try {
    const wallets = initializeWallets();
    const wallet = getUserWallet(userId);
    
    wallet.balance += amount;
    wallet.history.unshift({
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description,
      date: new Date().toISOString(),
      status: 'completed'
    });
    
    wallets[userId] = wallet;
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
    
    toast.success(`₦${amount.toLocaleString()} credited to your wallet`);
    return true;
  } catch (error) {
    console.error('Credit wallet error:', error);
    toast.error('Failed to credit wallet');
    return false;
  }
};

// Debit wallet
export const debitWallet = (userId: string, amount: number, description: string): boolean => {
  try {
    const wallets = initializeWallets();
    const wallet = getUserWallet(userId);
    
    if (wallet.balance < amount) {
      toast.error('Insufficient wallet balance');
      return false;
    }
    
    wallet.balance -= amount;
    wallet.history.unshift({
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description,
      date: new Date().toISOString(),
      status: 'completed'
    });
    
    wallets[userId] = wallet;
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
    
    return true;
  } catch (error) {
    console.error('Debit wallet error:', error);
    toast.error('Failed to debit wallet');
    return false;
  }
};

// Get wallet balance
export const getWalletBalance = (userId: string): number => {
  const wallet = getUserWallet(userId);
  return wallet.balance;
};

// Get wallet history
export const getWalletHistory = (userId: string): Transaction[] => {
  const wallet = getUserWallet(userId);
  return wallet.history;
};
