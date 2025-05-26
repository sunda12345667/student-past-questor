import Layout from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { SampleQuestions } from '@/components/SampleQuestions';
import { PricingPlans } from '@/components/PricingPlans';
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
    toast.success('Starting your free journey with StudyQuest!');
  };

  const handleExploreQuestions = () => {
    navigate('/exams');
  };

  const handleLearnMore = (service: string) => {
    // In a real app, we would navigate to the service page
    toast.info(`${service} service will be available soon!`);
  };

  return (
    <Layout>
      <Hero />
      <Features />
      <SampleQuestions />
      <PricingPlans />
      
      {/* Additional Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-4">More than just past questions</h2>
            <p className="text-lg text-muted-foreground">
              We offer additional services to make student life easier.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Buy Phone Airtime",
              "Buy Internet Data",
              "Pay TV Subscription",
              "Pay Electricity Bill",
              "Education Payment",
              "Buy Event Ticket"
            ].map((service, index) => (
              <div 
                key={index}
                className="glass-panel rounded-xl p-6 card-hover text-center"
              >
                <h3 className="text-xl font-medium mb-4">{service}</h3>
                <p className="text-muted-foreground mb-4">
                  Fast, secure, and convenient {service.toLowerCase()} services at your fingertips.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (service === "Buy Phone Airtime" || 
                        service === "Buy Internet Data" || 
                        service === "Pay TV Subscription" || 
                        service === "Pay Electricity Bill" || 
                        service === "Education Payment" || 
                        service === "Buy Event Ticket") {
                      navigate('/login');
                      toast.info(`Sign in to access ${service.toLowerCase()} services`);
                    } else {
                      handleLearnMore(service);
                    }
                  }}
                >
                  Learn More
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
              Join thousands of students who are already preparing smarter with StudyQuest's comprehensive past question platform.
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
