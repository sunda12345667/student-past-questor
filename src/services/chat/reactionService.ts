
import { supabase } from '@/integrations/supabase/client';
import { MessageReaction } from './types';

export const addReaction = async (messageId: string, emoji: string): Promise<boolean> => {
  try {
    console.log('Adding reaction:', messageId, emoji);
    // TODO: Implement when reactions are supported in the database
    return true;
  } catch (error) {
    console.error('Error adding reaction:', error);
    return false;
  }
};

export const removeReaction = async (messageId: string, emoji: string): Promise<boolean> => {
  try {
    console.log('Removing reaction:', messageId, emoji);
    // TODO: Implement when reactions are supported in the database
    return true;
  } catch (error) {
    console.error('Error removing reaction:', error);
    return false;
  }
};

export const getMessageReactions = async (messageId: string): Promise<MessageReaction[]> => {
  try {
    console.log('Getting reactions for message:', messageId);
    // TODO: Implement when reactions are supported in the database
    return [];
  } catch (error) {
    console.error('Error getting reactions:', error);
    return [];
  }
};
