import React, { useState } from 'react';
import { Palette, Sun, Moon, Building2, DollarSign, Globe, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getStoredCompany, setStoredCompany } from '@/lib/authSession';
import { updateCompanyApi } from '@/lib/apiClient';
import { PRODUCT_NAME } from '@/lib/constants';
import { BrandThemeColorSection } from './BrandThemeColorSection';
import { BrandLogoEditorSection } from './BrandLogoEditorSection';

export const SettingsBrandingTab: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const currentCompany = getStoredCompany();

  const [companyName, setCompanyName] = useState(currentCompany?.name || PRODUCT_NAME);
  const [currency, setCurrency] = useState(currentCompany?.currency || 'USD');
  const [timezone, setTimezone] = useState(currentCompany?.timezone || 'UTC');
  const [isSaving, setIsSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsSaving(true);
    setSaveNotice(null);

    const updated = {
      id: currentCompany?.id || 1,
      name: companyName.trim(),
      currency: currency.trim().toUpperCase(),
      timezone: timezone.trim(),
    };

    // 1. Immediately update local storage and notify sidebar
    setStoredCompany(updated);

    // 2. Persist to backend database if connected
    try {
      await updateCompanyApi({
        name: updated.name,
        currency: updated.currency,
        timezone: updated.timezone,
      });
      setSaveNotice('Company name updated successfully!');
    } catch {
      // Even if backend is temporarily offline, client session holds the change
      setSaveNotice('Company name updated in workspace!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveNotice(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="pb-3 border-b border-border">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Palette className="h-5 w-5 text-brand-indigo" />
          <span>Branding, Theme & Logo Customization</span>
        </h2>
        <p className="text-xs text-foreground-muted mt-0.5">
          Customize your company name, brand logo, workspace accent colors with Excel palettes, and toggle theme appearance.
        </p>
      </div>

      {/* 1. Company Name & Identity Customization */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-indigo" />
            <div>
              <h3 className="text-sm font-bold text-foreground">Company & Workspace Name</h3>
              <p className="text-xs text-foreground-muted">
                Edit your organization name displayed in the sidebar, header, and reports.
              </p>
            </div>
          </div>
          {saveNotice && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20 animate-in fade-in">
              <Check className="h-3.5 w-3.5" />
              <span>{saveNotice}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">
                Company / Organization Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sciens Technologies"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs font-semibold focus:ring-2 focus:ring-brand-indigo placeholder:text-foreground-muted"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Primary Currency
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="CAD">Canadian Dollar (CAD)</option>
                  <option value="AUD">Australian Dollar (AUD)</option>
                  <option value="JPY">Japanese Yen (JPY)</option>
                  <option value="SGD">Singapore Dollar (SGD)</option>
                  <option value="AED">UAE Dirham (AED)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Operational Timezone
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-2.5 h-4 w-4 text-foreground-muted" />
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g. Asia/Kolkata or UTC"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-indigo text-white text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Company Name'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Light / Dark Mode Appearance */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Color Scheme Appearance</h3>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {[
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'dark', label: 'Dark Mode', icon: Moon },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id as 'light' | 'dark')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === item.id
                  ? 'border-brand-indigo bg-brand-indigo/10 text-brand-indigo'
                  : 'border-border bg-surface-subtle text-foreground-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Theme Color Picker & Excel Palette */}
      <BrandThemeColorSection />

      {/* 4. Logo Customization */}
      <BrandLogoEditorSection />
    </div>
  );
};
