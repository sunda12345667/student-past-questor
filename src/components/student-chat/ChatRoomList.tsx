
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <Card className="h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat Rooms</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : chatRooms.length > 0 ? (
          <div className="space-y-2">
            {chatRooms.map(room => (
              <ChatRoomItem
                key={room.id}
                name={room.name}
                participants={room.participants}
                isActive={room.id === activeRoom}
                onSelect={() => onJoinRoom(room.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No chat rooms available</p>
            <p className="text-sm mt-2">
              Join a study group to start chatting
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
