import React, { useState } from 'react';
import { X, Plus, User, Mail, Phone, Ticket, Trash2, Building2, Check } from 'lucide-react';
import type { AdminOrganization, CustomerContact } from '../../types/admin.types';

interface CustomerContactsModalProps {
  customer: AdminOrganization;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCustomer: (updated: AdminOrganization) => void;
}

export const CustomerContactsModal: React.FC<CustomerContactsModalProps> = ({
  customer,
  isOpen,
  onClose,
  onUpdateCustomer,
}) => {
  const [contacts, setContacts] = useState<CustomerContact[]>(() => {
    if (customer.contacts && customer.contacts.length > 0) {
      return customer.contacts;
    }
    // Fallback: create from primary contact
    if (customer.primaryContactName) {
      return [
        {
          id: `ct-${Date.now()}`,
          name: customer.primaryContactName,
          email: customer.contactEmail,
          phone: customer.primaryContactPhone || '+1 (555) 000-0000',
          company: customer.name,
          role: customer.primaryContactRole || 'Primary Stakeholder',
          openTickets: customer.openTickets || 0,
          status: 'active',
        },
      ];
    }
    return [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('');

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newContact: CustomerContact = {
      id: `ct-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+1 (555) 000-0000',
      company: customer.name,
      role: newRole.trim() || 'Technical Contact',
      openTickets: 0,
      status: 'active',
    };

    const updated = [newContact, ...contacts];
    setContacts(updated);
    onUpdateCustomer({
      ...customer,
      contacts: updated,
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('');
    setIsAdding(false);
  };

  const handleDeleteContact = (contactId: string) => {
    const updated = contacts.filter((c) => c.id !== contactId);
    setContacts(updated);
    onUpdateCustomer({
      ...customer,
      contacts: updated,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface border border-border shadow-2xl p-6 space-y-5 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-sm shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{customer.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                  {customer.plan}
                </span>
              </div>
              <p className="text-xs text-foreground-muted">
                {contacts.length} Designated Contact{contacts.length === 1 ? '' : 's'} & Stakeholders
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Stakeholder Directory</span>
          {!isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="h-3.5 w-3.5" /> Add Contact
            </button>
          )}
        </div>

        {/* Add Contact Form Inline */}
        {isAdding && (
          <form onSubmit={handleAddContact} className="p-4 rounded-xl border border-brand-indigo/30 bg-brand-indigo/[0.03] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-brand-indigo flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> New Stakeholder for {customer.name}
              </h4>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-foreground-muted hover:text-foreground"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">Role / Job Title</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. IT Systems Lead"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. sarah.j@example.com"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 789-0123"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 rounded-lg border border-border text-xs text-foreground hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-indigo text-white text-xs font-semibold hover:opacity-90"
              >
                <Check className="h-3 w-3" /> Save Stakeholder
              </button>
            </div>
          </form>
        )}

        {/* Contacts List */}
        <div className="divide-y divide-border rounded-xl border border-border bg-surface overflow-hidden">
          {contacts.length === 0 ? (
            <div className="py-8 text-center text-xs text-foreground-muted">
              No contacts registered for this customer yet. Click &quot;Add Contact&quot; above to add one.
            </div>
          ) : (
            contacts.map((contact, idx) => (
              <div key={contact.id || idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-surface-subtle/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-xs shrink-0">
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-xs">{contact.name}</p>
                      {contact.role && (
                        <span className="text-[10px] text-foreground-muted bg-surface-subtle px-1.5 py-0.5 rounded border border-border">
                          {contact.role}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-foreground-muted">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-brand-indigo hover:underline">
                        <Mail className="h-3 w-3" /> {contact.email}
                      </a>
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-brand-indigo">
                          <Phone className="h-3 w-3" /> {contact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] text-foreground-muted">
                    <Ticket className="h-3 w-3" /> {contact.openTickets || 0} tickets
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(contact.id)}
                    title="Remove Contact"
                    className="p-1.5 rounded-lg text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
