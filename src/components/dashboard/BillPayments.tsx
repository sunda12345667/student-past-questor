
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Smartphone, Lightbulb, Tv, GraduationCap, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { payBill, purchaseEducationalPin, getPinPrice } from "@/services/billsService";

export default function BillPayments() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Airtime/Data form state
  const [airtimeForm, setAirtimeForm] = useState({
    provider: '',
    phoneNumber: '',
    amount: '',
    serviceType: 'airtime'
  });

  // Electricity form state
  const [electricityForm, setElectricityForm] = useState({
    provider: '',
    meterNumber: '',
    amount: ''
  });

  // TV subscription form state
  const [tvForm, setTvForm] = useState({
    provider: '',
    smartCardNumber: '',
    package: '',
    amount: ''
  });

  // Education PIN form state
  const [educationForm, setEducationForm] = useState({
    pinType: '',
    quantity: '1',
    email: currentUser?.email || '',
    phone: ''
  });

  const handleAirtimePayment = async () => {
    if (!airtimeForm.provider || !airtimeForm.phoneNumber || !airtimeForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await payBill(
        airtimeForm.serviceType as 'airtime' | 'data',
        airtimeForm.provider,
        airtimeForm.phoneNumber,
        parseInt(airtimeForm.amount)
      );
      
      toast.success(`${airtimeForm.serviceType === 'airtime' ? 'Airtime' : 'Data'} purchase successful!`);
      setAirtimeForm({ provider: '', phoneNumber: '', amount: '', serviceType: 'airtime' });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleElectricityPayment = async () => {
    if (!electricityForm.provider || !electricityForm.meterNumber || !electricityForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await payBill('electricity', electricityForm.provider, electricityForm.meterNumber, parseInt(electricityForm.amount));
      toast.success('Electricity bill payment successful!');
      setElectricityForm({ provider: '', meterNumber: '', amount: '' });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTVPayment = async () => {
    if (!tvForm.provider || !tvForm.smartCardNumber || !tvForm.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await payBill('tv', tvForm.provider, tvForm.smartCardNumber, parseInt(tvForm.amount));
      toast.success('TV subscription payment successful!');
      setTvForm({ provider: '', smartCardNumber: '', package: '', amount: '' });
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEducationPinPurchase = async () => {
    if (!educationForm.pinType || !educationForm.email || !educationForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await purchaseEducationalPin(
        educationForm.pinType as 'waec' | 'jamb' | 'neco' | 'gce',
        parseInt(educationForm.quantity),
        educationForm.email,
        educationForm.phone
      );
      
      toast.success(`${educationForm.pinType.toUpperCase()} PIN purchase successful!`);
      setEducationForm({ pinType: '', quantity: '1', email: currentUser?.email || '', phone: '' });
    } catch (error) {
      toast.error('PIN purchase failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Utility Payments & Services</h2>
        <p className="text-muted-foreground">Pay your bills quickly and securely</p>
      </div>
      
      <Tabs defaultValue="airtime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="airtime" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Airtime & Data
          </TabsTrigger>
          <TabsTrigger value="electricity" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Electricity
          </TabsTrigger>
          <TabsTrigger value="tv" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            TV Subscription
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </TabsTrigger>
        </TabsList>

        <TabsContent value="airtime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Buy Airtime & Data
              </CardTitle>
              <CardDescription>Purchase airtime and data for all Nigerian networks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select 
                    value={airtimeForm.serviceType} 
                    onValueChange={(value) => setAirtimeForm(prev => ({ ...prev, serviceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airtime">Airtime</SelectItem>
                      <SelectItem value="data">Data Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="provider">Network Provider</Label>
                  <Select 
                    value={airtimeForm.provider} 
                    onValueChange={(value) => setAirtimeForm(prev => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN</SelectItem>
                      <SelectItem value="glo">Glo</SelectItem>
                      <SelectItem value="airtel">Airtel</SelectItem>
                      <SelectItem value="9mobile">9mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="08012345678"
                    value={airtimeForm.phoneNumber}
                    onChange={(e) => setAirtimeForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={airtimeForm.amount}
                    onChange={(e) => setAirtimeForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={handleAirtimePayment} disabled={isLoading} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : `Pay ₦${airtimeForm.amount || '0'}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="electricity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Pay Electricity Bills
              </CardTitle>
              <CardDescription>Pay for electricity across Nigeria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="disco">Distribution Company</Label>
                  <Select 
                    value={electricityForm.provider} 
                    onValueChange={(value) => setElectricityForm(prev => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select DISCO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eko">Eko Electric (EKEDC)</SelectItem>
                      <SelectItem value="ikeja">Ikeja Electric (IE)</SelectItem>
                      <SelectItem value="abuja">Abuja Electric (AEDC)</SelectItem>
                      <SelectItem value="phcn">Port Harcourt Electric (PHEDC)</SelectItem>
                      <SelectItem value="kano">Kano Electric (KEDCO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meter">Meter Number</Label>
                  <Input
                    id="meter"
                    placeholder="Enter meter number"
                    value={electricityForm.meterNumber}
                    onChange={(e) => setElectricityForm(prev => ({ ...prev, meterNumber: e.target.value }))}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={electricityForm.amount}
                    onChange={(e) => setElectricityForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={handleElectricityPayment} disabled={isLoading} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : `Pay ₦${electricityForm.amount || '0'}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tv">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                Pay TV Subscriptions
              </CardTitle>
              <CardDescription>Subscribe to your favorite TV packages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tv-provider">TV Provider</Label>
                  <Select 
                    value={tvForm.provider} 
                    onValueChange={(value) => setTvForm(prev => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select TV provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dstv">DStv</SelectItem>
                      <SelectItem value="gotv">GOtv</SelectItem>
                      <SelectItem value="startimes">StarTimes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smartcard">Smart Card Number</Label>
                  <Input
                    id="smartcard"
                    placeholder="Enter smart card number"
                    value={tvForm.smartCardNumber}
                    onChange={(e) => setTvForm(prev => ({ ...prev, smartCardNumber: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package">Package</Label>
                  <Select 
                    value={tvForm.package} 
                    onValueChange={(value) => setTvForm(prev => ({ ...prev, package: value, amount: getPackagePrice(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact - ₦9,000</SelectItem>
                      <SelectItem value="premium">Premium - ₦21,000</SelectItem>
                      <SelectItem value="family">Family - ₦4,000</SelectItem>
                      <SelectItem value="access">Access - ₦2,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={tvForm.amount}
                    onChange={(e) => setTvForm(prev => ({ ...prev, amount: e.target.value }))}
                    readOnly
                  />
                </div>
              </div>

              <Button onClick={handleTVPayment} disabled={isLoading} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : `Pay ₦${tvForm.amount || '0'}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education Payments
              </CardTitle>
              <CardDescription>Purchase education PINs for exams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pin-type">Exam Type</Label>
                  <Select 
                    value={educationForm.pinType} 
                    onValueChange={(value) => setEducationForm(prev => ({ ...prev, pinType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waec">WAEC - ₦7,500</SelectItem>
                      <SelectItem value="jamb">JAMB - ₦5,700</SelectItem>
                      <SelectItem value="neco">NECO - ₦6,500</SelectItem>
                      <SelectItem value="gce">GCE - ₦8,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select 
                    value={educationForm.quantity} 
                    onValueChange={(value) => setEducationForm(prev => ({ ...prev, quantity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={educationForm.email}
                    onChange={(e) => setEducationForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="08012345678"
                    value={educationForm.phone}
                    onChange={(e) => setEducationForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {educationForm.pinType && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Total Amount:</strong> ₦{(getPinPrice(educationForm.pinType as any) * parseInt(educationForm.quantity)).toLocaleString()}
                  </p>
                </div>
              )}

              <Button onClick={handleEducationPinPurchase} disabled={isLoading} className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Processing...' : 'Purchase PIN'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get package prices
function getPackagePrice(packageType: string): string {
  switch (packageType) {
    case 'compact': return '9000';
    case 'premium': return '21000';
    case 'family': return '4000';
    case 'access': return '2500';
    default: return '';
  }
}
