
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Wallet,
  Hash,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentMethods = () => {
  const { toast } = useToast();
  const [activeMethod, setActiveMethod] = useState('card');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Payment method updated',
      description: 'Your payment method has been updated successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Payment Methods</h2>
      
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="add">Add Payment Method</TabsTrigger>
          <TabsTrigger value="manage">Manage Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card 
              className={`cursor-pointer hover:border-primary ${activeMethod === 'card' ? 'border-primary' : ''}`}
              onClick={() => setActiveMethod('card')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <CreditCard className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium">Card</h3>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer hover:border-primary ${activeMethod === 'bank' ? 'border-primary' : ''}`}
              onClick={() => setActiveMethod('bank')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Banknote className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium">Bank Transfer</h3>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer hover:border-primary ${activeMethod === 'ussd' ? 'border-primary' : ''}`}
              onClick={() => setActiveMethod('ussd')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Hash className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium">USSD</h3>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer hover:border-primary ${activeMethod === 'airtime' ? 'border-primary' : ''}`}
              onClick={() => setActiveMethod('airtime')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Smartphone className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium">Airtime</h3>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer hover:border-primary ${activeMethod === 'wallet' ? 'border-primary' : ''}`}
              onClick={() => setActiveMethod('wallet')}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Wallet className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium">Wallet</h3>
              </CardContent>
            </Card>
          </div>
          
          {activeMethod === 'card' && (
            <Card>
              <CardHeader>
                <CardTitle>Card Details</CardTitle>
                <CardDescription>Add a new debit or credit card</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Add Card</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">Visa ending in 4242</CardTitle>
                      <CardDescription>Expires 12/25</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Wallet className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-base">Wallet Balance</CardTitle>
                      <CardDescription>₦5,000.00</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Top Up</Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentMethods;
