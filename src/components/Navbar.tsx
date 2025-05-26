
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotificationBell } from '@/components/NotificationBell';
import { useAuth } from '@/hooks/auth';
import { LogOut, User, Settings } from 'lucide-react';

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              StudySync
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                Home
              </Link>
              {currentUser && (
                <>
                  <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/chat" className="text-foreground/80 hover:text-foreground transition-colors">
                    Chat
                  </Link>
                  <Link to="/exams" className="text-foreground/80 hover:text-foreground transition-colors">
                    Exams
                  </Link>
                </>
              )}
            </nav>

            <ThemeToggle />
            
            {currentUser && <NotificationBell />}

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={currentUser.user_metadata?.avatar_url || ''} 
                        alt={currentUser.user_metadata?.name || currentUser.email || 'User'} 
                      />
                      <AvatarFallback>
                        {(currentUser.user_metadata?.name || currentUser.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">
                        {currentUser.user_metadata?.name || 'User'}
                      </p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
