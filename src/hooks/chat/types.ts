
import { ChatGroup } from '@/services/chat';

// Interface for the transformed message format
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  reactions?: Record<string, string[]>;
}

// Interface for typing users
export interface TypingUser {
  id: string;
  name: string;
  avatar?: string;
  isTyping: boolean;
}

// Interface for chat rooms
export interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

export interface UseChatResult {
  activeRoom: string | null;
  activeRoomName: string | null;
  messages: Message[];
  userGroups: ChatRoom[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  handleJoinRoom: (roomId: string, roomName: string) => void;
  handleSendMessage: (content: string) => Promise<void>;
  handleTypingIndicator: () => void;
}
