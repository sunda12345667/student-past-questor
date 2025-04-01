
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

const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { login, currentUser } = useAuth();
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      console.log('Attempting login with:', data.email);
      await login(data.email, data.password);
      
      toast.success('Login successful! Welcome back.');
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login error details:', error);
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error?.code === 'email_not_confirmed') {
        errorMessage = 'Please check your email and confirm your account before logging in.';
      } else if (error?.code === 'invalid_credentials') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      if (mounted) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding area */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl mb-12">
            <span className="text-primary">StudyQuest</span>
          </Link>
          
          <div className="mt-24">
            <h1 className="text-4xl font-bold mb-6">Welcome back to StudyQuest</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your personalized learning journey continues here. Access thousands of past questions and study resources.
            </p>
            <div className="hidden md:block">
              <div className="p-6 bg-white/10 backdrop-blur border border-border rounded-xl mt-12">
                <p className="italic text-sm mb-4">"StudyQuest has transformed how I prepare for exams. The practice questions are spot-on!"</p>
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
            © {new Date().getFullYear()} StudyQuest. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col p-6 md:p-12">
        <div className="flex justify-between items-center mb-12">
          <div className="md:hidden">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
              <span className="text-primary">StudyQuest</span>
            </Link>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
              <p className="text-muted-foreground">
                Enter your details to access your dashboard
              </p>
            </div>

            {loginError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="student@example.com" {...field} />
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

                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
                
                <div className="mt-6 text-center space-y-4">
                  <p className="text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium">
                      Create account
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    By signing in, you agree to our{' '}
                    <a href="#" className="underline">Terms of Service</a> and{' '}
                    <a href="#" className="underline">Privacy Policy</a>.
                  </p>
                </div>

                <div className="text-xs text-muted-foreground text-center mt-6 border-t border-border pt-6">
                  <p>Use "irapidbusiness@gmail.com" and password "password" to test login</p>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="md:hidden text-center mt-8">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StudyQuest. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
