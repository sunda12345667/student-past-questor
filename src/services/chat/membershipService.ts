
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroupMember } from "./types";

// Join a chat group
export const joinChatGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to join a group");
      return false;
    }

    const { error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: user.user.id,
        is_admin: false
      });

    if (error) throw error;

    toast.success("You've joined the group!");
    return true;
  } catch (error) {
    console.error("Error joining group:", error);
    toast.error("Failed to join group");
    return false;
  }
};

// Leave a chat group
export const leaveChatGroup = async (groupId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to leave a group");
      return false;
    }

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", user.user.id);

    if (error) throw error;

    toast.success("You've left the group");
    return true;
  } catch (error) {
    console.error("Error leaving group:", error);
    toast.error("Failed to leave group");
    return false;
  }
};

// Get group members
export const getGroupMembers = async (groupId: string): Promise<GroupMember[]> => {
  try {
    const { data: members, error } = await supabase
      .from("group_members")
      .select(`
        id,
        group_id,
        user_id,
        joined_at,
        is_admin,
        profiles(id, name, avatar_url)
      `)
      .eq("group_id", groupId);

    if (error) throw error;

    return (members || []).map(member => ({
      id: member.id,
      group_id: member.group_id,
      user_id: member.user_id,
      joined_at: member.joined_at,
      is_admin: member.is_admin,
      user: member.profiles ? {
        id: member.profiles.id,
        name: member.profiles.name,
        avatar_url: member.profiles.avatar_url
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching group members:", error);
    toast.error("Failed to load group members");
    return [];
  }
};
