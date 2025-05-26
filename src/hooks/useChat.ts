
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToGroupMessages } from '@/services/chat/realtimeService';

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  group_id: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export const useChat = (userId: string | undefined) => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userGroups, setUserGroups] = useState<ChatRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's chat groups
  const loadUserGroups = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Get user's groups through group_members table
      const { data: memberGroups, error } = await supabase
        .from('group_members')
        .select(`
          group_id,
          study_groups (
            id,
            name,
            description,
            is_private,
            owner_id,
            created_at
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading groups:', error);
        toast.error('Failed to load chat groups');
        return;
      }

      // Transform to ChatRoom format
      const chatRooms: ChatRoom[] = memberGroups
        ?.filter(mg => mg.study_groups)
        .map(mg => ({
          id: mg.study_groups.id,
          name: mg.study_groups.name,
          participants: 0
        })) || [];
      
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
      const { data } = await supabase
        .from('group_messages')
        .select(`
          id,
          content,
          created_at,
          group_id,
          sender_id,
          sender:profiles (
            id,
            name
          )
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (data) {
        const messages: Message[] = data.map(msg => ({
          id: msg.id,
          sender_id: msg.sender_id,
          content: msg.content,
          created_at: msg.created_at,
          group_id: msg.group_id,
          sender: (msg.sender as any) ? {
            id: (msg.sender as any).id,
            name: (msg.sender as any).name,
            avatar: '/placeholder.svg'
          } : undefined
        }));
        setMessages(messages);
      }
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
      const { error } = await supabase
        .from('group_messages')
        .insert({
          group_id: activeRoom,
          content,
          sender_id: userId
        });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  }, [activeRoom, userId]);
  
  // Send typing indicator (placeholder)
  const handleTypingIndicator = async () => {
    // Placeholder implementation
    console.log('Typing indicator sent');
  };

  // Load user groups when userId changes
  useEffect(() => {
    if (userId) {
      loadUserGroups();
    }
  }, [userId]);

  // Subscribe to messages when active room changes
  useEffect(() => {
    let messageSubscription: any = null;
    
    if (activeRoom && userId) {
      // Subscribe to new messages
      messageSubscription = subscribeToGroupMessages(
        activeRoom,
        (newMessage) => {
          const transformedMessage: Message = {
            id: newMessage.id,
            sender_id: newMessage.sender_id,
            content: newMessage.content,
            created_at: newMessage.created_at,
            group_id: newMessage.group_id,
            sender: newMessage.sender
          };
          setMessages((prevMessages) => [
            ...prevMessages,
            transformedMessage
          ]);
        }
      );
    }
    
    return () => {
      if (messageSubscription) {
        supabase.removeChannel(messageSubscription);
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
