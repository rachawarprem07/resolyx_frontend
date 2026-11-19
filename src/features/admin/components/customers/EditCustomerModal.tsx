import React, { useState } from 'react';
import { X, Check, Building2, User, Mail, Phone, Ticket } from 'lucide-react';
import type { AdminOrganization, CustomerContact } from '../../types/admin.types';

interface EditCustomerModalProps {
  customer: AdminOrganization;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: AdminOrganization) => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ customer, isOpen, onClose, onSave }) => {
  const [name, setName] = useState(customer.name);
  const [contactEmail, setContactEmail] = useState(customer.contactEmail);
  const [plan, setPlan] = useState(customer.plan);
  const [status, setStatus] = useState(customer.status);
  const [usersCount, setUsersCount] = useState(customer.usersCount);

  // Primary Contact Details
  const [primaryContactName, setPrimaryContactName] = useState(customer.primaryContactName || '');
  const [primaryContactRole, setPrimaryContactRole] = useState(customer.primaryContactRole || '');
  const [primaryContactPhone, setPrimaryContactPhone] = useState(customer.primaryContactPhone || '');
  const [openTickets, setOpenTickets] = useState(customer.openTickets ?? 0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedContacts: CustomerContact[] = customer.contacts ? [...customer.contacts] : [];
    if (primaryContactName) {
      const existingIdx = updatedContacts.findIndex(
        (c) => c.name.toLowerCase() === (customer.primaryContactName || '').toLowerCase()
      );
      const existingContact = existingIdx >= 0 ? updatedContacts[existingIdx] : undefined;
      const contactObj: CustomerContact = {
        id: existingContact ? existingContact.id : `ct-${Date.now()}`,
        name: primaryContactName,
        email: contactEmail,
        phone: primaryContactPhone,
        company: name,
        role: primaryContactRole || 'Primary Stakeholder',
        openTickets: openTickets,
        status: status === 'active' ? 'active' : 'inactive',
      };
      if (existingIdx >= 0) {
        updatedContacts[existingIdx] = contactObj;
      } else if (updatedContacts.length === 0) {
        updatedContacts.push(contactObj);
      }
    }

    onSave({
      ...customer,
      name,
      contactEmail,
      plan: plan as AdminOrganization['plan'],
      status: status as AdminOrganization['status'],
      usersCount: Number(usersCount) || 1,
      primaryContactName,
      primaryContactRole,
      primaryContactPhone,
      openTickets: Number(openTickets) || 0,
      contacts: updatedContacts,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-xs">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Edit Customer & Contact Info</h3>
              <p className="text-[11px] text-foreground-muted">Update organization profile and primary stakeholder</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section: Organization Info */}
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
                placeholder="e.g. Acme Corporation"
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

          {/* Section: Primary Contact Person */}
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
                  placeholder="e.g. James Wilson"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Job Title / Role</label>
                <input
                  type="text"
                  value={primaryContactRole}
                  onChange={(e) => setPrimaryContactRole(e.target.value)}
                  placeholder="e.g. Chief Security Officer"
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
                  placeholder="e.g. james.wilson@hyperioncap.com"
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
                  placeholder="e.g. +1 (555) 456-7890"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Check className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
