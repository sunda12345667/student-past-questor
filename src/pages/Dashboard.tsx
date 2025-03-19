
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Download, 
  ShoppingCart, 
  CreditCard,
  History,
  User,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  
  // Mock data (in a real app, this would come from a backend)
  const purchasedQuestions = [
    { id: '1', title: 'WAEC 2023 Mathematics', date: '2023-07-15', status: 'Downloaded' },
    { id: '2', title: 'JAMB Physics 2022-2023', date: '2023-06-22', status: 'Available' },
    { id: '3', title: 'NECO Biology 2023', date: '2023-08-10', status: 'Available' },
  ];
  
  const recentTransactions = [
    { id: '1', type: 'Purchase', amount: '₦1,500', date: '2023-08-15', status: 'Completed' },
    { id: '2', type: 'Subscription', amount: '₦5,000', date: '2023-07-01', status: 'Completed' },
    { id: '3', type: 'Airtime', amount: '₦1,000', date: '2023-08-12', status: 'Completed' },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  variant={activeTab === 'purchases' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab('purchases')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase History
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
          <div className="lg:col-span-3">
            <div className="glass-panel p-6 rounded-xl">
              {activeTab === 'questions' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">My Questions</h2>
                  <div className="grid gap-4">
                    {purchasedQuestions.map((question) => (
                      <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{question.title}</h3>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Purchased: {question.date}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button>View All Questions</Button>
                  </div>
                </>
              )}
              
              {activeTab === 'purchases' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">Purchase History</h2>
                  <div className="grid gap-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{transaction.type}</h3>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{transaction.date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{transaction.amount}</p>
                          <p className="text-sm text-green-600">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {activeTab === 'payment' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">Payment Methods</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Add Payment Method</CardTitle>
                        <CardDescription>Set up a new payment method</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                            <CreditCard className="h-8 w-8 mb-2" />
                            Card
                          </Button>
                          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                            <ShoppingCart className="h-8 w-8 mb-2" />
                            Bank Transfer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Services</CardTitle>
                        <CardDescription>Access additional services</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                            <CreditCard className="h-8 w-8 mb-2" />
                            Buy Airtime
                          </Button>
                          <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                            <ShoppingCart className="h-8 w-8 mb-2" />
                            Pay Bills
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
              
              {activeTab === 'notifications' && (
                <>
                  <h2 className="text-2xl font-medium mb-6">Notifications</h2>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">New Questions Available</h3>
                            <span className="text-xs text-muted-foreground">2 days ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            New WAEC 2023 Chemistry questions are now available for purchase.
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
