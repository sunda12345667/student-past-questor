
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageReactions } from './MessageReactions';
import { cn } from '@/lib/utils';

interface MessageProps {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  formatTime: (date: Date) => string;
  reactions?: Record<string, string[]>;
  onReactionToggle?: (messageId: string, emoji: string) => void;
}

export const ChatMessage = ({
  id,
  senderId,
  senderName,
  content,
  timestamp,
  isCurrentUser,
  formatTime,
  reactions = {},
  onReactionToggle
}: MessageProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isCurrentUser
            ? "bg-primary text-primary-foreground ml-auto rounded-br-none"
            : "bg-secondary rounded-bl-none"
        )}
      >
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{senderName}</span>
          </div>
        )}
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <div
          className={cn(
            "text-xs mt-1 text-right",
            isCurrentUser
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          )}
        >
          {formatTime(timestamp)}
        </div>
        
        {onReactionToggle && (
          <MessageReactions
            reactions={reactions}
            currentUserId={senderId}
            onReactionToggle={(emoji) => onReactionToggle(id, emoji)}
          />
        )}
      </div>
    </div>
  );
};
