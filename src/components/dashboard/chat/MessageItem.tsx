
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage } from '@/services/chat';
import { AttachmentPreview } from './AttachmentPreview';

interface MessageItemProps {
  message: ChatMessage;
  currentUserId: string | undefined;
  formatTimestamp: (timestamp: string) => string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  formatTimestamp
}) => {
  const isCurrentUser = message.user_id === currentUserId;
  const hasAttachments = message.attachments && message.attachments.length > 0;
  
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatar} alt={message.sender?.name} />
          <AvatarFallback>
            {message.sender?.name?.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%]`}>
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground mb-1">
            {message.sender?.name}
          </p>
        )}
        
        <Card className={`${
          isCurrentUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
        }`}>
          <CardContent className="p-3 text-sm">
            {message.content && <p className="mb-2">{message.content}</p>}
            
            {hasAttachments && (
              <div className="space-y-2">
                {message.attachments?.map(attachment => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                    isInMessage={true}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className={`text-xs text-muted-foreground mt-1 ${
          isCurrentUser ? 'text-right' : 'text-left'
        }`}>
          {formatTimestamp(message.created_at)}
        </p>
      </div>
      
      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender?.avatar} alt={message.sender?.name} />
          <AvatarFallback>
            {message.sender?.name?.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;
