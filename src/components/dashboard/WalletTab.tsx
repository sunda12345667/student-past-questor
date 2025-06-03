
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Wallet, 
  CreditCard, 
  Gift, 
  TrendingUp, 
  Plus,
  History,
  Award,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserWallet, 
  creditWallet, 
  redeemLoyaltyPoints,
  type UserWallet,
  type WalletTransaction 
} from '@/services/walletService';

export default function WalletTab() {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [redeemPoints, setRedeemPoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      const userWallet = getUserWallet(currentUser.id);
      setWallet(userWallet);
    }
  }, [currentUser]);

  const handleTopUp = async () => {
    if (!currentUser?.id || !topUpAmount) return;
    
    const amount = parseInt(topUpAmount);
    if (amount < 100) {
      toast.error('Minimum top-up amount is ₦100');
      return;
    }

    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (creditWallet(currentUser.id, amount, 'Wallet top-up')) {
        setWallet(getUserWallet(currentUser.id));
        setTopUpAmount('');
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleRedeemPoints = () => {
    if (!currentUser?.id || !redeemPoints) return;
    
    const points = parseInt(redeemPoints);
    if (points < 10) {
      toast.error('Minimum redemption is 10 points');
      return;
    }

    if (redeemLoyaltyPoints(currentUser.id, points)) {
      setWallet(getUserWallet(currentUser.id));
      setRedeemPoints('');
    }
  };

  if (!wallet) {
    return <div>Loading wallet...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">My Wallet</h2>
      
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">₦{wallet.balance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Available balance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{wallet.loyaltyPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Points earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cashback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gift className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">₦{wallet.cashbackEarned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Lifetime earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Actions */}
      <Tabs defaultValue="topup" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="topup">Top Up</TabsTrigger>
          <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="topup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Top Up Wallet
              </CardTitle>
              <CardDescription>Add money to your wallet for quick payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  min="100"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setTopUpAmount(amount.toString())}
                  >
                    ₦{amount}
                  </Button>
                ))}
              </div>

              <Button 
                onClick={handleTopUp} 
                disabled={isLoading || !topUpAmount}
                className="w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : `Top Up ₦${topUpAmount || '0'}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redeem">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Redeem Loyalty Points
              </CardTitle>
              <CardDescription>Convert your loyalty points to wallet credit (10 points = ₦1)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points to Redeem</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="Enter points"
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(e.target.value)}
                  min="10"
                  max={wallet.loyaltyPoints}
                />
                <p className="text-sm text-muted-foreground">
                  Available: {wallet.loyaltyPoints} points
                </p>
              </div>

              {redeemPoints && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    You will receive: ₦{Math.floor(parseInt(redeemPoints) / 10)}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleRedeemPoints} 
                disabled={!redeemPoints || parseInt(redeemPoints) > wallet.loyaltyPoints}
                className="w-full"
              >
                Redeem Points
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wallet.transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                ) : (
                  wallet.transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' || transaction.type === 'cashback' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' || transaction.type === 'cashback' ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'credit' || transaction.type === 'cashback' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' || transaction.type === 'cashback' ? '+' : '-'}
                          ₦{transaction.amount.toLocaleString()}
                        </p>
                        <Badge variant={transaction.type === 'cashback' ? 'default' : 'secondary'}>
                          {transaction.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
