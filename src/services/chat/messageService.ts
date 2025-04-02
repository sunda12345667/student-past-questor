
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatMessage } from "./types";

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
        sender:profiles(id, name, avatar_url)
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
      sender: message.sender ? {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar_url
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

    // First insert the message
    const { data: insertedMessage, error: insertError } = await supabase
      .from("group_messages")
      .insert({
        group_id: groupId,
        sender_id: user.user.id,
        content
      })
      .select(`id, group_id, sender_id, content, created_at`)
      .single();

    if (insertError) throw insertError;

    // Then fetch the sender profile details
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
