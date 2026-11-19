import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { BRAND_ASSET_PATHS, PRODUCT_NAME } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';
import { getStoredCompany, type CompanyWorkspace } from '@/lib/authSession';

interface Props {
  isCollapsed: boolean;
  onCloseMobile: () => void;
}

export const SidebarWorkspaceHeader: React.FC<Props> = ({ isCollapsed, onCloseMobile }) => {
  const { customLogoUrl } = useTheme();
  const [company, setCompany] = useState<CompanyWorkspace | null>(getStoredCompany);

  useEffect(() => {
    const handleUpdate = () => {
      setCompany(getStoredCompany());
    };
    window.addEventListener('resolyx-company-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('resolyx-company-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const displayName = company?.name || PRODUCT_NAME;

  return (
    <div className={`flex h-16 items-center border-b border-border/80 px-3 shrink-0 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
      <NavLink
        to="/admin"
        className={`group flex items-center gap-3 rounded-xl border border-border/70 hover:border-brand-indigo/40 hover:bg-surface-subtle/60 transition-all duration-200 outline-none ${
          isCollapsed
            ? 'w-11 h-11 p-1 bg-surface-subtle/50 justify-center'
            : 'w-full px-2.5 py-2 bg-gradient-to-r from-surface-subtle/50 via-surface to-surface-subtle/30 shadow-subtle'
        }`}
        title={displayName}
      >
        {/* Workspace Brand Icon */}
        <div className="h-10 w-10 rounded-xl bg-surface-subtle dark:bg-[#1E2225] border border-border/80 flex items-center justify-center p-1 shrink-0 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
          <img
            src={customLogoUrl || BRAND_ASSET_PATHS.symbol}
            alt={displayName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Company Name */}
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-foreground tracking-tight truncate block">
              {displayName}
            </span>
          </div>
        )}
      </NavLink>

      <button
        type="button"
        onClick={onCloseMobile}
        className="lg:hidden p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
        aria-label="Close navigation"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};
