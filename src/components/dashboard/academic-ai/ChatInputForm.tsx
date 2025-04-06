
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, KeyboardEvent } from 'react';

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
  return (
    <form onSubmit={handleSendMessage} className="flex space-x-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Ask your ${subject !== 'general' ? subject : ''} question${educationLevel !== 'secondary' ? ' (' + educationLevel + ' level)' : ''}...`}
        className="min-h-[50px] flex-1 resize-none"
      />
      <Button type="submit" size="icon" disabled={isTyping}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
