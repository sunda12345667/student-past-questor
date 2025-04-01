
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 font-bold text-xl cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <span className="text-primary">StudyQuest</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="flex items-center" onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium truncate max-w-[100px]">
                    {currentUser?.name || 'User'}
                  </span>
                </Button>

                <Button variant="outline" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
