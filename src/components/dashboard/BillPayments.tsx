
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Wifi, 
  Tv, 
  Lightbulb,
  GraduationCap,
  Ticket
} from 'lucide-react';

const BillPayments = () => {
  const { toast } = useToast();
  const [activeService, setActiveService] = useState('airtime');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Payment Successful',
      description: `Your ${getServiceName(activeService)} payment was successful.`,
    });
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
      <h2 className="text-2xl font-medium">Bill Payments</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {['airtime', 'data', 'tv', 'electricity', 'education', 'event'].map((service) => (
          <Card 
            key={service}
            className={`cursor-pointer hover:border-primary ${activeService === service ? 'border-primary' : ''}`}
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
                  <Input id="phoneNumber" placeholder="Enter phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="network">Network Provider</Label>
                  <select id="network" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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
                  <select id="tvProvider" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="dstv">DSTV</option>
                    <option value="gotv">GoTV</option>
                    <option value="startimes">StarTimes</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smartcardNumber">Smartcard/IUC Number</Label>
                  <Input id="smartcardNumber" placeholder="Enter Smartcard/IUC Number" required />
                </div>
              </>
            )}
            
            {activeService === 'electricity' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="meterType">Meter Type</Label>
                  <select id="meterType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="prepaid">Prepaid</option>
                    <option value="postpaid">Postpaid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meterNumber">Meter Number</Label>
                  <Input id="meterNumber" placeholder="Enter Meter Number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distributor">Distribution Company</Label>
                  <select id="distributor" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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
                  <Input id="institution" placeholder="Enter institution name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID/Reference</Label>
                  <Input id="studentId" placeholder="Enter Student ID or Reference" required />
                </div>
              </>
            )}
            
            {activeService === 'event' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input id="eventName" placeholder="Enter event name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketType">Ticket Type</Label>
                  <select id="ticketType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                    <option value="vvip">VVIP</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" min="1" defaultValue="1" required />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" placeholder="Enter amount" type="number" min="0" required />
            </div>
            
            <Button type="submit" className="w-full">Pay Now</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillPayments;
