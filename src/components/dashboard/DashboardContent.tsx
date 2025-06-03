import { useState } from 'react';
import {
  ShoppingBag,
  Download,
  Users,
  Calendar,
  HelpCircle,
  MessageCircle,
  UserPlus,
  Bell,
  Trophy,
  CreditCard,
  User,
  Gift,
  Brain,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from 'react-router-dom';
import MarketplaceTab from './MarketplaceTab';
import DownloadsTab from './DownloadsTab';
import BillPayments from './BillPayments';
import RewardsTab from './RewardsTab';
import AcademicAITab from './AcademicAITab';
import StudyGroupsTab from './StudyGroupsTab';
import StudySessionsTab from './StudySessionsTab';
import QuestionsTab from './QuestionsTab';
import ReferralsTab from './ReferralsTab';
import NotificationsTab from './NotificationsTab';
import LeaderboardTab from './LeaderboardTab';
import PaymentMethods from './PaymentMethods';
import ProfileTab from './ProfileTab';
import WalletTab from './WalletTab';
import WhatsAppSupport from './WhatsAppSupport';

type Tab = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const tabs: Tab[] = [
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'wallet', label: 'My Wallet', icon: Wallet },
  { id: 'bills', label: 'Bill Payments', icon: CreditCard },
  { id: 'rewards', label: 'Rewards', icon: Gift },
  { id: 'ai', label: 'Academic AI', icon: Brain },
  { id: 'groups', label: 'Study Groups', icon: Users },
  { id: 'sessions', label: 'Study Sessions', icon: Calendar },
  { id: 'questions', label: 'Questions', icon: HelpCircle },
  { id: 'support', label: 'Support', icon: MessageCircle },
  { id: 'referrals', label: 'Referrals', icon: UserPlus },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
  { id: 'profile', label: 'Profile', icon: User },
];

const DashboardContent = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'marketplace';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} className="space-y-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="marketplace">
              <MarketplaceTab />
            </TabsContent>
            <TabsContent value="downloads">
              <DownloadsTab />
            </TabsContent>

            <TabsContent value="wallet">
              <WalletTab />
            </TabsContent>
            <TabsContent value="support">
              <WhatsAppSupport />
            </TabsContent>
            
            <TabsContent value="bills">
              <BillPayments />
            </TabsContent>
            <TabsContent value="rewards">
              <RewardsTab />
            </TabsContent>
            <TabsContent value="ai">
              <AcademicAITab />
            </TabsContent>
            <TabsContent value="groups">
              <StudyGroupsTab />
            </TabsContent>
            <TabsContent value="sessions">
              <StudySessionsTab />
            </TabsContent>
            <TabsContent value="questions">
              <QuestionsTab />
            </TabsContent>
            <TabsContent value="referrals">
              <ReferralsTab />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="leaderboard">
              <LeaderboardTab />
            </TabsContent>
            <TabsContent value="payment-methods">
              <PaymentMethods />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
