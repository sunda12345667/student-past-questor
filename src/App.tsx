
import { useState, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from 'sonner';

import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import QuestionView from './pages/QuestionView';
import StudentChat from './pages/StudentChat';
import ExamListing from './pages/ExamListing';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PaymentCallback from './pages/PaymentCallback';
import { Skeleton } from '@/components/ui/skeleton';

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        useErrorBoundary: true,
      },
    },
  }));
  
  // Loading fallback component with improved UX
  const LoadingFallback = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse mt-4" aria-live="polite">
        Loading application...
      </p>
    </div>
  );
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: "responsive-toast",
                style: {
                  maxWidth: '420px',
                },
              }}
            />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes with regular layout */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/payment-callback" element={<PaymentCallback />} />
                
                {/* Protected routes with dashboard layout */}
                <Route element={<ProtectedRoute children={undefined} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/questions/:packId" element={<QuestionView />} />
                  <Route path="/chat" element={<StudentChat />} />
                  <Route path="/exams" element={<ExamListing />} />
                </Route>
                
                {/* Admin routes */}
                <Route element={<ProtectedRoute children={undefined} requireAdmin={true} />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
