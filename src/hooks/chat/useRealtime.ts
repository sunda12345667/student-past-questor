
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  subscribeToGroupMessages,
  subscribeToTypingIndicators
} from '@/services/chat';
import { TypingUser } from './types';

export const useRealtime = (
  activeRoom: string | null,
  userId: string | undefined,
  onNewMessage: (newMessage: any) => void,
  onTypingUpdate: (typingUsers: TypingUser[]) => void
) => {
  useEffect(() => {
    let messageSubscription: any = null;
    let typingSubscription: any = null;
    
    if (activeRoom && userId) {
      // Subscribe to new messages
      messageSubscription = subscribeToGroupMessages(
        activeRoom,
        onNewMessage
      );
      
      // Subscribe to typing indicators
      typingSubscription = subscribeToTypingIndicators(
        activeRoom,
        (typingUsersList) => {
          // Filter out current user
          const filteredTypingUsers = typingUsersList.filter(
            user => user.id !== userId
          );
          onTypingUpdate(filteredTypingUsers);
        }
      );
    }
    
    return () => {
      if (messageSubscription) {
        supabase.removeChannel(messageSubscription);
      }
      if (typingSubscription) {
        supabase.removeChannel(typingSubscription);
      }
    };
  }, [activeRoom, userId, onNewMessage, onTypingUpdate]);
};
