import React, { useState, useEffect } from 'react';
import { X, UserCheck, Trash2 } from 'lucide-react';
import type { AdminUser, UserStatus, PlatformRole } from '../../types/admin.types';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSave: (updatedUser: AdminUser) => void;
  onDelete?: (userId: string) => void;
  roles?: PlatformRole[];
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  onDelete,
  roles: _roles,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Tier 1 Support');
  const [role, setRole] = useState('Support Agent');
  const [status, setStatus] = useState<UserStatus>('active');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setDepartment(user.department || user.organization || 'Support');
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      ...user,
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      organization: department.trim(),
      role,
      status,
    });
    onClose();
  };

  const roleOptions = ['Admin', 'Team Lead', 'Support Agent'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-border shadow-elevated p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Edit User Account</h3>
              <p className="text-xs text-foreground-muted">Update user role, department & access status</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-foreground-muted hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Department / Team</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                {roleOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="active">Active (Access Enabled)</option>
              <option value="invited">Invited (Pending Activation)</option>
              <option value="inactive">Inactive (Suspended)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(user.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:bg-surface-subtle">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-indigo hover:bg-brand-indigo-hover text-white transition-all shadow-sm">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

