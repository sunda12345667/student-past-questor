
import { supabase } from '@/integrations/supabase/client';
import { ChatGroup } from './types';

export const getUserGroups = async (): Promise<ChatGroup[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('group_members')
      .select(`
        group_id,
        study_groups (
          id,
          name,
          description,
          is_private,
          owner_id,
          created_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }

    return data
      ?.filter(item => item.study_groups)
      .map(item => ({
        id: item.study_groups.id,
        name: item.study_groups.name,
        description: item.study_groups.description,
        is_private: item.study_groups.is_private,
        owner_id: item.study_groups.owner_id,
        created_at: item.study_groups.created_at,
        members: 0 // Will be populated separately if needed
      })) || [];
  } catch (error) {
    console.error('Error in getUserGroups:', error);
    return [];
  }
};

export const getPublicGroups = async (): Promise<ChatGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('is_private', false);

    if (error) {
      console.error('Error fetching public groups:', error);
      return [];
    }

    return data?.map(group => ({
      ...group,
      members: 0 // Will be populated separately if needed
    })) || [];
  } catch (error) {
    console.error('Error in getPublicGroups:', error);
    return [];
  }
};

export const createChatGroup = async (
  name: string,
  description: string,
  isPrivate: boolean
): Promise<ChatGroup | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('study_groups')
      .insert({
        name,
        description,
        is_private: isPrivate,
        owner_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating group:', error);
      return null;
    }

    // Add creator as member
    await supabase
      .from('group_members')
      .insert({
        group_id: data.id,
        user_id: user.id,
        is_admin: true
      });

    return {
      ...data,
      members: 1
    };
  } catch (error) {
    console.error('Error in createChatGroup:', error);
    return null;
  }
};

export const joinChatGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        is_admin: false
      });

    return !error;
  } catch (error) {
    console.error('Error in joinChatGroup:', error);
    return false;
  }
};

export const leaveChatGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    return !error;
  } catch (error) {
    console.error('Error in leaveChatGroup:', error);
    return false;
  }
};

export const getGroupMessages = async (groupId: string, limit: number = 50) => {
  // This is just an alias to the main getMessages function
  const { getMessages } = await import('./messageService');
  return getMessages(groupId, limit);
};

export const sendGroupMessage = async (groupId: string, content: string, files?: File[]) => {
  try {
    const { sendMessage } = await import('./messageService');
    
    const messageData = {
      content,
      group_id: groupId
    };

    return await sendMessage(messageData);
  } catch (error) {
    console.error('Error in sendGroupMessage:', error);
    return null;
  }
};
