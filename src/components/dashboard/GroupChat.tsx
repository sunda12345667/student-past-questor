
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  Settings 
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
import { useAuth } from '@/contexts/AuthContext';

// Mock data for chat groups and messages
const chatGroups = [
  { id: '1', name: 'JAMB Study Club', unread: 3 },
  { id: '2', name: 'Physics Masters', unread: 0 },
  { id: '3', name: 'WAEC Mathematics', unread: 5 },
  { id: '4', name: 'Biology Enthusiasts', unread: 0 },
  { id: '5', name: 'Chemistry Lab', unread: 2 }
];

const mockMessages = {
  '1': [
    { id: '1', sender: { id: 'user1', name: 'Chioma A.', avatar: '' }, content: 'Hello everyone! Ready for our JAMB study session?', timestamp: new Date(Date.now() - 3600000 * 3) },
    { id: '2', sender: { id: 'user2', name: 'David O.', avatar: '' }, content: 'Yes, I just finished reviewing the Chemistry section.', timestamp: new Date(Date.now() - 3600000 * 2) },
    { id: '3', sender: { id: 'user3', name: 'Fatima M.', avatar: '' }, content: 'I found a really helpful resource for Physics formulas. Would anyone like me to share it?', timestamp: new Date(Date.now() - 3600000) },
    { id: '4', sender: { id: 'user4', name: 'Samuel E.', avatar: '' }, content: 'Yes please! I would really appreciate that.', timestamp: new Date(Date.now() - 1800000) },
    { id: '5', sender: { id: 'user3', name: 'Fatima M.', avatar: '' }, content: 'Great! Here it is: [Physics Formulas PDF]', timestamp: new Date(Date.now() - 1700000) }
  ],
  '2': [
    { id: '1', sender: { id: 'user5', name: 'Ibrahim K.', avatar: '' }, content: 'Can someone explain the difference between scalar and vector quantities?', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', sender: { id: 'user6', name: 'Grace A.', avatar: '' }, content: 'Scalar quantities have only magnitude, while vector quantities have both magnitude and direction.', timestamp: new Date(Date.now() - 82800000) }
  ],
  '3': [
    { id: '1', sender: { id: 'user7', name: 'Michael R.', avatar: '' }, content: 'What topics should we focus on for the upcoming WAEC Math exam?', timestamp: new Date(Date.now() - 172800000) },
    { id: '2', sender: { id: 'user8', name: 'Joy P.', avatar: '' }, content: 'Based on past papers, I would suggest focusing on Algebra, Trigonometry, and Statistics.', timestamp: new Date(Date.now() - 169200000) }
  ]
};

const GroupChat = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [groups, setGroups] = useState(chatGroups);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (selectedGroup) {
      setMessages(mockMessages[selectedGroup as keyof typeof mockMessages] || []);
      
      // Mark as read
      setGroups(prev => 
        prev.map(group => 
          group.id === selectedGroup ? { ...group, unread: 0 } : group
        )
      );
    }
  }, [selectedGroup]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: {
        id: currentUser?.id || 'current-user',
        name: currentUser?.name || 'You',
        avatar: currentUser?.avatar_url || ''
      },
      content: messageInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };
  
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const handleAttachFile = () => {
    toast({
      title: "Feature coming soon",
      description: "File attachment will be available soon.",
    });
  };
  
  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col md:flex-row gap-4">
      {/* Groups Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 border rounded-lg overflow-hidden">
        <div className="p-3 border-b bg-muted/30">
          <h3 className="font-medium flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Study Groups
          </h3>
        </div>
        <div className="p-2 h-[calc(100%-3rem)] overflow-y-auto">
          {groups.map(group => (
            <Button
              key={group.id}
              variant={selectedGroup === group.id ? "default" : "ghost"}
              className="w-full justify-start mb-1 relative"
              onClick={() => setSelectedGroup(group.id)}
            >
              <div className="flex items-center w-full overflow-hidden">
                <span className="truncate">{group.name}</span>
                {group.unread > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white min-w-[1.5rem] flex items-center justify-center">
                    {group.unread}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col border rounded-lg overflow-hidden">
        {selectedGroup ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b flex justify-between items-center bg-muted/30">
              <h3 className="font-medium">
                {groups.find(g => g.id === selectedGroup)?.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
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
                    <DropdownMenuItem>Member List</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Leave Group</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Messages Area */}
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
                    const isCurrentUser = message.sender.id === currentUser?.id || message.sender.id === 'current-user';
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} gap-2`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback>
                              {message.sender.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%]`}>
                          {!isCurrentUser && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {message.sender.name}
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
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                        
                        {isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback>
                              {message.sender.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-3 border-t">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Type your message..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAttachFile}>
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAttachFile}>
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
    </div>
  );
};

export default GroupChat;
