import type { EmailServiceProvider } from '../../types/email.types';

export interface ProviderItem {
  id: EmailServiceProvider;
  name: string;
}

export const PROVIDER_LIST: ProviderItem[] = [
  { id: 'gmail', name: 'GMail' },
];
