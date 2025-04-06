
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
  Smartphone,
  FileText,
  Calculator,
  Book,
  HelpCircle,
  Clipboard,
  Calendar,
  GraduationCap,
  School
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
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';
import { CollapsibleMenuItem } from './CollapsibleMenuItem';

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
  
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col justify-center items-center py-4">
        <div className="flex items-center justify-between w-full px-3">
          <h2 className="text-lg font-semibold">Dashboard</h2>
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
          <SidebarGroupLabel>Study Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapsibleMenuItem 
                icon={<BookOpen className="w-4 h-4" />} 
                label="Study Materials" 
                isActive={["questions", "search", "downloads"].includes(activeTab)}
                tooltip="Study Materials"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "questions"}
                    onClick={() => setActiveTab("questions")}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Past Questions</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "search"}
                    onClick={() => setActiveTab("search")}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Materials</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "downloads"}
                    onClick={() => setActiveTab("downloads")}
                  >
                    <Download className="w-4 w-4" />
                    <span>My Downloads</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </CollapsibleMenuItem>
              
              <CollapsibleMenuItem 
                icon={<GraduationCap className="w-4 h-4" />} 
                label="AI Learning Tools" 
                isActive={["academic-ai", "support"].includes(activeTab)}
                tooltip="AI Learning Tools"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "academic-ai"}
                    onClick={() => setActiveTab("academic-ai")}
                  >
                    <School className="w-4 h-4" />
                    <span>Academic Problem Solver</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "support"}
                    onClick={() => setActiveTab("support")}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Study Assistant</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </CollapsibleMenuItem>
              
              <CollapsibleMenuItem 
                icon={<Users className="w-4 h-4" />} 
                label="Study Groups" 
                isActive={["groups", "sessions", "chat"].includes(activeTab)}
                tooltip="Study Groups"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "groups"}
                    onClick={() => setActiveTab("groups")}
                  >
                    <Users className="w-4 h-4" />
                    <span>Group Management</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "sessions"}
                    onClick={() => setActiveTab("sessions")}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Study Sessions</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "chat"}
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Group Chat</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </CollapsibleMenuItem>
              
              <CollapsibleMenuItem 
                icon={<ShoppingCart className="w-4 h-4" />} 
                label="Marketplace" 
                isActive={["marketplace", "bills"].includes(activeTab)}
                tooltip="Marketplace"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "marketplace"}
                    onClick={() => setActiveTab("marketplace")}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Educational Materials</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "bills"}
                    onClick={() => setActiveTab("bills")}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Utility Payments</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </CollapsibleMenuItem>
              
              <CollapsibleMenuItem 
                icon={<Gamepad2 className="w-4 h-4" />} 
                label="Rewards & Progress" 
                isActive={["leaderboard", "rewards", "referrals"].includes(activeTab)}
                tooltip="Rewards"
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "leaderboard"}
                    onClick={() => setActiveTab("leaderboard")}
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Leaderboard</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "rewards"}
                    onClick={() => setActiveTab("rewards")}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Challenges & Rewards</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={activeTab === "referrals"}
                    onClick={() => setActiveTab("referrals")}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Referrals</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </CollapsibleMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Your Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapsibleMenuItem 
                icon={<User className="w-4 h-4" />} 
                label="Profile" 
                isActive={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
                tooltip="Profile"
              />
              
              <CollapsibleMenuItem 
                icon={<Bell className="w-4 h-4" />} 
                label="Notifications" 
                isActive={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
                tooltip="Notifications"
              />
              
              <CollapsibleMenuItem 
                icon={<CreditCard className="w-4 h-4" />} 
                label="Payment Methods" 
                isActive={activeTab === "payments"}
                onClick={() => setActiveTab("payments")}
                tooltip="Payments"
              />

              {isAdmin() && (
                <CollapsibleMenuItem 
                  icon={<User className="w-4 h-4" />} 
                  label="Admin Panel" 
                  isActive={false}
                  onClick={() => navigate('/admin')}
                  tooltip="Admin Panel"
                />
              )}
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
