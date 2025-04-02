
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'message' | 'group_invite' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    
    // Subscribe to new messages
    const messageChannel = supabase
      .channel('new_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages'
        },
        async (payload) => {
          // Check if message is not from current user
          if (payload.new.sender_id !== currentUser.id) {
            try {
              // Get group details
              const { data: group } = await supabase
                .from('study_groups')
                .select('name')
                .eq('id', payload.new.group_id)
                .single();
              
              // Get sender details
              const { data: sender } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', payload.new.sender_id)
                .single();
                
              const notification: Notification = {
                id: `msg-${payload.new.id}`,
                type: 'message',
                title: `New message in ${group?.name}`,
                body: `${sender?.name}: ${payload.new.content.substring(0, 50)}${payload.new.content.length > 50 ? '...' : ''}`,
                isRead: false,
                created_at: new Date().toISOString(),
                metadata: {
                  groupId: payload.new.group_id,
                  messageId: payload.new.id,
                  senderId: payload.new.sender_id
                }
              };
              
              setNotifications(prev => [notification, ...prev]);
              
              // Show toast notification
              toast(notification.title, {
                description: notification.body,
                action: {
                  label: "View",
                  onClick: () => {
                    window.location.href = `/chat?group=${payload.new.group_id}`;
                  },
                },
              });
            } catch (error) {
              console.error('Error processing message notification:', error);
            }
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [currentUser]);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
