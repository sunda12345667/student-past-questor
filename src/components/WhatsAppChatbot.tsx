
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const WHATSAPP_NUMBER = '2347062996474';

  const quickMessages = [
    'I need help with exam preparation',
    'How do I purchase past questions?',
    'I have a technical issue',
    'I want to know about video courses',
    'Payment support needed'
  ];

  const handleQuickMessage = (message: string) => {
    const encodedMessage = encodeURIComponent(
      `Hello! ${message}\n\nFrom: ${currentUser?.name || 'Website Visitor'}\nEmail: ${currentUser?.email || 'Not provided'}`
    );
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleCustomChat = () => {
    const encodedMessage = encodeURIComponent(
      `Hello! I need assistance.\n\nFrom: ${currentUser?.name || 'Website Visitor'}\nEmail: ${currentUser?.email || 'Not provided'}`
    );
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <Card className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-72 sm:w-80 z-50 shadow-lg border">
          <CardContent className="p-0">
            <div className="bg-green-500 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base">Chat with us</h3>
                  <p className="text-xs opacity-90">We're online now</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-green-600 h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            
            <div className="p-3 sm:p-4 space-y-3">
              <p className="text-xs sm:text-sm text-gray-600 mb-3">
                Hi! How can we help you today? Choose a quick option or start a custom chat.
              </p>
              
              <div className="space-y-2">
                {quickMessages.map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickMessage(message)}
                    className="w-full text-left justify-start h-auto p-2 text-xs leading-tight"
                  >
                    {message}
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={handleCustomChat}
                className="w-full bg-green-500 hover:bg-green-600 text-sm"
                size="sm"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Start Custom Chat
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                We typically reply within 5 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-40"
        size="icon"
      >
        {isOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        )}
      </Button>
    </>
  );
}
