
// Basic group interface
export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  owner_id: string;  // Change from created_by to owner_id to match the database schema
  is_private: boolean;
  members: number;
  unread?: number;
}

// Interface for message reactions
export interface MessageReactions {
  [emoji: string]: string[]; // Map of emoji to array of user IDs who reacted with that emoji
}

// Attachment interface
export interface MessageAttachment {
  id: string;
  url: string;
  filename: string;
  fileType: "image" | "document" | "other";
  size: number;
  thumbnailUrl?: string;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  reactions?: MessageReactions;
  attachments?: MessageAttachment[];
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// Group member interface
export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at?: string;
  is_admin: boolean;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}
