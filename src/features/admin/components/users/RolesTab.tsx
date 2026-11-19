import React, { useState } from 'react';
import { Plus, Shield, Users, Edit3, CheckCircle2 } from 'lucide-react';
import { DEFAULT_PERMISSIONS } from '../../data/adminData';
import { CreateRoleModal } from './CreateRoleModal';
import type { PlatformRole } from '../../types/admin.types';

interface RolesTabProps {
  roles: PlatformRole[];
  onSaveRole: (role: PlatformRole) => void;
}

export const RolesTab: React.FC<RolesTabProps> = ({ roles, onSaveRole }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<PlatformRole | null>(null);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleOpenCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (role: PlatformRole, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRole(role);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Create Role Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Platform Roles & Access Levels</h2>
          <p className="text-xs text-foreground-muted">
            Configure system permissions and define custom roles for support staff and client
            admins.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white hover:bg-brand-indigo-hover text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Role</span>
        </button>
      </div>

      {/* 2. Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {roles.map((role) => {
          const isSelected = role.id === selectedRole?.id;
          return (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative shadow-subtle flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-indigo bg-brand-indigo/5 shadow-sm ring-1 ring-brand-indigo/30'
                  : 'border-border bg-surface hover:border-border-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield
                      className={`h-4 w-4 ${isSelected ? 'text-brand-indigo' : 'text-foreground-muted'}`}
                    />
                    <span className="text-xs font-bold text-foreground">{role.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-subtle border border-border text-foreground-muted">
                    {role.isSystem ? 'System' : 'Custom'}
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted line-clamp-2">{role.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {role.usersCount} users
                </span>
                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(role, e)}
                  className="text-[11px] font-semibold text-brand-indigo hover:text-brand-indigo-hover flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" />
                  <span>{role.isSystem ? 'View / Edit' : 'Edit'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Permissions Matrix for Selected Role */}
      {selectedRole && (
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {selectedRole.name} Permissions
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo">
                  {selectedRole.permissions.length} Granted
                </span>
              </div>
              <p className="text-xs text-foreground-muted mt-0.5">{selectedRole.description}</p>
            </div>
            <button
              type="button"
              onClick={(e) => handleOpenEdit(selectedRole, e)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface-subtle text-foreground hover:bg-surface text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Modify Permissions</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Helpdesk', 'AI & Automation', 'Users & Roles', 'Security'] as const).map(
              (category) => {
                const catPerms = DEFAULT_PERMISSIONS.filter((p) => p.category === category);
                return (
                  <div key={category} className="space-y-2">
                    <span className="text-xs font-bold text-foreground block pb-1 border-b border-border/60">
                      {category}
                    </span>
                    <div className="space-y-1.5">
                      {catPerms.map((perm) => {
                        const hasPerm = selectedRole.permissions.includes(perm.id);
                        return (
                          <div
                            key={perm.id}
                            className={`p-2 rounded-xl text-xs flex items-start gap-2 transition-colors ${
                              hasPerm
                                ? 'bg-emerald-500/10 text-foreground border border-emerald-500/20'
                                : 'bg-surface-subtle/40 text-foreground-muted/60 opacity-60'
                            }`}
                          >
                            <CheckCircle2
                              className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                                hasPerm
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                            <div>
                              <p className="font-semibold text-[11px]">{perm.name}</p>
                              <p className="text-[10px] text-foreground-muted leading-tight">
                                {perm.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      <CreateRoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveRole={onSaveRole}
        roleToEdit={editingRole}
      />
    </div>
  );
};
