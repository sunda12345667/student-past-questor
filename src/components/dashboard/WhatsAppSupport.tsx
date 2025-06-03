
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Phone, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function WhatsAppSupport() {
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [urgency, setUrgency] = useState('normal');

  const WHATSAPP_NUMBER = '2347062996474';

  const handleWhatsAppChat = () => {
    const encodedMessage = encodeURIComponent(
      `Hello! I need help with: ${issueType}\n\nDetails: ${message}\n\nMy Phone: ${phoneNumber}\n\nUrgency: ${urgency}`
    );
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('WhatsApp chat opened! Our support team will respond quickly.');
  };

  const handleQuickIssue = (issue: string) => {
    const encodedMessage = encodeURIComponent(
      `Hello! I need help with: ${issue}\n\nPlease assist me as soon as possible.`
    );
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const quickIssues = [
    'Failed Transaction',
    'Refund Request', 
    'Account Issues',
    'Payment Problem',
    'DSTV/GOTV Issue',
    'Airtime Not Received',
    'Exam PIN Problem',
    'Technical Support'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Customer Support</h2>
      
      {/* Support Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="text-center pb-2">
            <MessageCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <CardTitle className="text-lg">WhatsApp Support</CardTitle>
            <CardDescription>Get instant help via WhatsApp</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => handleQuickIssue('General Support')}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center pb-2">
            <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <CardTitle className="text-lg">Response Time</CardTitle>
            <CardDescription>We respond quickly</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-blue-500">{"< 5 min"}</p>
            <p className="text-sm text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center pb-2">
            <CheckCircle className="h-8 w-8 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Resolution Rate</CardTitle>
            <CardDescription>We solve problems fast</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-primary">99.5%</p>
            <p className="text-sm text-muted-foreground">Issues resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Support Options */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Support</CardTitle>
          <CardDescription>Get help with common issues instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickIssues.map((issue) => (
              <Button
                key={issue}
                variant="outline"
                onClick={() => handleQuickIssue(issue)}
                className="h-auto p-3 text-center"
              >
                {issue}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Support Form */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Support Request</CardTitle>
          <CardDescription>Describe your issue in detail for faster resolution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment Issues</SelectItem>
                  <SelectItem value="transaction">Failed Transaction</SelectItem>
                  <SelectItem value="refund">Refund Request</SelectItem>
                  <SelectItem value="account">Account Problems</SelectItem>
                  <SelectItem value="billing">Bill Payment Issues</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General inquiry</SelectItem>
                  <SelectItem value="normal">Normal - Standard issue</SelectItem>
                  <SelectItem value="high">High - Urgent problem</SelectItem>
                  <SelectItem value="critical">Critical - Money involved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Your Phone Number</Label>
            <Input
              id="phone"
              placeholder="08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Describe Your Issue</Label>
            <Textarea
              id="message"
              placeholder="Please provide details about your issue, including any error messages, transaction references, etc."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleWhatsAppChat}
            disabled={!issueType || !message}
            className="w-full bg-green-500 hover:bg-green-600"
            size="lg"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Send WhatsApp Message
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Other Ways to Reach Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">+234 706 299 6474</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+234 706 299 6474</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
