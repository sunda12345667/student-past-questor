
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";
import { 
  Smartphone, 
  Wifi, 
  Tv, 
  Lightbulb,
  GraduationCap,
  Ticket,
  CheckCircle
} from 'lucide-react';
import { payBill, getServiceProviders } from '@/services/billsService';

const BillPayments = () => {
  const [activeService, setActiveService] = useState('airtime');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('mtn');
  const [smartcardNumber, setSmartcardNumber] = useState('');
  const [tvProvider, setTvProvider] = useState('dstv');
  const [meterNumber, setMeterNumber] = useState('');
  const [meterType, setMeterType] = useState('prepaid');
  const [distributor, setDistributor] = useState('ikeja');
  const [institution, setInstitution] = useState('');
  const [studentId, setStudentId] = useState('');
  const [eventName, setEventName] = useState('');
  const [ticketType, setTicketType] = useState('regular');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get account number based on service type
      let accountNumber = '';
      switch (activeService) {
        case 'airtime':
        case 'data':
          accountNumber = phoneNumber;
          break;
        case 'tv':
          accountNumber = smartcardNumber;
          break;
        case 'electricity':
          accountNumber = meterNumber;
          break;
        case 'education':
          accountNumber = studentId;
          break;
        case 'event':
          accountNumber = eventName;
          break;
      }
      
      // Get provider based on service type
      let provider = '';
      switch (activeService) {
        case 'airtime':
        case 'data':
          provider = network;
          break;
        case 'tv':
          provider = tvProvider;
          break;
        case 'electricity':
          provider = distributor;
          break;
        case 'education':
          provider = institution;
          break;
        case 'event':
          provider = ticketType;
          break;
      }
      
      // Make API call to pay bill
      const result = await payBill(
        activeService as any,
        provider,
        accountNumber,
        parseFloat(amount)
      );
      
      toast.success(`Your ${getServiceName(activeService)} payment was successful`, {
        description: `Reference: ${result.reference}`,
        duration: 5000,
      });
      
      // Reset form
      setPhoneNumber('');
      setSmartcardNumber('');
      setMeterNumber('');
      setStudentId('');
      setEventName('');
      setAmount('');
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed', {
        description: 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getServiceName = (service: string): string => {
    switch (service) {
      case 'airtime': return 'Airtime';
      case 'data': return 'Internet Data';
      case 'tv': return 'TV Subscription';
      case 'electricity': return 'Electricity Bill';
      case 'education': return 'Education Payment';
      case 'event': return 'Event Ticket';
      default: return 'service';
    }
  };

  const renderServiceIcon = (service: string, className = "h-8 w-8 mb-2 text-primary") => {
    switch (service) {
      case 'airtime': return <Smartphone className={className} />;
      case 'data': return <Wifi className={className} />;
      case 'tv': return <Tv className={className} />;
      case 'electricity': return <Lightbulb className={className} />;
      case 'education': return <GraduationCap className={className} />;
      case 'event': return <Ticket className={className} />;
      default: return <Smartphone className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Bill Payments</h2>
        <Card className="bg-green-50 border-green-200 p-2">
          <div className="flex items-center text-green-700 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Commission on every transaction!
          </div>
        </Card>
      </div>
      
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Smartphone className="h-4 w-4 text-green-600" />
              <span>Buy Airtime & Data</span>
            </div>
            <div className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span>Pay Electricity Bills</span>
            </div>
            <div className="flex items-center gap-1">
              <Tv className="h-4 w-4 text-blue-600" />
              <span>Pay TV Subscriptions</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4 text-purple-600" />
              <span>Education Payments</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {['airtime', 'data', 'tv', 'electricity', 'education', 'event'].map((service) => (
          <Card 
            key={service}
            className={`cursor-pointer hover:border-primary transition-all ${activeService === service ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => setActiveService(service)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              {renderServiceIcon(service)}
              <h3 className="font-medium text-sm">{getServiceName(service)}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {renderServiceIcon(activeService, "h-5 w-5 text-primary")}
            {getServiceName(activeService)}
          </CardTitle>
          <CardDescription>Complete your payment details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(activeService === 'airtime' || activeService === 'data') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    placeholder="Enter phone number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network">Network Provider</Label>
                  <select 
                    id="network" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                  >
                    <option value="mtn">MTN</option>
                    <option value="airtel">Airtel</option>
                    <option value="glo">Glo</option>
                    <option value="9mobile">9Mobile</option>
                  </select>
                </div>
              </>
            )}
            
            {activeService === 'tv' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tvProvider">TV Provider</Label>
                  <select 
                    id="tvProvider" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={tvProvider}
                    onChange={(e) => setTvProvider(e.target.value)}
                  >
                    <option value="dstv">DSTV</option>
                    <option value="gotv">GoTV</option>
                    <option value="startimes">StarTimes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smartcardNumber">Smartcard/IUC Number</Label>
                  <Input 
                    id="smartcardNumber" 
                    placeholder="Enter Smartcard/IUC Number" 
                    value={smartcardNumber}
                    onChange={(e) => setSmartcardNumber(e.target.value)}
                    required 
                  />
                </div>
              </>
            )}
            
            {activeService === 'electricity' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="meterType">Meter Type</Label>
                  <select 
                    id="meterType" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={meterType}
                    onChange={(e) => setMeterType(e.target.value)}
                  >
                    <option value="prepaid">Prepaid</option>
                    <option value="postpaid">Postpaid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meterNumber">Meter Number</Label>
                  <Input 
                    id="meterNumber" 
                    placeholder="Enter Meter Number" 
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distributor">Distribution Company</Label>
                  <select 
                    id="distributor" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={distributor}
                    onChange={(e) => setDistributor(e.target.value)}
                  >
                    <option value="ikeja">Ikeja Electric</option>
                    <option value="eko">Eko Electric</option>
                    <option value="abuja">Abuja Electric</option>
                    <option value="ibadan">Ibadan Electric</option>
                  </select>
                </div>
              </>
            )}
            
            {activeService === 'education' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input 
                    id="institution" 
                    placeholder="Enter institution name" 
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID/Reference</Label>
                  <Input 
                    id="studentId" 
                    placeholder="Enter Student ID or Reference" 
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required 
                  />
                </div>
              </>
            )}
            
            {activeService === 'event' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input 
                    id="eventName" 
                    placeholder="Enter event name" 
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketType">Ticket Type</Label>
                  <select 
                    id="ticketType" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="vvip">VVIP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required 
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                placeholder="Enter amount" 
                type="number" 
                min="0" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Pay Now'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillPayments;
