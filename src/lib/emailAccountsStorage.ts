import type { EmailAccount, EmailNotificationSettings, EmailServiceProvider } from '@/features/admin/types/email.types';

const EMAIL_ACCOUNTS_KEY = 'resolyx-email-accounts-v2';
const NOTIFICATIONS_KEY = 'resolyx-email-notifications-v1';

export const DEFAULT_NOTIFICATION_SETTINGS: EmailNotificationSettings = {
  notifyOnAssign: true,
  notifyOnSlaBreach: true,
  notifyOnCustomerReply: true,
  dailyDigest: false,
  forwardCustomerEmailAttachments: true,
};

export interface ProviderPreset {
  provider: EmailServiceProvider;
  name: string;
  imapHost: string;
  imapPort: number;
  imapSecurity: 'ssl' | 'starttls';
  smtpHost: string;
  smtpPort: number;
  smtpEncryption: 'tls' | 'ssl' | 'none';
}

export const PROVIDER_PRESETS: Record<EmailServiceProvider, ProviderPreset> = {
  gmail: {
    provider: 'gmail',
    name: 'GMail',
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
  outlook: {
    provider: 'outlook',
    name: 'Outlook',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
  sendgrid: {
    provider: 'sendgrid',
    name: 'Sendgrid',
    imapHost: '',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
  sparkpost: {
    provider: 'sparkpost',
    name: 'SparkPost',
    imapHost: '',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'smtp.sparkpostmail.com',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
  yahoo: {
    provider: 'yahoo',
    name: 'Yahoo',
    imapHost: 'imap.mail.yahoo.com',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'smtp.mail.yahoo.com',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
  yandex: {
    provider: 'yandex',
    name: 'Yandex',
    imapHost: 'imap.yandex.com',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'smtp.yandex.com',
    smtpPort: 465,
    smtpEncryption: 'ssl',
  },
  frappe: {
    provider: 'frappe',
    name: 'Frappe Mail',
    imapHost: 'mail.frappe.io',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: 'mail.frappe.io',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
  custom: {
    provider: 'custom',
    name: 'Custom',
    imapHost: '',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpHost: '',
    smtpPort: 587,
    smtpEncryption: 'tls',
  },
};

export function generateForwardingAddress(email: string): string {
  const prefix = (email.split('@')[0] || 'support').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'support';
  const hash = Math.random().toString(36).substring(2, 8);
  return `${prefix}-inbound-${hash}@resolyx.internal`;
}

export function getStoredEmailAccounts(): EmailAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EMAIL_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Normalize properties for backwards compatibility
    return (parsed as Partial<EmailAccount>[]).map((item) => ({
      id: item.id || `email-${Date.now()}`,
      accountName: item.accountName || item.name || 'Support Mailbox',
      name: item.accountName || item.name || 'Support Mailbox',
      email: item.email || '',
      provider: (item.provider as EmailServiceProvider) || 'custom',
      enableIncoming: item.enableIncoming !== undefined ? Boolean(item.enableIncoming) : true,
      enableOutgoing: item.enableOutgoing !== undefined ? Boolean(item.enableOutgoing) : true,
      defaultIncoming: item.defaultIncoming !== undefined ? Boolean(item.defaultIncoming) : Boolean(item.isDefault),
      defaultOutgoing: item.defaultOutgoing !== undefined ? Boolean(item.defaultOutgoing) : Boolean(item.isDefault),
      status: item.status || 'connected',
      lastTestedAt: item.lastTestedAt || 'Recently',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      ...item,
    })) as EmailAccount[];
  } catch {
    return [];
  }
}

export function saveStoredEmailAccounts(accounts: EmailAccount[]): void {
  try {
    localStorage.setItem(EMAIL_ACCOUNTS_KEY, JSON.stringify(accounts));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resolyx-email-accounts-updated', { detail: accounts }));
    }
  } catch {
    // ignore
  }
}

export function upsertEmailAccount(account: EmailAccount): EmailAccount[] {
  const current = getStoredEmailAccounts();
  const exists = current.some((a) => a.id === account.id);

  // If first account ever, ensure default incoming and default outgoing are true
  if (current.length === 0) {
    account.defaultIncoming = true;
    account.defaultOutgoing = true;
  }

  let updated: EmailAccount[];
  if (exists) {
    updated = current.map((a) => (a.id === account.id ? account : a));
  } else {
    updated = [account, ...current];
  }

  // Enforce single default incoming
  if (account.defaultIncoming) {
    updated = updated.map((a) => (a.id === account.id ? a : { ...a, defaultIncoming: false }));
  }

  // Enforce single default outgoing
  if (account.defaultOutgoing) {
    updated = updated.map((a) => (a.id === account.id ? a : { ...a, defaultOutgoing: false }));
  }

  saveStoredEmailAccounts(updated);
  return updated;
}

export function deleteEmailAccount(id: string): EmailAccount[] {
  const current = getStoredEmailAccounts();
  const target = current.find((a) => a.id === id);
  const remaining = current.filter((a) => a.id !== id);

  // If we deleted the default incoming account, assign it to the first remaining
  if (target?.defaultIncoming && remaining.length > 0 && remaining[0]) {
    remaining[0].defaultIncoming = true;
  }

  // If we deleted the default outgoing account, assign it to the first remaining
  if (target?.defaultOutgoing && remaining.length > 0 && remaining[0]) {
    remaining[0].defaultOutgoing = true;
  }

  saveStoredEmailAccounts(remaining);
  return remaining;
}

export function setDefaultIncomingAccount(id: string): EmailAccount[] {
  const current = getStoredEmailAccounts();
  const updated = current.map((a) => ({
    ...a,
    defaultIncoming: a.id === id,
  }));
  saveStoredEmailAccounts(updated);
  return updated;
}

export function setDefaultOutgoingAccount(id: string): EmailAccount[] {
  const current = getStoredEmailAccounts();
  const updated = current.map((a) => ({
    ...a,
    defaultOutgoing: a.id === id,
  }));
  saveStoredEmailAccounts(updated);
  return updated;
}

export function setDefaultEmailAccount(id: string): EmailAccount[] {
  return setDefaultIncomingAccount(id);
}

export function getStoredNotificationSettings(): EmailNotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveStoredNotificationSettings(settings: EmailNotificationSettings): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(settings));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resolyx-email-notifications-updated', { detail: settings }));
    }
  } catch {
    // ignore
  }
}
