import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Building2,
  Edit,
  Users,
  Mail,
  Phone,
  Ticket,
  User,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import type { AdminOrganization } from '../types/admin.types';
import { EditCustomerModal } from '../components/customers/EditCustomerModal';
import { CreateCustomerModal } from '../components/customers/CreateCustomerModal';
import { CustomerContactsModal } from '../components/customers/CustomerContactsModal';

const STORAGE_KEY = 'resolyx_customers_v4';

// Completely empty by default - no seed/dummy customers
const DEFAULT_CUSTOMERS: AdminOrganization[] = [];

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<AdminOrganization[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CUSTOMERS;
  });

  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<AdminOrganization | null>(null);
  const [contactsModalCustomer, setContactsModalCustomer] = useState<AdminOrganization | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers to localStorage', e);
    }
  }, [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (planFilter !== 'all' && c.plan.toLowerCase() !== planFilter.toLowerCase()) return false;
      if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesCompany = c.name.toLowerCase().includes(q);
        const matchesEmail = c.contactEmail.toLowerCase().includes(q);
        const matchesContactName = c.primaryContactName?.toLowerCase().includes(q);
        const matchesContactRole = c.primaryContactRole?.toLowerCase().includes(q);
        const matchesPhone = c.primaryContactPhone?.toLowerCase().includes(q);
        const matchesPlan = c.plan.toLowerCase().includes(q);
        return Boolean(matchesCompany || matchesEmail || matchesContactName || matchesContactRole || matchesPhone || matchesPlan);
      }
      return true;
    });
  }, [customers, planFilter, statusFilter, search]);

  const handleSaveCustomer = (updated: AdminOrganization) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleCreateCustomer = (newCustomer: AdminOrganization) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleDeleteCustomer = (customerId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" and its associated contact directory?`)) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    }
  };

  // Quick stats
  const totalCustomers = customers.length;
  const totalContacts = customers.reduce((acc, c) => acc + (c.contacts?.length || (c.primaryContactName ? 1 : 0)), 0);
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const openTicketsCount = customers.reduce((acc, c) => acc + (c.openTickets || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Directory of enterprise accounts, primary contact persons, technical stakeholders, and seat licenses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold shadow-sm hover:opacity-90 self-start sm:self-auto transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">Total Organizations</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">{totalCustomers}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">Total Stakeholders</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">{totalContacts}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">Active Accounts</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">{activeCustomers}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground-muted">Open Customer Tickets</p>
            <p className="text-lg sm:text-xl font-bold text-foreground">{openTicketsCount}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact person, email, role, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Plan filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'Enterprise', 'Pro', 'Starter'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlanFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  planFilter === p
                    ? 'bg-brand-indigo text-white shadow-sm'
                    : 'bg-surface border border-border text-foreground-muted hover:text-foreground'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Status filter pills */}
          <div className="flex items-center gap-1">
            {['all', 'active', 'pending'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  statusFilter === s
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-surface border border-border text-foreground-muted hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className="rounded-2xl bg-surface border border-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/50 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                <th className="px-4 py-3">Customer / Organization</th>
                <th className="px-4 py-3">Primary Contact</th>
                <th className="px-4 py-3">Contact Details</th>
                <th className="px-4 py-3">Plan Tier</th>
                <th className="px-4 py-3">Seats & Tickets</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-foreground-muted">
                    No customers match the current filter or search query.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const contactCount = c.contacts?.length || (c.primaryContactName ? 1 : 0);
                  return (
                    <tr key={c.id} className="hover:bg-surface-subtle/40 transition-colors">
                      {/* Customer / Company */}
                      <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-xs shrink-0">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs">{c.name}</p>
                            <p className="text-[10px] text-foreground-muted font-normal">Created {c.createdAt}</p>
                          </div>
                        </div>
                      </td>

                      {/* Primary Contact Person */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-surface-subtle border border-border flex items-center justify-center font-bold text-[10px] text-foreground-muted shrink-0">
                            {(c.primaryContactName || c.name)
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-xs">
                              {c.primaryContactName || 'Designated Lead'}
                            </p>
                            <p className="text-[10px] text-foreground-muted">
                              {c.primaryContactRole || 'Account Owner'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info (Email & Phone) */}
                      <td className="px-4 py-3 text-foreground-muted whitespace-nowrap">
                        <div className="space-y-0.5">
                          <a
                            href={`mailto:${c.contactEmail}`}
                            className="flex items-center gap-1 hover:text-brand-indigo hover:underline text-xs"
                          >
                            <Mail className="h-3 w-3 text-foreground-muted" /> {c.contactEmail}
                          </a>
                          {c.primaryContactPhone && (
                            <a
                              href={`tel:${c.primaryContactPhone}`}
                              className="flex items-center gap-1 hover:text-brand-indigo text-[11px]"
                            >
                              <Phone className="h-3 w-3 text-foreground-muted" /> {c.primaryContactPhone}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Plan Tier */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.plan === 'Enterprise'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                              : c.plan === 'Pro'
                              ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {c.plan}
                        </span>
                      </td>

                      {/* Seats & Tickets */}
                      <td className="px-4 py-3 text-foreground whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1 text-xs">
                            <Users className="h-3.5 w-3.5 text-foreground-muted" /> {c.usersCount} seats
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-foreground-muted">
                            <Ticket className="h-3 w-3 text-foreground-muted" /> {c.openTickets || 0} open tickets
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-semibold capitalize ${
                            c.status === 'active'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : c.status === 'pending'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              c.status === 'active'
                                ? 'bg-emerald-500'
                                : c.status === 'pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {c.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setContactsModalCustomer(c)}
                            title="View all stakeholders for this organization"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground transition-colors"
                          >
                            <User className="h-3 w-3 text-brand-indigo" /> Contacts ({contactCount})
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCustomer(c)}
                            title="Edit customer and contact details"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-foreground transition-colors"
                          >
                            <Edit className="h-3 w-3 text-brand-indigo" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomer(c.id, c.name)}
                            title="Delete customer"
                            className="p-1 rounded-lg border border-border bg-surface hover:bg-rose-500/10 hover:text-rose-500 text-foreground-muted transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isCreateOpen && (
        <CreateCustomerModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateCustomer}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          isOpen={Boolean(editingCustomer)}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSaveCustomer}
        />
      )}

      {contactsModalCustomer && (
        <CustomerContactsModal
          customer={contactsModalCustomer}
          isOpen={Boolean(contactsModalCustomer)}
          onClose={() => setContactsModalCustomer(null)}
          onUpdateCustomer={(updated) => {
            handleSaveCustomer(updated);
            setContactsModalCustomer(updated);
          }}
        />
      )}
    </div>
  );
};
