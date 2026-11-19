/**
 * Resolyx Authentication Types
 * Strict frontend-only types for enterprise authentication screens and forms.
 */

export type UserRole = 'admin' | 'team_lead' | 'support_agent';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SuperAdminLoginFormValues {
  email: string;
  password: string;
  rememberDevice: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong';

export interface PasswordStrength {
  score: number; // 0 to 3
  level: PasswordStrengthLevel;
  label: string;
  feedback: string[];
  meetsMinLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

export type VerificationStatus = 'pending' | 'success' | 'failed' | 'unavailable';

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MockAuthNotice {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}
