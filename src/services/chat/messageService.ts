import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatMessage } from "./types";
import { joinGroupIfNotMember } from "./membershipService";

export const getGroupMessages = async (groupId: string): Promise<ChatMessage[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to view messages");
      return [];
    }

    const { data: memberCheck } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.user.id)
      .single();

    if (!memberCheck) {
      const joined = await joinGroupIfNotMember(groupId, user.user.id);
      if (!joined) {
        toast.error("You need to be a member of this group to view messages");
        return [];
      }
    }

    const { data: messages, error: messageError } = await supabase
      .from("group_messages")
      .select(`
        id,
        group_id,
        sender_id,
        content,
        created_at,
        reactions
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (messageError) throw messageError;
    
    if (!messages || messages.length === 0) {
      return [];
    }
    
    const senderIds = [...new Set(messages.map(msg => msg.sender_id))];
    
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, avatar_url")
      .in("id", senderIds);
      
    if (profileError) throw profileError;

    return messages.map(message => {
      const sender = profiles?.find(p => p.id === message.sender_id);
      
      return {
        id: message.id,
        group_id: message.group_id,
        user_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
        reactions: message.reactions || {},
        sender: sender ? {
          id: sender.id,
          name: sender.name,
          avatar: sender.avatar_url
        } : undefined
      };
    });
  } catch (error) {
    console.error("Error fetching group messages:", error);
    toast.error("Failed to load messages");
    return [];
  }
};

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

    const { data: memberCheck } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.user.id)
      .single();

    if (!memberCheck) {
      toast.error("You must be a member of this group to send messages");
      return null;
    }

    const { data: insertedMessage, error: insertError } = await supabase
      .from("group_messages")
      .insert({
        group_id: groupId,
        sender_id: user.user.id,
        content,
        reactions: {}
      })
      .select(`id, group_id, sender_id, content, created_at, reactions`)
      .single();

    if (insertError) throw insertError;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(`id, name, avatar_url`)
      .eq("id", user.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      id: insertedMessage.id,
      group_id: insertedMessage.group_id,
      user_id: insertedMessage.sender_id,
      content: insertedMessage.content,
      created_at: insertedMessage.created_at,
      reactions: insertedMessage.reactions || {},
      sender: {
        id: profileData.id,
        name: profileData.name,
        avatar: profileData.avatar_url
      }
    };
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message");
    return null;
  }
};

export const addMessageReaction = async (
  messageId: string, 
  reaction: string
): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("You must be logged in to react to messages");
      return false;
    }

    const { data: message, error: fetchError } = await supabase
      .from("group_messages")
      .select("reactions")
      .eq("id", messageId)
      .single();

    if (fetchError) throw fetchError;

    let updatedReactions = { ...message?.reactions } || {};
    if (!updatedReactions[reaction]) {
      updatedReactions[reaction] = [];
    }
    
    if (!updatedReactions[reaction].includes(user.user.id)) {
      updatedReactions[reaction] = [...updatedReactions[reaction], user.user.id];
    } else {
      updatedReactions[reaction] = updatedReactions[reaction].filter(id => id !== user.user.id);
      if (updatedReactions[reaction].length === 0) {
        delete updatedReactions[reaction];
      }
    }

    const { error: updateError } = await supabase
      .from("group_messages")
      .update({ reactions: updatedReactions })
      .eq("id", messageId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error("Error adding reaction:", error);
    toast.error("Failed to add reaction");
    return false;
  }
};
