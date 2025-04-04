
import React from 'react';
import { MessageCircle, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface TypingIndicatorProps {
  users: User[];
}

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (!users.length) return null;

  let message: string;
  if (users.length === 1) {
    message = `${users[0].name} is typing...`;
  } else if (users.length === 2) {
    message = `${users[0].name} and ${users[1].name} are typing...`;
  } else if (users.length === 3) {
    message = `${users[0].name}, ${users[1].name} and ${users[2].name} are typing...`;
  } else {
    message = `${users.length} people are typing...`;
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg mb-2 transition-all">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {users.length > 3 && (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground border-2 border-background">
            +{users.length - 3}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{message}</span>
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_0s_infinite]"></span>
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_0.2s_infinite]"></span>
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-[pulse_1.5s_ease-in-out_0.4s_infinite]"></span>
        </div>
      </div>
    </div>
  );
};
