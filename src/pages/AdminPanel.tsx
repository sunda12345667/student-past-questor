
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Users, BarChart3, Settings, FileText } from 'lucide-react';
import MaterialUpload from '@/components/admin/MaterialUpload';
import BlogManagement from '@/components/admin/BlogManagement';
import AdminLogin from '@/components/AdminLogin';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user has admin access
  if (!isAdmin() && !isAuthenticated) {
    return (
      <AdminLogin 
        isOpen={true}
        onClose={() => {}}
        onSuccess={() => setIsAuthenticated(true)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your platform content and settings</p>
        </div>

        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Educational Materials
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <MaterialUpload />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
