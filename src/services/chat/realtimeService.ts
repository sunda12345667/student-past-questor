
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
  return supabase
    .channel(`typing_indicators:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        // Fetch current typing users
        const { data: typingData } = await supabase
          .from('typing_indicators')
          .select(`
            user_id,
            profiles:user_id (
              id,
              name
            )
          `)
          .eq('group_id', groupId)
          .eq('is_typing', true);
        
        const typingUsers: TypingUser[] = typingData?.map(t => ({
          id: t.user_id,
          name: (t.profiles as any)?.name || 'Unknown',
          avatar: '/placeholder.svg'
        })) || [];
        
        onTypingUpdate(typingUsers);
      }
    )
    .subscribe();
};
