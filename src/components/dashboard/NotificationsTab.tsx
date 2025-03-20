
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
}

export const NotificationsTab = () => {
  const notifications: Notification[] = [
    { id: 1, title: 'New questions available', description: 'WAEC 2023 Physics questions now available', time: '2 hours ago' },
    { id: 2, title: 'Purchase successful', description: 'Your purchase of NECO Biology was successful', time: '2 days ago' },
    { id: 3, title: 'Limited time offer', description: '50% off on all JAMB past questions', time: '1 week ago' },
  ];

  return (
    <>
      <h2 className="text-2xl font-medium mb-6">Notifications</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{notification.title}</h3>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
