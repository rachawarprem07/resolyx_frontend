import React, { useState, useEffect } from 'react';
import {
  Mail,
  Plus,
  ArrowLeft,
  Trash2,
  Edit2,
  CheckCircle2,
  RefreshCw,
  Bell,
  HelpCircle,
  ExternalLink,
  AlertCircle,
  Loader2,
  Send,
  Inbox,
} from 'lucide-react';
import type {
  EmailAccount,
  EmailNotificationSettings,
  SmtpEncryption,
} from '../../types/email.types';
import {
  getStoredEmailAccounts,
  deleteEmailAccount,
  getStoredNotificationSettings,
  saveStoredNotificationSettings,
} from '@/lib/emailAccountsStorage';
import {
  saveEmailAccountApi,
  getEmailAccountsApi,
  deleteEmailAccountApi,
  testEmailAccountCredentialsApi,
  testSavedEmailAccountApi,
} from '@/lib/apiClient';
import { GmailIcon } from './EmailProviderIcons';
import { PROVIDER_LIST } from './emailProviderData';

interface Props {
  mode: 'accounts' | 'notifications';
}

export const SettingsEmailTab: React.FC<Props> = ({ mode }) => {
  // Accounts state
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [view, setView] = useState<'list' | 'setup'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Setup Form State (Gmail only)
  const [accountName, setAccountName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');

  // Server Configuration State (SMTP & IMAP)
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [smtpEncryption, setSmtpEncryption] = useState<SmtpEncryption>('tls');
  const [imapHost, setImapHost] = useState('imap.gmail.com');
  const [imapPort, setImapPort] = useState<number>(993);

  // Checkboxes
  const [enableIncoming, setEnableIncoming] = useState(true);
  const [enableOutgoing, setEnableOutgoing] = useState(true);
  const [defaultIncoming, setDefaultIncoming] = useState(false);
  const [defaultOutgoing, setDefaultOutgoing] = useState(false);

  // UI status
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingCredentials, setIsTestingCredentials] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<EmailNotificationSettings>(getStoredNotificationSettings);

  const syncBackendAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const backendAccs = await getEmailAccountsApi();
      const mapped: EmailAccount[] = backendAccs.map((b) => ({
        id: String(b.id),
        provider: 'gmail',
        accountName: b.account_name,
        name: b.account_name,
        email: b.email,
        enableIncoming: b.enable_incoming,
        enableOutgoing: b.enable_outgoing,
        defaultIncoming: b.default_incoming,
        defaultOutgoing: b.default_outgoing,
        isDefault: b.default_incoming,
        status: (b.status === 'error' || b.status === 'auth_error' ? 'error' : b.status === 'unverified' ? 'unverified' : 'connected'),
        smtpHost: b.smtp_host,
        smtpPort: b.smtp_port,
        smtpEncryption: (b.smtp_encryption as SmtpEncryption) || 'tls',
        imapHost: b.imap_host,
        imapPort: b.imap_port,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
      setAccounts(mapped);
    } catch {
      // fallback to stored local accounts
      setAccounts(getStoredEmailAccounts());
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    syncBackendAccounts();

    const handleUpdate = () => {
      syncBackendAccounts();
    };
    window.addEventListener('resolyx-email-accounts-updated', handleUpdate);
    return () => {
      window.removeEventListener('resolyx-email-accounts-updated', handleUpdate);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Reset or initialize form
  const handleOpenSetup = (acc?: EmailAccount) => {
    setFormError(null);
    setTestResult(null);
    if (acc) {
      setEditingId(acc.id);
      setAccountName(acc.accountName || acc.name || '');
      setEmailId(acc.email || '');
      setPassword('');
      setEnableIncoming(acc.enableIncoming !== undefined ? acc.enableIncoming : true);
      setEnableOutgoing(acc.enableOutgoing !== undefined ? acc.enableOutgoing : true);
      setDefaultIncoming(Boolean(acc.defaultIncoming));
      setDefaultOutgoing(Boolean(acc.defaultOutgoing));
      setSmtpHost(acc.smtpHost || 'smtp.gmail.com');
      setSmtpPort(acc.smtpPort || 587);
      setSmtpEncryption((acc.smtpEncryption as SmtpEncryption) || 'tls');
      setImapHost(acc.imapHost || 'imap.gmail.com');
      setImapPort(acc.imapPort || 993);
    } else {
      setEditingId(null);
      setAccountName('');
      setEmailId('');
      setPassword('');
      setEnableIncoming(true);
      setEnableOutgoing(true);
      setDefaultIncoming(accounts.length === 0);
      setDefaultOutgoing(accounts.length === 0);
      setSmtpHost('smtp.gmail.com');
      setSmtpPort(587);
      setSmtpEncryption('tls');
      setImapHost('imap.gmail.com');
      setImapPort(993);
    }
    setView('setup');
  };

  const handleTestCredentialsInForm = async () => {
    setFormError(null);
    setTestResult(null);

    if (!emailId.trim() || !emailId.includes('@')) {
      setFormError('Please enter a valid Gmail address before testing.');
      return;
    }
    if (!password.trim()) {
      setFormError('Please enter your 16-character Google App Password to test.');
      return;
    }

    setIsTestingCredentials(true);
    try {
      const res = await testEmailAccountCredentialsApi({
        email: emailId.trim().toLowerCase(),
        password: password.trim(),
        smtp_host: smtpHost.trim() || 'smtp.gmail.com',
        smtp_port: Number(smtpPort) || 587,
      });
      setTestResult({
        success: true,
        message: res.message || 'SMTP handshake verified successfully with Google!',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'SMTP connection failed.';
      setTestResult({
        success: false,
        message: msg,
      });
    } finally {
      setIsTestingCredentials(false);
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!accountName.trim()) {
      setFormError('Please enter an account name (e.g. Support / Sales).');
      return;
    }
    if (!emailId.trim() || !emailId.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    try {
      await saveEmailAccountApi({
        id: editingId || undefined,
        provider: 'gmail',
        account_name: accountName.trim(),
        email: emailId.trim().toLowerCase(),
        password: password || undefined,
        enable_incoming: enableIncoming,
        enable_outgoing: enableOutgoing,
        default_incoming: defaultIncoming,
        default_outgoing: defaultOutgoing,
        smtp_host: smtpHost.trim() || 'smtp.gmail.com',
        smtp_port: Number(smtpPort) || 587,
        smtp_encryption: smtpEncryption,
        imap_host: imapHost.trim() || 'imap.gmail.com',
        imap_port: Number(imapPort) || 993,
      });

      await syncBackendAccounts();
      triggerToast(`Gmail account '${emailId.trim()}' saved and activated successfully.`);
      setView('list');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save email account.';
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove mailbox '${email}'?`)) {
      try {
        if (!isNaN(Number(id))) {
          await deleteEmailAccountApi(Number(id));
        } else {
          deleteEmailAccount(id);
        }
        await syncBackendAccounts();
        triggerToast(`Email account '${email}' removed.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete account.';
        triggerToast(`Delete error: ${msg}`);
      }
    }
  };

  const handleTestHandshake = async (id: string) => {
    setTestingId(id);
    try {
      const res = await testSavedEmailAccountApi(Number(id));
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: 'connected', lastTestedAt: 'Just now' } : a
        )
      );
      triggerToast(res.message || 'Gmail connection verified successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'SMTP connection test failed.';
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: 'error', lastTestedAt: 'Failed' } : a
        )
      );
      triggerToast(`Connection failed: ${msg}`);
    } finally {
      setTestingId(null);
    }
  };

  const toggleNotification = (key: keyof EmailNotificationSettings) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updated);
    saveStoredNotificationSettings(updated);
    triggerToast('Notification preference updated.');
  };

  // ----------------------------------------------------------------------
  // RENDER: NOTIFICATIONS MODE
  // ----------------------------------------------------------------------
  if (mode === 'notifications') {
    return (
      <div className="p-6 max-w-4xl space-y-6">
        <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Bell className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            <span>Email Notifications</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Configure automated outbound email triggers sent to agents and supervisors.
          </p>
        </div>

        {toastNotice && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastNotice}</span>
          </div>
        )}

        <div className="space-y-4">
          {[
            {
              key: 'notifyOnAssign' as const,
              title: 'Notify Agent on Assignment',
              desc: 'Dispatch an email alert as soon as an inquiry or ticket is assigned to an agent.',
            },
            {
              key: 'notifyOnCustomerReply' as const,
              title: 'Notify Agent on Customer Reply',
              desc: 'Send an email notification when a customer submits a reply on an open ticket.',
            },
            {
              key: 'notifyOnSlaBreach' as const,
              title: 'SLA Escalation Alerts',
              desc: 'Notify team leads immediately when a first-response or resolution SLA is breached.',
            },
            {
              key: 'dailyDigest' as const,
              title: 'Daily Digest Briefing',
              desc: 'Send a morning overview summarizing pending tickets, breaches, and CSAT scores.',
            },
            {
              key: 'forwardCustomerEmailAttachments' as const,
              title: 'Preserve Attachments',
              desc: 'Automatically mirror inbound email file attachments directly into the ticket timeline.',
            },
          ].map((item) => (
            <div
              key={item.key}
              onClick={() => toggleNotification(item.key)}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex items-center justify-between gap-4 cursor-pointer hover:border-neutral-300 transition-colors"
            >
              <div>
                <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
              <div
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifications[item.key] ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`bg-white dark:bg-neutral-900 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER: ACCOUNTS MODE - SETUP VIEW (Gmail Only)
  // ----------------------------------------------------------------------
  if (view === 'setup') {
    return (
      <div className="p-6 md:p-8 max-w-4xl space-y-6 animate-in fade-in duration-150">
        {/* Navigation & Header */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setView('list')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Email Accounts</span>
          </button>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Setup Email</h2>
          <p className="text-sm text-neutral-500">
            Choose the email service provider you want to configure.
          </p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Provider Selection Row (GMail selected matching user screenshot) */}
        <div className="pt-2">
          <div className="flex items-center gap-6 pb-2 pt-1">
            {PROVIDER_LIST.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-2"
              >
                  {/* Outer black circular ring matching screenshot */}
                  <div className="w-14 h-14 rounded-full border-2 border-black dark:border-white p-0.5 flex items-center justify-center bg-transparent">
                    <div className="w-full h-full rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                      <GmailIcon className="w-7 h-7" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {item.name}
                  </span>
                </div>
            ))}
          </div>
        </div>

        {/* Setup Form (Images 3 & 4) */}
        <form onSubmit={handleSaveAccount} className="space-y-5 pt-2">
          {/* Account name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Account name
            </label>
            <input
              type="text"
              required
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Support / Sales"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all"
            />
          </div>

          {/* Email ID */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Email ID
            </label>
            <input
              type="email"
              required
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="johndoe@example.com"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Password / App Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="16-character Google App Password (e.g. abcd efgh ijkl mnop)"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all font-mono"
            />
            {/* Google App Password Guidance */}
            <div className="p-3 rounded-lg bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Google App Password required for Gmail SMTP</span>
              </div>
              <p className="text-[11px] text-blue-800/90 dark:text-blue-300/80 leading-relaxed">
                Standard Google account passwords cannot connect to SMTP relays. Enable 2-Step Verification and generate a 16-character App Password.
              </p>
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline pt-0.5"
              >
                <span>Generate Google App Password</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Test result message if tested */}
            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs font-medium border flex items-start gap-2 animate-in fade-in ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Incoming & Outgoing Server Settings Sections */}
          <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {/* INCOMING SETTINGS CARD */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-brand-indigo" />
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Incoming Settings (IMAP)
                  </h4>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo">
                  Ticket Ingestion
                </span>
              </div>

              {/* Server & Port inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Incoming IMAP Host / Server
                  </label>
                  <input
                    type="text"
                    value={imapHost}
                    onChange={(e) => setImapHost(e.target.value)}
                    placeholder="imap.gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs border border-neutral-300 dark:border-neutral-700 font-mono focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    IMAP Port
                  </label>
                  <input
                    type="number"
                    value={imapPort}
                    onChange={(e) => setImapPort(Number(e.target.value))}
                    placeholder="993"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs border border-neutral-300 dark:border-neutral-700 font-mono focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                  />
                </div>
              </div>

              {/* Incoming Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="enableIncoming"
                    checked={enableIncoming}
                    onChange={(e) => setEnableIncoming(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                  />
                  <div>
                    <label
                      htmlFor="enableIncoming"
                      className="text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer"
                    >
                      Enable Incoming
                    </label>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      If enabled, tickets can be created from incoming emails on this account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="defaultIncoming"
                    checked={defaultIncoming}
                    onChange={(e) => setDefaultIncoming(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                  />
                  <div>
                    <label
                      htmlFor="defaultIncoming"
                      className="text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer"
                    >
                      Default Incoming
                    </label>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      Route general company incoming support replies to this inbox.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* OUTGOING SETTINGS CARD */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Outgoing Settings (SMTP Relay)
                  </h4>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Invites & Outbound Dispatch
                </span>
              </div>

              {/* Server & Port inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Outgoing SMTP Host / Server
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs border border-neutral-300 dark:border-neutral-700 font-mono focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    placeholder="587"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs border border-neutral-300 dark:border-neutral-700 font-mono focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                  />
                </div>
              </div>

              {/* Encryption selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Encryption / Protocol
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpEncryption('tls');
                      setSmtpPort(587);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                      smtpEncryption === 'tls' && smtpPort === 587
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <span>STARTTLS (Port 587)</span>
                    <span className="text-[10px] opacity-75">Gmail Standard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSmtpEncryption('ssl');
                      setSmtpPort(465);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                      smtpEncryption === 'ssl' && smtpPort === 465
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <span>SSL (Port 465)</span>
                    <span className="text-[10px] opacity-75">Firewall-safe Relay</span>
                  </button>
                </div>
              </div>

              {/* Outgoing Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="enableOutgoing"
                    checked={enableOutgoing}
                    onChange={(e) => setEnableOutgoing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                  />
                  <div>
                    <label
                      htmlFor="enableOutgoing"
                      className="text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer"
                    >
                      Enable Outgoing
                    </label>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      If enabled, agent invites and reply emails are sent from this account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="defaultOutgoing"
                    checked={defaultOutgoing}
                    onChange={(e) => setDefaultOutgoing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                  />
                  <div>
                    <label
                      htmlFor="defaultOutgoing"
                      className="text-xs font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer"
                    >
                      Default Outgoing
                    </label>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                      Primary workspace outgoing mailbox for email dispatches.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setView('list')}
              className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestCredentialsInForm}
                disabled={isTestingCredentials || isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isTestingCredentials ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-medium shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editingId ? 'Save Changes' : 'Submit'}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // RENDER: ACCOUNTS MODE - LIST & EMPTY STATE (Image 1)
  // ----------------------------------------------------------------------
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header matching Screenshot 1 */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Email Accounts
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your email accounts and configure incoming and outgoing settings.
          </p>
        </div>

        {/* Top Right: + New Button (Screenshot 1) */}
        <button
          type="button"
          onClick={() => handleOpenSetup()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-medium shadow-sm transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      </div>

      {/* Toast Notice */}
      {toastNotice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Loading & Empty State */}
      {isLoadingAccounts ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-neutral-400 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-600 dark:text-neutral-300" />
          <span className="text-sm">Loading email accounts...</span>
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mb-4">
            <Mail className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
            No email account found
          </h3>
          <p className="text-sm text-neutral-400 mt-1">Add one to get started.</p>
        </div>
      ) : (
        /* Configured Accounts List */
        <div className="space-y-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:border-neutral-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <GmailIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {acc.accountName || acc.name || 'Support Mailbox'}
                      </h4>
                      {acc.defaultIncoming && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                          Default Incoming
                        </span>
                      )}
                      {acc.defaultOutgoing && (
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
                          Default Outgoing
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 font-mono">{acc.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleTestHandshake(acc.id)}
                    disabled={testingId === acc.id}
                    title="Test connection"
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${testingId === acc.id ? 'animate-spin text-neutral-900' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenSetup(acc)}
                    title="Edit account"
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAccount(acc.id, acc.email)}
                    title="Delete account"
                    className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Capability Badges */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      acc.status === 'error'
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>{acc.status === 'error' ? 'Connection Error' : 'Connected'}</span>
                </span>
                <span>•</span>
                <span>Provider: GMail</span>
                <span>•</span>
                <span>
                  Incoming:{' '}
                  <strong className={acc.enableIncoming ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}>
                    {acc.enableIncoming ? `${acc.imapHost || 'imap.gmail.com'}:${acc.imapPort || 993}` : 'Disabled'}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Outgoing Relay:{' '}
                  <strong className={acc.enableOutgoing ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-400'}>
                    {acc.enableOutgoing ? `${acc.smtpHost || 'smtp.gmail.com'}:${acc.smtpPort || 587} (${acc.smtpEncryption?.toUpperCase() || 'TLS'})` : 'Disabled'}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
