
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Predefined answers for common questions
const knowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm your AI study assistant. How can I help with your studies today?"
  },
  {
    keywords: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'trigonometry'],
    response: "I can help with Mathematics! We have past questions for WAEC, JAMB, NECO, and Cambridge exams. What specific topic are you studying?"
  },
  {
    keywords: ['physics', 'mechanics', 'electricity', 'waves', 'optics'],
    response: "For Physics, we have comprehensive resources on mechanics, electricity, waves, and more. Our JAMB and WAEC physics questions are particularly popular."
  },
  {
    keywords: ['chemistry', 'organic', 'inorganic', 'elements', 'compounds', 'reactions'],
    response: "Chemistry can be challenging! We have past questions on organic chemistry, chemical reactions, and lab procedures that many students find helpful."
  },
  {
    keywords: ['biology', 'zoology', 'botany', 'genetics', 'ecology'],
    response: "Our Biology section covers everything from cell biology to genetics and ecology. What specific area are you interested in?"
  },
  {
    keywords: ['english', 'grammar', 'literature', 'comprehension', 'essay'],
    response: "For English Language, we have resources on comprehension, essay writing, grammar, and literature. These can really help improve your language skills."
  },
  {
    keywords: ['economics', 'microeconomics', 'macroeconomics', 'market', 'demand', 'supply'],
    response: "Our Economics past questions cover both microeconomics and macroeconomics. They're great for understanding market dynamics and economic theories."
  },
  {
    keywords: ['exam', 'preparation', 'study', 'prepare', 'tips', 'advice'],
    response: "For exam preparation, I recommend: 1) Create a study schedule, 2) Practice past questions regularly, 3) Focus on understanding concepts rather than memorizing, 4) Take breaks between study sessions, and 5) Get enough sleep before your exam."
  },
  {
    keywords: ['payment', 'pay', 'subscribe', 'subscription', 'price', 'cost', 'billing'],
    response: "We offer several payment options including card payments, bank transfers, USSD, and mobile money. You can find these in the Payment Methods tab. Our subscription plans start from ₦999 monthly."
  },
  {
    keywords: ['download', 'pdf', 'save', 'offline', 'access'],
    response: "You can download questions as PDF files once you've subscribed to a plan. Just look for the download button next to each question set. Premium users have unlimited downloads."
  },
  {
    keywords: ['refer', 'referral', 'friend', 'invite'],
    response: "You can earn points by referring friends! Each successful referral gives you points that can be converted to wallet balance. Check the Referral tab for your unique referral link."
  },
  {
    keywords: ['contact', 'support', 'help', 'assistance', 'issue', 'problem'],
    response: "If you need further assistance, please contact our support team at support@studyquest.com or use the live chat option available for Premium and Ultimate subscribers."
  }
];

const ChatbotSupport = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Hello! I am your AI study assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);

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

    // Generate bot response based on user input
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        content: generateIntelligentResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate more intelligent responses by matching keywords
  const generateIntelligentResponse = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    // Check for matching keywords in knowledge base
    for (const item of knowledgeBase) {
      for (const keyword of item.keywords) {
        if (queryLower.includes(keyword)) {
          return item.response;
        }
      }
    }
    
    // If no specific match, provide a generic helpful response
    const genericResponses = [
      "That's an interesting question! While I don't have specific information on that, I can help you find relevant past questions in our database.",
      "I'm not sure about that specific topic, but our platform has thousands of past questions that might help. Have you tried using the search function?",
      "I'd recommend checking our question bank for similar topics. The search and filter options can help you find exactly what you need.",
      "Great question! You can find detailed answers to similar questions in our comprehensive question bank.",
      "I'll make a note of your question for our content team. Meanwhile, you might find helpful material in our existing question sets."
    ];
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <h2 className="text-2xl font-medium mb-4">AI Study Assistant</h2>
      
      <Card className="flex-1 flex flex-col">
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
                    <p>{message.content}</p>
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
              placeholder="Ask me anything about your studies..."
              className="min-h-[50px] flex-1 resize-none"
            />
            <Button type="submit" size="icon" disabled={isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for a new line
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotSupport;
