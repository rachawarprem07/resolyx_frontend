import React, { useState } from 'react';
import { ShieldCheck, Key, Check, Lock, Laptop } from 'lucide-react';
import { getCurrentUser } from '@/lib/authSession';

export const ProfilePage: React.FC = () => {
  const currentUser = getCurrentUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return;
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          My Profile
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
          Manage your Administrator credentials, account security, and active sessions.
        </p>
      </div>

      {/* 2. Admin Identity Card */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-brand-indigo text-white font-bold text-xl flex items-center justify-center shadow-md shrink-0">
          {currentUser.avatarInitials || 'SA'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">{currentUser.name || 'System Administrator'}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" /> {currentUser.role?.toUpperCase() || 'ADMIN'}
            </span>
          </div>
          <p className="text-xs font-mono text-foreground-muted mt-0.5">
            {currentUser.email || 'admin@resolyx.com'}
          </p>
          <p className="text-[11px] text-foreground-muted mt-1">
            Helpdesk Administrator • Full privileges across helpdesk, users, and AI configuration
          </p>
        </div>
      </div>

      {/* 3. Password & Security Form */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Key className="h-4 w-4 text-brand-indigo" />
          <h3 className="text-sm font-bold text-foreground">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-hover text-xs font-semibold shadow-sm transition-all"
          >
            {isSaved ? <Check className="h-4 w-4" /> : null}
            <span>{isSaved ? 'Password Updated' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* 4. Active Sessions & Security Info */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
        <h3 className="text-sm font-bold text-foreground">Current Session Information</h3>
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle/50 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-surface border border-border text-foreground">
              <Laptop className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Current Browser Session</p>
              <p className="text-[11px] text-foreground-muted font-mono">
                192.168.1.104 • Signed in today
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active Now
          </span>
        </div>
      </div>
    </div>
  );
};
