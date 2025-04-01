
import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <SidebarProvider>
          <div className="flex min-h-[calc(100vh-8rem)] w-full">
            <DashboardSidebar 
              currentUser={currentUser} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            <DashboardContent activeTab={activeTab} />
          </div>
        </SidebarProvider>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
