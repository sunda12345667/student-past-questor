
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, BookOpen, GraduationCap, School } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Enhanced knowledge base for academic questions
const academicKnowledgeBase = [
  // Mathematics
  {
    keywords: ['solve', 'equation', 'algebra', 'calculus', 'derivative', 'integrate', 'math'],
    response: "I can help solve this math problem. Let me break it down step by step...",
    subject: 'mathematics'
  },
  // Physics
  {
    keywords: ['physics', 'force', 'motion', 'energy', 'velocity', 'acceleration', 'gravity'],
    response: "For this physics problem, we need to apply the following principles...",
    subject: 'physics'
  },
  // Chemistry
  {
    keywords: ['chemistry', 'reaction', 'compound', 'molecule', 'element', 'acid', 'base'],
    response: "To solve this chemistry question, let's analyze the chemical properties...",
    subject: 'chemistry'
  },
  // Biology
  {
    keywords: ['biology', 'cell', 'organism', 'gene', 'evolution', 'ecosystem', 'protein'],
    response: "This biology question requires understanding of the following concepts...",
    subject: 'biology'
  },
  // Computer Science
  {
    keywords: ['algorithm', 'programming', 'code', 'function', 'data structure', 'complexity'],
    response: "Let me help you with this computer science problem by explaining the algorithm...",
    subject: 'computer science'
  },
  // English & Literature
  {
    keywords: ['english', 'grammar', 'literature', 'essay', 'poetry', 'novel', 'author'],
    response: "This English question can be approached by analyzing the text structure and literary devices...",
    subject: 'english'
  },
  // History
  {
    keywords: ['history', 'war', 'civilization', 'revolution', 'empire', 'century', 'ancient'],
    response: "To address this historical question, we need to consider the context and events of the period...",
    subject: 'history'
  },
  // Geography
  {
    keywords: ['geography', 'climate', 'continent', 'country', 'population', 'map', 'region'],
    response: "This geography question can be answered by examining the following geographical features...",
    subject: 'geography'
  },
  // Economics
  {
    keywords: ['economics', 'market', 'demand', 'supply', 'inflation', 'gdp', 'price'],
    response: "To solve this economics problem, we need to apply the following economic principles...",
    subject: 'economics'
  }
];

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
  const { toast } = useToast();
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

  // Generate more intelligent responses for academic questions
  const generateAcademicResponse = (query: string, subject: string, level: string): string => {
    const queryLower = query.toLowerCase();
    
    // First check if query contains keywords from our knowledge base
    for (const item of academicKnowledgeBase) {
      if (subject !== 'general' && item.subject !== subject.toLowerCase()) continue;
      
      for (const keyword of item.keywords) {
        if (queryLower.includes(keyword)) {
          // Customize response based on education level
          let levelPrefix = "";
          if (level === 'primary') {
            levelPrefix = "Let me explain this in simple terms that are easy to understand. ";
          } else if (level === 'university') {
            levelPrefix = "Here's a university-level analysis of this problem. ";
          }
          
          return levelPrefix + item.response;
        }
      }
    }
    
    // If no specific match, provide a subject and level-appropriate response
    const subjectResponses: Record<string, string> = {
      'general': "That's an interesting question! Let me help you work through this step by step.",
      'mathematics': "To solve this math problem, we need to apply the following principles...",
      'physics': "This physics problem can be solved by applying the relevant laws and equations...",
      'chemistry': "Let's analyze this chemistry question by looking at the molecular structure and reactions...",
      'biology': "For this biology question, we need to consider the biological processes and structures...",
      'literature': "To analyze this text, let's look at the themes, characters, and literary devices...",
      'history': "Let's examine this historical question by considering the context and events of the period...",
      'geography': "To answer this geography question, we'll need to consider the regional characteristics...",
      'languages': "For this language question, let's examine the grammar, vocabulary, and context..."
    };
    
    let levelModifier = "";
    if (level === 'primary') {
      levelModifier = "Here's a simple explanation: ";
    } else if (level === 'secondary') {
      levelModifier = "Here's how you can solve this: ";
    } else if (level === 'university') {
      levelModifier = "Let me provide a detailed academic analysis: ";
    }
    
    return levelModifier + (subjectResponses[subject] || subjectResponses['general']);
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
        
        <TabsContent value="settings" className="p-4 border rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Area</label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="literature">Literature & English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="geography">Geography</SelectItem>
                  <SelectItem value="languages">Languages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Education Level</label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <School className="mr-2 h-4 w-4" />
                Current Settings
              </h3>
              <p className="text-sm">Subject: <span className="font-medium">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span></p>
              <p className="text-sm">Level: <span className="font-medium">{educationLevel.charAt(0).toUpperCase() + educationLevel.slice(1)}</span></p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="h-full">
          <Card className="flex-1 flex flex-col h-[500px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      <div className="rounded-full p-2 bg-muted">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg p-3 bg-muted">
                        <p className="typing-indicator">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <CardContent className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask your ${subject !== 'general' ? subject : ''} question${educationLevel !== 'secondary' ? ' (' + educationLevel + ' level)' : ''}...`}
                  className="min-h-[50px] flex-1 resize-none"
                />
                <Button type="submit" size="icon" disabled={isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Press Enter to send, Shift+Enter for a new line</p>
                <p className="mt-1 italic">Currently answering {subject} questions at {educationLevel} level</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicAI;
