
import { 
  BookOpen, 
  Brain, 
  CreditCard, 
  Download, 
  MessageSquare, 
  Search, 
  Share2, 
  Smartphone, 
  Users 
} from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: "Comprehensive Question Bank",
    description: "Access thousands of past questions from all major exams and educational levels."
  },
  {
    icon: <Search className="h-7 w-7" />,
    title: "Advanced Search & Filters",
    description: "Find exactly what you need by subject, exam type, year, or institution."
  },
  {
    icon: <Download className="h-7 w-7" />,
    title: "Multiple Download Formats",
    description: "Get questions in PDF, Word, or view directly online on any device."
  },
  {
    icon: <Brain className="h-7 w-7" />,
    title: "AI-Powered Assistant",
    description: "Get instant answers to your questions with our intelligent chatbot."
  },
  {
    icon: <CreditCard className="h-7 w-7" />,
    title: "Flexible Payment Options",
    description: "Pay with airtime, USSD, bank transfer, cards, or from your wallet."
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Referral System",
    description: "Invite friends and earn rewards or discounts on your subscriptions."
  },
  {
    icon: <Share2 className="h-7 w-7" />,
    title: "Easy Sharing",
    description: "Share study materials with classmates and study groups effortlessly."
  },
  {
    icon: <Smartphone className="h-7 w-7" />,
    title: "Mobile Friendly",
    description: "Access your questions anywhere with our Progressive Web App."
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: "Community Support",
    description: "Join discussion forums and get help from other students."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-secondary/50 dark:bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-4">Everything you need to excel in your exams</h2>
          <p className="text-lg text-muted-foreground">
            Our platform is designed with students in mind, offering features that make exam preparation efficient and effective.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-panel p-6 rounded-2xl card-hover flex flex-col items-start animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
