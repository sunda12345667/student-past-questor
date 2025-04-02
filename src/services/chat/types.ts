
// Shared types for chat functionality
export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  members: number;
  unread?: number;
}

export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}
