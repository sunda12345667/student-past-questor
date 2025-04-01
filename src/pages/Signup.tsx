
import { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created successfully! Welcome to StudyQuest.');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Signup form */}
      <div className="flex-1 flex flex-col p-6 md:p-12 order-2 md:order-1">
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
              <h2 className="text-2xl font-bold mb-2">Create your account</h2>
              <p className="text-muted-foreground">
                Join thousands of students preparing better with StudyQuest
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Sign up'
                  )}
                </Button>
                
                <div className="mt-6 text-center space-y-4">
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="underline">Terms of Service</a> and{' '}
                    <a href="#" className="underline">Privacy Policy</a>.
                  </p>
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
      
      {/* Right side - Branding area */}
      <div className="hidden md:flex md:w-1/2 bg-primary/10 flex-col justify-between p-12 order-1 md:order-2">
        <div>
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl mb-12">
            <span className="text-primary">StudyQuest</span>
          </Link>
          
          <div className="mt-24">
            <h1 className="text-4xl font-bold mb-6">Start your learning journey today</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Access thousands of past questions, study materials, and personalized learning tools.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
              <div className="p-4 bg-white/10 backdrop-blur border border-border rounded-xl">
                <h3 className="font-medium mb-2">Comprehensive Question Bank</h3>
                <p className="text-sm text-muted-foreground">Access thousands of past exam questions across multiple subjects.</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur border border-border rounded-xl">
                <h3 className="font-medium mb-2">AI-Powered Learning</h3>
                <p className="text-sm text-muted-foreground">Get personalized assistance and explanations for difficult concepts.</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur border border-border rounded-xl">
                <h3 className="font-medium mb-2">Study Groups</h3>
                <p className="text-sm text-muted-foreground">Collaborate with peers to enhance your learning experience.</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur border border-border rounded-xl">
                <h3 className="font-medium mb-2">Performance Analytics</h3>
                <p className="text-sm text-muted-foreground">Track your progress and identify areas for improvement.</p>
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
    </div>
  );
};

export default Signup;
