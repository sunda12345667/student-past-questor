
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageReactions as MessageReactionsType } from '@/services/chat/types';

interface MessageReactionsProps {
  reactions: MessageReactionsType;
  currentUserId: string;
  onReactionClick: (reaction: string) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({ 
  reactions, 
  currentUserId,
  onReactionClick
}) => {
  // Skip rendering if no reactions
  if (!reactions || Object.keys(reactions).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(reactions).map(([emoji, userIds]) => {
        if (userIds.length === 0) return null;
        
        const isSelected = userIds.includes(currentUserId);
        
        return (
          <TooltipProvider key={emoji}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-6 py-0 px-1.5 ${isSelected ? 'bg-primary/10' : ''}`}
                  onClick={() => onReactionClick(emoji)}
                >
                  <span className="mr-1">{emoji}</span>
                  <span className="text-xs">{userIds.length}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="p-2">
                {userIds.length > 3 ? 
                  `${userIds.length} people reacted with ${emoji}` : 
                  `${userIds.length} ${userIds.length === 1 ? 'person' : 'people'} reacted with ${emoji}`
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
