
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, User, LogOut, Newspaper, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import AdminLogin from './AdminLogin';

type NavigationItem = {
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
} & (
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never }
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      localStorage.removeItem('adminAuthenticated');
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const handleAdminAccess = () => {
    const isAdminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    if (isAdminAuth) {
      navigate('/admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    navigate('/admin');
  };

  const navigation: NavigationItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/exams' },
    { name: 'Blog', href: '/blog', icon: Newspaper },
    ...(currentUser ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">StudyQuest</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminAccess}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
              
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors w-full text-left"
                    >
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="border-t pt-2 mt-2">
                <button
                  onClick={() => {
                    handleAdminAccess();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Access
                </button>
                
                {currentUser ? (
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 text-base font-medium text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      <main>{children}</main>
    </div>
  );
};

export default Layout;
