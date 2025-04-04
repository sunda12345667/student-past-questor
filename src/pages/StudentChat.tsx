
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { ChatContainer } from '@/components/student-chat/ChatContainer';
import { ChatRoomList } from '@/components/student-chat/ChatRoomList';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Layout } from '@/components/Layout';
import { useChat } from '@/hooks/useChat';
import { formatTime } from '@/utils/formatTime';
import { addMessageReaction } from '@/services/chat';

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

  // Handler for message reactions
  const handleReactionToggle = async (messageId: string, emoji: string) => {
    if (!currentUser) return;
    
    try {
      const success = await addMessageReaction(messageId, emoji);
      if (!success) {
        toast.error('Failed to add reaction');
      }
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
              chatRooms={userGroups}
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
              messages={messages}
              currentUserId={currentUser.id}
              onSendMessage={handleSendMessage}
              formatTime={formatTime}
              typingUsers={typingUsers}
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
