
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/ThemeToggle';

const authSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (mounted && currentUser) {
      console.log('User already logged in, redirecting to dashboard', currentUser);
      navigate('/dashboard');
    }
  }, [currentUser, navigate, mounted]);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    }
  });

  const onSubmit = async (data: AuthFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      if (isSignup) {
        if (!data.name) {
          throw new Error('Name is required for signup');
        }
        console.log('Attempting signup with:', data.email);
        await signup(data.name, data.email, data.password);
        toast.success('Account created successfully! Welcome to iRapid.');
      } else {
        console.log('Attempting login with:', data.email);
        await login(data.email, data.password);
        toast.success('Login successful! Welcome back.');
      }
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Auth error details:', error);
      let errorMessage = isSignup 
        ? 'Signup failed. Please try again.'
        : 'Login failed. Please check your credentials and try again.';
      
      if (error?.code === 'email_not_confirmed') {
        errorMessage = 'Please check your email and confirm your account before logging in.';
      } else if (error?.code === 'invalid_credentials') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (mounted) {
        setIsSubmitting(false);
      }
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setAuthError(null);
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding area */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl mb-12">
            <span className="text-primary">iRapid</span>
          </Link>
          
          <div className="mt-24">
            <h1 className="text-4xl font-bold mb-6">Welcome to iRapid</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your all-in-one platform for bill payments, airtime top-ups, and study materials.
            </p>
            <div className="hidden md:block">
              <div className="p-6 bg-white/10 backdrop-blur border border-border rounded-xl mt-12">
                <p className="italic text-sm mb-4">"iRapid has made managing my bills so much easier!"</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">JD</div>
                  <div className="ml-3">
                    <p className="font-medium">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">Student, University of Lagos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} iRapid. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col p-6 md:p-12">
        <div className="flex justify-between items-center mb-12">
          <div className="md:hidden">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
              <span className="text-primary">iRapid</span>
            </Link>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {isSignup ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-muted-foreground">
                {isSignup 
                  ? 'Create your account to get started with iRapid'
                  : 'Sign in to your account to continue'
                }
              </p>
            </div>

            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isSignup && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isSignup && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isSignup ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    isSignup ? 'Create Account' : 'Sign In'
                  )}
                </Button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-primary hover:underline"
                  >
                    {isSignup 
                      ? 'Already have an account? Sign in' 
                      : "Don't have an account? Sign up"
                    }
                  </button>
                </div>

                {!isSignup && (
                  <div className="text-xs text-muted-foreground text-center mt-6 border-t border-border pt-6">
                    <p>Use "irapidbusiness@gmail.com" and password "password" to test login</p>
                  </div>
                )}
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <a href="/terms" className="underline">Terms of Service</a> and{' '}
                <a href="/privacy" className="underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:hidden text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} iRapid. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
