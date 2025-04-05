
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageReactions } from "./types";

// Extract message reactions from JSON format
export const fetchMessageReactions = (reactionsData: any): MessageReactions => {
  const reactionsObj: MessageReactions = {};
  
  if (reactionsData && typeof reactionsData === 'object') {
    Object.entries(reactionsData as Record<string, string[]>).forEach(([emoji, userIds]) => {
      if (Array.isArray(userIds)) {
        reactionsObj[emoji] = userIds;
      }
    });
  }
  
  return reactionsObj;
};

// Update a message reaction (add or remove)
export const updateMessageReaction = async (
  messageId: string,
  userId: string,
  reaction: string
): Promise<boolean> => {
  try {
    const { data: message, error: fetchError } = await supabase
      .from("group_messages")
      .select("reactions")
      .eq("id", messageId)
      .single();

    if (fetchError) throw fetchError;

    // Convert database JSON to our MessageReactions type
    let updatedReactions: MessageReactions = {};
    if (message?.reactions && typeof message.reactions === 'object') {
      Object.entries(message.reactions as Record<string, string[]>).forEach(([emoji, userIds]) => {
        if (Array.isArray(userIds)) {
          updatedReactions[emoji] = userIds;
        }
      });
    }
    
    // Add or remove the reaction
    if (!updatedReactions[reaction]) {
      updatedReactions[reaction] = [];
    }
    
    if (!updatedReactions[reaction].includes(userId)) {
      updatedReactions[reaction] = [...updatedReactions[reaction], userId];
    } else {
      updatedReactions[reaction] = updatedReactions[reaction].filter(id => id !== userId);
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
    console.error("Error updating reaction:", error);
    toast.error("Failed to update reaction");
    return false;
  }
};
