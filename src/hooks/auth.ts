
// Re-export the auth context plus additional auth-related hooks
import { useAuth as useAuthContext, User } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = useAuthContext;

// Hook to handle authentication requirements with redirects
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        toast.error('Please log in to access this page');
        navigate(redirectTo);
      }
      setIsCheckingAuth(false);
    }
  }, [currentUser, isLoading, navigate, redirectTo]);

  return { user: currentUser, isLoading: isLoading || isCheckingAuth };
};

// Hook to check if user has admin privileges
export const useIsAdmin = () => {
  const { isAdmin, currentUser } = useAuth();
  return { isAdmin: isAdmin(), isAuthenticated: !!currentUser };
};

// Hook for profile management
export const useProfile = () => {
  const { currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (profileData: Partial<User>) => {
    // Implementation would depend on how profiles are managed
    // This is a placeholder
    setIsUpdating(true);
    try {
      // Logic to update profile
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile: currentUser,
    isUpdating,
    updateProfile
  };
};
