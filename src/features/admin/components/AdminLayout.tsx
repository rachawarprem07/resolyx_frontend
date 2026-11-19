import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useSearchParams, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { SettingsDialog } from './settings/SettingsDialog';
import type { SettingsTabId } from './settings/SettingsSubNav';
import { getCurrentUser } from '@/lib/authSession';

export const AdminLayout: React.FC = () => {
  const currentUser = getCurrentUser();
  const isAgent = currentUser.role === 'support_agent' || currentUser.role === 'agent';
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('resolyx_sidebar_collapsed') === 'true' ||
        localStorage.getItem('resolva_sidebar_collapsed') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Non-admins cannot open settings
  const settingsParam = searchParams.get('settings');
  const isSettingsOpen = settingsParam !== null && isAdmin;
  const currentTab = (settingsParam && settingsParam !== 'open' ? settingsParam : (searchParams.get('tab') || 'general')) as SettingsTabId;

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (isAgent) {
    return <Navigate to="/agent" replace />;
  }

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('resolyx_sidebar_collapsed', String(next));
      } catch {
        // Safe fallback
      }
      return next;
    });
  };

  const handleCloseSettings = () => {
    searchParams.delete('settings');
    searchParams.delete('tab');
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased transition-colors duration-200">
      {/* 1. Persistent Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Viewport & Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <AdminTopNav
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={handleToggleSidebarCollapse}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Global Floating Settings Dialog (over workspace) */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        defaultTab={currentTab}
      />
    </div>
  );
};
