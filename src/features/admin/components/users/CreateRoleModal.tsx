import React, { useState, useEffect } from 'react';
import { X, Shield, Check } from 'lucide-react';
import { DEFAULT_PERMISSIONS } from '../../data/adminData';
import { RolePermissionsSelector } from './RolePermissionsSelector';
import type { PlatformRole, PermissionCategory } from '../../types/admin.types';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: PlatformRole) => void;
  roleToEdit?: PlatformRole | null;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSaveRole,
  roleToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name);
      setDescription(roleToEdit.description);
      setSelectedPermissions(roleToEdit.permissions);
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions(['tickets.view', 'ai.use']);
    }
  }, [roleToEdit, isOpen]);

  if (!isOpen) return null;

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleCategory = (category: PermissionCategory) => {
    const catPermIds = DEFAULT_PERMISSIONS.filter((p) => p.category === category).map((p) => p.id);
    const allSelected = catPermIds.every((id) => selectedPermissions.includes(id));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((id) => !catPermIds.includes(id)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...catPermIds])));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const role: PlatformRole = {
      id: roleToEdit ? roleToEdit.id : `role-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom platform role',
      isSystem: roleToEdit ? roleToEdit.isSystem : false,
      permissions: selectedPermissions,
      usersCount: roleToEdit ? roleToEdit.usersCount : 0,
      color: roleToEdit?.color || 'brand-indigo',
    };

    onSaveRole(role);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-surface border border-border shadow-elevated p-5 sm:p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-indigo/10 text-brand-indigo">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {roleToEdit ? 'Edit Role Permissions' : 'Create New Role'}
              </h3>
              <p className="text-xs text-foreground-muted">
                Define access levels and granular permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Role Name
              </label>
              <input
                type="text"
                required
                disabled={roleToEdit?.isSystem}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Technical Support Lead"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of responsibilities"
                className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              />
            </div>
          </div>

          <RolePermissionsSelector
            selectedPermissions={selectedPermissions}
            onTogglePermission={togglePermission}
            onToggleCategory={toggleCategory}
          />

          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground-muted hover:bg-surface-subtle"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSuccess || !name.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-indigo text-white hover:bg-brand-indigo-hover shadow-sm flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSuccess ? (
                <>
                  <Check className="h-4 w-4" /> Saved
                </>
              ) : roleToEdit ? (
                'Update Permissions'
              ) : (
                'Create Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
