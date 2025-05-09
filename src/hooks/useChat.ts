
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  getUserGroups,
  getGroupMessages,
  sendGroupMessage,
  subscribeToGroupMessages,
  subscribeToTypingIndicators,
  sendTypingIndicator
} from '@/services/chat';

// Interface for the transformed message format
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  reactions?: Record<string, string[]>;
}

// Interface for typing users
export interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
  isTyping: boolean;
}

// Interface for chat rooms
export interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

export const useChat = (userId: string | undefined) => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userGroups, setUserGroups] = useState<ChatRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);

  // Transform ChatMessage to Message format
  const transformMessage = (chatMessage: any): Message => {
    return {
      id: chatMessage.id,
      senderId: chatMessage.user_id,
      senderName: chatMessage.sender?.name || 'Unknown User',
      content: chatMessage.content,
      timestamp: new Date(chatMessage.created_at),
      reactions: chatMessage.reactions || {}
    };
  };

  // Load current user data
  const loadCurrentUserData = async () => {
    if (!userId) return;
    
    try {
      const { data: user } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', userId)
        .single();
        
      if (user) {
        setCurrentUserData({
          name: user.name,
          avatar: user.avatar_url
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Load user's chat groups
  const loadUserGroups = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const groups = await getUserGroups();
      
      // Transform to ChatRoom format expected by ChatRoomList
      const chatRooms: ChatRoom[] = groups.map(group => ({
        id: group.id,
        name: group.name,
        participants: group.members
      }));
      
      setUserGroups(chatRooms);
      
      // If no active room is set and we have groups, set the first one as active
      if (!activeRoom && chatRooms.length > 0) {
        handleJoinRoom(chatRooms[0].id, chatRooms[0].name);
      }
    } catch (error) {
      console.error('Error loading chat groups:', error);
      toast.error('Failed to load chat groups');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load messages for a specific group
  const loadMessages = async (groupId: string) => {
    try {
      const chatMessages = await getGroupMessages(groupId);
      
      // Transform to Message format
      const transformedMessages: Message[] = chatMessages.map(transformMessage);
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };
  
  // Join a chat room
  const handleJoinRoom = (roomId: string, roomName: string) => {
    setActiveRoom(roomId);
    setActiveRoomName(roomName);
    loadMessages(roomId);
  };
  
  // Send a message to the active room
  const handleSendMessage = async (content: string) => {
    if (!activeRoom || !userId) return;
    
    try {
      const newMessage = await sendGroupMessage(activeRoom, content);
      if (newMessage) {
        setMessages((prev) => [
          ...prev,
          transformMessage(newMessage)
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Send typing indicator to the active room
  const handleTypingIndicator = async () => {
    if (!activeRoom || !userId || !currentUserData) return;
    
    try {
      await sendTypingIndicator(
        activeRoom,
        userId,
        currentUserData.name,
        currentUserData.avatar
      );
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  // Load user data when userId changes
  useEffect(() => {
    if (userId) {
      loadCurrentUserData();
      loadUserGroups();
    }
  }, [userId]);

  // Subscribe to messages and typing indicators when active room changes
  useEffect(() => {
    let messageSubscription: any = null;
    let typingSubscription: any = null;
    
    if (activeRoom && userId) {
      // Load existing messages
      loadMessages(activeRoom);
      
      // Subscribe to new messages
      messageSubscription = subscribeToGroupMessages(
        activeRoom,
        (newMessage) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            transformMessage(newMessage)
          ]);
        }
      );
      
      // Subscribe to typing indicators
      typingSubscription = subscribeToTypingIndicators(
        activeRoom,
        (typingUsersList) => {
          // Filter out current user
          const filteredTypingUsers = typingUsersList.filter(
            user => user.id !== userId
          );
          setTypingUsers(filteredTypingUsers);
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
  }, [activeRoom, userId]);

  return {
    activeRoom,
    activeRoomName,
    messages,
    userGroups,
    typingUsers,
    isLoading,
    handleJoinRoom,
    handleSendMessage,
    handleTypingIndicator
  };
};
