
import { SidebarInset } from '@/components/ui/sidebar';
import { TabContent } from './TabContent';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardContentProps {
  activeTab: string;
}

export const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Reset states when tab changes
    setIsLoading(true);
    setError(null);
    
    // Simulate loading time for tab content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate retry attempt
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <SidebarInset className={`px-2 sm:px-4 py-3 sm:py-6 w-full ${isMobile ? 'overflow-x-hidden' : ''}`}>
      <div className="glass-panel p-4 sm:p-6 rounded-xl">
        {isLoading ? (
          <div className="animate-pulse space-y-4" aria-hidden="true">
            <Skeleton className="h-8 w-1/3 rounded" />
            <Skeleton className="h-[70vh] w-full rounded" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading content</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>{error || "Something went wrong. Please try again."}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="self-start flex items-center gap-2" 
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="animate-fade-in" role="tabpanel" aria-live="polite">
            <TabContent activeTab={activeTab} />
          </div>
        )}
      </div>
    </SidebarInset>
  );
};
