
import { useState } from 'react';
import { Bot, GraduationCap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatArea } from './academic-ai/ChatArea';
import { SettingsPanel } from './academic-ai/SettingsPanel';
import { generateAcademicResponse } from './academic-ai/aiResponseGenerator';
import { Message } from './academic-ai/ChatMessage';

const AcademicAI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hello! I am your academic AI assistant. I can help solve problems across all subjects and education levels. What question would you like help with today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [subject, setSubject] = useState('general');
  const [educationLevel, setEducationLevel] = useState('secondary');
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Generate AI response based on user input
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        content: generateAcademicResponse(input, subject, educationLevel),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <h2 className="text-2xl font-medium mb-4">Academic Problem Solver AI</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="chat" className="flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4" />
            Subject & Level
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <SettingsPanel 
            subject={subject}
            setSubject={setSubject}
            educationLevel={educationLevel}
            setEducationLevel={setEducationLevel}
          />
        </TabsContent>
        
        <TabsContent value="chat" className="h-full">
          <ChatArea 
            messages={messages}
            isTyping={isTyping}
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            handleKeyDown={handleKeyDown}
            subject={subject}
            educationLevel={educationLevel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicAI;
