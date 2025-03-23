
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-13rem)] w-full">
            <DashboardSidebar 
              currentUser={currentUser} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <DashboardContent activeTab={activeTab} />
          </div>
        </SidebarProvider>
      </div>
    </Layout>
  );
};

export default Dashboard;
