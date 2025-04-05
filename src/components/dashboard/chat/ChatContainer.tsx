
import React from 'react';
import { Users } from 'lucide-react';
import GroupChatHeader from './GroupChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage } from '@/services/chat';
import { TypingUser } from '@/hooks/chat';
import { Attachment } from '@/services/chat/attachmentService';

interface ChatContainerProps {
  selectedGroup: string | null;
  selectedGroupName: string | undefined;
  messages: ChatMessage[];
  currentUserId: string | undefined;
  isGroupAdmin: boolean;
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: (content: string, attachments?: Attachment[]) => void;
  formatTimestamp: (timestamp: string) => string;
  typingUsers: TypingUser[];
  getTypingIndicator: () => string | null;
  handleTyping: () => void;
  onShowMembers: () => void;
  onLeaveGroup: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  selectedGroup,
  selectedGroupName,
  messages,
  currentUserId,
  isGroupAdmin,
  messageInput,
  setMessageInput,
  handleSendMessage,
  formatTimestamp,
  typingUsers,
  getTypingIndicator,
  handleTyping,
  onShowMembers,
  onLeaveGroup
}) => {
  
  if (!selectedGroup) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
        <Users className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium">Select a group to start chatting</h3>
        <p>Choose a study group from the list on the left.</p>
      </div>
    );
  }
  
  return (
    <>
      <GroupChatHeader 
        groupName={selectedGroupName} 
        isGroupAdmin={isGroupAdmin}
        onShowMembers={onShowMembers}
        onLeaveGroup={onLeaveGroup}
      />
      
      <div className="flex-grow p-4 overflow-y-auto">
        <MessageList 
          messages={messages}
          currentUserId={currentUserId}
          formatTimestamp={formatTimestamp}
          typingUsers={typingUsers}
          getTypingIndicator={getTypingIndicator}
        />
      </div>
      
      <MessageInput 
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
      />
    </>
  );
};

export default ChatContainer;
