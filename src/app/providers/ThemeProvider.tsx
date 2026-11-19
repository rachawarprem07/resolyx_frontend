import React, { useEffect, useState, useMemo } from 'react';
import type { Theme } from '@/types/common';
import { THEME_STORAGE_KEY } from '@/lib/constants';
import { hexToRgb, adjustBrightness } from '@/lib/colorUtils';
import { ThemeContext } from './ThemeContext';

const PRIMARY_COLOR_KEY = 'resolyx-primary-color';
const CUSTOM_LOGO_KEY = 'resolyx-custom-logo';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved =
      (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ||
      (localStorage.getItem('resolva-theme') as Theme | null);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  } catch {
    return 'dark';
  }
}

function getInitialPrimaryColor(): string {
  if (typeof window === 'undefined') return '#6366F1';
  try {
    return (
      localStorage.getItem(PRIMARY_COLOR_KEY) ||
      localStorage.getItem('resolva-primary-color') ||
      '#6366F1'
    );
  } catch {
    return '#6366F1';
  }
}

function getInitialCustomLogo(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return (
      localStorage.getItem(CUSTOM_LOGO_KEY) || localStorage.getItem('resolva-custom-logo') || null
    );
  } catch {
    return null;
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => defaultTheme || getInitialTheme());
  const [primaryColor, setPrimaryColorState] = useState<string>(getInitialPrimaryColor);
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | null>(getInitialCustomLogo);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const rgb = hexToRgb(primaryColor);
    const hoverHex = adjustBrightness(primaryColor, -15);
    const hoverRgb = hexToRgb(hoverHex);

    root.style.setProperty('--brand-indigo', primaryColor);
    root.style.setProperty('--brand-indigo-rgb', rgb);
    root.style.setProperty('--brand-indigo-hover', hoverHex);
    root.style.setProperty('--brand-indigo-hover-rgb', hoverRgb);
    root.style.setProperty('--brand-indigo-subtle', `rgba(${rgb.split(' ').join(', ')}, 0.12)`);
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-primary-hover', hoverHex);
    root.style.setProperty('--color-border-focus', primaryColor);

    try {
      localStorage.setItem(PRIMARY_COLOR_KEY, primaryColor);
    } catch {
      // ignore
    }
  }, [primaryColor]);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const setPrimaryColor = React.useCallback((color: string) => {
    setPrimaryColorState(color);
  }, []);

  const setCustomLogoUrl = React.useCallback((url: string | null) => {
    setCustomLogoUrlState(url);
    try {
      if (url) {
        localStorage.setItem(CUSTOM_LOGO_KEY, url);
      } else {
        localStorage.removeItem(CUSTOM_LOGO_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      primaryColor,
      setPrimaryColor,
      customLogoUrl,
      setCustomLogoUrl,
    }),
    [theme, toggleTheme, setTheme, primaryColor, setPrimaryColor, customLogoUrl, setCustomLogoUrl],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
