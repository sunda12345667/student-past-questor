
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, FileText, User, Star, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardContent = () => {
  const { currentUser } = useAuth();

  const stats = [
    { title: 'Past Questions', value: '24', icon: FileText, color: 'text-blue-600' },
    { title: 'Video Courses', value: '8', icon: Video, color: 'text-green-600' },
    { title: 'E-Books', value: '12', icon: BookOpen, color: 'text-purple-600' },
    { title: 'Downloads', value: '156', icon: Download, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser?.name}!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'WAEC Mathematics 2023', type: 'Past Question', date: '2 hours ago' },
              { title: 'Physics Video Course', type: 'Video', date: '1 day ago' },
              { title: 'Chemistry E-Book', type: 'E-Book', date: '3 days ago' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {item.type === 'Past Question' && <FileText className="h-5 w-5 text-primary" />}
                  {item.type === 'Video' && <Video className="h-5 w-5 text-primary" />}
                  {item.type === 'E-Book' && <BookOpen className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.type} • {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
