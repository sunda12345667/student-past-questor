
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface TypingIndicatorProps {
  users: string[];
}

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (!users.length) return null;

  let message: string;
  if (users.length === 1) {
    message = `${users[0]} is typing...`;
  } else if (users.length === 2) {
    message = `${users[0]} and ${users[1]} are typing...`;
  } else if (users.length === 3) {
    message = `${users[0]}, ${users[1]} and ${users[2]} are typing...`;
  } else {
    message = `${users.length} people are typing...`;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 animate-pulse">
      <MessageCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
