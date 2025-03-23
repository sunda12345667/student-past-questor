
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  User, 
  CreditCard, 
  Bell, 
  Users, 
  Gift, 
  Trophy, 
  MessageSquare,
  Gamepad2,
  Target,
  Download,
  ShoppingCart,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardSidebarProps {
  currentUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardSidebar = ({ currentUser, activeTab, setActiveTab }: DashboardSidebarProps) => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [userInitials, setUserInitials] = useState('');
  
  useEffect(() => {
    if (currentUser?.name) {
      const nameParts = currentUser.name.split(' ');
      const initials = nameParts.map((part: string) => part.charAt(0)).join('').toUpperCase();
      setUserInitials(initials);
    } else if (currentUser?.email) {
      setUserInitials(currentUser.email.charAt(0).toUpperCase());
    }
  }, [currentUser]);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const sidebarItems = [
    { id: 'search', label: 'Search Materials', icon: <Search className="w-4 h-4" /> },
    { id: 'questions', label: 'Past Questions', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'downloads', label: 'My Downloads', icon: <Download className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'groups', label: 'Study Groups', icon: <Users className="w-4 h-4" /> },
    { id: 'study-sessions', label: 'Study Sessions', icon: <Target className="w-4 h-4" /> },
    { id: 'chat', label: 'Group Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'referrals', label: 'Referrals', icon: <Gift className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards & Challenges', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  // Add admin items if user is admin
  if (isAdmin()) {
    sidebarItems.push(
      { id: 'admin', label: 'Admin Panel', icon: <User className="w-4 h-4" /> }
    );
  }
  
  return (
    <aside className="glass-panel rounded-xl py-6 mb-6 lg:mb-0 h-full">
      <div className="flex flex-col h-full">
        {/* User Profile Section */}
        <div className="px-4 mb-6 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-3">
            <AvatarImage src={currentUser?.avatar || ''} alt={currentUser?.name || 'User'} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-medium">{currentUser?.name || currentUser?.email}</h3>
          <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
        </div>
        
        {/* Navigation */}
        <nav className="flex-grow px-2 mb-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                if (item.id === 'admin') {
                  navigate('/admin');
                } else {
                  setActiveTab(item.id);
                }
              }}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="px-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};
