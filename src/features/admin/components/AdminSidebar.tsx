import React from 'react';
import { SidebarWorkspaceHeader } from './sidebar/SidebarWorkspaceHeader';
import { SidebarNavItem } from './sidebar/SidebarNavItem';
import { SidebarFooterCard } from './sidebar/SidebarFooterCard';
import { ADMIN_SIDEBAR_SECTIONS } from '../data/adminNavConfig';
import { getCurrentUser } from '@/lib/authSession';

interface AdminSidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-surface/95 backdrop-blur-md text-foreground transition-all duration-200">
      {/* 1. High-End Workspace Brand Header */}
      <SidebarWorkspaceHeader isCollapsed={isCollapsed} onCloseMobile={onCloseMobile} />

      {/* 2. Scrollable Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 scrollbar-none" aria-label="Admin Navigation">
        {/* Dynamic Categorized Enterprise Sections */}
        {ADMIN_SIDEBAR_SECTIONS.map((section, idx) => {
          const visibleItems = section.items.filter((item) => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className={idx === 0 ? '' : 'pt-2'}>
              {isCollapsed ? (
                <div className="my-1.5 h-px bg-border/60" />
              ) : (
                <div className="flex items-center gap-2 px-2.5 pt-2 pb-1 select-none">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-foreground-muted/60">
                    {section.title}
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-r from-border/70 to-transparent" />
                </div>
              )}

              <div className="space-y-0.5">
                {visibleItems.map((item) => (
                  <SidebarNavItem
                    key={item.id}
                    item={item}
                    isCollapsed={isCollapsed}
                    onCloseMobile={onCloseMobile}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* 3. High-End Bottom Status Footer */}
      <SidebarFooterCard isCollapsed={isCollapsed} />
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:block shrink-0 border-r border-border/80 h-screen sticky top-0 transition-all duration-200 z-40 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {sidebarContent}
      </aside>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-surface shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
