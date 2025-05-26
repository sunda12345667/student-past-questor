
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { ChatContainer } from '@/components/student-chat/ChatContainer';
import { ChatRoomList } from '@/components/student-chat/ChatRoomList';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { useChat } from '@/hooks/chat';
import { formatTime } from '@/utils/formatTime';

// Type adapters to bridge the difference between chat hook types and component types
interface ComponentMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  reactions?: Record<string, string[]>;
  attachments?: any[];
}

interface ComponentTypingUser {
  id: string;
  name: string;
  isTyping: boolean;
  avatar?: string;
}

interface ComponentChatRoom {
  id: string;
  name: string;
  description?: string;
  participants: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

const StudentChat: React.FC = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { 
    activeRoom,
    activeRoomName,
    messages,
    userGroups,
    typingUsers,
    isLoading: chatLoading,
    handleJoinRoom,
    handleSendMessage,
    handleTypingIndicator
  } = useChat(currentUser?.id);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast.error('Please log in to access chat');
      navigate('/login');
    }
  }, [currentUser, authLoading, navigate]);

  // Convert chat hook messages to component messages with proper Date type
  const componentMessages: ComponentMessage[] = messages.map(msg => ({
    id: msg.id,
    senderId: msg.sender_id,
    senderName: msg.sender?.name || 'Unknown User',
    content: msg.content,
    timestamp: new Date(msg.created_at), // Convert string to Date
    reactions: {},
    attachments: []
  }));

  // Convert chat hook typing users to component typing users
  const componentTypingUsers: ComponentTypingUser[] = typingUsers.map(user => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    isTyping: true
  }));

  // Convert chat groups to chat rooms
  const componentChatRooms: ComponentChatRoom[] = userGroups.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    participants: 0, // Default value since we don't have participant count
    lastMessage: undefined,
    lastMessageTime: undefined
  }));

  // Handler for message reactions
  const handleReactionToggle = async (messageId: string, emoji: string) => {
    if (!currentUser) return;
    
    try {
      // TODO: Implement reaction toggle functionality
      console.log('Reaction toggle:', messageId, emoji);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Could not update reaction');
    }
  };

  // If loading or not authenticated, show nothing
  if (authLoading || !currentUser) {
    return null;
  }

  return (
    <Layout>
      <div className="container mt-8 mb-16">
        <h1 className="text-2xl font-bold mb-6">Student Chat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ChatRoomList
              chatRooms={componentChatRooms}
              activeRoom={activeRoom}
              onJoinRoom={(roomId) => {
                const room = userGroups.find(r => r.id === roomId);
                if (room) {
                  handleJoinRoom(roomId, room.name);
                }
              }}
              isLoading={chatLoading}
            />
          </div>
          
          <div className="lg:col-span-2">
            <ChatContainer
              activeRoom={activeRoom}
              roomName={activeRoomName}
              messages={componentMessages}
              currentUserId={currentUser.id}
              onSendMessage={handleSendMessage}
              formatTime={formatTime}
              typingUsers={componentTypingUsers}
              onTyping={handleTypingIndicator}
              onReactionToggle={handleReactionToggle}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;
