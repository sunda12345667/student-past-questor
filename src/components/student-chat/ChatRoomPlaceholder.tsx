
import React from 'react';
import { MessageCircle } from 'lucide-react';

export const ChatRoomPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium">Select a chat room to start</h3>
        <p className="text-muted-foreground">
          Join a study group and connect with other students
        </p>
      </div>
    </div>
  );
};
