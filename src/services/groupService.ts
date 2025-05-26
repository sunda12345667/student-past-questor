
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreateGroupData {
  name: string;
  description: string;
  isPrivate: boolean;
}

export const createStudyGroup = async (groupData: CreateGroupData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to create a group');
      return null;
    }

    // Create the study group
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .insert({
        name: groupData.name,
        description: groupData.description,
        is_private: groupData.isPrivate,
        owner_id: user.id
      })
      .select()
      .single();

    if (groupError) {
      console.error('Error creating group:', groupError);
      toast.error('Failed to create group');
      return null;
    }

    // Add the creator as a member and admin
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        is_admin: true
      });

    if (memberError) {
      console.error('Error adding creator as member:', memberError);
      // Don't show error to user as group was created successfully
    }

    toast.success('Study group created successfully!');
    return group;
  } catch (error) {
    console.error('Error creating study group:', error);
    toast.error('Failed to create study group');
    return null;
  }
};

export const joinStudyGroup = async (groupId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to join a group');
      return false;
    }

    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        is_admin: false
      });

    if (error) {
      console.error('Error joining group:', error);
      toast.error('Failed to join group');
      return false;
    }

    toast.success('Successfully joined the group!');
    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    toast.error('Failed to join group');
    return false;
  }
};
