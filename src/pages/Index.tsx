
import Layout from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { SampleQuestions } from '@/components/SampleQuestions';
import WhatsAppChatbot from '@/components/WhatsAppChatbot';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, Calendar, Clock, User, ArrowRight } from 'lucide-react';
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
    navigate('/auth');
    toast.success('Starting your journey with iRapid!');
  };

  const handleExploreQuestions = () => {
    navigate('/exams');
  };

  // Featured blog posts
  const featuredBlogPosts = [
    {
      id: 1,
      title: 'How to Prepare for WAEC 2024: Complete Study Guide',
      excerpt: 'A comprehensive guide to help students prepare effectively for the West African Examinations Council (WAEC) examinations.',
      author: 'StudyQuest Team',
      date: '2024-05-20',
      readTime: '8 min read',
      category: 'WAEC'
    },
    {
      id: 2,
      title: 'JAMB 2024 Registration: Everything You Need to Know',
      excerpt: 'Latest updates and step-by-step guide for JAMB UTME registration process.',
      author: 'Education Team',
      date: '2024-05-18',
      readTime: '6 min read',
      category: 'JAMB'
    },
    {
      id: 3,
      title: 'Study Tips: How to Master Mathematics for Secondary School Exams',
      excerpt: 'Proven strategies and techniques to excel in mathematics examinations.',
      author: 'Mathematics Expert',
      date: '2024-05-12',
      readTime: '10 min read',
      category: 'Study Tips'
    }
  ];

  return (
    <Layout>
      <Hero />
      <Features />
      <SampleQuestions />
      
      {/* Main Focus Areas */}
      <section className="py-12 sm:py-20 bg-secondary/30 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="heading-lg mb-4">Our Core Services</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Everything you need for academic success in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="glass-panel rounded-xl p-6 sm:p-8 card-hover text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Past Questions</h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Comprehensive collection of past questions from WAEC, JAMB, NECO, and more with detailed solutions.
              </p>
              <Button 
                className="w-full"
                onClick={handleExploreQuestions}
              >
                Browse Past Questions
              </Button>
            </div>
            
            <div className="glass-panel rounded-xl p-6 sm:p-8 card-hover text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Video Courses</h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                High-quality video tutorials and courses from expert instructors covering all subjects.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/dashboard#marketplace')}
              >
                Watch Video Courses
              </Button>
            </div>
            
            <div className="glass-panel rounded-xl p-6 sm:p-8 card-hover text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Study Blog</h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Latest education news, exam tips, and study guides to help you excel in your academic journey.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/blog')}
              >
                Read Study Tips
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Newsletter />
          </div>
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="py-12 sm:py-20 bg-muted/30 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="heading-lg mb-4">Latest from Our Blog</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Stay updated with the latest education news, exam tips, and study guides
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredBlogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/blog')}>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2"
            >
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-secondary/30 dark:bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-lg mb-6">Ready to ace your exams?</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already preparing smarter with iRapid's comprehensive educational resources.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={handleSignUpFree}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={handleExploreQuestions}
              >
                Explore Resources
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* WhatsApp Chatbot */}
      <WhatsAppChatbot />
      
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
