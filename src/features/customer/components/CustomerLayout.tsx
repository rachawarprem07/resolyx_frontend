import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerHeader } from './CustomerHeader';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors selection:bg-brand-indigo/20">
      <CustomerHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};
