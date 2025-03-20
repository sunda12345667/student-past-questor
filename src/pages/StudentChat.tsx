
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ChatRoomList } from '@/components/student-chat/ChatRoomList';
import { ChatContainer } from '@/components/student-chat/ChatContainer';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

const StudentChat = () => {
  const { currentUser } = useAuth();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    { id: 'waec', name: 'WAEC Preparation', participants: 24 },
    { id: 'jamb', name: 'JAMB Study Group', participants: 38 },
    { id: 'neco', name: 'NECO Discussion', participants: 17 },
    { id: 'general', name: 'General Chat', participants: 56 }
  ]);

  // Mock messages data for demonstration
  useEffect(() => {
    if (activeRoom) {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'user1',
          senderName: 'Chioma A.',
          content: 'Has anyone started the mathematics revision yet?',
          timestamp: new Date(Date.now() - 3600000 * 3)
        },
        {
          id: '2',
          senderId: 'user2',
          senderName: 'David O.',
          content: 'Yes, I'm focusing on calculus this week. It's challenging!',
          timestamp: new Date(Date.now() - 3600000 * 2)
        },
        {
          id: '3',
          senderId: 'user3',
          senderName: 'Fatima M.',
          content: 'I found some great practice questions for Physics if anyone needs them.',
          timestamp: new Date(Date.now() - 3600000)
        }
      ];
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  }, [activeRoom]);

  const sendMessage = (content: string) => {
    if (!content.trim() || !activeRoom) return;
    
    // In a real app, this would send to a backend
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'unknown',
      senderName: currentUser?.name || 'Anonymous',
      content: content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate saving to backend
    toast.success('Message sent');
  };

  const joinRoom = (roomId: string) => {
    setActiveRoom(roomId);
    toast.success(`Joined ${chatRooms.find(room => room.id === roomId)?.name}`);
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
              onJoinRoom={joinRoom}
            />
          </div>
          
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <ChatContainer
              activeRoom={activeRoom}
              roomName={activeRoomName}
              messages={messages}
              currentUserId={currentUser?.id}
              onSendMessage={sendMessage}
              formatTime={formatTime}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;
