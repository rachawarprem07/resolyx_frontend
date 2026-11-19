import React, { useState, useMemo } from 'react';
import { Check, Search, CheckSquare, Square, Users } from 'lucide-react';
import type { UserDetail } from '@/lib/apiClient';

interface TeamUsersMultiSelectProps {
  /** Active staff users from the backend. */
  users: UserDetail[];
  selectedUserIds: number[];
  onChange: (userIds: number[]) => void;
  isLoading?: boolean;
}

export const TeamUsersMultiSelect: React.FC<TeamUsersMultiSelectProps> = ({
  users,
  selectedUserIds,
  onChange,
  isLoading,
}) => {
  const [search, setSearch] = useState('');
  const nameOf = (u: UserDetail) => u.full_name || u.email;

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        nameOf(u).toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.department?.toLowerCase().includes(q) ?? false) ||
        u.email.toLowerCase().includes(q),
    );
  }, [search, users]);

  const isAllSelected = users.length > 0 && users.every((u) => selectedUserIds.includes(u.id));

  const handleToggleAll = () => onChange(isAllSelected ? [] : users.map((u) => u.id));

  const handleToggleUser = (id: number) =>
    onChange(selectedUserIds.includes(id) ? selectedUserIds.filter((x) => x !== id) : [...selectedUserIds, id]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-brand-indigo" />
          <span>Team Members</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold">
            {selectedUserIds.length} selected
          </span>
        </span>

        <button
          type="button"
          onClick={handleToggleAll}
          disabled={users.length === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-[11px] font-semibold text-foreground transition-colors disabled:opacity-50"
        >
          {isAllSelected ? (
            <>
              <CheckSquare className="h-3.5 w-3.5 text-brand-indigo" />
              <span>Deselect All</span>
            </>
          ) : (
            <>
              <Square className="h-3.5 w-3.5 text-foreground-muted" />
              <span>Select All ({users.length})</span>
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter team members by name or role..."
          aria-label="Filter team members"
          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo outline-none"
        />
      </div>

      <div className="max-h-48 overflow-y-auto rounded-xl border border-border bg-surface-subtle/40 divide-y divide-border/60 p-1">
        {isLoading && <p className="p-3 text-xs text-foreground-muted">Loading agents…</p>}
        {!isLoading && filteredUsers.length === 0 && (
          <p className="p-3 text-xs text-foreground-muted">
            {users.length === 0 ? 'No active agents yet. Invite agents under Users & Roles.' : 'No agents match this filter.'}
          </p>
        )}
        {filteredUsers.map((user) => {
          const isSelected = selectedUserIds.includes(user.id);
          const name = nameOf(user);
          const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

          return (
            <button
              type="button"
              key={user.id}
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => handleToggleUser(user.id)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                isSelected ? 'bg-brand-indigo/10 text-foreground' : 'hover:bg-surface text-foreground-muted hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-brand-indigo border-brand-indigo text-white' : 'border-border bg-surface'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
                <div className="h-6 w-6 rounded-md bg-brand-indigo/10 text-brand-indigo flex items-center justify-center text-[10px] font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                  <p className="text-[10px] text-foreground-muted truncate">
                    {user.role}{user.department ? ` • ${user.department}` : ''}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-foreground-muted ml-2 shrink-0">{user.email.split('@')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
