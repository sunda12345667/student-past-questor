
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types";

// Subscribe to real-time updates for a group's messages
export const subscribeToGroupMessages = (
  groupId: string,
  onNewMessage: (message: ChatMessage) => void
) => {
  const channel = supabase
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
        const { data } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .eq('id', payload.new.sender_id)
          .single();

        const fullMessage: ChatMessage = {
          id: payload.new.id,
          group_id: payload.new.group_id,
          user_id: payload.new.sender_id,
          content: payload.new.content,
          created_at: payload.new.created_at,
          sender: {
            id: payload.new.sender_id,
            name: data?.name || 'Unknown User',
            avatar: data?.avatar_url
          }
        };

        onNewMessage(fullMessage);
      }
    )
    .subscribe();

  return channel;
};

// Subscribe to typing indicators
export const subscribeToTypingIndicators = (
  groupId: string,
  onTypingUpdate: (typingUsers: string[]) => void
) => {
  const typingUsers = new Map<string, NodeJS.Timeout>();

  const channel = supabase
    .channel(`typing:${groupId}`)
    .on('broadcast', { event: 'typing' }, (payload) => {
      const { user_id, user_name } = payload.payload;
      
      if (typingUsers.has(user_id)) {
        clearTimeout(typingUsers.get(user_id)!);
      }
      
      typingUsers.set(user_id, setTimeout(() => {
        typingUsers.delete(user_id);
        onTypingUpdate(Array.from(typingUsers.keys()));
      }, 3000));
      
      onTypingUpdate(Array.from(typingUsers.keys()));
    })
    .subscribe();

  return channel;
};

// Broadcast typing indicator
export const sendTypingIndicator = async (
  groupId: string,
  userId: string,
  userName: string
) => {
  try {
    await supabase
      .channel(`typing:${groupId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: userId, user_name: userName }
      });
  } catch (error) {
    console.error("Error sending typing indicator:", error);
  }
};
