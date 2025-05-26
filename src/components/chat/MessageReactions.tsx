
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageReaction } from '@/services/chat/types';

interface MessageReactionsProps {
  reactions: Record<string, string[]>;
  onReactionToggle: (emoji: string) => void;
  currentUserId?: string;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  onReactionToggle,
  currentUserId
}) => {
  if (!reactions || Object.keys(reactions).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(reactions).map(([emoji, users]) => {
        if (!Array.isArray(users) || users.length === 0) return null;
        
        const hasReacted = currentUserId ? users.includes(currentUserId) : false;
        
        return (
          <Button
            key={emoji}
            variant={hasReacted ? "default" : "outline"}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => onReactionToggle(emoji)}
          >
            <span className="mr-1">{emoji}</span>
            <Badge variant="secondary" className="h-4 px-1 text-xs">
              {users.length}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
};
