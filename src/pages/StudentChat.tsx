
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ChatRoomList } from '@/components/student-chat/ChatRoomList';
import { ChatContainer } from '@/components/student-chat/ChatContainer';
import { 
  getUserGroups, 
  getPublicGroups, 
  getGroupMessages, 
  sendGroupMessage, 
  joinChatGroup, 
  subscribeToGroupMessages, 
  subscribeToTypingIndicators, 
  sendTypingIndicator 
} from '@/services/chat';
import { ChatGroup, ChatMessage } from '@/services/chat/types';
import { useNavigate } from 'react-router-dom';

const StudentChat = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [userGroups, setUserGroups] = useState<ChatGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const messageSubscription = useRef<any>(null);
  const typingSubscription = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser && !loading) {
      toast.error("Please log in to access the chat");
      navigate('/login');
    }
  }, [currentUser, navigate, loading]);
  
  // Load user's groups and public groups
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const [userGroupsData, publicGroupsData] = await Promise.all([
          getUserGroups(),
          getPublicGroups()
        ]);
        
        setUserGroups(userGroupsData);
        setPublicGroups(publicGroupsData);
      } catch (error) {
        console.error('Error loading groups:', error);
        toast.error('Failed to load chat groups');
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      loadGroups();
    }
  }, [currentUser]);

  // Clean up subscriptions on unmount
  useEffect(() => {
    return () => {
      if (messageSubscription.current) {
        messageSubscription.current.unsubscribe();
      }
      if (typingSubscription.current) {
        typingSubscription.current.unsubscribe();
      }
    };
  }, []);

  // Load messages when active room changes and set up subscriptions
  useEffect(() => {
    if (activeRoom && currentUser) {
      // Clean up previous subscriptions
      if (messageSubscription.current) {
        messageSubscription.current.unsubscribe();
      }
      if (typingSubscription.current) {
        typingSubscription.current.unsubscribe();
      }

      const loadMessages = async () => {
        try {
          const roomMessages = await getGroupMessages(activeRoom);
          setMessages(roomMessages);
        } catch (error) {
          toast.error('Failed to load messages');
          console.error('Error loading messages:', error);
        }
      };
      
      loadMessages();
      
      // Set up real-time subscriptions
      messageSubscription.current = subscribeToGroupMessages(
        activeRoom,
        (newMessage: ChatMessage) => {
          setMessages(prev => [...prev, newMessage]);
        }
      );
      
      typingSubscription.current = subscribeToTypingIndicators(
        activeRoom,
        (users: string[]) => {
          setTypingUsers(users);
        }
      );
    } else {
      setMessages([]);
      setTypingUsers([]);
    }
  }, [activeRoom, currentUser]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeRoom || !currentUser) return;
    
    try {
      const newMessage = await sendGroupMessage(
        activeRoom,
        content
      );
      
      if (newMessage && !messages.some(m => m.id === newMessage.id)) {
        setMessages(prev => [...prev, newMessage]);
      }
      
      // Clear user from typing list when message is sent
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (!currentUser || !activeRoom) return;

    try {
      sendTypingIndicator(
        activeRoom, 
        currentUser.id, 
        currentUser.name
      );
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    try {
      if (!currentUser) {
        toast.error("Please log in to join a chat room");
        navigate('/login');
        return;
      }
      
      await joinChatGroup(roomId);
      setActiveRoom(roomId);
      
      // Refresh groups after joining
      const userGroupsData = await getUserGroups();
      setUserGroups(userGroupsData);
      
      const publicGroupsData = await getPublicGroups();
      setPublicGroups(publicGroupsData);
    } catch (error) {
      toast.error('Failed to join chat room');
      console.error('Error joining chat room:', error);
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const allGroups = [
    ...userGroups.map(group => ({ ...group, joined: true })),
    ...publicGroups.map(group => ({ ...group, joined: false }))
  ];

  const activeRoomName = activeRoom 
    ? allGroups.find(group => group.id === activeRoom)?.name 
    : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6">Student Chat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Rooms */}
          <div className="lg:col-span-1">
            <ChatRoomList 
              chatRooms={allGroups}
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
