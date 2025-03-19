
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  ShoppingCart, 
  CreditCard,
  User,
  Bell,
  MessagesSquare,
  Share2,
  Wallet,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchBar } from '@/components/SearchBar';
import PaymentMethods from '@/components/dashboard/PaymentMethods';
import ChatbotSupport from '@/components/dashboard/ChatbotSupport';
import BillPayments from '@/components/dashboard/BillPayments';
import ReferralSystem from '@/components/dashboard/ReferralSystem';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  
  // Mock data (in a real app, this would come from a backend)
  const purchasedQuestions = [
    { id: '1', title: 'WAEC 2023 Mathematics', date: '2023-07-15', status: 'Downloaded' },
    { id: '2', title: 'JAMB Physics 2022-2023', date: '2023-06-22', status: 'Available' },
    { id: '3', title: 'NECO Biology 2023', date: '2023-08-10', status: 'Available' },
  ];
  
  const notifications = [
    { id: 1, title: 'New questions available', description: 'WAEC 2023 Physics questions now available', time: '2 hours ago' },
    { id: 2, title: 'Purchase successful', description: 'Your purchase of NECO Biology was successful', time: '2 days ago' },
    { id: 3, title: 'Limited time offer', description: '50% off on all JAMB past questions', time: '1 week ago' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'questions':
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">My Questions</h2>
            
            <div className="mb-6">
              <SearchBar />
            </div>
            
            <div className="grid gap-4">
              {purchasedQuestions.map((question) => (
                <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{question.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <span>Purchased: {question.date}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Download
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button>View All Questions</Button>
            </div>
          </>
        );
      
      case 'payment':
        return <PaymentMethods />;
      
      case 'chatbot':
        return <ChatbotSupport />;
      
      case 'bills':
        return <BillPayments />;
      
      case 'referrals':
        return <ReferralSystem />;
      
      case 'notifications':
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">Notifications</h2>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card key={notification.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-xl">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-medium">{currentUser?.name}</h2>
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant={activeTab === 'questions' ? 'default' : 'ghost'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('questions')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Questions
                </Button>
                <Button 
                  variant={activeTab === 'payment' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button 
                  variant={activeTab === 'chatbot' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('chatbot')}
                >
                  <MessagesSquare className="mr-2 h-4 w-4" />
                  AI Chatbot
                </Button>
                <Button 
                  variant={activeTab === 'bills' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('bills')}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Pay Bills
                </Button>
                <Button 
                  variant={activeTab === 'referrals' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('referrals')}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Referrals
                </Button>
                <Button 
                  variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('notifications')}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-6 rounded-xl">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
