import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Info } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthFormCard } from '../components/AuthFormCard';
import { AuthPageHeader } from '../components/AuthPageHeader';
import { PasswordInput } from '../components/PasswordInput';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { Button } from '@/components/ui/Button';
import { validateResetPasswordForm, calculatePasswordStrength } from '../schemas/authValidation';
import type { ResetPasswordFormValues, FormErrors } from '../types/auth.types';

export const ResetPasswordPage: React.FC = () => {
  const [values, setValues] = useState<ResetPasswordFormValues>({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors<ResetPasswordFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);

  const passwordStrength = useMemo(
    () => calculatePasswordStrength(values.newPassword),
    [values.newPassword],
  );

  const handleChange =
    (field: keyof ResetPasswordFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (submitNotice) {
        setSubmitNotice(null);
      }
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitNotice(null);

    const validationErrors = validateResetPasswordForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reset request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitNotice(
        'Password reset is not connected yet. Backend token verification and password updates will be implemented later.',
      );
      // Explicitly clear sensitive state from memory, do NOT persist to storage
      setValues({ newPassword: '', confirmPassword: '' });
    }, 600);
  };

  return (
    <AuthLayout maxWidth="md">
      <div className="space-y-6">
        <AuthPageHeader
          title="Create a new password"
          description="Choose a strong password for your Resolyx account."
        />

        <AuthFormCard>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* New Password Field */}
            <div className="space-y-3">
              <PasswordInput
                id="reset-new-password"
                label="New Password"
                placeholder="••••••••••••"
                autoComplete="new-password"
                value={values.newPassword}
                onChange={handleChange('newPassword')}
                error={errors.newPassword}
                disabled={isSubmitting}
                leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
              />

              {/* Password Strength Meter */}
              {values.newPassword && (
                <div className="pt-1">
                  <PasswordStrengthMeter strength={passwordStrength} />
                </div>
              )}
            </div>

            {/* Confirm New Password Field */}
            <PasswordInput
              id="reset-confirm-password"
              label="Confirm New Password"
              placeholder="••••••••••••"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              disabled={isSubmitting}
              leftIcon={<Lock className="h-4 w-4" aria-hidden="true" />}
            />

            {/* Submit Prototype Banner */}
            {submitNotice && (
              <div
                role="status"
                className="rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 p-3.5 flex items-start gap-2.5 animate-in fade-in duration-200"
              >
                <Info className="h-4 w-4 text-brand-indigo shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-0.5 text-xs">
                  <p className="font-semibold text-foreground">Frontend Prototype Notice</p>
                  <p className="text-foreground-muted leading-relaxed">{submitNotice}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center"
              >
                Update Password
              </Button>
            </div>

            {/* Navigation back to Sign In */}
            <div className="pt-4 border-t border-border flex items-center justify-center text-xs">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 font-medium text-foreground-muted hover:text-foreground hover:underline transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        </AuthFormCard>
      </div>
    </AuthLayout>
  );
};
