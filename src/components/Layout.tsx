
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { FooterSection } from './FooterSection';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <FooterSection />
    </div>
  );
};

export default Layout;
