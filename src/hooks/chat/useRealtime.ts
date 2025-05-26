
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  subscribeToGroupMessages,
  subscribeToTypingIndicators,
  cleanupChannel
} from '@/services/chat';
import { TypingUser } from './types';

export const useRealtime = (
  activeRoom: string | null,
  userId: string | undefined,
  onNewMessage: (newMessage: any) => void,
  onTypingUpdate: (typingUsers: TypingUser[]) => void
) => {
  const messageSubscriptionRef = useRef<any>(null);
  const typingSubscriptionRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const cleanup = () => {
    if (messageSubscriptionRef.current) {
      cleanupChannel(messageSubscriptionRef.current);
      messageSubscriptionRef.current = null;
    }
    
    if (typingSubscriptionRef.current) {
      cleanupChannel(typingSubscriptionRef.current);
      typingSubscriptionRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const setupSubscriptions = () => {
    if (!activeRoom || !userId) return;

    console.log(`Setting up realtime subscriptions for room: ${activeRoom}`);

    try {
      // Subscribe to new messages with error handling
      messageSubscriptionRef.current = subscribeToGroupMessages(
        activeRoom,
        (newMessage) => {
          console.log('Received new message via realtime:', newMessage);
          onNewMessage(newMessage);
          reconnectAttempts.current = 0; // Reset on successful message
        }
      );
      
      // Subscribe to typing indicators with error handling
      typingSubscriptionRef.current = subscribeToTypingIndicators(
        activeRoom,
        (typingUsersList) => {
          console.log('Received typing update:', typingUsersList);
          // Filter out current user
          const filteredTypingUsers = typingUsersList.filter(
            user => user.id !== userId
          );
          onTypingUpdate(filteredTypingUsers);
        }
      );

      // Monitor connection status
      const connectionStatus = supabase.channel('connection-status');
      connectionStatus
        .on('system', {}, (payload) => {
          console.log('Supabase connection status:', payload);
          
          if (payload.status === 'CLOSED' && reconnectAttempts.current < maxReconnectAttempts) {
            console.log('Connection lost, attempting to reconnect...');
            reconnectAttempts.current++;
            
            reconnectTimeoutRef.current = setTimeout(() => {
              cleanup();
              setupSubscriptions();
            }, Math.pow(2, reconnectAttempts.current) * 1000); // Exponential backoff
          }
        })
        .subscribe();

    } catch (error) {
      console.error('Error setting up realtime subscriptions:', error);
      
      // Retry with exponential backoff
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          setupSubscriptions();
        }, Math.pow(2, reconnectAttempts.current) * 1000);
      }
    }
  };

  useEffect(() => {
    cleanup(); // Clean up previous subscriptions
    setupSubscriptions();
    
    return cleanup;
  }, [activeRoom, userId]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);
};
