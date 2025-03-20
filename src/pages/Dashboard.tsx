
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { TabContent } from '@/components/dashboard/TabContent';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('questions');
  
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar 
              currentUser={currentUser} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="glass-panel p-6 rounded-xl">
              <TabContent activeTab={activeTab} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
