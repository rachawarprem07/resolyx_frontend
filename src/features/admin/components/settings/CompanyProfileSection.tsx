import React, { useState } from 'react';
import { Building2, Globe, Mail, Clock, DollarSign, Languages } from 'lucide-react';

export const CompanyProfileSection: React.FC = () => {
  const [companyName, setCompanyName] = useState('Resolyx Technologies Inc.');
  const [supportDomain, setSupportDomain] = useState('support.resolyx.io');
  const [supportEmail, setSupportEmail] = useState('helpdesk@resolyx.io');
  const [timezone, setTimezone] = useState('America/New_York');
  const [workingHours, setWorkingHours] = useState('09:00 - 18:00 (Mon-Fri)');
  const [locale, setLocale] = useState('en-US');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-subtle space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Building2 className="h-5 w-5 text-brand-indigo" />
        <div>
          <h2 className="text-sm font-bold text-foreground">Company & Organization Profile</h2>
          <p className="text-xs text-foreground-muted">
            Configure primary organization identity, operational timezone, and business hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Company Legal Name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Support Custom Domain</label>
          <div className="relative">
            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <input
              type="text"
              value={supportDomain}
              onChange={(e) => setSupportDomain(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Primary Support Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Operational Timezone</label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-foreground-muted" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
            >
              <option value="America/New_York">(UTC-05:00) Eastern Time (US & Canada)</option>
              <option value="America/Chicago">(UTC-06:00) Central Time</option>
              <option value="America/Los_Angeles">(UTC-08:00) Pacific Time</option>
              <option value="Europe/London">(UTC+00:00) London, Dublin</option>
              <option value="Europe/Berlin">(UTC+01:00) Berlin, Paris</option>
              <option value="Asia/Kolkata">(UTC+05:30) India Standard Time (IST)</option>
              <option value="Asia/Singapore">(UTC+08:00) Singapore, Hong Kong</option>
              <option value="Asia/Tokyo">(UTC+09:00) Tokyo, Osaka</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">Business Working Hours</label>
          <input
            type="text"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Language</label>
            <div className="relative">
              <Languages className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-foreground-muted" />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full pl-8 pr-2 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Currency</label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-foreground-muted" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full pl-8 pr-2 py-2 rounded-xl border border-border bg-surface-subtle text-foreground text-xs focus:ring-2 focus:ring-brand-indigo"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

