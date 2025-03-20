
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ChatRoomList } from '@/components/student-chat/ChatRoomList';
import { ChatContainer } from '@/components/student-chat/ChatContainer';
import { getChatRooms, getMessagesForRoom, sendMessage, joinChatRoom, ChatMessage, ChatRoom } from '@/services/chatService';

const StudentChat = () => {
  const { currentUser } = useAuth();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Load chat rooms on component mount
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        setLoading(true);
        const rooms = await getChatRooms();
        setChatRooms(rooms);
      } catch (error) {
        toast.error('Failed to load chat rooms');
        console.error('Error loading chat rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChatRooms();
  }, []);

  // Load messages when active room changes
  useEffect(() => {
    if (activeRoom) {
      const loadMessages = async () => {
        try {
          const roomMessages = await getMessagesForRoom(activeRoom);
          setMessages(roomMessages);
        } catch (error) {
          toast.error('Failed to load messages');
          console.error('Error loading messages:', error);
        }
      };
      
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [activeRoom]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeRoom || !currentUser) return;
    
    try {
      const newMessage = await sendMessage(
        activeRoom,
        currentUser.id,
        currentUser.name,
        content
      );
      
      setMessages(prev => [...prev, newMessage]);
      
      // Clear user from typing list when message is sent
      if (currentUser.name) {
        setTypingUsers(prev => prev.filter(name => name !== currentUser.name));
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    // Add current user to typing users if not already there
    if (currentUser?.name && !typingUsers.includes(currentUser.name)) {
      setTypingUsers(prev => [...prev, currentUser.name]);
      
      // Simulate real-time typing timeout
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(name => name !== currentUser?.name));
      }, 3000);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinChatRoom(roomId);
      setActiveRoom(roomId);
    } catch (error) {
      toast.error('Failed to join chat room');
      console.error('Error joining chat room:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const activeRoomName = activeRoom 
    ? chatRooms.find(room => room.id === activeRoom)?.name 
    : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6">Student Chat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Rooms */}
          <div className="lg:col-span-1">
            <ChatRoomList 
              chatRooms={chatRooms}
              activeRoom={activeRoom}
              onJoinRoom={handleJoinRoom}
              isLoading={loading}
            />
          </div>
          
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <ChatContainer
              activeRoom={activeRoom}
              roomName={activeRoomName}
              messages={messages}
              currentUserId={currentUser?.id}
              onSendMessage={handleSendMessage}
              formatTime={formatTime}
              typingUsers={typingUsers}
              onTyping={handleTyping}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;
