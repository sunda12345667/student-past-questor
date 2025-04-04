
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  reactions?: Record<string, string[]>;
}

interface ChatMessageListProps {
  messages: Message[];
  currentUserId?: string;
  formatTime: (date: Date) => string;
  onReactionToggle?: (messageId: string, emoji: string) => void;
}

export const ChatMessageList = ({
  messages,
  currentUserId = 'unknown',
  formatTime,
  onReactionToggle
}: ChatMessageListProps) => {
  return (
    <ScrollArea className="flex-grow mb-4">
      <div className="space-y-4 p-1">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            id={msg.id}
            senderId={msg.senderId}
            senderName={msg.senderName}
            content={msg.content}
            timestamp={msg.timestamp}
            isCurrentUser={msg.senderId === currentUserId}
            formatTime={formatTime}
            reactions={msg.reactions}
            onReactionToggle={onReactionToggle}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
