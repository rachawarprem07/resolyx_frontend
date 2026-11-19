import React, { useState } from 'react';
import { X, Plus, Building2, User, Mail, Phone, Ticket, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import type { AdminOrganization, CustomerContact } from '../../types/admin.types';
import { inviteUserApi } from '@/lib/apiClient';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (customer: AdminOrganization) => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [plan, setPlan] = useState<AdminOrganization['plan']>('Enterprise');
  const [status, setStatus] = useState<AdminOrganization['status']>('active');
  const [usersCount, setUsersCount] = useState<number>(25);

  // Primary Contact
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactRole, setPrimaryContactRole] = useState('');
  const [primaryContactPhone, setPrimaryContactPhone] = useState('');
  const [openTickets, setOpenTickets] = useState<number>(0);

  // Invite & Password Setup Flow
  const [sendInvite, setSendInvite] = useState(true);
  const [createdInvite, setCreatedInvite] = useState<{
    link: string;
    email: string;
    name: string;
    copied: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (!createdInvite) return;
    navigator.clipboard.writeText(createdInvite.link);
    setCreatedInvite((prev) => (prev ? { ...prev, copied: true } : null));
    setTimeout(() => {
      setCreatedInvite((prev) => (prev ? { ...prev, copied: false } : null));
    }, 2000);
  };

  const handleDone = () => {
    setCreatedInvite(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactEmail.trim() || !primaryContactName.trim()) return;

    const orgId = `org-${Date.now()}`;
    const cleanEmail = contactEmail.trim().toLowerCase();
    const cleanContactName = primaryContactName.trim();
    const cleanCompany = name.trim();

    const primaryContact: CustomerContact = {
      id: `ct-${Date.now()}`,
      name: cleanContactName,
      email: cleanEmail,
      phone: primaryContactPhone.trim() || '+1 (555) 000-0000',
      company: cleanCompany,
      role: primaryContactRole.trim() || 'Primary Stakeholder',
      openTickets: Number(openTickets) || 0,
      status: status === 'active' ? 'active' : 'inactive',
    };

    const newCustomer: AdminOrganization = {
      id: orgId,
      name: cleanCompany,
      contactEmail: cleanEmail,
      plan,
      usersCount: Number(usersCount) || 1,
      status,
      createdAt: 'Just now',
      primaryContactName: primaryContact.name,
      primaryContactRole: primaryContact.role,
      primaryContactPhone: primaryContact.phone,
      openTickets: Number(openTickets) || 0,
      contacts: [primaryContact],
    };

    onCreate(newCustomer);

    if (sendInvite) {
      // Generate invite link
      const inviteToken = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:5173';
      const setupUrl = `${origin}/setup-password?token=${inviteToken}&email=${encodeURIComponent(
        cleanEmail
      )}&name=${encodeURIComponent(cleanContactName)}&company=${encodeURIComponent(cleanCompany)}&role=customer`;

      // Dispatch invite via backend API if available
      try {
        await inviteUserApi({
          email: cleanEmail,
          full_name: cleanContactName,
          role: 'customer',
          department: cleanCompany,
        });
      } catch (err) {
        console.warn('Backend user invitation notice:', err);
      }

      setCreatedInvite({
        link: setupUrl,
        email: cleanEmail,
        name: cleanContactName,
        copied: false,
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {createdInvite ? (
          /* ========================================================= */
          /* INVITATION LINK READY VIEW                                */
          /* ========================================================= */
          <div className="space-y-5 py-2">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Customer Created &amp; Invite Ready
              </h3>
              <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                Customer organization and primary contact <strong className="text-foreground">{createdInvite.name}</strong> ({createdInvite.email}) have been saved.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-subtle border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-brand-indigo" />
                  Password Activation &amp; Setup Link
                </span>
                {createdInvite.copied && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="h-3 w-3" /> Copied to clipboard!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdInvite.link}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground text-xs font-mono select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-lg bg-brand-indigo text-white text-xs font-semibold hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{createdInvite.copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-foreground-muted leading-relaxed">
                Send this link to the customer. When opened, they can immediately set their password and gain access to the Customer Portal.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={createdInvite.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-indigo hover:underline font-semibold"
              >
                <span>Test Setup Link</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={handleDone}
                className="px-5 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-xs">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Add New Customer</h3>
                  <p className="text-[11px] text-foreground-muted">Register an organization and its primary contact person</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section: Organization Details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-indigo flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Organization Details
            </h4>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Company / Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Global Logistics"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Plan Tier</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as AdminOrganization['plan'])}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="Pro">Pro</option>
                  <option value="Starter">Starter</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AdminOrganization['status'])}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Seat License / Users Count</label>
                <input
                  type="number"
                  min="1"
                  value={usersCount}
                  onChange={(e) => setUsersCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-foreground-muted" /> Open Tickets
                </label>
                <input
                  type="number"
                  min="0"
                  value={openTickets}
                  onChange={(e) => setOpenTickets(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Primary Contact */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-indigo flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Primary Contact Person
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Contact Full Name *</label>
                <input
                  type="text"
                  required
                  value={primaryContactName}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Job Title / Role</label>
                <input
                  type="text"
                  value={primaryContactRole}
                  onChange={(e) => setPrimaryContactRole(e.target.value)}
                  placeholder="e.g. VP of Operations"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-foreground-muted" /> Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. marcus.vance@apexlogistics.com"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-foreground-muted" /> Phone Number
                </label>
                <input
                  type="text"
                  value={primaryContactPhone}
                  onChange={(e) => setPrimaryContactPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>
            </div>
          </div>

          {/* Invitation Checkbox */}
          <div className="pt-3 border-t border-border">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sendInvite}
                onChange={(e) => setSendInvite(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-brand-indigo focus:ring-brand-indigo"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-indigo" />
                  Generate Password Setup &amp; Activation Link
                </span>
                <p className="text-[11px] text-foreground-muted">
                  Generates an onboarding link for the primary contact to configure their password and access the Customer Portal.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Create Customer
            </button>
          </div>
        </form>
        </>
      )}
      </div>
    </div>
  );
};
