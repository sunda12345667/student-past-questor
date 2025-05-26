import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToGroupMessages, sendGroupMessage, subscribeToTypingIndicators } from '@/services/chat';
import { ChatMessage, MessageAttachment } from '@/services/chat/types';
import { supabase } from '@/integrations/supabase/client';
import { MessageReactions } from '@/components/chat/MessageReactions';
import { AttachmentPreview } from './chat/AttachmentPreview';
import { FileInput } from '@/components/ui/file-input';

interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const GroupChat: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [activeGroup, setActiveGroup] = useState(groupId);
  const [attachment, setAttachment] = useState<MessageAttachment | null>(null);
  const { currentUser } = useAuth();
  let messageSubscription: any = null;
  const [file, setFile] = useState<File | null>(null);

  // Transform message to ChatMessage format for consistency
  const transformMessage = useCallback((message: any): ChatMessage => {
    return {
      id: message.id,
      content: message.content,
      user_id: message.sender_id || message.user_id,
      sender_id: message.sender_id || message.user_id,
      group_id: message.group_id,
      created_at: message.created_at,
      reactions: message.reactions || {},
      attachments: message.attachments || [],
      sender: message.sender
    };
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('group_messages')
        .select(`
          id,
          content,
          created_at,
          group_id,
          sender_id,
          reactions,
          attachments,
          sender:profiles (
            id,
            name
          )
        `)
        .eq('group_id', activeGroup)
        .order('created_at', { ascending: true });

      if (data) {
        const transformedMessages = data.map(transformMessage);
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  }, [activeGroup, transformMessage]);

  useEffect(() => {
    if (activeGroup) {
      loadMessages();

      // Subscribe to new messages
      messageSubscription = subscribeToGroupMessages(
        activeGroup,
        (newMessage) => {
          const transformedMessage = transformMessage(newMessage);
          setMessages((prevMessages) => [
            ...prevMessages,
            transformedMessage
          ]);
        }
      );

      // Subscribe to typing indicators
      const typingSubscription = subscribeToTypingIndicators(
        activeGroup,
        (typingUsersList) => {
          const filteredTypingUsers = typingUsersList.filter(
            user => user.id !== currentUser?.id
          );
          setTypingUsers(filteredTypingUsers);
        }
      );

      return () => {
        supabase.removeChannel(messageSubscription);
        supabase.removeChannel(typingSubscription);
      };
    }
  }, [activeGroup, currentUser, loadMessages, transformMessage]);

  const handleSendMessage = async (content: string) => {
    if (!activeGroup || !currentUser) return;
    
    try {
      await supabase
        .from('group_messages')
        .insert({
          group_id: activeGroup,
          content,
          sender_id: currentUser.id
        });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleReactionToggle = async (messageId: string, emoji: string) => {
    if (!currentUser) return;
    
    try {
      console.log('Reaction toggle:', messageId, emoji);
    } catch (error) {
      console.error('Error toggling reaction:', error);
      toast.error('Could not update reaction');
    }
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const handleRemoveAttachment = () => {
    setFile(null);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Group Chat</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow">
        <ul className="list-none p-0">
          {messages.map((message) => (
            <li key={message.id} className="mb-4">
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={message.sender?.name || "User"} />
                  <AvatarFallback>{message.sender?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{message.sender?.name}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(message.created_at)}</div>
                  <p className="mt-1">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                      {message.attachments.map((attachment) => (
                        <AttachmentPreview 
                          key={attachment.id}
                          attachment={attachment}
                          isInMessage={true}
                        />
                      ))}
                    </div>
                  )}
                  <MessageReactions
                    reactions={message.reactions || {}}
                    onReactionToggle={(emoji) => handleReactionToggle(message.id, emoji)}
                    currentUserId={currentUser?.id}
                  />
                </div>
              </div>
            </li>
          ))}
          {typingUsers.length > 0 && (
            <li className="mb-4">
              <div className="flex items-center space-x-2">
                {typingUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm italic">{user.name} is typing...</span>
                  </div>
                ))}
              </div>
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        {file && (
          <AttachmentPreview 
            attachment={{
              id: 'temp',
              filename: file.name,
              url: URL.createObjectURL(file),
              fileType: file.type.startsWith('image/') ? 'image' : 'document',
              size: file.size
            }}
            onRemove={handleRemoveAttachment}
          />
        )}
        <div className="flex space-x-2 w-full">
          <Input
            type="text"
            placeholder="Enter your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim()) {
                  handleSendMessage(newMessage);
                  setNewMessage('');
                }
              }
            }}
          />
          <Button onClick={() => {
            if (newMessage.trim()) {
              handleSendMessage(newMessage);
              setNewMessage('');
            }
          }}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GroupChat;
