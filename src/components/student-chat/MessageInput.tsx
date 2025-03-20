
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping: () => void;
}

export const MessageInput = ({ onSendMessage, onTyping }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    onTyping();
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set a new timeout
    const timeout = setTimeout(() => {
      // Typing stopped
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (e.target.value.trim()) {
            handleTyping();
          }
        }}
        placeholder="Type your message..."
        className="resize-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button onClick={handleSend} size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
