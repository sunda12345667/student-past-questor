
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/"
          className="flex items-center space-x-2 font-bold text-xl"
        >
          <span className="text-primary">StudyQuest</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="#questions" className="text-sm font-medium hover:text-primary transition-colors">
            Questions
          </Link>
          <Link to="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" className="text-sm font-medium">
            Log in
          </Button>
          <Button className="text-sm font-medium">
            Sign up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="focus:outline-none"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-40 pt-20 md:hidden animate-fade-in">
          <nav className="flex flex-col items-center p-8 space-y-6 text-center">
            <Link
              to="/"
              className="text-xl font-medium hover:text-primary transition-colors w-full py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#features"
              className="text-xl font-medium hover:text-primary transition-colors w-full py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#questions"
              className="text-xl font-medium hover:text-primary transition-colors w-full py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Questions
            </Link>
            <Link
              to="#pricing"
              className="text-xl font-medium hover:text-primary transition-colors w-full py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-6 flex flex-col w-full space-y-4">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
              <Button className="w-full">
                Sign up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
