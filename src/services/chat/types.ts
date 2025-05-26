
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

// Additional types needed by components
export interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  group_id: string;
  created_at: string;
  reactions?: Record<string, string[]>;
  attachments?: MessageAttachment[];
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
  owner_id: string;
  created_at: string;
  members: number;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  is_admin: boolean;
  joined_at: string;
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface MessageAttachment {
  id: string;
  filename: string;
  url: string;
  fileType: 'image' | 'document';
  size: number;
}
