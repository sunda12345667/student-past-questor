
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./types";

// Subscribe to new messages in a group
export const subscribeToGroupMessages = (
  groupId: string,
  onNewMessage: (message: ChatMessage) => void
) => {
  console.log(`Setting up message subscription for group: ${groupId}`);
  
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
        console.log('New message received:', payload);
        
        // Fetch message details with sender info
        const message = payload.new as any;
        
        if (!message || !message.id) {
          console.error('Invalid message payload:', payload);
          return;
        }
        
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
            content: message.content || '',
            created_at: message.created_at,
            reactions: message.reactions || {},
            attachments: message.attachments || [],
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
        console.log('Message updated:', payload);
        
        // Handle message updates (like reactions)
        const message = payload.new as any;
        
        if (!message || !message.id) {
          console.error('Invalid message update payload:', payload);
          return;
        }
        
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
            content: message.content || '',
            created_at: message.created_at,
            reactions: message.reactions || {},
            attachments: message.attachments || [],
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
    .subscribe((status) => {
      console.log(`Message subscription status for group ${groupId}:`, status);
    });
    
  return channel;
};

// Interface for typing user
interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
  isTyping: boolean;
}

// Subscribe to typing indicators with improved reliability
export const subscribeToTypingIndicators = (
  groupId: string,
  onTypingUpdate: (typingUsers: TypingUser[]) => void
) => {
  console.log(`Setting up typing subscription for group: ${groupId}`);
  
  // Use Presence feature for typing indicators
  const channel = supabase.channel(`typing:${groupId}`, {
    config: {
      presence: {
        key: groupId
      }
    }
  });
  
  let typingUsers: TypingUser[] = [];
  
  channel
    .on('presence', { event: 'sync' }, () => {
      console.log('Typing presence sync');
      const state = channel.presenceState();
      typingUsers = [];
      
      // Collect all typing user information
      Object.values(state).forEach((presences: any) => {
        presences.forEach((presence: any) => {
          if (presence.isTyping && presence.userId) {
            const existingUser = typingUsers.find(user => user.id === presence.userId);
            if (!existingUser) {
              typingUsers.push({
                id: presence.userId,
                name: presence.userName || 'Unknown user',
                avatar: presence.userAvatar,
                isTyping: true
              });
            }
          }
        });
      });
      
      console.log('Typing users after sync:', typingUsers);
      onTypingUpdate(typingUsers);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
      console.log('User joined typing:', newPresences);
      
      newPresences.forEach((presence: any) => {
        if (presence.isTyping && presence.userId) {
          const existingUserIndex = typingUsers.findIndex(user => user.id === presence.userId);
          
          if (existingUserIndex === -1) {
            typingUsers.push({
              id: presence.userId,
              name: presence.userName || 'Unknown user',
              avatar: presence.userAvatar,
              isTyping: true
            });
            onTypingUpdate([...typingUsers]);
          }
        }
      });
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
      console.log('User left typing:', leftPresences);
      
      let hasChanged = false;
      
      leftPresences.forEach((presence: any) => {
        const index = typingUsers.findIndex(user => user.id === presence.userId);
        if (index !== -1) {
          typingUsers.splice(index, 1);
          hasChanged = true;
        }
      });
      
      if (hasChanged) {
        onTypingUpdate([...typingUsers]);
      }
    })
    .subscribe((status) => {
      console.log(`Typing subscription status for group ${groupId}:`, status);
    });
    
  return channel;
};

// Send typing indicator with better error handling
export const sendTypingIndicator = async (
  groupId: string,
  userId: string,
  userName: string,
  userAvatar?: string
) => {
  try {
    console.log(`Sending typing indicator for user ${userId} in group ${groupId}`);
    
    const channel = supabase.channel(`typing:${groupId}`, {
      config: {
        presence: {
          key: groupId
        }
      }
    });
    
    await channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') {
        console.log('Typing channel not subscribed yet:', status);
        return;
      }
      
      try {
        // Track typing status
        await channel.track({
          userId,
          userName,
          userAvatar,
          isTyping: true,
          timestamp: Date.now()
        });
        
        console.log('Typing indicator sent successfully');
        
        // Auto-remove typing status after 3 seconds
        setTimeout(async () => {
          try {
            await channel.untrack();
            console.log('Typing indicator cleared');
          } catch (error) {
            console.error('Error clearing typing indicator:', error);
          }
        }, 3000);
      } catch (error) {
        console.error('Error tracking typing status:', error);
      }
    });
  } catch (error) {
    console.error("Error sending typing indicator:", error);
  }
};

// Enhanced connection management
export const createReliableChannel = (channelName: string, config?: any) => {
  const channel = supabase.channel(channelName, config);
  
  // Add connection monitoring
  channel.on('system', {}, (payload) => {
    console.log(`Channel ${channelName} system event:`, payload);
  });
  
  return channel;
};

// Cleanup function for channels
export const cleanupChannel = (channel: any) => {
  if (channel) {
    try {
      supabase.removeChannel(channel);
      console.log('Channel cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up channel:', error);
    }
  }
};
