
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, KeyboardEvent, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  isTyping: boolean;
  subject: string;
  educationLevel: string;
}

export const ChatInputForm = ({
  input,
  setInput,
  handleSendMessage,
  handleKeyDown,
  isTyping,
  subject,
  educationLevel
}: ChatInputFormProps) => {
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);
  
  // Reset focus state on small screens when input is empty
  useEffect(() => {
    if (isMobile && input === '') {
      setIsFocused(false);
    }
  }, [input, isMobile]);

  // Character limit for messages
  const MAX_CHARS = 1000;
  const charCount = input.length;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isAtLimit = charCount >= MAX_CHARS;

  const handleInputChange = (value: string) => {
    if (value.length <= MAX_CHARS) {
      setInput(value);
    } else {
      setInput(value.slice(0, MAX_CHARS));
      toast.warning("Message is too long. Please shorten your message.");
    }
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={(e) => {
          if (isAtLimit) {
            e.preventDefault();
            toast.error("Your message is too long. Please shorten it before sending.");
            return;
          }
          handleSendMessage(e);
        }} 
        className="flex space-x-2"
        aria-label="Chat input form"
      >
        <Textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => isMobile && input === '' ? setIsFocused(false) : null}
          placeholder={`Ask your ${subject !== 'general' ? subject : ''} question${educationLevel !== 'secondary' ? ' (' + educationLevel + ' level)' : ''}...`}
          className={`min-h-[50px] flex-1 resize-none transition-all ${isFocused || input ? 'h-24' : 'h-12'}`}
          aria-label="Message input"
          disabled={isTyping}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isTyping || isAtLimit || !input.trim()} 
          aria-label="Send message"
          className="transition-all"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
      
      {isNearLimit && (
        <div 
          className={`text-xs mt-1 text-right ${isAtLimit ? 'text-destructive' : 'text-muted-foreground'}`}
          aria-live="polite"
        >
          {charCount}/{MAX_CHARS} characters
        </div>
      )}
    </div>
  );
};
