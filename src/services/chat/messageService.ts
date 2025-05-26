
import { supabase } from '@/integrations/supabase/client';
import { realTimeService } from './realTimeService';
import { Message, MessageInput } from './types';

export const sendMessage = async (messageData: MessageInput): Promise<Message | null> => {
  try {
    console.log('Sending message:', messageData);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('group_messages')
      .insert({
        content: messageData.content,
        group_id: messageData.group_id,
        sender_id: user.id,
        attachment_url: messageData.attachment_url,
        attachment_type: messageData.attachment_type,
      })
      .select(`
        id,
        content,
        created_at,
        sender_id,
        group_id,
        profiles (name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    const message: Message = {
      id: data.id,
      content: data.content,
      created_at: data.created_at,
      attachment_url: undefined,
      attachment_type: undefined,
      sender_id: data.sender_id,
      group_id: data.group_id,
      sender: {
        name: data.profiles?.name || 'Unknown User',
        avatar_url: data.profiles?.avatar_url,
      },
    };

    // Broadcast the message via real-time
    realTimeService.broadcastMessage(message);
    
    return message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
};

// Alias for compatibility
export const sendGroupMessage = sendMessage;

export const getMessages = async (groupId: string, limit: number = 50): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('group_messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        group_id,
        profiles (name, avatar_url)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return data?.map((item: any): Message => ({
      id: item.id,
      content: item.content,
      created_at: item.created_at,
      attachment_url: undefined,
      attachment_type: undefined,
      sender_id: item.sender_id,
      group_id: item.group_id,
      sender: {
        name: item.profiles?.name || 'Unknown User',
        avatar_url: item.profiles?.avatar_url,
      },
    })) || [];
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
};

export const subscribeToMessages = (
  groupId: string,
  onMessage: (message: Message) => void,
  onError?: (error: Error) => void
) => {
  try {
    console.log('Subscribing to messages for group:', groupId);
    
    const channel = supabase
      .channel(`group_messages:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Fetch the complete message with profile data
          const { data, error } = await supabase
            .from('group_messages')
            .select(`
              id,
              content,
              created_at,
              sender_id,
              group_id,
              profiles (name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Error fetching new message details:', error);
            onError?.(new Error('Failed to fetch message details'));
            return;
          }

          const message: Message = {
            id: data.id,
            content: data.content,
            created_at: data.created_at,
            attachment_url: undefined,
            attachment_type: undefined,
            sender_id: data.sender_id,
            group_id: data.group_id,
            sender: {
              name: data.profiles?.name || 'Unknown User',
              avatar_url: data.profiles?.avatar_url,
            },
          };

          onMessage(message);
        }
      )
      .subscribe();

    return () => {
      console.log('Unsubscribing from messages');
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error subscribing to messages:', error);
    onError?.(error instanceof Error ? error : new Error('Failed to subscribe to messages'));
    return () => {};
  }
};

// Placeholder for message reactions
export const addMessageReaction = async (messageId: string, emoji: string): Promise<boolean> => {
  try {
    console.log('Adding reaction:', messageId, emoji);
    // TODO: Implement when reactions table is available
    return true;
  } catch (error) {
    console.error('Error adding reaction:', error);
    return false;
  }
};

export const removeMessageReaction = async (messageId: string, emoji: string): Promise<boolean> => {
  try {
    console.log('Removing reaction:', messageId, emoji);
    // TODO: Implement when reactions table is available
    return true;
  } catch (error) {
    console.error('Error removing reaction:', error);
    return false;
  }
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  try {
    console.log('Marking message as read:', messageId);
    // TODO: Implement when read receipts table is available
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
};
