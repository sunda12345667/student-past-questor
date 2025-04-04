
import { useState, useEffect } from 'react';
import { useUserData } from './useUserData';
import { useGroups } from './useGroups';
import { useMessages } from './useMessages';
import { useTyping } from './useTyping';
import { useRealtime } from './useRealtime';
import { UseChatResult } from './types';

export * from './types';

export const useChat = (userId: string | undefined): UseChatResult => {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeRoomName, setActiveRoomName] = useState<string | null>(null);
  
  const userData = useUserData(userId);
  const { userGroups, isLoading, loadUserGroups } = useGroups();
  const { messages, loadMessages, handleSendMessage: sendMessage, addMessage } = useMessages(userId);
  const { typingUsers, setTypingUsers, handleTypingIndicator: sendTypingIndicator } = useTyping(userId);
  
  // Load user's chat groups when userId changes
  useEffect(() => {
    if (userId) {
      loadUserGroups(userId).then(groups => {
        // If no active room is set and we have groups, set the first one as active
        if (!activeRoom && groups && groups.length > 0) {
          handleJoinRoom(groups[0].id, groups[0].name);
        }
      });
    }
  }, [userId]);
  
  // Set up realtime subscriptions
  useRealtime(
    activeRoom,
    userId,
    addMessage,
    setTypingUsers
  );
  
  // Load messages when active room changes
  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom);
    }
  }, [activeRoom]);
  
  // Join a chat room
  const handleJoinRoom = (roomId: string, roomName: string) => {
    setActiveRoom(roomId);
    setActiveRoomName(roomName);
  };
  
  // Send a message to the active room
  const handleSendMessage = async (content: string) => {
    await sendMessage(activeRoom, content);
  };
  
  // Send typing indicator to the active room
  const handleTypingIndicator = () => {
    if (!userData) return;
    
    sendTypingIndicator(
      activeRoom,
      userData.name,
      userData.avatar
    );
  };

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
