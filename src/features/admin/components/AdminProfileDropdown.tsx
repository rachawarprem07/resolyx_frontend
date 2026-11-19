import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, Sparkles, LogOut, ChevronDown, CheckCircle2, Inbox } from 'lucide-react';
import { getCurrentUser, clearCurrentUser } from '@/lib/authSession';

export const AdminProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSignOut = () => {
    clearCurrentUser();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-surface-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo select-none"
        aria-expanded={isOpen}
      >
        <div className="h-8 w-8 rounded-lg bg-brand-indigo text-white font-bold text-xs flex items-center justify-center shadow-sm">
          {currentUser.avatarInitials}
        </div>
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-xs font-semibold text-foreground">{currentUser.name}</span>
          <span className="text-[10px] text-brand-indigo font-medium capitalize">
            {currentUser.role.replace('_', ' ')}
          </span>
        </div>
        <ChevronDown className="hidden md:block h-3.5 w-3.5 text-foreground-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-border shadow-elevated z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="p-3.5 border-b border-border bg-surface-subtle/40">
            <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
            <p className="text-[11px] text-foreground-muted font-mono truncate mt-0.5">
              {currentUser.email}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
              <CheckCircle2 className="h-2.5 w-2.5" />
              <span>{currentUser.title}</span>
            </div>
          </div>

          <div className="p-1.5 space-y-0.5">
            <Link
              to="/admin/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors"
            >
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/agent"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors"
            >
              <Inbox className="h-3.5 w-3.5 text-brand-indigo" />
              <span>Agent Resolution Station</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="?settings=open"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Settings & Mailboxes</span>
                </Link>
                <Link
                  to="/admin/ai-settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle rounded-lg transition-colors group"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-violet group-hover:scale-110 transition-transform" />
                  <span className="flex-1">AI Settings</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-brand-violet/10 text-brand-violet border border-brand-violet/20 uppercase">
                    AI
                  </span>
                </Link>
              </>
            )}
          </div>

          <div className="p-1.5 border-t border-border">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
