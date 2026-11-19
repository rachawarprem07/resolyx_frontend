import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SettingsSubNav, type SettingsTabId } from '../components/settings/SettingsSubNav';
import { SettingsGeneralTab } from '../components/settings/SettingsGeneralTab';
import { SettingsBrandingTab } from '../components/settings/SettingsBrandingTab';
import { SettingsEmailTab } from '../components/settings/SettingsEmailTab';
import { SettingsHolidaysTab } from '../components/settings/SettingsHolidaysTab';
import { SettingsSavedRepliesTab } from '../components/settings/SettingsSavedRepliesTab';
import { SlaPoliciesSection } from '../components/settings/SlaPoliciesSection';
import { TeamsPage } from './TeamsPage';
import { AssignmentRulesPage } from './AssignmentRulesPage';
import { UsersPage } from './UsersPage';

export const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as SettingsTabId) || 'general';
  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SettingsTabId;
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleSelectTab = (tab: SettingsTabId) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <SettingsGeneralTab onNavigateTab={handleSelectTab} />;
      case 'branding':
        return <SettingsBrandingTab />;
      case 'email-accounts':
        return <SettingsEmailTab mode="accounts" />;
      case 'email-notifications':
        return <SettingsEmailTab mode="notifications" />;
      case 'teams':
        return (
          <div className="p-4 sm:p-6">
            <TeamsPage />
          </div>
        );
      case 'sla':
        return (
          <div className="p-4 sm:p-6 space-y-4">
            <SlaPoliciesSection />
          </div>
        );
      case 'assignment-rules':
        return (
          <div className="p-4 sm:p-6">
            <AssignmentRulesPage />
          </div>
        );
      case 'agents':
      case 'invite-agents':
        return (
          <div className="p-4 sm:p-6">
            <UsersPage />
          </div>
        );
      case 'holidays':
        return <SettingsHolidaysTab />;
      case 'field-dependencies':
        return <SettingsSavedRepliesTab mode="fields" />;
      case 'saved-replies':
        return <SettingsSavedRepliesTab mode="replies" />;
      case 'integrations':
        return <SettingsSavedRepliesTab mode="integrations" />;
      default:
        return <SettingsGeneralTab onNavigateTab={handleSelectTab} />;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Settings & Configurations</h1>
        <p className="text-xs text-foreground-muted">Configure profile, routing teams, SLA rules, email dispatch, and app preferences.</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface shadow-subtle overflow-hidden flex flex-col md:flex-row min-h-[680px]">
        <SettingsSubNav activeTab={activeTab} onSelectTab={handleSelectTab} />
        <div className="flex-1 min-w-0 bg-surface">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
