import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  File, 
  Image, 
  Paperclip, 
  Users, 
  Info, 
  Settings,
  Plus
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
import { supabase } from '@/integrations/supabase/client';
import { TypingUser } from '@/hooks/chat';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
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
  
  const handleLeaveGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      const success = await leaveChatGroup(groupId);
      
      if (success) {
        setGroups(prev => prev.filter(g => g.id !== groupId));
        
        if (selectedGroup === groupId) {
          setSelectedGroup(null);
          setMessages([]);
        }
      }
    }
  };
  
  const handleShowMembers = async (groupId: string) => {
    setMembersLoading(true);
    try {
      const members = await getGroupMembers(groupId);
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
  
  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-64 flex-shrink-0 border rounded-lg overflow-hidden">
        <div className="p-3 border-b bg-muted/30">
          <div className="flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Study Groups
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setIsCreatingGroup(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-2">
          <div className="flex space-x-2 mb-2">
            <Button
              variant={activeTab === 'my-groups' ? "default" : "outline"}
              size="sm"
              className="w-1/2"
              onClick={() => setActiveTab('my-groups')}
            >
              My Groups
            </Button>
            <Button
              variant={activeTab === 'discover' ? "default" : "outline"}
              size="sm"
              className="w-1/2"
              onClick={() => setActiveTab('discover')}
            >
              Discover
            </Button>
          </div>
        </div>
        <div className="p-2 h-[calc(100%-6rem)] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-muted animate-pulse rounded-md"></div>
              ))}
            </div>
          ) : (
            activeTab === 'my-groups' ? (
              groups.length > 0 ? (
                groups.map(group => (
                  <Button
                    key={group.id}
                    variant={selectedGroup === group.id ? "default" : "ghost"}
                    className="w-full justify-start mb-1 relative"
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <div className="flex items-center w-full overflow-hidden">
                      <span className="truncate">{group.name}</span>
                      {group.unread && group.unread > 0 && (
                        <Badge className="ml-auto bg-red-500 text-white min-w-[1.5rem] flex items-center justify-center">
                          {group.unread}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>You haven't joined any groups yet.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setActiveTab('discover')}
                  >
                    Discover groups
                  </Button>
                </div>
              )
            ) : (
              publicGroups.length > 0 ? (
                publicGroups.map(group => (
                  <div key={group.id} className="mb-2 p-2 border rounded-md">
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {group.members} members
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No public groups available.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setIsCreatingGroup(true)}
                  >
                    Create a group
                  </Button>
                </div>
              )
            )
          )}
        </div>
      </div>
      
      <div className="flex-grow flex flex-col border rounded-lg overflow-hidden">
        {selectedGroup ? (
          <>
            <div className="p-3 border-b flex justify-between items-center bg-muted/30">
              <h3 className="font-medium">
                {groups.find(g => g.id === selectedGroup)?.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleShowMembers(selectedGroup)}
                >
                  <Users className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chat Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                    <DropdownMenuItem>Pin Chat</DropdownMenuItem>
                    {isGroupAdmin() && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Manage Members</DropdownMenuItem>
                        <DropdownMenuItem>Group Settings</DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-500"
                      onClick={() => handleLeaveGroup(selectedGroup)}
                    >
                      Leave Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Users className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium">No messages yet</h3>
                  <p>Be the first to start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.user_id === currentUser?.id;
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar} alt={message.sender?.name} />
                            <AvatarFallback>
                              {message.sender?.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%]`}>
                          {!isCurrentUser && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {message.sender?.name}
                            </p>
                          )}
                          
                          <Card className={`${
                            isCurrentUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
                          }`}>
                            <CardContent className="p-3 text-sm">
                              {message.content}
                            </CardContent>
                          </Card>
                          
                          <p className={`text-xs text-muted-foreground mt-1 ${
                            isCurrentUser ? 'text-right' : 'text-left'
                          }`}>
                            {formatTimestamp(message.created_at)}
                          </p>
                        </div>
                        
                        {isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar} alt={message.sender?.name} />
                            <AvatarFallback>
                              {message.sender?.name?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground animate-pulse">
                      <div className="flex items-center space-x-1 ml-2">
                        <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-75"></div>
                        <div className="w-1 h-1 bg-current rounded-full animate-bounce delay-150"></div>
                      </div>
                      <span className="ml-2">{getTypingIndicator()}</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Image className="h-4 w-4 mr-2" />
                      Photo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <Users className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">Select a group to start chatting</h3>
            <p>Choose a study group from the list on the left.</p>
          </div>
        )}
      </div>
      
      <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Study Group</DialogTitle>
            <DialogDescription>
              Create a study group to collaborate with other students.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input 
                id="name" 
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g., Physics Study Group" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="What will your group be studying?"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="private"
                checked={newGroupIsPrivate}
                onCheckedChange={setNewGroupIsPrivate}
              />
              <Label htmlFor="private">Private Group</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showMembersModal} onOpenChange={setShowMembersModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Group Members</DialogTitle>
            <DialogDescription>
              {groups.find(g => g.id === selectedGroup)?.name || "Group"} has {groupMembers.length} members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {membersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {groupMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user?.avatar_url} />
                        <AvatarFallback>
                          {member.user?.name?.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.user?.name}</span>
                    </div>
                    
                    {member.is_admin && (
                      <Badge variant="outline">Admin</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowMembersModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupChat;
