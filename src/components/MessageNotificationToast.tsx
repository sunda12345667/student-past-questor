
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface MessageNotificationToastProps {
  senderName: string;
  senderAvatar?: string;
  message: string;
  groupName: string;
  onViewMessage: () => void;
}

export const MessageNotificationToast: React.FC<MessageNotificationToastProps> = ({
  senderName,
  senderAvatar,
  message,
  groupName,
  onViewMessage
}) => {
  return (
    <div className="flex items-start gap-3 p-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={senderAvatar} alt={senderName} />
        <AvatarFallback>
          {senderName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">{senderName}</span>
          <span className="text-xs text-muted-foreground">in {groupName}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {message}
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewMessage}
          className="mt-2"
        >
          View Message
        </Button>
      </div>
    </div>
  );
};
