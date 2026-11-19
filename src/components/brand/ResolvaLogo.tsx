import React, { useState } from 'react';
import { BrandMark } from './BrandMark';
import { cn } from '@/lib/utils';
import { PRODUCT_NAME, PRODUCT_SUBTITLE, BRAND_ASSET_PATHS } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';

export interface ResolvaLogoProps {
  /**
   * Optional custom image source. If omitted, uses active theme logo or custom logo from settings.
   * If passed as empty string '', forces high-fidelity vector SVG fallback.
   */
  imageSrc?: string;
  layout?: 'horizontal' | 'stacked' | 'symbol-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'adaptive' | 'dark-surface' | 'light-surface';
  showSubtitle?: boolean;
  className?: string;
  imageClassName?: string;
}

export const ResolvaLogo: React.FC<ResolvaLogoProps> = ({
  imageSrc,
  layout = 'horizontal',
  size = 'md',
  variant = 'adaptive',
  showSubtitle = true,
  className,
  imageClassName,
}) => {
  const { theme, customLogoUrl } = useTheme();
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  // If imageSrc is explicitly passed as empty string '', force vector fallback
  const isExplicitlyEmpty = imageSrc === '';
  const isLight = variant === 'light-surface' || (variant === 'adaptive' && theme === 'light');
  const defaultThemeLogo = isLight ? BRAND_ASSET_PATHS.logoLight : BRAND_ASSET_PATHS.logoDark;
  const activeImageSrc = isExplicitlyEmpty ? '' : (imageSrc || customLogoUrl || defaultThemeLogo);
  const shouldUseImage = Boolean(activeImageSrc) && !imageFailed;

  const sizeStyles = {
    sm: { markSize: 32, text: 'text-lg', subtitle: 'text-[10px]', imgHeight: 'h-10 max-h-10' },
    md: { markSize: 40, text: 'text-xl', subtitle: 'text-xs', imgHeight: 'h-12 max-h-12' },
    lg: { markSize: 48, text: 'text-2xl', subtitle: 'text-sm', imgHeight: 'h-14 sm:h-16 max-h-16' },
    xl: { markSize: 60, text: 'text-3xl', subtitle: 'text-base', imgHeight: 'h-20 max-h-20' },
  }[size];

  const wordmarkColorClass = {
    adaptive: 'text-foreground',
    'dark-surface': 'text-white',
    'light-surface': 'text-slate-black',
  }[variant];

  if (layout === 'symbol-only') {
    if (customLogoUrl && !imageFailed) {
      return (
        <img
          src={customLogoUrl}
          alt={PRODUCT_NAME}
          className={cn('object-contain', className)}
          style={{ width: sizeStyles.markSize, height: sizeStyles.markSize }}
          onError={() => setImageFailed(true)}
        />
      );
    }
    return <BrandMark size={sizeStyles.markSize} className={className} />;
  }

  return (
    <div
      className={cn(
        'group flex items-center select-none',
        layout === 'stacked' ? 'flex-col text-center gap-2' : 'flex-row gap-3',
        className,
      )}
    >
      {shouldUseImage ? (
        <img
          src={activeImageSrc}
          alt={`${PRODUCT_NAME} — ${PRODUCT_SUBTITLE}`}
          className={cn(
            'object-contain transition-opacity duration-200',
            sizeStyles.imgHeight,
            imageClassName,
          )}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <>
          <BrandMark size={sizeStyles.markSize} />
          <div className="flex flex-col leading-none">
            <span
              className={cn(
                'font-bold tracking-tight transition-colors duration-150',
                sizeStyles.text,
                wordmarkColorClass,
              )}
            >
              {PRODUCT_NAME}
            </span>
            {showSubtitle && (
              <span
                className={cn(
                  'font-medium tracking-wider uppercase text-cyan-500 dark:text-cyan-400 mt-1',
                  sizeStyles.subtitle,
                )}
              >
                {PRODUCT_SUBTITLE}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const ResolyxLogo = ResolvaLogo;
export type ResolyxLogoProps = ResolvaLogoProps;
