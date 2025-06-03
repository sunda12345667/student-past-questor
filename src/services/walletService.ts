
import { toast } from 'sonner';

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'cashback' | 'loyalty';
  amount: number;
  description: string;
  reference?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface UserWallet {
  userId: string;
  balance: number;
  loyaltyPoints: number;
  totalSpent: number;
  cashbackEarned: number;
  transactions: WalletTransaction[];
}

const WALLET_STORAGE_KEY = 'studyquest_wallets';
const CASHBACK_RATE = 0.02; // 2% cashback (₦20 for every ₦1000)
const LOYALTY_POINTS_RATE = 10; // 10 points per ₦1000 spent

// Initialize wallet for user
export const initializeWallet = (userId: string): UserWallet => {
  const wallets = getAllWallets();
  
  if (!wallets[userId]) {
    wallets[userId] = {
      userId,
      balance: 0,
      loyaltyPoints: 0,
      totalSpent: 0,
      cashbackEarned: 0,
      transactions: []
    };
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  }
  
  return wallets[userId];
};

// Get all wallets
const getAllWallets = (): Record<string, UserWallet> => {
  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Get user wallet
export const getUserWallet = (userId: string): UserWallet => {
  return initializeWallet(userId);
};

// Add transaction to wallet
export const addWalletTransaction = (
  userId: string,
  type: WalletTransaction['type'],
  amount: number,
  description: string,
  reference?: string
): WalletTransaction => {
  const wallets = getAllWallets();
  const wallet = initializeWallet(userId);
  
  const transaction: WalletTransaction = {
    id: Date.now().toString(),
    userId,
    type,
    amount,
    description,
    reference,
    date: new Date().toISOString(),
    status: 'completed'
  };
  
  // Update wallet balance
  if (type === 'credit' || type === 'cashback') {
    wallet.balance += amount;
  } else if (type === 'debit') {
    wallet.balance -= amount;
  }
  
  // Update totals
  if (type === 'debit') {
    wallet.totalSpent += amount;
    
    // Calculate and add cashback
    const cashback = Math.floor(amount * CASHBACK_RATE);
    if (cashback > 0) {
      wallet.balance += cashback;
      wallet.cashbackEarned += cashback;
      
      const cashbackTransaction: WalletTransaction = {
        id: (Date.now() + 1).toString(),
        userId,
        type: 'cashback',
        amount: cashback,
        description: `Cashback for purchase of ₦${amount.toLocaleString()}`,
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      wallet.transactions.unshift(cashbackTransaction);
      toast.success(`You earned ₦${cashback} cashback!`);
    }
    
    // Add loyalty points
    const points = Math.floor((amount / 1000) * LOYALTY_POINTS_RATE);
    if (points > 0) {
      wallet.loyaltyPoints += points;
      toast.success(`You earned ${points} loyalty points!`);
    }
  }
  
  wallet.transactions.unshift(transaction);
  wallets[userId] = wallet;
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
  
  return transaction;
};

// Credit wallet
export const creditWallet = (userId: string, amount: number, description: string): boolean => {
  try {
    addWalletTransaction(userId, 'credit', amount, description);
    toast.success(`₦${amount.toLocaleString()} credited to your wallet`);
    return true;
  } catch (error) {
    toast.error('Failed to credit wallet');
    return false;
  }
};

// Debit wallet
export const debitWallet = (userId: string, amount: number, description: string): boolean => {
  const wallet = getUserWallet(userId);
  
  if (wallet.balance < amount) {
    toast.error('Insufficient wallet balance');
    return false;
  }
  
  try {
    addWalletTransaction(userId, 'debit', amount, description);
    toast.success(`₦${amount.toLocaleString()} debited from your wallet`);
    return true;
  } catch (error) {
    toast.error('Failed to debit wallet');
    return false;
  }
};

// Redeem loyalty points
export const redeemLoyaltyPoints = (userId: string, points: number): boolean => {
  const wallet = getUserWallet(userId);
  
  if (wallet.loyaltyPoints < points) {
    toast.error('Insufficient loyalty points');
    return false;
  }
  
  try {
    const wallets = getAllWallets();
    wallet.loyaltyPoints -= points;
    const creditAmount = Math.floor(points / 10); // 10 points = ₦1
    wallet.balance += creditAmount;
    
    addWalletTransaction(userId, 'credit', creditAmount, `Redeemed ${points} loyalty points`);
    wallets[userId] = wallet;
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
    
    toast.success(`Redeemed ${points} points for ₦${creditAmount}`);
    return true;
  } catch (error) {
    toast.error('Failed to redeem points');
    return false;
  }
};
