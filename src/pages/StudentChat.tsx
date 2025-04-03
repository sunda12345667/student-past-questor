
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/auth';
import { ChatContainer } from '@/components/student-chat/ChatContainer';
import { ChatRoomList } from '@/components/student-chat/ChatRoomList';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { 
  getUserGroups, 
  getPublicGroups, 
  joinChatGroup,
  getGroupMessages,
  sendGroupMessage,
  subscribeToGroupMessages,
  subscribeToTypingIndicators,
  sendTypingIndicator
} from '@/services/chat';

// Interface for the transformed message format expected by ChatContainer
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

// Interface for chat rooms expected by ChatRoomList
interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

const StudentChat: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userGroups, setUserGroups] = useState<ChatRoom[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast.error('Please log in to access chat');
      navigate('/login');
    }
  }, [currentUser, isLoading, navigate]);

  // Load user's chat groups
  useEffect(() => {
    if (currentUser) {
      loadUserGroups();
    }
  }, [currentUser]);

  // Subscribe to messages and typing indicators when active room changes
  useEffect(() => {
    let messageSubscription: any = null;
    let typingSubscription: any = null;
    
    if (activeRoom && currentUser) {
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
        (typingUserIds) => {
          setTypingUsers(typingUserIds);
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
  }, [activeRoom, currentUser]);
  
  const loadUserGroups = async () => {
    try {
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
    }
  };
  
  const loadMessages = async (groupId: string) => {
    try {
      const chatMessages = await getGroupMessages(groupId);
      
      // Transform to Message format expected by ChatContainer
      const transformedMessages: Message[] = chatMessages.map(transformMessage);
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };
  
  // Transform ChatMessage to Message format
  const transformMessage = (chatMessage: any): Message => {
    return {
      id: chatMessage.id,
      senderId: chatMessage.user_id,
      senderName: chatMessage.sender?.name || 'Unknown User',
      content: chatMessage.content,
      timestamp: new Date(chatMessage.created_at)
    };
  };
  
  const handleJoinRoom = (roomId: string, roomName: string) => {
    setActiveRoom(roomId);
    setActiveRoomName(roomName);
    loadMessages(roomId);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!activeRoom || !currentUser) return;
    
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
  
  const handleTypingIndicator = async () => {
    if (!activeRoom || !currentUser) return;
    
    try {
      await sendTypingIndicator(
        activeRoom,
        currentUser.id,
        currentUser.name || currentUser.email || 'User'
      );
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };
  
  // Format timestamp for display
  const formatTime = (date: Date): string => {
    return format(date, 'h:mm a');
  };
  
  // If loading or not authenticated, show nothing
  if (isLoading || !currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="container mt-8 mb-16">
        <h1 className="text-2xl font-bold mb-6">Student Chat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ChatRoomList
              chatRooms={userGroups}
              activeRoom={activeRoom}
              onJoinRoom={(roomId) => {
                const room = userGroups.find(r => r.id === roomId);
                if (room) {
                  handleJoinRoom(roomId, room.name);
                }
              }}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ChatContainer
              activeRoom={activeRoom}
              roomName={activeRoomName}
              messages={messages}
              currentUserId={currentUser.id}
              onSendMessage={handleSendMessage}
              formatTime={formatTime}
              typingUsers={typingUsers}
              onTyping={handleTypingIndicator}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;
