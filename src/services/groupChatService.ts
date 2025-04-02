
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  members: number;
  unread?: number;
}

export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

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
      created_by: group.owner_id, // Changed from created_by to owner_id
      is_private: group.is_private,
      members: group.group_members?.length || 0,
      unread: 0 // We'll implement unread count in a future update
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

    // Get groups the user is already a member of
    const { data: memberGroups } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.user.id);

    const memberGroupIds = memberGroups?.map(m => m.group_id) || [];

    // Get public groups the user is not a member of
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
      created_by: group.owner_id, // Changed from created_by to owner_id
      is_private: group.is_private,
      members: group.group_members?.length || 0
    }));
  } catch (error) {
    console.error("Error fetching public groups:", error);
    toast.error("Failed to load public chat groups");
    return [];
  }
};

// Get messages for a specific group
export const getGroupMessages = async (groupId: string): Promise<ChatMessage[]> => {
  try {
    const { data: messages, error } = await supabase
      .from("group_messages")
      .select(`
        id,
        group_id,
        sender_id,
        content,
        created_at,
        profiles(id, name, avatar_url)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return (messages || []).map(message => ({
      id: message.id,
      group_id: message.group_id,
      user_id: message.sender_id,
      content: message.content,
      created_at: message.created_at,
      sender: message.profiles ? {
        id: message.profiles.id,
        name: message.profiles.name,
        avatar: message.profiles.avatar_url
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching group messages:", error);
    toast.error("Failed to load messages");
    return [];
  }
};

// Send a message to a group
export const sendGroupMessage = async (
  groupId: string,
  content: string
): Promise<ChatMessage | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to send messages");
      return null;
    }

    const { data: message, error } = await supabase
      .from("group_messages")
      .insert({
        group_id: groupId,
        sender_id: user.user.id,
        content
      })
      .select(`
        id,
        group_id,
        sender_id,
        content,
        created_at,
        profiles(id, name, avatar_url)
      `)
      .single();

    if (error) throw error;

    return {
      id: message.id,
      group_id: message.group_id,
      user_id: message.sender_id,
      content: message.content,
      created_at: message.created_at,
      sender: message.profiles ? {
        id: message.profiles.id,
        name: message.profiles.name,
        avatar: message.profiles.avatar_url
      } : undefined
    };
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
    return null;
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

    // Create the group
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

    // Add the creator as a member and admin
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
      created_by: group.owner_id,
      is_private: group.is_private,
      members: 1
    };
  } catch (error) {
    console.error("Error creating group:", error);
    toast.error("Failed to create group");
    return null;
  }
};

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
        user:user_id(id:id, name:name, avatar_url:avatar_url)
      `)
      .eq("group_id", groupId);

    if (error) throw error;

    return (members || []).map(member => ({
      id: member.id,
      group_id: member.group_id,
      user_id: member.user_id,
      joined_at: member.joined_at,
      is_admin: member.is_admin,
      user: member.user ? {
        id: member.user.id,
        name: member.user.name,
        avatar_url: member.user.avatar_url
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching group members:", error);
    toast.error("Failed to load group members");
    return [];
  }
};

// Subscribe to real-time updates for a group's messages
export const subscribeToGroupMessages = (
  groupId: string,
  onNewMessage: (message: ChatMessage) => void
) => {
  const channel = supabase
    .channel(`group_messages:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'group_messages',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        // Get the full message with sender details
        const { data } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .eq('id', payload.new.sender_id)
          .single();

        const fullMessage: ChatMessage = {
          id: payload.new.id,
          group_id: payload.new.group_id,
          user_id: payload.new.sender_id,
          content: payload.new.content,
          created_at: payload.new.created_at,
          sender: {
            id: payload.new.sender_id,
            name: data?.name || 'Unknown User',
            avatar: data?.avatar_url
          }
        };

        onNewMessage(fullMessage);
      }
    )
    .subscribe();

  return channel;
};

// Subscribe to typing indicators
export const subscribeToTypingIndicators = (
  groupId: string,
  onTypingUpdate: (typingUsers: string[]) => void
) => {
  const typingUsers = new Map<string, NodeJS.Timeout>();

  const channel = supabase
    .channel(`typing:${groupId}`)
    .on('broadcast', { event: 'typing' }, (payload) => {
      const { user_id, user_name } = payload.payload;
      
      // Clear any existing timeout for this user
      if (typingUsers.has(user_id)) {
        clearTimeout(typingUsers.get(user_id)!);
      }
      
      // Add user to typing list
      typingUsers.set(user_id, setTimeout(() => {
        typingUsers.delete(user_id);
        onTypingUpdate(Array.from(typingUsers.keys()));
      }, 3000));
      
      // Notify about typing users
      onTypingUpdate(Array.from(typingUsers.keys()));
    })
    .subscribe();

  return channel;
};

// Broadcast typing indicator
export const sendTypingIndicator = async (
  groupId: string,
  userId: string,
  userName: string
) => {
  try {
    await supabase
      .channel(`typing:${groupId}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: userId, user_name: userName }
      });
  } catch (error) {
    console.error("Error sending typing indicator:", error);
  }
};
