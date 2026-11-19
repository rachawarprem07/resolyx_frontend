import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import type {
  EmailAccount,
  InboundProtocol,
  SmtpEncryption,
} from '../../types/email.types';
import { PROVIDER_PRESETS, generateForwardingAddress } from '@/lib/emailAccountsStorage';
import { GmailIcon } from './EmailProviderIcons';
import { PROVIDER_LIST, type ProviderItem } from './emailProviderData';

interface Props {
  isOpen: boolean;
  account: EmailAccount | null;
  onClose: () => void;
  onSave: (account: EmailAccount) => void;
}

export const ConnectEmailModal: React.FC<Props> = ({
  isOpen,
  account,
  onClose,
  onSave,
}) => {
  const [accountName, setAccountName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');

  // Checkboxes matching screenshots
  const [enableIncoming, setEnableIncoming] = useState(true);
  const [enableOutgoing, setEnableOutgoing] = useState(true);
  const [defaultIncoming, setDefaultIncoming] = useState(false);
  const [defaultOutgoing, setDefaultOutgoing] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setAccountName(account.accountName || account.name || '');
      setEmailId(account.email || '');
      setPassword(account.password || '');
      setEnableIncoming(account.enableIncoming !== undefined ? account.enableIncoming : true);
      setEnableOutgoing(account.enableOutgoing !== undefined ? account.enableOutgoing : true);
      setDefaultIncoming(Boolean(account.defaultIncoming));
      setDefaultOutgoing(Boolean(account.defaultOutgoing));
    } else {
      setAccountName('');
      setEmailId('');
      setPassword('');
      setEnableIncoming(true);
      setEnableOutgoing(true);
      setDefaultIncoming(false);
      setDefaultOutgoing(false);
    }
    setFormError(null);
  }, [account, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim()) {
      setFormError('Please enter an account name (e.g. Support / Sales).');
      return;
    }
    if (!emailId.trim() || !emailId.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const preset = PROVIDER_PRESETS.gmail;

    const payload: EmailAccount = {
      id: account?.id || `email-${Date.now()}`,
      provider: 'gmail',
      accountName: accountName.trim(),
      name: accountName.trim(),
      email: emailId.trim().toLowerCase(),
      password: password || undefined,
      enableIncoming,
      enableOutgoing,
      defaultIncoming,
      defaultOutgoing,
      isDefault: defaultIncoming,
      status: 'connected',
      lastTestedAt: 'Just now',

      inboundProtocol: 'imap' as InboundProtocol,
      forwardingAddress: generateForwardingAddress(emailId.trim()),
      imapHost: preset.imapHost,
      imapPort: preset.imapPort,
      imapSecurity: preset.imapSecurity,
      imapUsername: emailId.trim(),
      imapPassword: password || undefined,

      smtpHost: preset.smtpHost,
      smtpPort: preset.smtpPort,
      smtpEncryption: (preset.smtpEncryption || 'tls') as SmtpEncryption,
      smtpUsername: emailId.trim(),
      smtpPassword: password || undefined,

      defaultPriority: 'Medium',
      createdAt: account?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-3">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Setup Email</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Choose the email service provider you want to configure.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 my-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Provider Badge (Gmail Only) */}
        <div className="pt-2">
          <div className="flex items-center gap-6 pb-2 pt-1">
            {PROVIDER_LIST.map((item: ProviderItem) => (
              <div key={item.id} className="flex flex-col items-center gap-2">
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

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Password
              </label>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                <span>Use Google App Password if 2FA is active</span>
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 text-sm border border-transparent focus:border-neutral-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all"
            />
          </div>

          {/* 2-Column Checkbox Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-3">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="modalEnableIncoming"
                  checked={enableIncoming}
                  onChange={(e) => setEnableIncoming(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                />
                <div>
                  <label
                    htmlFor="modalEnableIncoming"
                    className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    Enable Incoming
                  </label>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    If enabled, tickets can be created from the incoming emails on this account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="modalDefaultIncoming"
                  checked={defaultIncoming}
                  onChange={(e) => setDefaultIncoming(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                />
                <div>
                  <label
                    htmlFor="modalDefaultIncoming"
                    className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    Default Incoming
                  </label>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    If enabled, all replies to your company (eg: replies@yourcompany.com) will come to
                    this account. Note: Only one account can be default incoming.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="modalEnableOutgoing"
                  checked={enableOutgoing}
                  onChange={(e) => setEnableOutgoing(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                />
                <div>
                  <label
                    htmlFor="modalEnableOutgoing"
                    className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    Enable Outgoing
                  </label>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    If enabled, outgoing emails can be sent from this account.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="modalDefaultOutgoing"
                  checked={defaultOutgoing}
                  onChange={(e) => setDefaultOutgoing(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                />
                <div>
                  <label
                    htmlFor="modalDefaultOutgoing"
                    className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
                  >
                    Default Outgoing
                  </label>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    If enabled, all outgoing emails will be sent from this account. Note: Only one account
                    can be default outgoing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-sm font-medium shadow-sm transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
