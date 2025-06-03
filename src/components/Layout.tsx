
import React from 'react';
import Navbar from './Navbar';
import { FooterSection } from './FooterSection';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <FooterSection />
    </div>
  );
};

export default Layout;
