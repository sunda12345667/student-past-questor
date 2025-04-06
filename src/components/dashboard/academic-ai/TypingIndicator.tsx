
import { Bot } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const TypingIndicator = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-start animate-fade-in">
      <div className={`flex items-start space-x-2 ${isMobile ? 'max-w-[95%]' : 'max-w-[80%]'}`}>
        <div className="rounded-full p-2 bg-muted" aria-hidden="true">
          <Bot className="h-4 w-4" />
        </div>
        <div className="rounded-lg p-3 bg-muted" role="status" aria-label="AI is typing">
          <p className="typing-indicator flex gap-1">
            <span className="dot w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></span>
            <span className="dot w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-150"></span>
            <span className="dot w-2 h-2 rounded-full bg-foreground/70 animate-pulse delay-300"></span>
          </p>
        </div>
      </div>
    </div>
  );
};
