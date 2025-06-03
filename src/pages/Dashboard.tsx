
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';
import { BookOpen, Download, ShoppingCart, User, CreditCard, Wallet } from 'lucide-react';
import Marketplace from '@/components/dashboard/Marketplace';
import Downloads from '@/components/dashboard/Downloads';
import BillPayments from '@/components/dashboard/BillPayments';
import WalletTab from '@/components/dashboard/WalletTab';
import { QuestionsTab } from '@/components/dashboard/QuestionsTab';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('marketplace');

  useEffect(() => {
    // Check URL hash to set active tab
    const hash = window.location.hash.replace('#', '');
    if (hash && ['marketplace', 'questions', 'downloads', 'bills', 'wallet', 'profile'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.replaceState(null, '', `#${value}`);
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Please log in to access your dashboard</h1>
            <Button onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get the display name - prioritize the name field, fallback to email username
  const displayName = currentUser.name || currentUser.email?.split('@')[0] || 'Student';

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground">Manage your study materials and explore our marketplace</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              My Questions
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Downloads
            </TabsTrigger>
            <TabsTrigger value="bills" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bill Payments
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            <Marketplace />
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <QuestionsTab />
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <Downloads />
          </TabsContent>

          <TabsContent value="bills" className="space-y-6">
            <BillPayments />
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <WalletTab />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{displayName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Account Type</label>
                  <p className="text-sm text-muted-foreground">Student</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
