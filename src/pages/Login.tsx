
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
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

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Check if user is already logged in
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
      
      console.log('Login successful');
      toast.success('Login successful! Welcome back.');
      
      // Let the auth state change event redirect the user
      // navigate() will be called in the useEffect when currentUser is set
    } catch (error: any) {
      console.error('Login error details:', error);
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      // Handle specific error codes from Supabase
      if (error?.code === 'email_not_confirmed') {
        errorMessage = 'Please check your email and confirm your account before logging in.';
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
    <Layout>
      <div className="container max-w-md mx-auto px-4 pt-32 pb-16">
        <div className="glass-panel p-8 rounded-xl">
          <h1 className="heading-md text-center mb-6">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-8">
            Log in to access your questions and resources
          </p>

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
                    Logging in...
                  </>
                ) : (
                  'Log in'
                )}
              </Button>
              
              <p className="text-sm text-center mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>

              <div className="text-xs text-muted-foreground text-center mt-6">
                <p>Hint: Use "admin@studyquest.com" to access the admin panel</p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
