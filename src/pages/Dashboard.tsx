
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const Dashboard = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  const [isContentLoading, setIsContentLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Extract tab from URL or set default
  useEffect(() => {
    const tabFromUrl = location.hash.replace('#', '');
    if (tabFromUrl && ['questions', 'notifications', 'downloads', 'profile', 'bills', 
                       'marketplace', 'groups', 'sessions', 'search', 'leaderboard', 
                       'rewards', 'referrals', 'payments', 'chat', 'academic-ai'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
    
    // Simulate content loading
    setIsContentLoading(true);
    const timer = setTimeout(() => setIsContentLoading(false), 800);
    
    return () => clearTimeout(timer);
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    try {
      setActiveTab(tab);
      navigate(`/dashboard#${tab}`, { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Failed to navigate to the selected tab. Please try again.");
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 animate-fade-in">
          <div className="flex gap-4">
            <Skeleton className="h-screen w-1/4" />
            <Skeleton className="h-screen w-3/4" />
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col sm:flex-row gap-4">
            <DashboardSidebar 
              currentUser={currentUser} 
              activeTab={activeTab} 
              setActiveTab={handleTabChange} 
            />
            <div className={`w-full ${isMobile ? 'mt-4' : ''}`}>
              {isContentLoading ? (
                <div className="glass-panel p-6 rounded-xl animate-pulse">
                  <Skeleton className="h-[80vh] w-full" />
                </div>
              ) : (
                <DashboardContent activeTab={activeTab} />
              )}
            </div>
          </div>
        </SidebarProvider>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
