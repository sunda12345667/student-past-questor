import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Wallet as WalletIcon, History } from 'lucide-react';

export default function WalletTab() {
  const [balance, setBalance] = useState(5000);
  const [loyaltyPoints, setLoyaltyPoints] = useState(250);
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'credit', amount: 1000, description: 'Wallet top-up', date: '2024-05-25' },
    { id: '2', type: 'debit', amount: 250, description: 'Purchased study material', date: '2024-05-24' },
    { id: '3', type: 'cashback', amount: 50, description: 'Cashback reward', date: '2024-05-23' },
  ]);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  const handleTopUp = async () => {
    if (!topUpAmount || topUpAmount < 100) {
      toast.error('Minimum top-up amount is ₦100');
      return;
    }

    setIsTopUpLoading(true);
    
    try {
      const { initializePayment } = await import('@/services/paystackService');
      
      const paymentResponse = await initializePayment({
        email: 'user@example.com', // Get from auth context
        amount: topUpAmount,
        metadata: {
          userId: 'user-id', // Get from auth context
          service: 'Wallet Top-up'
        }
      });

      if (paymentResponse.status) {
        // Open Stripe checkout in a new tab
        window.open(paymentResponse.data.authorization_url, '_blank');
        toast.success('Redirecting to payment...');
      }
    } catch (error) {
      toast.error('Failed to initialize payment');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">My Wallet</h2>
      
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground">Earn points for every purchase</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Top-up */}
      <Card>
        <CardHeader>
          <CardTitle>Top Up Wallet</CardTitle>
          <CardDescription>Add money to your iRapid wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topup-amount">Amount (₦)</Label>
            <Input
              id="topup-amount"
              type="number"
              placeholder="1000"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(Number(e.target.value))}
            />
          </div>
          
          <Button 
            onClick={handleTopUp} 
            disabled={isTopUpLoading} 
            className="w-full"
          >
            {isTopUpLoading ? 'Processing...' : `Top Up ₦${topUpAmount.toLocaleString()}`}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent wallet transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>
              <div className={transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}>
                {transaction.type === 'credit' ? '+' : '-'} ₦{transaction.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
