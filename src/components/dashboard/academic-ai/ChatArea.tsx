
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage, Message } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputForm } from './ChatInputForm';
import { FormEvent, KeyboardEvent } from 'react';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  subject: string;
  educationLevel: string;
}

export const ChatArea = ({
  messages,
  isTyping,
  input,
  setInput,
  handleSendMessage,
  handleKeyDown,
  subject,
  educationLevel
}: ChatAreaProps) => {
  return (
    <Card className="flex-1 flex flex-col h-[500px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>
      
      <CardContent className="p-4 border-t">
        <ChatInputForm 
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          isTyping={isTyping}
          subject={subject}
          educationLevel={educationLevel}
        />
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Press Enter to send, Shift+Enter for a new line</p>
          <p className="mt-1 italic">Currently answering {subject} questions at {educationLevel} level</p>
        </div>
      </CardContent>
    </Card>
  );
};
