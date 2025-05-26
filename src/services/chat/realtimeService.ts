
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './types';

interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
}

export const subscribeToGroupMessages = (
  groupId: string,
  onMessage: (message: ChatMessage) => void
) => {
  return supabase
    .channel(`group_messages:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        const messageData = payload.new;
        
        // Fetch sender info
        const { data: senderData } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('id', messageData.sender_id)
          .single();
        
        const transformedMessage: ChatMessage = {
          id: messageData.id,
          content: messageData.content,
          user_id: messageData.sender_id,
          sender_id: messageData.sender_id,
          group_id: messageData.group_id,
          created_at: messageData.created_at,
          reactions: messageData.reactions || {},
          attachments: messageData.attachments || [],
          sender: senderData ? {
            id: senderData.id,
            name: senderData.name,
            avatar: '/placeholder.svg'
          } : undefined
        };
        
        onMessage(transformedMessage);
      }
    )
    .subscribe();
};

export const subscribeToTypingIndicators = (
  groupId: string,
  onTypingUpdate: (typingUsers: TypingUser[]) => void
) => {
  // For now, return a mock subscription since typing_indicators table doesn't exist
  // This can be implemented later when the table is created
  const channel = supabase.channel(`typing_indicators:${groupId}`);
  
  // Mock empty typing users for now
  setTimeout(() => onTypingUpdate([]), 100);
  
  return channel.subscribe();
};

export const sendTypingIndicator = async (
  groupId: string,
  userId: string,
  userName: string,
  userAvatar?: string
) => {
  // Mock implementation - can be enhanced when typing_indicators table exists
  console.log('Typing indicator sent:', { groupId, userId, userName });
};

export const cleanupChannel = (subscription: any) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};
