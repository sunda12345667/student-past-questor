
import { useState } from 'react';
import { toast } from 'sonner';
import { getUserGroups } from '@/services/chat';
import { ChatRoom } from './types';

export const useGroups = () => {
  const [userGroups, setUserGroups] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's chat groups
  const loadUserGroups = async (userId: string | undefined) => {
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
      return chatRooms;
    } catch (error) {
      console.error('Error loading chat groups:', error);
      toast.error('Failed to load chat groups');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userGroups,
    isLoading,
    loadUserGroups,
    setUserGroups
  };
};
