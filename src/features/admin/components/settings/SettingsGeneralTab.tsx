import React, { useState, useEffect } from 'react';
import { Edit2, Lock, ChevronDown, Check, Palette, UserPlus, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';
import { getCurrentUser } from '@/lib/authSession';
import {
  getGeneralSettings,
  saveGeneralSettings,
  subscribeGeneralSettings,
  type GeneralSettings,
} from '@/lib/generalSettings';

interface Props {
  onNavigateTab?: (tab: 'branding') => void;
}

export const SettingsGeneralTab: React.FC<Props> = ({ onNavigateTab }) => {
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser.name || 'System Administrator');
  const [email] = useState(currentUser.email || 'admin@resolyx.com');
  const [isEditingName, setIsEditingName] = useState(false);
  const [availability, setAvailability] = useState<'Active' | 'Busy' | 'Away' | 'Offline'>('Active');
  const [isAvailMenuOpen, setIsAvailMenuOpen] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [signature, setSignature] = useState(
    `Best regards,\n${currentUser.name || 'System Administrator'}\n${currentUser.title || 'Helpdesk Administrator'} | Resolyx`,
  );
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Customer Access & Self-Signup Settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(() => getGeneralSettings());

  useEffect(() => {
    return subscribeGeneralSettings((updated) => {
      setGeneralSettings(updated);
    });
  }, []);

  const handleToggleCustomerSignup = () => {
    const nextVal = !generalSettings.customerSignupEnabled;
    const updated = saveGeneralSettings({ customerSignupEnabled: nextVal });
    setGeneralSettings(updated);
    triggerFeedback(
      nextVal
        ? 'Customer self-registration enabled. Visitors can now sign up directly from login.'
        : 'Customer self-registration disabled. Customers can only be added or invited by administrators.'
    );
  };

  const handleToggleOtpVerification = () => {
    const nextVal = !generalSettings.requireOtpVerification;
    const updated = saveGeneralSettings({ requireOtpVerification: nextVal });
    setGeneralSettings(updated);
    triggerFeedback(
      nextVal
        ? 'Email & OTP verification is now required for customer activation.'
        : 'Email verification bypassed. Immediate customer portal access enabled.'
    );
  };

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {feedback && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">{feedback}</div>}

      {/* 1. Profile Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Profile</h2>
          <p className="text-xs text-foreground-muted">Manage your profile information.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center text-lg font-bold text-foreground">
              {name.charAt(0).toUpperCase() || currentUser.avatarInitials}
            </div>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-surface" />
          </div>

          <div className="space-y-0.5">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="px-2 py-1 rounded-lg border border-border bg-surface text-foreground text-sm font-bold focus:ring-2 focus:ring-brand-indigo" />
                <button type="button" onClick={() => setIsEditingName(false)} className="p-1 rounded text-emerald-600"><Check className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">{name}</h3>
                <button type="button" onClick={() => setIsEditingName(true)} className="text-foreground-muted hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></button>
              </div>
            )}
            <p className="text-xs text-foreground-muted">{email}</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* 2. Account Info & Security */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Account Info & Security</h3>

        {/* Availability */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          <div>
            <h4 className="text-xs font-semibold text-foreground">Availability</h4>
            <p className="text-xs text-foreground-muted">Set your availability so your team knows when you're reachable.</p>
          </div>
          <div className="relative">
            <button type="button" onClick={() => setIsAvailMenuOpen((v) => !v)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface-subtle text-xs font-semibold text-foreground hover:bg-surface">
              <span className={`h-2 w-2 rounded-full ${availability === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{availability}</span>
              <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
            </button>
            {isAvailMenuOpen && (
              <div className="absolute right-0 mt-1 w-28 rounded-xl bg-surface border border-border shadow-elevated z-20 py-1">
                {(['Active', 'Busy', 'Away', 'Offline'] as const).map((s) => (
                  <button key={s} type="button" onClick={() => { setAvailability(s); setIsAvailMenuOpen(false); }} className="w-full px-3 py-1.5 text-xs text-left hover:bg-surface-subtle text-foreground">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workspace Theme & Logo Customization */}
        {onNavigateTab && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-border">
            <div>
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-brand-indigo" />
                Theme Color & Logo Customization
              </h4>
              <p className="text-xs text-foreground-muted">Customize workspace branding, upload custom logos, and pick Excel palette colors.</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('branding')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo/20 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <span>Customize Branding</span>
            </button>
          </div>
        )}

        {/* Emails & Signature */}
        <div className="py-2 border-t border-border space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Emails & Signature</h4>
              <p className="text-xs text-foreground-muted">Manage your account emails and email signature for communication.</p>
            </div>
            <button type="button" onClick={() => setShowSignature((v) => !v)} className="px-4 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground self-start sm:self-auto">
              {showSignature ? 'Close' : 'Configure'}
            </button>
          </div>
          {showSignature && (
            <div className="p-3 rounded-xl border border-border bg-surface-subtle space-y-2">
              <textarea rows={3} value={signature} onChange={(e) => setSignature(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-border bg-surface text-foreground" />
              <button type="button" onClick={() => { setShowSignature(false); triggerFeedback('Email signature saved.'); }} className="px-3 py-1 rounded-lg bg-brand-indigo text-white text-xs font-semibold">Save Signature</button>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="py-2 border-t border-border space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Password</h4>
              <p className="text-xs text-foreground-muted">Change your account password for security.</p>
            </div>
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground self-start sm:self-auto">
              <Lock className="h-3.5 w-3.5 text-foreground-muted" />
              <span>{showPassword ? 'Close' : 'Change Password'}</span>
            </button>
          </div>
          {showPassword && (
            <div className="p-3 rounded-xl border border-border bg-surface-subtle space-y-2 max-w-sm">
              <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 text-xs rounded-lg border border-border bg-surface text-foreground" />
              <button type="button" onClick={() => { setShowPassword(false); setNewPassword(''); triggerFeedback('Password updated.'); }} className="px-3 py-1 rounded-lg bg-brand-indigo text-white text-xs font-semibold">Update Password</button>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* 3. Customer Access & Registration Control */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-brand-indigo" />
              Customer Registration & Access Control
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              Control whether external customers can self-signup from the login screen or must be invited by an admin.
            </p>
          </div>
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
              generalSettings.customerSignupEnabled
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}
          >
            {generalSettings.customerSignupEnabled ? 'Self-Signup Enabled' : 'Admin Invite Only'}
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-surface-subtle/50 p-4 space-y-4">
          {/* Toggle 1: Allow Customer Self-Signup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">Allow Customer Self-Signup from Login Page</span>
                {generalSettings.customerSignupEnabled ? (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Public Sign-Up Open
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    Admin Managed
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground-muted">
                When enabled, external clients and customers can create accounts directly from the login page (/signup).
                When disabled, self-registration is closed and customers can only be invited or created by an administrator.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-label="Allow Customer Self-Signup from Login Page"
              aria-checked={generalSettings.customerSignupEnabled}
              onClick={handleToggleCustomerSignup}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 ${
                generalSettings.customerSignupEnabled ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generalSettings.customerSignupEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-border/60" />

          {/* Toggle 2: Require OTP / Email Verification */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-indigo" />
                  Require Email / OTP Verification
                </span>
                {generalSettings.requireOtpVerification ? (
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    Verification Enforced
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    Instant Access
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground-muted">
                Sends a one-time verification passcode (OTP) or password activation email to verify customer identity
                before granting customer portal access.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-label="Require Email / OTP Verification"
              aria-checked={generalSettings.requireOtpVerification}
              onClick={handleToggleOtpVerification}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:ring-offset-2 ${
                generalSettings.requireOtpVerification ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  generalSettings.requireOtpVerification ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-3 rounded-xl bg-surface border border-border/80 flex items-start gap-2.5 text-xs text-foreground-muted">
            {generalSettings.customerSignupEnabled ? (
              <>
                <Mail className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Self-Registration active: </span>
                  Customers can access <strong className="text-brand-indigo">/signup</strong> from the login page, submit their name, email, company, and password, and complete OTP activation.
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Admin-only mode active: </span>
                  Self-registration is locked on the login page. Only workspace administrators can add or invite customers via <strong className="text-brand-indigo">Admin &gt; Customers</strong>.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
