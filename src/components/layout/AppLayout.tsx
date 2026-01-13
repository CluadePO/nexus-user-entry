import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, useSidebarContext } from '@/context/SidebarContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';

const AppLayoutContent: React.FC = () => {
  const { collapsed } = useSidebarContext();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      {/* Spacer for fixed sidebar */}
      <div 
        className="flex-shrink-0 transition-all duration-300" 
        style={{ width: collapsed ? '5rem' : '18rem' }} 
      />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  );
};
