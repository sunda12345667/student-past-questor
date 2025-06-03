import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History } from 'lucide-react';
import { toast } from 'sonner';

export default function BillPayments() {
  const [serviceType, setServiceType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [billHistory, setBillHistory] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [detectedNetwork, setDetectedNetwork] = useState('');

  const detectNetwork = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('0803') || cleaned.startsWith('0806') || cleaned.startsWith('0813') || 
        cleaned.startsWith('0814') || cleaned.startsWith('0816') || cleaned.startsWith('0903') || 
        cleaned.startsWith('0906') || cleaned.startsWith('0913') || cleaned.startsWith('0916') ||
        cleaned.startsWith('0704') || cleaned.startsWith('0708') || cleaned.startsWith('0812')) {
      return 'MTN';
    } else if (cleaned.startsWith('0805') || cleaned.startsWith('0807') || cleaned.startsWith('0815') ||
               cleaned.startsWith('0811') || cleaned.startsWith('0905') || cleaned.startsWith('0915') ||
               cleaned.startsWith('0705') || cleaned.startsWith('0905')) {
      return 'GLO';
    } else if (cleaned.startsWith('0802') || cleaned.startsWith('0808') || cleaned.startsWith('0812') ||
               cleaned.startsWith('0701') || cleaned.startsWith('0902') || cleaned.startsWith('0904') ||
               cleaned.startsWith('0912') || cleaned.startsWith('0901')) {
      return 'AIRTEL';
    } else if (cleaned.startsWith('0809') || cleaned.startsWith('0817') || cleaned.startsWith('0818') ||
               cleaned.startsWith('0909') || cleaned.startsWith('0908')) {
      return '9MOBILE';
    }
    return '';
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    const network = detectNetwork(value);
    setDetectedNetwork(network);
  };

  const handleWalletPayment = async () => {
    if (!amount || amount < 100) {
      toast.error('Minimum amount is ₦100');
      return;
    }

    setIsLoading(true);
    
    try {
      const { processWalletPayment } = await import('@/services/paystackService');
      const result = await processWalletPayment('user-id', amount, `${serviceType} payment`);
      
      if (result.success && result.source === 'wallet') {
        toast.success('Payment successful from wallet!');
        setAmount(0);
        setAccountNumber('');
        setPhoneNumber('');
        setDetectedNetwork('');
      } else {
        // Redirect to Paystack for payment
        toast.info('Redirecting to payment...');
        // Add actual Paystack integration here
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Bill Payments</h2>
      
      {/* Service Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Service Type</CardTitle>
          <CardDescription>Choose the type of bill you want to pay</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airtime">Airtime</SelectItem>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="tv">TV Subscription</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {serviceType === 'airtime' && (
        <Card>
          <CardHeader>
            <CardTitle>Buy Airtime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
              {detectedNetwork && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{detectedNetwork}</Badge>
                  <span className="text-sm text-muted-foreground">Network detected</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <Button onClick={handleWalletPayment} disabled={isLoading} className="w-full">
              {isLoading ? 'Processing...' : `Pay ₦${amount.toLocaleString()} from Wallet`}
            </Button>
          </CardContent>
        </Card>
      )}

      {serviceType === 'data' && (
        <Card>
          <CardHeader>
            <CardTitle>Buy Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="08012345678"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
              {detectedNetwork && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{detectedNetwork}</Badge>
                  <span className="text-sm text-muted-foreground">Network detected</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <Button onClick={handleWalletPayment} disabled={isLoading} className="w-full">
              {isLoading ? 'Processing...' : `Pay ₦${amount.toLocaleString()} from Wallet`}
            </Button>
          </CardContent>
        </Card>
      )}

      {serviceType === 'tv' && (
        <Card>
          <CardHeader>
            <CardTitle>TV Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <Button onClick={handleWalletPayment} disabled={isLoading} className="w-full">
              {isLoading ? 'Processing...' : `Pay ₦${amount.toLocaleString()} from Wallet`}
            </Button>
          </CardContent>
        </Card>
      )}

      {serviceType === 'electricity' && (
        <Card>
          <CardHeader>
            <CardTitle>Electricity Bill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <Button onClick={handleWalletPayment} disabled={isLoading} className="w-full">
              {isLoading ? 'Processing...' : `Pay ₦${amount.toLocaleString()} from Wallet`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bill Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View your recent bill payments</CardDescription>
        </CardHeader>
        <CardContent>
          {billHistory.length === 0 ? (
            <p>No payment history available.</p>
          ) : (
            <div className="space-y-2">
              {billHistory.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium text-sm">{bill.serviceType}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(bill.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    ₦{bill.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
