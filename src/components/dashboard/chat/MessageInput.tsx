import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, File, Image } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Attachment } from '@/services/chat/attachmentService';
import { AttachmentPreview } from './AttachmentPreview';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
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
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (messageInput.trim() || attachments.length > 0) {
      onSendMessage(messageInput, attachments);
      setMessageInput('');
      setAttachments([]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file) {
      const newAttachment: Attachment = {
        id: Math.random().toString(36),
        filename: file.name,
        url: URL.createObjectURL(file),
        fileType: file.type.startsWith('image/') ? 'image' : 'document',
        size: file.size
      };
      
      setAttachments(prev => [...prev, newAttachment]);
    }
  };

  const handleDocumentButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  return (
    <div className="p-3 border-t">
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map(attachment => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={() => handleRemoveAttachment(attachment.id)}
            />
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Type your message..." 
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            onTyping();
          }}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDocumentButtonClick}>
              <File className="h-4 w-4 mr-2" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImageButtonClick}>
              <Image className="h-4 w-4 mr-2" />
              Photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileInputChange}
      />
      
      <input
        type="file"
        ref={imageInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default MessageInput;
