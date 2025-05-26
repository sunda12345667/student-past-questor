
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/services/chat/types';
import { subscribeToGroupMessages } from '@/services/chat/realtimeService';
import { supabase } from '@/integrations/supabase/client';

export const useMessages = (groupId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = async () => {
    if (!groupId) return;
    
    setLoading(true);
    try {
      const { data } = await supabase
        .from('group_messages')
        .select(`
          id,
          content,
          created_at,
          group_id,
          sender_id,
          reactions,
          attachments,
          sender:profiles (
            id,
            name
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (data) {
        const transformedMessages: ChatMessage[] = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          user_id: msg.sender_id,
          sender_id: msg.sender_id,
          group_id: msg.group_id,
          created_at: msg.created_at,
          reactions: (typeof msg.reactions === 'object' && msg.reactions !== null) ? msg.reactions as Record<string, string[]> : {},
          attachments: (Array.isArray(msg.attachments)) ? msg.attachments : [],
          sender: (msg.sender as any) ? {
            id: (msg.sender as any).id,
            name: (msg.sender as any).name,
            avatar: '/placeholder.svg'
          } : undefined
        }));
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (groupId: string, content: string) => {
    if (!groupId) return;
    
    try {
      await supabase
        .from('group_messages')
        .insert({
          group_id: groupId,
          content,
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const addMessage = (newMessage: ChatMessage) => {
    setMessages(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    if (groupId) {
      loadMessages();
      
      const subscription = subscribeToGroupMessages(groupId, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [groupId]);

  return { 
    messages, 
    loading, 
    loadMessages,
    handleSendMessage,
    addMessage
  };
};
