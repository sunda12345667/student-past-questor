
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface ChatRoomItemProps {
  id: string;
  name: string;
  participants: number;
  isActive: boolean;
  onJoin: (roomId: string) => void;
}

export const ChatRoomItem = ({
  id,
  name,
  participants,
  isActive,
  onJoin
}: ChatRoomItemProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className="w-full justify-start"
      onClick={() => onJoin(id)}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      <div className="flex flex-col items-start text-left">
        <span>{name}</span>
        <span className="text-xs text-muted-foreground">{participants} students</span>
      </div>
    </Button>
  );
};
