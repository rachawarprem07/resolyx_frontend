/**
 * Color utility functions for dynamic brand theme customization
 */

export function normalizeHex(hex: string): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return '#' + (clean.length === 6 ? clean : '6366F1');
}

export function hexToRgb(hex: string): string {
  const norm = normalizeHex(hex).replace('#', '');
  const r = parseInt(norm.substring(0, 2), 16) || 0;
  const g = parseInt(norm.substring(2, 4), 16) || 0;
  const b = parseInt(norm.substring(4, 6), 16) || 0;
  return `${r} ${g} ${b}`;
}

export function adjustBrightness(hex: string, percent: number): string {
  const norm = normalizeHex(hex).replace('#', '');
  const num = parseInt(norm, 16) || 0;
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export interface BrandColorPreset {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export const BRAND_COLOR_PRESETS: BrandColorPreset[] = [
  { id: 'indigo', name: 'Electric Indigo', hex: '#6366F1', description: 'Resolyx Signature' },
  { id: 'violet', name: 'Vivid Violet', hex: '#8B5CF6', description: 'Modern AI' },
  { id: 'cyan', name: 'Ocean Cyan', hex: '#06B6D4', description: 'High Contrast' },
  { id: 'emerald', name: 'Emerald Green', hex: '#10B981', description: 'Fresh & Trust' },
  { id: 'amber', name: 'Sunset Amber', hex: '#F59E0B', description: 'Warm Energy' },
  { id: 'rose', name: 'Crimson Rose', hex: '#F43F5E', description: 'Bold & Dynamic' },
  { id: 'blue', name: 'Corporate Blue', hex: '#2563EB', description: 'Enterprise' },
];

/**
 * Excel / Office 10-column Theme Colors Matrix with shades
 */
export const EXCEL_THEME_COLUMNS = [
  {
    name: 'White / Gray',
    shades: ['#FFFFFF', '#F2F2F2', '#D9D9D9', '#BFBFBF', '#A6A6A6', '#7F7F7F'],
  },
  {
    name: 'Black / Dark',
    shades: ['#000000', '#595959', '#3F3F3F', '#262626', '#1A1A1A', '#0D0D0D'],
  },
  {
    name: 'Warm Slate',
    shades: ['#475569', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#64748B', '#334155'],
  },
  {
    name: 'Navy Blue',
    shades: ['#1E3A8A', '#EFF6FF', '#DBEAFE', '#93C5FD', '#2563EB', '#172554'],
  },
  {
    name: 'Electric Indigo',
    shades: ['#6366F1', '#EEF2FF', '#C7D2FE', '#818CF8', '#4F46E5', '#312E81'],
  },
  {
    name: 'Ocean Cyan',
    shades: ['#06B6D4', '#ECFEFF', '#A5F3FC', '#67E8F9', '#0891B2', '#164E63'],
  },
  {
    name: 'Emerald Green',
    shades: ['#10B981', '#ECFDF5', '#A7F3D0', '#34D399', '#059669', '#064E3B'],
  },
  {
    name: 'Purple Violet',
    shades: ['#8B5CF6', '#F5F3FF', '#DDD6FE', '#A78BFA', '#7C3AED', '#4C1D95'],
  },
  {
    name: 'Sunset Amber',
    shades: ['#F59E0B', '#FFFBEB', '#FDE68A', '#FBBF24', '#D97706', '#78350F'],
  },
  {
    name: 'Crimson Rose',
    shades: ['#F43F5E', '#FFF1F2', '#FECDD3', '#FB7185', '#E11D48', '#881337'],
  },
];

export const EXCEL_STANDARD_COLORS = [
  '#C00000', // Dark Red
  '#FF0000', // Red
  '#FFC000', // Orange
  '#FFFF00', // Yellow
  '#92D050', // Light Green
  '#00B050', // Green
  '#00B0F0', // Light Blue
  '#0070C0', // Blue
  '#002060', // Dark Blue
  '#7030A0', // Purple
];
