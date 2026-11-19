/**
 * General Workspace Settings Store
 *
 * Manages workspace-wide configuration such as Customer Self-Signup enablement,
 * OTP verification requirements, and access policies.
 */

export interface GeneralSettings {
  customerSignupEnabled: boolean;
  requireOtpVerification: boolean;
  allowCustomerPortalAccess: boolean;
  autoApproveSignups: boolean;
  workspaceName?: string;
}

const SETTINGS_KEY = 'resolyx_general_settings';

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  customerSignupEnabled: false, // Default is Admin-only invite; toggle in Settings > General to enable
  requireOtpVerification: true,
  allowCustomerPortalAccess: true,
  autoApproveSignups: true,
  workspaceName: 'Resolyx Helpdesk',
};

/**
 * Retrieve current workspace general settings from localStorage with fallback defaults.
 */
export function getGeneralSettings(): GeneralSettings {
  if (typeof window === 'undefined') return DEFAULT_GENERAL_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_GENERAL_SETTINGS,
        ...parsed,
      };
    }
  } catch {
    // Return fallback defaults on error
  }
  return DEFAULT_GENERAL_SETTINGS;
}

/**
 * Save updated general settings and broadcast change event to active listeners.
 */
export function saveGeneralSettings(
  partial: Partial<GeneralSettings>
): GeneralSettings {
  const current = getGeneralSettings();
  const updated: GeneralSettings = {
    ...current,
    ...partial,
  };

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<GeneralSettings>('resolyx_general_settings_changed', {
          detail: updated,
        })
      );
    }
  } catch (err) {
    console.error('Failed to save general settings to localStorage', err);
  }

  return updated;
}

/**
 * React hook / listener subscription helper for real-time reactive updates.
 */
export function subscribeGeneralSettings(
  callback: (settings: GeneralSettings) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<GeneralSettings>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getGeneralSettings());
    }
  };

  window.addEventListener('resolyx_general_settings_changed', handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener('resolyx_general_settings_changed', handler);
    window.removeEventListener('storage', handler);
  };
}
