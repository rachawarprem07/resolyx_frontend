import React, { useState } from 'react';
import {
  Search,
  Users,
  UserPlus,
  Edit3,
  Copy,
  Check,
  Send,
  Trash2,
  Mail,
} from 'lucide-react';
import type { AdminUser, UserStatus, PlatformRole } from '../../types/admin.types';

interface UsersTableTabProps {
  users: AdminUser[];
  roles: PlatformRole[];
  onOpenInvite: () => void;
  onEditUser: (user: AdminUser) => void;
  onResendInvite?: (user: AdminUser) => void;
  onDeleteUser?: (id: string, email: string) => void;
}

export const UsersTableTab: React.FC<UsersTableTabProps> = ({
  users,
  roles,
  onOpenInvite,
  onEditUser,
  onResendInvite,
  onDeleteUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department || u.organization || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'invited':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'inactive':
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
    }
  };

  const handleCopyLink = (user: AdminUser) => {
    const url =
      user.inviteUrl ||
      `${window.location.origin}/accept-invite?token=${user.inviteToken || ''}`;
    navigator.clipboard.writeText(url);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const allRoleOptions = ['all', ...roles.map((r) => r.name)];

  return (
    <div className="space-y-4">
      {/* 1. Subheader & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">User Directory</h2>
          <p className="text-xs text-foreground-muted">
            All active administrators, helpdesk agents, and support team members.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenInvite}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Invite Agent</span>
        </button>
      </div>

      {/* 2. Search & Role Filter Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-subtle flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo placeholder:text-foreground-muted"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-foreground-muted hidden sm:inline">Role:</span>
          {allRoleOptions.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'bg-surface-subtle text-foreground-muted hover:text-foreground'
              }`}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Users Table */}
      <div className="rounded-2xl bg-surface border border-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/40 text-foreground-muted">
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Created Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-subtle/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-surface-subtle border border-border text-foreground flex items-center justify-center font-bold text-[11px] shrink-0">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="truncate max-w-[140px]">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground-muted font-mono">{user.email}</td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {user.department || user.organization || 'General Support'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-surface-subtle border-border text-foreground">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${getStatusBadge(
                          user.status,
                        )}`}
                      >
                        {user.status === 'invited' && <Mail className="w-2.5 h-2.5" />}
                        <span>{user.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground-muted">{user.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.status === 'invited' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(user)}
                              title="Copy Setup Password Link"
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                                copiedId === user.id
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-surface-subtle border border-border'
                              }`}
                            >
                              {copiedId === user.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-600" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>

                            {onResendInvite && (
                              <button
                                type="button"
                                onClick={() => onResendInvite(user)}
                                title="Resend invitation email"
                                className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
                              >
                                <Send className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => onEditUser(user)}
                          title="Edit User"
                          className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        {onDeleteUser && user.role !== 'Super Admin' && (
                          <button
                            type="button"
                            onClick={() => onDeleteUser(user.id, user.email)}
                            title="Remove User"
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-foreground-muted">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-medium">No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
