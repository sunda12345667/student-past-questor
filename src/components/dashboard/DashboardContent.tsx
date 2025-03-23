
import { SidebarInset } from '@/components/ui/sidebar';
import { TabContent } from './TabContent';

interface DashboardContentProps {
  activeTab: string;
}

export const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  return (
    <SidebarInset className="px-4 py-6">
      <div className="glass-panel p-6 rounded-xl">
        <TabContent activeTab={activeTab} />
      </div>
    </SidebarInset>
  );
};
