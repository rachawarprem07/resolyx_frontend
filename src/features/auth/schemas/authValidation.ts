import type {
  FormErrors,
  LoginFormValues,
  SuperAdminLoginFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  PasswordStrength,
} from '../types/auth.types';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates standard email address string
 */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validates password input presence
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }
  return null;
}

/**
 * Calculates password strength based on length, digits, and uppercase letters
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      label: 'Enter a password',
      feedback: ['At least 8 characters', 'Contains a number', 'Contains an uppercase letter'],
      meetsMinLength: false,
      hasNumber: false,
      hasUppercase: false,
    };
  }

  const meetsMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  let score = 0;
  if (meetsMinLength) score += 1;
  if (hasNumber) score += 1;
  if (hasUppercase) score += 1;

  const feedback: string[] = [];
  if (!meetsMinLength) feedback.push('At least 8 characters');
  if (!hasNumber) feedback.push('Contains a number');
  if (!hasUppercase) feedback.push('Contains an uppercase letter');

  let level: 'weak' | 'medium' | 'strong' = 'weak';
  let label = 'Weak password';

  if (score === 3) {
    level = 'strong';
    label = 'Strong password';
  } else if (score === 2) {
    level = 'medium';
    label = 'Moderate password';
  }

  return {
    score,
    level,
    label,
    feedback,
    meetsMinLength,
    hasNumber,
    hasUppercase,
  };
}

/**
 * Validates Standard Login Form
 */
export function validateLoginForm(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

/**
 * Validates Admin Login Form
 */
export function validateSuperAdminLoginForm(
  values: SuperAdminLoginFormValues,
): FormErrors<SuperAdminLoginFormValues> {
  const errors: FormErrors<SuperAdminLoginFormValues> = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

/**
 * Validates Forgot Password Form
 */
export function validateForgotPasswordForm(
  values: ForgotPasswordFormValues,
): FormErrors<ForgotPasswordFormValues> {
  const errors: FormErrors<ForgotPasswordFormValues> = {};
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  return errors;
}

/**
 * Validates Reset Password Form
 */
export function validateResetPasswordForm(
  values: ResetPasswordFormValues,
): FormErrors<ResetPasswordFormValues> {
  const errors: FormErrors<ResetPasswordFormValues> = {};

  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters long';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your new password';
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}
