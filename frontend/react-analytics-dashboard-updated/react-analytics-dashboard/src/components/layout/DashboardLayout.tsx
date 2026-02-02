import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { useUIStore, useTheme } from '../../store';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  title?: string;
  showDatePicker?: boolean;
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  showDatePicker = true,
  children,
}) => {
  const { sidebarCollapsed } = useUIStore();
  const { applyTheme } = useTheme();

  // Apply theme on mount
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('preferences-storage') || '{}');
    const theme = prefs?.state?.preferences?.theme || 'system';
    applyTheme(theme);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Header title={title} showDatePicker={showDatePicker} />
        
        {/* Main content with responsive padding */}
        <main className="p-4 sm:p-6 pb-20 lg:pb-6">
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
};

export default DashboardLayout;
