
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageInput } from './types';

export const sendMessage = async (messageInput: MessageInput): Promise<Message | null> => {
  try {
    const { data: message, error } = await supabase
      .from('group_messages')
      .insert({
        group_id: messageInput.groupId,
        content: messageInput.content,
        sender_id: messageInput.senderId,
        attachment_url: messageInput.attachmentUrl,
        attachment_type: messageInput.attachmentType,
      })
      .select(`
        id,
        content,
        created_at,
        attachment_url,
        attachment_type,
        sender_id,
        group_id,
        profiles:sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }

    if (!message) {
      throw new Error('No message data returned');
    }

    // Transform the response to match our Message interface
    return {
      id: message.id,
      content: message.content,
      created_at: message.created_at,
      attachment_url: message.attachment_url,
      attachment_type: message.attachment_type,
      sender_id: message.sender_id,
      group_id: message.group_id,
      sender: {
        id: message.sender_id,
        name: (message.profiles as any)?.name || 'Unknown User',
        avatar_url: (message.profiles as any)?.avatar_url || null
      }
    };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
};

export const getGroupMessages = async (groupId: string): Promise<Message[]> => {
  try {
    const { data: messages, error } = await supabase
      .from('group_messages')
      .select(`
        id,
        content,
        created_at,
        attachment_url,
        attachment_type,
        sender_id,
        group_id,
        profiles:sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    if (!messages) {
      return [];
    }

    // Transform the response to match our Message interface
    return messages.map(message => ({
      id: message.id,
      content: message.content,
      created_at: message.created_at,
      attachment_url: message.attachment_url,
      attachment_type: message.attachment_type,
      sender_id: message.sender_id,
      group_id: message.group_id,
      sender: {
        id: message.sender_id,
        name: (message.profiles as any)?.name || 'Unknown User',
        avatar_url: (message.profiles as any)?.avatar_url || null
      }
    }));
  } catch (error) {
    console.error('Error in getGroupMessages:', error);
    throw error;
  }
};

export const uploadAttachment = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload attachment: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const editMessage = async (messageId: string, newContent: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('group_messages')
      .update({ content: newContent })
      .eq('id', messageId);

    if (error) {
      throw new Error(`Failed to edit message: ${error.message}`);
    }
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
};

// Enhanced message sending with better error handling and validation
export const sendMessageWithValidation = async (messageInput: MessageInput): Promise<Message> => {
  // Validate input
  if (!messageInput.content?.trim() && !messageInput.attachmentUrl) {
    throw new Error('Message content or attachment is required');
  }

  if (!messageInput.groupId) {
    throw new Error('Group ID is required');
  }

  if (!messageInput.senderId) {
    throw new Error('Sender ID is required');
  }

  try {
    const { data: insertedMessage, error } = await supabase
      .from('group_messages')
      .insert({
        group_id: messageInput.groupId,
        content: messageInput.content || '',
        sender_id: messageInput.senderId,
        attachment_url: messageInput.attachmentUrl,
        attachment_type: messageInput.attachmentType,
      })
      .select(`
        id,
        content,
        created_at,
        attachment_url,
        attachment_type,
        sender_id,
        group_id,
        profiles:sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Database error sending message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }

    if (!insertedMessage) {
      throw new Error('No message data returned from database');
    }

    // Transform and return the message
    return {
      id: insertedMessage.id,
      content: insertedMessage.content,
      created_at: insertedMessage.created_at,
      attachment_url: insertedMessage.attachment_url,
      attachment_type: insertedMessage.attachment_type,
      sender_id: insertedMessage.sender_id,
      group_id: insertedMessage.group_id,
      sender: {
        id: insertedMessage.sender_id,
        name: (insertedMessage.profiles as any)?.name || 'Unknown User',
        avatar_url: (insertedMessage.profiles as any)?.avatar_url || null
      }
    };
  } catch (error) {
    console.error('Error in sendMessageWithValidation:', error);
    throw error;
  }
};
