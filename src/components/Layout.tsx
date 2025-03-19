
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navbar } from './Navbar';
import { FooterSection } from './FooterSection';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <FooterSection />
      </div>
    </ThemeProvider>
  );
}
