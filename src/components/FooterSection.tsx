
import { useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '@/components/AdminLogin';

export function FooterSection() {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminSuccess = () => {
    navigate('/admin');
  };

  return (
    <>
      <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 font-bold text-xl mb-4">
                <span className="text-primary">StudyQuest</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Empowering students to excel in their exams through comprehensive past question resources and video materials.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-medium text-lg mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/exams" className="text-muted-foreground hover:text-primary transition-colors">
                    Past Questions
                  </a>
                </li>
                <li>
                  <a href="/dashboard#marketplace" className="text-muted-foreground hover:text-primary transition-colors">
                    Video Materials
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Study Materials
                  </a>
                </li>
                <li>
                  <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Education Blog
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-medium text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-medium text-lg mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest exam resources and tips.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 rounded-lg border border-input focus-ring"
                />
                <Button>Subscribe</Button>
              </div>
              
              {/* Admin Login Section */}
              <div className="border-t pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 w-full"
                >
                  <Shield className="h-4 w-4" />
                  Admin Access
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                © {new Date().getFullYear()} StudyQuest. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminSuccess}
      />
    </>
  );
}
