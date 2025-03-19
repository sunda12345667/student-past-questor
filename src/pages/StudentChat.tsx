
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface ChatRoom {
  id: string;
  name: string;
  participants: number;
}

const StudentChat = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    { id: 'waec', name: 'WAEC Preparation', participants: 24 },
    { id: 'jamb', name: 'JAMB Study Group', participants: 38 },
    { id: 'neco', name: 'NECO Discussion', participants: 17 },
    { id: 'general', name: 'General Chat', participants: 56 },
  ]);

  // Mock messages data for demonstration
  useEffect(() => {
    if (activeRoom) {
      const mockMessages: Message[] = [
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
          content: 'Yes, I'm focusing on calculus this week. It's challenging!',
          timestamp: new Date(Date.now() - 3600000 * 2)
        },
        {
          id: '3',
          senderId: 'user3',
          senderName: 'Fatima M.',
          content: 'I found some great practice questions for Physics if anyone needs them.',
          timestamp: new Date(Date.now() - 3600000)
        }
      ];
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  }, [activeRoom]);

  const sendMessage = () => {
    if (!message.trim() || !activeRoom) return;
    
    // In a real app, this would send to a backend
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'unknown',
      senderName: currentUser?.name || 'Anonymous',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate saving to backend
    toast.success('Message sent');
  };

  const joinRoom = (roomId: string) => {
    setActiveRoom(roomId);
    toast.success(`Joined ${chatRooms.find(room => room.id === roomId)?.name}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold mb-6">Student Chat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Rooms */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Chat Rooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {chatRooms.map(room => (
                      <Button
                        key={room.id}
                        variant={activeRoom === room.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => joinRoom(room.id)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <div className="flex flex-col items-start text-left">
                          <span>{room.name}</span>
                          <span className="text-xs text-muted-foreground">{room.participants} students</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <CardTitle>
                  {activeRoom 
                    ? chatRooms.find(room => room.id === activeRoom)?.name 
                    : "Select a chat room"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden flex flex-col">
                {activeRoom ? (
                  <>
                    <ScrollArea className="flex-grow mb-4">
                      <div className="space-y-4">
                        {messages.map(msg => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.senderId === currentUser?.id 
                                  ? 'bg-primary text-primary-foreground ml-auto' 
                                  : 'bg-secondary'
                              }`}
                            >
                              {msg.senderId !== currentUser?.id && (
                                <div className="flex items-center gap-2 mb-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">{msg.senderName}</span>
                                </div>
                              )}
                              <p>{msg.content}</p>
                              <div className={`text-xs mt-1 text-right ${
                                msg.senderId === currentUser?.id 
                                  ? 'text-primary-foreground/80' 
                                  : 'text-muted-foreground'
                              }`}>
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                      <Textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button onClick={sendMessage} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Select a chat room to start</h3>
                      <p className="text-muted-foreground">
                        Join a study group and connect with other students
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentChat;
