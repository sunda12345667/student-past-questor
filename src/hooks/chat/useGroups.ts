
import { useState } from 'react';
import { toast } from 'sonner';
import { getUserGroups } from '@/services/chat';
import { ChatGroup } from './types';

export const useGroups = () => {
  const [userGroups, setUserGroups] = useState<ChatGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user's chat groups
  const loadUserGroups = async (userId: string | undefined) => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const groups = await getUserGroups();
      
      // Transform to ChatGroup format expected by the hook
      const chatGroups: ChatGroup[] = groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        is_private: group.is_private,
        owner_id: group.owner_id,
        created_at: group.created_at
      }));
      
      setUserGroups(chatGroups);
      return chatGroups;
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
