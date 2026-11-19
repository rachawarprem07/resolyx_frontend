import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { AuthFormCard } from '../components/AuthFormCard';
import { AuthPageHeader } from '../components/AuthPageHeader';
import { AuthInput } from '../components/AuthInput';
import { Button } from '@/components/ui/Button';
import { validateForgotPasswordForm } from '../schemas/authValidation';
import type { ForgotPasswordFormValues, FormErrors } from '../types/auth.types';

export const ForgotPasswordPage: React.FC = () => {
  const [values, setValues] = useState<ForgotPasswordFormValues>({
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors<ForgotPasswordFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ email: e.target.value });
    if (errors.email) {
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForgotPasswordForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate recovery request dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <AuthLayout maxWidth="md">
      <div className="space-y-6">
        <AuthPageHeader
          title="Forgot your password?"
          description="Enter the email address associated with your account. We'll help you get back into Resolyx."
        />

        <AuthFormCard>
          {isSubmitted ? (
            /* Confirmation State */
            <div className="space-y-6 text-center py-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo">
                <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Request Received
                </h2>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  If password recovery is configured for your account, you'll receive the next
                  steps. Email delivery is not connected in this frontend prototype.
                </p>
              </div>

              <div className="rounded-xl bg-surface-subtle border border-border p-3.5 text-left flex items-start gap-2.5">
                <Info className="h-4 w-4 text-brand-indigo shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-foreground-muted leading-relaxed">
                  <strong className="font-semibold text-foreground">Frontend Prototype:</strong> No
                  outbound emails are sent. In production, a secure cryptographic single-use token
                  will be transmitted.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button variant="primary" size="lg" href="/login" className="w-full justify-center">
                  Return to Sign In
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setValues({ email: '' });
                  }}
                  className="text-xs text-foreground-muted hover:text-foreground transition-colors cursor-pointer py-1"
                >
                  Try another email address
                </button>
              </div>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <AuthInput
                id="recovery-email"
                type="email"
                label="Work Email"
                placeholder="agent@company.com"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isSubmitting}
                leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
                hint="We will verify if an account exists for this domain."
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full justify-center"
                >
                  Continue
                </Button>
              </div>

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
          )}
        </AuthFormCard>
      </div>
    </AuthLayout>
  );
};
