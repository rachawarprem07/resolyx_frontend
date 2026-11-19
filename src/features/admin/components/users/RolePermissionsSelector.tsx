import React from 'react';
import { DEFAULT_PERMISSIONS } from '../../data/adminData';
import type { PermissionCategory } from '../../types/admin.types';

interface RolePermissionsSelectorProps {
  selectedPermissions: string[];
  onTogglePermission: (id: string) => void;
  onToggleCategory: (category: PermissionCategory) => void;
}

const CATEGORIES: PermissionCategory[] = [
  'Helpdesk',
  'AI & Automation',
  'Users & Roles',
  'Security',
];

export const RolePermissionsSelector: React.FC<RolePermissionsSelectorProps> = ({
  selectedPermissions,
  onTogglePermission,
  onToggleCategory,
}) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground">
          Set Permissions ({selectedPermissions.length} selected)
        </h4>
      </div>

      {CATEGORIES.map((cat) => {
        const catPerms = DEFAULT_PERMISSIONS.filter((p) => p.category === cat);
        const allChecked = catPerms.every((p) => selectedPermissions.includes(p.id));
        return (
          <div
            key={cat}
            className="p-3 rounded-xl bg-surface-subtle/50 border border-border space-y-2.5"
          >
            <div className="flex items-center justify-between pb-1 border-b border-border/60">
              <span className="text-xs font-bold text-foreground">{cat}</span>
              <button
                type="button"
                onClick={() => onToggleCategory(cat)}
                className="text-[11px] font-semibold text-brand-indigo hover:text-brand-indigo-hover"
              >
                {allChecked ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {catPerms.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => onTogglePermission(perm.id)}
                    className="mt-0.5 h-3.5 w-3.5 rounded accent-brand-indigo text-brand-indigo cursor-pointer"
                  />
                  <div className="text-[11px] leading-tight">
                    <p className="font-semibold text-foreground">{perm.name}</p>
                    <p className="text-[10px] text-foreground-muted">{perm.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
