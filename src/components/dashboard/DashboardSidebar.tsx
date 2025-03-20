
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  CreditCard,
  User,
  Bell,
  MessagesSquare,
  Share2,
  Wallet,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/contexts/AuthContext';

interface DashboardSidebarProps {
  currentUser: UserType | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardSidebar = ({ 
  currentUser, 
  activeTab, 
  setActiveTab 
}: DashboardSidebarProps) => {
  return (
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
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          asChild
        >
          <Link to="/student-chat">
            <MessageCircle className="mr-2 h-4 w-4" />
            Student Chat
          </Link>
        </Button>
      </div>
    </div>
  );
};
