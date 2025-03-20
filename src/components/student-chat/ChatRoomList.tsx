
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { ChatRoomItem } from './ChatRoomItem';

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  activeRoom: string | null;
  onJoinRoom: (roomId: string) => void;
}

export const ChatRoomList = ({
  chatRooms,
  activeRoom,
  onJoinRoom
}: ChatRoomListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={20} />
          Chat Rooms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-2">
            {chatRooms.map(room => (
              <ChatRoomItem
                key={room.id}
                id={room.id}
                name={room.name}
                participants={room.participants}
                isActive={activeRoom === room.id}
                onJoin={onJoinRoom}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
