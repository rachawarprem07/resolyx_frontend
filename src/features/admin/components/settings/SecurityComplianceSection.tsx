import React, { useState } from 'react';
import { Shield, Key, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const SecurityComplianceSection: React.FC = () => {
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [idpMetadataUrl, setIdpMetadataUrl] = useState('https://auth.company.okta.com/app/resolyx/sso/saml');
  const [require2fa, setRequire2fa] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(60);
  const [passwordMinLength, setPasswordMinLength] = useState(12);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState(365);

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-5">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Shield className="h-5 w-5 text-brand-indigo" />
        <div>
          <h2 className="text-sm font-bold text-foreground">Security, SSO & Compliance</h2>
          <p className="text-xs text-foreground-muted">
            Enforce enterprise authentication policies, session timeouts, and audit trails.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface-subtle/40 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-brand-indigo" />
              SAML 2.0 / Single Sign-On (SSO)
            </h3>
            <p className="text-xs text-foreground-muted">
              Allow staff and clients to authenticate with Okta, Azure AD, or Google Workspace.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={ssoEnabled}
            onClick={() => setSsoEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              ssoEnabled ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${
                ssoEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {ssoEnabled && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-foreground mb-1">IdP Metadata XML / Discovery URL</label>
            <input
              type="url"
              value={idpMetadataUrl}
              onChange={(e) => setIdpMetadataUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-foreground text-xs font-mono focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-brand-indigo" />
            Two-Factor Authentication (2FA)
          </label>
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface-subtle">
            <span className="text-xs text-foreground font-medium">Enforce for all Staff & Admins</span>
            <button
              type="button"
              role="switch"
              aria-checked={require2fa}
              onClick={() => setRequire2fa((v) => !v)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                require2fa ? 'bg-brand-indigo' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition ${require2fa ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-brand-indigo" />
            Session Idle Timeout
          </label>
          <select
            value={sessionTimeoutMins}
            onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={60}>60 Minutes (Recommended)</option>
            <option value={240}>4 Hours</option>
            <option value={480}>8 Hours (Full Shift)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Password Minimum Length</label>
          <select
            value={passwordMinLength}
            onChange={(e) => setPasswordMinLength(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          >
            <option value={8}>8 Characters (Standard)</option>
            <option value={12}>12 Characters (High Security)</option>
            <option value={16}>16 Characters (Strict Compliance)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Audit Log Compliance Retention</label>
          <select
            value={auditLogRetentionDays}
            onChange={(e) => setAuditLogRetentionDays(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          >
            <option value={90}>90 Days</option>
            <option value={180}>180 Days</option>
            <option value={365}>365 Days (1 Year)</option>
            <option value={2555}>7 Years (HIPAA / SOC2)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Enterprise Security Baseline: SOC2 Type II and GDPR data protection active.</span>
      </div>
    </div>
  );
};

