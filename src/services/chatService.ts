
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: number;
  description: string;
}

// Sample chat rooms
const chatRooms: ChatRoom[] = [
  { id: 'waec', name: 'WAEC Preparation', participants: 24, description: 'Discuss WAEC exam questions and study strategies' },
  { id: 'jamb', name: 'JAMB Study Group', participants: 38, description: 'JAMB preparation and practice questions' },
  { id: 'neco', name: 'NECO Discussion', participants: 17, description: 'Ask questions about NECO exams' },
  { id: 'general', name: 'General Chat', participants: 56, description: 'General academic discussions' }
];

// Sample messages by room
const messagesByRoom: Record<string, ChatMessage[]> = {
  'waec': [
    {
      id: '1',
      senderId: 'user1',
      senderName: 'Chioma A.',
      content: 'Has anyone started the mathematics revision yet?',
      timestamp: new Date(Date.now() - 3600000 * 3)
    },
    {
      id: '2',
      senderId: 'user2',
      senderName: 'David O.',
      content: "Yes, I'm focusing on calculus this week. It's challenging!",
      timestamp: new Date(Date.now() - 3600000 * 2)
    },
    {
      id: '3',
      senderId: 'user3',
      senderName: 'Fatima M.',
      content: 'I found some great practice questions for Physics if anyone needs them.',
      timestamp: new Date(Date.now() - 3600000)
    }
  ],
  'jamb': [
    {
      id: '1',
      senderId: 'user4',
      senderName: 'Ibrahim K.',
      content: 'What topics are most likely to appear in JAMB Physics this year?',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: '2',
      senderId: 'user5',
      senderName: 'Joy P.',
      content: 'Based on past trends, expect questions on electromagnetism, optics, and mechanics.',
      timestamp: new Date(Date.now() - 5400000)
    }
  ],
  'neco': [
    {
      id: '1',
      senderId: 'user6',
      senderName: 'Michael R.',
      content: 'How different is NECO Biology from WAEC Biology?',
      timestamp: new Date(Date.now() - 10800000)
    },
    {
      id: '2',
      senderId: 'user7',
      senderName: 'Sarah T.',
      content: 'NECO tends to have more practical-oriented questions based on my experience.',
      timestamp: new Date(Date.now() - 9000000)
    }
  ],
  'general': [
    {
      id: '1',
      senderId: 'user8',
      senderName: 'Daniel E.',
      content: 'What are the best study techniques you guys use?',
      timestamp: new Date(Date.now() - 14400000)
    },
    {
      id: '2',
      senderId: 'user9',
      senderName: 'Amina L.',
      content: 'Pomodoro technique (25 min study, 5 min break) works well for me!',
      timestamp: new Date(Date.now() - 12600000)
    },
    {
      id: '3',
      senderId: 'user10',
      senderName: 'Victor N.',
      content: 'I prefer spaced repetition with flashcards for memorization.',
      timestamp: new Date(Date.now() - 10800000)
    }
  ]
};

// Chat API functions
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...chatRooms];
};

export const getMessagesForRoom = async (roomId: string): Promise<ChatMessage[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return messagesByRoom[roomId] || [];
};

export const sendMessage = async (
  roomId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<ChatMessage> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!messagesByRoom[roomId]) {
    messagesByRoom[roomId] = [];
  }
  
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    senderId,
    senderName,
    content,
    timestamp: new Date()
  };
  
  // In a real app, this would be sent to a backend
  messagesByRoom[roomId].push(newMessage);
  
  return newMessage;
};

export const joinChatRoom = async (roomId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const room = chatRooms.find(r => r.id === roomId);
  if (room) {
    toast.success(`Joined ${room.name}`);
    // In a real app, we would update the user's room membership on the backend
  } else {
    toast.error('Room not found');
  }
};
