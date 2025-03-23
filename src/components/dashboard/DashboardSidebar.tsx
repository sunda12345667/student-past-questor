
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
  Search,
  LogOut,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';

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
  
  const menuItems = [
    { id: 'search', label: 'Search Materials', icon: <Search className="w-4 h-4" /> },
    { id: 'questions', label: 'Past Questions', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'bills', label: 'Utility Payments', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'downloads', label: 'My Downloads', icon: <Download className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'groups', label: 'Study Groups', icon: <Users className="w-4 h-4" /> },
    { id: 'sessions', label: 'Study Sessions', icon: <Target className="w-4 h-4" /> },
    { id: 'chat', label: 'Group Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'referrals', label: 'Referrals', icon: <Gift className="w-4 h-4" /> },
    { id: 'rewards', label: 'Rewards & Challenges', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  // Add admin item if user is admin
  if (isAdmin()) {
    menuItems.push(
      { id: 'admin', label: 'Admin Panel', icon: <User className="w-4 h-4" /> }
    );
  }
  
  return (
    <Sidebar>
      <SidebarRail />
      <SidebarHeader className="flex flex-col justify-center items-center py-4">
        <div className="flex items-center justify-between w-full px-3">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <SidebarTrigger />
        </div>
        <div className="flex flex-col items-center mt-4 space-y-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={currentUser?.avatar || ''} alt={currentUser?.name || 'User'} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="font-medium">{currentUser?.name || currentUser?.email}</h3>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => {
                      if (item.id === 'admin') {
                        navigate('/admin');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
