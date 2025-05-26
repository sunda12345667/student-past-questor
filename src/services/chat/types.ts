
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  group_id: string;
  created_at: string;
  attachment_url?: string;
  attachment_type?: string;
  sender?: {
    name: string;
    avatar_url?: string;
  };
}

export interface MessageInput {
  content: string;
  group_id: string;
  attachment_url?: string;
  attachment_type?: string;
}

export interface TypingIndicator {
  user_id: string;
  group_id: string;
  is_typing: boolean;
  timestamp: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}
