import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AgentSidebar } from './AgentSidebar';
import { AgentTopNav } from './AgentTopNav';

export const AgentLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* 1. Dedicated Agent Sidebar (Restricted to tickets & resolution) */}
      <AgentSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* 2. Main Workstation Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AgentTopNav onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

