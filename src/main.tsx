
import { createRoot } from 'react-dom/client'
import { StrictMode, Suspense } from 'react'
import React from 'react'  // Add explicit React import
import App from './App.tsx'
import './index.css'

// Simple error fallback component
const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md p-8 rounded-lg bg-destructive/5 border border-destructive/20">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-4 text-muted-foreground">
          The application encountered an error. Please refresh the page or try again later.
        </p>
        <p className="text-sm font-mono p-2 bg-background rounded border border-border mb-4 overflow-auto">
          {error.message || 'Unknown error'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

// Import ErrorBoundary from react-error-boundary package
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

try {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    throw new Error("Root element not found. Cannot mount React application.");
  }
  
  const root = createRoot(rootElement);
  
  root.render(
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <App />
      </Suspense>
    </ReactErrorBoundary>
  );
} catch (error) {
  console.error("Failed to render application:", error);
  // Render a minimal error message if the React tree fails to mount
  document.body.innerHTML = `
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
      <h2>Application Failed to Load</h2>
      <p>Please refresh the page or try again later.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `;
}
