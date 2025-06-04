
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster as UIToaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import QuestionView from '@/pages/QuestionView';
import ExamListing from '@/pages/ExamListing';
import PaymentCallback from '@/pages/PaymentCallback';
import NotFound from '@/pages/NotFound';
import Blog from '@/pages/Blog';
import AdminPanel from '@/pages/AdminPanel';
import StudentChat from '@/pages/StudentChat';
import AboutUs from '@/pages/AboutUs';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Careers from '@/pages/Careers';
import '@/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background w-full">
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <StudentChat />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/questions/:questionId" 
                  element={
                    <ProtectedRoute>
                      <QuestionView />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/exams" 
                  element={<ExamListing />}
                />
                <Route 
                  path="/payment/callback" 
                  element={
                    <ProtectedRoute>
                      <PaymentCallback />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster 
                position="top-right" 
                richColors 
                closeButton
                toastOptions={{
                  duration: 4000,
                }}
              />
              <UIToaster />
            </NotificationProvider>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
