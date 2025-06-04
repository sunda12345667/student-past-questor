
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, Users, BarChart3, Settings, FileText, LogOut } from 'lucide-react';
import MaterialUpload from '@/components/admin/MaterialUpload';
import BlogManagement from '@/components/admin/BlogManagement';
import AdminLogin from '@/components/AdminLogin';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user has admin access
  if (!isAdmin() && !isAuthenticated) {
    return (
      <AdminLogin 
        isOpen={true}
        onClose={() => navigate('/')}
        onSuccess={() => setIsAuthenticated(true)} 
      />
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      <div className="container mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage your platform content and settings</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2 w-fit"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="materials" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="materials" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Educational</span> Materials
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              Blog Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="mt-4 sm:mt-6">
            <MaterialUpload />
          </TabsContent>

          <TabsContent value="blog" className="mt-4 sm:mt-6">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4 sm:mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">Analytics features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
