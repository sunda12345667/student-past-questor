
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MessageReactionButtonProps {
  emoji: string;
  count: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const MessageReactionButton: React.FC<MessageReactionButtonProps> = ({
  emoji,
  count,
  isSelected,
  onToggle
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 py-0 px-2 transition-all rounded-full",
              isSelected 
                ? "bg-primary/10 border-primary/30 scale-105" 
                : "bg-secondary/50 hover:bg-secondary"
            )}
            onClick={onToggle}
          >
            <span className="mr-1 text-base">{emoji}</span>
            <span className="text-xs font-medium">{count}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-2">
          {count > 0 ? (
            `${count} ${count === 1 ? 'person' : 'people'} reacted with ${emoji}`
          ) : (
            `React with ${emoji}`
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
