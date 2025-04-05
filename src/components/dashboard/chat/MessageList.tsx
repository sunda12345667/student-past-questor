
import React, { useRef, useEffect } from 'react';
import { Users } from 'lucide-react';
import MessageItem from './MessageItem';
import { ChatMessage } from '@/services/chat';
import { TypingUser } from '@/hooks/chat';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string | undefined;
  formatTimestamp: (timestamp: string) => string;
  typingUsers: TypingUser[];
  getTypingIndicator: () => string | null;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  formatTimestamp,
  typingUsers,
  getTypingIndicator
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
        <Users className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium">No messages yet</h3>
        <p>Be the first to start the conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id}
          message={message}
          currentUserId={currentUserId}
          formatTimestamp={formatTimestamp}
        />
      ))}
      {typingUsers.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground animate-pulse">
          <div className="flex items-center space-x-1 ml-2">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-75"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-150"></div>
          </div>
          <span className="ml-2">{getTypingIndicator()}</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
