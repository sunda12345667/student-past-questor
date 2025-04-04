
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatRoomItemProps {
  name: string;
  participants: number;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatRoomItem = ({
  name,
  participants,
  isActive,
  onSelect
}: ChatRoomItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start h-auto py-3 px-4",
        isActive && "bg-secondary"
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center w-full">
        <span className="font-medium truncate">{name}</span>
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{participants}</span>
        </div>
      </div>
    </Button>
  );
};
