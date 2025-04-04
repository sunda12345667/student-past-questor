
import React, { useState } from 'react';
import { MessageReactionButton } from './MessageReactionButton';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MessageReactionsProps {
  reactions: Record<string, string[]>;
  currentUserId: string;
  onReactionToggle: (emoji: string) => void;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({ 
  reactions, 
  currentUserId,
  onReactionToggle
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Skip rendering if no reactions and not showing picker
  if (!reactions || (Object.keys(reactions).length === 0 && !showEmojiPicker)) {
    return (
      <div className="flex mt-1 transition-opacity opacity-0 group-hover:opacity-100">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full"
          onClick={() => setShowEmojiPicker(true)}
        >
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5">
      {Object.entries(reactions).map(([emoji, userIds]) => {
        if (userIds.length === 0) return null;
        
        const isSelected = userIds.includes(currentUserId);
        
        return (
          <MessageReactionButton
            key={emoji}
            emoji={emoji}
            count={userIds.length}
            isSelected={isSelected}
            onToggle={() => onReactionToggle(emoji)}
          />
        );
      })}
      
      {showEmojiPicker ? (
        <EmojiPicker 
          onEmojiSelect={(emoji) => {
            onReactionToggle(emoji);
            setShowEmojiPicker(false);
          }} 
          onClose={() => setShowEmojiPicker(false)}
        />
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 rounded-full ml-1 opacity-70 hover:opacity-100"
          onClick={() => setShowEmojiPicker(true)}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
