
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
    toast.success('Starting your journey with StudyQuest!');
  };

  const handleExploreQuestions = () => {
    // Smooth scroll to the questions section
    document.getElementById('questions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(14,165,233,0.08)_0%,rgba(14,165,233,0)_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(14,165,233,0.15)_0%,rgba(14,165,233,0)_100%)]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 animate-fade-in">
            <span className="text-sm font-medium text-primary">The ultimate exam preparation platform</span>
          </div>
          
          <h1 className="heading-xl mb-6 animate-slide-in-bottom [animation-delay:0.1s]">
            Master your exams with <span className="text-gradient">past questions</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in-bottom [animation-delay:0.2s]">
            Access thousands of past questions for secondary school and university exams. 
            Practice, learn, and succeed with our comprehensive question bank.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-in-bottom [animation-delay:0.3s]">
            <Button 
              size="lg" 
              className="w-full sm:w-auto group"
              onClick={handleGetStarted}
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleExploreQuestions}
            >
              Explore questions
            </Button>
          </div>
          
          <div className="mt-10 mb-4 text-sm text-muted-foreground animate-slide-in-bottom [animation-delay:0.4s]">
            Trusted by students from
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 animate-slide-in-bottom [animation-delay:0.4s]">
            {['WAEC', 'JAMB', 'NECO', 'Cambridge', 'University'].map((org, index) => (
              <Link
                key={index}
                to={`/exams/${org.toLowerCase()}`}
                className="text-lg font-semibold text-muted-foreground transition-colors hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info(`${org} exams coming soon!`);
                }}
              >
                {org}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
