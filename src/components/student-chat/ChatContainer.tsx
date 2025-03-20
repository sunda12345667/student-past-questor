
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessageList } from './ChatMessageList';
import { MessageInput } from './MessageInput';
import { ChatRoomPlaceholder } from './ChatRoomPlaceholder';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface ChatContainerProps {
  activeRoom: string | null;
  roomName: string | null;
  messages: Message[];
  currentUserId?: string;
  onSendMessage: (content: string) => void;
  formatTime: (date: Date) => string;
  typingUsers?: string[];
  onTyping: () => void;
}

export const ChatContainer = ({
  activeRoom,
  roomName,
  messages,
  currentUserId,
  onSendMessage,
  formatTime,
  typingUsers = [],
  onTyping
}: ChatContainerProps) => {
  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle>
          {roomName || "Select a chat room"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        {activeRoom ? (
          <>
            <ChatMessageList
              messages={messages}
              currentUserId={currentUserId}
              formatTime={formatTime}
            />
            {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
            <MessageInput 
              onSendMessage={onSendMessage}
              onTyping={onTyping}
            />
          </>
        ) : (
          <ChatRoomPlaceholder />
        )}
      </CardContent>
    </Card>
  );
};
