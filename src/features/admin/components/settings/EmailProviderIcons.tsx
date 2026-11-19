import React from 'react';
import type { EmailServiceProvider } from '../../types/email.types';

export const GmailIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.66,0,3-1.34,3-3V16.2z" />
    <path fill="#1e88e5" d="M3,16.2l5,2.75l5,4.75L13,40H6c-1.66,0-3-1.34-3-3V16.2z" />
    <polygon fill="#e53935" points="35,11.2 24,19.5 13,11.2 13,23.7 24,32 35,23.7" />
    <path fill="#c62828" d="M3,12.2v4l10,7.5V11.2l-7.3-5.5C4.4,4.7,3,5.6,3,7.2V12.2z" />
    <path fill="#fbc02d" d="M45,12.2v4l-10,7.5V11.2l7.3-5.5c1.3-1,2.7-0.1,2.7,1.5V12.2z" />
  </svg>
);

export const OutlookIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 48 48">
    <path fill="#0078d4" d="M28 8h14c1.1 0 2 .9 2 2v28c0 1.1-.9 2-2 2H28V8z" />
    <path fill="#106ebe" d="M28 14h13c.6 0 1 .4 1 1v18c0 .6-.4 1-1 1H28V14z" />
    <path fill="#005a9e" d="M28 20h11c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H28V20z" />
    <rect x="4" y="11" width="22" height="26" rx="4" fill="#0078d4" />
    <circle cx="15" cy="24" r="6" fill="none" stroke="#ffffff" strokeWidth="2.5" />
  </svg>
);

export const SendgridIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 32 32">
    <rect x="18" y="4" width="10" height="10" rx="1.5" fill="#009DD9" />
    <rect x="4" y="18" width="10" height="10" rx="1.5" fill="#009DD9" />
    <rect x="18" y="18" width="10" height="10" rx="1.5" fill="#1A82E2" />
    <rect x="11" y="11" width="10" height="10" rx="1.5" fill="#36B0EE" />
  </svg>
);

export const SparkPostIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C12 2 13.5 5.5 13.5 8C13.5 9 14.5 10 15.5 9C17.5 11 18.5 13.5 18.5 16C18.5 19.59 15.59 22.5 12 22.5C8.41 22.5 5.5 19.59 5.5 16C5.5 12.5 8 9 9.5 6C10 7.5 11.5 8.5 12 7.5C12.5 6.5 12 2 12 2Z"
      fill="#FA6423"
    />
    <path
      d="M12 11C11.5 12.5 10 13.5 10 15C10 16.1 10.9 17 12 17C13.1 17 14 16.1 14 15C14 13.5 12.5 12.5 12 11Z"
      fill="#FFB03A"
    />
  </svg>
);

export const YahooIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 32 32">
    <rect width="32" height="32" rx="7" fill="#6001D2" />
    <text x="8" y="22" fill="#FFFFFF" fontSize="16" fontWeight="bold" fontFamily="system-ui, sans-serif">
      y!
    </text>
  </svg>
);

export const YandexIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    <path d="M11 7h4l3.8 8L23 7h4l-6 12V25h-4v-6L11 7z" fill="#FC3F1D" />
  </svg>
);

export const FrappeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#0066FF" />
    <path
      d="M9 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.8"
    />
    <path
      d="M8.5 11.5l7.5 5 7.5-5"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CustomMailIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ProviderIcon: React.FC<{ provider: EmailServiceProvider; className?: string }> = ({
  provider,
  className = 'w-6 h-6',
}) => {
  switch (provider) {
    case 'gmail':
      return <GmailIcon className={className} />;
    case 'outlook':
      return <OutlookIcon className={className} />;
    case 'sendgrid':
      return <SendgridIcon className={className} />;
    case 'sparkpost':
      return <SparkPostIcon className={className} />;
    case 'yahoo':
      return <YahooIcon className={className} />;
    case 'yandex':
      return <YandexIcon className={className} />;
    case 'frappe':
      return <FrappeIcon className={className} />;
    case 'custom':
    default:
      return <CustomMailIcon className={className} />;
  }
};
