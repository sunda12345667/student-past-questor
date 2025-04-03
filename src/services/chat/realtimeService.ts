
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types";

// Subscribe to new messages in a group
export const subscribeToGroupMessages = (
  groupId: string,
  onNewMessage: (message: ChatMessage) => void
) => {
  // Create a real-time channel for the group messages
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
        // Fetch message details with sender info
        const message = payload.new as any;
        
        try {
          const { data: sender } = await supabase
            .from("profiles")
            .select("id, name, avatar_url")
            .eq("id", message.sender_id)
            .single();
            
          const chatMessage: ChatMessage = {
            id: message.id,
            group_id: message.group_id,
            user_id: message.sender_id,
            content: message.content,
            created_at: message.created_at,
            reactions: message.reactions || {},
            sender: sender ? {
              id: sender.id,
              name: sender.name,
              avatar: sender.avatar_url
            } : undefined
          };
          
          onNewMessage(chatMessage);
        } catch (error) {
          console.error("Error processing new message:", error);
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        // Handle message updates (like reactions)
        const message = payload.new as any;
        
        try {
          const { data: sender } = await supabase
            .from("profiles")
            .select("id, name, avatar_url")
            .eq("id", message.sender_id)
            .single();
            
          const chatMessage: ChatMessage = {
            id: message.id,
            group_id: message.group_id,
            user_id: message.sender_id,
            content: message.content,
            created_at: message.created_at,
            reactions: message.reactions || {},
            sender: sender ? {
              id: sender.id,
              name: sender.name,
              avatar: sender.avatar_url
            } : undefined
          };
          
          // Notify about message updates (used for reactions)
          onNewMessage(chatMessage);
        } catch (error) {
          console.error("Error processing message update:", error);
        }
      }
    )
    .subscribe();
    
  return channel;
};

// Subscribe to typing indicators
export const subscribeToTypingIndicators = (
  groupId: string,
  onTypingUpdate: (typingUserIds: string[]) => void
) => {
  // Use Presence feature for typing indicators
  const channel = supabase.channel(`typing:${groupId}`);
  
  let typingUsers: string[] = [];
  
  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      typingUsers = [];
      
      // Collect all typing user IDs
      Object.values(state).forEach((presences: any) => {
        presences.forEach((presence: any) => {
          if (presence.isTyping && !typingUsers.includes(presence.userId)) {
            typingUsers.push(presence.userId);
          }
        });
      });
      
      onTypingUpdate(typingUsers);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
      newPresences.forEach((presence: any) => {
        if (presence.isTyping && !typingUsers.includes(presence.userId)) {
          typingUsers.push(presence.userId);
          onTypingUpdate(typingUsers);
        }
      });
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
      leftPresences.forEach((presence: any) => {
        typingUsers = typingUsers.filter(id => id !== presence.userId);
        onTypingUpdate(typingUsers);
      });
    })
    .subscribe();
    
  return channel;
};

// Send typing indicator
export const sendTypingIndicator = async (
  groupId: string,
  userId: string,
  userName: string
) => {
  try {
    const channel = supabase.channel(`typing:${groupId}`);
    
    await channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return;
      
      await channel.track({
        userId,
        userName,
        isTyping: true
      });
      
      // Reset typing status after 3 seconds of inactivity
      setTimeout(async () => {
        await channel.track({
          userId,
          userName,
          isTyping: false
        });
      }, 3000);
    });
  } catch (error) {
    console.error("Error sending typing indicator:", error);
  }
};
