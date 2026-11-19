import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Mail,
  Briefcase,
  Check,
  Copy,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';
import type { AdminUser, UserRole, PlatformRole } from '../../types/admin.types';
import { inviteUserApi, getEmailAccountsApi } from '@/lib/apiClient';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (user: AdminUser) => void;
  roles?: PlatformRole[];
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  roles: _roles,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Customer Care');
  const [role, setRole] = useState<UserRole>('Support Agent');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [inviteResult, setInviteResult] = useState<{
    inviteUrl: string;
    email: string;
    emailSent: boolean;
    emailDetail?: string | null;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [outgoingAccount, setOutgoingAccount] = useState<{ email: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function checkOutgoing() {
      try {
        const accs = await getEmailAccountsApi();
        const active = accs.find((a) => a.enable_outgoing);
        if (active) {
          setOutgoingAccount({ email: active.email });
        } else {
          setOutgoingAccount(null);
        }
      } catch {
        setOutgoingAccount(null);
      }
    }
    checkOutgoing();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    setName('');
    setEmail('');
    setDepartment('Customer Care');
    setRole('Support Agent');
    setFormError(null);
    setInviteResult(null);
    setIsCopied(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleCopyLink = () => {
    if (!inviteResult?.inviteUrl) return;
    navigator.clipboard.writeText(inviteResult.inviteUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email.trim()) {
      setFormError('Please enter both name and email.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map UI role label to system role code
      let roleCode = 'support_agent';
      const rLower = role.toLowerCase();
      if (rLower.includes('admin')) {
        roleCode = 'admin';
      } else if (rLower.includes('lead') || rLower.includes('supervisor')) {
        roleCode = 'team_lead';
      } else {
        roleCode = 'support_agent';
      }

      const res = await inviteUserApi({
        email: email.trim().toLowerCase(),
        full_name: name.trim(),
        role: roleCode,
        department,
      });

      const newUser: AdminUser = {
        id: String(res.id),
        name: res.full_name || name.trim(),
        email: res.email,
        department: res.department || department,
        organization: res.department || department,
        role,
        status: 'invited',
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      onInvite(newUser);

      setInviteResult({
        inviteUrl: res.invite_url,
        email: res.email,
        emailSent: res.email_sent,
        emailDetail: res.email_detail,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send invitation.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-border shadow-elevated p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Invite Agent</h3>
              <p className="text-xs text-foreground-muted">
                Send workspace access & password setup invitation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {/* Success View with Setup Link */}
        {inviteResult ? (
          <div className="mt-4 space-y-4 animate-in fade-in">
            <div
              className={`p-4 rounded-xl text-center space-y-1.5 border ${
                inviteResult.emailSent
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full text-white flex items-center justify-center mx-auto ${
                  inviteResult.emailSent ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4
                className={`text-sm font-bold ${
                  inviteResult.emailSent
                    ? 'text-emerald-900 dark:text-emerald-200'
                    : 'text-amber-900 dark:text-amber-200'
                }`}
              >
                {inviteResult.emailSent ? 'Invitation Email Sent!' : 'Invitation Link Ready!'}
              </h4>
              <p
                className={`text-xs ${
                  inviteResult.emailSent
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {inviteResult.emailSent
                  ? `Email sent to ${inviteResult.email}`
                  : (inviteResult.emailDetail || 'Email not sent: please share setup link below')}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Password Setup Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={inviteResult.inviteUrl}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-neutral-900 hover:bg-black text-white dark:bg-white dark:text-neutral-900'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-foreground-muted mt-1 leading-relaxed">
                {inviteResult.emailSent
                  ? 'An email invitation has been dispatched. You can also share the link above directly.'
                  : 'Share the link above with the agent so they can configure their password.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              >
                Invite Another
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  >
                    <option value="Customer Care">Customer Care</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Tier 1 Support">Tier 1 Support</option>
                    <option value="Billing & Accounts">Billing & Accounts</option>
                    <option value="IT & Administration">IT & Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="Admin">Admin</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Support Agent">Support Agent</option>
                </select>
              </div>
            </div>

            {/* Outgoing Mail Dispatch Notice */}
            {outgoingAccount ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Invitation email will be sent via <strong>{outgoingAccount.email}</strong></span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span>No outgoing Gmail account is configured. A password setup link will be generated for manual sharing.</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating Invite...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
