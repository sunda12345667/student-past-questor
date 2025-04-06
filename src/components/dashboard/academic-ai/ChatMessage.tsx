
import { Bot, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

export type Message = {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export const ChatMessage = ({ message, isLoading = false }: ChatMessageProps) => {
  const isMobile = useIsMobile();
  const isBot = message.sender === 'bot';
  
  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-slide-in-bottom`}
    >
      <div
        className={`flex items-start space-x-2 ${isMobile ? 'max-w-[95%]' : 'max-w-[80%]'} ${
          !isBot ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div
          className={`rounded-full p-2 ${
            isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'
          }`}
          aria-hidden="true"
        >
          {isBot ? (
            <Bot className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <div
          className={`rounded-lg p-3 ${
            isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'
          }`}
          role={isBot ? "status" : "none"}
        >
          {isLoading ? (
            <Skeleton className="w-[200px] h-[60px]" />
          ) : (
            <>
              <p className="whitespace-pre-line">{message.content}</p>
              <p 
                className="text-xs opacity-70 mt-1" 
                aria-label={`Message sent at ${message.timestamp.toLocaleTimeString()}`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
