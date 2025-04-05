
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, File, Image } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface MessageInputProps {
  onSendMessage: () => void;
  messageInput: string;
  setMessageInput: (value: string) => void;
  onTyping: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  messageInput,
  setMessageInput,
  onTyping
}) => {
  return (
    <div className="p-3 border-t">
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Type your message..." 
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <File className="h-4 w-4 mr-2" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Image className="h-4 w-4 mr-2" />
              Photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={onSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
