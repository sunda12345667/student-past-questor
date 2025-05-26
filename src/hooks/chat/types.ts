
export interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
  owner_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  group_id: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface UseChatResult {
  activeRoom: string | null;
  activeRoomName: string | null;
  messages: Message[];
  userGroups: ChatGroup[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  handleJoinRoom: (roomId: string, roomName: string) => void;
  handleSendMessage: (content: string) => Promise<void>;
  handleTypingIndicator: () => void;
}
