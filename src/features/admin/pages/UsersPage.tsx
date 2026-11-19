import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle2, Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_ROLES } from '../data/adminData';
import { UsersTableTab } from '../components/users/UsersTableTab';
import { RolesTab } from '../components/users/RolesTab';
import { InviteUserModal } from '../components/users/InviteUserModal';
import { EditUserModal } from '../components/users/EditUserModal';
import type { AdminUser, PlatformRole, UserStatus } from '../types/admin.types';
import { getCurrentUser } from '@/lib/authSession';
import {
  getUsersApi,
  resendInviteApi,
  deleteUserApi,
  updateUserApi,
  type UserDetail,
} from '@/lib/apiClient';

function mapApiUserToAdminUser(u: UserDetail): AdminUser {
  let roleLabel = 'Support Agent';
  const r = (u.role || '').toLowerCase();
  if (r === 'super_admin' || r === 'admin') roleLabel = 'Admin';
  else if (r === 'supervisor' || r === 'lead' || r === 'team_lead') roleLabel = 'Team Lead';
  else roleLabel = 'Support Agent';

  return {
    id: String(u.id),
    name: u.full_name || (u.email ? u.email.split('@')[0] : 'User') || 'User',
    email: u.email,
    department: u.department || 'Customer Care',
    organization: u.department || 'Customer Care',
    role: roleLabel,
    status: (u.status || (u.is_active ? 'active' : 'invited')) as UserStatus,
    createdAt: new Date(u.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    inviteUrl: u.invite_url || undefined,
    inviteToken: u.invite_token || undefined,
  };
}

export const UsersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<PlatformRole[]>(DEFAULT_ROLES);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const apiUsers = await getUsersApi();
      const mapped = apiUsers.map(mapApiUserToAdminUser);
      setUsers(mapped);
    } catch {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const triggerToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleInviteUser = (newUser: AdminUser) => {
    setUsers((prev) => [newUser, ...prev]);
    fetchUsers();
    triggerToast(`Invitation sent for ${newUser.email}`);
  };

  const currentUser = getCurrentUser();
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const rolesWithCounts: PlatformRole[] = roles.map((r) => ({
    ...r,
    usersCount: users.filter((u) => u.role.toLowerCase() === r.name.toLowerCase()).length,
  }));

  const handleUpdateUser = async (updatedUser: AdminUser) => {
    try {
      let roleCode = 'support_agent';
      const rLower = updatedUser.role.toLowerCase();
      if (rLower === 'admin') roleCode = 'admin';
      else if (rLower === 'team lead' || rLower === 'team_lead') roleCode = 'team_lead';
      else roleCode = 'support_agent';

      if (!isNaN(Number(updatedUser.id))) {
        await updateUserApi(Number(updatedUser.id), {
          full_name: updatedUser.name,
          department: updatedUser.department,
          role: roleCode,
          status: updatedUser.status,
        });
      }
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      fetchUsers();
      triggerToast(`User '${updatedUser.email}' updated successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update user.';
      triggerToast(msg);
    }
  };

  const handleResendInvite = async (user: AdminUser) => {
    try {
      const res = await resendInviteApi(Number(user.id));
      triggerToast(`Fresh invitation link sent to ${res.email}`);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend invite.';
      triggerToast(msg);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove user '${email}'?`)) {
      try {
        await deleteUserApi(Number(id));
        setUsers((prev) => prev.filter((u) => u.id !== id));
        triggerToast(`User '${email}' removed.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete user.';
        triggerToast(msg);
      }
    }
  };

  const handleSaveRole = (savedRole: PlatformRole) => {
    setRoles((prev) => {
      const exists = prev.some((r) => r.id === savedRole.id);
      if (exists) {
        return prev.map((r) => (r.id === savedRole.id ? savedRole : r));
      }
      return [...prev, savedRole];
    });
  };

  // If a Team Lead visits /admin/users, present a clear access indicator
  if (!isAdmin) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Administrator Access Required</h2>
          <p className="text-xs text-foreground-muted mt-2 leading-relaxed">
            User provisioning, role security permissions, and mailbox configurations are restricted to
            Workspace Administrators. As a Team Lead, your operational tools (Ticket Queues, Knowledge Base, and Teams) are active.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/admin/tickets"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-sm hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Ticket Operations</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Users & Access Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
            Manage real workspace accounts, invite agents with secure password setup links, and
            configure roles.
          </p>
        </div>

        {/* Status Toast */}
        {toastNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in self-start sm:self-auto">
            <CheckCircle2 className="h-4 w-4" />
            <span>{toastNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold'
              : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>All Users</span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-subtle text-[10px] text-foreground-muted font-mono">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'roles'
              ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white font-bold'
              : 'border-transparent text-foreground-muted hover:text-foreground'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Roles & Permissions</span>
          <span className="px-1.5 py-0.5 rounded-full bg-surface-subtle text-[10px] text-foreground-muted font-mono">
            {roles.length}
          </span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {isLoading ? (
        <div className="py-16 text-center text-foreground-muted space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-indigo" />
          <p className="text-xs font-medium">Loading workspace users...</p>
        </div>
      ) : activeTab === 'users' ? (
        <UsersTableTab
          users={users}
          roles={rolesWithCounts}
          onOpenInvite={() => setIsInviteModalOpen(true)}
          onEditUser={(user) => setEditingUser(user)}
          onResendInvite={handleResendInvite}
          onDeleteUser={handleDeleteUser}
        />
      ) : (
        <RolesTab roles={rolesWithCounts} onSaveRole={handleSaveRole} />
      )}

      {/* 4. Modals */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteUser}
        roles={rolesWithCounts}
      />

      <EditUserModal
        isOpen={Boolean(editingUser)}
        user={editingUser}
        roles={rolesWithCounts}
        onClose={() => setEditingUser(null)}
        onSave={handleUpdateUser}
      />
    </div>
  );
};
