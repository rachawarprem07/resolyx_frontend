import React from 'react';
import {
  Mail,
  Bell,
  Settings,
  Users,
  UserPlus,
  Users2,
  ShieldCheck,
  Calendar,
  GitFork,
  Sliders,
  Zap,
  Plug,
  Palette,
} from 'lucide-react';

export type SettingsTabId =
  | 'email-accounts'
  | 'email-notifications'
  | 'general'
  | 'branding'
  | 'agents'
  | 'invite-agents'
  | 'teams'
  | 'sla'
  | 'holidays'
  | 'assignment-rules'
  | 'field-dependencies'
  | 'saved-replies'
  | 'integrations';

interface SettingsSubNavProps {
  activeTab: SettingsTabId;
  onSelectTab: (tab: SettingsTabId) => void;
}

interface NavGroup {
  category: string;
  items: { id: SettingsTabId; label: string; icon: React.ElementType }[];
}

const SETTINGS_GROUPS: NavGroup[] = [
  {
    category: 'Email Settings',
    items: [
      { id: 'email-accounts', label: 'Email Accounts', icon: Mail },
      { id: 'email-notifications', label: 'Email Notifications', icon: Bell },
    ],
  },
  {
    category: 'App Settings',
    items: [
      { id: 'general', label: 'General', icon: Settings },
      { id: 'branding', label: 'Branding & Theme', icon: Palette },
      { id: 'agents', label: 'Agents', icon: Users },
      { id: 'invite-agents', label: 'Invite Agents', icon: UserPlus },
      { id: 'teams', label: 'Teams', icon: Users2 },
      { id: 'sla', label: 'SLA Policies', icon: ShieldCheck },
      { id: 'holidays', label: 'Business Holidays', icon: Calendar },
      { id: 'assignment-rules', label: 'Assignment Rules', icon: GitFork },
      { id: 'field-dependencies', label: 'Field Dependencies', icon: Sliders },
      { id: 'saved-replies', label: 'Saved Replies', icon: Zap },
    ],
  },
  {
    category: 'Integrations',
    items: [{ id: 'integrations', label: 'Integrations', icon: Plug }],
  },
];

export const SettingsSubNav: React.FC<SettingsSubNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-border p-3 space-y-4 bg-surface-subtle/30">
      {SETTINGS_GROUPS.map((group) => (
        <div key={group.category} className="space-y-1">
          <p className="px-2.5 text-[11px] font-semibold text-foreground-muted select-none">
            {group.category}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-surface text-foreground font-semibold shadow-subtle border border-border'
                      : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-indigo' : 'text-foreground-muted'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

