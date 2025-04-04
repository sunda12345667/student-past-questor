
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  getGroupMessages,
  sendGroupMessage
} from '@/services/chat';
import { Message } from './types';

export const useMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Transform ChatMessage to Message format
  const transformMessage = (chatMessage: any): Message => {
    return {
      id: chatMessage.id,
      senderId: chatMessage.user_id,
      senderName: chatMessage.sender?.name || 'Unknown User',
      content: chatMessage.content,
      timestamp: new Date(chatMessage.created_at),
      reactions: chatMessage.reactions || {}
    };
  };
  
  // Load messages for a specific group
  const loadMessages = async (groupId: string) => {
    try {
      const chatMessages = await getGroupMessages(groupId);
      
      // Transform to Message format
      const transformedMessages: Message[] = chatMessages.map(transformMessage);
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };
  
  // Send a message to the active room
  const handleSendMessage = async (activeRoom: string | null, content: string) => {
    if (!activeRoom || !userId) return;
    
    try {
      const newMessage = await sendGroupMessage(activeRoom, content);
      if (newMessage) {
        setMessages((prev) => [
          ...prev,
          transformMessage(newMessage)
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Add a new message to the list
  const addMessage = (newMessage: any) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      transformMessage(newMessage)
    ]);
  };

  return {
    messages,
    loadMessages,
    handleSendMessage,
    addMessage,
    transformMessage
  };
};
