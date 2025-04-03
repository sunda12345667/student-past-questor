import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatGroup } from "./types";

// Get all chat groups the current user is a member of
export const getUserGroups = async (): Promise<ChatGroup[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }

    const { data, error } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.user.id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return [];
    }

    const groupIds = data.map(member => member.group_id);
    
    const { data: groups, error: groupsError } = await supabase
      .from("study_groups")
      .select("*, group_members!group_members(count)")
      .in("id", groupIds);

    if (groupsError) throw groupsError;

    return (groups || []).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      owner_id: group.owner_id,
      is_private: group.is_private,
      members: group.group_members?.length || 0,
      unread: 0
    }));
  } catch (error) {
    console.error("Error fetching user groups:", error);
    toast.error("Failed to load chat groups");
    return [];
  }
};

// Get all public chat groups
export const getPublicGroups = async (): Promise<ChatGroup[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }

    const { data: memberGroups } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.user.id);

    const memberGroupIds = memberGroups?.map(m => m.group_id) || [];

    const { data: groups, error } = await supabase
      .from("study_groups")
      .select("*, group_members!group_members(count)")
      .eq("is_private", false)
      .not("id", "in", memberGroupIds.length > 0 ? memberGroupIds : ['']);

    if (error) throw error;

    return (groups || []).map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      owner_id: group.owner_id,
      is_private: group.is_private,
      members: group.group_members?.length || 0
    }));
  } catch (error) {
    console.error("Error fetching public groups:", error);
    toast.error("Failed to load public chat groups");
    return [];
  }
};

// Create a new chat group
export const createChatGroup = async (
  name: string,
  description: string,
  isPrivate: boolean
): Promise<ChatGroup | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to create a group");
      return null;
    }

    const { data: group, error } = await supabase
      .from("study_groups")
      .insert({
        name,
        description,
        owner_id: user.user.id,
        is_private: isPrivate
      })
      .select()
      .single();

    if (error) throw error;

    const { error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: user.user.id,
        is_admin: true
      });

    if (memberError) throw memberError;

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      created_at: group.created_at,
      owner_id: group.owner_id,
      is_private: group.is_private,
      members: 1
    };
  } catch (error) {
    console.error("Error creating group:", error);
    toast.error("Failed to create group");
    return null;
  }
};
