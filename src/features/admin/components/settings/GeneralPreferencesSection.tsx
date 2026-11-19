import React, { useState } from 'react';
import { Sliders, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const GeneralPreferencesSection: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [platformName, setPlatformName] = useState('Resolyx Helpdesk');
  const [supportEmail, setSupportEmail] = useState('support@resolyx.internal');
  const [autoAssign, setAutoAssign] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="space-y-6">
      {/* 1. General Platform Settings */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="h-4 w-4 text-brand-indigo" />
          <h2 className="text-sm font-bold text-foreground">General Platform Settings</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Platform Name</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Platform Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
        </div>
      </div>

      {/* 2. Routing & Escalation */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Bell className="h-4 w-4 text-brand-indigo" />
          <h2 className="text-sm font-bold text-foreground">Default Routing & Preferences</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <h3 className="text-xs font-bold text-foreground">Automatic Agent Assignment</h3>
              <p className="text-xs text-foreground-muted">Route unassigned tickets to online agents round-robin.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoAssign}
              onClick={() => setAutoAssign((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                autoAssign ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${
                  autoAssign ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-border pt-3">
            <div>
              <h3 className="text-xs font-bold text-foreground">Admin Escalation Alerts</h3>
              <p className="text-xs text-foreground-muted">Receive email alerts when high-priority tickets risk SLA breach.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={emailAlerts}
              onClick={() => setEmailAlerts((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                emailAlerts ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${
                  emailAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Color Scheme Appearance */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-foreground">Color Scheme Appearance</h2>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'dark', label: 'Dark Mode', icon: Moon },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id as 'light' | 'dark')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === item.id
                  ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo'
                  : 'border-border bg-surface-subtle text-foreground-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

