
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract tab from URL or set default
  useEffect(() => {
    const tabFromUrl = location.hash.replace('#', '');
    if (tabFromUrl && ['questions', 'notifications', 'downloads', 'profile', 'bills', 
                       'marketplace', 'groups', 'sessions', 'search', 'leaderboard', 
                       'rewards', 'referrals', 'payments', 'chat'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/dashboard#${tab}`, { replace: true });
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-8rem)] w-full">
            <DashboardSidebar 
              currentUser={currentUser} 
              activeTab={activeTab} 
              setActiveTab={handleTabChange} 
            />
            <DashboardContent activeTab={activeTab} />
          </div>
        </SidebarProvider>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
