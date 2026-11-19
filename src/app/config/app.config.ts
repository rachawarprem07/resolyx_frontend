import { PRODUCT_NAME, PRODUCT_SUBTITLE, BRAND_TAGLINE, BRAND_ASSET_PATHS } from '@/lib/constants';

export const appConfig = {
  name: PRODUCT_NAME,
  subtitle: PRODUCT_SUBTITLE,
  tagline: BRAND_TAGLINE,
  description:
    'Private AI. Smarter Support. Manage IT and customer support tickets with AI running on company-controlled infrastructure.',
  version: '0.1.0',
  brandLogoPath: import.meta.env.VITE_BRAND_LOGO_PATH || BRAND_ASSET_PATHS.logo,
  supportEmail: 'support@resolyx.local',
  links: {
    github: 'https://github.com',
    docs: '/#docs',
  },
} as const;
