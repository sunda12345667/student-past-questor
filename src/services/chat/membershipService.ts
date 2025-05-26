
import { supabase } from '@/integrations/supabase/client';
import { GroupMember } from './types';

export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        id,
        group_id,
        user_id,
        is_admin,
        joined_at,
        profiles (
          name,
          avatar_url
        )
      `)
      .eq('group_id', groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    return data?.map(member => ({
      id: member.id,
      group_id: member.group_id,
      user_id: member.user_id,
      is_admin: member.is_admin,
      joined_at: member.joined_at,
      user: member.profiles ? {
        name: member.profiles.name,
        avatar_url: member.profiles.avatar_url
      } : undefined
    })) || [];
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    return [];
  }
};
