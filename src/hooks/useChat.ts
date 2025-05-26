import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  sendMessage,
  getMessages, 
  subscribeToMessages,
  realTimeService 
} from '@/services/chat';
import { Message } from '@/services/chat/types';

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
  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeRoom || !userId) {
      toast.error('Cannot send message: not connected to a room');
      return;
    }

    try {
      const messageData = {
        content,
        group_id: activeRoom
      };

      const newMessage = await sendMessage(messageData);
      if (!newMessage) {
        throw new Error('Failed to send message');
      }

      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, [activeRoom, userId]);
  
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
      messageSubscription = subscribeToMessages(
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
