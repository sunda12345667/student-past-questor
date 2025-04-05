
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { 
  ChatGroup, 
  ChatMessage, 
  getUserGroups,
  getPublicGroups,
  getGroupMessages,
  sendGroupMessage,
  createChatGroup,
  joinChatGroup,
  leaveChatGroup,
  getGroupMembers,
  subscribeToGroupMessages,
  subscribeToTypingIndicators,
  sendTypingIndicator
} from '@/services/chat';
import { TypingUser } from '@/hooks/chat';
import GroupList from './chat/GroupList';
import ChatContainer from './chat/ChatContainer';
import CreateGroupDialog from './chat/CreateGroupDialog';
import GroupMembersDialog from './chat/GroupMembersDialog';

const GroupChat = () => {
  const { currentUser } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<ChatGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my-groups');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  useEffect(() => {
    const storedGroupId = sessionStorage.getItem('selectedGroupId');
    if (storedGroupId) {
      setSelectedGroup(storedGroupId);
      sessionStorage.removeItem('selectedGroupId');
    }
  }, []);
  
  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const userGroups = await getUserGroups();
        setGroups(userGroups);
        
        const availablePublicGroups = await getPublicGroups();
        setPublicGroups(availablePublicGroups);
        
        if (userGroups.length > 0 && !selectedGroup) {
          setSelectedGroup(userGroups[0].id);
        }
      } catch (error) {
        console.error("Error loading groups:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, []);
  
  useEffect(() => {
    if (selectedGroup) {
      const loadMessages = async () => {
        const groupMessages = await getGroupMessages(selectedGroup);
        setMessages(groupMessages);
        
        const members = await getGroupMembers(selectedGroup);
        setGroupMembers(members);
      };
      
      loadMessages();
      
      const messageChannel = subscribeToGroupMessages(
        selectedGroup,
        (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
        }
      );
      
      const typingChannel = subscribeToTypingIndicators(
        selectedGroup,
        (typingUsersList) => {
          const filteredTypingUsers = typingUsersList.filter(
            user => user.id !== currentUser?.id
          );
          setTypingUsers(filteredTypingUsers);
        }
      );
      
      return () => {
        supabase.removeChannel(messageChannel);
        supabase.removeChannel(typingChannel);
      };
    }
  }, [selectedGroup, currentUser?.id]);
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedGroup || !currentUser) return;
    
    const success = await sendGroupMessage(selectedGroup, messageInput);
    if (success) {
      setMessageInput('');
    }
  };
  
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    const newGroup = await createChatGroup(
      newGroupName,
      newGroupDescription,
      newGroupIsPrivate
    );
    
    if (newGroup) {
      setGroups(prev => [newGroup, ...prev]);
      setSelectedGroup(newGroup.id);
      setIsCreatingGroup(false);
      
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupIsPrivate(false);
    }
  };
  
  const handleJoinGroup = async (groupId: string) => {
    const success = await joinChatGroup(groupId);
    
    if (success) {
      const joinedGroup = publicGroups.find(g => g.id === groupId);
      if (joinedGroup) {
        setPublicGroups(prev => prev.filter(g => g.id !== groupId));
        setGroups(prev => [joinedGroup, ...prev]);
        setSelectedGroup(groupId);
      }
    }
  };
  
  const handleLeaveGroup = async () => {
    if (!selectedGroup) return;
    
    if (window.confirm("Are you sure you want to leave this group?")) {
      const success = await leaveChatGroup(selectedGroup);
      
      if (success) {
        setGroups(prev => prev.filter(g => g.id !== selectedGroup));
        setSelectedGroup(null);
        setMessages([]);
      }
    }
  };
  
  const handleShowMembers = async () => {
    if (!selectedGroup) return;
    
    setMembersLoading(true);
    try {
      const members = await getGroupMembers(selectedGroup);
      setGroupMembers(members);
      setShowMembersModal(true);
    } finally {
      setMembersLoading(false);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleTyping = () => {
    if (currentUser && selectedGroup) {
      sendTypingIndicator(
        selectedGroup,
        currentUser.id,
        currentUser.name || 'User'
      );
    }
  };
  
  const isGroupAdmin = () => {
    if (!selectedGroup || !currentUser) return false;
    const member = groupMembers.find(m => m.user_id === currentUser.id);
    return member?.is_admin || false;
  };
  
  const getTypingIndicator = () => {
    if (typingUsers.length === 0) return null;
    
    const typingNames = typingUsers.map(user => {
      return user.name || 'Someone';
    });
    
    if (typingNames.length === 1) {
      return `${typingNames[0]} is typing...`;
    } else if (typingNames.length === 2) {
      return `${typingNames[0]} and ${typingNames[1]} are typing...`;
    } else {
      return `${typingNames.length} people are typing...`;
    }
  };
  
  const selectedGroupName = groups.find(g => g.id === selectedGroup)?.name;
  
  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col md:flex-row gap-4">
      <GroupList 
        groups={groups}
        publicGroups={publicGroups}
        loading={loading}
        selectedGroup={selectedGroup}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectGroup={setSelectedGroup}
        onCreateGroup={() => setIsCreatingGroup(true)}
        onJoinGroup={handleJoinGroup}
      />
      
      <div className="flex-grow flex flex-col border rounded-lg overflow-hidden">
        <ChatContainer 
          selectedGroup={selectedGroup}
          selectedGroupName={selectedGroupName}
          messages={messages}
          currentUserId={currentUser?.id}
          isGroupAdmin={isGroupAdmin()}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleSendMessage={handleSendMessage}
          formatTimestamp={formatTimestamp}
          typingUsers={typingUsers}
          getTypingIndicator={getTypingIndicator}
          handleTyping={handleTyping}
          onShowMembers={handleShowMembers}
          onLeaveGroup={handleLeaveGroup}
        />
      </div>
      
      <CreateGroupDialog 
        isOpen={isCreatingGroup}
        onOpenChange={setIsCreatingGroup}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        newGroupDescription={newGroupDescription}
        setNewGroupDescription={setNewGroupDescription}
        newGroupIsPrivate={newGroupIsPrivate}
        setNewGroupIsPrivate={setNewGroupIsPrivate}
        onCreateGroup={handleCreateGroup}
      />
      
      <GroupMembersDialog 
        isOpen={showMembersModal}
        onOpenChange={setShowMembersModal}
        groupName={selectedGroupName}
        membersLoading={membersLoading}
        groupMembers={groupMembers}
      />
    </div>
  );
};

export default GroupChat;
