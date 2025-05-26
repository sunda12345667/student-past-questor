
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
        joined_at
      `)
      .eq('group_id', groupId);

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    // Get user profiles separately
    const userIds = data?.map(member => member.user_id) || [];
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', userIds);

      return data?.map(member => ({
        id: member.id,
        group_id: member.group_id,
        user_id: member.user_id,
        is_admin: member.is_admin,
        joined_at: member.joined_at,
        user: profiles?.find(p => p.id === member.user_id) ? {
          name: profiles.find(p => p.id === member.user_id)!.name,
          avatar_url: profiles.find(p => p.id === member.user_id)!.avatar_url
        } : undefined
      })) || [];
    }

    return data?.map(member => ({
      id: member.id,
      group_id: member.group_id,
      user_id: member.user_id,
      is_admin: member.is_admin,
      joined_at: member.joined_at,
      user: undefined
    })) || [];
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    return [];
  }
};
