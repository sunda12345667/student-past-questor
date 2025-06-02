
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLogin = ({ isOpen, onClose, onSuccess }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login delay
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        toast.success('Admin login successful!');
        localStorage.setItem('adminAuthenticated', 'true');
        onSuccess();
        onClose();
        setUsername('');
        setPassword('');
      } else {
        setError('Invalid username or password');
        toast.error('Invalid admin credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
            Admin Access Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Please enter your admin credentials to access the material upload system
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm font-medium block mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="text-sm font-medium block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="flex-1"
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center border-t pt-4">
          <p className="mb-1">Demo Credentials:</p>
          <p><strong>Username:</strong> admin</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
