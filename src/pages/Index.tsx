
import Layout from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { SampleQuestions } from '@/components/SampleQuestions';
import { FooterSection } from '@/components/FooterSection';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSignUpFree = () => {
    navigate('/signup');
    toast.success('Starting your journey with StudyQuest!');
  };

  const handleExploreQuestions = () => {
    navigate('/exams');
  };

  const handleQuickPurchase = (type: string) => {
    navigate('/dashboard#bills');
    toast.success(`Redirecting to ${type} purchase...`);
  };

  return (
    <Layout>
      <Hero />
      <Features />
      <SampleQuestions />
      
      {/* Quick Purchase Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-4">Quick Purchases</h2>
            <p className="text-lg text-muted-foreground">
              Get what you need instantly - Airtime, Data, and Education PINs
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-panel rounded-xl p-6 card-hover text-center">
              <h3 className="text-xl font-medium mb-4">Airtime & Data</h3>
              <p className="text-muted-foreground mb-4">
                Buy airtime and data for all Nigerian networks instantly
              </p>
              <Button 
                className="w-full"
                onClick={() => handleQuickPurchase('Airtime')}
              >
                Buy Now
              </Button>
            </div>
            
            <div className="glass-panel rounded-xl p-6 card-hover text-center">
              <h3 className="text-xl font-medium mb-4">WAEC PIN</h3>
              <p className="text-muted-foreground mb-4">
                Purchase WAEC examination PIN cards quickly
              </p>
              <Button 
                className="w-full"
                onClick={() => handleQuickPurchase('WAEC')}
              >
                Buy WAEC PIN
              </Button>
            </div>
            
            <div className="glass-panel rounded-xl p-6 card-hover text-center">
              <h3 className="text-xl font-medium mb-4">NECO PIN</h3>
              <p className="text-muted-foreground mb-4">
                Get your NECO examination PIN instantly
              </p>
              <Button 
                className="w-full"
                onClick={() => handleQuickPurchase('NECO')}
              >
                Buy NECO PIN
              </Button>
            </div>
            
            <div className="glass-panel rounded-xl p-6 card-hover text-center">
              <h3 className="text-xl font-medium mb-4">GCE PIN</h3>
              <p className="text-muted-foreground mb-4">
                Purchase GCE examination PIN cards
              </p>
              <Button 
                className="w-full"
                onClick={() => handleQuickPurchase('GCE')}
              >
                Buy GCE PIN
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Marketplace Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-4">Your Complete Study Marketplace</h2>
            <p className="text-lg text-muted-foreground">
              Access thousands of past questions and study materials from trusted sources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Past Questions Library",
                description: "Comprehensive collection of past questions from WAEC, JAMB, NECO, and more.",
                action: "Browse Questions"
              },
              {
                title: "Study Materials",
                description: "High-quality textbooks, guides, and reference materials for all subjects.",
                action: "View Materials"
              },
              {
                title: "Instant Downloads",
                description: "Get immediate access to your purchased materials with secure downloads.",
                action: "Start Shopping"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-panel rounded-xl p-6 card-hover text-center"
              >
                <h3 className="text-xl font-medium mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Button 
                  variant="outline"
                  onClick={handleExploreQuestions}
                >
                  {feature.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-lg mb-6">Ready to ace your exams?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already preparing smarter with StudyQuest's comprehensive past question marketplace.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={handleSignUpFree}
              >
                Sign up for free
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
          </div>
        </div>
      </section>
      
      <FooterSection />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-8 right-8 rounded-full shadow-lg z-20 opacity-80 hover:opacity-100"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </Layout>
  );
};

export default Index;
