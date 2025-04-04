
import { useState } from 'react';
import { sendTypingIndicator } from '@/services/chat';
import { TypingUser } from './types';

export const useTyping = (userId: string | undefined) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  // Send typing indicator to the active room
  const handleTypingIndicator = async (
    activeRoom: string | null, 
    userName: string, 
    userAvatar?: string
  ) => {
    if (!activeRoom || !userId) return;
    
    try {
      await sendTypingIndicator(
        activeRoom,
        userId,
        userName,
        userAvatar
      );
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  return {
    typingUsers,
    setTypingUsers,
    handleTypingIndicator
  };
};
