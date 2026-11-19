export type InboundProtocol = 'forwarding' | 'imap';
export type SmtpEncryption = 'tls' | 'ssl' | 'none';

export type EmailServiceProvider =
  | 'gmail'
  | 'outlook'
  | 'sendgrid'
  | 'sparkpost'
  | 'yahoo'
  | 'yandex'
  | 'frappe'
  | 'custom';

export interface EmailAccount {
  id: string;
  provider: EmailServiceProvider;
  accountName: string;
  name?: string; // fallback alias
  email: string;
  password?: string;

  // Inbound & Outbound Toggles from User Reference Screenshots
  enableIncoming: boolean;
  enableOutgoing: boolean;
  defaultIncoming: boolean;
  defaultOutgoing: boolean;

  // General & Metadata
  senderName?: string;
  replyTo?: string;
  isDefault?: boolean; // legacy compatibility (maps to defaultIncoming)
  status: 'connected' | 'unverified' | 'error';
  lastTestedAt?: string;
  errorMessage?: string;

  // Server & Relay Configuration (auto-populated for presets, custom editable)
  inboundProtocol?: InboundProtocol;
  forwardingAddress?: string;
  imapHost?: string;
  imapPort?: number;
  imapSecurity?: 'ssl' | 'starttls';
  imapUsername?: string;
  imapPassword?: string;

  smtpHost?: string;
  smtpPort?: number;
  smtpEncryption?: SmtpEncryption;
  smtpUsername?: string;
  smtpPassword?: string;

  // Ticket Defaults
  defaultTeam?: string;
  defaultCategory?: string;
  defaultPriority?: 'Low' | 'Medium' | 'High' | 'Urgent';

  createdAt: string;
  updatedAt: string;
}

export interface EmailNotificationSettings {
  notifyOnAssign: boolean;
  notifyOnSlaBreach: boolean;
  notifyOnCustomerReply: boolean;
  dailyDigest: boolean;
  forwardCustomerEmailAttachments: boolean;
}
