import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { SettingsSubNav, type SettingsTabId } from './SettingsSubNav';
import { SettingsGeneralTab } from './SettingsGeneralTab';
import { SettingsBrandingTab } from './SettingsBrandingTab';
import { SettingsEmailTab } from './SettingsEmailTab';
import { SettingsHolidaysTab } from './SettingsHolidaysTab';
import { SettingsSavedRepliesTab } from './SettingsSavedRepliesTab';
import { SlaPoliciesSection } from './SlaPoliciesSection';
import { TeamsPage } from '../../pages/TeamsPage';
import { AssignmentRulesPage } from '../../pages/AssignmentRulesPage';
import { UsersPage } from '../../pages/UsersPage';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: SettingsTabId;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  defaultTab = 'general',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <SettingsGeneralTab onNavigateTab={setActiveTab} />;
      case 'branding':
        return <SettingsBrandingTab />;
      case 'email-accounts':
        return <SettingsEmailTab mode="accounts" />;
      case 'email-notifications':
        return <SettingsEmailTab mode="notifications" />;
      case 'teams':
        return <div className="p-4 sm:p-6"><TeamsPage /></div>;
      case 'sla':
        return <div className="p-4 sm:p-6 space-y-4"><SlaPoliciesSection /></div>;
      case 'assignment-rules':
        return <div className="p-4 sm:p-6"><AssignmentRulesPage /></div>;
      case 'agents':
      case 'invite-agents':
        return <div className="p-4 sm:p-6"><UsersPage /></div>;
      case 'holidays':
        return <SettingsHolidaysTab />;
      case 'field-dependencies':
        return <SettingsSavedRepliesTab mode="fields" />;
      case 'saved-replies':
        return <SettingsSavedRepliesTab mode="replies" />;
      case 'integrations':
        return <SettingsSavedRepliesTab mode="integrations" />;
      default:
        return <SettingsGeneralTab />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Floating Dialog Modal matching user screenshot */}
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-surface rounded-2xl sm:rounded-3xl border border-border shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-150 z-10">
        {/* Left: Navigation SubNav */}
        <SettingsSubNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Right: Active Tab Content Area */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-surface">
          {/* Top Bar with Close Button */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0 bg-surface">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
              App Settings • {activeTab.replace('-', ' ')}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
              title="Close Settings (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

