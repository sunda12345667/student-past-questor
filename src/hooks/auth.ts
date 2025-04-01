
// This file re-exports the auth context for organization and forward compatibility
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = useAuthContext;
