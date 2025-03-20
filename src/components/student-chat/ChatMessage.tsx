
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageProps {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  formatTime: (date: Date) => string;
}

export const ChatMessage = ({
  senderId,
  senderName,
  content,
  timestamp,
  isCurrentUser,
  formatTime
}: MessageProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-secondary'
        }`}
      >
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{senderName}</span>
          </div>
        )}
        <p>{content}</p>
        <div
          className={`text-xs mt-1 text-right ${
            isCurrentUser
              ? 'text-primary-foreground/80'
              : 'text-muted-foreground'
          }`}
        >
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};
