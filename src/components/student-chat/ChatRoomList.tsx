
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { ChatRoomItem } from './ChatRoomItem';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  activeRoom: string | null;
  onJoinRoom: (roomId: string) => void;
  isLoading?: boolean;
}

export const ChatRoomList = ({
  chatRooms,
  activeRoom,
  onJoinRoom,
  isLoading = false
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
            {isLoading ? (
              <>
                {Array(4).fill(0).map((_, index) => (
                  <Skeleton key={index} className="h-[60px] w-full" />
                ))}
              </>
            ) : chatRooms.length > 0 ? (
              chatRooms.map(room => (
                <ChatRoomItem
                  key={room.id}
                  id={room.id}
                  name={room.name}
                  participants={room.participants}
                  isActive={activeRoom === room.id}
                  onJoin={onJoinRoom}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">No chat rooms available</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
