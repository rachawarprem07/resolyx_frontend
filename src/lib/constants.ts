/**
 * Resolyx Product Constants — Locked Identity
 */
export const PRODUCT_NAME = 'Resolyx';
export const PRODUCT_SUBTITLE = 'AI Helpdesk';
export const BRAND_TAGLINE = 'Private AI. Smarter Support.';

export const BRAND_ASSET_PATHS = {
  logo: '/brand/resolyx-dark.png',
  logoDark: '/brand/resolyx-dark.png',
  logoLight: '/brand/resolyx-light.png',
  logoTransparent: '/brand/resolyx-dark.png',
  symbol: '/brand/resolyx-symbol.png',
  symbolSvg: '/favicon.svg',
} as const;

export const THEME_STORAGE_KEY = 'resolyx-theme';

export const ROUTES = {
  home: '/',
  product: '/#product',
  solutions: '/#solutions',
  privateAi: '/#private-ai',
  resources: '/#resources',
  pricing: '/#pricing',
  faq: '/#faq',
  signIn: '/auth/signin',
  getStarted: '/get-started',
} as const;
