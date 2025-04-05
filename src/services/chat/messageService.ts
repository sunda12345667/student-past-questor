
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatMessage, MessageAttachment } from "./types";
import { joinGroupIfNotMember } from "./membershipService";
import { fetchMessageReactions, updateMessageReaction } from "./reactionService";
import { fetchMessageSenders } from "./userService";
import { uploadAttachment } from "./attachmentService";

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
        reactions,
        attachments
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (messageError) throw messageError;
    
    if (!messages || messages.length === 0) {
      return [];
    }
    
    // Get all unique sender IDs to fetch their profiles
    const senderIds = [...new Set(messages.map(msg => msg.sender_id))];
    
    // Fetch profiles for all senders in one query
    const profiles = await fetchMessageSenders(senderIds);

    // Transform the messages with sender information
    return messages.map(message => {
      const sender = profiles?.find(p => p.id === message.sender_id);
      
      // Process message reactions
      const reactionsObj = fetchMessageReactions(message.reactions);
      
      return {
        id: message.id,
        group_id: message.group_id,
        user_id: message.sender_id,
        content: message.content,
        created_at: message.created_at,
        reactions: reactionsObj,
        attachments: message.attachments || [],
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
  content: string,
  attachmentFiles?: File[]
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

    // Upload attachments if any
    let attachments: MessageAttachment[] = [];
    if (attachmentFiles && attachmentFiles.length > 0) {
      const uploadPromises = attachmentFiles.map(file => 
        uploadAttachment(file, groupId)
      );
      
      const results = await Promise.all(uploadPromises);
      attachments = results.filter(Boolean) as MessageAttachment[];
      
      if (attachments.length < attachmentFiles.length) {
        toast.warning("Some attachments failed to upload");
      }
    }

    // Send message with any successfully uploaded attachments
    const { data: insertedMessage, error: insertError } = await supabase
      .from("group_messages")
      .insert({
        group_id: groupId,
        sender_id: user.user.id,
        content,
        reactions: {},
        attachments: attachments.length > 0 ? attachments : null
      })
      .select(`id, group_id, sender_id, content, created_at, reactions, attachments`)
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
      reactions: {},
      attachments: insertedMessage.attachments || [],
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

    return await updateMessageReaction(messageId, user.user.id, reaction);
  } catch (error) {
    console.error("Error adding reaction:", error);
    toast.error("Failed to add reaction");
    return false;
  }
};
